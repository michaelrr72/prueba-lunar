/**
 * Service Worker · Prueba Lunar
 *
 * Estrategia:
 *  - Assets estáticos (CSS, JS, iconos, fuentes): cache-first → rápido y funciona offline.
 *  - Páginas HTML: network-first con fallback a caché → siempre intenta traer la última,
 *    pero si no hay red usa la versión cacheada (no deja al usuario tirado).
 *
 * Para forzar a todos los clientes a actualizar tras un cambio importante,
 * basta con cambiar CACHE_VERSION. El SW eliminará los caches antiguos al activarse.
 */

const CACHE_VERSION = 'v4.1.0-pwa1';
const CACHE_NAME = `prueba-lunar-${CACHE_VERSION}`;

// App-shell que precachamos en la instalación.
const PRECACHE_URLS = [
  './',
  './index.html',
  './solo.html',
  './supervisado.html',
  './cooperativo.html',
  './torneo.html',
  './manifest.json',
  './assets/icons/icon.svg',
  './assets/css/base.css',
  './assets/css/layout.css',
  './assets/css/components.css',
  './assets/css/modes.css',
  './assets/js/data.local.js',
  './assets/js/app.js',
  './assets/js/torneo.js',
  './assets/js/features/coop-mode.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        // Si un asset falla, no rompemos toda la instalación; cacheamos lo que se pueda.
        console.warn('[SW] Algunos assets no se precacharon:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;

  // Sólo manejamos GET; lo demás pasa directo a red.
  if (request.method !== 'GET') return;

  // Ignoramos peticiones cross-origin que no sean fuentes de Google (las cacheamos como bonus).
  const url = new URL(request.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFont = url.hostname.endsWith('fonts.googleapis.com')
                    || url.hostname.endsWith('fonts.gstatic.com');

  if (!isSameOrigin && !isGoogleFont) return;

  // Estrategia network-first para documentos HTML (para que las actualizaciones lleguen rápido).
  const isHTML = request.mode === 'navigate'
              || (request.destination === 'document')
              || request.headers.get('accept')?.includes('text/html');

  if (isHTML) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first para todo lo demás (CSS, JS, icono, fuentes).
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    // Cacheamos respuestas válidas (200) y opacas (Google Fonts las devuelve opacas).
    if (response && (response.status === 200 || response.type === 'opaque')) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Sin red y sin caché → respuesta vacía controlada en lugar de error de red.
    return new Response('', { status: 503, statusText: 'Sin conexión' });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Último recurso: intenta servir index.html (app-shell) para navegaciones.
    const shell = await caches.match('./index.html');
    if (shell) return shell;
    return new Response('Sin conexión y sin caché disponible.', {
      status: 503,
      statusText: 'Sin conexión'
    });
  }
}

// Permite forzar una actualización desde la página sin esperar al ciclo automático.
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
