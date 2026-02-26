<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),

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

        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::get('/companies', [AdminController::class, 'indexCompanies'])->name('companies.index');
        Route::get('/companies/pending', [AdminController::class, 'pendingCompanies'])->name('companies.pending');
        Route::patch('/companies/{company}/approve', [AdminController::class, 'approveCompany'])->name('companies.approve');
        Route::delete('/companies/{company}/reject', [AdminController::class, 'rejectCompany'])->name('companies.reject');
        
        Route::get('/companies/cancellations/requests', [AdminController::class, 'cancellationRequests'])->name('companies.cancellations');
        Route::delete('/companies/{company}/cancellations/approve', [AdminController::class, 'approveCancellation'])->name('companies.cancellations.approve');

        Route::get('/companies/{company}', [AdminController::class, 'showCompany'])->name('companies.show');

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
        Route::get('/register', [CompanyController::class, 'register'])->name('register');
        Route::post('/register', [CompanyController::class, 'store'])->name('store');
        
        Route::get('/schedule', [CompanyController::class, 'schedule'])->name('schedule');
        Route::post('/schedule', [CompanyController::class, 'updateSchedule'])->name('schedule.update');
        
        Route::post('/unsubscribe', [CompanyController::class, 'unsubscribeRequest'])->name('unsubscribe');

    });

use App\Http\Controllers\DriverController;

/*
|--------------------------------------------------------------------------
| Driver Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'role:driver'])
    ->prefix('driver')
    ->name('driver.')
    ->group(function () {

        Route::get('/dashboard', [DriverController::class, 'dashboard'])->name('dashboard');
        Route::get('/history', [DriverController::class, 'history'])->name('history');
        
        Route::post('/pickup/{pickup}/status', [DriverController::class, 'updateStatus'])->name('pickup.status');
        Route::post('/pickup/{pickup}/submit', [DriverController::class, 'submitPickup'])->name('pickup.submit');

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
            'admin'  => redirect()->route('admin.dashboard'),
            'driver' => redirect()->route('driver.dashboard'),
            default  => redirect()->route('company.dashboard'),
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
| Auth Routes (Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
