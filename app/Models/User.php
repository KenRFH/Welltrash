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
    // Access tiers for the admin panel and admin app (Bertingkat). Internal roles follow the HRIS position level.
    public const OPS_ROLES = ['superadmin', 'director', 'manager', 'coordinator'];      // monitoring, armada, absensi, lembur/izin
    public const COMMERCIAL_ROLES = ['superadmin', 'director', 'manager'];              // + mitra & invoice/piutang
    public const ACCOUNT_ROLES = ['superadmin', 'director'];                            // + kelola akun, target bulanan
    public const APP_ROLES = ['CleanUP', 'staff', ...self::OPS_ROLES];                // may sign in to the mobile app
    public const INTERNAL_ROLES = [...self::OPS_ROLES, 'staff'];                       // managed in HRIS only (read-only here)

    /** HRIS access level → Welltrash role. company (mitra) is local only; superadmin is an HRIS root account. */
    public const HRIS_ROLE_MAP = [
        'superadmin'      => 'superadmin',
        'director'        => 'director',
        'manager'         => 'manager',
        'coordinator'     => 'coordinator',
        'public_relation' => 'web_admin',
        'staff'           => 'staff',
        'cleanup'         => 'CleanUP',
    ];

    public const ROLE_LABELS = [
        'superadmin'  => 'Superadmin',
        'director'    => 'Direktur',
        'manager'     => 'Manager / GM',
        'coordinator' => 'Koordinator',
        'web_admin'   => 'Public Relation',
        'staff'       => 'Staf',
        'CleanUP'     => 'Kru CleanUP',
        'company'     => 'Mitra',
    ];

    public static function roleFromHris(?string $level): string
    {
        return self::HRIS_ROLE_MAP[strtolower((string) $level)] ?? 'CleanUP';
    }

    /** Landing page after login. Staf has no web panel: they use the mobile app. */
    public function homeUrl(): string
    {
        return match (true) {
            $this->hasRole(self::OPS_ROLES) => route('admin.dashboard'),
            $this->role === 'web_admin'     => route('webadmin.dashboard'),
            $this->role === 'CleanUP'       => route('cleanup.dashboard'),
            $this->role === 'staff'         => route('app.download'),
            default                         => route('company.dashboard'),
        };
    }

    public function roleLabel(): string
    {
        return self::ROLE_LABELS[$this->role] ?? $this->role;
    }

    public function hasRole(array $roles): bool
    {
        return in_array($this->role, $roles, true);
    }

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

