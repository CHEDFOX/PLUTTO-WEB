/**
 * Facts about Plutto that every page, JSON-LD block and /llms.txt read, so answer engines (Google's AI Overviews,
 * ChatGPT, Perplexity, Gemini, Claude) find them stated the same way everywhere: change a price or platform here.
 * Each fact is checkable in the app's code; traditions and languages are never counted, and no rating is published.
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
