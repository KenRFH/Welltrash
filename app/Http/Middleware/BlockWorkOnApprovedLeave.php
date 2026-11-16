<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Work actions (clock in, overtime, pickup status/submit) are refused on a day with approved izin/sakit,
 * in the app API and the web CleanUP portal alike. Clocking out stays allowed (shift started before approval).
 */
class BlockWorkOnApprovedLeave
{
    public function handle(Request $request, Closure $next): Response
    {
        $leave = $request->user()?->approvedLeaveOn();
        if (!$leave) {
            return $next($request);
        }

        $message = 'Anda tercatat ' . ($leave->type === 'sakit' ? 'sakit' : 'izin')
            . ' hari ini (sudah disetujui), jadi absen dan tugas tidak dapat dilakukan. Hubungi admin bila ini keliru.';

        return $request->expectsJson()
            ? response()->json(['success' => false, 'on_leave' => true, 'message' => $message], 423)
            : back()->with('error', $message);
    }
}
