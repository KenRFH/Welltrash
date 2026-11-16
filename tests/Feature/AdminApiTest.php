<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\Pickup;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role, string $email, array $extra = []): User
    {
        return User::create(array_merge(['name' => ucfirst($role), 'email' => $email, 'password' => Hash::make('x'), 'role' => $role], $extra));
    }

    private function as(User $u): static
    {
        $this->app['auth']->forgetGuards();
        return $this->withHeader('Authorization', 'Bearer ' . $u->createToken('t')->plainTextToken);
    }

    public function test_admin_endpoints_return_real_data_and_reviews_persist(): void
    {
        Http::fake();
        $admin = $this->user('director', 'admin@welltrash.test');
        $vehicle = Vehicle::create(['name' => 'GranMax', 'license_plate' => 'P 1 EA', 'type' => 'Pickup', 'capacity' => 1000, 'status' => 'active']);
        $crew = $this->user('CleanUP', 'crew@welltrash.test', ['vehicle_id' => $vehicle->id, 'current_lat' => -8.17, 'current_lng' => 113.7, 'last_location_at' => now()]);
        $owner = $this->user('company', 'mitra@welltrash.test');
        $company = Company::create(['user_id' => $owner->id, 'company_name' => 'PT Mitra', 'pic_name' => 'Budi', 'address' => 'Jl. A', 'phone' => '0812', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'pending']);
        Pickup::create(['company_id' => $company->id, 'cleanup_id' => $crew->id, 'pickup_date' => Carbon::today(), 'status' => 'completed', 'organic_weight' => 12.5, 'anorganic_weight' => 3, 'residue_weight' => 1]);
        Pickup::create(['company_id' => $company->id, 'cleanup_id' => $crew->id, 'pickup_date' => Carbon::today(), 'status' => 'on_the_way']);
        $ot = OvertimeRequest::create(['user_id' => $crew->id, 'date' => Carbon::today(), 'reason' => 'Event', 'status' => 'pending']);
        $leave = LeaveRequest::create(['user_id' => $crew->id, 'date' => Carbon::tomorrow(), 'type' => 'sakit', 'reason' => 'Demam', 'status' => 'pending']);

        $this->as($admin)->getJson('/api/admin/dashboard')->assertOk()->assertJson([
            'active_armada' => 1, 'total_armada' => 1, 'pickups_completed' => 1, 'pickups_total' => 2,
            'kg_organik' => 12.5, 'kg_anorganik' => 3, 'kg_residu' => 1, 'pending_approvals' => 3,
        ]);

        $this->as($admin)->getJson('/api/admin/cleanups/live-locations')->assertOk()
            ->assertJsonPath('data.0.name', 'CleanUP')
            ->assertJsonPath('data.0.status', 'on_the_way')
            ->assertJsonPath('data.0.current_task_company', 'PT Mitra');

        $this->as($admin)->getJson('/api/admin/approvals')->assertOk()->assertJsonCount(3, 'data')
            ->assertJsonFragment(['type' => 'leave', 'title' => 'Pengajuan Sakit', 'applicant_name' => 'CleanUP']);

        $this->as($admin)->postJson("/api/admin/attendance/overtime/{$ot->id}/review", ['status' => 'approved'])->assertOk();
        $this->as($admin)->postJson("/api/admin/attendance/leave/{$leave->id}/review", ['status' => 'rejected'])->assertOk();
        $this->as($admin)->postJson("/api/admin/companies/{$company->id}/review", ['status' => 'approved'])->assertOk();

        $this->assertSame('approved', $ot->fresh()->status);
        $this->assertSame('rejected', $leave->fresh()->status);
        $this->assertSame('approved', $company->fresh()->subscription_status);
        $this->as($admin)->getJson('/api/admin/approvals')->assertJsonCount(0, 'data');
    }

    public function test_dashboard_executive_summary_compares_month_and_counts_receivables(): void
    {
        Carbon::setTestNow('2026-11-16 10:00:00');
        $admin = $this->user('director', 'admin@welltrash.test');
        $crew = $this->user('CleanUP', 'crew@welltrash.test');
        $this->user('CleanUP', 'crew2@welltrash.test');
        $owner = $this->user('company', 'mitra@welltrash.test');
        $company = Company::create(['user_id' => $owner->id, 'company_name' => 'PT Mitra', 'pic_name' => 'Budi', 'address' => 'Jl. A', 'phone' => '0812', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'approved']);
        $pick = fn ($date, $kg, $status = 'completed') => Pickup::create(['company_id' => $company->id, 'cleanup_id' => $crew->id, 'pickup_date' => $date, 'status' => $status, 'organic_weight' => $kg]);
        $pick('2026-11-16', 10);
        $pick('2026-11-14', 5);
        $pick('2026-11-02', 7);
        $pick('2026-11-16', 99, 'scheduled');      // not completed: ignored
        $pick('2026-10-10', 4);                    // same window last month
        $pick('2026-10-20', 50);                   // after day 16 last month: excluded
        \App\Models\Attendance::create(['user_id' => $crew->id, 'date' => '2026-11-16', 'clock_in_at' => now(), 'status' => 'incomplete']);
        \App\Models\Attendance::create(['user_id' => $admin->id, 'date' => '2026-11-16', 'clock_in_at' => now(), 'status' => 'incomplete']); // not crew
        \App\Models\Invoice::create(['company_id' => $company->id, 'invoice_number' => 'INV-1', 'period_start' => '2026-10-01', 'period_end' => '2026-10-31', 'due_date' => '2026-11-10', 'amount' => 150000, 'status' => 'unpaid']);
        \App\Models\Invoice::create(['company_id' => $company->id, 'invoice_number' => 'INV-2', 'period_start' => '2026-11-01', 'period_end' => '2026-11-30', 'due_date' => '2026-12-10', 'amount' => 50000, 'status' => 'unpaid']);
        \App\Models\Invoice::create(['company_id' => $company->id, 'invoice_number' => 'INV-3', 'period_start' => '2026-09-01', 'period_end' => '2026-09-30', 'due_date' => '2026-10-10', 'amount' => 70000, 'status' => 'paid']);

        $res = $this->as($admin)->getJson('/api/admin/dashboard')->assertOk()->assertJson(['executive' => [
            'month' => ['pickups' => 3, 'kg' => 22], 'prev_month' => ['pickups' => 1, 'kg' => 4],
            'crew_total' => 2, 'crew_present' => 1, 'crew_on_leave' => 0,
            'unpaid_count' => 2, 'unpaid_amount' => 200000, 'overdue_count' => 1,
        ]]);
        $trend = $res->json('executive.trend');
        $this->assertCount(7, $trend);
        $this->assertSame(['date' => '2026-11-14', 'pickups' => 1, 'kg' => 5], $trend[4]);
        $this->assertSame(['date' => '2026-11-16', 'pickups' => 1, 'kg' => 10], $trend[6]);
        Carbon::setTestNow();
    }

    public function test_crew_cannot_use_admin_endpoints(): void
    {
        $crew = $this->user('CleanUP', 'crew@welltrash.test');
        $this->as($crew)->getJson('/api/admin/dashboard')->assertForbidden();
        $this->as($crew)->getJson('/api/admin/approvals')->assertForbidden();
    }
}
