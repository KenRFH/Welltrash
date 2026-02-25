<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Company extends Model
{
    /** @use HasFactory<\Database\Factories\CompanyFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'address',
        'phone',
        'subscription_plan',
        'subscription_status',
        'payment_evidence_path',
        'signed_mou_path',
        'pickup_schedule',
    ];

    protected $casts = [
        'pickup_schedule' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function pickups()
    {
        return $this->hasMany(Pickup::class);
    }
}
