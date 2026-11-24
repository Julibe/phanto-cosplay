'use strict';

// Offline fallback matches the app: animated colored backdrop, translucent white glass, white text.
const offlinePage = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#1b1036"><title>Phanto’s Cosplay is offline</title><style>
html,body{margin:0;min-height:100dvh}
body{isolation:isolate;display:grid;place-items:center;padding:2rem;box-sizing:border-box;background:#1b1036;color:#ffffffeb;font:1rem/1.6 system-ui,sans-serif;overflow:hidden}
body::before,body::after{content:"";position:fixed;inset:-14vmax;z-index:-1;pointer-events:none;background:radial-gradient(ellipse 39% 36% at 23% 36%,#e83a9766,transparent),radial-gradient(ellipse 44% 41% at 73% 38%,#2364e27d,transparent),radial-gradient(ellipse 45% 38% at 52% 73%,#743cadb8,transparent);animation:drift 16s ease-in-out infinite alternate}
body::after{background:radial-gradient(ellipse 46% 37% at 29% 67%,#295fd280,transparent),radial-gradient(ellipse 39% 35% at 74% 30%,#e443a75e,transparent),radial-gradient(ellipse 37% 40% at 64% 73%,#733fa3b0,transparent);opacity:.38;animation:shift 19s ease-in-out infinite alternate}
@keyframes drift{from{transform:translate3d(-8%,-5%,0) rotate(-6deg)}to{transform:translate3d(12%,9%,0) rotate(14deg)}}
@keyframes shift{from{opacity:.05;transform:translate3d(11%,-8%,0) rotate(11deg)}to{opacity:.92;transform:translate3d(-12%,8%,0) rotate(-10deg)}}
main{width:100%;padding:2rem;box-sizing:border-box;border:1px solid #ffffff35;border-radius:28px;background:linear-gradient(165deg,#ffffff19,#ffffff12 70%);-webkit-backdrop-filter:blur(56px) saturate(160%);backdrop-filter:blur(56px) saturate(160%);box-shadow:inset 0 1px #ffffff1a;text-align:center}
h1{margin:0 0 .5rem;font-size:clamp(1.6rem,5vw,2.6rem)}
p{margin:.5rem 0;color:#ffffffc4}
a{display:inline-block;margin-top:1rem;padding:.7rem 1.4rem;border:1px solid #ffffff35;border-radius:999px;background:#ffffff1f;color:#ffffffe6;text-decoration:none}
a:hover,a:focus-visible{background:#ffffff3d;border-color:#ffffffe6;outline:none}
@media (prefers-reduced-motion:reduce){body::before,body::after{animation-duration:60s}}
@media (forced-colors:active){body::before,body::after{display:none}main{border-color:CanvasText}}
</style><body><main><h1>You’re offline</h1><p>Reconnect to load the Phanto and Berry galleries.</p><a href="./">Try again</a></main></body></html>`;

// Keep the server authoritative so an old catalog cannot survive a sprite migration.
self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(fetch(event.request).catch(() => new Response(offlinePage,
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } }
  )));
});
