<?php

namespace App\Http\Controllers\WebAdmin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Solution;
use App\Models\SiteSetting;
use Illuminate\Support\Facades\Storage;

class SolutionController extends Controller
{
    public function index()
    {
        $solutions = Solution::orderBy('order_num', 'asc')->orderBy('created_at', 'asc')->get();
        $settings = [
            'badge' => SiteSetting::get('solution_badge', 'SOLUSI B2B TERPADU'),
            'title' => SiteSetting::get('solution_title', 'Dirancang untuk skala operasional bisnis Anda.'),
            'subtitle' => SiteSetting::get('solution_subtitle', 'Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.'),
        ];

        return Inertia::render('WebAdmin/Solutions/Index', [
            'solutions' => $solutions,
            'settings' => $settings,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'badge' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'subtitle' => 'required|string|max:1000',
        ]);

        SiteSetting::set('solution_badge', $validated['badge']);
        SiteSetting::set('solution_title', $validated['title']);
        SiteSetting::set('solution_subtitle', $validated['subtitle']);

        return redirect()->route('webadmin.solutions.index')->with('success', 'Pengaturan teks bagian solusi berhasil diperbarui.');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'segment' => 'required|string|max:100',
            'tag' => 'required|string|max:100',
            'desc' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'accent_color' => 'required|in:green,orange',
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'order_num' => 'nullable|integer',
        ]);

        $data = $request->only(['title', 'segment', 'tag', 'desc', 'icon', 'accent_color', 'link_url', 'order_num']);
        $data['icon'] = $data['icon'] ?: 'Building2';
        $data['link_url'] = $data['link_url'] ?: '/layanan';

        if (empty($data['order_num'])) {
            $data['order_num'] = (Solution::max('order_num') ?? 0) + 1;
        }

        if ($request->hasFile('image')) {
            $data['image_path'] = $request->file('image')->store('solutions', 'public');
        }

        Solution::create($data);

        return redirect()->route('webadmin.solutions.index')->with('success', 'Kartu solusi B2B berhasil ditambahkan.');
    }

    public function update(Request $request, Solution $solution)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'segment' => 'required|string|max:100',
            'tag' => 'required|string|max:100',
            'desc' => 'required|string',
            'icon' => 'nullable|string|max:50',
            'accent_color' => 'required|in:green,orange',
            'image' => 'nullable|image|max:5120',
            'link_url' => 'nullable|string|max:255',
            'order_num' => 'nullable|integer',
        ]);

        $data = $request->only(['title', 'segment', 'tag', 'desc', 'icon', 'accent_color', 'link_url', 'order_num']);
        $data['icon'] = $data['icon'] ?: 'Building2';
        $data['link_url'] = $data['link_url'] ?: '/layanan';

        if ($request->hasFile('image')) {
            if ($solution->image_path && Storage::disk('public')->exists($solution->image_path)) {
                if (!in_array($solution->image_path, [
                    'solutions/hero_waste_transport.webp',
                    'solutions/hero_waste_sorting.webp',
                    'solutions/karyawanWelltrash.webp'
                ])) {
                    Storage::disk('public')->delete($solution->image_path);
                }
            }
            $data['image_path'] = $request->file('image')->store('solutions', 'public');
        }

        $solution->update($data);

        return redirect()->route('webadmin.solutions.index')->with('success', 'Kartu solusi B2B berhasil diperbarui.');
    }

    public function destroy(Solution $solution)
    {
        if ($solution->image_path && Storage::disk('public')->exists($solution->image_path)) {
            if (!in_array($solution->image_path, [
                'solutions/hero_waste_transport.webp',
                'solutions/hero_waste_sorting.webp',
                'solutions/karyawanWelltrash.webp'
            ])) {
                Storage::disk('public')->delete($solution->image_path);
            }
        }
        $solution->delete();

        return redirect()->route('webadmin.solutions.index')->with('success', 'Kartu solusi B2B berhasil dihapus.');
    }
}
