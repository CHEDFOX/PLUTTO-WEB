# PLUTTO-WEB architecture

plutto.space: the marketing and reference site of the Plutto astrology app, and
the app itself for browsers at `/app`. Next.js 15 (app router), React 19,
Tailwind CSS 3, framer-motion and astronomy-engine. Vercel builds and deploys it
with no configuration file; a push to the production branch is a production
deploy.

Two sibling repositories meet this one: Plutto-Frontend, the React Native app
whose web build is served at `/app`, and Plutto-Backend, the API at
api.plutto.space that serves the app its catalog, its readings and its payments.

## Run and build

    npm install
    npm run dev        # http://localhost:3000
    npm run build      # what Vercel runs
    npm start          # serve the build

CI runs Node 22. There is no test suite. `npm run lint` runs `next lint`, which
Next 15.5 marks deprecated; the repo has no ESLint configuration, so it only
offers to create one.

Environment (Vercel → Settings → Environment Variables), all optional:

| Variable | Used by | Effect |
|---|---|---|
| `META_PIXEL_ID` | `app/api/meta/pixel`, `app/api/meta/events` | the Meta dataset ID; turns the pixel and the Conversions API relay on. Without it the loader is a stub and the relay answers 204 |
| `META_CAPI_TOKEN` | `app/api/meta/events` | Conversions API token (secret, server only); the relay also needs it |
| `META_TEST_EVENT_CODE`, `META_GRAPH_VERSION` | `app/api/meta/events` | Events Manager test routing; Graph API version (default v23.0) |
| `META_CONSENT_COUNTRIES` | `app/api/meta/pixel` | comma-separated ISO codes that replace the ask-first country list |

`NODE_ENV`, set by Next, switches the CSP in next.config.mjs between development
(React Refresh's `'unsafe-eval'`, the dev websocket) and production (HSTS,
`upgrade-insecure-requests`). The scripts and tools list their own variables in
their file headers.

## Folder map

    app/                      routes (a folder with a page.js or route.js is a URL) and Next file conventions
      layout.js               <html>: the four faces, metadata defaults, GTM, the viewport-scaling script
      globals.css             Tailwind layers and the site CSS (paper palette, sentence case, motion)
      icon.png  apple-icon.png  manifest.js  robots.js  sitemap.js  opengraph-image.js  twitter-image.js
      llms.txt/  llms-full.txt/   Markdown for answer engines, built by lib/seo/llms.js
      (site)/                 route group, no URL segment: every marketing page
        layout.js             JSON-LD (organization, website, app), Nav, Footer, grain, Meta pixel
        page.js               /, composed from components/home/sections
        about/  pricing/  faq/  editorial-standards/  traditions/  panchang/  sky-calendar/
        guides/  magazine/  nakshatras/  grahas/  zodiac-signs/  chinese-zodiac/   an index and [slug]/
        mercury-retrograde/  eclipses/  transits/   page.js redirects (308) to /sky-calendar; [year]/ is the year page
        tools/                the hub, embed/ (how to embed), six calculators
      embed/[tool]/           calculators other sites may frame (noindex, canonical to the tool page)
      og/[section]/[slug]/    share-card PNGs, rendered at build
      api/meta/pixel/         the Meta pixel and consent script (also loaded by /app)
      api/meta/events/        Conversions API relay
      components/             React components, one per file, by page or concern; not a URL
        layout/               Nav, Footer, SiteChrome (grain overlay), CookieChoices
        home/                 sections/ (one per home section), hero/ (HeroStage, Phone, stackPath),
                              marquee/ (Marquee, Row), Story, Ancient, Draw, Lines, H2, Tile, TileText
        about/                sections/ (one per about section), PlanetMark, Lines, classes
        doc/                  Doc (reading-page shell), DocDoor, classes (MONO, LINK)
        reference/            RefHub, RefDetail, Val, refMeta (nakshatras, grahas, signs, Chinese zodiac)
        sky-calendar/         SkyHub, RetrogradePage, EclipsePage, TransitPage, Shell, Table, YearNav, When, format, skyMeta
        panchang/             PanchangView (rendered by the page and by the widget), PanchangWidget
        tools/                ToolPage, ToolsHub, toolMeta, the six calculator widgets, their fields, tables and helpers
        magazine/             ArticleCard, CardArt, TitlePlate, Figure, Picture, Plate, plates/, AppPage, Block, classes
        phone/                Device, StatusBar, Shot, AppVideo, LockApp, push (the app shown in an iPhone frame)
        ink/                  Note, Stroke, Arrow, Underline (hand-drawn marks), inkColor
        motion/               FadeUp, Words, Spotlight, Tilt, useCalm
        store/                GetAppLink, StoreBadges, Badge, AppleGlyph, PlayGlyph, usePlatform
        seo/JsonLd.js         <script type="application/ld+json">
        ui/                   LocalTime, CopyBox
      lib/                    modules without React components; not a URL
        astro/                sky (astronomy-engine), zone, vedic, panchang, sadesati, skycal, guna, numerology, chineseZodiac
        content/              editorial data: guides, magazine, faq, method, reference, refpages, tools, embeds, decks, traditions
        seo/                  site (SITE facts, abs), pageMeta, structuredData (JSON-LD builders), shareCards, llms
        analytics/            gtm, consent (ask-first countries, storage key), metaPixel (track)
        appStore.js           store links, live flags, platform detection
        data/                 generated JSON, never edited by hand: ephemeris, saturn, atlas
    public/                   served as is at its path (see "Contracts")
      m/                      the web app at /app
      app/screens/            recorded app screens
      library/                card decks shown on the pages
      planets/  magazine/  fonts/ancient/  brand/  and the IndexNow key file
    scripts/                  ephemeris.py (writes app/lib/data), search-sync.mjs (run by CI)
    tools/app-screens/        capture harness for public/app/screens
    marketing/motion/         social-film renderer, separate from the site build
    docs/auth.md              web sign-in setup (Supabase, Google, Apple)
    .github/workflows/search-sync.yml
    next.config.mjs           security headers, CSP, rewrites, image hosts
    tailwind.config.js  postcss.config.mjs  jsconfig.json  package.json

## Server and client

Components are server components unless the file starts with `'use client'`. A
server file may import a client component, never a value (constant or function)
from a client module; shared constants live in plain modules
(`app/components/doc/classes.js`, `app/components/ink/inkColor.js`,
`app/components/tools/widgetClasses.js`, ...). The client widgets load
`app/lib/astro/sky.js` with `import()`, so no page sends astronomy code to the
browser until a calculator runs; server pages (the panchang, the reference
pages) import it directly.

## Contracts outside this repo

- URLs. Every route under `app/` and every file under `public/` is a public
  URL, and some are named outside this repo (below), so none is moved or
  renamed. The bare `/mercury-retrograde`, `/eclipses` and `/transits` are
  permanent redirects to `/sky-calendar`. Plutto-Frontend's App Store listing gives `/about` as its
  support URL. The web checkout (Plutto-Backend) and the Supabase sign-in
  redirect return to `/app` (`docs/auth.md`).
- `/api/meta/pixel` is loaded by every marketing page and by `/app`. Both report
  into one Meta dataset; the consent answer is `localStorage['plutto_ads']`
  (`app/lib/analytics/consent.js`), shared with GTM.
- `/brand/plutto-mark.png` is the checkout image that Plutto-Backend's catalog
  names. `/213d99bd8aa94062106ba102555a5fe8.txt` is the IndexNow key, which
  `scripts/search-sync.mjs` checks is live before it submits. `public/app/screens/*`
  are the recorded app screens; the `ask-*`, `tour-*` and `feat-*` files are
  used only by marketing/motion.
- Security headers and the CSP are in next.config.mjs. `/embed/*` is the only
  path that may be framed (`frame-ancestors *`, no X-Frame-Options).
  `font-src` keeps `api.plutto.space` for the `/app` bundle's fonts, and
  `'wasm-unsafe-eval'` is CanvasKit, which `/app` draws with.
- The Vercel project is `plutto-web`: Plutto-Backend's CORS allows
  `^https://plutto-web[a-z0-9-]*\.vercel\.app$`.

### The web app at /app

`/app` is the phone app itself built for the browser, not a second
implementation. `public/m` is Plutto-Frontend's web build (an Expo web export
with `public/m/canvaskit.wasm` beside it), committed here because Vercel builds
only this repo. To update it, run Plutto-Frontend's web build with this repo's
`public/m` as its output directory, then commit `public/m`; the bundle's file
names carry a hash, so old and new never collide.

- `/app` and `/plutto-sw.js` are `beforeFiles` rewrites (next.config.mjs) to
  `public/m/index.html` and `public/m/plutto-sw.js`, so nothing under `app/` can
  shadow them. The worker is served from the root so that its scope is the
  whole site, and it is always revalidated.
- The bundle is built with `/m` as its asset base, so every asset URL inside it
  starts with `/m`.
- The web build adds the `/api/meta/pixel` script to `public/m/index.html`.
- `/app` and `/m/*` are noindex (`X-Robots-Tag`). robots.txt keeps crawlers out
  of `/m/` except `/m/icons/` (the manifest's icons) and does not block `/app`,
  because the noindex of a blocked page is never read.

## Data

- `app/lib/data/ephemeris.json` and `app/lib/data/saturn.json`:
  `python3 scripts/ephemeris.py` (needs `pip install pyswisseph`; `SE_EPHE_PATH`
  selects the ephemeris files). The output is deterministic. The script's
  `YEARS` and `SATURN_YEARS` set the computed range; the published sky-calendar
  years are `CAL_YEARS` in `app/lib/astro/skycal.js`. Films in marketing/motion
  quote these dates, so re-render them after a change.
- `app/lib/data/atlas.json`: Plutto-Backend's library map (the globe in the
  app), copied as is; its `source` field says so. `/traditions`, llms-full.txt
  and the library films in marketing/motion read it.
- `app/lib/content/traditions.js`: the library's shelves and their colours, a
  static excerpt of Plutto-Backend's library map, so the pages need no request.
- ISR: `/panchang` and sitemap.xml every hour (`revalidate = 3600`),
  `/guides/[slug]` daily (`revalidate = 86400`). Every other page is built once
  at deploy; the two `/api/meta` routes are dynamic.

## SEO

`app/lib/seo/site.js` holds the facts every page, JSON-LD block and llms.txt
reads (prices, platforms, company), stated once so that answer engines find them
the same everywhere. `pageMeta()` (`app/lib/seo/pageMeta.js`) gives each page
its canonical and its share card: the site default (`app/opengraph-image.js`)
or, for guide, reference and tool pages, `/og/<section>/<slug>`, drawn from
`app/lib/seo/shareCards.js`. The root layout sets no canonical, so a page
without its own does not inherit the home page's. robots.txt names the
answer-engine crawlers explicitly. CI (`.github/workflows/search-sync.yml`)
runs `scripts/search-sync.mjs` after each successful production deploy, daily
and on demand: IndexNow for changed pages, and a sitemap resubmission to Search
Console and Bing when their secrets are set.

## Regenerating the app screens

`public/app/screens` are captures of the real app components, never drawings:
re-run the capture when the app's look changes and never edit the images by
hand. `tools/app-screens` makes them from a Plutto-Backend checkout
(`BACKEND_DIR`, by default beside this repo) and a copy of the Plutto-Frontend
app, working in `$WORK` (default `/tmp/app-screens`). Each script's header lists
its environment.

1. Catalog. `tools/app-screens/dumpcat.py` writes the backend catalog for an
   English iOS client and `tools/app-screens/dumpdiv.py` the Tarot screen and
   its Explore hook. Run both with the backend's virtualenv and dummy
   `OPENROUTER_API_KEY`, `OPENAI_API_KEY` and `GOOGLE_PLACES_API_KEY`.
2. Harness. Copy the Plutto-Frontend app (its source, assets, entry file and
   its Expo, Babel and package configuration) into `$WORK/rnweb`, symlink its
   `node_modules`, add `tools/app-screens/harness.index.js` as `index.js` and
   run `npx expo export --platform web --output-dir dist`. For the voice orb,
   make `tools/app-screens/harness.orb.js` the entry and export to `dist-orb`
   (Skia must finish loading before any module imports it). Put
   `canvaskit.wasm` beside each export and an Inter woff2 at
   `dist*/fonts/inter.woff2`, then serve `dist` on :3222 and `dist-orb` on :3223.
3. Capture. `tools/app-screens/drive.mjs` renders the real components at
   393 × 852 pt and 3×, faking the API from the catalog and the backend's
   static files (`MODE=chat|tarot|when|language|auth|orb`; `REC=<name>` records
   screencast frames). `tools/app-screens/record.mjs` plays each exchange of
   `tools/app-screens/exchanges.json` (copied to `$WORK`) in the chat, with
   `VIDEO=1` for frames, and `tools/app-screens/orbrec.mjs` records the orb.
   Encode the frames with ffmpeg as `chat.*` and `voice.*`. `CHROMIUM_PATH`
   selects a browser binary.

What differs from the phone, on purpose: the safe-area insets are an iPhone
15's (59 / 34); the text input's focus ring is removed and the multiline box is
held to the one-line height iOS gives it; the system face is mapped to Inter;
the Oracle's replies are the scripted ones in `exchanges.json`, and no model is
called.

## marketing/motion

Social films drawn in the browser and rendered frame by frame to MP4
(Playwright and ffmpeg): `node marketing/motion/render.mjs [series|film ...]`.
It serves the repo root over HTTP, so it reads `public/` and `app/lib/data/` by
URL. `marketing/motion/index.html` is the 1080x1920 stage, the root `*.js` files
are the series kits, `marketing/motion/scenes/` holds one film per file (loaded
by id; keep the folder flat), `marketing/motion/fonts/` the subset faces and
`marketing/motion/asked/` the scripted exchanges. Not part of the Next build.
Commands and series: `marketing/motion/README.md`; captions and schedule:
`marketing/motion/POSTING.md`.
