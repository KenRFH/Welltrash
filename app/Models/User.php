<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'employee_code',
        'division',
        'position',
        'password',
        'role',
        'is_active',
        'vehicle_id',
        'daily_salary',
        'current_lat',
        'current_lng',
        'last_location_at',
    ];

    // Mirror the DB default so freshly created (not yet refreshed) models count as active
    protected $attributes = [
        'is_active' => true,
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
            'is_active'         => 'boolean',
            'last_location_at'  => 'datetime',
            'current_lat'       => 'float',
            'current_lng'       => 'float',
        ];
    }

    public function company()
    {
        return $this->hasOne(Company::class);
    }

    public function pickups()
    {
        return $this->hasMany(Pickup::class, 'cleanup_id');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class);
    }
}

