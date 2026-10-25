<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Company Login View
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'isDemo' => app()->environment('local', 'testing', 'staging') || config('app.debug') || (bool) env('DEMO_LOGIN', false),
        ]);
    }

    /**
     * Admin Login View
     */
    public function createAdmin(): Response
    {
        return Inertia::render('Auth/AdminLogin', [
            'status' => session('status'),
            'isDemo' => app()->environment('local', 'testing', 'staging') || config('app.debug') || (bool) env('DEMO_LOGIN', false),
        ]);
    }

    /**
     * Handle Login
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = $request->user();

        // Portal admin (/admin/login) khusus untuk staf internal
        if ($request->is('admin/*')) {
            if (!in_array($user->role, ['admin', 'web_admin', 'CleanUP'])) {
                Auth::logout();

                return back()->withErrors([
                    'email' => 'Halaman ini khusus untuk staf internal (Admin, Web Admin, CleanUP). Akun Mitra silakan masuk melalui portal mitra.',
                ]);
            }
        }

        return match ($user->role) {
            'admin'     => redirect()->route('admin.dashboard'),
            'web_admin' => redirect()->route('webadmin.dashboard'),
            'CleanUP'   => redirect()->route('cleanup.dashboard'),
            default     => redirect()->route('company.dashboard'),
        };
    }

    /**
     * Logout
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
