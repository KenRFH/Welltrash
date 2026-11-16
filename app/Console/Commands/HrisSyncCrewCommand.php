<?php

namespace App\Console\Commands;

use App\Services\HrisService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class HrisSyncCrewCommand extends Command
{
    protected $signature = 'hris:sync-crew';

    protected $description = 'Samakan akun, role dan status aktif karyawan dengan HRIS (aman diulang)';

    public function handle(HrisService $hrisService): int
    {
        if (!$hrisService->isConfigured()) {
            $this->error('HRIS API URL atau HRIS API KEY belum diatur di .env');
            return Command::FAILURE;
        }

        try {
            $r = $hrisService->syncCrew();
        } catch (\Throwable $e) {
            Log::warning('hris:sync-crew gagal: ' . $e->getMessage());
            $this->error('Sinkronisasi gagal, tidak ada data yang diubah: ' . $e->getMessage());
            return Command::FAILURE;
        }

        $this->info("HRIS: {$r['synced']} akun diproses ({$r['created']} baru, {$r['updated']} diperbarui, {$r['deactivated']} dinonaktifkan).");
        foreach ($r['skipped'] as $s) {
            $this->warn("Dilewati {$s['name']} ({$s['employee_code']}): {$s['reason']}");
            Log::warning("hris:sync-crew dilewati {$s['name']} ({$s['employee_code']}): {$s['reason']}");
        }

        return Command::SUCCESS;
    }
}
