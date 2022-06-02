const CACHE_NAME = "v1";
const assets = ["/"];
const self = this;
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(assets);
    })
  );
});
self.addEventListener("activate", (event) => {
  console.log(navigator.onLine);
  event.waitUntil(
    caches.keys().then((keys) => {
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    })
  );
  console.log("active");
});
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("http://localhost:3000/")) {
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, res.clone());
            return res;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cacheRes) => cacheRes);
        })
    );
  }
  if (event.request.url.includes("http://localhost:3010/src/uploads")) {
    event.respondWith(
      caches.match(event.request).then(
        (cacheRes) =>
          cacheRes ||
          fetch(event.request).then((res) => {
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request.url, res.clone());
              return res;
            });
          })
      )
    );
  }
});
