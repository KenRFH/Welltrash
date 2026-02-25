<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function indexCompanies()
    {
        $companies = Company::with('user')->get();
        return Inertia::render('Admin/Companies/Index', [
            'companies' => $companies
        ]);
    }

    public function showCompany(Company $company)
    {
        $company->load('user');
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
        $company->update(['subscription_status' => 'active']);
        
        // As soon as the company is active, generate their initial pickups!
        \Illuminate\Support\Facades\Artisan::call('pickups:generate', [
            '--company' => $company->id
        ]);

        return back()->with('success', 'Perusahaan berhasil disetujui dan jadwal awal telah dibuat.');
    }

    public function rejectCompany(Company $company)
    {
        // For now, we will just delete the record so they can try again
        $company->delete();
        return back()->with('success', 'Company rejected successfully.');
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
        // Delete the company record entirely per the user's implicit approval of the default "delete" idea,
        // so they can register again from scratch.
        $company->delete();
        return back()->with('success', 'Company subscription cancelled and data removed.');
    }
}
