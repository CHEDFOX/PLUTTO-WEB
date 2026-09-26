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

On a computer (a window at least 1024px wide) the page is drawn at 80%, so
type, controls and gaps are desktop-sized rather than phone-sized, and the app
fills the whole window. Its content sits in a centred column (1200 of its own
pixels, 960 real ones) that the app treats as its screen width, so wheels,
cards and lines keep their designed proportions instead of stretching across a
monitor. Full-screen views are mounted on the page itself, not the column:
readings, the voice screen and the paywall's dimming reach the window's
edges, and `src/render/webStage.js` centres their content. The paywall is a
small card there, not a full screen. Below 1024px the app is the page, unscaled.
The browser's focus outline on inputs is switched off.

The zoom, the column and the 1024px threshold are the constants at the top of
`Plutto-Frontend/scripts/build-web.mjs`.

## Updating

Any app change that should reach the browser is a rebuild and a commit of
`public/m`. The bundle's filename carries a hash, so old and new never collide.
