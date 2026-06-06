<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'date',
        'clock_in_at',
        'clock_in_photo',
        'clock_in_lat',
        'clock_in_lng',
        'clock_out_at',
        'clock_out_photo',
        'clock_out_lat',
        'clock_out_lng',
        'work_hours',
        'status',
        'overtime_clock_in_at',
        'overtime_clock_in_photo',
        'overtime_clock_in_lat',
        'overtime_clock_in_lng',
        'overtime_clock_out_at',
        'overtime_clock_out_photo',
        'overtime_clock_out_lat',
        'overtime_clock_out_lng',
        'overtime_hours',
    ];

    protected $casts = [
        'date'                  => 'date',
        'clock_in_at'           => 'datetime',
        'clock_out_at'          => 'datetime',
        'work_hours'            => 'decimal:2',
        'overtime_clock_in_at'  => 'datetime',
        'overtime_clock_out_at' => 'datetime',
        'overtime_hours'        => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
