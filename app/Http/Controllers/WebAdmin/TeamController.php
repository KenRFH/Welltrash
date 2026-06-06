<?php

namespace App\Http\Controllers\WebAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Team;
use Illuminate\Support\Facades\Storage;

class TeamController extends Controller
{
    public function index()
    {
        $teams = Team::orderBy('order_num', 'asc')->orderBy('created_at', 'desc')->get();
        return Inertia::render('WebAdmin/Teams/Index', [
            'teams' => $teams
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'image' => 'nullable|image|max:5120', // 5MB max
            'order_num' => 'nullable|integer',
        ]);

        $data = $request->only(['name', 'role', 'desc', 'order_num']);
        
        if (empty($data['order_num'])) {
            $data['order_num'] = (Team::max('order_num') ?? 0) + 1;
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('teams', 'public');
        }

        Team::create($data);

        return redirect()->route('webadmin.teams.index')->with('success', 'Anggota Tim Kopasus berhasil ditambahkan.');
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'desc' => 'nullable|string',
            'image' => 'nullable|image|max:5120',
            'order_num' => 'nullable|integer',
        ]);

        $data = $request->only(['name', 'role', 'desc', 'order_num']);

        if ($request->hasFile('image')) {
            // Delete old image if it exists in storage and is not a seeded asset we want to preserve
            if ($team->image_path && Storage::disk('public')->exists($team->image_path)) {
                Storage::disk('public')->delete($team->image_path);
            }
            $data['image_path'] = $request->file('image')->store('teams', 'public');
        }

        $team->update($data);

        return redirect()->route('webadmin.teams.index')->with('success', 'Anggota Tim Kopasus berhasil diperbarui.');
    }

    public function destroy(Team $team)
    {
        if ($team->image_path && Storage::disk('public')->exists($team->image_path)) {
            Storage::disk('public')->delete($team->image_path);
        }
        $team->delete();

        return redirect()->route('webadmin.teams.index')->with('success', 'Anggota Tim Kopasus berhasil dihapus.');
    }
}
