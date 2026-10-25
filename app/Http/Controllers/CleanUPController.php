<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\Pickup;
use App\Models\CompanyActivity;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class CleanUPController extends Controller
{
    /**
     * Display the CleanUP dashboard with companies scheduled for a specific day.
     */
    public function dashboard(Request $request)
    {
        $daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        
        $todayEnglish = Carbon::now()->englishDayOfWeek;
        $englishToIndo = [
            'Monday' => 'Senin', 'Tuesday' => 'Selasa', 'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis', 'Friday' => 'Jumat', 'Saturday' => 'Sabtu', 'Sunday' => 'Minggu'
        ];
        $todayIndo = $englishToIndo[$todayEnglish];
        
        $selectedDay = $request->query('day', $todayIndo);
        if (!in_array($selectedDay, $daysOfWeek)) {
            $selectedDay = $todayIndo;
        }

        // Calculate the actual calendar date for the selected Day.
        // E.g., if today is Monday and they select Wednesday, we find the date for *this week's* Wednesday.
        // We use $todayIndo as a baseline to prevent timezone weirdness.
        
        // Find the index of today and selected day
        $todayIdx = array_search($todayIndo, $daysOfWeek);
        $selectedIdx = array_search($selectedDay, $daysOfWeek);
        
        $diff = $selectedIdx - $todayIdx;
        $targetDate = Carbon::today()->addDays($diff)->toDateString();
        
        // Is the selected day strictly today?
        $isToday = ($diff === 0);

        // Fetch pre-generated pickups for that specific date
        $pickups = Pickup::with(['company', 'cleanup'])
            ->whereDate('pickup_date', $targetDate)
            ->get();

        return Inertia::render('CleanUP/Dashboard', [
            'daysOfWeek' => $daysOfWeek,
            'selectedDay' => $selectedDay,
            'targetDate' => $targetDate,
            'isToday' => $isToday,
            'pickups' => $pickups
        ]);
    }

    /**
     * Update the pickup status for a specific generated pickup.
     */
    public function updateStatus(Request $request, Pickup $pickup)
    {
        // STRICT RULE: CleanUP can only update if pickup_date == today
        if (!Carbon::parse($pickup->pickup_date)->isToday()) {
            return back()->with('error', 'Akses ditolak. Anda hanya dapat memperbarui status untuk jadwal HARI INI.');
        }

        $request->validate([
            'status' => 'required|in:on_the_way,completed,failed',
            'cancellation_reason' => 'required_if:status,failed|string|max:1000'
        ]);

        $cleanup = Auth::user();

        $pickup->update([
            'cleanup_id' => $cleanup->id,
            'status' => $request->status,
            'cancellation_reason' => $request->status === 'failed' ? $request->cancellation_reason : null,
        ]);

        return back()->with('success', 'Status updated successfully.');
    }

   
    /**
     * Display the manual offline sync management page for CleanUP operator.
     */
    public function sync(Request $request)
    {
        return Inertia::render('CleanUP/Sync', [
            'auth' => [
                'user' => [
                    'id' => Auth::id(),
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ],
            ],
        ]);
    }

    /**
     * Check authentication and get fresh CSRF token for offline sync.
     */
    public function syncStatus(Request $request)
    {
        return response()->json([
            'authenticated' => true,
            'csrf' => csrf_token(),
            'user' => [
                'id' => Auth::id(),
                'name' => Auth::user()->name,
            ],
            'server_time' => Carbon::now()->toIso8601String(),
        ]);
    }

    /**
     * Store pickup completion details, including offline sync support with grace period.
     */
    public function submitPickup(Request $request, Pickup $pickup)
    {
        $pickupDate = Carbon::parse($pickup->pickup_date)->startOfDay();
        $today = Carbon::today();
        
        // Handle offline submission grace period (up to 48 hours if recorded on scheduled date)
        $isGraceAllowed = false;
        if ($request->filled('offline_recorded_at')) {
            try {
                $recordedAt = Carbon::parse($request->offline_recorded_at)->setTimezone(config('app.timezone', 'Asia/Jakarta'));
                $hourDiff = abs($recordedAt->diffInHours(Carbon::now()));
                // Allow if recorded within 48h and on or near the scheduled pickup date
                if (($recordedAt->isSameDay($pickupDate) || $recordedAt->diffInDays($pickupDate) <= 1) && $hourDiff <= 48) {
                    $isGraceAllowed = true;
                }
            } catch (\Exception $e) {
                // fallback to standard check
            }
        }

        // STRICT RULE with Grace Period
        if (!$pickupDate->isToday() && !$isGraceAllowed) {
            $errorMessage = 'Akses ditolak. Anda hanya dapat mensubmit untuk jadwal HARI INI atau antrean offline dalam batas toleransi.';
            if ($request->expectsJson() || $request->header('X-Background-Sync') === 'true') {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                ], 422);
            }
            return back()->with('error', $errorMessage);
        }

        $request->validate([
            'trash_bag_count' => 'nullable|integer|min:0',
            'organic_weight' => 'nullable|numeric|min:0',
            'anorganic_weight' => 'nullable|numeric|min:0',
            'residue_weight' => 'nullable|numeric|min:0',
            'evidence_pickup_path' => 'required|image|max:5120',
            'offline_recorded_at' => 'nullable|string',
        ]);

        $trashBagCount = $request->filled('trash_bag_count') ? (int) $request->trash_bag_count : null;
        $hasTrashBag = $trashBagCount !== null && $trashBagCount > 0;

        $hasWeightInput = $request->filled('organic_weight') || $request->filled('anorganic_weight') || $request->filled('residue_weight');
        $organicWeight = $request->filled('organic_weight') ? (float) $request->organic_weight : 0.0;
        $anorganicWeight = $request->filled('anorganic_weight') ? (float) $request->anorganic_weight : 0.0;
        $residueWeight = $request->filled('residue_weight') ? (float) $request->residue_weight : 0.0;

        if (!$hasTrashBag && !$hasWeightInput) {
            $errorMessage = 'Harap masukkan jumlah trashbag atau berat tonase sampah.';
            if ($request->expectsJson() || $request->header('X-Background-Sync') === 'true') {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage,
                ], 422);
            }
            return back()->with('error', $errorMessage);
        }

        $cleanup = Auth::user();

        $evidencePickupPath = $request->file('evidence_pickup_path')->store('pickups/evidence', 'public');

        $pickup->update([
            'cleanup_id' => $cleanup->id,
            'status' => 'completed',
            'organic_weight' => $organicWeight,
            'anorganic_weight' => $anorganicWeight,
            'residue_weight' => $residueWeight,
            'trash_bag_count' => $trashBagCount,
            'evidence_pickup_path' => $evidencePickupPath,
        ]);

        if ($request->expectsJson() || $request->header('X-Background-Sync') === 'true') {
            return response()->json([
                'success' => true,
                'message' => 'Berhasil merekam pengambilan sampah!',
                'pickup_id' => $pickup->id,
            ]);
        }

        return back()->with('success', 'Berhasil merekam pengambilan sampah!');
    }

    /**
     * Display the CleanUP history of completed and failed pickups.
     */
    public function history(Request $request)
    {
        $cleanup = Auth::user();

        $pickups = Pickup::with('company')
            ->where('cleanup_id', $cleanup->id)
            ->whereIn('status', ['completed', 'failed'])
            ->orderBy('pickup_date', 'desc')
            ->get();

        return Inertia::render('CleanUP/History', [
            'pickups' => $pickups
        ]);
    }

    /**
     * Display the CleanUP activities page to document what happens to the waste.
     */
    public function activities(Request $request)
    {
        // Get all active companies so the CleanUP can select whose trash they are processing
        $companies = Company::where('subscription_status', 'active')->get(['id', 'company_name', 'address']);

        // Get past generic activities (could scope to cleanup, but no cleanup_id on activities table yet so fetch all)
        // Let's fetch latest activities to show what has been submitted recently
        $activities = CompanyActivity::with('company:id,company_name')->orderBy('activity_date', 'desc')->get();

        return Inertia::render('CleanUP/Activities', [
            'companies' => $companies,
            'activities' => $activities
        ]);
    }

    /**
     * Store the documented activity
     */
    public function storeActivity(Request $request)
    {
        $request->validate([
            'company_id' => 'required|exists:companies,id',
            'activity_date' => 'required|date',
            'note' => 'nullable|string',
            'media' => 'nullable|file|mimes:jpeg,png,jpg,mp4,mov,avi|max:20480',
        ]);

        $company = Company::find($request->company_id);

        $mediaPath = null;
        $mediaType = null;

        if ($request->hasFile('media')) {
            $file = $request->file('media');
            $mimeType = $file->getMimeType();
            
            if (str_starts_with($mimeType, 'video/')) {
                $mediaType = 'video';
                $mediaPath = $file->store('documents/activities/videos', 'public');
            } else {
                $mediaType = 'image';
                $mediaPath = $file->store('documents/activities/images', 'public');
            }
        }

        $company->activities()->create([
            'activity_date' => $request->activity_date,
            'note' => $request->note,
            'media_path' => $mediaPath,
            'media_type' => $mediaType,
        ]);

        return back()->with('success', 'Kegiatan pemanfaatan sampah berhasil didokumentasikan.');
    }
}
