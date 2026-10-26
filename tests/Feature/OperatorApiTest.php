<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\Pickup;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class OperatorApiTest extends TestCase
{
    use RefreshDatabase;

    private function createOperator(array $overrides = []): User
    {
        return User::create(array_merge([
            'name'     => 'Operator CleanUP',
            'email'    => 'operator@welltrash.test',
            'password' => Hash::make('password123'),
            'role'     => 'CleanUP',
        ], $overrides));
    }

    public function test_login_rejects_invalid_credentials(): void
    {
        $this->createOperator();

        $response = $this->postJson('/api/operator/login', [
            'email'    => 'operator@welltrash.test',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['success' => false]);
    }

    public function test_login_rejects_non_cleanup_role(): void
    {
        User::create([
            'name'     => 'Client User',
            'email'    => 'client@welltrash.test',
            'password' => Hash::make('password123'),
            'role'     => 'client',
        ]);

        $response = $this->postJson('/api/operator/login', [
            'email'    => 'client@welltrash.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson(['success' => false]);
    }

    public function test_operator_login_issues_token_and_me_returns_profile(): void
    {
        $operator = $this->createOperator();

        $loginResponse = $this->postJson('/api/operator/login', [
            'email'    => 'operator@welltrash.test',
            'password' => 'password123',
        ]);

        $loginResponse->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonStructure(['token', 'user']);

        $token = $loginResponse->json('token');

        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/operator/me');

        $meResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'user'    => [
                    'id'    => $operator->id,
                    'email' => 'operator@welltrash.test',
                    'role'  => 'CleanUP',
                ],
            ]);
    }

    public function test_operator_can_view_pickups_and_submit_completion(): void
    {
        Storage::fake('public');
        $operator = $this->createOperator();
        $token = $operator->createToken('test')->plainTextToken;

        $clientUser = User::create([
            'name'     => 'PT ABC Client',
            'email'    => 'company@welltrash.test',
            'password' => Hash::make('password123'),
            'role'     => 'client',
        ]);

        $company = Company::create([
            'user_id'             => $clientUser->id,
            'company_name'        => 'PT ABC Indonesia',
            'pic_name'            => 'Budi',
            'phone'               => '081234567890',
            'address'             => 'Jl. Sudirman No 1',
            'business_category'   => 'F&B',
            'subscription_plan'   => 'Premium',
            'subscription_status' => 'active',
        ]);

        $today = Carbon::today()->toDateString();
        $pickup = Pickup::create([
            'company_id'  => $company->id,
            'cleanup_id'  => $operator->id,
            'pickup_date' => $today,
            'status'      => 'scheduled',
        ]);

        $listResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/operator/pickups?date=' . $today);

        $listResponse->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(1, 'pickups');

        $fakePhoto = UploadedFile::fake()->image('evidence.jpg');
        $submitResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson("/api/operator/pickups/{$pickup->id}/submit", [
                'trash_bag_count'      => 4,
                'organic_weight'       => 12.5,
                'anorganic_weight'     => 8.0,
                'residue_weight'       => 3.2,
                'evidence_pickup_path' => $fakePhoto,
            ]);

        $submitResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'pickup'  => [
                    'status'          => 'completed',
                    'trash_bag_count' => 4,
                ],
            ]);

        $this->assertDatabaseHas('pickups', [
            'id'              => $pickup->id,
            'status'          => 'completed',
            'trash_bag_count' => 4,
        ]);
    }

    public function test_operator_attendance_flow(): void
    {
        $operator = $this->createOperator();
        $token = $operator->createToken('test')->plainTextToken;

        // Clock in
        $clockInResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/attendance/clock-in', [
                'lat' => -6.2088,
                'lng' => 106.8456,
            ]);

        $clockInResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // Status check
        $statusResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/operator/attendance/status');

        $statusResponse->assertStatus(200)
            ->assertJson([
                'success'    => true,
                'attendance' => [
                    'user_id' => $operator->id,
                    'status'  => 'incomplete',
                ],
            ]);

        // Clock out
        $clockOutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/attendance/clock-out', [
                'lat' => -6.2088,
                'lng' => 106.8456,
            ]);

        $clockOutResponse->assertStatus(200)
            ->assertJson([
                'success'    => true,
                'attendance' => [
                    'status' => 'present',
                ],
            ]);
    }

    public function test_operator_can_update_pickup_status_and_logout(): void
    {
        $operator = $this->createOperator();
        $token = $operator->createToken('test')->plainTextToken;

        $clientUser = User::create([
            'name'     => 'PT ABC Client 2',
            'email'    => 'company2@welltrash.test',
            'password' => Hash::make('password123'),
            'role'     => 'client',
        ]);

        $company = Company::create([
            'user_id'             => $clientUser->id,
            'company_name'        => 'PT ABC Dua',
            'pic_name'            => 'Budi Dua',
            'phone'               => '081234567891',
            'address'             => 'Jl. Thamrin No 2',
            'business_category'   => 'Retail',
            'subscription_plan'   => 'Standard',
            'subscription_status' => 'active',
        ]);

        $pickup = Pickup::create([
            'company_id'  => $company->id,
            'cleanup_id'  => $operator->id,
            'pickup_date' => Carbon::today()->toDateString(),
            'status'      => 'scheduled',
        ]);

        // Update status to on_the_way
        $updateResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson("/api/operator/pickups/{$pickup->id}/status", [
                'status' => 'on_the_way',
            ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
                'pickup'  => ['status' => 'on_the_way'],
            ]);

        // Logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // Token deleted from DB
        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Reusing token on fresh guard must fail
        $this->app['auth']->forgetGuards();
        $forbiddenResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/operator/me');

        $forbiddenResponse->assertStatus(401);
    }

    public function test_operator_can_list_companies_and_store_activity(): void
    {
        Storage::fake('public');
        $operator = $this->createOperator();
        $token = $operator->createToken('test')->plainTextToken;

        $clientUser = User::create([
            'name'     => 'PT ABC Client 3',
            'email'    => 'company3@welltrash.test',
            'password' => Hash::make('password123'),
            'role'     => 'client',
        ]);

        $company = Company::create([
            'user_id'             => $clientUser->id,
            'company_name'        => 'PT Daur Ulang',
            'pic_name'            => 'Siti',
            'phone'               => '081234567899',
            'address'             => 'Jl. Industri No 5',
            'business_category'   => 'Manufacture',
            'subscription_plan'   => 'Enterprise',
            'subscription_status' => 'active',
        ]);

        // Companies list
        $companiesResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/operator/companies');

        $companiesResponse->assertStatus(200)
            ->assertJson(['success' => true])
            ->assertJsonCount(1, 'companies');

        // Store activity
        $fakeImage = UploadedFile::fake()->image('activity.jpg');
        $storeResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/activities', [
                'company_id'    => $company->id,
                'activity_date' => Carbon::today()->toDateString(),
                'note'          => 'Pemilahan sampah botol plastik',
                'media'         => $fakeImage,
            ]);

        $storeResponse->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('company_activities', [
            'company_id' => $company->id,
            'note'       => 'Pemilahan sampah botol plastik',
        ]);
    }

    public function test_operator_can_request_overtime_and_leave(): void
    {
        $operator = $this->createOperator();
        $token = $operator->createToken('test')->plainTextToken;

        // Overtime request
        $overtimeResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/attendance/overtime/request', [
                'date'   => Carbon::tomorrow()->toDateString(),
                'reason' => 'Pengangkutan tumpukan sampah ekstra',
            ]);

        $overtimeResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('overtime_requests', [
            'user_id' => $operator->id,
            'reason'  => 'Pengangkutan tumpukan sampah ekstra',
            'status'  => 'pending',
        ]);

        // Leave request
        $leaveResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/operator/leave-request', [
                'date'   => Carbon::tomorrow()->addDay()->toDateString(),
                'type'   => 'izin',
                'reason' => 'Keperluan keluarga',
            ]);

        $leaveResponse->assertStatus(201)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('leave_requests', [
            'user_id' => $operator->id,
            'type'    => 'izin',
            'status'  => 'pending',
        ]);
    }
}
