<?php

use App\Models\Activity;

test('activity page ships link-preview tags in the raw HTML', function () {
    $activity = Activity::create([
        'title' => 'Aksi Bersih Pantai',
        'description' => "![](/storage/content/a.jpg)\n\n## Sub\nIsi **penting** kegiatan.",
        'image_path' => 'activities/cover.jpg',
        'date' => '2026-11-20',
    ]);

    // Old id-only links 301 to the canonical slug URL.
    $this->get("/activity/{$activity->id}")
        ->assertStatus(301)
        ->assertRedirect("/activity/{$activity->id}/aksi-bersih-pantai");

    $this->get("/activity/{$activity->id}/aksi-bersih-pantai")
        ->assertOk()
        ->assertSee('<meta property="og:title" content="Aksi Bersih Pantai | Aktivitas WellTrash">', false)
        ->assertSee('<link rel="canonical" href="' . url("/activity/{$activity->id}/aksi-bersih-pantai") . '">', false)
        ->assertSee('<meta property="og:description" content="Sub Isi penting kegiatan.">', false)
        ->assertSee('storage/activities/cover.jpg', false);
});

test('public pages get their own title and description in the raw HTML', function () {
    $this->get('/layanan')
        ->assertOk()
        ->assertSee('<title inertia>Harga &amp; Paket Jasa Angkut Sampah Jember | WellTrash</title>', false)
        ->assertSee('<meta name="description" content="Paket jasa angkut sampah', false)
        ->assertSee('"@type":"LocalBusiness"', false);
});

test('sitemap command lists public pages and activities with slugs', function () {
    $activity = Activity::create(['title' => 'Aksi Bersih Pantai', 'description' => 'x', 'date' => '2026-11-20']);
    $path = public_path('sitemap.xml');
    $before = @file_get_contents($path);

    $this->artisan('sitemap:generate')->assertSuccessful();
    $xml = file_get_contents($path);
    $before === false ? @unlink($path) : file_put_contents($path, $before);

    expect($xml)->toContain('/layanan</loc>')
        ->toContain("/activity/{$activity->id}/aksi-bersih-pantai</loc>")
        ->not->toContain('/news');
});
