<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Jasa Penjemputan & Pengelolaan Sampah se Jember | Welltrash</title>
        <link rel="icon" href="/favicon.ico" type="image/png" sizes="32x32">
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png">

        <!-- PWA Manifest & Meta Tags -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#16A34A">
        <meta name="mobile-web-app-capable" content="yes">
        <meta name="application-name" content="WellTrash">

        <!-- Apple PWA Meta Tags -->
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="WellTrash">
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">

        <!-- SEO -->
        <meta name="google-site-verification" content="7Dv7Uj6fl3SKyiRKsaJ0jVmXNE_O67duJakj-l7Wru8" />
        <meta name="description" content="Layanan jasa pengangkutan sampah profesional dan terpercaya di Jember. Solusi kebersihan hemat & cepat untuk rumah tangga hingga bisnis. Pesan WellTrash sekarang!">
        <meta name="keywords" content="jasa pengangkutan sampah jember, jasa angkut sampah jember, buang sampah jember, pengelolaan limbah jember, welltrash">
        <link rel="canonical" href="https://welltrash.com/">

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
