<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (! auth()->check() || ! in_array(auth()->user()->role, $roles)) {
            abort(403);
        }

        // Kick out accounts deactivated by admin, including sessions opened before deactivation
        if (! auth()->user()->is_active) {
            if ($request->expectsJson()) {
                abort(403, 'Akun Anda dinonaktifkan. Hubungi admin.');
            }
            auth('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->with('status', 'Akun Anda dinonaktifkan. Hubungi admin.');
        }

        return $next($request);
    }
}
