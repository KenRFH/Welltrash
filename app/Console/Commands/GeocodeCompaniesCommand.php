<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Company;
use App\Http\Controllers\AdminController;

class GeocodeCompaniesCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'companies:geocode {--force : Re-geocode all companies even if coordinates already exist}';

    /**
     * The console command description.
     */
    protected $description = 'Geocode companies addresses in Jember into GPS latitude and longitude';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $force = (bool) $this->option('force');

        $query = Company::whereNotNull('address')->where('address', '!=', '');
        if (! $force) {
            $query->where(function ($q) {
                $q->whereNull('latitude')
                  ->orWhereNull('longitude')
                  ->orWhere('latitude', 0);
            });
        }

        $companies = $query->get();

        if ($companies->isEmpty()) {
            $this->info('Semua data mitra sudah memiliki koordinat GPS yang valid.');
            return Command::SUCCESS;
        }

        $this->info("Menemukan {$companies->count()} mitra untuk sinkronisasi koordinat GPS...");

        $updated = 0;
        foreach ($companies as $c) {
            [$lat, $lng] = AdminController::resolveCompanyCoordinates($c->address, $c->id);

            if ($lat !== null && $lng !== null) {
                $c->update([
                    'latitude'  => $lat,
                    'longitude' => $lng,
                ]);

                $this->line(" <info>✔</info> [ID {$c->id}] {$c->company_name} -> Lat: {$lat}, Lng: {$lng}");
                $updated++;
            } else {
                $this->warn(" <comment>⚠</comment> [ID {$c->id}] {$c->company_name} gagal mendapatkan koordinat.");
            }
        }

        $this->info("Selesai! {$updated} lokasi mitra berhasil disinkronisasi ke titik koordinat GPS.");
        return Command::SUCCESS;
    }
}
