<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\Pickup;
use App\Models\SiteSetting;
use App\Models\User;
use App\Models\Vehicle;
use App\Services\HrisService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

/**
 * Admin screens of the operator mobile app: live data only, never placeholders.
 */
class AdminApiController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $commercial = $request->user()->hasRole(User::COMMERCIAL_ROLES);
        $today = Carbon::today()->toDateString();
        $pickups = Pickup::whereDate('pickup_date', $today)->get();
        $done = $pickups->where('status', 'completed');

        return response()->json([
            'date'              => $today,
            'active_armada'     => User::where('role', 'CleanUP')->whereNotNull('vehicle_id')->distinct()->count('vehicle_id'),
            'total_armada'      => Vehicle::where('status', 'active')->count(),
            'pickups_completed' => $done->count(),
            'pickups_total'     => $pickups->count(),
            'kg_organik'        => round((float) $done->sum('organic_weight'), 2),
            'kg_anorganik'      => round((float) $done->sum('anorganic_weight'), 2),
            'kg_residu'         => round((float) $done->sum('residue_weight'), 2),
            'pending_approvals' => OvertimeRequest::where('status', 'pending')->count()
                + LeaveRequest::where('status', 'pending')->count()
                + ($commercial ? Company::where('subscription_status', 'pending')->count() : 0),
            'executive'         => $this->executiveSummary($commercial),
            'target'            => $this->monthlyTarget() + ['can_set' => $request->user()->hasRole(User::ACCOUNT_ROLES)],
        ]);
    }

    /** Current month's goal (null = not set). Stored per month in site_settings, e.g. target_kg:2026-11. */
    private function monthlyTarget(): array
    {
        $month = Carbon::today()->format('Y-m');
        $num = fn ($v) => $v === null ? null : (float) $v;

        return [
            'month'   => $month,
            'ends_on' => Carbon::today()->endOfMonth()->toDateString(),
            'kg'      => $num(SiteSetting::get("target_kg:{$month}")),
            'pickups' => $num(SiteSetting::get("target_pickups:{$month}")),
        ];
    }

    public function setMonthlyTarget(Request $request): JsonResponse
    {
        $data = $request->validate([
            'kg'      => 'nullable|numeric|min:1|max:10000000',
            'pickups' => 'nullable|integer|min:1|max:1000000',
        ]);
        $month = Carbon::today()->format('Y-m');
        foreach (['kg', 'pickups'] as $k) {
            isset($data[$k])
                ? SiteSetting::set("target_{$k}:{$month}", $data[$k])
                : SiteSetting::where('key', "target_{$k}:{$month}")->delete();
        }

        return response()->json(['success' => true, 'target' => $this->monthlyTarget()]);
    }

    /** Director/GM view: month-to-date vs the same days last month, 7-day trend, people and receivables. */
    private function executiveSummary(bool $commercial): array
    {
        $today = Carbon::today();
        $kgSql = 'COALESCE(organic_weight,0)+COALESCE(anorganic_weight,0)+COALESCE(residue_weight,0)';
        $range = function (Carbon $from, Carbon $to) use ($kgSql) {
            $row = Pickup::where('status', 'completed')
                ->whereDate('pickup_date', '>=', $from->toDateString())
                ->whereDate('pickup_date', '<=', $to->toDateString())
                ->selectRaw("COUNT(*) c, SUM($kgSql) kg")->first();
            return ['pickups' => (int) $row->c, 'kg' => round((float) $row->kg, 2)];
        };

        $prevStart = $today->copy()->startOfMonth()->subMonthNoOverflow();
        $prevEnd = $prevStart->copy()->addDays($today->day - 1)->min($prevStart->copy()->endOfMonth());

        $daily = Pickup::where('status', 'completed')
            ->whereDate('pickup_date', '>=', $today->copy()->subDays(6)->toDateString())
            ->selectRaw("DATE(pickup_date) d, COUNT(*) c, SUM($kgSql) kg")
            ->groupBy('d')->get()->keyBy('d');

        $crew = fn ($q) => $q->where('role', 'CleanUP');
        $unpaid = Invoice::where('status', 'unpaid');

        // Koordinator: operasional saja, tanpa angka piutang mitra.
        $receivables = !$commercial ? [] : [
            'unpaid_count'   => (clone $unpaid)->count(),
            'unpaid_amount'  => round((float) (clone $unpaid)->sum('amount'), 2),
            'overdue_count'  => (clone $unpaid)->whereDate('due_date', '<', $today)->count(),
        ];

        return $receivables + [
            'month'          => $range($today->copy()->startOfMonth(), $today),
            'prev_month'     => $range($prevStart, $prevEnd),
            'trend'          => collect(range(6, 0))->map(function ($ago) use ($today, $daily) {
                $d = $today->copy()->subDays($ago)->toDateString();
                return ['date' => $d, 'pickups' => (int) ($daily[$d]->c ?? 0), 'kg' => round((float) ($daily[$d]->kg ?? 0), 2)];
            })->values(),
            'crew_total'     => User::where('role', 'CleanUP')->count(),
            'crew_present'   => Attendance::whereHas('user', $crew)->whereDate('date', $today)->whereNotNull('clock_in_at')->distinct()->count('user_id'),
            'crew_on_leave'  => LeaveRequest::whereHas('user', $crew)->where('status', 'approved')->whereDate('date', $today)->distinct()->count('user_id'),
        ];
    }

    public function liveLocations(): JsonResponse
    {
        $today = Carbon::today()->toDateString();

        $drivers = User::where('role', 'CleanUP')
            ->with([
                'attendances' => fn ($q) => $q->whereDate('date', $today),
                'pickups' => fn ($q) => $q->whereDate('pickup_date', $today)
                    ->whereIn('status', ['on_the_way', 'scheduled'])
                    ->with('company:id,company_name,address'),
            ])
            ->orderBy('name')
            ->get()
            ->map(function (User $u) {
                $att = $u->attendances->first();
                $task = $u->pickups->firstWhere('status', 'on_the_way') ?? $u->pickups->firstWhere('status', 'scheduled');
                $recent = $u->last_location_at && $u->last_location_at->gt(Carbon::now()->subMinutes(30));
                $working = $att && !$att->clock_out_at;

                return [
                    'id'                   => $u->id,
                    'name'                 => $u->name,
                    'phone'                => '',
                    'status'               => $task?->status === 'on_the_way' ? 'on_the_way' : (($recent || $working) ? 'standby' : 'offline'),
                    'current_task_company' => $task?->company?->company_name,
                    'current_task_address' => $task?->company?->address,
                    'lat'                  => $u->current_lat ?? $att?->clock_in_lat,
                    'lng'                  => $u->current_lng ?? $att?->clock_in_lng,
                    'last_seen'            => ($u->last_location_at ?? $att?->clock_in_at)?->toIso8601String(),
                ];
            });

        return response()->json(['data' => $drivers]);
    }

    public function approvals(Request $request): JsonResponse
    {
        $overtime = OvertimeRequest::with('user:id,name')->where('status', 'pending')->orderBy('date')->get()
            ->map(fn ($o) => [
                'id'             => $o->id,
                'type'           => 'overtime',
                'title'          => 'Pengajuan Lembur',
                'applicant_name' => $o->user?->name ?? '-',
                'date'           => $o->date?->toDateString(),
                'reason'         => $o->reason,
                'photo_url'      => null,
                'status'         => $o->status,
            ]);

        $leave = LeaveRequest::with('user:id,name')->where('status', 'pending')->orderBy('date')->get()
            ->map(fn ($l) => [
                'id'             => $l->id,
                'type'           => 'leave',
                'title'          => $l->type === 'sakit' ? 'Pengajuan Sakit' : 'Pengajuan Izin',
                'applicant_name' => $l->user?->name ?? '-',
                'date'           => $l->date?->toDateString(),
                'reason'         => $l->reason,
                'photo_url'      => $l->proof_image ? Storage::disk('public')->url($l->proof_image) : null,
                'status'         => $l->status,
            ]);

        $companies = !$request->user()->hasRole(User::COMMERCIAL_ROLES) ? collect() : Company::where('subscription_status', 'pending')->orderBy('created_at')->get()
            ->map(fn ($c) => [
                'id'             => $c->id,
                'type'           => 'company',
                'title'          => 'Pendaftaran Mitra Baru',
                'applicant_name' => $c->company_name,
                'date'           => $c->created_at?->toDateString(),
                'reason'         => trim("Paket {$c->subscription_plan} · PIC {$c->pic_name}"),
                'photo_url'      => null,
                'status'         => 'pending',
            ]);

        return response()->json(['data' => $overtime->concat($leave)->concat($companies)->values()]);
    }

    public function reviewOvertime(Request $request, OvertimeRequest $overtimeRequest): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:approved,rejected', 'admin_note' => 'nullable|string|max:500']);
        $overtimeRequest->review($request->user(), ['status' => $data['status'], 'admin_note' => $data['admin_note'] ?? null]);

        return response()->json(['success' => true]);
    }

    public function reviewLeave(Request $request, LeaveRequest $leaveRequest, HrisService $hrisService): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:approved,rejected', 'admin_note' => 'nullable|string|max:500']);
        $leaveRequest->review($request->user(), ['status' => $data['status'], 'admin_note' => $data['admin_note'] ?? null]);

        // Same as the web review: the decision is reflected in HRIS attendance.
        \Illuminate\Support\defer(fn () => $hrisService->pushLeave($leaveRequest));

        return response()->json(['success' => true]);
    }

    public function reviewCompany(Request $request, Company $company): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:approved,rejected', 'reason' => 'nullable|string|max:500']);

        $company->review($request->user(), $data['status'] === 'approved'
            ? ['subscription_status' => 'approved']
            : ['subscription_status' => 'rejected', 'rejection_reason' => $data['reason'] ?: 'Ditolak melalui aplikasi admin', 'refund_evidence_path' => null]);

        return response()->json(['success' => true]);
    }
}
