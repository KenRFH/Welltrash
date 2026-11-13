<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AccountActivationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
    }

    public function test_admin_can_deactivate_and_reactivate_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $mitra = User::factory()->create(['role' => 'company']);

        $this->actingAs($admin)->patch(route('admin.accounts.toggleActive', $mitra))->assertRedirect();
        $this->assertFalse($mitra->fresh()->is_active);

        $this->actingAs($admin)->patch(route('admin.accounts.toggleActive', $mitra))->assertRedirect();
        $this->assertTrue($mitra->fresh()->is_active);
    }

    public function test_admin_cannot_deactivate_self(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $this->actingAs($admin)->patch(route('admin.accounts.toggleActive', $admin));
        $this->assertTrue($admin->fresh()->is_active);
    }

    public function test_deactivated_account_cannot_login(): void
    {
        $user = User::factory()->create(['role' => 'company', 'is_active' => false]);

        $this->post('/login', ['email' => $user->email, 'password' => 'password'])
            ->assertSessionHasErrors('email');
        $this->assertGuest();

        $this->postJson('/api/operator/login', ['email' => $user->email, 'password' => 'password'])
            ->assertStatus(403);
    }

    public function test_deactivated_account_is_logged_out_of_existing_session(): void
    {
        $operator = User::factory()->create(['role' => 'CleanUP']);
        $operator->update(['is_active' => false]);

        $this->actingAs($operator->fresh())->get(route('cleanup.dashboard'))->assertRedirect(route('login'));
        $this->assertGuest();
    }
}
