<?php

namespace App\Http\Controllers\WebAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Katalog;
use Illuminate\Support\Facades\Storage;

class KatalogController extends Controller
{
    public function index()
    {
        $katalogs = Katalog::orderBy('created_at', 'desc')->get();
        return Inertia::render('WebAdmin/Katalog/Index', [
            'katalogs' => $katalogs
        ]);
    }

    public function create()
    {
        return Inertia::render('WebAdmin/Katalog/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|max:5120', // 5MB max
        ]);

        $data = $request->only(['name', 'description', 'price']);

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('katalogs', 'public');
        }

        Katalog::create($data);

        return redirect()->route('webadmin.katalogs.index')->with('success', 'Katalog berhasil ditambahkan.');
    }

    public function edit(Katalog $katalog)
    {
        return Inertia::render('WebAdmin/Katalog/Edit', [
            'katalog' => $katalog
        ]);
    }

    public function update(Request $request, Katalog $katalog)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'image' => 'nullable|image|max:5120',
        ]);

        $data = $request->only(['name', 'description', 'price']);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($katalog->image_path) {
                Storage::disk('public')->delete($katalog->image_path);
            }
            $data['image_path'] = $request->file('image')->store('katalogs', 'public');
        }

        $katalog->update($data);

        return redirect()->route('webadmin.katalogs.index')->with('success', 'Katalog berhasil diperbarui.');
    }

    public function destroy(Katalog $katalog)
    {
        if ($katalog->image_path) {
            Storage::disk('public')->delete($katalog->image_path);
        }
        $katalog->delete();

        return redirect()->route('webadmin.katalogs.index')->with('success', 'Katalog berhasil dihapus.');
    }
}
