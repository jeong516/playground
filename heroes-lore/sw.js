// 영웅서기: 솔티아의 바람 — PWA Service Worker (v20)
const CACHE_NAME = 'heroes-lore-pwa-v20';
const PRECACHE_URLS = [
  './',
  './index.html',
  './style.css?v=20',
  './manifest.json?v=20',
  './js/audio.js?v=20',
  './js/sprites.js?v=20',
  './js/data.js?v=20',
  './js/story.js?v=20',
  './js/expansion.js?v=20',
  './js/monsters.js?v=20',
  './js/game.js?v=20',
  './assets/icon-180.png',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon-512-maskable.png',
  './assets/title_bg.webp',
  './assets/portrait_knight.webp',
  './assets/portrait_mage.webp',
  './assets/portrait_rogue.webp',
  './assets/sheet_knight.webp',
  './assets/sheet_mage.webp',
  './assets/sheet_rogue.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Static images: Cache-First for instant native launch
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // App shell (HTML / CSS / JS / manifest): Network-First so new updates apply immediately, with offline fallback
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((m) => m || caches.match('./index.html')))
  );
});
