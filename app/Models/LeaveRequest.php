<?php

namespace App\Models;

use App\Models\Concerns\HasReviewer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveRequest extends Model
{
    use HasFactory, HasReviewer;

    protected $fillable = [
        'user_id',
        'date',
        'type',
        'reason',
        'status',
        'admin_note',
        'proof_image',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    /**
     * New request, or reopen this person's rejected one for the same date (one row per user+date is enforced
     * by a unique index). Reopening clears the previous decision so it is reviewed again.
     */
    public static function submit(int $userId, string $date, array $attributes): self
    {
        $leave = static::where('user_id', $userId)->whereDate('date', $date)->where('status', 'rejected')->first();
        $fields = $attributes + ['status' => 'pending', 'admin_note' => null, 'reviewed_by' => null, 'reviewed_at' => null];

        if ($leave) {
            $leave->update($fields);
            return $leave;
        }

        return static::create($fields + ['user_id' => $userId, 'date' => $date]);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
