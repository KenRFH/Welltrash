<?php

namespace App\Http\Controllers\WebAdmin;

use App\Http\Controllers\Controller;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class NewsController extends Controller
{
    public function index()
    {
        $news = News::orderBy('created_at', 'desc')->get();
        return Inertia::render('WebAdmin/News/Index', [
            'news' => $news
        ]);
    }

    public function create()
    {
        return Inertia::render('WebAdmin/News/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
        }

        News::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'published_date' => $validated['published_date'],
            'image_path' => $imagePath,
        ]);

        return redirect()->route('webadmin.news.index')->with('success', 'Berita berhasil ditambahkan');
    }

    public function edit(string $id)
    {
        $news = News::findOrFail($id);
        return Inertia::render('WebAdmin/News/Edit', [
            'newsItem' => $news
        ]);
    }

    public function update(Request $request, string $id)
    {
        $news = News::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_date' => 'nullable|date',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($news->image_path) {
                Storage::disk('public')->delete($news->image_path);
            }
            $news->image_path = $request->file('image')->store('news', 'public');
        }

        $news->title = $validated['title'];
        $news->content = $validated['content'];
        $news->published_date = $validated['published_date'];
        $news->save();

        return redirect()->route('webadmin.news.index')->with('success', 'Berita berhasil diperbarui');
    }

    public function destroy(string $id)
    {
        $news = News::findOrFail($id);
        
        if ($news->image_path) {
            Storage::disk('public')->delete($news->image_path);
        }
        
        $news->delete();

        return redirect()->route('webadmin.news.index')->with('success', 'Berita berhasil dihapus');
    }
}
