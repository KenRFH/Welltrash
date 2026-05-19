<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;
use Spatie\Sitemap\SitemapGenerator;
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/generate-sitemap', function () {

    $sitemap = Sitemap::create()
        ->add(Url::create('/'))
        ->add(Url::create('/tentang-kami'))
        ->add(Url::create('/layanan'))
        ->add(Url::create('/activity'))
        ->add(Url::create('/news'))
        ->add(Url::create('/katalog'));

    // Activity detail
    foreach (\App\Models\Activity::all() as $activity) {
        $sitemap->add(Url::create("/activity/{$activity->id}"));
    }

    // News detail
    foreach (\App\Models\News::all() as $news) {
        $sitemap->add(Url::create("/news/{$news->id}"));
    }

    $sitemap->writeToFile(public_path('sitemap.xml'));

    return 'Sitemap generated!';
});


Route::get('/', function () {
    $activities = \App\Models\Activity::orderBy('date', 'desc')->take(3)->get();
    $news       = \App\Models\News::orderBy('published_date', 'desc')->take(3)->get();
    $katalogs   = \App\Models\Katalog::orderBy('created_at', 'desc')->take(3)->get();
    return Inertia::render('Welcome', [
        'canLogin'   => Route::has('login'),
        'canRegister'=> Route::has('register'),
        'activities' => $activities,
        'news'       => $news,
        'katalogs'   => $katalogs,
    ]);
})->name('beranda');

Route::get('/tentang-kami', function () {
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('about');

Route::get('/layanan', function () {
    return Inertia::render('Services', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('services');

Route::get('/activity', function () {
    $activities = \App\Models\Activity::orderBy('date', 'desc')->get();
    return Inertia::render('Activity', [
        'activities' => $activities,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('activity');

Route::get('/activity/{id}', function ($id) {
    $activity = \App\Models\Activity::findOrFail($id);
    return Inertia::render('ActivityDetail', [
        'activity' => $activity,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('activity.show');

Route::get('/news', function () {
    $news = \App\Models\News::orderBy('published_date', 'desc')->get();
    return Inertia::render('News', [
        'news' => $news,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('news');

Route::get('/news/{id}', function ($id) {
    $newsItem = \App\Models\News::findOrFail($id);
    return Inertia::render('NewsDetail', [
        'newsItem' => $newsItem,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('news.show');

Route::get('/katalog', function () {
    $katalogs = \App\Models\Katalog::orderBy('created_at', 'desc')->get();
    return Inertia::render('Katalog', [
        'katalogs' => $katalogs,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('katalog');

use App\Http\Controllers\AdminController;

/*
|--------------------------------------------------------------------------
| Admin / Owner Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

        Route::get('/companies', [AdminController::class, 'indexCompanies'])->name('companies.index');
        Route::get('/companies/pending', [AdminController::class, 'pendingCompanies'])->name('companies.pending');
        Route::patch('/companies/{company}/approve', [AdminController::class, 'approveCompany'])->name('companies.approve');
        Route::patch('/companies/{company}/activate', [AdminController::class, 'activateCompany'])->name('companies.activate');
        Route::patch('/companies/{company}/toggle-status', [AdminController::class, 'toggleStatus'])->name('companies.toggleStatus');
        Route::post('/companies/{company}/reject', [AdminController::class, 'rejectCompany'])->name('companies.reject');
        
        Route::get('/companies/cancellations/requests', [AdminController::class, 'cancellationRequests'])->name('companies.cancellations');
        Route::delete('/companies/{company}/cancellations/approve', [AdminController::class, 'approveCancellation'])->name('companies.cancellations.approve');

        Route::get('/companies/{company}', [AdminController::class, 'showCompany'])->name('companies.show');

        Route::get('/drivers', [AdminController::class, 'drivers'])->name('drivers');
        Route::get('/drivers/{user}', [AdminController::class, 'driverDetail'])->name('drivers.show');

    });

use App\Http\Controllers\WebAdminController;
use App\Http\Controllers\WebAdmin\ActivityController;
use App\Http\Controllers\WebAdmin\KatalogController;

/*
|--------------------------------------------------------------------------
| WebAdmin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:web_admin'])
    ->prefix('webadmin')
    ->name('webadmin.')
    ->group(function () {
        Route::get('/dashboard', [WebAdminController::class, 'dashboard'])->name('dashboard');
        Route::resource('activities', App\Http\Controllers\WebAdmin\ActivityController::class)->except(['show']);
        Route::resource('katalogs', App\Http\Controllers\WebAdmin\KatalogController::class)->except(['show']);
        Route::resource('news', App\Http\Controllers\WebAdmin\NewsController::class)->except(['show']);
    });

use App\Http\Controllers\CompanyController;

/*
|--------------------------------------------------------------------------
| Company Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:company'])
    ->prefix('company')
    ->name('company.')
    ->group(function () {

        Route::get('/dashboard', [CompanyController::class, 'dashboard'])->name('dashboard');

        Route::get('/history', [CompanyController::class, 'history'])->name('history');

        Route::get('/laporan/pdf', [CompanyController::class, 'laporanPdf'])
            ->name('laporan.pdf');

        Route::get('/register', [CompanyController::class, 'register'])->name('register');

        Route::post('/register', [CompanyController::class, 'store'])->name('store');

        Route::post('/reregister', [CompanyController::class, 'reregister'])->name('reregister');

        Route::post('/payment/store', [CompanyController::class, 'storePayment'])->name('payment.store');

        Route::get('/schedule', [CompanyController::class, 'schedule'])->name('schedule');

        Route::post('/schedule', [CompanyController::class, 'updateSchedule'])->name('schedule.update');

        Route::post('/unsubscribe', [CompanyController::class, 'unsubscribeRequest'])->name('unsubscribe');

        Route::get('/mitra', [CompanyController::class, 'mitra'])->name('mitra');

        Route::post('/mitra/upgrade', [CompanyController::class, 'upgradeService'])->name('mitra.upgrade');

        Route::get('/billing', [CompanyController::class, 'billing'])->name('billing');

        Route::post('/billing/pay', [CompanyController::class, 'uploadPayment'])->name('billing.pay');

        Route::get('/kegiatan', [CompanyController::class, 'activities'])->name('kegiatan');
    });
use App\Http\Controllers\DriverController;

/*
|--------------------------------------------------------------------------
| Driver Routes
|--------------------------------------------------------------------------
*/

Route::prefix('driver')->middleware(['auth', 'role:driver'])->group(function () {
    Route::get('/dashboard', [DriverController::class, 'dashboard'])->name('driver.dashboard');
    Route::put('/update-status/{pickup}', [DriverController::class, 'updateStatus'])->name('driver.updateStatus');
    Route::post('/submit-pickup/{pickup}', [DriverController::class, 'submitPickup'])->name('driver.submitPickup');
    Route::get('/history', [DriverController::class, 'history'])->name('driver.history');
    Route::get('/kegiatan', [DriverController::class, 'activities'])->name('driver.kegiatan');
    Route::post('/kegiatan', [DriverController::class, 'storeActivity'])->name('driver.kegiatan.store');
});

/*
|--------------------------------------------------------------------------
| Profile (All Authenticated Users)
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {

    Route::get('/dashboard', function () {
        $user = Auth::user();
        return match ($user->role) {
            'admin'      => redirect()->route('admin.dashboard'),
            'web_admin'  => redirect()->route('webadmin.dashboard'),
            'driver'     => redirect()->route('driver.dashboard'),
            default      => redirect()->route('company.dashboard'),
        };
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');


    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Fallback Route (404)
|--------------------------------------------------------------------------
*/

Route::fallback(function () {
    return Inertia::render('NotFound');
});

/*
|--------------------------------------------------------------------------
| Auth Routes (Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
