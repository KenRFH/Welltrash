<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use App\Models\Pickup;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class DriverController extends Controller
{
    /**
     * Display the driver dashboard with companies scheduled for a specific day.
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
        $pickups = Pickup::with('company')
            ->whereDate('pickup_date', $targetDate)
            ->get();

        return Inertia::render('Driver/Dashboard', [
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
        // STRICT RULE: Driver can only update if pickup_date == today
        if (!Carbon::parse($pickup->pickup_date)->isToday()) {
            return back()->with('error', 'Akses ditolak. Anda hanya dapat memperbarui status untuk jadwal HARI INI.');
        }

        $request->validate([
            'status' => 'required|in:on_the_way,completed,failed',
            'cancellation_reason' => 'required_if:status,failed|string|max:1000'
        ]);

        $driver = Auth::user();

        $pickup->update([
            'driver_id' => $driver->id,
            'status' => $request->status,
            'cancellation_reason' => $request->status === 'failed' ? $request->cancellation_reason : null,
        ]);

        return back()->with('success', 'Status updated successfully.');
    }

    /**
     * Submit final pickup details including weights and photos for a specific generated pickup.
     */
    public function submitPickup(Request $request, Pickup $pickup)
    {
        // STRICT RULE: Driver can only update if pickup_date == today
        if (!Carbon::parse($pickup->pickup_date)->isToday()) {
            return back()->with('error', 'Akses ditolak. Anda hanya dapat mensubmit untuk jadwal HARI INI.');
        }

        $request->validate([
            'organic_weight' => 'required|numeric|min:0',
            'anorganic_weight' => 'required|numeric|min:0',
            'residue_weight' => 'required|numeric|min:0',
            'organic_image' => 'required|image|max:10240',
            'anorganic_image' => 'required|image|max:10240',
            'residue_image' => 'required|image|max:10240',
        ]);

        $driver = Auth::user();

        $organicPath = $request->file('organic_image')->store('pickups/organic', 'public');
        $anorganicPath = $request->file('anorganic_image')->store('pickups/anorganic', 'public');
        $residuePath = $request->file('residue_image')->store('pickups/residue', 'public');

        $pickup->update([
            'driver_id' => $driver->id,
            'status' => 'completed',
            'organic_weight' => $request->organic_weight,
            'anorganic_weight' => $request->anorganic_weight,
            'residue_weight' => $request->residue_weight,
            'organic_image_path' => $organicPath,
            'anorganic_image_path' => $anorganicPath,
            'residue_image_path' => $residuePath,
        ]);

        return back()->with('success', 'Berhasil merekam pengambilan sampah!');
    }

    /**
     * Display the driver history of completed and failed pickups.
     */
    public function history(Request $request)
    {
        $driver = Auth::user();

        $pickups = Pickup::with('company')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['completed', 'failed'])
            ->orderBy('pickup_date', 'desc')
            ->get();

        return Inertia::render('Driver/History', [
            'pickups' => $pickups
        ]);
    }
}
