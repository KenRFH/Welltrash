<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
     * Synchronize or create a local Welltrash User from HRIS user payload.
     */
    public function syncUserFromHrisData(array $hrisUser, ?string $plainPassword = null): User
    {
        $emp = $hrisUser['employee'] ?? null;
        $empCode = !empty($emp['employee_code']) ? trim($emp['employee_code']) : null;
        $email = !empty($hrisUser['email']) ? trim($hrisUser['email']) : null;

        $user = null;
        if (!empty($empCode)) {
            $user = User::where('employee_code', $empCode)->first();
        }
        if (!$user && !empty($email)) {
            $user = User::where('email', $email)->first();
        }

        $hrisRole = strtolower($hrisUser['role'] ?? 'cleanup');
        $mappedRole = match ($hrisRole) {
            'director', 'coordinator' => 'admin',
            default                   => 'CleanUP',
        };

        if ($user && in_array($user->role, ['admin', 'superadmin', 'web_admin']) && $mappedRole === 'CleanUP') {
            $mappedRole = $user->role;
        }

        $effectiveEmail = $email ?: ($user?->email ?: (strtolower($empCode ?: 'user') . '@welltrash.id'));
        $name = !empty($emp['full_name']) ? $emp['full_name'] : ($hrisUser['name'] ?? 'Petugas CleanUP');

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
     *
     * @return array{total: int, synced: int, created: int, updated: int, crew: array}
     */
    public function syncCrew(): array
    {
        if (!$this->isConfigured()) {
            throw new \RuntimeException('HRIS API URL atau HRIS API KEY belum dikonfigurasi.');
        }

        $url = "{$this->baseUrl}/api/v1/internal/crew";

        $response = Http::withHeaders([
            'X-HRIS-KEY' => $this->apiKey,
            'Accept'     => 'application/json',
        ])->timeout(10)->get($url);

        if (!$response->successful()) {
            throw new \RuntimeException("HRIS API mengembalikan status {$response->status()}: " . $response->body());
        }

        $crewList = $response->json('data') ?? [];
        $created = 0;
        $updated = 0;
        $synced = 0;
        $syncedDetails = [];

        foreach ($crewList as $member) {
            $empCode = !empty($member['employee_code']) ? trim($member['employee_code']) : null;
            $email = !empty($member['email']) ? trim($member['email']) : null;
            $name = $member['name'] ?? 'Petugas';
            $isActive = (bool) ($member['is_user_active'] ?? true);

            $pos = strtolower($member['position'] ?? '');
            $div = strtolower($member['division'] ?? '');

            $role = 'CleanUP';
            if (str_contains($pos, 'direktur') || str_contains($div, 'manajemen') || str_contains($pos, 'koordinator')) {
                $role = 'admin';
            }

            $existing = null;
            if ($empCode) {
                $existing = User::where('employee_code', $empCode)->first();
            }
            if (!$existing && $email) {
                $existing = User::where('email', $email)->first();
            }

            $effectiveEmail = $email ?: ($existing?->email ?: (strtolower($empCode ?: 'crew') . '@welltrash.id'));

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
                if ($role === 'admin' && $existing->role !== 'admin') {
                    $attributes['role'] = 'admin';
                }
                $existing->update($attributes);
                $user = $existing;
                $updated++;
                $action = 'updated';
            }

            $synced++;
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
            'synced'  => $synced,
            'created' => $created,
            'updated' => $updated,
            'crew'    => $syncedDetails,
        ];
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
