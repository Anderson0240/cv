const CACHE_NAME = 'ah-tech-news-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/noticias.html',
    '/tienda.html',
    '/css/styles.css',
    '/css/noticias.css',
    '/js/noticias.js',
    '/img/noticias/ia-avances.jpg',
    '/img/noticias/web-dev.jpg',
    '/img/noticias/cybersecurity.jpg',
    '/img/noticias/mobile-dev.jpg',
    '/img/logo.png',
    '/img/icons/icon-192x192.png',
    '/img/icons/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js',
    'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.7.0/dist/vanilla-tilt.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activación y limpieza de caches antiguos
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Estrategia de cache: Network First, fallback to Cache
self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si la respuesta es válida, la guardamos en cache
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                // Si falla la red, intentamos recuperar de cache
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }
                        // Si no está en cache y es una página, devolvemos la página offline
                        if (event.request.mode === 'navigate') {
                            return caches.match('/offline.html');
                        }
                        return new Response('Sin conexión', {
                            status: 503,
                            statusText: 'Service Unavailable'
                        });
                    });
            })
    );
}); 