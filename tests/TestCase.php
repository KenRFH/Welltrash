<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /** Crew must be clocked in on the pickup day before working on it (Pickup::refusalFor). */
    protected function clockIn(\App\Models\User $user, $date = null): void
    {
        \App\Models\Attendance::firstOrCreate(
            ['user_id' => $user->id, 'date' => \Carbon\Carbon::parse($date ?? 'today')->toDateString()],
            ['clock_in_at' => now(), 'status' => 'incomplete'],
        );
    }
}
