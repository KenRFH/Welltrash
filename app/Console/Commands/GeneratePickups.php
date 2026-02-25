<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class GeneratePickups extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'pickups:generate {--days=30 : Number of days ahead to generate} {--company= : Specific company ID to regenerate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate scheduled pickups for active companies based on their preferences';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $daysAhead = (int) $this->option('days');
        $companyId = $this->option('company');

        $query = \App\Models\Company::where('subscription_status', 'active');
        if ($companyId) {
            $query->where('id', $companyId);
        }

        $companies = $query->get();
        $this->info("Scanning {$companies->count()} active companies...");

        $englishToIndo = [
            'Monday' => 'Senin', 'Tuesday' => 'Selasa', 'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu', 'Sunday' => 'Minggu'
        ];

        $pickupsCreated = 0;

        foreach ($companies as $company) {
            $schedule = $company->pickup_schedule ?? [];
            if (empty($schedule)) continue;

            // Generate dates from today up to $daysAhead
            for ($i = 0; $i <= $daysAhead; $i++) {
                $date = \Carbon\Carbon::today()->addDays($i);
                $dayIndo = $englishToIndo[$date->englishDayOfWeek];

                // If this day matches their schedule
                if (in_array($dayIndo, $schedule)) {
                    // Check if it already exists to prevent duplicates
                    $exists = \App\Models\Pickup::where('company_id', $company->id)
                        ->whereDate('pickup_date', $date->toDateString())
                        ->exists();

                    if (!$exists) {
                        \App\Models\Pickup::create([
                            'company_id' => $company->id,
                            'pickup_date' => $date->toDateString(),
                            'status' => 'scheduled',
                        ]);
                        $pickupsCreated++;
                    }
                }
            }
        }

        $this->info("Successfully generated {$pickupsCreated} new scheduled pickups.");
    }
}
