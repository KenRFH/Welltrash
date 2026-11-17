<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Company;
use App\Http\Controllers\Api\OperatorApiController;
use App\Http\Controllers\Api\AdminApiController;
use App\Models\User;

Route::get('/mitra', function (Request $request) {

    $requestKey = trim($request->header('X-API-KEY'));
    $serverKey = trim(config('services.spreadsheet.api_key'));

    if ($requestKey !== $serverKey) {

        return response()->json([
            'message' => 'Unauthorized',
            'request_key' => $requestKey,
            'server_key' => $serverKey,
        ], 401);

    }

    return Company::select(
        'company_name',
        'pic_name',
        'subscription_plan',
        'subscription_status',
        'phone',
        'subscription_end_date'
    )->get()->map(function ($company) {
        return [
            'company_name'         => $company->company_name,
            'pic_name'             => $company->pic_name,
            'subscription_plan'    => $company->subscription_plan,
            'subscription_status'  => $company->subscription_status,
            'phone'                => $company->phone,
            'subscription_end_date'=> $company->subscription_end_date
                ? $company->subscription_end_date->format('d-m-Y')
                : '-',
        ];
    });

});

// Operator (CleanUP) Mobile REST API
Route::prefix('operator')->group(function () {
    Route::post('/login', [OperatorApiController::class, 'login'])->name('api.operator.login');
    // Update check for the Android app; same file the /download page reads.
    Route::get('/app-version', fn () => response()->file(public_path('downloads/version.json')))->name('api.operator.app-version');

    Route::middleware(['auth:sanctum', 'role:' . implode(',', User::APP_ROLES)])->group(function () {
        Route::get('/me', [OperatorApiController::class, 'me'])->name('api.operator.me');
        Route::post('/logout', [OperatorApiController::class, 'logout'])->name('api.operator.logout');
        Route::post('/push-device', [OperatorApiController::class, 'registerPushDevice'])->middleware('throttle:30,1')->name('api.operator.push-device');
        Route::get('/notifications', [OperatorApiController::class, 'notifications'])->name('api.operator.notifications');
        Route::post('/notifications/read', [OperatorApiController::class, 'readNotifications'])->name('api.operator.notifications.read');

        // Vehicles (Operational Fleet Selection)
        Route::get('/vehicles', [OperatorApiController::class, 'vehicles'])->name('api.operator.vehicles');
        Route::post('/vehicle/select', [OperatorApiController::class, 'selectVehicle'])->middleware('not-on-leave')->name('api.operator.vehicle.select');

        // Pickups
        Route::get('/pickups', [OperatorApiController::class, 'pickups'])->name('api.operator.pickups');
        Route::put('/pickups/{pickup}/status', [OperatorApiController::class, 'updatePickupStatus'])->middleware('not-on-leave')->name('api.operator.pickups.status');
        Route::post('/pickups/{pickup}/submit', [OperatorApiController::class, 'submitPickup'])->middleware('not-on-leave')->name('api.operator.pickups.submit');
        Route::post('/location', [OperatorApiController::class, 'updateLocation'])->name('api.operator.location');
        Route::get('/pickups/history', [OperatorApiController::class, 'history'])->name('api.operator.pickups.history');

        // Companies & Activities
        Route::get('/companies', [OperatorApiController::class, 'companies'])->name('api.operator.companies');
        Route::get('/activities', [OperatorApiController::class, 'activities'])->name('api.operator.activities');
        Route::post('/activities', [OperatorApiController::class, 'storeActivity'])->name('api.operator.activities.store');

        // Attendance & Salary
        Route::get('/attendance/status', [OperatorApiController::class, 'attendanceStatus'])->name('api.operator.attendance.status');
        Route::get('/attendance/summary', [OperatorApiController::class, 'attendanceSummary'])->name('api.operator.attendance.summary');
        Route::get('/hr', [OperatorApiController::class, 'hrSelfService'])->name('api.operator.hr');
        Route::post('/attendance/clock-in', [OperatorApiController::class, 'clockIn'])->middleware('not-on-leave')->name('api.operator.attendance.clockIn');
        Route::post('/attendance/clock-out', [OperatorApiController::class, 'clockOut'])->name('api.operator.attendance.clockOut');

        // Overtime & Leave Requests
        Route::post('/attendance/overtime/request', [OperatorApiController::class, 'requestOvertime'])->middleware('not-on-leave')->name('api.operator.overtime.request');
        Route::post('/attendance/overtime/clock-in', [OperatorApiController::class, 'clockInOvertime'])->middleware('not-on-leave')->name('api.operator.overtime.clockIn');
        Route::post('/attendance/overtime/clock-out', [OperatorApiController::class, 'clockOutOvertime'])->name('api.operator.overtime.clockOut');
        Route::post('/leave-request', [OperatorApiController::class, 'storeLeaveRequest'])->name('api.operator.leave.store');
    });
});

// Admin screens of the operator mobile app (Direktur / Manager / Koordinator accounts)
Route::prefix('admin')->middleware(['auth:sanctum', 'role:' . implode(',', User::OPS_ROLES)])->group(function () {
    Route::get('/dashboard', [AdminApiController::class, 'dashboard'])->name('api.admin.dashboard');
    Route::get('/cleanups/live-locations', [AdminApiController::class, 'liveLocations'])->name('api.admin.live-locations');
    Route::get('/approvals', [AdminApiController::class, 'approvals'])->name('api.admin.approvals');
    Route::post('/attendance/overtime/{overtimeRequest}/review', [AdminApiController::class, 'reviewOvertime'])->name('api.admin.overtime.review');
    Route::post('/attendance/leave/{leaveRequest}/review', [AdminApiController::class, 'reviewLeave'])->name('api.admin.leave.review');
    Route::post('/target', [AdminApiController::class, 'setMonthlyTarget'])->middleware('role:' . implode(',', User::ACCOUNT_ROLES))->name('api.admin.target');
    Route::post('/companies/{company}/review', [AdminApiController::class, 'reviewCompany'])->middleware('role:' . implode(',', User::COMMERCIAL_ROLES))->name('api.admin.companies.review');

    // Agenda / event + push reminder (Manager, Direktur, Superadmin)
    Route::middleware('role:' . implode(',', User::COMMERCIAL_ROLES))->group(function () {
        Route::get('/agendas', [AdminApiController::class, 'agendas'])->name('api.admin.agendas');
        Route::post('/agendas', [AdminApiController::class, 'storeAgenda'])->name('api.admin.agendas.store');
        Route::put('/agendas/{agenda}', [AdminApiController::class, 'updateAgenda'])->name('api.admin.agendas.update');
        Route::delete('/agendas/{agenda}', [AdminApiController::class, 'destroyAgenda'])->name('api.admin.agendas.destroy');
    });
});
