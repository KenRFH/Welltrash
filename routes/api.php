<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Company;

Route::get('/mitra', function (Request $request) {

    $apiKey = $request->header('X-API-KEY');

    if ($apiKey !== env('SPREADSHEET_API_KEY')) {

        return response()->json([
            'message' => 'Unauthorized'
        ], 401);

    }

    return Company::select(
        'company_name',
        'pic_name',
        'subscription_plan',
        'subscription_status'
    )->get();

});