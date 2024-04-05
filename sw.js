const CACHE_NAME = "static_cache"
const STATIC_ASSETS = [
    '/index.html',
    '/style.css',
    '/questions.js',
    '/script.js'
]

async function precache () {
    const cache = await caches.open(CACHE_NAME)
    return cache.addAll(STATIC_ASSETS)

}

self.addEventListener('install', event => {
console.log("[SW] installed");
self.skipwaiting()
event.waitUntil(precache())
})

async function cleanup() {
   const keys = await caches.keys()
   const keysToDelete = keys.map(key => {
   if (key !== CACHE_NAME) {
    return caches.delete (key)
   }
})

return Promise.all (keysToDelete)

}


self.addEventListener('active', event => {
    console.log("[SW] active");
    event.waitUntil(cleanupCache())
})

async function fetchAssets(event) {
    try {
const response = await fetch(event.request)
return response

} catch (err) {
    const cache = await caches.open(CACHE_NAME)
    return cache.match(event.request)
}
}

self.addEventListener('fetch', event => {
    console.log("[SW] fetched");
    event.respondWith(fetchAssets(event))
})