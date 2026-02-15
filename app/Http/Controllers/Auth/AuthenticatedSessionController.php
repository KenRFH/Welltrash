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
        ]);
    }

    /**
     * Admin Login View
     */
    public function createAdmin(): Response
    {
        return Inertia::render('Auth/AdminLogin', [
            'status' => session('status'),
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

        // Jika login dari admin/login
        if ($request->is('admin/*')) {

            if (!in_array($user->role, ['admin', 'driver'])) {
                Auth::logout();

                return back()->withErrors([
                    'email' => 'Unauthorized access.',
                ]);
            }
        }

        return match ($user->role) {
            'admin'  => redirect()->route('admin.dashboard'),
            'driver' => redirect()->route('driver.dashboard'),
            default  => redirect()->route('company.dashboard'),
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
