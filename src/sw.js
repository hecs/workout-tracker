const CACHE_VERSION = '1';
const CACHE_NAME = `cindy-v${CACHE_VERSION}`;

// Install event - take over immediately
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// Activate event - clean old caches and claim clients immediately
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
        })
    );
    self.clients.claim();
});

// Message event - handle update requests from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
});

// Fetch event - Network first for HTML/JS/CSS, cache first for static assets
self.addEventListener('fetch', (event) => {
    // For HTML, JS, CSS - try network first
    if (event.request.destination === 'document' || 
        event.request.url.includes('.js') || 
        event.request.url.includes('.css') ||
        event.request.url.includes('.json')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
    } else {
        // For other assets - cache first
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                });
            })
        );
    }
});
