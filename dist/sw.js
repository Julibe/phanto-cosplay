'use strict';

// Keep the server authoritative so an old catalog cannot survive a sprite migration.
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => new Response(
    '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Phanto’s Cosplay is offline</title><body style="background:#100b2d;color:#f3f9fe;font:1rem system-ui;padding:2rem"><h1>You’re offline</h1><p>Reconnect to load the Phanto and Berry galleries.</p><p><a style="color:#ff85ad" href="./">Try again</a></p></body></html>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  )));
});
