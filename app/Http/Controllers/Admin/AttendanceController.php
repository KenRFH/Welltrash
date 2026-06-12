<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use Carbon\Carbon;

defined('DAILY_RATE')     || define('DAILY_RATE', 67692);
defined('MIN_WORK_HOURS') || define('MIN_WORK_HOURS', 8);

class AttendanceController extends Controller
{
    /**
     * Show the attendance management page.
     */
    public function index(Request $request)
    {
        $cleanups = User::where('role', 'CleanUP')
            ->select('id', 'name', 'daily_salary')
            ->orderBy('name')
            ->get();

        $selectedCleanupId = $request->query('cleanup_id');
        $selectedDate      = $request->query('date', Carbon::today()->format('Y-m-d'));

        $query = Attendance::with('user:id,name,daily_salary')
            ->whereDate('date', $selectedDate)
            ->orderBy('date', 'desc');

        if ($selectedCleanupId) {
            $query->where('user_id', $selectedCleanupId);
        }

        $attendances = $query->paginate(10, ['*'], 'page')->withQueryString();

        $overtimeQuery = Attendance::with('user:id,name,daily_salary')
            ->whereNotNull('overtime_clock_in_at')
            ->whereDate('date', $selectedDate)
            ->orderBy('date', 'desc');

        if ($selectedCleanupId) {
            $overtimeQuery->where('user_id', $selectedCleanupId);
        }

        $overtimes = $overtimeQuery->paginate(10, ['*'], 'overtime_page')->withQueryString();

        // Leave requests
        $selectedMonth = Carbon::parse($selectedDate)->format('Y-m');

        $leaveQuery = LeaveRequest::with('user:id,name')
            ->where(function ($q) use ($selectedMonth) {
                $q->where('status', 'pending')
                  ->orWhere(function ($q2) use ($selectedMonth) {
                      $q2->whereYear('date', substr($selectedMonth, 0, 4))
                         ->whereMonth('date', substr($selectedMonth, 5, 2));
                  });
            })
            ->orderBy('created_at', 'desc');

        if ($selectedCleanupId) {
            $leaveQuery->where('user_id', $selectedCleanupId);
        }

        $leaveRequests = $leaveQuery->get();

        // ── OVERTIME REQUESTS ──────────────────────────────────────────
        // Tampilkan: semua yang masih pending (global) + bulan yg dipilih
        $overtimeRequestQuery = OvertimeRequest::with('user:id,name')
            ->where(function ($q) use ($selectedMonth) {
                $q->where('status', 'pending')
                  ->orWhere(function ($q2) use ($selectedMonth) {
                      $q2->whereYear('date', substr($selectedMonth, 0, 4))
                         ->whereMonth('date', substr($selectedMonth, 5, 2));
                  });
            })
            ->orderBy('date', 'asc');

        if ($selectedCleanupId) {
            $overtimeRequestQuery->where('user_id', $selectedCleanupId);
        }

        $overtimeRequests = $overtimeRequestQuery->get();
        // ──────────────────────────────────────────────────────────────

        return Inertia::render('Admin/Attendance/Index', [
            'cleanups'          => $cleanups,
            'attendances'       => $attendances,
            'overtimes'         => $overtimes,
            'leaveRequests'     => $leaveRequests,
            'overtimeRequests'  => $overtimeRequests,
            'selectedCleanupId' => $selectedCleanupId ? (int) $selectedCleanupId : null,
            'selectedDate'      => $selectedDate,
            'dailyRate'         => DAILY_RATE,
            'minWorkHours'      => MIN_WORK_HOURS,
        ]);
    }

    /**
     * Update a CleanUP's daily salary.
     */
    public function updateSalary(Request $request, User $user)
    {
        $request->validate([
            'daily_salary' => 'required|integer|min:0|max:10000000',
        ]);

        $user->update(['daily_salary' => $request->daily_salary]);

        return back()->with('success', "Gaji harian {$user->name} berhasil diperbarui.");
    }

    /**
     * Approve or reject a leave request.
     */
    public function reviewLeave(Request $request, LeaveRequest $leaveRequest)
    {
        $request->validate([
            'status'     => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string|max:500',
        ]);

        $leaveRequest->update([
            'status'     => $request->status,
            'admin_note' => $request->admin_note,
        ]);

        $statusLabel = $request->status === 'approved' ? 'disetujui' : 'ditolak';
        return back()->with('success', "Pengajuan izin {$leaveRequest->user->name} berhasil {$statusLabel}.");
    }

    /**
     * Approve or reject an overtime request.
     */
    public function reviewOvertime(Request $request, OvertimeRequest $overtimeRequest)
    {
        $request->validate([
            'status'     => 'required|in:approved,rejected',
            'admin_note' => 'nullable|string|max:500',
        ]);

        $overtimeRequest->update([
            'status'     => $request->status,
            'admin_note' => $request->admin_note,
        ]);

        $statusLabel = $request->status === 'approved' ? 'disetujui' : 'ditolak';
        return back()->with('success', "Permohonan lembur {$overtimeRequest->user->name} berhasil {$statusLabel}.");
    }
}
