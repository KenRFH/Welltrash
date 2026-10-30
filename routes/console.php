<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('pickups:generate')->daily();

// Kirim WA invoice terjadwal — cek setiap menit
Schedule::command('invoices:send-wa')->everyMinute()->withoutOverlapping();

// Sinkronisasi titik koordinat GPS mitra dari teks alamat
Artisan::command('companies:geocode {--force : Re-geocode all companies}', function () {
    $this->call(\App\Console\Commands\GeocodeCompaniesCommand::class, [
        '--force' => $this->option('force'),
    ]);
})->purpose('Geocode companies addresses in Jember into GPS latitude and longitude');


