<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', '') }}</title>
        <link rel="icon" href="favicon.ico" type="image/png" sizes="32x32">
        <meta name="google-site-verification" content="7Dv7Uj6fl3SKyiRKsaJ0jVmXNE_O67duJakj-l7Wru8" />
        <meta name="description" content="Layanan jasa angkut sampah Jember cepat dan terpercaya untuk rumah tangga dan bisnis.">
        <link rel="canonical" href="https://welltrash.com/jasa-angkut-sampah-jember">
        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
