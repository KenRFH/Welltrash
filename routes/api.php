<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Company;
use App\Http\Controllers\Api\OperatorApiController;

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

    Route::middleware(['auth:sanctum', 'role:CleanUP'])->group(function () {
        Route::get('/me', [OperatorApiController::class, 'me'])->name('api.operator.me');
        Route::post('/logout', [OperatorApiController::class, 'logout'])->name('api.operator.logout');

        // Pickups
        Route::get('/pickups', [OperatorApiController::class, 'pickups'])->name('api.operator.pickups');
        Route::put('/pickups/{pickup}/status', [OperatorApiController::class, 'updatePickupStatus'])->name('api.operator.pickups.status');
        Route::post('/pickups/{pickup}/submit', [OperatorApiController::class, 'submitPickup'])->name('api.operator.pickups.submit');
        Route::post('/location', [OperatorApiController::class, 'updateLocation'])->name('api.operator.location');
        Route::get('/pickups/history', [OperatorApiController::class, 'history'])->name('api.operator.pickups.history');

        // Companies & Activities
        Route::get('/companies', [OperatorApiController::class, 'companies'])->name('api.operator.companies');
        Route::get('/activities', [OperatorApiController::class, 'activities'])->name('api.operator.activities');
        Route::post('/activities', [OperatorApiController::class, 'storeActivity'])->name('api.operator.activities.store');

        // Attendance & Salary
        Route::get('/attendance/status', [OperatorApiController::class, 'attendanceStatus'])->name('api.operator.attendance.status');
        Route::get('/attendance/summary', [OperatorApiController::class, 'attendanceSummary'])->name('api.operator.attendance.summary');
        Route::post('/attendance/clock-in', [OperatorApiController::class, 'clockIn'])->name('api.operator.attendance.clockIn');
        Route::post('/attendance/clock-out', [OperatorApiController::class, 'clockOut'])->name('api.operator.attendance.clockOut');

        // Overtime & Leave Requests
        Route::post('/attendance/overtime/request', [OperatorApiController::class, 'requestOvertime'])->name('api.operator.overtime.request');
        Route::post('/attendance/overtime/clock-in', [OperatorApiController::class, 'clockInOvertime'])->name('api.operator.overtime.clockIn');
        Route::post('/attendance/overtime/clock-out', [OperatorApiController::class, 'clockOutOvertime'])->name('api.operator.overtime.clockOut');
        Route::post('/leave-request', [OperatorApiController::class, 'storeLeaveRequest'])->name('api.operator.leave.store');
    });
});
