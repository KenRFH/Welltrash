<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Activity;
use App\Models\Katalog;
use App\Models\News;

class WebAdminController extends Controller
{
    public function dashboard()
    {
        $activitiesCount = \App\Models\Activity::count();
        $katalogCount = \App\Models\Katalog::count();
        $newsCount = \App\Models\News::count();

        return Inertia::render('WebAdmin/Dashboard', [
            'activitiesCount' => $activitiesCount,
            'katalogCount' => $katalogCount,
            'newsCount' => $newsCount,
        ]);
    }
}
