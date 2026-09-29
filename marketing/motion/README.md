# Plutto motion

Social films drawn in code and rendered frame by frame, so every frame is
exact and every date comes from the site's own Swiss Ephemeris data.

```
FFMPEG=/path/to/ffmpeg node marketing/motion/render.mjs              # all ten → marketing/motion/out/
node marketing/motion/render.mjs mercury-retrograde                  # one
STILLS=2,6,10 node marketing/motion/render.mjs gunas                 # review stills only
open "http://localhost:8000/marketing/motion/index.html?scene=gunas&play=1"   # live preview (serve the repo root)
```

Needs Playwright's Chromium and ffmpeg. The first run decodes the app
recordings (`public/app/screens/*.webm`) into `frames/` (git-ignored).

- `index.html` — the 1080×1920 stage and the brand fonts (subsets, 440 kB).
- `lib.js` — the kit: easing, word reveals, haze, stars, grain, footage, end card.
- `scenes/*.js` — one film each: `setup(stage)` builds it, `frame(t)` draws time t.
- `POSTING.md` — captions, tags and when to post each film.

When a date changes (a new year of retrogrades, say), regenerate the data
with `python3 scripts/ephemeris.py`, update the film's text, and re-render.
