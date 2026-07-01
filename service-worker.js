const cacheName = "oenova-v30";
const cachedFiles = [
  "./",
  "./index.html",
  "./app.html",
  "./styles.css",
  "./cloud-config-loader.js",
  "./cloud-config.example.js",
  "./src/shared-helpers.js",
  "./src/auth-client.js",
  "./src/landing-auth.js",
  "./app.js",
  "./manifest.webmanifest",
  "./icon.svg"
];

const networkFirstUrls = new Set([
  new URL("./", self.location.href).pathname,
  new URL("./index.html", self.location.href).pathname,
  new URL("./app.html", self.location.href).pathname,
  new URL("./app.js", self.location.href).pathname,
  new URL("./styles.css", self.location.href).pathname,
  new URL("./cloud-config-loader.js", self.location.href).pathname,
  new URL("./src/shared-helpers.js", self.location.href).pathname,
  new URL("./src/auth-client.js", self.location.href).pathname,
  new URL("./src/landing-auth.js", self.location.href).pathname,
  new URL("./service-worker.js", self.location.href).pathname
]);

async function addFileToCache(cache, file) {
  try {
    const response = await fetch(file, { cache: "reload" });
    if (response.ok) await cache.put(file, response);
  } catch {
    // Optional assets must not block service worker installation.
  }
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) =>
      Promise.all(cachedFiles.map((file) => addFileToCache(cache, file)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== cacheName).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

async function cacheOkResponse(request, response) {
  if (response?.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) return cacheOkResponse(request, response);
    const cached = await caches.match(request);
    return cached || response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") return caches.match("./index.html");
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    return response.ok ? cacheOkResponse(request, response) : response;
  } catch {
    return Response.error();
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const shouldUseNetworkFirst = event.request.mode === "navigate"
    || networkFirstUrls.has(requestUrl.pathname);

  event.respondWith(shouldUseNetworkFirst ? networkFirst(event.request) : cacheFirst(event.request));
});
