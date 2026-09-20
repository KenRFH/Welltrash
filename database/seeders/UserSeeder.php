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
                'name' => 'Mashudi',
                'password' => 'admin123',
                'role' => 'admin',
                'email_verified_at' => now(),
            ]
        );

        // CleanUP
        User::updateOrCreate(
            ['email' => 'cleanup@welltrash.com'],
            [
                'name' => 'CleanUP User',
                'password' => 'cleanup123',
                'role' => 'CleanUP',
                'email_verified_at' => now(),
            ]
        );

         // CleanUP2
         User::updateOrCreate(
            ['email' => 'cleanup2@welltrash.com'],
            [
                'name' => 'CleanUP User2',
                'password' => 'cleanup123',
                'role' => 'CleanUP',
                'email_verified_at' => now(),
            ]
        );

        // Company
        User::updateOrCreate(
            ['email' => 'company@welltrash.com'],
            [
                'name' => 'Company User',
                'password' => 'company123',
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );

        // Web Admin
        User::updateOrCreate(
            ['email' => 'webadmin@welltrash.com'],
            [
                'name' => 'Web Admin User',
                'password' => 'webadmin123',
                'role' => 'web_admin',
                'email_verified_at' => now(),
            ]
        );
    }
}
