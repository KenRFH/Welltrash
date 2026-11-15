<?php

namespace App\Console\Commands;

use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Services\HrisService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class HrisPushAttendanceCommand extends Command
{
    protected $signature = 'hris:push-attendance {date? : Tanggal Y-m-d (default: hari ini)}';

    protected $description = 'Kirim ulang absensi aplikasi operator pada tanggal tertentu ke HRIS (aman diulang)';

    public function handle(HrisService $hrisService): int
    {
        if (!$hrisService->isConfigured()) {
            $this->error('HRIS API URL atau HRIS API KEY belum diatur di .env');
            return Command::FAILURE;
        }

        $date = Carbon::parse($this->argument('date') ?? 'today')->toDateString();
        $rows = Attendance::with('user:id,employee_code')->whereDate('date', $date)->get();

        $ok = $rows->filter(fn ($a) => $hrisService->pushAttendance($a))->count();
        $this->info("Absensi {$date}: {$ok}/{$rows->count()} terkirim ke HRIS.");

        $leaves = LeaveRequest::with('user:id,employee_code')->whereDate('date', $date)->where('status', '!=', 'pending')->get();
        $okLeave = $leaves->filter(fn ($l) => $hrisService->pushLeave($l))->count();
        $this->info("Izin/sakit {$date}: {$okLeave}/{$leaves->count()} terkirim ke HRIS.");

        return $ok === $rows->count() && $okLeave === $leaves->count() ? Command::SUCCESS : Command::FAILURE;
    }
}
