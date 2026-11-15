<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\Pickup;
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
    public function dashboard(): JsonResponse
    {
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
                + Company::where('subscription_status', 'pending')->count(),
        ]);
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

    public function approvals(): JsonResponse
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

        $companies = Company::where('subscription_status', 'pending')->orderBy('created_at')->get()
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
        $overtimeRequest->update(['status' => $data['status'], 'admin_note' => $data['admin_note'] ?? null]);

        return response()->json(['success' => true]);
    }

    public function reviewLeave(Request $request, LeaveRequest $leaveRequest, HrisService $hrisService): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:approved,rejected', 'admin_note' => 'nullable|string|max:500']);
        $leaveRequest->update(['status' => $data['status'], 'admin_note' => $data['admin_note'] ?? null]);

        // Same as the web review: the decision is reflected in HRIS attendance.
        \Illuminate\Support\defer(fn () => $hrisService->pushLeave($leaveRequest));

        return response()->json(['success' => true]);
    }

    public function reviewCompany(Request $request, Company $company): JsonResponse
    {
        $data = $request->validate(['status' => 'required|in:approved,rejected', 'reason' => 'nullable|string|max:500']);

        $company->update($data['status'] === 'approved'
            ? ['subscription_status' => 'approved']
            : ['subscription_status' => 'rejected', 'rejection_reason' => $data['reason'] ?: 'Ditolak melalui aplikasi admin', 'refund_evidence_path' => null]);

        return response()->json(['success' => true]);
    }
}
