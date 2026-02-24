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

        return Inertia::render('Company/Dashboard', [
            'company' => $user->company
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
        ]);

        return redirect()->route('company.dashboard')->with('success', 'Registration submitted back for approval.');
    }
}
