<?php

namespace Tests\Feature;

use App\Models\Company;
use App\Models\User;
use App\Services\HrisService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class RoleTierTest extends TestCase
{
    use RefreshDatabase;

    private function user(string $role): User
    {
        return User::create(['name' => $role, 'email' => "{$role}@welltrash.test", 'password' => Hash::make('x'), 'role' => $role]);
    }

    private function api(User $u): static
    {
        $this->app['auth']->forgetGuards();
        return $this->withHeader('Authorization', 'Bearer ' . $u->createToken('t')->plainTextToken);
    }

    public function test_admin_panel_tiers_follow_hris_levels(): void
    {
        // [accounts, invoices, attendance, webadmin] expected status per role
        $matrix = [
            'superadmin'  => [200, 200, 200, 200],
            'director'    => [200, 200, 200, 403],
            'manager'     => [403, 200, 200, 403],
            'coordinator' => [403, 403, 200, 403],
            'web_admin'   => [403, 403, 403, 200],
            'staff'       => [403, 403, 403, 403],
            'CleanUP'     => [403, 403, 403, 403],
        ];
        $urls = ['/admin/accounts', '/admin/invoices', '/admin/attendance', '/webadmin/dashboard'];

        foreach ($matrix as $role => $expected) {
            $u = $this->user($role);
            foreach ($urls as $i => $url) {
                $status = $this->actingAs($u)->get($url)->getStatusCode();
                $this->assertSame($expected[$i], $status, "{$role} → {$url}");
            }
        }
    }

    public function test_login_redirects_each_role_to_its_home(): void
    {
        foreach (['superadmin' => 'admin.dashboard', 'manager' => 'admin.dashboard', 'coordinator' => 'admin.dashboard', 'web_admin' => 'webadmin.dashboard', 'staff' => 'app.download'] as $role => $route) {
            $this->actingAs($this->user($role))->get('/dashboard')->assertRedirect(route($route));
        }
    }

    public function test_coordinator_app_dashboard_hides_receivables_and_mitra_approvals(): void
    {
        $owner = $this->user('company');
        $company = Company::create(['user_id' => $owner->id, 'company_name' => 'PT Mitra', 'pic_name' => 'Budi', 'address' => 'Jl. A', 'phone' => '0812', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'pending']);

        $coord = $this->user('coordinator');
        $this->api($coord)->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonMissingPath('executive.unpaid_amount')
            ->assertJsonPath('pending_approvals', 0);
        $this->api($coord)->getJson('/api/admin/approvals')->assertOk()->assertJsonCount(0, 'data');
        $this->api($coord)->postJson("/api/admin/companies/{$company->id}/review", ['status' => 'approved'])->assertForbidden();

        $mgr = $this->user('manager');
        $this->api($mgr)->getJson('/api/admin/dashboard')->assertOk()->assertJsonPath('executive.unpaid_amount', 0)->assertJsonPath('pending_approvals', 1);
        $this->api($mgr)->postJson("/api/admin/companies/{$company->id}/review", ['status' => 'approved'])->assertOk();
    }

    public function test_staff_can_use_app_but_not_admin_api(): void
    {
        $staff = $this->user('staff');
        $this->api($staff)->getJson('/api/operator/me')->assertOk();
        $this->api($staff)->getJson('/api/admin/dashboard')->assertForbidden();
    }

    public function test_hris_levels_map_to_welltrash_roles(): void
    {
        $svc = app(HrisService::class);
        $cases = [
            [['role' => 'director', 'access' => ['level' => 'superadmin']], 'superadmin'],
            [['role' => 'manager', 'access' => ['level' => 'manager']], 'manager'],
            [['role' => 'coordinator'], 'coordinator'],
            [['role' => 'public_relation'], 'web_admin'],
            [['role' => 'staff'], 'staff'],
            [['role' => 'CleanUP'], 'CleanUP'],
            [[], 'CleanUP'],
        ];
        foreach ($cases as $i => [$payload, $expected]) {
            $u = $svc->syncUserFromHrisData($payload + ['email' => "h{$i}@welltrash.test", 'employee' => ['employee_code' => "WT-H{$i}", 'full_name' => "H{$i}"]]);
            $this->assertSame($expected, $u->role, json_encode($payload));
        }

        // A demoted position in HRIS demotes the Welltrash account too (HRIS is the source of truth).
        $u = $svc->syncUserFromHrisData(['role' => 'staff', 'email' => 'h1@welltrash.test', 'employee' => ['employee_code' => 'WT-H1']]);
        $this->assertSame('staff', $u->role);
    }

    public function test_crew_sync_uses_hris_role_and_keeps_role_when_hris_sends_none(): void
    {
        config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'k']);
        $existing = User::create(['name' => 'Lama', 'email' => 'lama@welltrash.test', 'password' => Hash::make('x'), 'role' => 'director', 'employee_code' => 'WT-9']);
        Http::fake(['hris.test/*' => Http::response(['data' => [
            ['employee_code' => 'WT-1', 'name' => 'GM', 'email' => 'gm@welltrash.test', 'role' => 'manager'],
            ['employee_code' => 'WT-2', 'name' => 'PR', 'email' => 'pr@welltrash.test', 'role' => 'public_relation'],
            ['employee_code' => 'WT-9', 'name' => 'Lama', 'email' => 'lama@welltrash.test'], // older HRIS: no role key
        ]])]);

        app(HrisService::class)->syncCrew();

        $this->assertSame('manager', User::where('employee_code', 'WT-1')->value('role'));
        $this->assertSame('web_admin', User::where('employee_code', 'WT-2')->value('role'));
        $this->assertSame('director', $existing->fresh()->role);
    }

    public function test_crew_sync_never_overwrites_another_person_and_rolls_back_nothing_half_written(): void
    {
        config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'k']);
        // Local numbering: WT-005 is FERI. The HRIS being called (another environment) says WT-005 is ANDIK.
        $feri = User::create(['name' => 'FERI', 'email' => 'feri@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'employee_code' => 'WT-005']);
        $harry = User::create(['name' => 'HARRY', 'email' => 'harry@welltrash.test', 'password' => Hash::make('x'), 'role' => 'director', 'employee_code' => 'WT-013']);
        Http::fake(['hris.test/*' => Http::response(['data' => [
            ['employee_code' => 'WT-005', 'name' => 'ANDIK', 'email' => 'andik@prod.test', 'role' => 'cleanup', 'is_user_active' => false],
            ['employee_code' => 'WT-003', 'name' => 'HARRY', 'email' => 'harry@welltrash.test', 'role' => 'public_relation'], // same person, new code
            ['employee_code' => 'WT-777', 'name' => 'BARU', 'email' => 'feri@welltrash.test', 'role' => 'staff'],           // email owned by FERI
        ]])]);

        $result = app(HrisService::class)->syncCrew();

        $this->assertSame(['FERI', 'feri@welltrash.test', 'WT-005', true], [$feri->fresh()->name, $feri->fresh()->email, $feri->fresh()->employee_code, $feri->fresh()->is_active]);
        $this->assertSame(['web_admin', 'WT-003'], [$harry->fresh()->role, $harry->fresh()->employee_code]);
        $this->assertSame(1, $result['updated']);
        $this->assertSame(['WT-005', 'WT-777'], array_column($result['skipped'], 'employee_code'));
        $this->assertSame(0, User::where('email', 'andik@prod.test')->count(), 'clashing row is reported, not created');
        $this->assertSame(0, User::where('employee_code', 'WT-777')->count());
    }

    public function test_hris_login_with_clashing_email_or_code_still_signs_in_without_error(): void
    {
        User::create(['name' => 'FERI', 'email' => 'feri@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'employee_code' => 'WT-005']);
        $svc = app(HrisService::class);

        // HRIS says this ANDIK has code WT-005 (held locally by FERI): ANDIK gets an account, FERI is untouched.
        $andik = $svc->syncUserFromHrisData(['email' => 'andik@welltrash.test', 'role' => 'manager', 'employee' => ['employee_code' => 'WT-005', 'full_name' => 'ANDIK']], 'secret123');
        $this->assertSame(['ANDIK', 'manager', null], [$andik->name, $andik->role, $andik->employee_code]);
        $this->assertSame('FERI', User::where('employee_code', 'WT-005')->value('name'));

        // Same person (code + name) whose HRIS email is now another account's: keep the local email instead of a 500.
        $andik->update(['employee_code' => 'WT-001']);
        $again = $svc->syncUserFromHrisData(['email' => 'feri@welltrash.test', 'role' => 'manager', 'employee' => ['employee_code' => 'WT-001', 'full_name' => 'ANDIK']]);
        $this->assertSame([$andik->id, 'andik@welltrash.test'], [$again->id, $again->email]);
        $this->assertSame('FERI', User::where('email', 'feri@welltrash.test')->value('name'));
    }

    public function test_scheduled_sync_deactivates_former_employees_and_revokes_their_app_tokens(): void
    {
        config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'k']);
        $left = User::create(['name' => 'KELUAR', 'email' => 'keluar@welltrash.test', 'password' => Hash::make('x'), 'role' => 'coordinator', 'employee_code' => 'WT-50']);
        $left->createToken('app');
        Http::fake(['hris.test/*' => Http::response(['data' => [
            ['employee_code' => 'WT-50', 'name' => 'KELUAR', 'email' => 'keluar@welltrash.test', 'role' => 'coordinator', 'status' => 'resigned', 'is_user_active' => false],
            ['employee_code' => 'WT-51', 'name' => 'LAMA', 'email' => 'lama@welltrash.test', 'role' => 'cleanup', 'status' => 'inactive'],
        ]])]);

        $this->artisan('hris:sync-crew')->expectsOutputToContain('1 dinonaktifkan')->assertSuccessful();

        $this->assertFalse($left->fresh()->is_active);
        $this->assertSame(0, $left->tokens()->count());
        $this->assertSame(0, User::where('employee_code', 'WT-51')->count(), 'former employee without account is not created');
        Http::assertSent(fn ($req) => str_contains($req->url(), 'include_inactive=1'));
    }

    public function test_sync_keeps_active_employees_without_an_hris_login_active(): void
    {
        config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'k']);
        $crew = User::create(['name' => 'TANPA AKUN', 'email' => 'tanpa@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'employee_code' => 'WT-60']);
        $blocked = User::create(['name' => 'DIBLOKIR', 'email' => 'blok@welltrash.test', 'password' => Hash::make('x'), 'role' => 'CleanUP', 'employee_code' => 'WT-61']);
        Http::fake(['hris.test/*' => Http::response(['data' => [
            ['employee_code' => 'WT-60', 'name' => 'TANPA AKUN', 'email' => 'tanpa@welltrash.test', 'status' => 'active', 'has_user_account' => false, 'is_user_active' => false],
            ['employee_code' => 'WT-61', 'name' => 'DIBLOKIR', 'email' => 'blok@welltrash.test', 'status' => 'active', 'has_user_account' => true, 'is_user_active' => false],
        ]])]);

        app(HrisService::class)->syncCrew();
        app(HrisService::class)->syncCrew(); // hourly: stays the same on every run

        $this->assertTrue($crew->fresh()->is_active);
        $this->assertFalse($blocked->fresh()->is_active, 'a login blocked in HRIS is still blocked here');
    }

    public function test_scheduled_sync_reports_failure_without_changing_data(): void
    {
        config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'k']);
        Http::fake(['hris.test/*' => Http::response('down', 503)]);
        $this->artisan('hris:sync-crew')->assertFailed();
    }

    public function test_every_approval_path_records_who_decided_and_when(): void
    {
        Http::fake();
        $crew = $this->user('CleanUP');
        $coord = $this->user('coordinator');
        $mgr = $this->user('manager');
        $owner = $this->user('company');
        $mk = fn () => Company::create(['user_id' => $owner->id, 'company_name' => 'PT ' . uniqid(), 'pic_name' => 'Budi', 'address' => 'Jl. A', 'phone' => '0812', 'business_category' => 'resto', 'subscription_plan' => 'basic', 'subscription_status' => 'pending']);
        $ot = \App\Models\OvertimeRequest::create(['user_id' => $crew->id, 'date' => today(), 'reason' => 'x', 'status' => 'pending']);
        $leave = \App\Models\LeaveRequest::create(['user_id' => $crew->id, 'date' => today(), 'type' => 'izin', 'reason' => 'x', 'status' => 'pending']);
        $leave2 = \App\Models\LeaveRequest::create(['user_id' => $crew->id, 'date' => today()->addDay(), 'type' => 'izin', 'reason' => 'x', 'status' => 'pending']);
        [$c1, $c2, $c3] = [$mk(), $mk(), $mk()];

        $this->api($coord)->postJson("/api/admin/attendance/overtime/{$ot->id}/review", ['status' => 'approved'])->assertOk();
        $this->api($coord)->postJson("/api/admin/attendance/leave/{$leave->id}/review", ['status' => 'rejected'])->assertOk();
        $this->api($mgr)->postJson("/api/admin/companies/{$c1->id}/review", ['status' => 'approved'])->assertOk();
        $this->app['auth']->forgetGuards();
        $this->actingAs($coord)->patch(route('admin.attendance.leave.review', $leave2), ['status' => 'approved'])->assertRedirect();
        $this->actingAs($mgr)->patch(route('admin.companies.approve', $c2))->assertRedirect();
        $this->actingAs($mgr)->post(route('admin.companies.reject', $c3), ['rejection_reason' => 'x'])->assertRedirect();

        foreach ([[$ot, $coord], [$leave, $coord], [$leave2, $coord], [$c1, $mgr], [$c2, $mgr], [$c3, $mgr]] as [$model, $by]) {
            $fresh = $model->fresh();
            $this->assertSame($by->id, $fresh->reviewed_by, class_basename($model) . " #{$model->id}");
            $this->assertNotNull($fresh->reviewed_at);
            $this->assertSame($by->name, $fresh->reviewer->name);
        }
    }

    public function test_accounts_page_lists_internal_staff_read_only_and_blocks_changes_to_them(): void
    {
        $director = $this->user('director');
        $super = $this->user('superadmin');
        $mgr = $this->user('manager');
        $this->user('staff');
        $crew = $this->user('CleanUP');

        $this->actingAs($director)->get('/admin/accounts')->assertOk()
            ->assertInertia(fn ($page) => $page->component('Admin/Accounts/Index')
                ->has('internals', 4)
                ->where('internals.0.role', 'superadmin')
                ->where('roleLabels.manager', 'Manager / GM'));

        // A director cannot delete the superadmin or edit/deactivate a manager from Welltrash.
        $this->actingAs($director)->delete(route('admin.accounts.destroy', $super))->assertSessionHas('error');
        $this->actingAs($director)->patch(route('admin.accounts.toggleActive', $mgr))->assertSessionHas('error');
        $this->actingAs($director)->post(route('admin.accounts.update', $mgr), ['name' => 'Ganti', 'password' => 'baru12345'])->assertSessionHas('error');
        $this->assertNotNull($super->fresh());
        $this->assertTrue($mgr->fresh()->is_active !== false);
        $this->assertSame('manager', $mgr->fresh()->name);

        // Local (non-HRIS) accounts stay manageable.
        $this->actingAs($director)->patch(route('admin.accounts.toggleActive', $crew))->assertSessionHas('success');
    }

    public function test_monthly_target_is_set_by_director_level_and_shown_to_every_admin_tier(): void
    {
        \Carbon\Carbon::setTestNow('2026-11-16 09:00:00');
        $dir = $this->user('director');
        $mgr = $this->user('manager');

        $this->api($mgr)->getJson('/api/admin/dashboard')->assertOk()
            ->assertJsonPath('target.kg', null)->assertJsonPath('target.can_set', false)->assertJsonPath('target.ends_on', '2026-11-30');
        $this->api($mgr)->postJson('/api/admin/target', ['kg' => 5000])->assertForbidden();

        $this->api($dir)->postJson('/api/admin/target', ['kg' => 0])->assertUnprocessable();
        $this->api($dir)->postJson('/api/admin/target', ['kg' => 5000, 'pickups' => 200])->assertOk()->assertJsonPath('target.kg', 5000);
        $this->api($mgr)->getJson('/api/admin/dashboard')->assertJsonPath('target.kg', 5000)->assertJsonPath('target.pickups', 200);

        // Clearing one goal keeps the other; next month starts empty.
        $this->api($dir)->postJson('/api/admin/target', ['kg' => 5000])->assertOk()->assertJsonPath('target.pickups', null);
        \Carbon\Carbon::setTestNow('2026-12-01 09:00:00');
        $this->api($dir)->getJson('/api/admin/dashboard')->assertJsonPath('target.kg', null)->assertJsonPath('target.can_set', true);
        \Carbon\Carbon::setTestNow();
    }
}
