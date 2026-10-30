<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'license_plate',
        'type',
        'capacity',
        'status',
        'notes',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function drivers()
    {
        return $this->hasMany(User::class, 'vehicle_id');
    }

    public function pickups()
    {
        return $this->hasMany(Pickup::class, 'vehicle_id');
    }
}
