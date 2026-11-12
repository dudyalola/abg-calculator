/* Caches the shell, the ABG calculator (abg/) and preop (preop/) so they open
   with no signal. The calendar (../opd-calendar/) sits outside this scope and
   is cached by its own service worker, which registers the first time the
   shell loads it.
   Pages are network-first (a new version lands on the next launch with signal),
   keyed by their own URL so abg/ and preop/ never overwrite the shell.
   Bump CACHE whenever the asset list changes. */
const CACHE = "abg-v3";
const ASSETS = ["./", "./preop/", "./abg/", "./manifest.webmanifest",
                "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png",
                "./abg/manifest.webmanifest", "./abg/icon-192.png", "./abg/icon-512.png"];

/* Every app on dudyalola.github.io shares one cache store, so clear only our
   own old versions — never another app's cache. */
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k.startsWith("abg-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

/* "./" and "./index.html" are the same page; so are "abg/" and "abg/index.html" */
function key(url) {
  const u = new URL(url);
  u.search = ""; u.hash = "";
  if (u.pathname.endsWith("/index.html")) u.pathname = u.pathname.slice(0, -"index.html".length);
  return u.href;
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;

  const isPage = req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html");
  if (isPage) {
    e.respondWith(
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(key(req.url), copy)).catch(() => {}); }
        return res;
      }).catch(() => caches.match(key(req.url)))
    );
    return;
  }
  e.respondWith(
    caches.match(req, { ignoreSearch: true }).then(hit => hit ||
      fetch(req).then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {}); }
        return res;
      }))
  );
});
