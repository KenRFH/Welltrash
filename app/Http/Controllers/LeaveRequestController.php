<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LeaveRequest;
use App\Models\Attendance;
use Carbon\Carbon;

class LeaveRequestController extends Controller
{
    /**
     * Submit a leave request (izin/sakit) for a specific date.
     */
    public function store(Request $request)
    {
        $request->validate([
            'date'        => 'required|date',
            'type'        => 'required|in:izin,sakit',
            'reason'      => 'required|string|max:1000',
            'proof_image' => 'nullable|image|max:5120',
        ]);

        $user = Auth::user();
        $date = Carbon::parse($request->date)->toDateString();

        // Check if already has attendance that day
        $hasAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->exists();

        if ($hasAttendance) {
            return back()->with('error', 'Anda sudah melakukan absensi pada tanggal tersebut.');
        }

        // Check if already submitted leave for that day
        $existing = LeaveRequest::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah mengajukan izin/sakit untuk tanggal tersebut.');
        }

        $proofImagePath = null;
        if ($request->hasFile('proof_image')) {
            $proofImagePath = $request->file('proof_image')->store('leave_requests', 'public');
        }

        LeaveRequest::create([
            'user_id'     => $user->id,
            'date'        => $date,
            'type'        => $request->type,
            'reason'      => $request->reason,
            'status'      => 'pending',
            'proof_image' => $proofImagePath,
        ]);

        return back()->with('success', 'Pengajuan ' . ($request->type === 'izin' ? 'izin' : 'sakit') . ' berhasil dikirim. Menunggu persetujuan admin.');
    }
}
