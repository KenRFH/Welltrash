<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Company;

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