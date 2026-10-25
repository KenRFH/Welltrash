<?php

namespace Tests\Feature;

use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QuickLoginDemoTest extends TestCase
{
    use RefreshDatabase;

    public function test_quick_login_roles_redirect_to_correct_dashboards_with_actor_isolation(): void
    {
        $this->seed(UserSeeder::class);

        // 1. Mitra logs in via /login -> company.dashboard
        $mitraRes = $this->post('/login', [
            'email' => 'company@welltrash.com',
            'password' => 'company123',
        ]);
        $mitraRes->assertRedirect(route('company.dashboard'));
        $this->post('/logout');

        // 2. Internal staff log in via /admin/login
        $staffAccounts = [
            ['email' => 'admin@welltrash.com', 'password' => 'admin123', 'route' => 'admin.dashboard'],
            ['email' => 'webadmin@welltrash.com', 'password' => 'webadmin123', 'route' => 'webadmin.dashboard'],
            ['email' => 'cleanup@welltrash.com', 'password' => 'cleanup123', 'route' => 'cleanup.dashboard'],
        ];

        foreach ($staffAccounts as $acc) {
            $response = $this->post('/admin/login', [
                'email' => $acc['email'],
                'password' => $acc['password'],
            ]);

            $response->assertRedirect(route($acc['route']));
            $this->post('/logout');
        }

        // 3. Staff can also log in directly via /login
        $adminRes = $this->post('/login', [
            'email' => 'admin@welltrash.com',
            'password' => 'admin123',
        ]);
        $adminRes->assertRedirect(route('admin.dashboard'));
        $this->post('/logout');

        // 4. Actor boundary guard: Mitra cannot login via /admin/login
        $blockedMitra = $this->post('/admin/login', [
            'email' => 'company@welltrash.com',
            'password' => 'company123',
        ]);
        $blockedMitra->assertSessionHasErrors('email');
        $this->assertGuest();
    }

    public function test_local_mode_allows_admin_and_operator_via_login_route(): void
    {
        $this->seed(UserSeeder::class);
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);

        app()->detectEnvironment(fn () => 'local');

        $adminRes = $this->post('/login', [
            'email' => 'admin@welltrash.com',
            'password' => 'admin123',
        ]);
        $adminRes->assertRedirect(route('admin.dashboard'));
        $this->post('/logout');

        $cleanupRes = $this->post('/login', [
            'email' => 'cleanup@welltrash.com',
            'password' => 'cleanup123',
        ]);
        $cleanupRes->assertRedirect(route('cleanup.dashboard'));
        $this->post('/logout');
    }

    public function test_local_mode_auto_seeds_missing_demo_accounts_on_login(): void
    {
        $this->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class);
        app()->detectEnvironment(fn () => 'local');

        $this->assertDatabaseMissing('users', ['email' => 'admin@welltrash.com']);

        $res = $this->post('/login', [
            'email' => 'admin@welltrash.com',
            'password' => 'admin123',
        ]);

        $res->assertRedirect(route('admin.dashboard'));
        $this->assertDatabaseHas('users', ['email' => 'admin@welltrash.com']);
    }
}
