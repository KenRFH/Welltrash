<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class Pickup extends Model
{
    protected $fillable = [
        'company_id',
        'cleanup_id',
        'vehicle_id',
        'pickup_date',
        'status',
        'cancellation_reason',
        'organic_weight',
        'anorganic_weight',
        'residue_weight',
        'trash_bag_count',
        'evidence_pickup_path',
    ];

    protected $casts = [
        'trash_bag_count' => 'integer',
        'organic_weight' => 'float',
        'anorganic_weight' => 'float',
        'residue_weight' => 'float',
    ];

    /**
     * Every completion path (operator app, offline sync, web portal) ends here: on the switch to "completed",
     * email the partner's account the PDF report. Sent after the response so the operator never waits on SMTP;
     * a failed send is logged and never undoes the completion.
     */
    protected static function booted(): void
    {
        static::updated(function (Pickup $pickup) {
            if (! $pickup->wasChanged('status') || $pickup->status !== 'completed') {
                return;
            }
            $id = $pickup->id;
            dispatch(function () use ($id) {
                $pickup = Pickup::with('company.user')->find($id);
                $email = $pickup?->company?->user?->email;
                if (! $email) {
                    return;
                }
                try {
                    \Illuminate\Support\Facades\Mail::to($email)->send(new \App\Mail\PickupReportMail($pickup));
                } catch (\Throwable $e) {
                    \Illuminate\Support\Facades\Log::warning("Email laporan pickup #{$id} ke {$email} gagal: " . $e->getMessage());
                }
            })->afterResponse();
        });
    }

    /**
     * Why $user may not work on this pickup now (null = allowed); same rules for the app API and the web portal.
     * Finished jobs are final, a job taken by another crew stays theirs, and work needs a clock-in that day.
     */
    public function refusalFor(User $user): ?string
    {
        if (in_array($this->status, ['completed', 'failed'], true)) {
            return 'Penjemputan ini sudah ' . ($this->status === 'completed' ? 'diselesaikan' : 'dibatalkan') . ' dan tidak dapat diubah lagi.';
        }
        if ($this->cleanup_id && $this->cleanup_id !== $user->id) {
            return 'Penjemputan ini sedang dikerjakan oleh ' . ($this->cleanup?->name ?? 'kru lain') . '.';
        }
        $clockedIn = Attendance::where('user_id', $user->id)
            ->whereDate('date', Carbon::parse($this->pickup_date)->toDateString())
            ->whereNotNull('clock_in_at')->exists();

        return $clockedIn ? null : 'Lakukan presensi masuk terlebih dahulu sebelum menjalankan tugas penjemputan.';
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function cleanup()
    {
        return $this->belongsTo(User::class, 'cleanup_id');
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    
}
