<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Attendance;
use Carbon\Carbon;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $attendanceToday = null;
        $user = $request->user();

        if ($user && $user->role === 'CleanUP') {
            $attendanceToday = Attendance::where('user_id', $user->id)
                ->whereDate('date', Carbon::today())
                ->first();
        }

        return [
            ...parent::share($request),
            'auth' => [
                // role_label: shown when an account has no HRIS division (local/demo accounts).
                'user' => $user ? $user->toArray() + ['role_label' => $user->roleLabel()] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
            'attendance_today' => $attendanceToday,
        ];
    }
}
