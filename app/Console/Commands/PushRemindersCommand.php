<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\User;
use App\Services\FcmService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

/** Scheduled push reminders for the admin app: invoices due (daily) and crew gone silent (every 15 min). */
class PushRemindersCommand extends Command
{
    protected $signature = 'push:reminders {type : invoices|fleet} {--offline-minutes=30}';

    protected $description = 'Kirim notifikasi pengingat (invoice jatuh tempo / armada offline) ke admin';

    public function handle(FcmService $fcm): int
    {
        if (!$fcm->isConfigured()) {
            $this->warn('FCM belum dikonfigurasi (services.fcm.credentials): tidak ada notifikasi dikirim.');
            return Command::SUCCESS;
        }

        return match ($this->argument('type')) {
            'invoices' => $this->invoices($fcm),
            'fleet'    => $this->fleet($fcm),
            default    => $this->invalid(),
        };
    }

    private function invoices(FcmService $fcm): int
    {
        $today = Carbon::today();
        $dueToday = Invoice::where('status', 'unpaid')->whereDate('due_date', $today)->count();
        $overdue = Invoice::where('status', 'unpaid')->whereDate('due_date', '<', $today)->count();
        if (!$dueToday && !$overdue) {
            $this->info('Tidak ada invoice jatuh tempo.');
            return Command::SUCCESS;
        }

        $body = collect([$dueToday ? "{$dueToday} jatuh tempo hari ini" : null, $overdue ? "{$overdue} sudah lewat jatuh tempo" : null])->filter()->implode(', ') . '.';
        $n = $fcm->toRoles(User::COMMERCIAL_ROLES, 'Invoice mitra belum lunas', $body, ['type' => 'invoices']);
        $this->info("Invoice: {$body} Terkirim ke {$n} perangkat.");

        return Command::SUCCESS;
    }

    private function fleet(FcmService $fcm): int
    {
        $limit = now()->subMinutes(max(5, (int) $this->option('offline-minutes')));
        $silent = User::where('role', 'CleanUP')
            // On shift: clocked in today and not clocked out.
            ->whereHas('attendances', fn ($q) => $q->whereDate('date', Carbon::today())->whereNotNull('clock_in_at')->whereNull('clock_out_at'))
            ->where(fn ($q) => $q->whereNull('last_location_at')->orWhere('last_location_at', '<', $limit))
            ->get(['id', 'name', 'last_location_at']);

        // One push per silence episode: the key changes only when the crew sends a new location.
        $new = $silent->filter(fn (User $u) => Cache::add(
            "push:fleet-offline:{$u->id}:" . ($u->last_location_at?->timestamp ?? 'none') . ':' . Carbon::today()->toDateString(),
            true,
            now()->endOfDay(),
        ));
        if ($new->isEmpty()) {
            $this->info("Armada offline: {$silent->count()} (sudah diberitahukan sebelumnya atau tidak ada).");
            return Command::SUCCESS;
        }

        $who = $new->map(fn (User $u) => $u->name . ' (' . ($u->last_location_at ? 'terakhir ' . $u->last_location_at->format('H.i') : 'belum ada lokasi') . ')')->implode(', ');
        $n = $fcm->toRoles(User::OPS_ROLES, 'Armada tidak mengirim lokasi', "{$who}. Cek di Live GPS.", ['type' => 'fleet']);
        $this->info("Armada offline baru: {$who}. Terkirim ke {$n} perangkat.");

        return Command::SUCCESS;
    }

    private function invalid(): int
    {
        $this->error('Jenis harus invoices atau fleet.');
        return Command::INVALID;
    }
}
