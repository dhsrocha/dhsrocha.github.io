"use strict";
(function () {
  "use strict";
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
  );

  const CACHE = "cached-page";
  const offlineFallbackPage = "/index.html";

  // https://developers.google.com/web/tools/workbox/modules/workbox-sw
  workbox.loadModule("workbox-strategies");

  self.addEventListener("message", (event) => {
    // https://www.pwabuilder.com/serviceworker
    event.data && event.data.type === "SKIP_WAITING" && self.skipWaiting();
  });

  self.addEventListener("install", async (event) => {
    // https://www.pwabuilder.com/serviceworker
    event.waitUntil(
      caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
    );
  });

  if (workbox.navigationPreload.isSupported())
    workbox.navigationPreload.enable();

  self.addEventListener("fetch", (event) => {
    // https://www.pwabuilder.com/serviceworker
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            const preloadResp = await event.preloadResponse;
            if (preloadResp) return preloadResp;
            const networkResp = await fetch(event.request);
            return networkResp;
          } catch (error) {
            const cache = await caches.open(CACHE);
            const cachedResp = await cache.match(offlineFallbackPage);
            return cachedResp;
          }
        })()
      );
    }

    // https://developers.google.com/web/tools/workbox/modules/workbox-sw
    if (event.request.url.endsWith(".png")) {
      const cacheFirst = new strategies.CacheFirst();
      event.respondWith(cacheFirst.handle({ request: event.request }));
    }
  });
})();
