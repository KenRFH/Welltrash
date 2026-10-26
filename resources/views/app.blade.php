<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>Jasa Penjemputan & Pengelolaan Sampah se Jember | Welltrash</title>
        <link rel="icon" href="/favicon.ico" type="image/png" sizes="32x32">
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png">

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- PWA Manifest & Meta Tags -->
        <link rel="manifest" href="/manifest.json">
        <meta name="theme-color" content="#0C3325">
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

        <!-- Google Fonts: DM Sans, DM Mono, Instrument Serif -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet">

        <!-- SEO -->
        <meta name="google-site-verification" content="7Dv7Uj6fl3SKyiRKsaJ0jVmXNE_O67duJakj-l7Wru8" />
        <meta name="description" content="Layanan jasa pengangkutan dan pengelolaan sampah terjadwal untuk perusahaan dan institusi di Kabupaten Jember dengan pencatatan transparan.">
        <meta name="keywords" content="jasa pengangkutan sampah jember, pengelolaan limbah bisnis jember, b2b waste management jember, welltrash">
        <link rel="canonical" href="https://welltrash.com/">

        <!-- Theme Initialization Script (prevents theme flicker) -->
        <script>
            (function () {
                try {
                    var theme = localStorage.getItem('theme');
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    if (theme === 'dark' || (!theme && prefersDark)) {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {}
            })();
        </script>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-150">
        @inertia
    </body>
</html>
