<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
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
        $company->load([
            'user',
            'pickups' => function ($q) {
                $q->with('cleanup:id,name')->orderByDesc('pickup_date')->take(20);
            }
        ]);
        
        $company->remaining_days = null;

        return Inertia::render('Admin/Companies/Show', [
            'company' => $company
        ]);
    }

    public function monitoringMap()
    {
        return Inertia::render('Admin/MonitoringMap');
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
            ->with(['vehicle', 'pickups' => function ($q) {
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
                    'vehicle'          => $d->vehicle ? [
                        'id'            => $d->vehicle->id,
                        'name'          => $d->vehicle->name,
                        'license_plate' => $d->vehicle->license_plate,
                        'type'          => $d->vehicle->type,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/CleanUP/Index', [
            'cleanups' => $cleanups,
        ]);
    }

    public function cleanupDetail(User $user)
    {
        $user->load('vehicle');
        $pickups = Pickup::where('cleanup_id', $user->id)
            ->with(['company', 'vehicle'])
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
                    'vehicle'             => $p->vehicle ? [
                        'name'          => $p->vehicle->name,
                        'license_plate' => $p->vehicle->license_plate,
                    ] : null,
                    'company'             => $p->company ? [
                        'id'           => $p->company->id,
                        'company_name' => $p->company->company_name,
                        'address'      => $p->company->address,
                    ] : null,
                ];
            });

        return Inertia::render('Admin/CleanUP/Show', [
            'cleanup'  => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'vehicle' => $user->vehicle ? [
                    'id'            => $user->vehicle->id,
                    'name'          => $user->vehicle->name,
                    'license_plate' => $user->vehicle->license_plate,
                    'type'          => $user->vehicle->type,
                ] : null,
            ],
            'pickups' => $pickups,
        ]);
    }

    /**
     * Get real-time coordinates of all active operators.
     */
    // ponytail: active fleet & partner coordinates endpoint; add geofencing alerts when scale exceeds 50 trucks.
    public function liveLocations()
    {
        $today = Carbon::today()->toDateString();
        $cleanups = User::where('role', 'CleanUP')
            ->select('id', 'name', 'email', 'vehicle_id', 'current_lat', 'current_lng', 'last_location_at')
            ->with([
                'vehicle:id,name,license_plate,type,capacity',
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
                    'vehicle'          => $cleanup->vehicle ? [
                        'id'            => $cleanup->vehicle->id,
                        'name'          => $cleanup->vehicle->name,
                        'license_plate' => $cleanup->vehicle->license_plate,
                        'type'          => $cleanup->vehicle->type,
                        'capacity'      => $cleanup->vehicle->capacity,
                    ] : null,
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

        // Mitra / Companies with GPS coordinates (auto-resolve coordinates if missing)
        $companies = Company::whereNotNull('address')
            ->where('address', '!=', '')
            ->where('subscription_status', '!=', 'rejected')
            ->with(['pickups' => function ($q) use ($today) {
                $q->whereDate('pickup_date', $today)
                  ->with(['cleanup.vehicle', 'vehicle']);
            }])
            ->get()
            ->map(function ($c) {
                // Auto-resolve GPS coordinates from address if missing or zero
                if ((is_null($c->latitude) || $c->latitude == 0) && !empty($c->address)) {
                    [$lat, $lng] = self::resolveCompanyCoordinates($c->address, $c->id);
                    if ($lat && $lng) {
                        $c->update(['latitude' => $lat, 'longitude' => $lng]);
                        $c->latitude = $lat;
                        $c->longitude = $lng;
                    }
                }

                $todayPickup = $c->pickups->firstWhere('status', 'completed')
                    ?? $c->pickups->firstWhere('status', 'on_the_way')
                    ?? $c->pickups->first();

                $status = $todayPickup ? $todayPickup->status : 'none';
                $totalWeight = $todayPickup ? (float) (($todayPickup->organic_weight ?? 0) + ($todayPickup->anorganic_weight ?? 0) + ($todayPickup->residue_weight ?? 0)) : 0;
                $assignedVehicle = $todayPickup?->vehicle ?? $todayPickup?->cleanup?->vehicle;

                return [
                    'id'                  => $c->id,
                    'company_name'        => $c->company_name,
                    'pic_name'            => $c->pic_name,
                    'phone'               => $c->phone,
                    'address'             => $c->address,
                    'latitude'            => $c->latitude !== null ? (float) $c->latitude : null,
                    'longitude'           => $c->longitude !== null ? (float) $c->longitude : null,
                    'status'              => $status, // 'completed' | 'on_the_way' | 'scheduled' | 'failed' | 'none'
                    'subscription_plan'   => $c->subscription_plan,
                    'business_category'   => $c->business_category,
                    'driver_name'         => $todayPickup?->cleanup?->name,
                    'vehicle_name'        => $assignedVehicle?->name,
                    'vehicle_plate'       => $assignedVehicle?->license_plate,
                    'vehicle_type'        => $assignedVehicle?->type,
                    'total_weight'        => $totalWeight,
                    'organic_weight'      => (float) ($todayPickup?->organic_weight ?? 0),
                    'anorganic_weight'    => (float) ($todayPickup?->anorganic_weight ?? 0),
                    'residue_weight'      => (float) ($todayPickup?->residue_weight ?? 0),
                    'trash_bag_count'     => (int) ($todayPickup?->trash_bag_count ?? 0),
                    'evidence_url'        => $todayPickup?->evidence_pickup_path ? asset('storage/' . $todayPickup->evidence_pickup_path) : null,
                    'cancellation_reason' => $todayPickup?->cancellation_reason,
                    'pickup_id'           => $todayPickup?->id,
                    'pickup_time'         => $todayPickup?->updated_at?->format('H:i'),
                    'detail_url'          => route('admin.companies.show', $c->id),
                ];
            });

        return response()->json([
            'cleanups'  => $cleanups,
            'companies' => $companies,
        ]);
    }

    /**
     * Resolve GPS coordinates from address with Nominatim, keyword mapping, and Jember fallbacks.
     */
    public static function resolveCompanyCoordinates(string $address, ?int $seed = null): array
    {
        $cleanAddress = trim($address);
        if (empty($cleanAddress)) {
            return [null, null];
        }

        $hasJember = str_contains(strtolower($cleanAddress), 'jember');
        $queries = [$hasJember ? $cleanAddress : "{$cleanAddress}, Jember"];

        $simplified = preg_replace('/(rt|rw|no|kel|kec)\.?\s*\d+/i', '', $cleanAddress);
        $simplified = preg_replace('/[,\.\-]+/', ' ', $simplified);
        $simplified = trim(preg_replace('/\s+/', ' ', $simplified));
        if ($simplified !== $cleanAddress && !empty($simplified)) {
            $queries[] = $hasJember ? $simplified : "{$simplified}, Jember";
        }

        foreach ($queries as $q) {
            try {
                $res = Http::withHeaders([
                    'User-Agent' => 'WelltrashApp/1.0 (info@welltrash.com)',
                    'Accept'     => 'application/json',
                ])->timeout(3)->get('https://nominatim.openstreetmap.org/search', [
                    'format' => 'json',
                    'q'      => $q,
                    'limit'  => 1,
                ]);

                if ($res->successful() && !empty($res->json())) {
                    $first = $res->json()[0];
                    return [(float) $first['lat'], (float) $first['lon']];
                }
            } catch (\Throwable) {
            }
        }

        // Sub-district centroid keywords in Jember
        $subdistricts = [
            'patrang'    => [-8.1518, 113.7161],
            'kaliwates'  => [-8.1764, 113.6890],
            'sumbersari' => [-8.1720, 113.7180],
            'mastrip'    => [-8.1650, 113.7120],
            'gajah mada' => [-8.1764, 113.6890],
            'baratan'    => [-8.1400, 113.7250],
            'kampus'     => [-8.1660, 113.7150],
            'mangli'     => [-8.1880, 113.6550],
            'tanggul'    => [-8.1610, 113.4500],
            'ambulu'     => [-8.3490, 113.6060],
            'balung'     => [-8.2770, 113.5350],
            'sukorambi'  => [-8.1400, 113.6600],
            'puger'      => [-8.3750, 113.4800],
            'kencong'    => [-8.2800, 113.3700],
            'ajung'      => [-8.2100, 113.6700],
            'rambipuji'  => [-8.2000, 113.6100],
        ];

        $lower = strtolower($cleanAddress);
        foreach ($subdistricts as $key => $coords) {
            if (str_contains($lower, $key)) {
                $offset = $seed ? (sin($seed) * 0.003) : 0;
                return [round($coords[0] + $offset, 6), round($coords[1] + $offset, 6)];
            }
        }

        // Deterministic Jember center fallback so markers don't stack directly on top of each other
        $baseLat = -8.1724;
        $baseLng = 113.6995;
        $offsetLat = $seed ? (sin($seed * 1.7) * 0.012) : 0;
        $offsetLng = $seed ? (cos($seed * 2.3) * 0.012) : 0;

        return [round($baseLat + $offsetLat, 6), round($baseLng + $offsetLng, 6)];
    }
}
