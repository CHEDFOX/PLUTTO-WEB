# Plutto — Web

Marketing site for [Plutto](https://plutto.space), a voice-first astrology Oracle.

## Stack
- Next.js 15 (App Router) · React 19
- Tailwind CSS 3
- Playfair Display via `next/font/google`
- Deployed on Vercel (zero-config)

## Brand tokens
Defined in `tailwind.config.js`:
- `gold` `#D4AF37` — accent
- `void` `#000000` — background
- `card` `#0c0b12` — surfaces
- `mist` `rgba(255,255,255,0.12)` — subtle border
- `silver` `#8A8A8E` — secondary text

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Deploy

Push to GitHub and import in Vercel — no configuration needed. Next.js is detected automatically.

## Layout

- `app/layout.js` — root layout, fonts, metadata
- `app/page.js` — homepage
- `app/globals.css` — Tailwind + base styles
- `app/icon.svg` — favicon

## Notes

- `next.config.mjs` whitelists `api.plutto.space/static/*` for `next/image` so we can pull live planet / system art from the backend.
- Apple/Google store links and social handles are not yet wired (none exist in the source repos).
