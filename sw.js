/* MNnote+ service worker: يعمل التطبيق بدون إنترنت */
const VER = "mnnote-v2";
const SHELL = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VER).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VER).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const isFont = /(^|\.)fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  // لا نلمس أي طلب خارجي آخر (مثل Gemini)
  if (url.origin !== location.origin && !isFont) return;

  // الصفحة: الأحدث من الشبكة إن توفرت (مهلة 4 ثوانٍ) وإلا النسخة المخزنة
  if (req.mode === "navigate") {
    e.respondWith((async () => {
      const c = await caches.open(VER);
      try {
        const r = await Promise.race([fetch(req), new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 4000))]);
        if (r && r.ok) c.put("./index.html", r.clone());
        return r;
      } catch (err) {
        return (await c.match("./index.html")) || (await c.match("./")) || Response.error();
      }
    })());
    return;
  }

  // باقي الملفات والخطوط: من المخزن فوراً مع تحديثه في الخلفية
  e.respondWith((async () => {
    const c = await caches.open(VER);
    const hit = await c.match(req, { ignoreSearch: url.origin === location.origin });
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === "opaque")) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || Response.error();
  })());
});
