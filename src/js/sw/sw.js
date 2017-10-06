const cacheName = 'storm-scaffold';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/static/css/styles.css',
        'static/js/app.js'
      ]).then(() => self.skipWaiting());
    })
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(res => {
        return res || fetch(event.request)
      });
    })
  );
});