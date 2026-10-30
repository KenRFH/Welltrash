<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = [
            [
                'name'          => 'Truk Isuzu Elf Box 01',
                'license_plate' => 'P 8492 GA',
                'type'          => 'Truk Boks',
                'capacity'      => '4 m³ / 1.500 kg',
                'status'        => 'active',
                'notes'         => 'Armada rute reguler kawasan kampus dan pusat kota Jember',
            ],
            [
                'name'          => 'Suzuki Carry Bak 01',
                'license_plate' => 'P 9044 BZ',
                'type'          => 'Pick Up',
                'capacity'      => '2 m³ / 800 kg',
                'status'        => 'active',
                'notes'         => 'Armada fleksibel untuk gang sempit dan penjemputan insidental',
            ],
            [
                'name'          => 'Viar Karya 200',
                'license_plate' => 'P 4412 KL',
                'type'          => 'Motor Roda Tiga',
                'capacity'      => '1 m³ / 400 kg',
                'status'        => 'active',
                'notes'         => 'Armada mikro untuk pemilahan cepat sampah organik',
            ],
            [
                'name'          => 'Truk Hino Dutro 02',
                'license_plate' => 'P 8129 UA',
                'type'          => 'Truk Bak',
                'capacity'      => '5 m³ / 2.000 kg',
                'status'        => 'maintenance',
                'notes'         => 'Sedang perawatan berkala ganti oli & suspensi di bengkel resmi',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::updateOrCreate(
                ['license_plate' => $vehicle['license_plate']],
                $vehicle
            );
        }
    }
}
