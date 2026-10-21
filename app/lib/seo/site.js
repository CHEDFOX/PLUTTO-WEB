/**
 * SEO / AEO / GEO — ONE SOURCE OF FACTS ABOUT PLUTTO.
 *
 * Search engines rank pages; answer engines (Google's AI Overviews, ChatGPT,
 * Perplexity, Gemini, Claude) QUOTE them. What they quote is whatever states a
 * fact plainly and the same way everywhere — so every page, every JSON-LD block
 * and /llms.txt read their facts from here, and a number changes in one place.
 *
 * Every fact below is true of the app and checkable in its code: the prices are
 * Plutto Star's and the ephemeris is the one the backend calls. Traditions and
 * languages are never counted in copy: the brand names neither by number.
 * Nothing here is a rating, a user count or a review — none is published until
 * there is a real one to publish (a fabricated one is a manual-action risk and
 * the kind of claim an answer engine repeats until it is embarrassing).
 */

export const SITE = {
  url: 'https://plutto.space',
  name: 'Plutto',
  tagline: 'Every reading. Every system.',
  // The entity sentence. Answer engines lift the first plain definition they
  // find; it is the same words on the home page, the FAQ and llms.txt.
  definition:
    'Plutto is an astrology app you can talk to. From your date, time and place of birth it computes your chart with Swiss Ephemeris and reads it through Vedic, Western, Chinese, KP and numerology traditions — a library of the world’s traditions — out loud, in your own language.',
  description:
    'Plutto is an astrology app you can talk to: Vedic, Western, Chinese (BaZi), KP and numerology readings from your real birth chart, computed with Swiss Ephemeris, spoken in your own language. Free to start.',
  company: 'XOOTEQ LAB PRIVATE LIMITED',
  companyShort: 'Xooteq Lab',
  companyUrl: 'https://xooteq.com',
  email: 'support@plutto.space',
  founded: '2026',
  ephemeris: 'Swiss Ephemeris',
  platforms: ['Android', 'iOS', 'Web'],
  playUrl: 'https://play.google.com/store/apps/details?id=space.plutto.app',
  webAppUrl: 'https://plutto.space/app',
  plans: [
    { name: 'Plutto Star — Weekly', price: '5.99', period: 'P1W', label: 'week' },
    { name: 'Plutto Star — Quarterly', price: '19.99', period: 'P3M', label: '3 months' },
    { name: 'Plutto Star — Annual', price: '29.99', period: 'P1Y', label: 'year' },
  ],
  currency: 'USD',
};

export const abs = (path = '/') => `${SITE.url}${path === '/' ? '' : path}`;
