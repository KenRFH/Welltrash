<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class AdminAccountController extends Controller
{
    /**
     * Display a listing of the accounts grouped by role.
     */
    public function index()
    {
        $cleanups = User::where('role', 'CleanUP')->orderBy('created_at', 'desc')->get();
        $webAdmins = User::where('role', 'web_admin')->orderBy('created_at', 'desc')->get();
        $companies = User::where('role', 'company')
            ->with('company')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Accounts/Index', [
            'cleanups' => $cleanups,
            'webAdmins' => $webAdmins,
            'companies' => $companies,
        ]);
    }

    /**
     * Store a newly created account in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:CleanUP,web_admin,company',
        ];

        // If company/mitra role is selected, validate company profile details and signed MOU file
        if ($request->role === 'company') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'pic_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'phone' => 'required|string|max:20',
                'business_category' => 'nullable|string|max:255',
                'subscription_plan' => 'required|string|in:Rumah Tangga (> 10km),Reguler,Prime,Premium+',
                'signed_mou' => 'required|file|mimes:pdf,jpeg,png,jpg|max:10240', // MOU is mandatory on creation
                'pickup_schedule' => 'nullable|array',
                'pickup_schedule.*' => 'string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            ]);
        }

        $validated = $request->validate($rules);

        // Generate email if empty
        $email = $validated['email'] ?? null;
        if (empty($email)) {
            $email = strtolower(str_replace(' ', '', $validated['name'])) . '@welltrash.com';
            $baseEmail = $email;
            $counter = 1;
            while (User::where('email', $email)->exists()) {
                $email = str_replace('@welltrash.com', '', $baseEmail) . $counter . '@welltrash.com';
                $counter++;
            }
        }

        // 1. Create User account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $email,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        // 2. If it's a company, create the related Company profile
        if ($user->role === 'company') {
            $signedMouPath = null;
            if ($request->hasFile('signed_mou')) {
                $signedMouPath = $request->file('signed_mou')->store('documents/mous', 'public');
            }

            $lat = $request->filled('latitude') ? (float) $request->latitude : null;
            $lng = $request->filled('longitude') ? (float) $request->longitude : null;

            // ponytail: fallback geocoding via OpenStreetMap Nominatim; upgrade to Google Geocoding API if rate limits exceeded.
            if (is_null($lat) || is_null($lng)) {
                $query = $validated['address'];
                if (!str_contains(strtolower($query), 'jember')) {
                    $query .= ', Jember';
                }
                try {
                    $geoRes = Http::withHeaders(['User-Agent' => 'WelltrashApp/1.0'])
                        ->timeout(3)
                        ->get('https://nominatim.openstreetmap.org/search', [
                            'format' => 'json',
                            'q'      => $query,
                            'limit'  => 1,
                        ]);
                    if ($geoRes->successful() && !empty($geoRes->json())) {
                        $first = $geoRes->json()[0];
                        $lat = (float) $first['lat'];
                        $lng = (float) $first['lon'];
                    }
                } catch (\Throwable) {
                }
            }

            $company = Company::create([
                'user_id' => $user->id,
                'company_name' => $validated['company_name'],
                'pic_name' => $validated['pic_name'],
                'address' => $validated['address'],
                'latitude' => $lat,
                'longitude' => $lng,
                'phone' => $validated['phone'],
                'business_category' => $validated['business_category'] ?? null,
                'subscription_plan' => $validated['subscription_plan'],
                'subscription_status' => 'active', // Set to active immediately for direct partner creations
                'subscription_end_date' => null,
                'signed_mou_path' => $signedMouPath,
                'pickup_schedule' => $validated['pickup_schedule'] ?? [],
            ]);

            // 3. Generate initial scheduled pickups
            try {
                Artisan::call('pickups:generate', [
                    '--company' => $company->id
                ]);
            } catch (\Exception $e) {
                // Log or handle silently to prevent blocking response
            }
        }

        return back()->with('success', 'Akun berhasil dibuat.');
    }

    /**
     * Update the specified account in storage.
     */
    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'nullable|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
        ];

        // If user is company, validate company details
        if ($user->role === 'company') {
            $rules = array_merge($rules, [
                'company_name' => 'required|string|max:255',
                'pic_name' => 'required|string|max:255',
                'address' => 'required|string|max:255',
                'latitude' => 'nullable|numeric|between:-90,90',
                'longitude' => 'nullable|numeric|between:-180,180',
                'phone' => 'required|string|max:20',
                'business_category' => 'nullable|string|max:255',
                'subscription_plan' => 'required|string|in:Rumah Tangga (> 10km),Reguler,Prime,Premium+',
                'signed_mou' => 'nullable|file|mimes:pdf,jpeg,png,jpg|max:10240', // MOU is optional on edit
                'pickup_schedule' => 'nullable|array',
                'pickup_schedule.*' => 'string|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            ]);
        }

        $validated = $request->validate($rules);

        // Generate email if empty
        $email = $validated['email'] ?? null;
        if (empty($email)) {
            $email = strtolower(str_replace(' ', '', $validated['name'])) . '@welltrash.com';
            $baseEmail = $email;
            $counter = 1;
            while (User::where('email', $email)->where('id', '!=', $user->id)->exists()) {
                $email = str_replace('@welltrash.com', '', $baseEmail) . $counter . '@welltrash.com';
                $counter++;
            }
        }

        // 1. Update User basic info
        $userFields = [
            'name' => $validated['name'],
            'email' => $email,
        ];

        if (!empty($validated['password'])) {
            $userFields['password'] = Hash::make($validated['password']);
        }

        $user->update($userFields);

        // 2. If company, update Company profile
        if ($user->role === 'company') {
            $company = $user->company;

            $lat = $request->filled('latitude') ? (float) $request->latitude : null;
            $lng = $request->filled('longitude') ? (float) $request->longitude : null;

            // ponytail: fallback geocoding via OpenStreetMap Nominatim; upgrade to Google Geocoding API if rate limits exceeded.
            if ((is_null($lat) || is_null($lng)) && (!$company || $company->address !== $validated['address'])) {
                $query = $validated['address'];
                if (!str_contains(strtolower($query), 'jember')) {
                    $query .= ', Jember';
                }
                try {
                    $geoRes = Http::withHeaders(['User-Agent' => 'WelltrashApp/1.0'])
                        ->timeout(3)
                        ->get('https://nominatim.openstreetmap.org/search', [
                            'format' => 'json',
                            'q'      => $query,
                            'limit'  => 1,
                        ]);
                    if ($geoRes->successful() && !empty($geoRes->json())) {
                        $first = $geoRes->json()[0];
                        $lat = (float) $first['lat'];
                        $lng = (float) $first['lon'];
                    }
                } catch (\Throwable) {
                }
            }

            $companyData = [
                'company_name' => $validated['company_name'],
                'pic_name' => $validated['pic_name'],
                'address' => $validated['address'],
                'latitude' => $lat ?? $company?->latitude,
                'longitude' => $lng ?? $company?->longitude,
                'phone' => $validated['phone'],
                'business_category' => $validated['business_category'] ?? null,
                'subscription_plan' => $validated['subscription_plan'],
            ];

            // Handle signed MOU upload if provided
            if ($request->hasFile('signed_mou')) {
                // Delete old file if exists
                if ($company && $company->signed_mou_path && Storage::disk('public')->exists($company->signed_mou_path)) {
                    Storage::disk('public')->delete($company->signed_mou_path);
                }
                $companyData['signed_mou_path'] = $request->file('signed_mou')->store('documents/mous', 'public');
            }

            // Check if schedule changed
            $scheduleChanged = false;
            $newSchedule = $validated['pickup_schedule'] ?? [];

            if ($company) {
                $oldSchedule = $company->pickup_schedule ?? [];
                
                // Compare arrays
                if (count(array_diff($oldSchedule, $newSchedule)) > 0 || count(array_diff($newSchedule, $oldSchedule)) > 0) {
                    $scheduleChanged = true;
                }
                
                $companyData['pickup_schedule'] = $newSchedule;
                $company->update($companyData);
            } else {
                // Fallback: create company if missing
                $companyData['user_id'] = $user->id;
                $companyData['pickup_schedule'] = $newSchedule;
                $companyData['subscription_status'] = 'active';
                $companyData['subscription_end_date'] = null;
                $company = Company::create($companyData);
                $scheduleChanged = true;
            }

            // 3. Regenerate pickups if schedule changed
            if ($scheduleChanged && $company) {
                try {
                    // Clear future UNCOMPLETED pickups (scheduled)
                    $company->pickups()
                        ->whereDate('pickup_date', '>=', \Carbon\Carbon::today()->toDateString())
                        ->where('status', 'scheduled')
                        ->delete();

                    // Regenerate future scheduled pickups based on new schedule
                    Artisan::call('pickups:generate', [
                        '--company' => $company->id
                    ]);
                } catch (\Exception $e) {
                    // Handle silently to prevent blocking response
                }
            }
        }

        return back()->with('success', 'Akun berhasil diperbarui.');
    }

    /**
     * Remove the specified account from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting current logged in admin
        if (auth()->id() === $user->id) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        // Delete MOU file if it is a company
        if ($user->role === 'company' && $user->company) {
            $mouPath = $user->company->signed_mou_path;
            if ($mouPath && Storage::disk('public')->exists($mouPath)) {
                Storage::disk('public')->delete($mouPath);
            }
        }

        // Delete the user - cascade delete in db automatically removes company profiles and pickups
        $user->delete();

        return back()->with('success', 'Akun berhasil dihapus.');
    }
}
