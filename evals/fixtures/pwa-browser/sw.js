const PREFIX = 'pwa-fixture-';
const CACHE = PREFIX + '__VERSION__';
const PUBLIC = ['/app/offline.html', '/app/static.123.css'];
self.addEventListener('install', event => event.waitUntil((async () => {
  const responses = await Promise.all(PUBLIC.map(async url => {
    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok || response.redirected || response.headers.get('X-Fixture-Public') !== 'yes') throw new Error('Unsafe public response');
    return response;
  }));
  const cache = await caches.open(CACHE);
  await Promise.all(PUBLIC.map((url, index) => cache.put(url, responses[index])));
})()));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))))));
self.addEventListener('message', event => { if (event.data === 'activate') self.skipWaiting(); if (event.data === 'version' && event.ports[0]) event.ports[0].postMessage(CACHE); });
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.open(CACHE)).match('/app/offline.html')));
  } else if (PUBLIC.includes(url.pathname) && !url.search) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(request)).then(found => found || fetch(request)));
  }
});
