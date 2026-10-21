# Plutto motion

Social films drawn in code and rendered frame by frame to MP4 for Reels, Shorts
and TikTok (1080×1920, 30 fps), so every frame is exact and every date comes
from the site's own Swiss Ephemeris data (`app/lib/data`). Not part of the Next
build.

## Series

**Cinema** (`scenes/cine-*.js`, written to `out/cine/`) tells human stories,
not astrology: 3 AM, a message that is never sent, the drive home, five
thousand years of asking. Letterbox bars snap open on the drop, with bloom, a
grade, Cormorant titles and the real app in a 3D phone. Each film writes its
sound cues next to its pictures on one 100 BPM clock (`b(n)` = n beats), and
`sound.js` synthesises the track in the browser (OfflineAudioContext): kick,
808, snare, clap, hats, taiko, impacts, braams, risers, dead air before the drop
and a three-note sting that ends every film. There are no samples, so nothing
to license. The renderer muxes the track at -12 LUFS (two-pass loudnorm). The
worlds are in `shots.js`; the camera, titles, phone and end card in `cine.js`.

```
node marketing/motion/render.mjs cine                                # the five films → out/cine/ (mp4 + wav)
AUDIO_ONLY=1 node marketing/motion/render.mjs cine-3am               # just the soundtrack
open "http://localhost:8000/marketing/motion/index.html?scene=cine-3am&play=1"   # click the page to hear it
```

**Pop** and **Noir** tell the same ten stories (talks-back, ask-out-loud,
vedic-sign, mercury-retrograde, eclipse-2027, saturn-aries, nakshatras, gunas,
tarot, traditions):

- **Pop** (`scenes/pop-*.js`, the Pop kit in `lib.js`): the twelve shelf colours at
  full saturation, colour-field cuts, slab type that slams in with an elastic
  overshoot, neo-brutalist stickers, sunbursts, halftone, sparkles, marquee
  tape. The lead series.
- **Noir** (`scenes/<story>.js`): the site's own register: black, violet haze,
  the four-colour gradient, handwritten asides. For premium placements.

```
FFMPEG=/path/to/ffmpeg node marketing/motion/render.mjs              # noir, pop and cine → marketing/motion/out/
node marketing/motion/render.mjs pop                                 # the Pop series only (noir: the dark one)
node marketing/motion/render.mjs mercury-retrograde                  # one
STILLS=2,6,10 node marketing/motion/render.mjs gunas                 # review stills only
open "http://localhost:8000/marketing/motion/index.html?scene=gunas&play=1"   # live preview (serve the repo root)
```

The other series, each rendered by name into `out/<series>/`:

- **print** (`print.js`): one hand-print technique per film, each ending on a poster.
- **takes** (`takes.js`): letterpress claims with receipts.
- **record** (`takes.js`): documented history where astrology, and divination
  beyond it, reached into power.
- **files** (`dossier.js`): the record's stories as declassified case files.
- **truth** (`vivid.js`): the six case-file stories in the Pop style.
- **library** (`library.js`): Plutto as the library of every divination tradition.
- **signal** (`signal.js`): generative light set to its own music.
- **abstract** (`abstract.js`): modern art movements painted to music.
- **asked** (`asked.js`): questions nobody asks a friend, typed into the real
  app, each film in its own art style.
- **demo** (`asked.js`): the app in thirty seconds, real screens in a phone.

The film ids of every series are the lists at the top of `render.mjs`. A film
whose scene defines a `score` gets its soundtrack, synthesised by `sound.js`,
muxed in.

## Running

Needs Playwright's Chromium and ffmpeg. The first run decodes the app
recordings (`public/app/screens/*.webm`) into `frames/` (git-ignored). The
renderer serves the repo root over HTTP itself; the live preview needs it
served too (for example `python3 -m http.server 8000` at the repo root).

Environment:

- `FFMPEG`: the ffmpeg binary (default `ffmpeg` on PATH).
- `OUT`: the output folder (default `marketing/motion/out`).
- `PLAYWRIGHT_MODULE`: where to load Playwright from (default `playwright`),
  for a copy installed outside this repo.
- `STILLS=t1,t2,…`: write a JPEG at each time, in seconds, instead of the film.
- `AUDIO_ONLY=1`: write only the soundtracks (.wav).

## Files

- `index.html`: the 1080×1920 stage and the brand fonts (subsets in `fonts/`,
  about 610 kB).
- `lib.js`: the kit: easing, word reveals, haze, stars, grain, footage, end
  cards; the Pop kit (colour fields, stickers, slabs, sparkles, marquee, planet
  badges) at the end.
- `scenes/*.js`: one film each, loaded by id: `setup(stage)` builds it,
  `frame(t)` draws time t.
- `asked/`: the scripted exchanges the asked films type into the app.
- `POSTING.md`: captions, tags and when to post each film.

When a date changes (a new year of retrogrades, for example), regenerate the
data with `python3 scripts/ephemeris.py`, update the film's text, and re-render.
