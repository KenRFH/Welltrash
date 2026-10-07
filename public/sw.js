const CACHE_NAME = 'welltrash-pwa-v1.1';

const PRECACHE_ASSETS = [
    '/offline.html',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png',
    '/icons/apple-touch-icon.png',
    '/icons/icon-maskable-192x192.png',
    '/icons/icon-maskable-512x512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        }).then(() => {
            return self.skipWaiting();
        })
    );
});

// Activate Event - Clean up outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Ignore non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    const url = new URL(request.url);

    // Only handle requests from the same origin
    if (url.origin !== self.location.origin) {
        return;
    }

    // Navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => {
                return caches.match('/offline.html');
            })
        );
        return;
    }

    // Immutable Vite build assets (/build/assets/...) — Cache First, no background refetch flooding
    if (url.pathname.startsWith('/build/')) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return networkResponse;
                });
            })
        );
        return;
    }

    // Static assets caching (images, fonts, build assets, icons)
    const isStaticAsset =
        url.pathname.startsWith('/icons/') ||
        url.pathname.startsWith('/images/') ||
        url.pathname.endsWith('.ico') ||
        url.pathname.endsWith('.png') ||
        url.pathname.endsWith('.webp') ||
        url.pathname.endsWith('.svg') ||
        url.pathname.endsWith('.woff2');

    if (isStaticAsset) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // If not in cache, fetch from network and cache
                return fetch(request).then((networkResponse) => {
                    if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                        return networkResponse;
                    }

                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseToCache);
                    });

                    return networkResponse;
                });
            })
        );
        return;
    }

    // Default network-first behavior
    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request);
        })
    );
});

// Listen for messages from client (e.g. skipWaiting)
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
