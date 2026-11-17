<?php

namespace Tests\Feature;

use App\Models\Agenda;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AgendaTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role): User
    {
        return User::create(['name' => ucfirst($role), 'email' => uniqid() . '@welltrash.test', 'password' => Hash::make('x'), 'role' => $role]);
    }

    public function test_only_manager_and_up_can_use_agenda(): void
    {
        Sanctum::actingAs($this->user('coordinator'));
        $this->getJson('/api/admin/agendas')->assertForbidden();
        $this->getJson('/api/admin/dashboard')->assertOk()->assertJsonPath('agendas', null);

        Sanctum::actingAs($this->user('manager'));
        $this->postJson('/api/admin/agendas', ['title' => 'Rapat mitra', 'starts_at' => now()->addDay()->toDateTimeString(), 'remind_minutes' => 60])
            ->assertCreated()->assertJsonPath('data.can_edit', true);
        $next = now()->addDay();
        $this->getJson('/api/admin/agendas?month=' . $next->format('Y-m'))->assertOk()->assertJsonCount(1, 'data');
        $this->getJson('/api/admin/agendas?month=' . $next->copy()->addMonthNoOverflow()->format('Y-m'))->assertOk()->assertJsonCount(0, 'data');
        $this->getJson('/api/admin/agendas?month=2026-13')->assertUnprocessable();
        $this->getJson('/api/admin/dashboard')->assertJsonPath('agendas.0.title', 'Rapat mitra');
        $this->postJson('/api/admin/agendas', ['title' => 'x', 'starts_at' => now()->toDateTimeString(), 'remind_minutes' => 7])->assertUnprocessable();
        // UTC from the app is stored as WIB wall time.
        $this->postJson('/api/admin/agendas', ['title' => 'UTC', 'starts_at' => '2026-12-01T02:00:00.000Z'])->assertJsonPath('data.starts_at', '2026-12-01T09:00:00+07:00');
    }

    public function test_only_creator_or_director_can_edit(): void
    {
        $owner = $this->user('manager');
        $agenda = Agenda::create(['title' => 'Kunjungan', 'starts_at' => now()->addDay(), 'created_by' => $owner->id]);
        $payload = ['title' => 'Kunjungan baru', 'starts_at' => now()->addDays(2)->toDateTimeString()];

        Sanctum::actingAs($this->user('manager'));
        $this->putJson("/api/admin/agendas/{$agenda->id}", $payload)->assertForbidden();
        $this->deleteJson("/api/admin/agendas/{$agenda->id}")->assertForbidden();

        Sanctum::actingAs($this->user('director'));
        $this->putJson("/api/admin/agendas/{$agenda->id}", $payload)->assertOk()->assertJsonPath('data.title', 'Kunjungan baru');
        $this->deleteJson("/api/admin/agendas/{$agenda->id}")->assertOk();
        $this->assertDatabaseCount('agendas', 0);
    }

    public function test_reminder_fires_once_to_manager_and_director_only(): void
    {
        Carbon::setTestNow('2026-11-18 08:00:00');
        $manager = $this->user('manager');
        $director = $this->user('director');
        $coordinator = $this->user('coordinator');
        $soon = Agenda::create(['title' => 'Rapat', 'starts_at' => '2026-11-18 08:30:00', 'remind_minutes' => 30, 'created_by' => $manager->id]);
        $later = Agenda::create(['title' => 'Besok', 'starts_at' => '2026-11-19 09:00:00', 'remind_minutes' => 60]);
        Agenda::create(['title' => 'Tanpa pengingat', 'starts_at' => '2026-11-18 08:10:00', 'remind_minutes' => null]);

        $this->artisan('push:reminders agendas')->assertSuccessful();
        $this->artisan('push:reminders agendas')->assertSuccessful();

        $this->assertNotNull($soon->fresh()->reminded_at);
        $this->assertNull($later->fresh()->reminded_at);
        $this->assertSame(1, $manager->notifications()->count());
        $this->assertSame('Agenda: Rapat', $director->notifications()->first()->data['title']);
        $this->assertSame(0, $coordinator->notifications()->count());

        // Moving the agenda re-arms its reminder.
        Sanctum::actingAs($manager);
        $this->putJson("/api/admin/agendas/{$soon->id}", ['title' => 'Rapat', 'starts_at' => '2026-11-18 10:00:00', 'remind_minutes' => 30])->assertOk();
        $this->assertNull($soon->fresh()->reminded_at);
    }
}
