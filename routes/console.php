<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Public pages + every activity; absolute URLs come from APP_URL.
Artisan::command('sitemap:generate', function () {
    $urls = array_map(fn ($r) => ['loc' => route($r)], ['beranda', 'about', 'services', 'activity', 'katalog', 'downloads']);
    foreach (\App\Models\Activity::all() as $activity) {
        $urls[] = ['loc' => route('activity.show', [$activity->id, $activity->slug]), 'lastmod' => $activity->updated_at?->toAtomString()];
    }
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as $u) {
        $xml .= '  <url><loc>' . htmlspecialchars($u['loc'], ENT_XML1) . '</loc>'
            . (empty($u['lastmod']) ? '' : '<lastmod>' . $u['lastmod'] . '</lastmod>') . "</url>\n";
    }
    file_put_contents(public_path('sitemap.xml'), $xml . "</urlset>\n");
    $this->info(count($urls) . ' URL ditulis ke public/sitemap.xml');
})->purpose('Generate public/sitemap.xml');

Schedule::command('sitemap:generate')->daily();

Schedule::command('pickups:generate')->daily();

// Close yesterday's unfinished pickups as "Tidak terambil" (see MarkMissedPickups)
Schedule::command('pickups:mark-missed')->dailyAt('00:05');

// Jaring pengaman: kirim ulang absensi hari ini ke HRIS bila push realtime sempat gagal
Schedule::command('hris:push-attendance')->dailyAt('23:50');

// Kirim WA invoice terjadwal — cek setiap menit
Schedule::command('invoices:send-wa')->everyMinute()->withoutOverlapping();

// Daily database backup into storage/app/backups, keeping 7 days (see BackupDatabase).
Schedule::command('db:backup')->dailyAt('02:30')->withoutOverlapping();

// Role & status aktif mengikuti HRIS tanpa menunggu login ulang (lihat HrisService::syncCrew)
Schedule::command('hris:sync-crew')->hourly()->withoutOverlapping();

// Push notifikasi ke aplikasi admin (lihat PushRemindersCommand)
Schedule::command('push:reminders invoices')->dailyAt('08:00');
Schedule::command('push:reminders fleet')->everyFifteenMinutes()->withoutOverlapping();
Schedule::command('push:reminders agendas')->everyMinute()->withoutOverlapping();
Schedule::command('push:reminders pickups')->dailyAt('15:00');

// Bell history: keep 90 days
Schedule::call(fn () => \Illuminate\Support\Facades\DB::table('notifications')->where('created_at', '<', now()->subDays(90))->delete())
    ->daily()->name('notifications:prune');
