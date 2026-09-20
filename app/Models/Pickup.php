<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pickup extends Model
{
    protected $fillable = [
        'company_id',
        'cleanup_id',
        'pickup_date',
        'status',
        'cancellation_reason',
        'organic_weight',
        'anorganic_weight',
        'residue_weight',
        'evidence_pickup_path',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function cleanup()
    {
        return $this->belongsTo(User::class, 'cleanup_id');
    }

    
}
