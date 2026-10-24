<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Solution;
use App\Models\SiteSetting;

class SolutionSeeder extends Seeder
{
    public function run(): void
    {
        SiteSetting::set('solution_badge', 'SOLUSI B2B TERPADU');
        SiteSetting::set('solution_title', 'Dirancang untuk skala operasional bisnis Anda.');
        SiteSetting::set('solution_subtitle', 'Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.');

        Solution::updateOrCreate(
            ['title' => 'Corporate Waste'],
            [
                'segment' => 'Komersial & Ritel',
                'tag' => 'Logistik Terjadwal',
                'desc' => 'Pengangkutan terjadwal untuk gedung perkantoran, pusat retail, hotel, dan kawasan komersial dengan jaminan kebersihan serta ketepatan ritme penjemputan armada.',
                'icon' => 'Building2',
                'accent_color' => 'green',
                'image_path' => 'solutions/hero_waste_transport.webp',
                'link_url' => '/layanan',
                'order_num' => 1,
            ]
        );

        Solution::updateOrCreate(
            ['title' => 'Industrial Waste'],
            [
                'segment' => 'Industri Non-B3',
                'tag' => 'Kepatuhan Regulasi',
                'desc' => 'Penanganan sampah non-B3 industri dan manufaktur dengan standar operasional yang aman, kapasitas angkut tonase besar, dan bukti timbangan manifest legal.',
                'icon' => 'Factory',
                'accent_color' => 'orange',
                'image_path' => 'solutions/hero_waste_sorting.webp',
                'link_url' => '/layanan',
                'order_num' => 2,
            ]
        );

        Solution::updateOrCreate(
            ['title' => 'Recyclable Recovery'],
            [
                'segment' => 'Ekonomi Sirkular',
                'tag' => 'Biokonversi & Daur Ulang',
                'desc' => 'Pemilahan dan pemulihan material bernilai ekonomis untuk dialihkan dari TPA, mendukung rantai nilai daur ulang industri dan komitmen ESG perusahaan Anda.',
                'icon' => 'Recycle',
                'accent_color' => 'green',
                'image_path' => 'solutions/karyawanWelltrash.webp',
                'link_url' => '/layanan',
                'order_num' => 3,
            ]
        );
    }
}
