<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\Pickup;
use Carbon\Carbon;

class CompanySeeder extends Seeder
{
    public function run(): void
    {
        $today = Carbon::today()->toDateString();
        $driver1 = User::where('email', 'cleanup@welltrash.com')->first();
        $driver2 = User::where('email', 'cleanup2@welltrash.com')->first();

        if ($driver1) {
            $driver1->update(['current_lat' => -8.1690, 'current_lng' => 113.7050, 'last_location_at' => Carbon::now()]);
        }
        if ($driver2) {
            $driver2->update(['current_lat' => -8.1580, 'current_lng' => 113.7120, 'last_location_at' => Carbon::now()]);
        }

        // ponytail: 4 landmark partners in Jember with diverse pickup status; expand when adding multi-city tenants.
        $partners = [
            [
                'email' => 'company@welltrash.com',
                'name' => 'RSUD dr. Soebandi',
                'pic' => 'dr. Bambang S.',
                'address' => 'Jl. Dr. Soebandi No.124, Patrang, Jember',
                'lat' => -8.1518,
                'lng' => 113.7161,
                'phone' => '081234567890',
                'cat' => 'Rumah Sakit',
                'plan' => 'Premium+',
                'sched' => ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
                'status' => 'completed',
                'driver' => $driver1?->id,
                'weights' => [42.5, 25.0, 7.5, 5],
            ],
            [
                'email' => 'siloam@welltrash.com',
                'name' => 'RS Siloam Jember',
                'pic' => 'Irene Kusuma',
                'address' => 'Jl. Gajah Mada No.104, Kaliwates, Jember',
                'lat' => -8.1764,
                'lng' => 113.6890,
                'phone' => '081333444555',
                'cat' => 'Rumah Sakit',
                'plan' => 'Prime',
                'sched' => ['Senin', 'Rabu', 'Jumat'],
                'status' => 'on_the_way',
                'driver' => $driver1?->id,
                'weights' => null,
            ],
            [
                'email' => 'roxy@welltrash.com',
                'name' => 'Roxy Square Jember',
                'pic' => 'Hendra Wijaya',
                'address' => 'Jl. Hayam Wuruk No.50-58, Sempusari, Jember',
                'lat' => -8.1820,
                'lng' => 113.6780,
                'phone' => '081298765432',
                'cat' => 'Retail & Mall',
                'plan' => 'Prime',
                'sched' => ['Senin', 'Kamis', 'Sabtu'],
                'status' => 'scheduled',
                'driver' => $driver2?->id,
                'weights' => null,
            ],
            [
                'email' => 'meotel@welltrash.com',
                'name' => 'Hotel Meotel Jember',
                'pic' => 'Rian Firmansyah',
                'address' => 'Jl. Karimata No.43, Sumbersari, Jember',
                'lat' => -8.1633,
                'lng' => 113.7196,
                'phone' => '082155667788',
                'cat' => 'Perhotelan',
                'plan' => 'Reguler',
                'sched' => ['Selasa', 'Jumat'],
                'status' => 'none',
                'driver' => null,
                'weights' => null,
            ],
            [
                'email' => 'lippo@welltrash.com',
                'name' => 'Lippo Plaza Jember',
                'pic' => 'Maya Anggraeni',
                'address' => 'Jl. Gajah Mada No.106, Kaliwates, Jember',
                'lat' => -8.1770,
                'lng' => 113.6875,
                'phone' => '081233221100',
                'cat' => 'Mall & Retail',
                'plan' => 'Premium+',
                'sched' => ['Senin', 'Rabu', 'Jumat'],
                'status' => 'completed',
                'driver' => $driver2?->id,
                'weights' => [55.0, 32.5, 12.0, 7],
            ],
            [
                'email' => 'aston@welltrash.com',
                'name' => 'Aston Jember Hotel & Conference',
                'pic' => 'Dimas Prasetyo',
                'address' => 'Jl. Sentot Prawirodirdjo No.88, Kaliwates',
                'lat' => -8.1788,
                'lng' => 113.7012,
                'phone' => '082211445566',
                'cat' => 'Perhotelan',
                'plan' => 'Prime',
                'sched' => ['Senin', 'Kamis', 'Sabtu'],
                'status' => 'on_the_way',
                'driver' => $driver2?->id,
                'weights' => null,
            ],
            [
                'email' => 'rskaliwates@welltrash.com',
                'name' => 'RS Kaliwates Jember',
                'pic' => 'dr. Anita Rahayu',
                'address' => 'Jl. Diah Pitaloka No.4A, Kaliwates, Jember',
                'lat' => -8.1840,
                'lng' => 113.6705,
                'phone' => '081399887766',
                'cat' => 'Kesehatan & RS',
                'plan' => 'Prime',
                'sched' => ['Senin', 'Rabu', 'Jumat'],
                'status' => 'completed',
                'driver' => $driver1?->id,
                'weights' => [30.0, 18.0, 5.0, 4],
            ],
            [
                'email' => 'kolong@welltrash.com',
                'name' => 'Kafe Kolong Jember',
                'pic' => 'Bagus Setiawan',
                'address' => 'Jl. Mastrip (Bawah Jembatan Jarwo), Sumbersari',
                'lat' => -8.1685,
                'lng' => 113.7150,
                'phone' => '085712345678',
                'cat' => 'F&B & Cafe',
                'plan' => 'Reguler',
                'sched' => ['Senin', 'Kamis'],
                'status' => 'scheduled',
                'driver' => $driver1?->id,
                'weights' => null,
            ],
            [
                'email' => 'dira@welltrash.com',
                'name' => 'Dira Shopping & Waterpark',
                'pic' => 'Agus Santoso',
                'address' => 'Jl. MT Haryono No.88, Wirolegi, Sumbersari',
                'lat' => -8.1855,
                'lng' => 113.7310,
                'phone' => '085233445566',
                'cat' => 'Pariwisata & Rekreasi',
                'plan' => 'Reguler',
                'sched' => ['Rabu', 'Sabtu'],
                'status' => 'none',
                'driver' => null,
                'weights' => null,
            ],
        ];

        foreach ($partners as $p) {
            $user = User::updateOrCreate(
                ['email' => $p['email']],
                ['name' => $p['pic'], 'password' => 'company123', 'role' => 'company', 'email_verified_at' => now()]
            );

            $company = Company::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $p['name'],
                    'pic_name' => $p['pic'],
                    'address' => $p['address'],
                    'latitude' => $p['lat'],
                    'longitude' => $p['lng'],
                    'phone' => $p['phone'],
                    'business_category' => $p['cat'],
                    'subscription_plan' => $p['plan'],
                    'subscription_status' => 'active',
                    'payment_evidence_path' => 'dummy/payment.pdf',
                    'signed_mou_path' => 'dummy/mou.pdf',
                    'pickup_schedule' => $p['sched'],
                ]
            );

            if ($p['status'] !== 'none') {
                $pickupData = [
                    'company_id' => $company->id,
                    'pickup_date' => $today,
                    'status' => $p['status'],
                    'cleanup_id' => $p['driver'],
                ];
                if ($p['weights']) {
                    [$pickupData['organic_weight'], $pickupData['anorganic_weight'], $pickupData['residue_weight'], $pickupData['trash_bag_count']] = $p['weights'];
                }
                Pickup::updateOrCreate(['company_id' => $company->id, 'pickup_date' => $today], $pickupData);
            }
        }
    }
}
