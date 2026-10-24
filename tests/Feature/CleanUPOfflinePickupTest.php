<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Pickup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class CleanUPOfflinePickupTest extends TestCase
{
    use RefreshDatabase;

    protected User $cleanupUser;
    protected Company $company;

    protected function setUp(): void
    {
        parent::setUp();
        Storage::fake('public');

        $this->cleanupUser = User::factory()->create([
            'role' => 'CleanUP',
        ]);

        $companyOwner = User::factory()->create([
            'role' => 'Company',
        ]);

        $this->company = Company::create([
            'user_id' => $companyOwner->id,
            'company_name' => 'PT Sumber Sampah Bersih',
            'business_type' => 'Restoran',
            'address' => 'Jl. Kalimantan No. 12 Jember',
            'phone' => '081234567890',
            'pic_name' => 'Budi Santoso',
            'status' => 'approved',
        ]);
    }

    public function test_cleanup_operator_can_access_manual_sync_page()
    {
        $response = $this->actingAs($this->cleanupUser)
            ->get(route('cleanup.sync'));

        $response->assertOk();
    }

    public function test_cleanup_sync_status_endpoint_returns_json_credentials()
    {
        $response = $this->actingAs($this->cleanupUser)
            ->getJson(route('cleanup.syncStatus'));

        $response->assertOk()
            ->assertJsonStructure([
                'authenticated',
                'csrf',
                'user' => ['id', 'name'],
                'server_time',
            ])
            ->assertJson([
                'authenticated' => true,
                'user' => [
                    'id' => $this->cleanupUser->id,
                ],
            ]);
    }

    public function test_cleanup_can_submit_today_pickup_with_json_response()
    {
        $pickup = Pickup::create([
            'company_id' => $this->company->id,
            'pickup_date' => Carbon::today()->toDateString(),
            'status' => 'scheduled',
        ]);

        $image = UploadedFile::fake()->image('evidence.jpg');

        $response = $this->actingAs($this->cleanupUser)
            ->withHeaders([
                'X-Background-Sync' => 'true',
                'Accept' => 'application/json',
            ])
            ->post(route('cleanup.submitPickup', $pickup->id), [
                'organic_weight' => '12.50',
                'anorganic_weight' => '8.25',
                'residue_weight' => '2.10',
                'evidence_pickup_path' => $image,
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'pickup_id' => $pickup->id,
            ]);

        $this->assertDatabaseHas('pickups', [
            'id' => $pickup->id,
            'cleanup_id' => $this->cleanupUser->id,
            'status' => 'completed',
            'organic_weight' => 12.50,
            'anorganic_weight' => 8.25,
            'residue_weight' => 2.10,
        ]);
    }

    public function test_cleanup_can_submit_offline_pickup_from_yesterday_within_grace_period()
    {
        $yesterday = Carbon::yesterday();

        $pickup = Pickup::create([
            'company_id' => $this->company->id,
            'pickup_date' => $yesterday->toDateString(),
            'status' => 'scheduled',
        ]);

        $image = UploadedFile::fake()->image('offline_evidence.jpg');

        // Recorded yesterday afternoon, synced today (within 24-48 hours)
        $offlineRecordedAt = $yesterday->copy()->setTime(17, 30, 0)->toIso8601String();

        $response = $this->actingAs($this->cleanupUser)
            ->withHeaders([
                'X-Background-Sync' => 'true',
                'Accept' => 'application/json',
            ])
            ->post(route('cleanup.submitPickup', $pickup->id), [
                'organic_weight' => '15.00',
                'anorganic_weight' => '10.00',
                'residue_weight' => '3.00',
                'evidence_pickup_path' => $image,
                'offline_recorded_at' => $offlineRecordedAt,
            ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'pickup_id' => $pickup->id,
            ]);

        $pickup->refresh();
        $this->assertEquals('completed', $pickup->status);
        $this->assertEquals(15.00, $pickup->organic_weight);
    }

    public function test_cleanup_cannot_submit_pickup_exceeding_grace_period()
    {
        $threeDaysAgo = Carbon::today()->subDays(3);

        $pickup = Pickup::create([
            'company_id' => $this->company->id,
            'pickup_date' => $threeDaysAgo->toDateString(),
            'status' => 'scheduled',
        ]);

        $image = UploadedFile::fake()->image('old_evidence.jpg');
        $recordedAt = $threeDaysAgo->copy()->setTime(10, 0, 0)->toIso8601String();

        $response = $this->actingAs($this->cleanupUser)
            ->withHeaders([
                'X-Background-Sync' => 'true',
                'Accept' => 'application/json',
            ])
            ->post(route('cleanup.submitPickup', $pickup->id), [
                'organic_weight' => '5.00',
                'anorganic_weight' => '5.00',
                'residue_weight' => '1.00',
                'evidence_pickup_path' => $image,
                'offline_recorded_at' => $recordedAt,
            ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);

        $pickup->refresh();
        $this->assertEquals('scheduled', $pickup->status);
    }
}
