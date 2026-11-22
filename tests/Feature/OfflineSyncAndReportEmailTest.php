<?php

namespace Tests\Feature;

use App\Mail\PickupReportMail;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Pickup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OfflineSyncAndReportEmailTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role, string $email): User
    {
        return User::create(['name' => ucfirst($role), 'email' => $email, 'password' => Hash::make('password123'), 'role' => $role]);
    }

    private function pickupFor(string $date): Pickup
    {
        $client = $this->user('company', 'mitra@welltrash.test');
        $company = Company::create(['user_id' => $client->id, 'company_name' => 'SPPG Uji', 'pic_name' => 'Budi', 'phone' => '0812', 'address' => 'Jl. A',
            'business_category' => 'F&B', 'subscription_plan' => 'Prime', 'subscription_status' => 'active']);

        return Pickup::create(['company_id' => $company->id, 'pickup_date' => $date, 'status' => 'scheduled']);
    }

    public function test_offline_clock_in_is_recorded_at_its_own_time_so_offline_pickup_syncs(): void
    {
        Storage::fake('public');
        Mail::fake();
        $operator = $this->user('CleanUP', 'op@welltrash.test');
        $token = $operator->createToken('t')->plainTextToken;
        $pickup = $this->pickupFor(Carbon::yesterday()->toDateString());
        $recordedAt = Carbon::yesterday()->setTime(7, 30);

        $this->withToken($token)->post('/api/operator/attendance/clock-in', [
            'lat' => -8.17, 'lng' => 113.7, 'photo' => UploadedFile::fake()->image('selfie.jpg'),
            'offline_recorded_at' => $recordedAt->toIso8601String(),
        ], ['Accept' => 'application/json'])->assertOk();

        $att = Attendance::where('user_id', $operator->id)->firstOrFail();
        $this->assertSame($recordedAt->toDateString(), Carbon::parse($att->date)->toDateString());
        $this->assertTrue($recordedAt->eq($att->clock_in_at));

        $this->withToken($token)->post("/api/operator/pickups/{$pickup->id}/submit", [
            'organic_weight' => 4, 'evidence_pickup_path' => UploadedFile::fake()->image('bukti.jpg'),
            'offline_recorded_at' => Carbon::yesterday()->setTime(9, 0)->toIso8601String(),
        ], ['Accept' => 'application/json'])->assertOk();

        $this->assertSame('completed', $pickup->fresh()->status);
        Mail::assertSent(PickupReportMail::class, fn ($m) => $m->hasTo('mitra@welltrash.test'));
        $this->assertNotNull($pickup->fresh()->report_emailed_at);
    }

    public function test_offline_clock_in_older_than_48_hours_is_refused(): void
    {
        $operator = $this->user('CleanUP', 'op@welltrash.test');

        $this->withToken($operator->createToken('t')->plainTextToken)->postJson('/api/operator/attendance/clock-in', [
            'offline_recorded_at' => Carbon::now()->subHours(49)->toIso8601String(),
        ])->assertStatus(422)->assertJsonPath('message', 'Presensi offline melewati batas toleransi 48 jam. Hubungi admin.');

        $this->assertSame(0, Attendance::count());
    }

    public function test_failed_report_email_is_recorded_on_the_pickup(): void
    {
        Mail::shouldReceive('to')->andThrow(new \RuntimeException('SMTP down'));
        $pickup = $this->pickupFor(Carbon::today()->toDateString());

        $this->assertSame('SMTP down', $pickup->sendReport());
        $this->assertSame('SMTP down', $pickup->fresh()->report_email_error);
        $this->assertNull($pickup->fresh()->report_emailed_at);
    }

    public function test_admin_completes_pickup_manually_and_resends_report(): void
    {
        Storage::fake('public');
        Mail::fake();
        $admin = $this->user('manager', 'gm@welltrash.test');
        $operator = $this->user('CleanUP', 'op@welltrash.test');
        $pickup = $this->pickupFor(Carbon::yesterday()->toDateString());

        // No weight and no bags: refused, nothing changes.
        $this->actingAs($admin)->post("/admin/pickups/{$pickup->id}/complete", ['cleanup_id' => $operator->id])
            ->assertSessionHasErrors('organic_weight');
        $this->assertSame('scheduled', $pickup->fresh()->status);

        $this->actingAs($admin)->post("/admin/pickups/{$pickup->id}/complete", [
            'cleanup_id' => $operator->id, 'organic_weight' => 6.5, 'trash_bag_count' => 2,
            'evidence_pickup_path' => UploadedFile::fake()->image('bukti.jpg'),
        ])->assertSessionHas('success');

        $fresh = $pickup->fresh();
        $this->assertSame(['completed', $operator->id, 6.5, 2], [$fresh->status, $fresh->cleanup_id, $fresh->organic_weight, $fresh->trash_bag_count]);
        Mail::assertSent(PickupReportMail::class, 1);
        $this->assertNotNull($fresh->report_emailed_at);

        $this->actingAs($admin)->post("/admin/pickups/{$pickup->id}/resend-report")->assertSessionHas('success');
        // >= not ==: the test app re-runs earlier after-response callbacks per request (a real server never does).
        $this->assertGreaterThanOrEqual(2, Mail::sent(PickupReportMail::class)->count());

        // Already completed: manual completion refused.
        $this->actingAs($admin)->post("/admin/pickups/{$pickup->id}/complete", ['cleanup_id' => $operator->id, 'organic_weight' => 1])
            ->assertSessionHas('error');
    }

    public function test_manual_completion_is_limited_to_commercial_roles_and_past_dates(): void
    {
        $operator = $this->user('CleanUP', 'op@welltrash.test');
        $coordinator = $this->user('coordinator', 'koor@welltrash.test');
        $future = $this->pickupFor(Carbon::tomorrow()->toDateString());
        $payload = ['cleanup_id' => $operator->id, 'organic_weight' => 1];

        $this->actingAs($coordinator)->post("/admin/pickups/{$future->id}/complete", $payload)->assertForbidden();
        $this->actingAs($operator)->post("/admin/pickups/{$future->id}/complete", $payload)->assertForbidden();
        $this->actingAs($this->user('director', 'dir@welltrash.test'))->post("/admin/pickups/{$future->id}/complete", $payload)
            ->assertSessionHas('error', 'Jadwal penjemputan ini belum tiba.');
        $this->assertSame('scheduled', $future->fresh()->status);
    }
}
