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
