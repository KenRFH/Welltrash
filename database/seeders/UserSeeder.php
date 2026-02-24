<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@welltrash.com'],
            [
                'name' => 'Admin User',
                'password' => 'admin123',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // Driver
        User::updateOrCreate(
            ['email' => 'driver@welltrash.com'],
            [
                'name' => 'Driver User',
                'password' => Hash::make('password'),
                'role' => 'driver',
                'email_verified_at' => now(),
            ]
        );

        // Company
        User::updateOrCreate(
            ['email' => 'company@welltrash.com'],
            [
                'name' => 'Company User',
                'password' => Hash::make('password'),
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );
    }
}
