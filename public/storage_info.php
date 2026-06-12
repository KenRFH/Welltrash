<?php
// ================================================================
// LETAKKAN FILE INI DI: public_html/storage_info.php
// Akses via browser: https://welltrash.com/storage_info.php
// HAPUS FILE INI SETELAH SELESAI!
// ================================================================

// Keamanan minimal - hapus setelah digunakan!
$secret = $_GET['key'] ?? '';
if ($secret !== 'welltrash_debug_2026') {
    die('Unauthorized. Tambahkan ?key=welltrash_debug_2026 ke URL');
}

echo "<pre style='font-family:monospace; padding:20px'>";
echo "=== PATH INFO ===\n\n";
echo "DOCUMENT_ROOT    : " . ($_SERVER['DOCUMENT_ROOT'] ?? 'N/A') . "\n";
echo "__DIR__          : " . __DIR__ . "\n";
echo "realpath(__DIR__): " . realpath(__DIR__) . "\n\n";

// Cari index.php Laravel
$indexPhp = __DIR__ . '/index.php';
echo "index.php ada    : " . (file_exists($indexPhp) ? 'YA' : 'TIDAK') . "\n\n";

// Cek apakah symlink storage sudah ada
$storagePath = __DIR__ . '/storage';
echo "public/storage   : ";
if (is_link($storagePath)) {
    echo "SYMLINK → " . readlink($storagePath) . "\n";
} elseif (is_dir($storagePath)) {
    echo "FOLDER BIASA (bukan symlink)\n";
} else {
    echo "TIDAK ADA\n";
}

echo "\n=== COMMAND YANG PERLU DIJALANKAN DI SSH ===\n\n";
$publicHtmlDir = realpath(__DIR__);
// Estimasi project root (satu level di atas public_html atau sejajar)
$homeDir = dirname($publicHtmlDir); // /home/welltras
echo "Perkiraan home dir: {$homeDir}\n\n";
echo "Coba perintah ini di SSH:\n";
echo "ln -s {$homeDir}/Welltrash/storage/app/public {$publicHtmlDir}/storage\n\n";
echo "(Sesuaikan nama folder 'Welltrash' jika berbeda)\n";
echo "</pre>";
