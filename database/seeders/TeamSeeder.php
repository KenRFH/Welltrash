<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Team;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Team::updateOrCreate(
            ['name' => 'Mashudi'],
            [
                'role' => 'Direktur Utama',
                'desc' => 'Memimpin visi strategis dan komitmen PT Sarana Utama Welltrash Farm menuju keberlanjutan hijau.',
                'image_path' => 'teams/profile_Direktur.webp',
                'order_num' => 1
            ]
        );

        Team::updateOrCreate(
            ['name' => 'Harry'],
            [
                'role' => 'Bag. Humas & Kesekretariatan',
                'desc' => 'Menghubungkan WellTrash dengan pemangku kepentingan untuk kemitraan yang sirkular.',
                'image_path' => 'teams/profile_Andik.webp',
                'order_num' => 2
            ]
        );

        Team::updateOrCreate(
            ['name' => 'Andik'],
            [
                'role' => 'Bag. Operasional',
                'desc' => 'Mengatur logistik penjemputan dan pengolahan limbah secara terjadwal dan efisien.',
                'image_path' => 'teams/profile_Andik.webp',
                'order_num' => 3
            ]
        );

        Team::updateOrCreate(
            ['name' => 'Ken'],
            [
                'role' => 'Bag. Teknologi Informasi',
                'desc' => 'Mengembangkan platform digital WellTrash demi pelacakan transparan dan real-time.',
                'image_path' => 'teams/profile_Ken.webp',
                'order_num' => 4
            ]
        );
    }
}
