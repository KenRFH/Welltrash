<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Company;
use App\Models\Pickup;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;

class OperationalVehicleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    }

    public function test_admin_can_manage_vehicle_inventory(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $vehicle = Vehicle::create([
            'name'          => 'Truk Isuzu Elf 01',
            'license_plate' => 'P 8492 GA',
            'type'          => 'Truk Boks',
            'capacity'      => '4 m³',
            'status'        => 'active',
        ]);

        $this->actingAs($admin)->get(route('admin.vehicles.index'))->assertOk();

        // Create
        $this->actingAs($admin)->post(route('admin.vehicles.store'), [
            'name'          => 'Suzuki Carry Bak 02',
            'license_plate' => 'P 9911 ZZ',
            'type'          => 'Pick Up',
            'capacity'      => '2 m³',
            'status'        => 'active',
        ])->assertRedirect();
        $this->assertDatabaseHas('vehicles', ['license_plate' => 'P 9911 ZZ']);

        // Update
        $this->actingAs($admin)->put(route('admin.vehicles.update', $vehicle->id), [
            'name'          => 'Truk Isuzu Elf 01 Updated',
            'license_plate' => 'P 8492 GA',
            'type'          => 'Truk Boks',
            'capacity'      => '5 m³',
            'status'        => 'active',
        ])->assertRedirect();
        $this->assertDatabaseHas('vehicles', ['name' => 'Truk Isuzu Elf 01 Updated']);

        // Toggle
        $this->actingAs($admin)->patch(route('admin.vehicles.toggleStatus', $vehicle->id), [
            'status' => 'maintenance',
        ])->assertRedirect();
        $this->assertDatabaseHas('vehicles', ['id' => $vehicle->id, 'status' => 'maintenance']);

        // Delete
        $this->actingAs($admin)->delete(route('admin.vehicles.destroy', $vehicle->id))->assertRedirect();
        $this->assertDatabaseMissing('vehicles', ['id' => $vehicle->id]);
    }

    public function test_operator_can_select_active_vehicle(): void
    {
        $operator = User::factory()->create(['role' => 'CleanUP']);
        $vehicle = Vehicle::create([
            'name' => 'Truk Isuzu 01', 'license_plate' => 'P 8492 GA', 'type' => 'Truk Boks', 'status' => 'active',
        ]);

        // Web endpoint
        $this->actingAs($operator)->post(route('cleanup.selectVehicle'), [
            'vehicle_id' => $vehicle->id,
        ])->assertRedirect();
        $operator->refresh();
        $this->assertEquals($vehicle->id, $operator->vehicle_id);

        // Mobile API
        $token = $operator->createToken('token')->plainTextToken;
        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson(route('api.operator.vehicles'))
            ->assertOk()
            ->assertJsonPath('vehicles.0.license_plate', 'P 8492 GA');

        $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson(route('api.operator.me'))
            ->assertOk()
            ->assertJsonPath('user.vehicle.license_plate', 'P 8492 GA');
    }

    public function test_admin_and_mitra_monitors_show_used_vehicle(): void
    {
        $vehicle = Vehicle::create([
            'name' => 'Truk Isuzu Elf 01', 'license_plate' => 'P 8492 GA', 'type' => 'Truk Boks', 'status' => 'active',
        ]);
        $operator = User::factory()->create([
            'role' => 'CleanUP', 'vehicle_id' => $vehicle->id, 'current_lat' => -8.17, 'current_lng' => 113.70, 'last_location_at' => Carbon::now(),
        ]);
        $companyUser = User::factory()->create(['role' => 'company']);
        $company = Company::create([
            'user_id' => $companyUser->id, 'company_name' => 'RSUD dr. Soebandi', 'pic_name' => 'dr. Hendra', 'phone' => '08123456789', 'address' => 'Jl. Dr. Soebandi', 'latitude' => -8.16, 'longitude' => 113.71, 'subscription_status' => 'active',
        ]);
        Pickup::create([
            'company_id' => $company->id, 'cleanup_id' => $operator->id, 'vehicle_id' => $vehicle->id, 'pickup_date' => Carbon::today()->toDateString(), 'status' => 'on_the_way',
        ]);

        // Admin monitor
        $admin = User::factory()->create(['role' => 'admin']);
        $this->actingAs($admin)->getJson(route('admin.cleanups.liveLocations'))
            ->assertOk()
            ->assertJsonPath('cleanups.0.vehicle.license_plate', 'P 8492 GA')
            ->assertJsonPath('companies.0.vehicle_plate', 'P 8492 GA');

        // Mitra monitor
        $this->actingAs($companyUser)->getJson(route('company.tracking.active'))
            ->assertOk()
            ->assertJson([
                'tracking_active' => true,
                'vehicle' => ['license_plate' => 'P 8492 GA', 'name' => 'Truk Isuzu Elf 01'],
            ]);
    }

    public function test_exclusive_vehicle_assignment_rejects_second_driver(): void
    {
        $vehicle = Vehicle::create([
            'name' => 'Truk Isuzu 01', 'license_plate' => 'P 8492 GA', 'type' => 'Truk Boks', 'status' => 'active',
        ]);

        $driver1 = User::factory()->create(['name' => 'Driver Satu', 'role' => 'CleanUP', 'vehicle_id' => $vehicle->id]);
        $driver2 = User::factory()->create(['name' => 'Driver Dua', 'role' => 'CleanUP']);

        // Driver 2 tries via web
        $res = $this->actingAs($driver2)->post(route('cleanup.selectVehicle'), [
            'vehicle_id' => $vehicle->id,
        ]);
        $res->assertSessionHas('error');
        $driver2->refresh();
        $this->assertNull($driver2->vehicle_id);

        // Driver 2 tries via API
        $token2 = $driver2->createToken('token2')->plainTextToken;
        $apiRes = $this->withHeader('Authorization', 'Bearer ' . $token2)
            ->postJson(route('api.operator.vehicle.select'), ['vehicle_id' => $vehicle->id]);
        $apiRes->assertStatus(422)
            ->assertJsonPath('success', false);

        // Check vehicles list shows is_occupied
        $listRes = $this->withHeader('Authorization', 'Bearer ' . $token2)
            ->getJson(route('api.operator.vehicles'));
        $listRes->assertOk()
            ->assertJsonPath('vehicles.0.is_occupied', true)
            ->assertJsonPath('vehicles.0.occupied_by', 'Driver Satu');
    }

    public function test_clock_out_automatically_releases_vehicle(): void
    {
        $vehicle = Vehicle::create([
            'name' => 'Truk Isuzu 01', 'license_plate' => 'P 8492 GA', 'type' => 'Truk Boks', 'status' => 'active',
        ]);
        $operator = User::factory()->create(['role' => 'CleanUP', 'vehicle_id' => $vehicle->id]);

        \App\Models\Attendance::create([
            'user_id'     => $operator->id,
            'date'        => Carbon::today()->toDateString(),
            'clock_in_at' => Carbon::now()->subHours(8),
            'status'      => 'present',
        ]);

        // Clock out via mobile API
        $token = $operator->createToken('token')->plainTextToken;
        $res = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson(route('api.operator.attendance.clockOut'), [
                'lat' => -8.17, 'lng' => 113.70,
            ]);
        $res->assertOk();

        $operator->refresh();
        $this->assertNull($operator->vehicle_id);
    }
}
