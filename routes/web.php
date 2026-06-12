<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
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
    $teams = \App\Models\Team::orderBy('order_num', 'asc')->orderBy('created_at', 'desc')->get();
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'teams' => $teams,
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
use App\Http\Controllers\AdminAccountController;
use App\Http\Controllers\InvoiceController;

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

        // Kelola Akun
        Route::get('/accounts', [AdminAccountController::class, 'index'])->name('accounts.index');
        Route::post('/accounts', [AdminAccountController::class, 'store'])->name('accounts.store');
        Route::post('/accounts/{user}', [AdminAccountController::class, 'update'])->name('accounts.update');
        Route::delete('/accounts/{user}', [AdminAccountController::class, 'destroy'])->name('accounts.destroy');

        Route::get('/companies', [AdminController::class, 'indexCompanies'])->name('companies.index');
        Route::get('/companies/pending', [AdminController::class, 'pendingCompanies'])->name('companies.pending');
        Route::patch('/companies/{company}/approve', [AdminController::class, 'approveCompany'])->name('companies.approve');
        Route::patch('/companies/{company}/activate', [AdminController::class, 'activateCompany'])->name('companies.activate');
        Route::patch('/companies/{company}/toggle-status', [AdminController::class, 'toggleStatus'])->name('companies.toggleStatus');
        Route::post('/companies/{company}/reject', [AdminController::class, 'rejectCompany'])->name('companies.reject');
        
        Route::get('/companies/cancellations/requests', [AdminController::class, 'cancellationRequests'])->name('companies.cancellations');
        Route::delete('/companies/{company}/cancellations/approve', [AdminController::class, 'approveCancellation'])->name('companies.cancellations.approve');

        Route::get('/companies/{company}', [AdminController::class, 'showCompany'])->name('companies.show');

        Route::get('/cleanups', [AdminController::class, 'cleanups'])->name('cleanups');
        Route::get('/cleanups/{user}', [AdminController::class, 'cleanupDetail'])->name('cleanups.show');

        // Absensi
        Route::get('/attendance', [AdminAttendanceController::class, 'index'])->name('attendance.index');
        Route::patch('/attendance/salary/{user}', [AdminAttendanceController::class, 'updateSalary'])->name('attendance.updateSalary');
        Route::patch('/attendance/leave/{leaveRequest}/review', [AdminAttendanceController::class, 'reviewLeave'])->name('attendance.leave.review');
        Route::patch('/attendance/overtime/{overtimeRequest}/review', [AdminAttendanceController::class, 'reviewOvertime'])->name('attendance.overtime.review');

        // Invoice
        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::get('/invoices/{invoice}/show', [InvoiceController::class, 'show'])->name('invoices.show');
        Route::patch('/invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid'])->name('invoices.markPaid');
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
        Route::get('/invoices/{invoice}/whatsapp', [InvoiceController::class, 'sendWhatsApp'])->name('invoices.whatsapp');

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
        Route::resource('teams', App\Http\Controllers\WebAdmin\TeamController::class)->except(['show', 'create', 'edit']);
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

        // Invoice (Mitra)
        Route::get('/invoices', [InvoiceController::class, 'companyInvoices'])->name('invoices.index');
        Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'downloadInvoice'])->name('invoices.download');
    });
use App\Http\Controllers\CleanUPController;

/*
|--------------------------------------------------------------------------
| CleanUP Routes
|--------------------------------------------------------------------------
*/

Route::prefix('cleanup')->middleware(['auth', 'role:CleanUP'])->group(function () {
    Route::get('/dashboard', [CleanUPController::class, 'dashboard'])->name('cleanup.dashboard');
    Route::put('/update-status/{pickup}', [CleanUPController::class, 'updateStatus'])->name('cleanup.updateStatus');
    Route::post('/submit-pickup/{pickup}', [CleanUPController::class, 'submitPickup'])->name('cleanup.submitPickup');
    Route::get('/history', [CleanUPController::class, 'history'])->name('cleanup.history');
    Route::get('/kegiatan', [CleanUPController::class, 'activities'])->name('cleanup.kegiatan');
    Route::post('/kegiatan', [CleanUPController::class, 'storeActivity'])->name('cleanup.kegiatan.store');

    // Absensi
    Route::get('/attendance', [AttendanceController::class, 'myAttendance'])->name('cleanup.attendance');
    Route::get('/attendance/status', [AttendanceController::class, 'status'])->name('cleanup.attendance.status');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->name('cleanup.attendance.clockIn');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('cleanup.attendance.clockOut');
    Route::post('/attendance/overtime/clock-in', [AttendanceController::class, 'clockInOvertime'])->name('cleanup.attendance.clockInOvertime');
    Route::post('/attendance/overtime/clock-out', [AttendanceController::class, 'clockOutOvertime'])->name('cleanup.attendance.clockOutOvertime');
    Route::post('/attendance/overtime/request', [AttendanceController::class, 'requestOvertime'])->name('cleanup.attendance.requestOvertime');

    // Pengajuan Izin/Sakit
    Route::post('/leave-request', [LeaveRequestController::class, 'store'])->name('cleanup.leave.store');
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
            'CleanUP'     => redirect()->route('cleanup.dashboard'),
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
