<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Exceptions\PostTooLargeException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (PostTooLargeException $e, $request) {
            $raw = ini_get('upload_max_filesize') ?: '10M';
            $unit = strtoupper(substr($raw, -1));
            $value = (float) $raw;
            $bytes = match($unit) {
                'G' => $value * 1024 * 1024 * 1024,
                'M' => $value * 1024 * 1024,
                'K' => $value * 1024,
                default => $value,
            };
            $maxMb = round($bytes / 1024 / 1024);
            return back()->with('error', "Foto terlalu besar! Maksimal upload adalah {$maxMb}MB. Harap kompres foto sebelum mengunggah.");
        });
    })->create();
