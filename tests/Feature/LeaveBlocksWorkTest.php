<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\Pickup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LeaveBlocksWorkTest extends TestCase
{
    use RefreshDatabase;

    private User $crew;
    private Pickup $pickup;

    protected function setUp(): void
    {
        parent::setUp();
        Http::fake();
        Carbon::setTestNow('2026-11-16 08:00:00');
        $this->crew = User::create(['name' => 'Budi', 'email' => 'budi@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP']);
        $owner = User::create(['name' => 'Mitra', 'email' => 'm@welltrash.test', 'password' => Hash::make('x'), 'role' => 'company']);
        $co = Company::create(['user_id' => $owner->id, 'company_name' => 'PT A', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        $this->pickup = Pickup::create(['company_id' => $co->id, 'pickup_date' => '2026-11-16', 'status' => 'scheduled']);
    }

    protected function tearDown(): void
    {
        Carbon::setTestNow();
        parent::tearDown();
    }

    private function leave(string $status, string $date = '2026-11-16'): void
    {
        LeaveRequest::create(['user_id' => $this->crew->id, 'date' => $date, 'type' => 'sakit', 'reason' => 'Demam', 'status' => $status]);
    }

    private function api()
    {
        return $this->withToken($this->crew->createToken('t')->plainTextToken);
    }

    public function test_app_refuses_every_work_action_on_an_approved_leave_day(): void
    {
        $this->leave('approved');

        $this->api()->postJson('/api/operator/attendance/clock-in')->assertStatus(423)->assertJsonPath('on_leave', true)
            ->assertJsonPath('message', fn ($m) => str_contains($m, 'sakit hari ini'));
        $this->api()->postJson('/api/operator/attendance/overtime/request', ['date' => '2026-11-16', 'reason' => 'x'])->assertStatus(423);
        $this->api()->postJson('/api/operator/attendance/overtime/clock-in')->assertStatus(423);
        $this->api()->putJson("/api/operator/pickups/{$this->pickup->id}/status", ['status' => 'on_the_way'])->assertStatus(423);
        $this->api()->postJson("/api/operator/pickups/{$this->pickup->id}/submit", ['organic_weight' => 1])->assertStatus(423);

        $this->assertSame(0, Attendance::count());
        $this->assertSame('scheduled', $this->pickup->fresh()->status);
        $this->assertNull($this->pickup->fresh()->cleanup_id);
        $this->api()->getJson('/api/operator/attendance/status')->assertOk()->assertJsonPath('leaveToday.type', 'sakit');
    }

    public function test_web_portal_refuses_the_same_actions(): void
    {
        $this->leave('approved');

        $this->actingAs($this->crew)->post(route('cleanup.attendance.clockIn'))->assertSessionHas('error');
        $this->actingAs($this->crew)->put(route('cleanup.updateStatus', $this->pickup), ['status' => 'on_the_way'])->assertSessionHas('error');
        $this->assertSame(0, Attendance::count());
        $this->assertSame('scheduled', $this->pickup->fresh()->status);
    }

    public function test_pending_rejected_or_other_day_leave_does_not_block_and_clock_out_stays_allowed(): void
    {
        $this->leave('pending');
        $this->leave('rejected', '2026-11-15');
        $this->leave('approved', '2026-11-17');

        $this->api()->getJson('/api/operator/attendance/status')->assertJsonPath('leaveToday', null);
        $this->clockIn($this->crew);
        $this->api()->putJson("/api/operator/pickups/{$this->pickup->id}/status", ['status' => 'on_the_way'])->assertOk();

        // Clocked in, then the leave for today gets approved: going home is still possible.
        LeaveRequest::whereDate('date', '2026-11-16')->update(['status' => 'approved']);
        $this->assertNotSame(423, $this->api()->postJson('/api/operator/attendance/clock-out')->status());
        $this->assertNotNull(Attendance::first()->fresh()->clock_out_at);
    }
}
