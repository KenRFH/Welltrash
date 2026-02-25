<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pickup extends Model
{
    protected $fillable = [
        'company_id',
        'driver_id',
        'pickup_date',
        'status',
        'cancellation_reason',
        'organic_weight',
        'anorganic_weight',
        'residue_weight',
        'organic_image_path',
        'anorganic_image_path',
        'residue_image_path',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }
}
