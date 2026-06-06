<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;

class CompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Active Company
        $activeUser = User::where('email', 'company@welltrash.com')->first();
        if ($activeUser) {
            Company::updateOrCreate(
                ['user_id' => $activeUser->id],
                [
                    'company_name' => 'PT WellTrash Sejahtera',
                    'pic_name' => $activeUser->name,
                    'address' => 'Jl. Kebon Jeruk No. 123, Jakarta Barat',
                    'phone' => '081234567890',
                    'business_category' => 'Retail',
                    'subscription_plan' => 'Prime',
                    'subscription_status' => 'active',
                    'payment_evidence_path' => 'dummy/payment.pdf',
                    'signed_mou_path' => 'dummy/mou.pdf',
                    'pickup_schedule' => ['Senin', 'Kamis'],
                ]
            );
        }
    
    }
}
