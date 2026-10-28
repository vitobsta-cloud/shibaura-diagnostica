// Cache solo la "shell" dell'app; i PDF restano sempre online
// v56: la pagina viene SEMPRE richiesta alla rete (no-store), la copia salvata serve solo offline
const CACHE='shibaura-scara-v56';
const SHELL=['./index.html','./manifest.json','./icon-192.png','./icon-512.png','./pdfjs/pdf.min.js','./pdfjs/pdf.worker.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(SHELL.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin||u.pathname.includes('/pdf/'))return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c));}return r;}).catch(()=>caches.match(e.request).then(m=>m||Response.error())));
});
