<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Company;
use App\Models\Pickup;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class LiveGpsTrackingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    }

    public function test_cleanup_operator_can_update_gps_location(): void
    {
        $operator = User::factory()->create([
            'role' => 'CleanUP',
        ]);

        $response = $this->actingAs($operator)
            ->postJson(route('cleanup.location.update'), [
                'lat' => -8.1724,
                'lng' => 113.6995,
            ]);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $operator->refresh();
        $this->assertEquals(-8.1724, round($operator->current_lat, 4));
        $this->assertEquals(113.6995, round($operator->current_lng, 4));
        $this->assertNotNull($operator->last_location_at);
    }

    public function test_operator_can_update_gps_via_mobile_api(): void
    {
        $operator = User::factory()->create(['role' => 'CleanUP']);
        $token = $operator->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson(route('api.operator.location'), [
                'lat' => -8.1800,
                'lng' => 113.7200,
            ]);

        $response->assertOk()
            ->assertJson(['success' => true]);

        $operator->refresh();
        $this->assertEquals(-8.1800, round($operator->current_lat, 4));
        $this->assertEquals(113.7200, round($operator->current_lng, 4));
        $this->assertNotNull($operator->last_location_at);
    }

    public function test_admin_can_retrieve_live_fleet_locations(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $operator = User::factory()->create([
            'role'             => 'CleanUP',
            'current_lat'      => -8.1700,
            'current_lng'      => 113.7000,
            'last_location_at' => Carbon::now(),
        ]);

        $response = $this->actingAs($admin)
            ->getJson(route('admin.cleanups.liveLocations'));

        $response->assertOk()
            ->assertJsonStructure([
                'cleanups' => [
                    '*' => [
                        'id',
                        'name',
                        'current_lat',
                        'current_lng',
                        'is_online',
                        'active_task',
                    ],
                ],
            ]);

        $this->assertTrue(
            collect($response->json('cleanups'))->contains('id', $operator->id)
        );
    }

    public function test_company_can_track_assigned_operator_when_on_the_way(): void
    {
        $companyUser = User::factory()->create(['role' => 'company']);
        $company = Company::create([
            'user_id'              => $companyUser->id,
            'company_name'         => 'PT Sumber Makmur',
            'pic_name'             => 'Bambang',
            'address'              => 'Jl. Mastrip No 5, Jember',
            'latitude'             => -8.1650,
            'longitude'            => 113.7120,
            'phone'                => '08123456789',
            'subscription_plan'    => 'Prime',
            'subscription_status'  => 'active',
            'signed_mou_path'      => 'documents/mous/sample.pdf',
        ]);

        $operator = User::factory()->create([
            'role'             => 'CleanUP',
            'current_lat'      => -8.1680,
            'current_lng'      => 113.7050,
            'last_location_at' => Carbon::now(),
        ]);

        // Pickup today with status on_the_way
        $pickup = Pickup::create([
            'company_id'  => $company->id,
            'cleanup_id'  => $operator->id,
            'pickup_date' => Carbon::today()->toDateString(),
            'status'      => 'on_the_way',
        ]);

        $response = $this->actingAs($companyUser)
            ->getJson(route('company.tracking.active'));

        $response->assertOk()
            ->assertJson([
                'tracking_active' => true,
                'pickup' => [
                    'id'     => $pickup->id,
                    'status' => 'on_the_way',
                ],
                'driver' => [
                    'name' => $operator->name,
                ],
                'destination' => [
                    'company_name' => 'PT Sumber Makmur',
                ],
            ]);
    }

    public function test_company_tracking_returns_false_when_no_active_pickup(): void
    {
        $companyUser = User::factory()->create(['role' => 'company']);
        Company::create([
            'user_id'              => $companyUser->id,
            'company_name'         => 'PT Sunyi Senyap',
            'pic_name'             => 'Dewi',
            'address'              => 'Jl. Jawa No 10, Jember',
            'phone'                => '08129876543',
            'subscription_plan'    => 'Reguler',
            'subscription_status'  => 'active',
            'signed_mou_path'      => 'documents/mous/sample2.pdf',
        ]);

        $response = $this->actingAs($companyUser)
            ->getJson(route('company.tracking.active'));

        $response->assertOk()
            ->assertJson(['tracking_active' => false]);
    }
}
