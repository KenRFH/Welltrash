<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Company;
use Inertia\Inertia;

class AdminController extends Controller
{
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
        return back()->with('success', 'Company approved successfully.');
    }

    public function rejectCompany(Company $company)
    {
        // For now, we will just delete the record so they can try again
        $company->delete();
        return back()->with('success', 'Company rejected successfully.');
    }
}
