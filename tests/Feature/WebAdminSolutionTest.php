<?php

namespace Tests\Feature;

use App\Models\Solution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WebAdminSolutionTest extends TestCase
{
    use RefreshDatabase;

    public function test_web_admin_can_delete_solution(): void
    {
        $admin = User::factory()->create(['role' => 'web_admin']);
        $solution = Solution::create([
            'title' => 'Test Solution',
            'desc' => 'Test Description',
            'segment' => 'B2B',
            'tag' => 'Limbah',
            'badge_color' => 'emerald',
            'icon' => 'Building2',
            'order_num' => 1,
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)
            ->withoutMiddleware(\Illuminate\Foundation\Http\Middleware\ValidateCsrfToken::class)
            ->delete(route('webadmin.solutions.destroy', $solution));

        $response->assertRedirect(route('webadmin.solutions.index'));
        $this->assertDatabaseMissing('solutions', ['id' => $solution->id]);
    }

    public function test_landing_page_does_not_render_keunggulan_operasional(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertDontSee('KEUNGGULAN OPERASIONAL');
        $response->assertDontSee('Partner operasional yang dapat Anda andalkan.');
    }

    public function test_landing_page_does_not_render_service_tiers_info_bar(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertDontSee('Sesuaikan ritme pengangkutan dengan kapasitas operasional Anda');
    }

    public function test_landing_page_renders_solutions_and_katalogs(): void
    {
        $solution = Solution::create([
            'title' => 'Corporate Waste Management',
            'desc' => 'Pengangkutan terjadwal untuk ritel dan perkantoran.',
            'segment' => 'Komersial',
            'tag' => 'Logistik Terjadwal',
            'badge_color' => 'emerald',
            'icon' => 'Building2',
            'order_num' => 1,
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('Corporate Waste Management');
    }
}
