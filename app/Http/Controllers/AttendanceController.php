<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use Carbon\Carbon;
use Inertia\Inertia;

defined('DAILY_RATE')     || define('DAILY_RATE', 67692);
defined('MIN_WORK_HOURS') || define('MIN_WORK_HOURS', 8);

class AttendanceController extends Controller
{
    /**
     * CleanUP-facing: show own attendance records, salary summary, and leave requests.
     */
    public function myAttendance(Request $request)
    {
        $user         = Auth::user();
        $selectedMonth = $request->query('month', Carbon::now()->format('Y-m'));
        [$year, $month] = explode('-', $selectedMonth);

        // Attendance records for this CleanUP in selected month
        $attendances = Attendance::where('user_id', $user->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        // Leave requests for this CleanUP in selected month
        $leaveRequests = LeaveRequest::where('user_id', $user->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        // Salary calculation: only days with work_hours >= MIN_WORK_HOURS
        $qualifiedDays = $attendances->filter(fn($a) => ($a->work_hours ?? 0) >= MIN_WORK_HOURS)->count();
        $totalHours    = round($attendances->sum('work_hours'), 1);
        $estimatedSalary = $qualifiedDays * DAILY_RATE;

        // Overtime calculation
        $totalOvertimeHours = round($attendances->sum('overtime_hours'), 1);
        $overtimeSalary     = $totalOvertimeHours * 10000;

        return Inertia::render('CleanUP/Attendance', [
            'attendances'      => $attendances,
            'leaveRequests'    => $leaveRequests,
            'selectedMonth'    => $selectedMonth,
            'summary' => [
                'total_days'             => $attendances->count(),
                'qualified_days'         => $qualifiedDays,
                'total_hours'            => $totalHours,
                'estimated_salary'       => $estimatedSalary,
                'daily_rate'             => DAILY_RATE,
                'min_hours'              => MIN_WORK_HOURS,
                'total_overtime_hours'   => $totalOvertimeHours,
                'overtime_salary'        => $overtimeSalary,
            ],
        ]);
    }

    /**
     * Return today's attendance status for the authenticated CleanUP.
     * Used by the floating button to determine clock-in / clock-out state.
     */
    public function status()
    {
        $user = Auth::user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        return response()->json([
            'attendance' => $attendance,
        ]);
    }

    /**
     * Clock-in: record arrival with photo and GPS coordinates.
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'photo'  => 'nullable|image|max:5120',
            'lat'    => 'nullable|numeric',
            'lng'    => 'nullable|numeric',
        ]);

        $user  = Auth::user();
        $today = Carbon::today()->toDateString();

        // Prevent double clock-in
        $existing = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing) {
            return back()->with('error', 'Anda sudah melakukan absen masuk hari ini.');
        }

        $photoPath = $request->hasFile('photo') ? $request->file('photo')->store('attendance/clock_in', 'public') : null;

        Attendance::create([
            'user_id'      => $user->id,
            'date'         => $today,
            'clock_in_at'  => Carbon::now(),
            'clock_in_photo' => $photoPath,
            'clock_in_lat' => $request->lat,
            'clock_in_lng' => $request->lng,
            'status'       => 'incomplete',
        ]);

        return back()->with('success', 'Absen masuk berhasil dicatat!');
    }

    /**
     * Clock-out: record departure with photo and GPS, compute work_hours.
     */
    public function clockOut(Request $request)
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = Auth::user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance) {
            return back()->with('error', 'Anda belum melakukan absen masuk hari ini.');
        }

        if ($attendance->clock_out_at) {
            return back()->with('error', 'Anda sudah melakukan absen pulang hari ini.');
        }

        $photoPath = $request->hasFile('photo') ? $request->file('photo')->store('attendance/clock_out', 'public') : null;

        $clockOut  = Carbon::now();
        $workHours = round($attendance->clock_in_at->diffInMinutes($clockOut) / 60, 2);

        $attendance->update([
            'clock_out_at'    => $clockOut,
            'clock_out_photo' => $photoPath,
            'clock_out_lat'   => $request->lat,
            'clock_out_lng'   => $request->lng,
            'work_hours'      => $workHours,
            'status'          => 'present',
        ]);

        return back()->with('success', 'Absen pulang berhasil dicatat! Durasi kerja: ' . number_format($workHours, 1) . ' jam.');
    }

    /**
     * Clock-in for Overtime (Lembur)
     */
    public function clockInOvertime(Request $request)
    {
        $request->validate([
            'photo'  => 'nullable|image|max:5120',
            'lat'    => 'nullable|numeric',
            'lng'    => 'nullable|numeric',
        ]);

        $user  = Auth::user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance || $attendance->status !== 'present') {
            return back()->with('error', 'Anda harus menyelesaikan absen jam kerja reguler terlebih dahulu.');
        }

        if ($attendance->overtime_clock_in_at) {
            return back()->with('error', 'Anda sudah melakukan absen masuk lembur hari ini.');
        }

        $photoPath = $request->hasFile('photo') ? $request->file('photo')->store('attendance/overtime_in', 'public') : null;

        $attendance->update([
            'overtime_clock_in_at'  => Carbon::now(),
            'overtime_clock_in_photo' => $photoPath,
            'overtime_clock_in_lat' => $request->lat,
            'overtime_clock_in_lng' => $request->lng,
        ]);

        return back()->with('success', 'Absen masuk lembur berhasil dicatat!');
    }

    /**
     * Clock-out for Overtime (Lembur)
     */
    public function clockOutOvertime(Request $request)
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = Auth::user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (!$attendance || !$attendance->overtime_clock_in_at) {
            return back()->with('error', 'Anda belum melakukan absen masuk lembur hari ini.');
        }

        if ($attendance->overtime_clock_out_at) {
            return back()->with('error', 'Anda sudah melakukan absen pulang lembur hari ini.');
        }

        $photoPath = $request->hasFile('photo') ? $request->file('photo')->store('attendance/overtime_out', 'public') : null;

        $clockOut  = Carbon::now();
        $overtimeHours = round($attendance->overtime_clock_in_at->diffInMinutes($clockOut) / 60, 2);

        $attendance->update([
            'overtime_clock_out_at'    => $clockOut,
            'overtime_clock_out_photo' => $photoPath,
            'overtime_clock_out_lat'   => $request->lat,
            'overtime_clock_out_lng'   => $request->lng,
            'overtime_hours'           => $overtimeHours,
        ]);

        return back()->with('success', 'Absen pulang lembur berhasil dicatat! Durasi lembur: ' . number_format($overtimeHours, 1) . ' jam.');
    }
}
