<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LandingPageThemeTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_includes_dark_theme_initialization_script(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('localStorage.getItem(\'theme\')', false);
        $response->assertSee('prefers-color-scheme: dark', false);
        $response->assertSee('dark:bg-zinc-950', false);
    }
}

