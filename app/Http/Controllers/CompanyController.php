<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Company;

class CompanyController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();

        // Redirect to registration if the user doesn't have a company profile
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        // If the company registration is pending, show the pending page
        if ($user->company->subscription_status === 'pending') {
            return Inertia::render('Company/Pending');
        }

        $company = $user->company;

        $totalOrganic = $company->pickups()->where('status', 'picked')->sum('organic_weight') ?? 0;
        $totalAnorganic = $company->pickups()->where('status', 'picked')->sum('anorganic_weight') ?? 0;
        $totalResidue = $company->pickups()->where('status', 'picked')->sum('residue_weight') ?? 0;

        return Inertia::render('Company/Dashboard', [
            'company' => $company,
            'statistics' => [
                'total_organic' => $totalOrganic,
                'total_anorganic' => $totalAnorganic,
                'total_residue' => $totalResidue,
            ]
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

    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'subscription_plan' => 'required|string|in:Basic,Premium,Enterprise',
            'payment_evidence' => 'required|file|mimes:jpeg,png,jpg,pdf|max:5120',
            'signed_mou' => 'required|file|mimes:pdf|max:10240',
            'pickup_schedule' => 'required|array|min:1',
            'pickup_schedule.*' => 'string',
        ]);

        $user = Auth::user();

        $paymentEvidencePath = $request->file('payment_evidence')->store('documents/payments', 'public');
        $signedMouPath = $request->file('signed_mou')->store('documents/mous', 'public');

        Company::create([
            'user_id' => $user->id,
            'company_name' => $request->company_name,
            'address' => $request->address,
            'phone' => $request->phone,
            'subscription_plan' => $request->subscription_plan,
            'subscription_status' => 'pending', 
            'payment_evidence_path' => $paymentEvidencePath,
            'signed_mou_path' => $signedMouPath,
            'pickup_schedule' => $request->pickup_schedule,
        ]);

        return redirect()->route('company.dashboard')->with('success', 'Registration submitted back for approval.');
    }

    public function schedule()
    {
        $user = Auth::user();
        if (!$user->company) {
            return redirect()->route('company.register');
        }

        // Only active companies can manage normal schedules
        if ($user->company->subscription_status !== 'active') {
            return redirect()->route('company.dashboard')->with('error', 'Status langganan Anda belum aktif.');
        }

        // Fetch their current schedule and the pickups generated for them
        $company = $user->company;
        $pickups = $company->pickups()
            ->orderBy('pickup_date', 'asc')
            ->get();

        return Inertia::render('Company/Schedule', [
            'company' => $company,
            'pickups' => $pickups
        ]);
    }

    public function updateSchedule(Request $request)
    {
        $request->validate([
            'pickup_schedule' => 'required|array|min:1',
            'pickup_schedule.*' => 'string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
        ]);

        $company = Auth::user()->company;
        
        // 1. Update the schedule
        $company->update([
            'pickup_schedule' => $request->pickup_schedule
        ]);

        // 2. Clear out future UNCOMPLETED pickups (scheduled or on_the_way)
        $company->pickups()
            ->whereDate('pickup_date', '>', \Carbon\Carbon::today()->toDateString())
            ->whereIn('status', ['scheduled', 'on_the_way'])
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
}
