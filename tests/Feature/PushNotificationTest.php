<?php

namespace Tests\Feature;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\LeaveRequest;
use App\Models\PushDevice;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request as HttpRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PushNotificationTest extends TestCase
{
    use RefreshDatabase;

    private string $keyFile;

    protected function setUp(): void
    {
        parent::setUp();
        // Throwaway RSA key: the OAuth exchange is faked, only the JWT signing really runs.
        $key = openssl_pkey_new(['private_key_bits' => 2048]);
        openssl_pkey_export($key, $pem);
        $this->keyFile = tempnam(sys_get_temp_dir(), 'fcm');
        file_put_contents($this->keyFile, json_encode(['project_id' => 'demo-proj', 'private_key_id' => 'k1', 'private_key' => $pem, 'client_email' => 'svc@demo', 'token_uri' => 'https://oauth.test/token']));
        config(['services.fcm.credentials' => $this->keyFile]);
        Http::fake([
            'oauth.test/*' => Http::response(['access_token' => 'tok', 'expires_in' => 3600]),
            'fcm.googleapis.com/*/messages:send' => function (HttpRequest $r) {
                return $r['message']['fid'] === 'gone' ? Http::response(['error' => ['status' => 'NOT_FOUND', 'message' => 'x']], 404) : Http::response(['name' => 'ok']);
            },
        ]);
    }

    protected function tearDown(): void
    {
        @unlink($this->keyFile);
        parent::tearDown();
    }

    private function user(string $role): User
    {
        return User::create(['name' => ucfirst($role), 'email' => uniqid() . '@welltrash.test', 'password' => Hash::make('x'), 'role' => $role]);
    }

    private function device(User $u, string $fid): void
    {
        PushDevice::create(['user_id' => $u->id, 'fid' => $fid]);
    }

    /** @return array<string> fids that received a push with this title */
    private function sentTo(string $title): array
    {
        return Http::recorded(fn (HttpRequest $r) => str_contains($r->url(), 'messages:send') && $r['message']['notification']['title'] === $title)
            ->map(fn ($pair) => $pair[0]['message']['fid'])->sort()->values()->all();
    }

    public function test_app_registers_device_moves_it_on_account_switch_and_logout_removes_it(): void
    {
        $a = $this->user('coordinator');
        $b = $this->user('manager');
        $tokA = $a->createToken('t')->plainTextToken;

        $this->withToken($tokA)->postJson('/api/operator/push-device', ['fid' => 'fid-1'])->assertOk();
        $this->app['auth']->forgetGuards();
        $this->withToken($b->createToken('t')->plainTextToken)->postJson('/api/operator/push-device', ['fid' => 'fid-1'])->assertOk();
        $this->assertSame($b->id, PushDevice::where('fid', 'fid-1')->value('user_id'));
        $this->assertSame(1, PushDevice::count());

        $this->app['auth']->forgetGuards();
        $this->withToken($tokA)->postJson('/api/operator/logout', ['fid' => 'fid-1'])->assertOk();
        $this->assertSame(1, PushDevice::count(), 'logout of A must not remove B\'s device');
        $this->app['auth']->forgetGuards();
        $this->withToken($b->createToken('t2')->plainTextToken)->postJson('/api/operator/logout', ['fid' => 'fid-1'])->assertOk();
        $this->assertSame(0, PushDevice::count());
    }

    public function test_new_requests_push_to_the_tiers_that_can_approve_them_and_dead_devices_are_dropped(): void
    {
        $crew = $this->user('CleanUP');
        $this->device($this->user('coordinator'), 'coord');
        $this->device($this->user('manager'), 'mgr');
        $this->device($this->user('director'), 'gone');
        $this->device($crew, 'crew');

        LeaveRequest::create(['user_id' => $crew->id, 'date' => '2026-11-20', 'type' => 'sakit', 'reason' => 'Demam']);
        $owner = $this->user('company');
        Company::create(['user_id' => $owner->id, 'company_name' => 'PT Baru', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'pending']);
        Company::create(['user_id' => $owner->id, 'company_name' => 'PT Aktif', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        // defer() runs after the HTTP response; outside a request, flush it by hand.
        app(\Illuminate\Support\Defer\DeferredCallbackCollection::class)->invoke();

        $this->assertSame(['coord', 'gone', 'mgr'], $this->sentTo('Pengajuan sakit baru'));
        // Coordinator cannot approve partners; "gone" was already dropped after the first NOT_FOUND.
        $this->assertSame(['mgr'], $this->sentTo('Pendaftaran mitra baru'));
        $this->assertFalse(PushDevice::where('fid', 'gone')->exists(), 'NOT_FOUND removes the device');
        $this->assertSame(1, Http::recorded(fn (HttpRequest $r) => str_contains($r->url(), 'oauth.test'))->count(), 'access token is cached');
    }

    public function test_invoice_and_fleet_reminders_push_once_and_skip_when_nothing_to_report(): void
    {
        Carbon::setTestNow('2026-11-16 09:00:00');
        $this->device($this->user('manager'), 'mgr');
        $this->device($this->user('coordinator'), 'coord');

        $this->artisan('push:reminders invoices')->expectsOutputToContain('Tidak ada invoice')->assertSuccessful();
        $owner = $this->user('company');
        $co = Company::create(['user_id' => $owner->id, 'company_name' => 'PT A', 'pic_name' => 'x', 'address' => 'x', 'phone' => '1', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'active']);
        Invoice::create(['company_id' => $co->id, 'invoice_number' => 'I1', 'period_start' => '2026-10-01', 'period_end' => '2026-10-31', 'due_date' => '2026-11-16', 'amount' => 1, 'status' => 'unpaid']);
        Invoice::create(['company_id' => $co->id, 'invoice_number' => 'I2', 'period_start' => '2026-09-01', 'period_end' => '2026-09-30', 'due_date' => '2026-11-01', 'amount' => 1, 'status' => 'unpaid']);
        $this->artisan('push:reminders invoices')->assertSuccessful();
        $this->assertSame(['mgr'], $this->sentTo('Invoice mitra belum lunas'));

        $budi = User::create(['name' => 'Budi', 'email' => 'b@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'last_location_at' => now()->subHour()]);
        $andi = User::create(['name' => 'Andi', 'email' => 'a@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'last_location_at' => now()->subMinutes(5)]);
        $off = User::create(['name' => 'Libur', 'email' => 'l@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP']);
        foreach ([$budi, $andi] as $u) {
            Attendance::create(['user_id' => $u->id, 'date' => '2026-11-16', 'clock_in_at' => now()->subHours(2), 'status' => 'incomplete']);
        }

        $this->artisan('push:reminders fleet')->expectsOutputToContain('Budi (terakhir 08.00)')->assertSuccessful();
        $this->artisan('push:reminders fleet')->expectsOutputToContain('sudah diberitahukan')->assertSuccessful();
        $this->assertSame(['coord', 'mgr'], $this->sentTo('Armada tidak mengirim lokasi'));

        // Budi sends a location and goes silent again: that is a new episode.
        $budi->update(['last_location_at' => now()->subMinutes(40)]);
        $this->artisan('push:reminders fleet')->assertSuccessful();
        $this->assertCount(4, $this->sentTo('Armada tidak mengirim lokasi'));
        Carbon::setTestNow();
    }

    public function test_without_credentials_nothing_is_sent_and_nothing_breaks(): void
    {
        config(['services.fcm.credentials' => '/tidak/ada.json']);
        $this->device($this->user('director'), 'dir');
        LeaveRequest::create(['user_id' => $this->user('CleanUP')->id, 'date' => '2026-11-20', 'type' => 'izin', 'reason' => 'x']);
        app(\Illuminate\Support\Defer\DeferredCallbackCollection::class)->invoke();
        $this->artisan('push:reminders fleet')->expectsOutputToContain('belum dikonfigurasi')->assertSuccessful();
        Http::assertNothingSent();
    }

    public function test_bell_keeps_every_notice_even_without_a_phone_and_marks_read_per_owner(): void
    {
        config(['services.fcm.credentials' => '/tidak/ada.json']); // no Firebase at all: bell still works
        $crew = $this->user('CleanUP');
        $coord = $this->user('coordinator');
        $other = $this->user('coordinator');

        LeaveRequest::create(['user_id' => $crew->id, 'date' => '2026-11-20', 'type' => 'izin', 'reason' => 'Acara keluarga']);
        app(\Illuminate\Support\Defer\DeferredCallbackCollection::class)->invoke();

        $tok = $coord->createToken('t')->plainTextToken;
        $res = $this->withToken($tok)->getJson('/api/operator/notifications')->assertOk()
            ->assertJsonPath('unread_count', 1)
            ->assertJsonPath('data.0.title', 'Pengajuan izin baru')
            ->assertJsonPath('data.0.type', 'approval')
            ->assertJsonPath('data.0.read', false);
        $id = $res->json('data.0.id');

        // Someone else cannot mark my notification as read.
        $this->app['auth']->forgetGuards();
        $this->withToken($other->createToken('t')->plainTextToken)->postJson('/api/operator/notifications/read', ['id' => $id])->assertOk();
        $this->assertNull($coord->notifications()->first()->read_at);

        $this->app['auth']->forgetGuards();
        $this->withToken($tok)->postJson('/api/operator/notifications/read', ['id' => $id])->assertOk()->assertJsonPath('unread_count', 0);
        Http::assertNothingSent();
    }

    public function test_crew_is_told_when_their_leave_or_overtime_is_decided(): void
    {
        $crew = $this->user('CleanUP');
        $dir = $this->user('director');
        $this->device($crew, 'crew-phone');
        $leave = LeaveRequest::create(['user_id' => $crew->id, 'date' => '2026-11-20', 'type' => 'sakit', 'reason' => 'Demam']);
        $ot = \App\Models\OvertimeRequest::create(['user_id' => $crew->id, 'date' => '2026-11-20', 'reason' => 'Event']);

        $leave->review($dir, ['status' => 'rejected', 'admin_note' => 'Lampirkan surat dokter']);
        $ot->review($dir, ['status' => 'approved']);
        $leave->update(['reason' => 'edit lain']); // not a decision: no notice
        app(\Illuminate\Support\Defer\DeferredCallbackCollection::class)->invoke();

        $titles = $crew->notifications()->get()->pluck('data.title')->sort()->values()->all();
        $this->assertSame(['Lembur Anda disetujui', 'Sakit Anda ditolak'], $titles);
        $this->assertStringContainsString('Lampirkan surat dokter', $crew->notifications()->get()->firstWhere('data.title', 'Sakit Anda ditolak')->data['body']);
        $this->assertSame(['crew-phone', 'crew-phone'], array_merge($this->sentTo('Sakit Anda ditolak'), $this->sentTo('Lembur Anda disetujui')));
    }
}
