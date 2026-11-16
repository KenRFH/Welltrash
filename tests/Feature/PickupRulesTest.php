<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\Pickup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PickupRulesTest extends TestCase
{
    use RefreshDatabase;

    private function crew(string $name): User
    {
        return User::create(['name' => $name, 'email' => strtolower($name) . '@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP']);
    }

    private function pickup(array $attrs = []): Pickup
    {
        $owner = User::create(['name' => 'Mitra', 'email' => uniqid() . '@welltrash.test', 'password' => Hash::make('x'), 'role' => 'company']);
        $co = Company::create(['user_id' => $owner->id, 'company_name' => 'PT A', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        return Pickup::create($attrs + ['company_id' => $co->id, 'pickup_date' => Carbon::today(), 'status' => 'scheduled']);
    }

    private function api(User $u)
    {
        $this->app['auth']->forgetGuards();
        return $this->withToken($u->createToken('t')->plainTextToken);
    }

    public function test_crew_must_clock_in_before_working(): void
    {
        $budi = $this->crew('Budi');
        $p = $this->pickup();

        $this->api($budi)->putJson("/api/operator/pickups/{$p->id}/status", ['status' => 'on_the_way'])
            ->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'presensi masuk'));
        $this->actingAs($budi)->put(route('cleanup.updateStatus', $p), ['status' => 'on_the_way'])->assertSessionHas('error');
        $this->assertSame('scheduled', $p->fresh()->status);

        $this->clockIn($budi);
        $this->api($budi)->putJson("/api/operator/pickups/{$p->id}/status", ['status' => 'on_the_way'])->assertOk();
        $this->assertSame($budi->id, $p->fresh()->cleanup_id);
    }

    public function test_job_taken_by_another_crew_cannot_be_taken_over(): void
    {
        [$budi, $andi] = [$this->crew('Budi'), $this->crew('Andi')];
        $this->clockIn($budi);
        $this->clockIn($andi);
        $p = $this->pickup(['status' => 'on_the_way', 'cleanup_id' => $budi->id]);

        $this->api($andi)->putJson("/api/operator/pickups/{$p->id}/status", ['status' => 'failed', 'cancellation_reason' => 'x'])
            ->assertStatus(422)->assertJsonPath('message', 'Penjemputan ini sedang dikerjakan oleh Budi.');
        $this->api($andi)->postJson("/api/operator/pickups/{$p->id}/submit", ['organic_weight' => 3])->assertStatus(422);
        $this->assertSame([$budi->id, 'on_the_way'], [$p->fresh()->cleanup_id, $p->fresh()->status]);
    }

    public function test_finished_jobs_are_final_and_completion_needs_the_submit_form(): void
    {
        Storage::fake('public');
        $budi = $this->crew('Budi');
        $this->clockIn($budi);
        $open = $this->pickup();

        // "completed" as a bare status (no weights/photo) is no longer accepted.
        $this->api($budi)->putJson("/api/operator/pickups/{$open->id}/status", ['status' => 'completed'])->assertStatus(422);
        $this->assertSame('scheduled', $open->fresh()->status);

        $this->api($budi)->post("/api/operator/pickups/{$open->id}/submit", [
            'organic_weight' => 5, 'evidence_pickup_path' => UploadedFile::fake()->image('bukti.jpg'),
        ], ['Accept' => 'application/json'])->assertOk();
        $this->assertSame('completed', $open->fresh()->status);

        foreach ([$open, $this->pickup(['status' => 'failed', 'cleanup_id' => $budi->id])] as $done) {
            $this->api($budi)->putJson("/api/operator/pickups/{$done->id}/status", ['status' => 'on_the_way'])
                ->assertStatus(422)->assertJsonPath('message', fn ($m) => str_contains($m, 'tidak dapat diubah lagi'));
        }
        $this->assertEquals(5, $open->fresh()->organic_weight, 'a completed job keeps its weights');
    }

    public function test_rejected_leave_can_be_resubmitted_but_pending_or_approved_cannot(): void
    {
        $budi = $this->crew('Budi');
        $date = Carbon::tomorrow()->toDateString();
        $admin = User::create(['name' => 'Dir', 'email' => 'dir@welltrash.test', 'password' => Hash::make('x'), 'role' => 'director']);
        LeaveRequest::create(['user_id' => $budi->id, 'date' => $date, 'type' => 'sakit', 'reason' => 'Demam', 'status' => 'pending'])
            ->review($admin, ['status' => 'rejected', 'admin_note' => 'Lampirkan surat dokter']);

        $this->api($budi)->postJson('/api/operator/leave-request', ['date' => $date, 'type' => 'sakit', 'reason' => 'Demam, ada surat dokter'])->assertCreated();
        $this->api($budi)->postJson('/api/operator/leave-request', ['date' => $date, 'type' => 'izin', 'reason' => 'lagi'])->assertStatus(422);

        // Same row reopened (unique user+date), back in the queue with the old decision cleared.
        $leave = LeaveRequest::sole();
        $this->assertSame(['pending', 'Demam, ada surat dokter', null, null, null], [$leave->status, $leave->reason, $leave->admin_note, $leave->reviewed_by, $leave->reviewed_at]);

        $this->actingAs($budi)->post(route('cleanup.leave.store'), ['date' => Carbon::today()->addDays(2)->toDateString(), 'type' => 'izin', 'reason' => 'x']);
        $this->assertSame(2, LeaveRequest::count());
    }
}
