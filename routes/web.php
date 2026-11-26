<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\Admin\AttendanceController as AdminAttendanceController;
/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/


Route::get('/', function () {
    $activities = \App\Models\Activity::orderBy('date', 'desc')->take(3)->get();
    $katalogs   = \App\Models\Katalog::orderBy('created_at', 'desc')->take(3)->get();
    $solutions  = \App\Models\Solution::orderBy('order_num', 'asc')->orderBy('created_at', 'asc')->get();
    $solutionSettings = [
        'badge'      => \App\Models\SiteSetting::get('solution_badge', 'SOLUSI B2B TERPADU'),
        'title'      => \App\Models\SiteSetting::get('solution_title', 'Dirancang untuk skala operasional bisnis Anda.'),
        'subtitle'   => \App\Models\SiteSetting::get('solution_subtitle', 'Pengelolaan sampah komersial membutuhkan keandalan logistik, kepatuhan regulasi lingkungan hidup, dan transparansi data yang dapat dipertanggungjawabkan.'),
        'is_visible' => \App\Models\SiteSetting::get('solution_visible', '1') !== '0',
    ];
    $meta = [
        'title'       => 'Jasa Angkut Sampah Jember Terjadwal untuk Bisnis | WellTrash',
        'description' => 'Jasa angkut & pengelolaan sampah terjadwal di Jember untuk bisnis, institusi, hotel, rumah sakit, dan perumahan. Armada resmi dan laporan tonase transparan.',
    ];
    return Inertia::render('Welcome', [
        'canLogin'         => Route::has('login'),
        'canRegister'      => Route::has('register'),
        'activities'       => $activities,
        'katalogs'         => $katalogs,
        'solutions'        => $solutions,
        'solutionSettings' => $solutionSettings,
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('beranda');

Route::get('/tentang-kami', function () {
    $teams = \App\Models\Team::orderBy('order_num', 'asc')->orderBy('created_at', 'desc')->get();
    $meta = [
        'title'       => 'Tentang WellTrash – Perusahaan Pengelola Sampah di Jember',
        'description' => 'Mengenal WellTrash, perusahaan pengelola sampah swasta di Jember: visi, tim, armada, dan fasilitas daur ulang WellTrash Farm.',
    ];
    return Inertia::render('About', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'teams' => $teams,
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('about');

Route::get('/layanan', function () {
    $meta = [
        'title'       => 'Harga & Paket Jasa Angkut Sampah Jember | WellTrash',
        'description' => 'Paket jasa angkut sampah di Jember mulai Rp500.000 per penjemputan: on-demand, klaster perumahan, hingga paket rutin bisnis dan industri dengan MOU resmi.',
    ];
    return Inertia::render('Services', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('services');

Route::get('/activity', function () {
    $activities = \App\Models\Activity::orderBy('date', 'desc')->get();
    $meta = [
        'title'       => 'Aktivitas & Jurnal Lapangan | WellTrash Jember',
        'description' => 'Dokumentasi kegiatan operasional, aksi pemilahan sampah, dan edukasi keberlanjutan bersama komunitas di Kabupaten Jember.',
    ];
    return Inertia::render('Activity', [
        'activities' => $activities,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('activity');

Route::get('/activity/{id}/{slug?}', function ($id, $slug = null) {
    $activity = \App\Models\Activity::findOrFail($id);
    // One URL per activity: old /activity/{id} links and renamed titles 301 to the current slug.
    if ($slug !== $activity->slug) {
        return redirect()->route('activity.show', [$activity->id, $activity->slug], 301);
    }
    $activity->recordView();
    $meta = [
        'title'       => $activity->title . ' | Aktivitas WellTrash',
        'description' => $activity->excerpt(),
        'image'       => $activity->image_path ? asset('storage/' . $activity->image_path) : null,
        'type'        => 'article',
    ];
    return Inertia::render('ActivityDetail', [
        'activity' => $activity,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('activity.show');

// Berita was merged into Aktivitas (2026-11); keep old /news links from 404ing.
Route::get('/news/{any?}', fn () => redirect()->route('activity', [], 301))->where('any', '.*');

Route::get('/katalog', function () {
    $katalogs = \App\Models\Katalog::orderBy('created_at', 'desc')->get();
    $meta = [
        'title'       => 'Katalog Produk Daur Ulang & Material Sirkular | WellTrash',
        'description' => 'Katalog material daur ulang, kompos organik, pakan protein BSF, dan cacahan plastik dari WellTrash Farm Jember.',
    ];
    return Inertia::render('Katalog', [
        'katalogs' => $katalogs,
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('katalog');

Route::get('/downloads', function () {
    $meta = [
        'title'       => 'Unduh Aplikasi & Dokumen Resmi | WellTrash',
        'description' => 'Unduh APK resmi WellTrash CleanUP Operator, akses Partner Portal mitra, dan dokumen legalitas operasional pengelolaan sampah di Kabupaten Jember.',
    ];
    return Inertia::render('Downloads', [
        'apk' => json_decode(@file_get_contents(public_path('downloads/version.json')), true),
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('downloads');

Route::get('/download', function () {
    $meta = [
        'title'       => 'Unduh Aplikasi WellTrash CleanUP Operator',
        'description' => 'Unduh APK resmi WellTrash CleanUP Operator untuk petugas pengangkutan sampah armada WellTrash, lengkap dengan panduan instalasi.',
    ];
    return Inertia::render('Admin/Download', [
        'apk' => json_decode(@file_get_contents(public_path('downloads/version.json')), true),
        'meta' => $meta,
    ])->withViewData(['meta' => $meta]);
})->name('app.download');

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminAccountController;
use App\Http\Controllers\AdminVehicleController;
use App\Http\Controllers\InvoiceController;

/*
|--------------------------------------------------------------------------
| Admin / Owner Routes
|--------------------------------------------------------------------------
*/

// Tiers follow HRIS levels (see User::OPS_ROLES / COMMERCIAL_ROLES / ACCOUNT_ROLES).
Route::middleware(['auth', 'role:' . implode(',', User::OPS_ROLES)])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

      // Kelola Akun: Superadmin & Direktur
      Route::middleware('role:' . implode(',', User::ACCOUNT_ROLES))->group(function () {
        Route::get('/accounts', [AdminAccountController::class, 'index'])->name('accounts.index');
        Route::post('/accounts', [AdminAccountController::class, 'store'])->name('accounts.store');
        // Must stay above /accounts/{user}, otherwise "sync-hris" is bound as a user id (404).
        Route::post('/accounts/sync-hris', [AdminAccountController::class, 'syncHrisCrew'])->name('accounts.syncHris');
        Route::post('/accounts/{user}', [AdminAccountController::class, 'update'])->name('accounts.update');
        Route::patch('/accounts/{user}/toggle-active', [AdminAccountController::class, 'toggleActive'])->name('accounts.toggleActive');
        Route::delete('/accounts/{user}', [AdminAccountController::class, 'destroy'])->name('accounts.destroy');
      });

      // Mitra, gaji & invoice: Superadmin, Direktur, Manager
      Route::middleware('role:' . implode(',', User::COMMERCIAL_ROLES))->group(function () {


        Route::get('/companies', [AdminController::class, 'indexCompanies'])->name('companies.index');
        Route::get('/companies/pending', [AdminController::class, 'pendingCompanies'])->name('companies.pending');
        Route::patch('/companies/{company}/approve', [AdminController::class, 'approveCompany'])->name('companies.approve');
        Route::patch('/companies/{company}/activate', [AdminController::class, 'activateCompany'])->name('companies.activate');
        Route::patch('/companies/{company}/toggle-status', [AdminController::class, 'toggleStatus'])->name('companies.toggleStatus');
        Route::post('/companies/{company}/reject', [AdminController::class, 'rejectCompany'])->name('companies.reject');
        
        Route::get('/companies/cancellations/requests', [AdminController::class, 'cancellationRequests'])->name('companies.cancellations');
        Route::delete('/companies/{company}/cancellations/approve', [AdminController::class, 'approveCancellation'])->name('companies.cancellations.approve');

        Route::get('/companies/{company}', [AdminController::class, 'showCompany'])->name('companies.show');
        Route::patch('/companies/{company}/coordinates', [AdminController::class, 'updateCoordinates'])->name('companies.updateCoordinates');
        Route::post('/pickups/{pickup}/complete', [AdminController::class, 'completePickup'])->name('pickups.complete');
        Route::post('/pickups/{pickup}/resend-report', [AdminController::class, 'resendPickupReport'])->name('pickups.resendReport');
        Route::patch('/attendance/salary/{user}', [AdminAttendanceController::class, 'updateSalary'])->name('attendance.updateSalary');
        Route::get('/reports/monthly', \App\Http\Controllers\Admin\MonthlyReportController::class)->name('reports.monthly');

        // Invoice
        Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
        Route::get('/invoices/create', [InvoiceController::class, 'create'])->name('invoices.create');
        Route::post('/invoices', [InvoiceController::class, 'store'])->name('invoices.store');
        Route::get('/invoices/{invoice}/show', [InvoiceController::class, 'show'])->name('invoices.show');
        Route::patch('/invoices/{invoice}/mark-paid', [InvoiceController::class, 'markPaid'])->name('invoices.markPaid');
        Route::post('/invoices/{invoice}/resend-wa', [InvoiceController::class, 'resendWa'])->name('invoices.resendWa');
        Route::delete('/invoices/{invoice}', [InvoiceController::class, 'destroy'])->name('invoices.destroy');
        Route::get('/invoices/{invoice}/whatsapp', [InvoiceController::class, 'sendWhatsApp'])->name('invoices.whatsapp');
      });

      // Operasional: semua tingkat admin termasuk Koordinator

        // Monitoring Peta Mitra & Armada
        Route::get('/monitoring-map', [AdminController::class, 'monitoringMap'])->name('monitoring.map');

        Route::get('/cleanups', [AdminController::class, 'cleanups'])->name('cleanups');
        Route::get('/cleanups/live-locations', [AdminController::class, 'liveLocations'])->name('cleanups.liveLocations');
        Route::get('/cleanups/{user}', [AdminController::class, 'cleanupDetail'])->name('cleanups.show');

        // Inventaris Kendaraan Operasional
        Route::resource('vehicles', AdminVehicleController::class)->except(['create', 'show', 'edit']);
        Route::patch('/vehicles/{vehicle}/toggle-status', [AdminVehicleController::class, 'toggleStatus'])->name('vehicles.toggleStatus');
        Route::patch('/vehicles/{vehicle}/release-driver', [AdminVehicleController::class, 'releaseDriver'])->name('vehicles.releaseDriver');

        // Absensi
        Route::get('/attendance', [AdminAttendanceController::class, 'index'])->name('attendance.index');
        Route::patch('/attendance/leave/{leaveRequest}/review', [AdminAttendanceController::class, 'reviewLeave'])->name('attendance.leave.review');
        Route::patch('/attendance/overtime/{overtimeRequest}/review', [AdminAttendanceController::class, 'reviewOvertime'])->name('attendance.overtime.review');

    });

use App\Http\Controllers\WebAdminController;
use App\Http\Controllers\WebAdmin\ActivityController;
use App\Http\Controllers\WebAdmin\KatalogController;

/*
|--------------------------------------------------------------------------
| WebAdmin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:web_admin,superadmin'])
    ->prefix('webadmin')
    ->name('webadmin.')
    ->group(function () {
        Route::get('/dashboard', [WebAdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/content-images', [WebAdminController::class, 'uploadContentImage'])->name('content-images.store');
        Route::put('/solutions/settings', [App\Http\Controllers\WebAdmin\SolutionController::class, 'updateSettings'])->name('solutions.settings');
        Route::post('/solutions/toggle-visibility', [App\Http\Controllers\WebAdmin\SolutionController::class, 'toggleVisibility'])->name('solutions.toggle-visibility');
        Route::resource('solutions', App\Http\Controllers\WebAdmin\SolutionController::class)->except(['show', 'create', 'edit']);
        Route::resource('activities', App\Http\Controllers\WebAdmin\ActivityController::class)->except(['show']);
        Route::resource('katalogs', App\Http\Controllers\WebAdmin\KatalogController::class)->except(['show']);
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
        Route::get('/tracking/active', [CompanyController::class, 'activeTracking'])->name('tracking.active');

        // Invoice (Mitra)
        Route::get('/invoices', [InvoiceController::class, 'companyInvoices'])->name('invoices.index');
        Route::get('/invoices/{invoice}/download', [InvoiceController::class, 'downloadInvoice'])->name('invoices.download');
        Route::post('/invoices/{invoice}/upload-proof', [InvoiceController::class, 'uploadPaymentProof'])->name('invoices.uploadProof');
    });
use App\Http\Controllers\CleanUPController;

/*
|--------------------------------------------------------------------------
| CleanUP Routes
|--------------------------------------------------------------------------
*/

Route::prefix('cleanup')->middleware(['auth', 'role:CleanUP'])->group(function () {
    Route::get('/dashboard', [CleanUPController::class, 'dashboard'])->name('cleanup.dashboard');
    Route::get('/sync', [CleanUPController::class, 'sync'])->name('cleanup.sync');
    Route::get('/sync-status', [CleanUPController::class, 'syncStatus'])->name('cleanup.syncStatus');
    Route::put('/update-status/{pickup}', [CleanUPController::class, 'updateStatus'])->middleware('not-on-leave')->name('cleanup.updateStatus');
    Route::post('/submit-pickup/{pickup}', [CleanUPController::class, 'submitPickup'])->middleware('not-on-leave')->name('cleanup.submitPickup');
    Route::get('/history', [CleanUPController::class, 'history'])->name('cleanup.history');
    Route::get('/kegiatan', [CleanUPController::class, 'activities'])->name('cleanup.kegiatan');
    Route::post('/kegiatan', [CleanUPController::class, 'storeActivity'])->name('cleanup.kegiatan.store');
    Route::post('/location', [CleanUPController::class, 'updateLocation'])->name('cleanup.location.update');
    Route::post('/select-vehicle', [CleanUPController::class, 'selectVehicle'])->middleware('not-on-leave')->name('cleanup.selectVehicle');

    // Absensi
    Route::get('/attendance', [AttendanceController::class, 'myAttendance'])->name('cleanup.attendance');
    Route::get('/attendance/status', [AttendanceController::class, 'status'])->name('cleanup.attendance.status');
    Route::post('/attendance/clock-in', [AttendanceController::class, 'clockIn'])->middleware('not-on-leave')->name('cleanup.attendance.clockIn');
    Route::post('/attendance/clock-out', [AttendanceController::class, 'clockOut'])->name('cleanup.attendance.clockOut');
    Route::post('/attendance/overtime/clock-in', [AttendanceController::class, 'clockInOvertime'])->middleware('not-on-leave')->name('cleanup.attendance.clockInOvertime');
    Route::post('/attendance/overtime/clock-out', [AttendanceController::class, 'clockOutOvertime'])->name('cleanup.attendance.clockOutOvertime');
    Route::post('/attendance/overtime/request', [AttendanceController::class, 'requestOvertime'])->middleware('not-on-leave')->name('cleanup.attendance.requestOvertime');

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
        return redirect($user->homeUrl());
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

// Real 404 status: a 200 here makes Google index every mistyped URL as a page ("soft 404").
Route::fallback(fn () => Inertia::render('NotFound')->toResponse(request())->setStatusCode(404));

/*
|--------------------------------------------------------------------------
| Auth Routes (Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
