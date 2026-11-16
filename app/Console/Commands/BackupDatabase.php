<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;

/**
 * Daily gzip'd mysqldump of this app's database into storage/app/backups (not web-served, git-ignored),
 * keeping the newest --keep days. The password goes through a 0600 options file, never the process list.
 */
class BackupDatabase extends Command
{
    protected $signature = 'db:backup {--keep=7 : Hari backup disimpan}';

    protected $description = 'Backup database aplikasi ini (mysqldump + gzip) dan hapus backup lama';

    public function handle(): int
    {
        $conn = config('database.connections.' . config('database.default'));
        if (($conn['driver'] ?? null) !== 'mysql') {
            $this->error('db:backup hanya untuk koneksi MySQL.');
            return self::FAILURE;
        }

        $dir = storage_path('app/backups');
        File::ensureDirectoryExists($dir, 0700);
        $file = "{$dir}/{$conn['database']}-" . now()->format('Ymd-His') . '.sql.gz';

        $options = tempnam(sys_get_temp_dir(), 'mydump');
        chmod($options, 0600);
        file_put_contents($options, "[client]\n" . collect([
            'user'     => $conn['username'] ?? null,
            'password' => $conn['password'] ?? null,
            'host'     => $conn['host'] ?? null,
            'port'     => $conn['port'] ?? null,
            'socket'   => $conn['unix_socket'] ?? null,
        ])->filter(fn ($v) => $v !== null && $v !== '')->map(fn ($v, $k) => "{$k}=\"" . addcslashes((string) $v, '"\\') . '"')->implode("\n") . "\n");

        try {
            $cmd = sprintf(
                '%s --defaults-extra-file=%s --single-transaction --quick --routines --triggers --no-tablespaces %s | gzip > %s',
                escapeshellarg(config('database.mysqldump', 'mysqldump')),
                escapeshellarg($options),
                escapeshellarg($conn['database']),
                escapeshellarg($file),
            );
            $result = Process::timeout(900)->run(['bash', '-o', 'pipefail', '-c', $cmd]);
        } finally {
            @unlink($options);
        }

        // A failed dump can still leave a tiny gzip header behind: never keep it as if it were a backup.
        if (!$result->successful() || !is_file($file) || filesize($file) < 100) {
            @unlink($file);
            $this->error('Backup gagal: ' . trim($result->errorOutput() ?: $result->output()));
            return self::FAILURE;
        }

        $keep = max(1, (int) $this->option('keep'));
        $pruned = collect(File::glob("{$dir}/{$conn['database']}-*.sql.gz"))
            ->filter(fn ($f) => File::lastModified($f) < now()->subDays($keep)->getTimestamp())
            ->each(fn ($f) => File::delete($f))
            ->count();

        $this->info(sprintf('Backup: %s (%.1f KB), %d backup lama dihapus.', basename($file), filesize($file) / 1024, $pruned));
        return self::SUCCESS;
    }
}
