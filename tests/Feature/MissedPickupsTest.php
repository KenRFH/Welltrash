<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Pickup;
use App\Models\User;
use App\Notifications\AppNotice;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MissedPickupsTest extends TestCase
{
    use RefreshDatabase;

    private Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        $this->company = Company::create([
            'user_id' => User::factory()->create(['role' => 'Company'])->id,
            'company_name' => 'PT Sumber Sampah Bersih',
            'address' => 'Jl. Kalimantan No. 12 Jember',
            'phone' => '081234567890',
            'pic_name' => 'Budi Santoso',
        ]);
    }

    private function pickup(string $status, Carbon $date): Pickup
    {
        return Pickup::create(['company_id' => $this->company->id, 'pickup_date' => $date->toDateString(), 'status' => $status]);
    }

    public function test_marks_only_unfinished_pickups_of_recent_past_days(): void
    {
        $scheduled = $this->pickup('scheduled', Carbon::yesterday());
        $otw = $this->pickup('on_the_way', Carbon::today()->subDays(2));
        $done = $this->pickup('completed', Carbon::yesterday());
        $cancelled = $this->pickup('failed', Carbon::yesterday());
        $today = $this->pickup('scheduled', Carbon::today());
        $old = $this->pickup('scheduled', Carbon::today()->subDays(10)); // outside the 3-day window

        $this->artisan('pickups:mark-missed')->assertSuccessful();

        $this->assertSame(
            ['missed', 'missed', 'completed', 'failed', 'scheduled', 'scheduled'],
            collect([$scheduled, $otw, $done, $cancelled, $today, $old])->map(fn ($p) => $p->fresh()->status)->all(),
        );
    }

    public function test_missed_pickup_can_still_be_completed_by_late_offline_sync(): void
    {
        Storage::fake('public');
        $crew = User::factory()->create(['role' => 'CleanUP']);
        $this->clockIn($crew, 'yesterday');
        $pickup = $this->pickup('scheduled', Carbon::yesterday());
        $this->artisan('pickups:mark-missed');

        $this->actingAs($crew)->withHeaders(['X-Background-Sync' => 'true', 'Accept' => 'application/json'])
            ->post(route('cleanup.submitPickup', $pickup->id), [
                'trash_bag_count' => 3,
                'evidence_pickup_path' => UploadedFile::fake()->image('bukti.jpg'),
                'offline_recorded_at' => Carbon::yesterday()->setTime(17, 0)->toIso8601String(),
            ])->assertOk();

        $this->assertSame('completed', $pickup->fresh()->status);
    }

    public function test_afternoon_reminder_lists_partners_not_yet_collected(): void
    {
        Notification::fake();
        $coordinator = User::factory()->create(['role' => 'coordinator', 'is_active' => true]);
        $this->pickup('scheduled', Carbon::today());
        $this->pickup('completed', Carbon::today());

        $this->artisan('push:reminders pickups')->assertSuccessful();

        Notification::assertSentTo($coordinator, AppNotice::class, function (AppNotice $n) {
            $data = $n->toArray($n);
            return str_contains(json_encode($data), '1 dari 2 mitra belum dijemput')
                && str_contains(json_encode($data), 'PT Sumber Sampah Bersih');
        });
    }
}
