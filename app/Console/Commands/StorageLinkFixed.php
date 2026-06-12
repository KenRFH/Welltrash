<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class StorageLinkFixed extends Command
{
    protected $signature = 'storage:link-fix';
    protected $description = 'Buat symlink storage dengan path absolut (fix untuk shared hosting)';

    public function handle(): int
    {
        $target = storage_path('app/public');
        $link   = public_path('storage');

        $this->info("Target : {$target}");
        $this->info("Link   : {$link}");

        // Buat target jika belum ada
        if (!is_dir($target)) {
            mkdir($target, 0775, true);
            $this->info("✅ Folder target dibuat: {$target}");
        }

        // Hapus symlink/folder lama jika ada tapi rusak
        if (is_link($link)) {
            unlink($link);
            $this->warn("⚠️  Symlink lama dihapus.");
        } elseif (is_dir($link)) {
            $this->error("❌ {$link} sudah ada sebagai folder nyata, bukan symlink. Hapus manual dulu.");
            return self::FAILURE;
        }

        // Buat symlink
        if (symlink($target, $link)) {
            $this->info("✅ Symlink berhasil dibuat: {$link} → {$target}");
            return self::SUCCESS;
        }

        // Fallback: coba via exec
        $this->warn("symlink() gagal, mencoba via exec ln -s ...");
        exec("ln -s " . escapeshellarg($target) . " " . escapeshellarg($link), $out, $code);

        if ($code === 0) {
            $this->info("✅ Symlink berhasil via exec.");
            return self::SUCCESS;
        }

        $this->error("❌ Gagal membuat symlink. Hosting mungkin memblokir symlink.");
        $this->line("   Solusi: buat folder <public/storage> manual lalu hubungkan via .htaccess.");
        return self::FAILURE;
    }
}
