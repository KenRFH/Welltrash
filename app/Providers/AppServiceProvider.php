<?php

namespace App\Providers;

use App\Models\Company;
use App\Models\LeaveRequest;
use App\Models\OvertimeRequest;
use App\Models\User;
use App\Services\FcmService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Push "approval waiting" to the admin tiers that can act on it, whichever screen created the request.
        // Deferred: sent after the response, so the crew member submitting never waits on FCM.
        $push = fn (array $roles, string $title, string $body, array $data) => \Illuminate\Support\defer(
            fn () => app(FcmService::class)->toRoles($roles, $title, $body, $data)
        );
        $when = fn ($date) => $date ? Carbon::parse($date)->locale('id')->translatedFormat('l, d M') : '';

        LeaveRequest::created(function (LeaveRequest $l) use ($push, $when) {
            if (($l->status ?? 'pending') === 'pending') {
                $push(User::OPS_ROLES, 'Pengajuan ' . ($l->type === 'sakit' ? 'sakit' : 'izin') . ' baru', trim(($l->user?->name ?? 'Kru') . " · {$when($l->date)}\n{$l->reason}"), ['type' => 'approval', 'kind' => 'leave']);
            }
        });
        OvertimeRequest::created(function (OvertimeRequest $o) use ($push, $when) {
            if (($o->status ?? 'pending') === 'pending') {
                $push(User::OPS_ROLES, 'Pengajuan lembur baru', trim(($o->user?->name ?? 'Kru') . " · {$when($o->date)}\n{$o->reason}"), ['type' => 'approval', 'kind' => 'overtime']);
            }
        });
        Company::created(function (Company $c) use ($push) {
            if ($c->subscription_status === 'pending') {
                $push(User::COMMERCIAL_ROLES, 'Pendaftaran mitra baru', "{$c->company_name} menunggu persetujuan.", ['type' => 'approval', 'kind' => 'company']);
            }
        });
    }
}
