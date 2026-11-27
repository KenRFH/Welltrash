<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\Company;
use App\Models\Invoice;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\Pickup;
use App\Models\SiteSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/** Numbers for the monthly board report (PDF). Pure reads; one month at a time. */
class MonthlyReportService
{
    private const KG = 'COALESCE(organic_weight,0)+COALESCE(anorganic_weight,0)+COALESCE(residue_weight,0)';

    public function build(string $month): array
    {
        // Indonesian month/day names in the PDF whatever the app locale is.
        $start = Carbon::createFromFormat('Y-m-d', "{$month}-01")->startOfDay()->locale('id');
        $end = $start->copy()->endOfMonth();
        $prevStart = $start->copy()->subMonthNoOverflow();
        $prevEnd = $prevStart->copy()->endOfMonth();

        $current = $this->totals($start, $end);
        $previous = $this->totals($prevStart, $prevEnd);

        return [
            'month'      => $month,
            'start'      => $start,
            'end'        => $end,
            'prevLabel'  => $prevStart->translatedFormat('F Y'),
            'current'    => $current,
            'previous'   => $previous,
            'target'     => [
                'kg'      => ($v = SiteSetting::get("target_kg:{$month}")) !== null ? (float) $v : null,
                'pickups' => ($v = SiteSetting::get("target_pickups:{$month}")) !== null ? (int) $v : null,
            ],
            'weeks'      => $this->weeks($start, $end),
            'companies'  => $this->completed($start, $end)
                ->join('companies', 'companies.id', '=', 'pickups.company_id')
                ->groupBy('pickups.company_id', 'companies.company_name')
                ->selectRaw('companies.company_name as name, COUNT(*) as pickups, SUM(' . self::KG . ') as kg')
                ->orderByDesc('kg')->limit(10)->get(),
            'crew'       => $this->completed($start, $end)
                ->join('users', 'users.id', '=', 'pickups.cleanup_id')
                ->groupBy('pickups.cleanup_id', 'users.name')
                ->selectRaw('users.name as name, COUNT(*) as pickups, SUM(' . self::KG . ') as kg')
                ->orderByDesc('pickups')->get(),
            'people'     => [
                'attendance_days' => Attendance::whereBetween('date', [$start->toDateString(), $end->toDateString()])->whereNotNull('clock_in_at')->count(),
                'crew_present'    => Attendance::whereBetween('date', [$start->toDateString(), $end->toDateString()])->whereNotNull('clock_in_at')->distinct()->count('user_id'),
                'leave_approved'  => LeaveRequest::where('status', 'approved')->whereBetween('date', [$start->toDateString(), $end->toDateString()])->count(),
                'overtime_approved' => OvertimeRequest::where('status', 'approved')->whereBetween('date', [$start->toDateString(), $end->toDateString()])->count(),
            ],
            'approvers'  => $this->approvers($start, $end),
            'companiesNew' => Company::whereBetween('created_at', [$start, $end])->count(),
            'finance'    => [
                'issued_count'  => Invoice::whereBetween('created_at', [$start, $end])->count(),
                'issued_amount' => (float) Invoice::whereBetween('created_at', [$start, $end])->sum('amount'),
                'paid_amount'   => (float) Invoice::whereBetween('created_at', [$start, $end])->where('status', 'paid')->sum('amount'),
                // Outstanding as of the end of the month, regardless of when it was issued.
                'unpaid_amount' => (float) Invoice::where('status', 'unpaid')->where('created_at', '<=', $end)->sum('amount'),
                'overdue_count' => Invoice::where('status', 'unpaid')->whereDate('due_date', '<', min($end, Carbon::today()))->count(),
            ],
        ];
    }

    private function completed(Carbon $from, Carbon $to)
    {
        return Pickup::where('pickups.status', 'completed')
            ->whereDate('pickups.pickup_date', '>=', $from->toDateString())
            ->whereDate('pickups.pickup_date', '<=', $to->toDateString());
    }

    private function totals(Carbon $from, Carbon $to): array
    {
        $row = $this->completed($from, $to)->selectRaw('COUNT(*) c, SUM(COALESCE(organic_weight,0)) org, SUM(COALESCE(anorganic_weight,0)) anorg, SUM(COALESCE(residue_weight,0)) res')->first();
        $scheduled = Pickup::whereDate('pickup_date', '>=', $from->toDateString())->whereDate('pickup_date', '<=', $to->toDateString());

        return [
            'pickups'   => (int) $row->c,
            'scheduled' => (clone $scheduled)->count(),
            'failed'    => (clone $scheduled)->whereIn('status', ['failed', 'missed'])->count(),
            'organic'   => round((float) $row->org, 2),
            'anorganic' => round((float) $row->anorg, 2),
            'residue'   => round((float) $row->res, 2),
            'kg'        => round((float) $row->org + (float) $row->anorg + (float) $row->res, 2),
        ];
    }

    /** Monday-to-Sunday slices of the month (first and last week clipped to the month). */
    private function weeks(Carbon $start, Carbon $end): array
    {
        $daily = $this->completed($start, $end)
            ->selectRaw('DATE(pickup_date) d, COUNT(*) c, SUM(' . self::KG . ') kg')
            ->groupBy('d')->get()->keyBy('d');

        $weeks = [];
        for ($from = $start->copy(); $from->lte($end); $from = $to->copy()->addDay()) {
            $to = $from->copy()->endOfWeek(Carbon::SUNDAY)->min($end);
            $days = collect();
            for ($d = $from->copy(); $d->lte($to); $d->addDay()) {
                $days->push($daily[$d->toDateString()] ?? null);
            }
            $weeks[] = [
                'label'   => $from->format('d') . '–' . $to->translatedFormat('d M'),
                'pickups' => (int) $days->sum(fn ($r) => $r->c ?? 0),
                'kg'      => round((float) $days->sum(fn ($r) => $r->kg ?? 0), 2),
            ];
        }

        return $weeks;
    }

    private function approvers(Carbon $start, Carbon $end): array
    {
        $count = fn (string $table) => DB::table($table)->whereBetween("{$table}.reviewed_at", [$start, $end])->whereNotNull("{$table}.reviewed_by")
            ->join('users', 'users.id', '=', "{$table}.reviewed_by")
            ->groupBy('users.name')->selectRaw('users.name as name, COUNT(*) as c')->pluck('c', 'name');

        $rows = [];
        foreach (['leave_requests' => 'izin', 'overtime_requests' => 'lembur', 'companies' => 'mitra'] as $table => $key) {
            foreach ($count($table) as $name => $c) {
                $rows[$name][$key] = (int) $c;
            }
        }
        ksort($rows);

        return $rows;
    }
}
