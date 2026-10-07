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

        $startDate = \Carbon\Carbon::today();
        $endDate = \Carbon\Carbon::today()->addDays($daysAhead);

        foreach ($companies as $company) {
            $schedule = $company->pickup_schedule ?? [];
            if (empty($schedule)) continue;

            // Fetch all existing pickup dates within the range in a single query
            $existingDates = \App\Models\Pickup::where('company_id', $company->id)
                ->whereBetween('pickup_date', [$startDate->toDateString(), $endDate->toDateString()])
                ->pluck('pickup_date')
                ->map(fn($d) => \Carbon\Carbon::parse($d)->toDateString())
                ->flip()
                ->toArray();

            $newPickups = [];

            // Generate dates from today up to $daysAhead
            for ($i = 0; $i <= $daysAhead; $i++) {
                $date = \Carbon\Carbon::today()->addDays($i);
                $dayIndo = $englishToIndo[$date->englishDayOfWeek] ?? null;
                $dateStr = $date->toDateString();

                // If this day matches their schedule and does not exist yet
                if ($dayIndo && in_array($dayIndo, $schedule) && !isset($existingDates[$dateStr])) {
                    $newPickups[] = [
                        'company_id' => $company->id,
                        'pickup_date' => $dateStr,
                        'status' => 'scheduled',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                    $existingDates[$dateStr] = true;
                    $pickupsCreated++;
                }
            }

            if (!empty($newPickups)) {
                \App\Models\Pickup::insert($newPickups);
            }
        }

        $this->info("Successfully generated {$pickupsCreated} new scheduled pickups.");
    }
}
