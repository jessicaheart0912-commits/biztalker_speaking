const CACHE_NAME = 'be-power1-v1';
const FILES = ['./','./index.html','./styles.css','./data.js','./app.js','./manifest.json'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(FILES)));
});
self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request).then(res => res || fetch(event.request)));
});