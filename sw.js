self.addEventListener('install', e=>{
  e.waitUntil(caches.open('dv-v1').then(c=>c.addAll([
    '/', '/index.html', '/assets/styles.css', '/assets/app.js',
    '/assets/images/logo.svg', '/data/settings.json','/data/events.json','/data/blog.json','/data/shop.json','/data/timeline.json'
  ])));
});
self.addEventListener('fetch', e=>{ e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request))); });