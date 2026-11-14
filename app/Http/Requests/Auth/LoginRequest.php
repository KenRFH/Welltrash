<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginValue = trim($this->input('email'));
        $password = $this->input('password');

        // 1. Try HRIS authentication first (Single Source of Truth)
        $hrisService = app(\App\Services\HrisService::class);
        if ($hrisService->isConfigured()) {
            try {
                $hrisData = $hrisService->verifyCredentials($loginValue, $password);
                if ($hrisData && !empty($hrisData['verified'])) {
                    $hrisUser = $hrisData['user'];

                    if (!($hrisUser['is_active'] ?? true)) {
                        throw ValidationException::withMessages([
                            'email' => 'Akun karyawan Anda dinonaktifkan di HRIS. Silakan hubungi Direktur/Manajemen.',
                        ]);
                    }

                    $user = $hrisService->syncUserFromHrisData($hrisUser, $password);
                    Auth::login($user, $this->boolean('remember'));
                    RateLimiter::clear($this->throttleKey());
                    return;
                }
            } catch (ValidationException $ve) {
                throw $ve;
            } catch (\Throwable $e) {
                \Illuminate\Support\Facades\Log::warning('HRIS web auth warning: ' . $e->getMessage());
            }
        }

        // 2. Local authentication fallback (for companies and local accounts)
        $field = filter_var($loginValue, FILTER_VALIDATE_EMAIL) ? 'email' : 'name';

        // Auto-seed demo users in local development if demo account is missing
        if (app()->environment('local') && !User::where('email', $loginValue)->exists()) {
            if (in_array($loginValue, ['admin@welltrash.com', 'cleanup@welltrash.com', 'cleanup2@welltrash.com', 'company@welltrash.com', 'webadmin@welltrash.com'])) {
                (new UserSeeder())->run();
            }
        }

        $localUser = User::where($field, $loginValue)
            ->orWhere('employee_code', strtoupper($loginValue))
            ->first();

        if (!$localUser || !Auth::attempt(['email' => $localUser->email, 'password' => $password], $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        if (Auth::user()->is_active === false) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Akun Anda dinonaktifkan. Hubungi admin.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
