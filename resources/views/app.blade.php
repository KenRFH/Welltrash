<!DOCTYPE html>
<html lang="id">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @php
            // Per-page values come from the route ($meta); crawlers and link previews only see this server HTML.
            $meta = array_filter($meta ?? []) + [
                'title'       => 'Jasa Angkut Sampah Jember Terjadwal untuk Bisnis | WellTrash',
                'description' => 'Jasa angkut & pengelolaan sampah terjadwal di Jember untuk bisnis, institusi, hotel, rumah sakit, dan perumahan. Armada resmi dan laporan tonase transparan.',
                'image'       => asset('og-image.jpg'),
                'url'         => url()->current(),
                'type'        => 'website',
            ];
            $localBusiness = [
                '@context'   => 'https://schema.org',
                '@type'      => 'LocalBusiness',
                'name'       => 'WellTrash',
                'description'=> 'Jasa angkut dan pengelolaan sampah terjadwal di Kabupaten Jember.',
                'url'        => url('/'),
                'logo'       => asset('icons/icon-512x512.png'),
                'image'      => asset('og-image.jpg'),
                'telephone'  => '+62819848706',
                'email'      => 'new.welltrashjember@gmail.com',
                'priceRange' => 'Rp500.000 - Rp5.200.000',
                'address'    => [
                    '@type'           => 'PostalAddress',
                    'streetAddress'   => 'Baratan Wetan, Baratan, Kec. Patrang',
                    'addressLocality' => 'Jember',
                    'addressRegion'   => 'Jawa Timur',
                    'postalCode'      => '68100',
                    'addressCountry'  => 'ID',
                ],
                'areaServed' => ['@type' => 'AdministrativeArea', 'name' => 'Kabupaten Jember'],
            ];
        @endphp
        <title inertia>{{ $meta['title'] }}</title>
        <link rel="icon" href="/favicon.ico" type="image/png" sizes="32x32">
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png">
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png">

        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#0C3325">
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png">
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png">

        <!-- Google Fonts: DM Sans, DM Mono, Instrument Serif -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Instrument+Serif:ital@1&display=swap" rel="stylesheet">

        <!-- SEO -->
        <meta name="google-site-verification" content="7Dv7Uj6fl3SKyiRKsaJ0jVmXNE_O67duJakj-l7Wru8" />
        <meta name="description" content="{{ $meta['description'] }}">
        <link rel="canonical" href="{{ $meta['url'] }}">
        <meta property="og:type" content="{{ $meta['type'] }}">
        <meta property="og:site_name" content="WellTrash">
        <meta property="og:locale" content="id_ID">
        <meta property="og:title" content="{{ $meta['title'] }}">
        <meta property="og:description" content="{{ $meta['description'] }}">
        <meta property="og:url" content="{{ $meta['url'] }}">
        <meta property="og:image" content="{{ $meta['image'] }}">
        <meta name="twitter:card" content="summary_large_image">
        <script type="application/ld+json">{!! json_encode($localBusiness, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) !!}</script>

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
