/* Personal Organiser offline helper (service worker).
 *
 * Put this file in the SAME folder as Personal-Organiser.html on your web host.
 * The page registers it automatically. It keeps a copy of the app on the device so the
 * installed app opens without an internet connection. Your tasks are stored separately in
 * the browser and are never sent anywhere.
 *
 * Strategy: show the saved copy straight away (works offline), and quietly fetch a fresh
 * copy in the background when online, so an updated app appears on the next launch.
 */
'use strict';
var CACHE = 'personal-organiser-local-v1';

// The page passes its own address (?page=...) so it can be saved during installation.
var PAGE = new URL(self.location.href).searchParams.get('page');

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      if (!PAGE) return null;
      return fetch(PAGE, { cache: 'reload', credentials: 'same-origin' }).then(function (r) { return save(cache, PAGE, r); });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) {
        return k.indexOf('personal-organiser-local-') === 0 && k !== CACHE;
      }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Browsers refuse to show a saved page that came from a redirect, so store a plain copy.
function plain(response) {
  if (!response.redirected) return Promise.resolve(response);
  return response.blob().then(function (body) {
    return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
  });
}

function save(cache, key, response) {
  if (!response || !response.ok || response.type !== 'basic') return Promise.resolve(response);
  return plain(response).then(function (r) { return cache.put(key, r.clone()).then(function () { return r; }); });
}

function refresh(cache, request) {
  return fetch(request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(function (response) {
    return save(cache, request.url.split('#')[0], response);
  });
}

// Clicking a reminder brings the app to the front (or opens it).
self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
    for (var i = 0; i < list.length; i++) if ('focus' in list[i]) return list[i].focus();
    return self.clients.openWindow(PAGE || self.registration.scope);
  }));
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Only the app page itself is cached (the app has no other files).
  var isPage = req.mode === 'navigate' || (PAGE && req.url.split('#')[0].split('?')[0] === PAGE);
  if (!isPage) return;
  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(req, { ignoreSearch: true }).then(function (saved) {
        var fresh = refresh(cache, req);
        if (saved) {
          event.waitUntil(fresh.catch(function () { /* offline: keep the saved copy */ }));
          return saved;
        }
        return fresh.catch(function () {
          return PAGE ? cache.match(PAGE) : undefined;
        }).then(function (r) {
          return r || new Response('Personal Organiser is offline and has not been saved on this device yet. Open it once while online.',
            { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        });
      });
    })
  );
});
