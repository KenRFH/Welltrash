<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Company;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class CompanyController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // Redirect to registration if the user doesn't have a company profile
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        if ($user->company->subscription_status === 'pending') {
            return Inertia::render('Company/Pending');
        }

        if ($user->company->subscription_status === 'rejected') {
            return Inertia::render('Company/Rejected', [
                'company' => $user->company
            ]);
        }

        if ($user->company->subscription_status === 'approved') {
            return Inertia::render('Company/AwaitingPayment', [
                'company' => $user->company
            ]);
        }

        if ($user->company->subscription_status === 'payment_uploaded') {
            return Inertia::render('Company/PendingActivation');
        }

        if ($user->company->subscription_status === 'inactive') {
            return Inertia::render('Company/Inactive');
        }

        $company = $user->company;

        $allowedPlans = ['Rumah Tangga (> 10km)', 'Reguler', 'Prime', 'Premium+'];
        if (!in_array($company->subscription_plan, $allowedPlans)) {
            return redirect()->route('company.mitra')->with('error', 'Akses dashboard hanya tersedia untuk paket Rumah Tangga (> 10km), Reguler, Prime, dan Premium+.');
        }


        $totalOrganic = $company->pickups()->where('status', 'completed')->sum('organic_weight') ?? 0;
        $totalAnorganic = $company->pickups()->where('status', 'completed')->sum('anorganic_weight') ?? 0;
        $totalResidue = $company->pickups()->where('status', 'completed')->sum('residue_weight') ?? 0;

        // Calculate Weekly Statistics for the current month
        $currentMonthPickups = $company->pickups()
            ->where('status', 'completed')
            ->whereMonth('pickup_date', \Carbon\Carbon::now()->month)
            ->whereYear('pickup_date', \Carbon\Carbon::now()->year)
            ->get();

        $weeklyStatistics = [
            ['week' => 'Mg 1', 'organic' => 0, 'anorganic' => 0],
            ['week' => 'Mg 2', 'organic' => 0, 'anorganic' => 0],
            ['week' => 'Mg 3', 'organic' => 0, 'anorganic' => 0],
            ['week' => 'Mg 4', 'organic' => 0, 'anorganic' => 0],
        ];

        foreach ($currentMonthPickups as $pickup) {
            $day = \Carbon\Carbon::parse($pickup->pickup_date)->day;
            $weekIndex = min((int) ceil($day / 7) - 1, 3); // Group days 22-31 into week 4

            $weeklyStatistics[$weekIndex]['organic'] += $pickup->organic_weight ?? 0;
            $weeklyStatistics[$weekIndex]['anorganic'] += $pickup->anorganic_weight ?? 0;
        }

        return Inertia::render('Company/Dashboard', [
            'company' => $company,
            'statistics' => [
                'total_organic' => $totalOrganic,
                'total_anorganic' => $totalAnorganic,
                'total_residue' => $totalResidue,
            ],
            'weekly_statistics' => $weeklyStatistics,
        ]);
    }

    public function register()
    {
        $user = Auth::user();
        if ($user->company) {
            return redirect()->route('company.dashboard');
        }

        return Inertia::render('Company/Register');
    }

    public function reregister()
    {
        $user = Auth::user();
        if ($user->company && $user->company->subscription_status === 'rejected') {
            $user->company->delete();
        }
        return redirect()->route('company.register');
    }

    public function storePayment(Request $request)
    {
        $request->validate([
            'payment_evidence' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120',
        ]);

        $company = Auth::user()->company;
        if ($company && $company->subscription_status === 'approved') {
            $path = $request->file('payment_evidence')->store('documents/payments', 'public');
            $company->update([
                'payment_evidence_path' => $path,
                'subscription_status' => 'payment_uploaded'
            ]);
            return redirect()->route('company.dashboard')->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu aktivasi admin.');
        }

        return back()->with('error', 'Tidak dapat mengunggah pembayaran pada status saat ini.');
    }

    public function history()
    {
        $user = Auth::user();

        if (!$user->company) {
            return redirect()->route('company.register');
        }

        $company = $user->company;

        $allowedPlans = ['Rumah Tangga (> 10km)', 'Reguler', 'Prime', 'Premium+'];
        if (!in_array($company->subscription_plan, $allowedPlans)) {
            return redirect()->route('company.mitra')->with('error', 'Fitur ini hanya tersedia untuk paket Rumah Tangga (> 10km), Reguler, Prime, dan Premium+.');
        }


        $pickups = $company->pickups()->with('cleanup')
            ->where(function ($query) {
                $query->whereDate('pickup_date', '<', \Carbon\Carbon::today()->toDateString())
                      ->orWhereIn('status', ['completed', 'failed']);
            })
            ->orderBy('pickup_date', 'desc')
            ->paginate(5);

        return Inertia::render('Company/History', [
            'company' => $company,
            'pickups' => $pickups
        ]);
    }

    public function laporanPdf()
{
    $user = Auth::user();

    if (!$user->company) {
        return redirect()->route('company.register');
    }

    $company = $user->company;

    $allowedPlans = ['Rumah Tangga (> 10km)', 'Reguler', 'Prime', 'Premium+'];

    if (!in_array($company->subscription_plan, $allowedPlans)) {
        return redirect()->route('company.mitra')
            ->with('error', 'Fitur ini hanya tersedia untuk paket Rumah Tangga (> 10km), Reguler, Prime, dan Premium+.');
    }


    try {
        $pickups = $company->pickups()
            ->with('cleanup')
            ->where(function ($query) {
                $query->whereDate('pickup_date', '<', Carbon::today()->toDateString())
                    ->orWhereIn('status', ['completed', 'failed']);
            })
            ->orderBy('pickup_date', 'desc')
            ->get();

        $pdf = Pdf::loadView('pdf.laporan-sampah', [
            'company' => $company,
            'pickups' => $pickups
        ]);

        // Pastikan folder font cache ada (penting di hosting)
        $fontDir = storage_path('fonts');
        if (!is_dir($fontDir)) {
            mkdir($fontDir, 0775, true);
        }

        $pdf->setOption('defaultFont', 'DejaVu Sans');
        $pdf->setOption('enable_html5_parser', true);
        $pdf->setOption('enable_remote', false);
        $pdf->setPaper('A4', 'portrait');

        return $pdf->stream('laporan-sampah.pdf');

    } catch (\Exception $e) {
        \Log::error('Laporan PDF Error: ' . $e->getMessage());
        return back()->with('error', 'Gagal mengunduh laporan. Silakan coba lagi.');
    }
}

    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'pic_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'business_category' => 'nullable|string|max:255',
            'subscription_plan' => 'required|string|in:Rumah Tangga (> 10km),Reguler,Prime,Premium+',
            'signed_mou' => 'required|file|mimes:pdf|max:10240',
            'pickup_schedule' => [
                'nullable',
                'array',
                function ($attribute, $value, $fail) use ($request) {
                    $plan = $request->subscription_plan;
                    if ($plan === 'Request') return; // no schedule needed
                    if (empty($value)) {
                        $fail('Jadwal penjemputan wajib dipilih.');
                        return;
                    }
                    $maxDays = in_array($plan, ['Prime', 'Premium+']) ? 6 : 4;
                    if (count($value) > $maxDays) {
                        $fail("Paket {$plan} maksimal hanya dapat memilih {$maxDays} hari penjemputan.");
                    }
                }
            ],
            'pickup_schedule.*' => 'string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
        ]);

        // Remove old separate restriction check (now handled in validation above)

        $user = Auth::user();

        $signedMouPath = $request->file('signed_mou')->store('documents/mous', 'public');

        Company::create([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'pic_name' => $request->pic_name,
            'address' => $request->address,
            'phone' => $request->phone,
            'business_category' => $request->business_category,
            'subscription_plan' => $request->subscription_plan,
            'subscription_status' => 'pending', 
            'signed_mou_path' => $signedMouPath,
            'pickup_schedule' => $request->pickup_schedule,
            'payment_evidence_path' => null,
        ]);

        return redirect()->route('company.dashboard')->with('success', 'Registration submitted back for approval.');
    }

    public function schedule()
    {
        $user = Auth::user();
        if (!$user->company) {
            return redirect()->route('company.register');
        }


        $allowedPlans = ['Rumah Tangga (> 10km)', 'Reguler', 'Prime', 'Premium+'];
        if (!in_array($user->company->subscription_plan, $allowedPlans)) {
            return redirect()->route('company.mitra')->with('error', 'Fitur ini hanya tersedia untuk paket Rumah Tangga (> 10km), Reguler, Prime, dan Premium+.');
        }

        // Only active companies can manage normal schedules
        if ($user->company->subscription_status !== 'active') {
            return redirect()->route('company.dashboard')->with('error', 'Status langganan Anda belum aktif.');
        }

        // Fetch their current schedule and the pickups generated for them
        $company = $user->company;
        $pickups = $company->pickups()
            ->whereDate('pickup_date', '>=', \Carbon\Carbon::today()->toDateString())
            ->orderBy('pickup_date', 'asc')
            ->paginate(10);

        return Inertia::render('Company/Schedule', [
            'company' => $company,
            'pickups' => $pickups
        ]);
    }

    public function updateSchedule(Request $request)
    {
        $request->validate([
            'pickup_schedule' => [
                'required',
                'array',
                'min:1',
                function ($attribute, $value, $fail) use ($request) {
                    $company = Auth::user()->company;
                    $plan = $company ? $company->subscription_plan : null;
                    $maxDays = in_array($plan, ['Prime', 'Premium+']) ? 6 : 4;
                    if (count($value) > $maxDays) {
                        $fail("Paket {$plan} maksimal hanya dapat memilih {$maxDays} hari penjemputan.");
                    }
                }
            ],
            'pickup_schedule.*' => 'string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu',
        ]);

        $company = Auth::user()->company;

        
        // 1. Update the schedule
        $company->update([
            'pickup_schedule' => $request->pickup_schedule
        ]);

        // 2. Clear out future UNCOMPLETED pickups (scheduled)
        $company->pickups()
            ->whereDate('pickup_date', '>=', \Carbon\Carbon::today()->toDateString())
            ->where('status', 'scheduled')
            ->delete();

        // 3. Regenerate future scheduled pickups based on new schedule
        \Illuminate\Support\Facades\Artisan::call('pickups:generate', [
            '--company' => $company->id
        ]);

        return back()->with('success', 'Jadwal berhasil diperbarui dan jadwal pengambilan mendatang telah disesuaikan.');
    }

    public function unsubscribeRequest()
    {
        $user = Auth::user();
        
        if ($user->company && $user->company->subscription_status === 'active') {
            $user->company->update(['subscription_status' => 'cancellation_requested']);
            return back()->with('success', 'Permintaan pembatalan layanan telah dikirim ke Admin.');
        }

        return back()->with('error', 'Tidak dapat memproses permintaan.');
    }

    public function mitra()
    {
        $user = Auth::user();
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        $company = $user->company;
 
        return Inertia::render('Company/Mitra', [
            'company' => $company,
        ]);
    }

    public function upgradeService(Request $request)
    {
        $request->validate([
            'subscription_plan' => 'required|string|in:Rumah Tangga (> 10km),Reguler,Prime,Premium+'
        ]);

        $customMessages = 'Permintaan peningkatan layanan ke ' . $request->subscription_plan . ' berhasil diajukan.';
        
        $company = Auth::user()->company;
        if ($company) {
            // Alternatively, in a real app this might go to 'pending approval'. But here we just update it.
            $company->update([
                'subscription_plan' => $request->subscription_plan
            ]);
            return back()->with('success', $customMessages);
        }

        return back()->with('error', 'Gagal memproses peningkatan layanan.');
    }

    public function billing()
    {
        $user = Auth::user();
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        $company = $user->company;
 
        return Inertia::render('Company/Billing', [
            'company' => $company,
        ]);
    }

    public function uploadPayment(Request $request)
    {
        if ($request->hasFile('payment_evidence')) {
            $file = $request->file('payment_evidence');
            if (!$file->isValid()) {
                return back()->withErrors([
                    'payment_evidence' => 'Gagal mengunggah file. Pastikan ukuran file tidak melebihi 2MB.'
                ]);
            }
        }

        $request->validate([
            'payment_evidence' => 'required|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ], [
            'payment_evidence.required' => 'Bukti pembayaran wajib diunggah.',
            'payment_evidence.file' => 'Bukti pembayaran harus berupa file.',
            'payment_evidence.mimes' => 'Format file harus jpeg, png, jpg, atau pdf.',
            'payment_evidence.max' => 'Ukuran file maksimal adalah 2MB.',
        ]);

        $company = Auth::user()->company;
        if ($company) {
            $paymentEvidencePath = $request->file('payment_evidence')->store('documents/payments', 'public');
            
            $company->update([
                'payment_evidence_path' => $paymentEvidencePath,
                'subscription_status' => 'payment_uploaded',
            ]);

            return back()->with('success', 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi dan aktivasi oleh admin.');
        }

        return back()->with('error', 'Gagal memproses pembayaran.');
    }

    public function activities()
    {
        $user = Auth::user();
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        $company = $user->company;


        $allowedPlans = ['Rumah Tangga (> 10km)', 'Reguler', 'Prime', 'Premium+'];
        if (!in_array($company->subscription_plan, $allowedPlans)) {
            return redirect()->route('company.mitra')->with('error', 'Fitur ini hanya tersedia untuk paket Rumah Tangga (> 10km), Reguler, Prime, dan Premium+.');
        }

        $activities = $company->activities()
            ->orderBy('activity_date', 'desc')
            ->paginate(5);

        return Inertia::render('Company/Activities', [
            'company' => $company,
            'activities' => $activities,
            'plan' => $company->subscription_plan
        ]);
    }
}
