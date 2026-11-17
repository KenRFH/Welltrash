<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('pickups:generate')->daily();

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

// Bell history: keep 90 days
Schedule::call(fn () => \Illuminate\Support\Facades\DB::table('notifications')->where('created_at', '<', now()->subDays(90))->delete())
    ->daily()->name('notifications:prune');
