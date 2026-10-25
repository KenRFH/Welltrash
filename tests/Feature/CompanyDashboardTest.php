<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\CompanySeeder;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CompanyDashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_company_can_render_dashboard_screen(): void
    {
        $this->seed([UserSeeder::class, CompanySeeder::class]);

        $user = User::where('email', 'company@welltrash.com')->first();
        $this->assertNotNull($user);

        $response = $this->actingAs($user)->get(route('company.dashboard'));

        $response->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Company/Dashboard')
                ->has('company')
                ->has('statistics')
                ->has('weekly_statistics')
            );
    }
}

