# The app at /app

`plutto.space/app` is the phone app itself, built for the browser — not a
second implementation of it. The same App.js, the same screens, the same
ChatPanel and voice modes, the same catalog: what the phone shows is what the
browser shows, because it is the same code.

## Where it comes from

The build lives in the app repo, `Plutto-Frontend`:

```
cd Plutto-Frontend
node scripts/build-web.mjs --out ../plutto-web/public/m
```

That runs `expo export --platform web`, places CanvasKit (Skia's wasm) next to
the bundle, wraps the page in the phone-shaped stage for wide screens, and
copies the result into `public/m` here. Commit `public/m` with the site: Vercel
builds only this repo, so the app has to arrive as files.

`next.config.mjs` rewrites `/app` to `/m/index.html` (before any route can
shadow it), and every asset URL inside the bundle already begins with `/m`
(`experiments.baseUrl` in the app's `app.json`).

## What differs from the phone, and only this

Metro swaps a few native-only packages for browser shims when the platform is
`web` (`Plutto-Frontend/metro.config.js` → `src/web/shims`): WebRTC is the
browser's own; the Supabase session sits in localStorage; Google sign-in is the
Supabase redirect; push, OTA, Apple sign-in, alternate icons and the in-call
audio router are quiet no-ops; purchases go through Paddle (the catalog's
`subscription.paddle`) with RevenueCat still the entitlement brain, read from
the API's /billing/entitlement.

The app fills the window on every screen. On a phone it is the page at the
phone's own size. On anything larger it is laid out at a logical size and
scaled up by a ratio taken from the screen (the smaller of width/1100 and
height/700, between 1 and 1.6), so a desktop gets the whole app, edge to edge,
with its type, spacing and cards at a size that suits a desktop. The app reads
its size once at startup, so that ratio is applied before the bundle runs (see
`STAGE` in `build-web.mjs`).

## Updating

Any app change that should reach the browser is a rebuild and a commit of
`public/m`. The bundle's filename carries a hash, so old and new never collide.
