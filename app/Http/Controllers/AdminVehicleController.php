<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminVehicleController extends Controller
{
    /**
     * Display a listing of operational vehicles.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Vehicle::with(['drivers' => function ($q) {
            $q->select('id', 'name', 'email', 'vehicle_id');
        }]);

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('license_plate', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        if ($status && in_array($status, ['active', 'maintenance', 'inactive'])) {
            $query->where('status', $status);
        }

        $vehicles = $query->orderBy('status', 'asc')
            ->orderBy('name', 'asc')
            ->get();

        $stats = [
            'total'       => Vehicle::count(),
            'active'      => Vehicle::where('status', 'active')->count(),
            'maintenance' => Vehicle::where('status', 'maintenance')->count(),
            'inactive'    => Vehicle::where('status', 'inactive')->count(),
        ];

        return Inertia::render('Admin/Vehicles/Index', [
            'vehicles' => $vehicles,
            'stats'    => $stats,
            'filters'  => [
                'search' => $search ?? '',
                'status' => $status ?? 'all',
            ],
        ]);
    }

    /**
     * Store a newly created operational vehicle.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:100',
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate',
            'type'          => 'required|string|max:50',
            'capacity'      => 'nullable|string|max:50',
            'status'        => 'required|in:active,maintenance,inactive',
            'notes'         => 'nullable|string|max:500',
        ]);

        $validated['license_plate'] = strtoupper(trim($validated['license_plate']));

        Vehicle::create($validated);

        return back()->with('success', 'Kendaraan operasional berhasil ditambahkan ke inventaris.');
    }

    /**
     * Update the specified operational vehicle.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $validated = $request->validate([
            'name'          => 'required|string|max:100',
            'license_plate' => 'required|string|max:20|unique:vehicles,license_plate,' . $vehicle->id,
            'type'          => 'required|string|max:50',
            'capacity'      => 'nullable|string|max:50',
            'status'        => 'required|in:active,maintenance,inactive',
            'notes'         => 'nullable|string|max:500',
        ]);

        $validated['license_plate'] = strtoupper(trim($validated['license_plate']));

        $vehicle->update($validated);

        // If deactivated or in maintenance, unassign active drivers
        if ($vehicle->status !== 'active') {
            User::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null]);
        }

        return back()->with('success', 'Data armada operasional berhasil diperbarui.');
    }

    /**
     * Toggle vehicle status quickly.
     */
    public function toggleStatus(Request $request, Vehicle $vehicle)
    {
        $request->validate([
            'status' => 'required|in:active,maintenance,inactive',
        ]);

        $vehicle->update(['status' => $request->status]);

        if ($vehicle->status !== 'active') {
            User::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null]);
        }

        return back()->with('success', 'Status kendaraan berhasil diperbarui.');
    }

    /**
     * Remove the specified operational vehicle from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        // Unassign drivers before deleting
        User::where('vehicle_id', $vehicle->id)->update(['vehicle_id' => null]);

        $vehicle->delete();

        return back()->with('success', 'Kendaraan operasional berhasil dihapus dari sistem.');
    }
}
