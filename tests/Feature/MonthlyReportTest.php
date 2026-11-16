<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Invoice;
use App\Models\LeaveRequest;
use App\Models\Pickup;
use App\Models\SiteSetting;
use App\Models\User;
use App\Services\MonthlyReportService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class MonthlyReportTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role, ?string $name = null): User
    {
        return User::create(['name' => $name ?? $role, 'email' => uniqid() . '@welltrash.test', 'password' => Hash::make('x'), 'role' => $role]);
    }

    public function test_report_numbers_compare_months_rank_partners_and_count_approvals(): void
    {
        Carbon::setTestNow('2026-11-20 10:00:00');
        $crew = $this->user('CleanUP', 'Budi');
        $dir = $this->user('director', 'Mashudi');
        $owner = $this->user('company');
        $a = Company::create(['user_id' => $owner->id, 'company_name' => 'PT A', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        $b = Company::create(['user_id' => $owner->id, 'company_name' => 'PT B', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        $pick = fn ($co, $date, $kg, $status = 'completed') => Pickup::create(['company_id' => $co->id, 'cleanup_id' => $crew->id, 'pickup_date' => $date, 'status' => $status, 'organic_weight' => $kg, 'residue_weight' => 1]);
        $pick($a, '2026-11-02', 9);   // week 1
        $pick($b, '2026-11-03', 29);  // week 1
        $pick($b, '2026-11-17', 19);  // week 3
        $pick($a, '2026-11-18', 0, 'failed');
        $pick($a, '2026-10-05', 39);  // previous month
        SiteSetting::set('target_kg:2026-11', 100);
        LeaveRequest::create(['user_id' => $crew->id, 'date' => '2026-11-05', 'type' => 'izin', 'reason' => 'x', 'status' => 'pending'])
            ->review($dir, ['status' => 'approved']);
        Invoice::create(['company_id' => $a->id, 'invoice_number' => 'INV-1', 'period_start' => '2026-10-01', 'period_end' => '2026-10-31', 'due_date' => '2026-11-10', 'amount' => 300000, 'status' => 'unpaid']);

        $r = app(MonthlyReportService::class)->build('2026-11');

        // 9+29+19 organic + 3×1 residue = 60 kg
        $this->assertSame([3, 4, 1, 60.0], [$r['current']['pickups'], $r['current']['scheduled'], $r['current']['failed'], $r['current']['kg']]);
        $this->assertSame([1, 40.0], [$r['previous']['pickups'], $r['previous']['kg']]);
        $this->assertSame('Oktober 2026', $r['prevLabel']);
        $this->assertSame(100.0, $r['target']['kg']);
        $this->assertSame(['PT B', 'PT A'], $r['companies']->pluck('name')->all());
        $this->assertEquals(50, $r['companies'][0]->kg);
        // 1 Nov 2026 is a Sunday, so week one is that single day: [01], [02–08], [09–15], [16–22], …
        $this->assertSame([0, 2, 0, 1], array_slice(array_column($r['weeks'], 'pickups'), 0, 4));
        $this->assertSame(['Mashudi' => ['izin' => 1]], $r['approvers']);
        $this->assertSame(1, $r['people']['leave_approved']);
        $this->assertEquals(300000, $r['finance']['unpaid_amount']);
        $this->assertSame(1, $r['finance']['overdue_count']);
        Carbon::setTestNow();
    }

    public function test_pdf_download_is_for_commercial_tier_and_rejects_future_months(): void
    {
        $this->actingAs($this->user('manager'))->get('/admin/reports/monthly?month=' . now()->format('Y-m'))
            ->assertOk()->assertHeader('content-type', 'application/pdf');
        $this->actingAs($this->user('superadmin'))->get('/admin/reports/monthly')->assertOk();
        $this->actingAs($this->user('director'))->get('/admin/reports/monthly?month=' . now()->addMonth()->format('Y-m'))->assertSessionHasErrors('month');
        $this->actingAs($this->user('director'))->get('/admin/reports/monthly?month=bukan-bulan')->assertSessionHasErrors('month');
        $this->actingAs($this->user('coordinator'))->get('/admin/reports/monthly')->assertForbidden();
    }
}
