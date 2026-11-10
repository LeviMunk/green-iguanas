/* Phase 1 PWA: app-shell caching only. Never cache authenticated API traffic. */
const CACHE = 'green-iguanas-shell-v3';
/* GENERATED_PRECACHE */
const SCOPE = self.registration.scope;
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll((typeof PRECACHE !== 'undefined' ? PRECACHE : ['index.html','manifest.webmanifest']).map(path => new URL(path, SCOPE).href))));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('green-iguanas-') && key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode === 'navigate' && new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(SCOPE)) return;
  if (/\/api\/|\/auth\/|supabase|\/private\//.test(url.pathname)) return;
  // Network first for HTML; stale shell only while offline. Asset cache is same-origin public data only.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy)); }
      return response;
    }).catch(() => caches.match(request).then(r => r || caches.match(SCOPE))));
  } else {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
      if (response.ok && (url.pathname.match(/\.(js|css|png|svg|woff2|webp)$/))) {
        const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(request, copy));
      }
      return response;
    })));
  }
});
