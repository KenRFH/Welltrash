<?php

// ponytail: single unified operator mobile API controller; split into domain controllers when operator features expand into vehicle tracking / telemetry.
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\CompanyActivity;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\Pickup;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

defined('DAILY_RATE')     || define('DAILY_RATE', 67692);
defined('MIN_WORK_HOURS') || define('MIN_WORK_HOURS', 8);

class OperatorApiController extends Controller
{
    /**
     * Operator login via mobile app.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'       => 'required|email',
            'password'    => 'required|string',
            'device_name' => 'nullable|string|max:100',
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah.',
            ], 401);
        }

        $allowedRoles = ['CleanUP', 'operator', 'admin', 'Admin', 'Superadmin', 'superadmin', 'management'];
        if (! in_array($user->role, $allowedRoles)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Akun ini tidak memiliki akses aplikasi operasional.',
            ], 403);
        }

        $token = $user->createToken($request->device_name ?: 'android-operator')->plainTextToken;
        $user->load('vehicle:id,name,license_plate,type,capacity');

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil.',
            'token'   => $token,
            'user'    => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'role'         => $user->role,
                'daily_salary' => $user->daily_salary,
                'vehicle'      => $user->vehicle ? [
                    'id'            => $user->vehicle->id,
                    'name'          => $user->vehicle->name,
                    'license_plate' => $user->vehicle->license_plate,
                    'type'          => $user->vehicle->type,
                    'capacity'      => $user->vehicle->capacity,
                ] : null,
            ],
        ]);
    }

    /**
     * Get authenticated operator profile.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('vehicle:id,name,license_plate,type,capacity');

        return response()->json([
            'success' => true,
            'user'    => [
                'id'           => $user->id,
                'name'         => $user->name,
                'email'        => $user->email,
                'role'         => $user->role,
                'daily_salary' => $user->daily_salary,
                'vehicle'      => $user->vehicle ? [
                    'id'            => $user->vehicle->id,
                    'name'          => $user->vehicle->name,
                    'license_plate' => $user->vehicle->license_plate,
                    'type'          => $user->vehicle->type,
                    'capacity'      => $user->vehicle->capacity,
                ] : null,
            ],
        ]);
    }

    /**
     * List active operational vehicles for operator selection.
     */
    public function vehicles(Request $request): JsonResponse
    {
        $currentUserId = $request->user()?->id;

        $vehicles = Vehicle::where('status', 'active')
            ->with(['drivers' => function ($q) {
                $q->select('id', 'name', 'vehicle_id');
            }])
            ->select('id', 'name', 'license_plate', 'type', 'capacity')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($v) use ($currentUserId) {
                $activeDriver = $v->drivers->first();
                $isOccupied = $activeDriver !== null && $activeDriver->id !== $currentUserId;
                return [
                    'id'            => $v->id,
                    'name'          => $v->name,
                    'license_plate' => $v->license_plate,
                    'type'          => $v->type,
                    'capacity'      => $v->capacity,
                    'is_occupied'   => $isOccupied,
                    'occupied_by'   => $isOccupied ? $activeDriver->name : null,
                ];
            });

        return response()->json([
            'success'  => true,
            'vehicles' => $vehicles,
        ]);
    }

    /**
     * Select/assign active operational vehicle for current operator.
     */
    public function selectVehicle(Request $request): JsonResponse
    {
        $request->validate([
            'vehicle_id' => 'nullable|exists:vehicles,id',
        ]);

        $user = $request->user();

        if ($request->filled('vehicle_id')) {
            $vehicle = Vehicle::where('id', $request->vehicle_id)->where('status', 'active')->first();
            if (! $vehicle) {
                return response()->json([
                    'success' => false,
                    'message' => 'Armada yang dipilih sedang dalam perbaikan atau tidak aktif.',
                ], 422);
            }

            // Validasi 1 truk 1 driver aktif
            $occupiedBy = User::where('vehicle_id', $vehicle->id)->where('id', '!=', $user->id)->first();
            if ($occupiedBy) {
                return response()->json([
                    'success' => false,
                    'message' => "Armada {$vehicle->license_plate} sedang digunakan oleh driver {$occupiedBy->name}.",
                ], 422);
            }

            $user->update(['vehicle_id' => $vehicle->id]);
            $message = "Armada operasional berhasil dipilih: {$vehicle->name} ({$vehicle->license_plate}).";
        } else {
            $user->update(['vehicle_id' => null]);
            $message = 'Armada operasional berhasil dilepas.';
        }

        $user->load('vehicle:id,name,license_plate,type,capacity');

        return response()->json([
            'success' => true,
            'message' => $message,
            'vehicle' => $user->vehicle ? [
                'id'            => $user->vehicle->id,
                'name'          => $user->vehicle->name,
                'license_plate' => $user->vehicle->license_plate,
                'type'          => $user->vehicle->type,
                'capacity'      => $user->vehicle->capacity,
            ] : null,
        ]);
    }

    /**
     * Operator logout and revoke token.
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil.',
        ]);
    }

    /**
     * List pickups scheduled for a specific date (defaults to today).
     */
    public function pickups(Request $request): JsonResponse
    {
        $targetDate = $request->query('date', Carbon::today()->toDateString());

        $pickups = Pickup::with(['company:id,company_name,pic_name,phone,address,subscription_plan,business_category', 'cleanup:id,name'])
            ->whereDate('pickup_date', $targetDate)
            ->get();

        return response()->json([
            'success'  => true,
            'date'     => $targetDate,
            'is_today' => Carbon::parse($targetDate)->isToday(),
            'pickups'  => $pickups,
        ]);
    }

    /**
     * Update pickup status (on_the_way, completed, failed).
     */
    public function updatePickupStatus(Request $request, Pickup $pickup): JsonResponse
    {
        if (! Carbon::parse($pickup->pickup_date)->isToday()) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda hanya dapat memperbarui status untuk jadwal HARI INI.',
            ], 422);
        }

        $request->validate([
            'status'              => 'required|in:on_the_way,completed,failed',
            'cancellation_reason' => 'required_if:status,failed|nullable|string|max:1000',
            'lat'                 => 'nullable|numeric|between:-90,90',
            'lng'                 => 'nullable|numeric|between:-180,180',
        ]);

        $pickup->update([
            'cleanup_id'          => $request->user()->id,
            'vehicle_id'          => $request->user()->vehicle_id,
            'status'              => $request->status,
            'cancellation_reason' => $request->status === 'failed' ? $request->cancellation_reason : null,
        ]);

        if ($request->filled('lat') && $request->filled('lng')) {
            $request->user()->update([
                'current_lat'      => (float) $request->lat,
                'current_lng'      => (float) $request->lng,
                'last_location_at' => Carbon::now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Status jadwal pickup berhasil diperbarui.',
            'pickup'  => $pickup->fresh(['company']),
        ]);
    }
    /**
     * Update operator GPS location.
     */
    // ponytail: operator mobile GPS ping; upgrade to background telemetry stream if native app tracks continuous paths.
    public function updateLocation(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => 'required|numeric|between:-90,90',
            'lng' => 'required|numeric|between:-180,180',
        ]);

        $request->user()->update([
            'current_lat'      => $validated['lat'],
            'current_lng'      => $validated['lng'],
            'last_location_at' => Carbon::now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Lokasi operator berhasil diperbarui.',
        ]);
    }



    /**
     * Submit pickup completion details with evidence photo & weights.
     */
    public function submitPickup(Request $request, Pickup $pickup): JsonResponse
    {
        $pickupDate = Carbon::parse($pickup->pickup_date)->startOfDay();

        $isGraceAllowed = false;
        if ($request->filled('offline_recorded_at')) {
            try {
                $recordedAt = Carbon::parse($request->offline_recorded_at)->setTimezone(config('app.timezone', 'Asia/Jakarta'));
                $hourDiff = abs($recordedAt->diffInHours(Carbon::now()));
                if (($recordedAt->isSameDay($pickupDate) || $recordedAt->diffInDays($pickupDate) <= 1) && $hourDiff <= 48) {
                    $isGraceAllowed = true;
                }
            } catch (\Exception) {
                // fallback
            }
        }

        if (! $pickupDate->isToday() && ! $isGraceAllowed) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Anda hanya dapat mensubmit untuk jadwal HARI INI atau antrean offline dalam batas toleransi.',
            ], 422);
        }

        $request->validate([
            'trash_bag_count'      => 'nullable|integer|min:0',
            'organic_weight'       => 'nullable|numeric|min:0',
            'anorganic_weight'     => 'nullable|numeric|min:0',
            'residue_weight'       => 'nullable|numeric|min:0',
            'evidence_pickup_path' => 'required|image|max:5120',
            'offline_recorded_at'  => 'nullable|string',
        ]);

        $trashBagCount = $request->filled('trash_bag_count') ? (int) $request->trash_bag_count : null;
        $hasTrashBag   = $trashBagCount !== null && $trashBagCount > 0;
        $hasWeight     = $request->filled('organic_weight') || $request->filled('anorganic_weight') || $request->filled('residue_weight');

        if (! $hasTrashBag && ! $hasWeight) {
            return response()->json([
                'success' => false,
                'message' => 'Harap masukkan jumlah trashbag atau berat tonase sampah.',
            ], 422);
        }

        $evidencePickupPath = $request->file('evidence_pickup_path')->store('pickups/evidence', 'public');

        $pickup->update([
            'cleanup_id'           => $request->user()->id,
            'vehicle_id'           => $pickup->vehicle_id ?? $request->user()->vehicle_id,
            'status'               => 'completed',
            'organic_weight'       => (float) $request->input('organic_weight', 0),
            'anorganic_weight'     => (float) $request->input('anorganic_weight', 0),
            'residue_weight'       => (float) $request->input('residue_weight', 0),
            'trash_bag_count'      => $trashBagCount,
            'evidence_pickup_path' => $evidencePickupPath,
        ]);

        return response()->json([
            'success'   => true,
            'message'   => 'Berhasil merekam pengambilan sampah!',
            'pickup_id' => $pickup->id,
            'pickup'    => $pickup->fresh(['company']),
        ]);
    }

    /**
     * Operator pickup history.
     */
    public function history(Request $request): JsonResponse
    {
        $pickups = Pickup::with('company:id,company_name,pic_name,address')
            ->where('cleanup_id', $request->user()->id)
            ->whereIn('status', ['completed', 'failed'])
            ->orderBy('pickup_date', 'desc')
            ->paginate((int) $request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'pickups' => $pickups,
        ]);
    }

    /**
     * Active companies list for operator dropdowns.
     */
    public function companies(): JsonResponse
    {
        $companies = Company::where('subscription_status', 'active')
            ->select('id', 'company_name', 'address', 'pic_name')
            ->orderBy('company_name')
            ->get();

        return response()->json([
            'success'   => true,
            'companies' => $companies,
        ]);
    }

    /**
     * Waste processing activities documented by operators.
     */
    public function activities(): JsonResponse
    {
        $activities = CompanyActivity::with('company:id,company_name')
            ->orderBy('activity_date', 'desc')
            ->limit(50)
            ->get();

        return response()->json([
            'success'    => true,
            'activities' => $activities,
        ]);
    }

    /**
     * Store operator waste processing activity.
     */
    public function storeActivity(Request $request): JsonResponse
    {
        $request->validate([
            'company_id'    => 'required|exists:companies,id',
            'activity_date' => 'required|date',
            'note'          => 'nullable|string|max:1000',
            'media'         => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi|max:20480',
        ]);

        $company = Company::findOrFail($request->company_id);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mimeType = $file->getMimeType();

            if (str_starts_with($mimeType, 'video/')) {
                $mediaType = 'video';
                $mediaPath = $file->store('documents/activities/videos', 'public');
            } else {
                $mediaType = 'image';
                $mediaPath = $file->store('documents/activities/images', 'public');
            }
        }

        $activity = $company->activities()->create([
            'activity_date' => $request->activity_date,
            'note'          => $request->note,
            'media_path'    => $mediaPath,
            'media_type'    => $mediaType,
        ]);

        return response()->json([
            'success'  => true,
            'message'  => 'Aktivitas berhasil didokumentasikan.',
            'activity' => $activity->load('company:id,company_name'),
        ], 201);
    }

    /**
     * Attendance status for today.
     */
    public function attendanceStatus(Request $request): JsonResponse
    {
        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        $todayApprovedOvertime = OvertimeRequest::where('user_id', $user->id)
            ->where('date', $today)
            ->where('status', 'approved')
            ->exists();

        return response()->json([
            'success'               => true,
            'date'                  => $today,
            'attendance'            => $attendance,
            'todayApprovedOvertime' => $todayApprovedOvertime,
        ]);
    }

    /**
     * Attendance monthly summary & salary preview.
     */
    public function attendanceSummary(Request $request): JsonResponse
    {
        $user          = $request->user();
        $selectedMonth = $request->query('month', Carbon::now()->format('Y-m'));
        [$year, $month] = explode('-', $selectedMonth);

        $attendances = Attendance::where('user_id', $user->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        $leaveRequests = LeaveRequest::where('user_id', $user->id)
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->orderBy('date', 'desc')
            ->get();

        $overtimeRequests = OvertimeRequest::where('user_id', $user->id)
            ->orderBy('date', 'desc')
            ->limit(20)
            ->get();

        $qualifiedDays    = $attendances->filter(fn ($a) => ($a->work_hours ?? 0) >= MIN_WORK_HOURS)->count();
        $totalHours       = round($attendances->sum('work_hours'), 1);
        $estimatedSalary  = $qualifiedDays * DAILY_RATE;

        $totalOvertimeHours = round(
            $attendances->where('overtime_approved', true)->sum('overtime_hours'),
            1
        );
        $overtimeSalary = $totalOvertimeHours * 10000;

        return response()->json([
            'success'           => true,
            'selected_month'    => $selectedMonth,
            'attendances'       => $attendances,
            'leave_requests'    => $leaveRequests,
            'overtime_requests' => $overtimeRequests,
            'summary'           => [
                'total_days'           => $attendances->count(),
                'qualified_days'       => $qualifiedDays,
                'total_hours'          => $totalHours,
                'estimated_salary'     => $estimatedSalary,
                'daily_rate'           => DAILY_RATE,
                'min_hours'            => MIN_WORK_HOURS,
                'total_overtime_hours' => $totalOvertimeHours,
                'overtime_salary'      => $overtimeSalary,
            ],
        ]);
    }

    /**
     * Clock in.
     */
    public function clockIn(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $existing = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen masuk hari ini.',
            ], 422);
        }

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('attendance/clock_in', 'public')
            : null;

        $attendance = Attendance::create([
            'user_id'        => $user->id,
            'date'           => $today,
            'clock_in_at'    => Carbon::now(),
            'clock_in_photo' => $photoPath,
            'clock_in_lat'   => $request->lat,
            'clock_in_lng'   => $request->lng,
            'status'         => 'incomplete',
        ]);

        if ($request->filled('lat') && $request->filled('lng')) {
            $user->update([
                'current_lat'      => (float) $request->lat,
                'current_lng'      => (float) $request->lng,
                'last_location_at' => Carbon::now(),
            ]);
        }

        return response()->json([
            'success'    => true,
            'message'    => 'Absen masuk berhasil dicatat!',
            'attendance' => $attendance,
        ]);
    }

    /**
     * Clock out.
     */
    public function clockOut(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan absen masuk hari ini.',
            ], 422);
        }

        if ($attendance->clock_out_at) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen pulang hari ini.',
            ], 422);
        }

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('attendance/clock_out', 'public')
            : null;

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

        // Auto-release armada operasional agar siap digunakan driver shift berikutnya
        $user->update(['vehicle_id' => null]);

        return response()->json([
            'success'    => true,
            'message'    => 'Absen pulang berhasil dicatat! Durasi kerja: ' . number_format($workHours, 1) . ' jam.',
            'attendance' => $attendance,
        ]);
    }

    /**
     * Request overtime.
     */
    public function requestOvertime(Request $request): JsonResponse
    {
        $request->validate([
            'date'   => 'required|date|after_or_equal:today',
            'reason' => 'required|string|max:500',
        ]);

        $user = $request->user();

        $exists = OvertimeRequest::where('user_id', $user->id)
            ->where('date', $request->date)
            ->exists();

        if ($exists) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah memiliki pengajuan lembur untuk tanggal tersebut.',
            ], 422);
        }

        $overtimeRequest = OvertimeRequest::create([
            'user_id' => $user->id,
            'date'    => $request->date,
            'reason'  => $request->reason,
            'status'  => 'pending',
        ]);

        return response()->json([
            'success'          => true,
            'message'          => 'Pengajuan lembur berhasil dikirim. Tunggu persetujuan admin.',
            'overtime_request' => $overtimeRequest,
        ]);
    }

    /**
     * Overtime clock in.
     */
    public function clockInOvertime(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance || $attendance->status !== 'present') {
            return response()->json([
                'success' => false,
                'message' => 'Anda harus menyelesaikan absen jam kerja reguler terlebih dahulu.',
            ], 422);
        }

        if ($attendance->overtime_clock_in_at) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen masuk lembur hari ini.',
            ], 422);
        }

        $approvedRequest = OvertimeRequest::where('user_id', $user->id)
            ->where('date', $today)
            ->where('status', 'approved')
            ->first();

        if (! $approvedRequest) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum memiliki izin lembur yang disetujui admin untuk hari ini.',
            ], 422);
        }

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('attendance/overtime_in', 'public')
            : null;

        $attendance->update([
            'overtime_clock_in_at'    => Carbon::now(),
            'overtime_clock_in_photo' => $photoPath,
            'overtime_clock_in_lat'   => $request->lat,
            'overtime_clock_in_lng'   => $request->lng,
            'overtime_approved'       => true,
        ]);

        return response()->json([
            'success'    => true,
            'message'    => 'Absen masuk lembur berhasil dicatat!',
            'attendance' => $attendance,
        ]);
    }

    /**
     * Overtime clock out.
     */
    public function clockOutOvertime(Request $request): JsonResponse
    {
        $request->validate([
            'photo' => 'nullable|image|max:5120',
            'lat'   => 'nullable|numeric',
            'lng'   => 'nullable|numeric',
        ]);

        $user  = $request->user();
        $today = Carbon::today()->toDateString();

        $attendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $today)
            ->first();

        if (! $attendance || ! $attendance->overtime_clock_in_at) {
            return response()->json([
                'success' => false,
                'message' => 'Anda belum melakukan absen masuk lembur hari ini.',
            ], 422);
        }

        if ($attendance->overtime_clock_out_at) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absen pulang lembur hari ini.',
            ], 422);
        }

        $photoPath = $request->hasFile('photo')
            ? $request->file('photo')->store('attendance/overtime_out', 'public')
            : null;

        $clockOut = Carbon::now();
        $overtimeHours = $attendance->overtime_approved
            ? round($attendance->overtime_clock_in_at->diffInMinutes($clockOut) / 60, 2)
            : 0;

        $attendance->update([
            'overtime_clock_out_at'    => $clockOut,
            'overtime_clock_out_photo' => $photoPath,
            'overtime_clock_out_lat'   => $request->lat,
            'overtime_clock_out_lng'   => $request->lng,
            'overtime_hours'           => $overtimeHours,
        ]);

        // Auto-release armada operasional
        $request->user()->update(['vehicle_id' => null]);

        return response()->json([
            'success'    => true,
            'message'    => 'Absen pulang lembur berhasil dicatat! Durasi lembur: ' . number_format($overtimeHours, 1) . ' jam.',
            'attendance' => $attendance,
        ]);
    }

    /**
     * Store leave request (izin / sakit).
     */
    public function storeLeaveRequest(Request $request): JsonResponse
    {
        $request->validate([
            'date'        => 'required|date',
            'type'        => 'required|in:izin,sakit',
            'reason'      => 'required|string|max:1000',
            'proof_image' => 'nullable|image|max:5120',
        ]);

        $user = $request->user();
        $date = Carbon::parse($request->date)->toDateString();

        $hasAttendance = Attendance::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->exists();

        if ($hasAttendance) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah melakukan absensi pada tanggal tersebut.',
            ], 422);
        }

        $existing = LeaveRequest::where('user_id', $user->id)
            ->whereDate('date', $date)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah mengajukan izin/sakit untuk tanggal tersebut.',
            ], 422);
        }

        $proofImagePath = null;
        if ($request->hasFile('proof_image')) {
            $proofImagePath = $request->file('proof_image')->store('leave_requests', 'public');
        }

        $leave = LeaveRequest::create([
            'user_id'          => $user->id,
            'date'             => $date,
            'type'             => $request->type,
            'reason'           => $request->reason,
            'proof_image_path' => $proofImagePath,
            'status'           => 'pending',
        ]);

        return response()->json([
            'success'       => true,
            'message'       => 'Pengajuan izin/sakit berhasil dikirim.',
            'leave_request' => $leave,
        ], 201);
    }
}
