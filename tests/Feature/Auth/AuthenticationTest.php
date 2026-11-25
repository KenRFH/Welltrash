<?php

use App\Models\User;
use Illuminate\Support\Facades\Http;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/company/dashboard');
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/login');
});

test('web login rejects inactive hris employee even if local password matches', function () {
    config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'secret_key']);
    Http::fake([
        'https://hris.test/api/v1/internal/verify-credentials' => Http::response([
            'success' => false,
            'verified' => false,
            'message' => 'Akun karyawan tidak aktif atau telah dinonaktifkan di HRIS.',
        ], 403),
    ]);

    $user = User::factory()->create([
        'employee_code' => 'WT-888',
        'password' => 'password',
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors('email');
});

test('web login allows local company login when hris returns unverified', function () {
    config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'secret_key']);
    Http::fake([
        'https://hris.test/api/v1/internal/verify-credentials' => Http::response([
            'success' => false,
            'verified' => false,
            'message' => 'Kredensial tidak cocok di HRIS.',
        ], 401),
    ]);

    $user = User::factory()->create([
        'role' => 'company',
        'employee_code' => null,
        'password' => 'password',
    ]);

    $response = $this->post('/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect('/company/dashboard');
});

test('local accounts without employee_code log in without calling HRIS', function () {
    config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'key']);
    Http::fake();
    $user = User::factory()->create(['employee_code' => null]);

    $this->post('/login', ['email' => $user->email, 'password' => 'password']);

    $this->assertAuthenticated();
    Http::assertNothingSent();
});

test('HRIS employees are still verified through HRIS', function () {
    config(['services.hris.url' => 'https://hris.test', 'services.hris.api_key' => 'key']);
    Http::fake(['hris.test/*' => Http::response(['verified' => false, 'message' => 'salah'])]);
    $user = User::factory()->create(['employee_code' => 'EMP001']);

    $this->post('/login', ['email' => $user->email, 'password' => 'password']);

    $this->assertGuest(); // HRIS said no, so the local password must not be accepted
    Http::assertSentCount(1);
});
