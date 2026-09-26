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

Three kinds of screen, chosen when the page loads:

- **Phone** (a touch screen whose short side is under 600px, or a narrow
  window): the app exactly as the phone build draws it. Device width, no
  zoom, no column, nothing web-only. The app is portrait-only, which a page
  cannot enforce, so a phone turned sideways shows "Turn your phone upright."
- **Tablet** (larger touch screens): the whole screen drawn at 80%, with the
  app in a centred column that it treats as its screen width. The browser's
  own viewport scaling does this, so touches land correctly on every engine.
- **Computer**: the same picture by CSS zoom. Pointer positions and element
  rects are converted to the app's own pixels once, at load.

On tablets and computers, full-screen views (readings, the voice screen, the
paywall's dimming) reach the screen's edges while their content stays in the
column (`src/render/webStage.js`). The paywall is a small card there, the Home
wheels switch by their names, arrows, arrow keys or a trackpad swipe, and the
sign-in eclipse hangs from the top. Turning a tablet or resizing a window lays
the app out again.

The zoom, the column width and the phone threshold are the constants at the
top of `Plutto-Frontend/scripts/build-web.mjs`.

## Updating

Any app change that should reach the browser is a rebuild and a commit of
`public/m`. The bundle's filename carries a hash, so old and new never collide.
