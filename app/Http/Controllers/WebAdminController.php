<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\Katalog;
use App\Models\News;
use App\Models\Solution;

class WebAdminController extends Controller
{
    public function dashboard()
    {
        $activitiesCount = Activity::count();
        $katalogCount = Katalog::count();
        $newsCount = News::count();
        $solutionsCount = Solution::count();

        return Inertia::render('WebAdmin/Dashboard', [
            'activitiesCount' => $activitiesCount,
            'katalogCount' => $katalogCount,
            'newsCount' => $newsCount,
            'solutionsCount' => $solutionsCount,
        ]);
    }

    /** Image placed inside a News/Activity body by BlogEditor; cleaned up by HasContentImages. */
    public function uploadContentImage(Request $request)
    {
        $request->validate(['image' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120']);

        return response()->json(['url' => '/storage/' . $request->file('image')->store('content', 'public')]);
    }
}
