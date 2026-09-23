# App screens for the landing page

Everything under `public/app/screens/` is a capture of the **real mobile app**,
not a drawing. This folder is how they are made. Re-run it whenever the app's
look changes; never hand-edit the images.

## How it works

1. **Catalog.** `dumpcat.py` runs the backend's own `get_catalog` and writes
   `catalog.json` — the theme, labels, tabs and style overrides the phone gets.
   `dumpdiv.py` does the same for the Tarot SDUI screen.
   (Run with the backend's venv; dummy `OPENROUTER_API_KEY`, `OPENAI_API_KEY`,
   `GOOGLE_PLACES_API_KEY` are enough.)
2. **Harness.** Copy the mobile repo's `src`, `assets`, `App.js`, `app.json`,
   `babel.config.js` and `package.json` into `$WORK/rnweb`, symlink its
   `node_modules`, and add `harness.index.js` as `index.js`.
   `npx expo export --platform web --output-dir dist`. For the voice orb, point
   `main` at `harness.orb.js` and export to `dist-orb` (Skia must finish loading
   before any module imports it). Copy `canvaskit.wasm` next to each export and
   an Inter woff2 to `dist*/fonts/inter.woff2`.
   Serve `dist` on :3222 and `dist-orb` on :3223.
3. **Capture.** `drive.mjs` (`MODE=chat|tarot|when|language|auth|orb`) renders the
   real components at 393 × 852 pt and 3×, faking the API from the catalog and
   the backend's `static/` folder. `record.mjs` (`VIDEO=1`) and `orbrec.mjs`
   capture screencast frames; encode them with ffmpeg as `chat.*` and `voice.*`.

## What differs from the phone, on purpose

- Safe-area insets are pinned to an iPhone 15's (59 / 34).
- The text input's browser focus ring is removed and the multiline box held to
  the one-line height iOS gives it.
- The system face (SF on iOS) is mapped to Inter, the closest available.
- The Oracle's replies in `exchanges.json` are written in its voice; no model
  is called. The card reading shows the card's own essence from the deck data.
