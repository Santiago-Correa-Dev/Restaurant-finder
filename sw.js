//Register Service Worker and cache files to be offline
self.addEventListener("install", event => {
  //Upload Service Workers faster
  self.skipWaiting();
  //Files to cache
  let urlsToCache = [
    ".",
    "/index.html",
    "/css/styles.css",
    "/restaurant.html",
    "/data/restaurants.json",
    "/js/dbhelper.js",
    "/js/main.js",
    "/js/restaurant_info.js"
  ];
  // Cache all files and add a no-cors to get google maps with no issues
  event.waitUntil(
    caches.open("static-v2").then(cache => {
      return cache.addAll(
        urlsToCache.map(url => {
          return new Request(url, { mode: "no-cors" });
        })
      );
    })
  );
});
//Get most updated cached info
self.addEventListener("activate", function(event) {
  event.waitUntil(caches.delete("static-v1"));
});
//Return files that are cached or through network if network is available
self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return (
        resp ||
        fetch(event.request).then(function(response) {
          return caches.open("static-v2").then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      );
    })
  );
});
