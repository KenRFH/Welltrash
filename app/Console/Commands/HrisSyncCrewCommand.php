<?php

namespace App\Console\Commands;

use App\Services\HrisService;
use Illuminate\Console\Command;

class HrisSyncCrewCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hris:sync-crew {--dry-run : Only test HRIS connection without writing to DB}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Synchronize active CleanUP crew and employee accounts from HRIS (Single Source of Truth)';

    /**
     * Execute the console command.
     */
    public function handle(HrisService $hrisService): int
    {
        $this->info('Memulai sinkronisasi akun dari HRIS (Single Source of Truth)...');

        if (!$hrisService->isConfigured()) {
            $this->error('HRIS API URL atau HRIS API KEY belum diatur di .env');
            return Command::FAILURE;
        }

        try {
            $result = $hrisService->syncCrew();

            $this->info("Sinkronisasi selesai! Total: {$result['total']} | Dibuat: {$result['created']} | Diperbarui: {$result['updated']}");

            $tableRows = array_map(function ($c) {
                return [
                    $c['id'],
                    $c['employee_code'] ?? '-',
                    $c['name'],
                    $c['email'],
                    $c['role'],
                    $c['is_active'] ? 'Aktif' : 'Nonaktif',
                    $c['action'],
                ];
            }, $result['crew'] ?? []);

            $this->table(
                ['ID', 'Kode Karyawan', 'Nama', 'Email', 'Role', 'Status', 'Aksi'],
                $tableRows
            );

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Gagal sinkronisasi dengan HRIS: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
