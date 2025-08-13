
self.addEventListener('install', e=>self.skipWaiting());
self.addEventListener('activate', e=>clients.claim());
self.addEventListener('fetch', e=>{
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/orders')) {
    const body = JSON.stringify({ items:[
      { id:'INV-2025', date:'2025-08-01' },
      { id:'INV-2042', date:'2025-08-02' }
    ]});
    e.respondWith(new Response(body, {status:200, headers:{'content-type':'application/json'}}));
    return;
  }
  if (url.pathname.startsWith('/api/feed')) {
    const big = JSON.stringify({ blob: 'x'.repeat(1024*256) });
    e.respondWith(new Response(big, {status:200, headers:{'content-type':'application/json'}}));
    return;
  }
});
