const CACHE_NAME = "eaint-portfolio-v5";
const SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./script.js",
  "./manifest.webmanifest",
  "./assets/eaint-mark.svg",
  "./assets/images/profile.webp",
  "./assets/images/hero-speaking.webp",
  "./assets/images/aun-certificate.webp",
  "./assets/images/environmental-campaign.webp",
  "./assets/images/youth-event.webp",
  "./assets/images/stakeholder-workshop.webp",
  "./assets/images/wetland-lab.webp",
  "./assets/images/research-team.webp",
  "./assets/showcase/thumbs/portfolio-01.webp",
  "./assets/showcase/thumbs/portfolio-02.webp",
  "./assets/showcase/thumbs/portfolio-05.webp",
  "./assets/showcase/thumbs/portfolio-18.webp",
  "./assets/showcase/thumbs/cv-01.webp",
  "./assets/showcase/thumbs/cv-02.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
