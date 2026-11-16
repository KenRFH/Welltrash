<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\MonthlyReportService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class MonthlyReportController extends Controller
{
    /** Board report PDF for one month (default: current month). */
    public function __invoke(Request $request, MonthlyReportService $reports)
    {
        $month = $request->validate([
            'month' => ['nullable', 'date_format:Y-m', 'before_or_equal:' . Carbon::today()->format('Y-m')],
        ])['month'] ?? Carbon::today()->format('Y-m');

        File::ensureDirectoryExists(storage_path('fonts')); // dompdf font cache (needed on hosting)

        $pdf = Pdf::loadView('pdf.laporan-bulanan', $reports->build($month))
            ->setPaper('A4', 'portrait')
            ->setOption('defaultFont', 'DejaVu Sans')
            ->setOption('enable_remote', false);

        return $pdf->download("laporan-welltrash-{$month}.pdf");
    }
}
