<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Company;
use App\Models\User;
use App\Models\Pickup;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function indexCompanies()
    {
        $companies = Company::with('user')->get()->map(function ($company) {
            $company->remaining_days = null;
            return $company;
        });

        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies
        ]);
    }

    public function showCompany(Company $company)
    {
        $company->load('user');
        
        $company->remaining_days = null;

        return Inertia::render('Admin/Companies/Show', [
            'company' => $company
        ]);
    }

    public function pendingCompanies()
    {
        $companies = Company::where('subscription_status', 'pending')->with('user')->get();
        return Inertia::render('Admin/PendingCompanies', [
            'companies' => $companies
        ]);
    }

    public function approveCompany(Company $company)
    {
        $company->update([
            'subscription_status' => 'approved',
        ]);
        
        return back()->with('success', 'Perusahaan berhasil disetujui. Menunggu mitra untuk mengunggah bukti pembayaran.');
    }

    public function activateCompany(Company $company)
    {
        $company->update([
            'subscription_status' => 'active',
            'subscription_end_date' => null
        ]);
        
        \Illuminate\Support\Facades\Artisan::call('pickups:generate', [
            '--company' => $company->id
        ]);

        return back()->with('success', 'Perusahaan berhasil diaktifkan dan jadwal awal telah dibuat.');
    }

    public function toggleStatus(Company $company)
    {
        if ($company->subscription_status === 'active') {
            $company->update(['subscription_status' => 'inactive']);
            $msg = 'Akun mitra dinonaktifkan.';
        } elseif ($company->subscription_status === 'inactive') {
            $company->update(['subscription_status' => 'active']);
            $msg = 'Akun mitra diaktifkan.';
        } else {
            return back()->with('error', 'Hanya akun aktif/nonaktif yang dapat diubah statusnya.');
        }
        return back()->with('success', $msg);
    }

    public function rejectCompany(Request $request, Company $company)
    {
        $request->validate([
            'rejection_reason' => 'required|string',
        ]);

        $company->update([
            'subscription_status' => 'rejected',
            'rejection_reason' => $request->rejection_reason,
            'refund_evidence_path' => null,
        ]);

        return back()->with('success', 'Perusahaan berhasil ditolak.');
    }

    public function cancellationRequests()
    {
        $companies = Company::where('subscription_status', 'cancellation_requested')->with('user')->get();
        return Inertia::render('Admin/Companies/Cancellations', [
            'companies' => $companies
        ]);
    }

    public function approveCancellation(Company $company)
    {
        $company->delete();
        return back()->with('success', 'Company subscription cancelled and data removed.');
    }

    public function dashboard()
    {
        $companies = Company::with(['pickups' => function ($q) {
            $q->where('status', 'completed');
        }])->get();

        $trashStats = $companies->map(function ($c) {
            return [
                'company_name'   => $c->company_name,
                'subscription_plan' => $c->subscription_plan,
                'subscription_status' => $c->subscription_status,
                'organic'        => round($c->pickups->sum('organic_weight'), 2),
                'anorganic'      => round($c->pickups->sum('anorganic_weight'), 2),
                'residue'        => round($c->pickups->sum('residue_weight'), 2),
                'trash_bags'     => (int) $c->pickups->sum('trash_bag_count'),
                'total_pickups'  => $c->pickups->count(),
            ];
        });

        $totals = [
            'organic'       => round($trashStats->sum('organic'), 2),
            'anorganic'     => round($trashStats->sum('anorganic'), 2),
            'residue'       => round($trashStats->sum('residue'), 2),
            'trash_bags'    => (int) $trashStats->sum('trash_bags'),
            'total_pickups' => $trashStats->sum('total_pickups'),
            'total_companies' => $companies->count(),
            'active_companies' => $companies->where('subscription_status', 'active')->count(),
            'pending_companies' => Company::where('subscription_status', 'pending')->count(),
        ];

        return Inertia::render('Admin/Dashboard', [
            'trashStats' => $trashStats,
            'totals'     => $totals,
        ]);
    }

    public function cleanups()
    {
        $cleanups = User::where('role', 'CleanUP')
            ->withCount(['pickups as total_pickups', 'pickups as completed_pickups' => function ($q) {
                $q->where('status', 'completed');
            }, 'pickups as failed_pickups' => function ($q) {
                $q->where('status', 'failed');
            }])
            ->with(['pickups' => function ($q) {
                $q->latest('pickup_date')->take(1);
            }])
            ->get()
            ->map(function ($d) {
                return [
                    'id'               => $d->id,
                    'name'             => $d->name,
                    'email'            => $d->email,
                    'total_pickups'    => $d->total_pickups,
                    'completed_pickups'=> $d->completed_pickups,
                    'failed_pickups'   => $d->failed_pickups,
                    'last_activity'    => $d->pickups->first()?->pickup_date,
                ];
            });

        return Inertia::render('Admin/CleanUP/Index', [
            'cleanups' => $cleanups,
        ]);
    }

    public function cleanupDetail(User $user)
    {
        $pickups = Pickup::where('cleanup_id', $user->id)
            ->with('company')
            ->orderByDesc('pickup_date')
            ->get()
            ->map(function ($p) {
                return [
                    'id'                  => $p->id,
                    'pickup_date'         => $p->pickup_date,
                    'status'              => $p->status,
                    'organic_weight'      => (float) $p->organic_weight,
                    'anorganic_weight'    => (float) $p->anorganic_weight,
                    'residue_weight'      => (float) $p->residue_weight,
                    'trash_bag_count'     => $p->trash_bag_count !== null ? (int) $p->trash_bag_count : null,
                    'evidence_pickup_path'=> $p->evidence_pickup_path,
                    'cancellation_reason' => $p->cancellation_reason,
                    'company'             => $p->company ? [
                        'id'           => $p->company->id,
                        'company_name' => $p->company->company_name,
                        'address'      => $p->company->address,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/CleanUP/Show', [
            'cleanup'  => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email],
            'pickups' => $pickups,
        ]);
    }

    /**
     * Get real-time coordinates of all active operators.
     */
    // ponytail: active fleet live coordinates endpoint; add geofencing alerts when scale exceeds 50 trucks.
    public function liveLocations()
    {
        $today = Carbon::today()->toDateString();
        $cleanups = User::where('role', 'CleanUP')
            ->select('id', 'name', 'email', 'current_lat', 'current_lng', 'last_location_at')
            ->with([
                'attendances' => function ($q) use ($today) {
                    $q->whereDate('date', $today);
                },
                'pickups' => function ($q) use ($today) {
                    $q->whereDate('pickup_date', $today)
                      ->whereIn('status', ['on_the_way', 'scheduled'])
                      ->with('company:id,company_name,address,latitude,longitude');
                },
            ])
            ->get()
            ->map(function ($cleanup) {
                $todayAttendance = $cleanup->attendances->first();
                $lat = $cleanup->current_lat ?? ($todayAttendance?->clock_in_lat ? (float) $todayAttendance->clock_in_lat : null);
                $lng = $cleanup->current_lng ?? ($todayAttendance?->clock_in_lng ? (float) $todayAttendance->clock_in_lng : null);

                $activeTask = $cleanup->pickups->firstWhere('status', 'on_the_way')
                    ?? $cleanup->pickups->firstWhere('status', 'scheduled');

                $isOnline = ($cleanup->last_location_at && $cleanup->last_location_at->gt(Carbon::now()->subMinutes(30)))
                    || ($todayAttendance !== null);

                return [
                    'id'               => $cleanup->id,
                    'name'             => $cleanup->name,
                    'current_lat'      => $lat,
                    'current_lng'      => $lng,
                    'last_location_at' => $cleanup->last_location_at?->diffForHumans() ?? ($todayAttendance ? 'Hadir hari ini' : 'Belum aktif'),
                    'is_online'        => (bool) $isOnline,
                    'active_task'      => $activeTask ? [
                        'id'           => $activeTask->id,
                        'status'       => $activeTask->status,
                        'company_name' => $activeTask->company?->company_name,
                        'address'      => $activeTask->company?->address,
                        'dest_lat'     => $activeTask->company?->latitude,
                        'dest_lng'     => $activeTask->company?->longitude,
                    ] : null,
                ];
            });

        return response()->json(['cleanups' => $cleanups]);
    }
}
