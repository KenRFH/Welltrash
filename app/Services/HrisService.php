<?php

namespace App\Services;

use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class HrisService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = (string) config('services.hris.url', 'http://127.0.0.1:8000');
        $this->apiKey  = (string) config('services.hris.api_key', '');
        $this->timeout = (int) config('services.hris.timeout', 5);
    }

    public function isConfigured(): bool
    {
        return !empty($this->baseUrl) && !empty($this->apiKey);
    }

    /**
     * Verify credentials directly against HRIS internal endpoint.
     */
    public function verifyCredentials(string $identifier, string $password): ?array
    {
        if (!$this->isConfigured()) {
            return null;
        }

        $url = "{$this->baseUrl}/api/v1/internal/verify-credentials";

        try {
            $response = Http::withHeaders([
                'X-HRIS-KEY' => $this->apiKey,
                'Accept'     => 'application/json',
            ])->timeout($this->timeout)->post($url, [
                'email'    => trim($identifier),
                'password' => $password,
            ]);

            $json = $response->json();
            return is_array($json) ? $json : null;
        } catch (\Throwable $e) {
            Log::warning('HrisService verifyCredentials connection error: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Local account for an HRIS identity. One matching key is not enough: codes get reassigned and HRIS_API_URL
     * can point at another environment with its own numbering, so a match must not contradict the other keys.
     */
    private function findLocalUser(?string $code, ?string $email, ?string $name): ?User
    {
        $sameName = fn (User $u) => $name && strcasecmp(trim($u->name), trim($name)) === 0;

        // Same code: also same email or same name.
        $byCode = $code ? User::where('employee_code', $code)->first() : null;
        if ($byCode && (($email && strcasecmp($byCode->email, $email) === 0) || $sameName($byCode))) {
            return $byCode;
        }

        // Same email: no other employee code on the local account, or same name.
        $byEmail = $email ? User::where('email', $email)->first() : null;
        if ($byEmail && (!$byEmail->employee_code || $byEmail->employee_code === $code || $sameName($byEmail))) {
            return $byEmail;
        }

        return null;
    }

    /** Unique columns this write would take from another account (emails and employee codes are unique). */
    private function takenBy(?User $self, string $column, ?string $value): ?User
    {
        return $value ? User::where($column, $value)->when($self, fn ($q) => $q->whereKeyNot($self->id))->first() : null;
    }

    /**
     * Synchronize or create a local Welltrash User from HRIS user payload (on login).
     * Never fails on a clash: the HRIS credentials were already verified, so the person still gets in.
     */
    public function syncUserFromHrisData(array $hrisUser, ?string $plainPassword = null): User
    {
        $emp = $hrisUser['employee'] ?? null;
        $empCode = !empty($emp['employee_code']) ? trim($emp['employee_code']) : null;
        $email = !empty($hrisUser['email']) ? trim($hrisUser['email']) : null;
        $name = !empty($emp['full_name']) ? $emp['full_name'] : ($hrisUser['name'] ?? 'Petugas CleanUP');

        $user = $this->findLocalUser($empCode, $email, $name);

        // HRIS is the source of truth: access.level carries "superadmin" for root accounts, role the position level.
        $mappedRole = User::roleFromHris($hrisUser['access']['level'] ?? $hrisUser['role'] ?? null);

        if ($owner = $this->takenBy($user, 'email', $email)) {
            Log::warning("HRIS sync: email {$email} sudah dipakai akun #{$owner->id}, email lokal dipertahankan.");
            $email = null;
        }
        if ($owner = $this->takenBy($user, 'employee_code', $empCode)) {
            Log::warning("HRIS sync: kode {$empCode} sudah dipakai akun #{$owner->id} ({$owner->name}), kode tidak dipasang.");
            $empCode = $user?->employee_code;
        }

        $effectiveEmail = $email ?: ($user?->email ?: (strtolower($empCode ?: 'user' . Str::random(6)) . '@welltrash.id'));

        $isActive = isset($hrisUser['is_active']) ? (bool) $hrisUser['is_active'] : true;
        if ($emp && isset($emp['status']) && $emp['status'] !== 'active') {
            $isActive = false;
        }

        $data = [
            'name'          => $name,
            'email'         => $effectiveEmail,
            'employee_code' => $empCode,
            'division'      => $emp['division'] ?? null,
            'position'      => $emp['position'] ?? null,
            'role'          => $mappedRole,
            'is_active'     => $isActive,
        ];

        if ($plainPassword) {
            $data['password'] = Hash::make($plainPassword);
        } elseif (!$user) {
            $data['password'] = Hash::make('12345678');
        }

        if (!$user) {
            return User::create($data);
        }

        $user->update($data);
        return $user;
    }

    /**
     * Fetch active crew list from HRIS and synchronize all accounts to Welltrash.
     * All-or-nothing: rows that would clash with another account are skipped and reported, never half-written.
     *
     * @return array{total: int, synced: int, created: int, updated: int, deactivated: int, skipped: array, crew: array}
     */
    public function syncCrew(): array
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('HRIS API URL atau HRIS API KEY belum dikonfigurasi.');
        }

        $url = "{$this->baseUrl}/api/v1/internal/crew";

        // Older HRIS builds ignore include_inactive and only list active employees: then nobody is deactivated.
        $response = Http::withHeaders([
            'X-HRIS-KEY' => $this->apiKey,
            'Accept'     => 'application/json',
        ])->timeout(10)->get($url, ['include_inactive' => 1]);

        if (!$response->successful()) {
            throw new \RuntimeException("HRIS API mengembalikan status {$response->status()}: " . $response->body());
        }

        $crewList = $response->json('data');
        if (!is_array($crewList)) {
            throw new \RuntimeException('Respons HRIS tidak berisi daftar kru.');
        }

        return DB::transaction(function () use ($crewList) {
            $created = 0;
            $updated = 0;
            $deactivated = 0;
            $syncedDetails = [];
            $skipped = [];

            foreach ($crewList as $member) {
                $empCode = !empty($member['employee_code']) ? trim($member['employee_code']) : null;
                $email = !empty($member['email']) ? trim($member['email']) : null;
                $name = $member['name'] ?? 'Petugas';
                $employed = ($member['status'] ?? 'active') === 'active';
                // HRIS sends is_user_active=false for employees with no HRIS login; that is "no account there", not "blocked".
                $blockedInHris = ($member['has_user_account'] ?? true) && !($member['is_user_active'] ?? true);
                $isActive = $employed && !$blockedInHris;
                $role = User::roleFromHris($member['role'] ?? null);

                $existing = $this->findLocalUser($empCode, $email, $name);
                if (!$employed && !$existing) {
                    continue; // former employee without a Welltrash account: nothing to create
                }
                $effectiveEmail = $email ?: ($existing?->email ?: (strtolower($empCode ?: 'crew') . '@welltrash.id'));

                $clash = ($owner = $this->takenBy($existing, 'employee_code', $empCode))
                    ? "kode {$empCode} sudah dipakai akun lain ({$owner->name}, {$owner->email})"
                    : (($owner = $this->takenBy($existing, 'email', $effectiveEmail))
                        ? "email {$effectiveEmail} sudah dipakai akun lain ({$owner->name})"
                        : null);
                if ($clash) {
                    $skipped[] = ['employee_code' => $empCode, 'name' => $name, 'reason' => $clash];
                    continue;
                }

                $attributes = [
                    'name'          => $name,
                    'email'         => $effectiveEmail,
                    'employee_code' => $empCode,
                    'division'      => $member['division'] ?? null,
                    'position'      => $member['position'] ?? null,
                    'is_active'     => $isActive,
                ];

                if (!$existing) {
                    $attributes['role'] = $role;
                    $attributes['password'] = Hash::make('12345678');
                    $user = User::create($attributes);
                    $created++;
                    $action = 'created';
                } else {
                    // Older HRIS builds do not send "role": never downgrade an existing account on a missing value.
                    if (isset($member['role'])) {
                        $attributes['role'] = $role;
                    }
                    $wasActive = $existing->is_active !== false;
                    $existing->update($attributes);
                    $user = $existing;
                    $updated++;
                    $action = 'updated';
                    if ($wasActive && !$isActive) {
                        $user->tokens()->delete(); // app sessions end now; web sessions are stopped by RoleMiddleware
                        $deactivated++;
                    }
                }

                $syncedDetails[] = [
                    'id'            => $user->id,
                    'employee_code' => $user->employee_code,
                    'division'      => $user->division,
                    'position'      => $user->position,
                    'name'          => $user->name,
                    'email'         => $user->email,
                    'role'          => $user->role,
                    'is_active'     => $user->is_active,
                    'action'        => $action,
                ];
            }

            return [
                'total'   => count($crewList),
                'synced'  => $created + $updated,
                'created' => $created,
                'updated' => $updated,
                'deactivated' => $deactivated,
                'skipped' => $skipped,
                'crew'    => $syncedDetails,
            ];
        });
    }

    /**
     * Push one attendance row to HRIS. Idempotent on HRIS side (employee + date), so safe to resend.
     */
    public function pushAttendance(Attendance $attendance): bool
    {
        $empCode = $attendance->user?->employee_code;
        if (!$this->isConfigured() || empty($empCode)) {
            return false;
        }

        $photoUrl = fn (?string $path) => $path ? Storage::disk('public')->url($path) : null;

        try {
            $response = Http::withHeaders([
                'X-HRIS-KEY' => $this->apiKey,
                'Accept'     => 'application/json',
            ])->timeout($this->timeout)->post("{$this->baseUrl}/api/v1/internal/attendance", [
                'employee_code'   => $empCode,
                'date'            => $attendance->date->toDateString(),
                // Wall-clock Asia/Jakarta time, same convention as the date column.
                'clock_in_at'     => $attendance->clock_in_at?->toDateTimeString(),
                'clock_in_photo'  => $photoUrl($attendance->clock_in_photo),
                'clock_in_lat'    => $attendance->clock_in_lat,
                'clock_in_lng'    => $attendance->clock_in_lng,
                'clock_out_at'    => $attendance->clock_out_at?->toDateTimeString(),
                'clock_out_photo' => $photoUrl($attendance->clock_out_photo),
                'clock_out_lat'   => $attendance->clock_out_lat,
                'clock_out_lng'   => $attendance->clock_out_lng,
                'overtime_hours'  => (float) $attendance->overtime_hours,
            ]);

            if (!$response->successful()) {
                Log::warning("HrisService pushAttendance #{$attendance->id} gagal ({$response->status()}): " . $response->body());
            }
            return $response->successful();
        } catch (\Throwable $e) {
            Log::warning("HrisService pushAttendance #{$attendance->id} connection error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Push a reviewed izin/sakit request to HRIS. Idempotent per employee + date.
     */
    public function pushLeave(LeaveRequest $leave): bool
    {
        $empCode = $leave->user?->employee_code;
        if (!$this->isConfigured() || empty($empCode) || $leave->status === 'pending') {
            return false;
        }

        try {
            $response = Http::withHeaders([
                'X-HRIS-KEY' => $this->apiKey,
                'Accept'     => 'application/json',
            ])->timeout($this->timeout)->post("{$this->baseUrl}/api/v1/internal/leave", [
                'employee_code' => $empCode,
                'date'          => $leave->date->toDateString(),
                'type'          => $leave->type,
                'status'        => $leave->status,
                'reason'        => $leave->reason,
                'proof_url'     => $leave->proof_image ? Storage::disk('public')->url($leave->proof_image) : null,
            ]);

            // 409 = already clocked in that day; HRIS keeps the actual attendance, nothing to retry.
            if (!$response->successful() && $response->status() !== 409) {
                Log::warning("HrisService pushLeave #{$leave->id} gagal ({$response->status()}): " . $response->body());
            }
            return $response->successful() || $response->status() === 409;
        } catch (\Throwable $e) {
            Log::warning("HrisService pushLeave #{$leave->id} connection error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Push after the response is sent so a slow/down HRIS never blocks clock-in on the app.
     */
    public function pushAttendanceLater(Attendance $attendance): void
    {
        \Illuminate\Support\defer(fn () => $this->pushAttendance($attendance->fresh() ?? $attendance));
    }

    /**
     * One employee's monthly attendance recap and payroll slips from HRIS. Null when HRIS is unreachable.
     */
    public function fetchSelfService(string $employeeCode, string $month): ?array
    {
        if (!$this->isConfigured()) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'X-HRIS-KEY' => $this->apiKey,
                'Accept'     => 'application/json',
            ])->timeout($this->timeout)->get("{$this->baseUrl}/api/v1/internal/employees/" . rawurlencode($employeeCode) . '/self-service', ['month' => $month]);

            if (!$response->successful()) {
                Log::warning("HrisService fetchSelfService {$employeeCode} gagal ({$response->status()}): " . $response->body());
                return null;
            }
            return $response->json();
        } catch (\Throwable $e) {
            Log::warning("HrisService fetchSelfService {$employeeCode} connection error: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Retrieve employee detail from HRIS by identifier (ID or employee code).
     */
    public function fetchEmployee(string $identifier): ?array
    {
        if (!$this->isConfigured()) {
            return null;
        }

        try {
            $response = Http::withHeaders([
                'X-HRIS-KEY' => $this->apiKey,
                'Accept'     => 'application/json',
            ])->timeout($this->timeout)->get("{$this->baseUrl}/api/v1/internal/employees/{$identifier}");

            return $response->successful() ? $response->json('data') : null;
        } catch (\Throwable $e) {
            Log::warning("HrisService fetchEmployee error for {$identifier}: " . $e->getMessage());
            return null;
        }
    }
}
