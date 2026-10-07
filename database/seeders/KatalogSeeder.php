<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Katalog;

class KatalogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Katalog::updateOrCreate(
            ['name' => 'Kompos Organik Premium'],
            [
                'description' => 'Pupuk kompos berkualitas tinggi hasil pengolahan sampah organik. Cocok untuk pertanian, perkebunan, dan taman rumah. Diproduksi melalui proses fermentasi terkontrol di WellTrash Farm.',
                'price' => 25000,
                'image_path' => null,
            ]
        );

        Katalog::updateOrCreate(
            ['name' => 'Eco-Brick'],
            [
                'description' => 'Bata ramah lingkungan dari limbah plastik padat yang dipadatkan. Dapat digunakan untuk konstruksi ringan, furniture, dan dekorasi. Kuat, tahan air, dan mengurangi sampah plastik.',
                'price' => 15000,
                'image_path' => null,
            ]
        );

        Katalog::updateOrCreate(
            ['name' => 'Maggot BSF Kering'],
            [
                'description' => 'Pakan ternak alternatif berprotein tinggi dari larva Black Soldier Fly (BSF). Dibudidayakan menggunakan limbah organik sisa pengolahan sampah WellTrash. Kaya nutrisi untuk unggas dan ikan.',
                'price' => 50000,
                'image_path' => null,
            ]
        );

        Katalog::updateOrCreate(
            ['name' => 'Pupuk Cair Organik'],
            [
                'description' => 'Pupuk cair hasil fermentasi sampah organik yang kaya akan unsur hara mikro dan makro. Mempercepat pertumbuhan tanaman dan memperbaiki struktur tanah secara alami.',
                'price' => 30000,
                'image_path' => null,
            ]
        );

        Katalog::updateOrCreate(
            ['name' => 'Cacahan Plastik (Flake)'],
            [
                'description' => 'Bahan baku daur ulang berupa cacahan plastik HDPE dan PET yang sudah dicuci bersih. Siap diolah kembali menjadi produk plastik baru oleh industri manufaktur.',
                'price' => null,
                'image_path' => null,
            ]
        );

        Katalog::updateOrCreate(
            ['name' => 'Tas Daur Ulang'],
            [
                'description' => 'Tas belanja ramah lingkungan yang dibuat dari bahan limbah tekstil dan plastik daur ulang. Desain modern, kuat, dan dapat digunakan berulang kali. Tersedia berbagai ukuran dan warna.',
                'price' => 35000,
                'image_path' => null,
            ]
        );
    }
}
