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
}
