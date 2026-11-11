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
    protected $signature = 'companies:geocode {--force : Re-geocode semua mitra yang koordinatnya bukan hasil input manual admin}';

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

        $query = Company::whereNotNull('address')
            ->where('address', '!=', '')
            ->where(function ($q) {
                // Koordinat yang di-set manual oleh admin tidak pernah ditimpa
                $q->whereNull('coordinates_source')->orWhere('coordinates_source', '!=', 'manual');
            });
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
        foreach ($companies as $i => $c) {
            if ($i > 0) {
                sleep(1); // kebijakan Nominatim: maksimal 1 request/detik
            }

            [$lat, $lng] = AdminController::resolveCompanyCoordinates($c->address);

            if ($lat !== null && $lng !== null) {
                $c->update([
                    'latitude'           => $lat,
                    'longitude'          => $lng,
                    'coordinates_source' => 'geocoded',
                ]);

                $this->line(" <info>✔</info> [ID {$c->id}] {$c->company_name} -> Lat: {$lat}, Lng: {$lng}");
                $updated++;
            } else {
                $this->warn(" <comment>⚠</comment> [ID {$c->id}] {$c->company_name} alamat tidak ditemukan — set manual lewat peta monitoring.");
            }
        }

        $this->info("Selesai! {$updated} lokasi mitra berhasil disinkronisasi ke titik koordinat GPS.");
        return Command::SUCCESS;
    }
}
