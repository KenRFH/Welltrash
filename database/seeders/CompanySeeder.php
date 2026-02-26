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
                    'company_name' => 'PT WellMaggot Sejahtera',
                    'pic_name' => $activeUser->name,
                    'address' => 'Jl. Kebon Jeruk No. 123, Jakarta Barat',
                    'phone' => '081234567890',
                    'business_category' => 'Retail',
                    'subscription_plan' => 'Premium',
                    'subscription_status' => 'active',
                    'payment_evidence_path' => 'dummy/payment.pdf',
                    'signed_mou_path' => 'dummy/mou.pdf',
                    'pickup_schedule' => ['Senin', 'Kamis'],
                ]
            );
        }
        
        // 2. Pending Company
        $pendingUser = User::updateOrCreate(
            ['email' => 'pending@welltrash.com'],
            [
                'name' => 'Pending Company User',
                'password' => 'company123',
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );
        Company::updateOrCreate(
            ['user_id' => $pendingUser->id],
            [
                'company_name' => 'PT Pending Corp',
                'pic_name' => $pendingUser->name,
                'address' => 'Jl. Menunggu Approval No. 404',
                'phone' => '08987654321',
                'business_category' => 'Technology',
                'subscription_plan' => 'Basic',
                'subscription_status' => 'pending',
                'payment_evidence_path' => 'dummy/payment.pdf',
                'signed_mou_path' => 'dummy/mou.pdf',
                'pickup_schedule' => ['Rabu'],
            ]
        );
        
        // 3. Cancelling Company
        $cancellingUser = User::updateOrCreate(
            ['email' => 'cancel@welltrash.com'],
            [
                'name' => 'Cancelling Company User',
                'password' => 'company123',
                'role' => 'company',
                'email_verified_at' => now(),
            ]
        );
        Company::updateOrCreate(
            ['user_id' => $cancellingUser->id],
            [
                'company_name' => 'CV Batal Jalan',
                'pic_name' => $cancellingUser->name,
                'address' => 'Jl. Berhenti Langganan No. 500',
                'phone' => '08111222333',
                'business_category' => 'Food & Beverage',
                'subscription_plan' => 'Premium +',
                'subscription_status' => 'cancellation_requested',
                'payment_evidence_path' => 'dummy/payment.pdf',
                'signed_mou_path' => 'dummy/mou.pdf',
                'pickup_schedule' => ['Senin', 'Rabu', 'Jumat'],
            ]
        );
    }
}
