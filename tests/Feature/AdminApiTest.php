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
        $admin = $this->user('admin', 'admin@welltrash.test');
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

    public function test_crew_cannot_use_admin_endpoints(): void
    {
        $crew = $this->user('CleanUP', 'crew@welltrash.test');
        $this->as($crew)->getJson('/api/admin/dashboard')->assertForbidden();
        $this->as($crew)->getJson('/api/admin/approvals')->assertForbidden();
    }
}
