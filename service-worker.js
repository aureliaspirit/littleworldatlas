const CACHE_NAME = "little-world-atlas-v0-3-0";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=0.3.0",
  "./app.js?v=0.3.0",
  "./manifest.json?v=0.3.0",
  "./icons/icon-120.png",
  "./icons/icon-152.png",
  "./icons/icon-167.png",
  "./icons/icon-180.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

const SCENE_ASSETS = [
  "./assets/house/house-overview.jpg",
  "./assets/heartlight-land/heartlight-overview.jpg?v=0.3.0"
];

const RUNTIME_IMAGE_PATHS = [
  "/assets/house/",
  "/assets/heartlight-land/"
];

const CORE_URLS = new Set(CORE_ASSETS.map((asset) => new URL(asset, self.location.href).href));
const SCENE_URLS = new Set(SCENE_ASSETS.map((asset) => new URL(asset, self.location.href).href));

function isAtlasImage(url) {
  return url.origin === self.location.origin
    && RUNTIME_IMAGE_PATHS.some((path) => url.pathname.endsWith(path) || url.pathname.includes(path));
}

async function cacheCoreAssets() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(CORE_ASSETS);
}

async function cacheSceneAssets() {
  const cache = await caches.open(CACHE_NAME);
  await Promise.allSettled(SCENE_ASSETS.map((asset) => cache.add(asset)));
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("install", (event) => {
  event.waitUntil(cacheCoreAssets());
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
      .then(() => cacheSceneAssets())
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

  if (CORE_URLS.has(url.href) || SCENE_URLS.has(url.href) || isAtlasImage(url)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
  }
});
