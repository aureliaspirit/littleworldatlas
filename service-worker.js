const CACHE_NAME = "little-world-atlas-v0-2-1";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=0.2.1",
  "./app.js?v=0.2.1",
  "./manifest.json?v=0.2.1",
  "./icons/icon-120.png",
  "./icons/icon-152.png",
  "./icons/icon-167.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];
const CORE_URLS = new Set(CORE_ASSETS.map((asset) => new URL(asset, self.location.href).href));

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key.startsWith("little-world-atlas-") && key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request).catch(() => caches.match("./index.html")));
    return;
  }

  if (url.origin === self.location.origin && CORE_URLS.has(url.href)) {
    event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
