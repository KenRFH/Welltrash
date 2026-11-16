<?php

namespace App\Services;

use App\Models\PushDevice;
use App\Models\User;
use App\Notifications\AppNotice;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * Notifies users: an entry in the app's bell (always), plus a phone push via FCM HTTP v1 to Firebase
 * Installation IDs ("fid" target). The push is best effort: a failure is logged and never breaks the
 * action that triggered it.
 */
class FcmService
{
    private ?array $account = null;

    public function isConfigured(): bool
    {
        return $this->account() !== null;
    }

    /** Send to every active user holding one of $roles (e.g. User::OPS_ROLES). Returns devices reached. */
    public function toRoles(array $roles, string $title, string $body, array $data = []): int
    {
        $ids = User::whereIn('role', $roles)->where(fn ($q) => $q->where('is_active', true)->orWhereNull('is_active'))->pluck('id');

        return $this->toUsers($ids->all(), $title, $body, $data);
    }

    public function toUsers(array $userIds, string $title, string $body, array $data = []): int
    {
        if (!$userIds) {
            return 0;
        }

        // Bell first: kept even without Firebase, a registered phone, or network.
        Notification::send(User::whereIn('id', $userIds)->get(), new AppNotice($title, $body, $data));

        if (!$this->isConfigured()) {
            return 0;
        }

        $sent = 0;
        foreach (PushDevice::whereIn('user_id', $userIds)->get() as $device) {
            $sent += $this->send($device, $title, $body, $data) ? 1 : 0;
        }

        return $sent;
    }

    private function send(PushDevice $device, string $title, string $body, array $data): bool
    {
        try {
            $res = Http::withToken($this->accessToken())->timeout(10)
                ->post("https://fcm.googleapis.com/v1/projects/{$this->account()['project_id']}/messages:send", [
                    'message' => [
                        'fid'          => $device->fid,
                        'notification' => ['title' => $title, 'body' => $body],
                        // FCM data values must be strings.
                        'data'         => array_map('strval', $data),
                        'android'      => ['priority' => 'high'],
                    ],
                ]);
        } catch (\Throwable $e) {
            Log::warning("FCM: gagal kirim ke device #{$device->id}: {$e->getMessage()}");
            return false;
        }

        if ($res->successful()) {
            return true;
        }

        // App uninstalled or installation deleted: this target will never work again.
        $status = $res->json('error.status');
        if ($res->status() === 404 || in_array($status, ['NOT_FOUND', 'UNREGISTERED'], true)) {
            $device->delete();
        } elseif ($res->status() === 401) {
            Cache::forget($this->cacheKey());
        }
        Log::warning("FCM: {$res->status()} {$status} untuk device #{$device->id}: " . $res->json('error.message'));

        return false;
    }

    /** OAuth2 access token from the service account (JWT bearer grant), cached a bit under its 1h lifetime. */
    private function accessToken(): string
    {
        return Cache::remember($this->cacheKey(), now()->addMinutes(50), function () {
            $sa = $this->account();
            $b64 = fn (string $v) => rtrim(strtr(base64_encode($v), '+/', '-_'), '=');
            $now = time();
            $unsigned = $b64(json_encode(['alg' => 'RS256', 'typ' => 'JWT'])) . '.' . $b64(json_encode([
                'iss'   => $sa['client_email'],
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud'   => $sa['token_uri'],
                'iat'   => $now,
                'exp'   => $now + 3600,
            ]));
            if (!openssl_sign($unsigned, $signature, $sa['private_key'], 'sha256WithRSAEncryption')) {
                throw new \RuntimeException('FCM: private key service account tidak valid.');
            }

            return Http::asForm()->timeout(10)->post($sa['token_uri'], [
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion'  => $unsigned . '.' . $b64($signature),
            ])->throw()->json('access_token');
        });
    }

    private function cacheKey(): string
    {
        return 'fcm:access-token:' . ($this->account()['private_key_id'] ?? '');
    }

    private function account(): ?array
    {
        if ($this->account === null) {
            $path = config('services.fcm.credentials');
            $json = $path && is_readable($path) ? json_decode((string) file_get_contents($path), true) : null;
            $this->account = is_array($json) && isset($json['client_email'], $json['private_key'], $json['project_id']) ? $json : [];
        }

        return $this->account ?: null;
    }
}
