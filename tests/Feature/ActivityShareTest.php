<?php

use App\Models\Activity;

test('activity page ships link-preview tags in the raw HTML', function () {
    $activity = Activity::create([
        'title' => 'Aksi Bersih Pantai',
        'description' => "![](/storage/content/a.jpg)\n\n## Sub\nIsi **penting** kegiatan.",
        'image_path' => 'activities/cover.jpg',
        'date' => '2026-11-20',
    ]);

    $this->get("/activity/{$activity->id}")
        ->assertOk()
        ->assertSee('<meta property="og:title" content="Aksi Bersih Pantai | Aktivitas Welltrash">', false)
        ->assertSee('<meta property="og:description" content="Sub Isi penting kegiatan.">', false)
        ->assertSee('storage/activities/cover.jpg', false);
});
