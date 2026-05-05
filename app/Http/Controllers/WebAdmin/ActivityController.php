<?php

namespace App\Http\Controllers\WebAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Activity;
use Illuminate\Support\Facades\Storage;

class ActivityController extends Controller
{
    public function index()
    {
        $activities = Activity::orderBy('created_at', 'desc')->get();
        return Inertia::render('WebAdmin/Activity/Index', [
            'activities' => $activities
        ]);
    }

    public function create()
    {
        return Inertia::render('WebAdmin/Activity/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        $data = $request->only(['title', 'description', 'date']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('activities', 'public');
        }

        Activity::create($data);

        return redirect()->route('webadmin.activities.index')->with('success', 'Aktivitas berhasil ditambahkan.');
    }

    public function edit(Activity $activity)
    {
        return Inertia::render('WebAdmin/Activity/Edit', [
            'activity' => $activity
        ]);
    }

    public function update(Request $request, Activity $activity)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'date' => 'nullable|date',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = $request->only(['title', 'description', 'date']);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($activity->image_path) {
                Storage::disk('public')->delete($activity->image_path);
            }
            $data['image_path'] = $request->file('image')->store('activities', 'public');
        }

        $activity->update($data);

        return redirect()->route('webadmin.activities.index')->with('success', 'Aktivitas berhasil diperbarui.');
    }

    public function destroy(Activity $activity)
    {
        if ($activity->image_path) {
            Storage::disk('public')->delete($activity->image_path);
        }
        $activity->delete();

        return redirect()->route('webadmin.activities.index')->with('success', 'Aktivitas berhasil dihapus.');
    }
}
