/**
 * SEO / AEO / GEO — ONE SOURCE OF FACTS ABOUT PLUTTO.
 *
 * Search engines rank pages; answer engines (Google's AI Overviews, ChatGPT,
 * Perplexity, Gemini, Claude) QUOTE them. What they quote is whatever states a
 * fact plainly and the same way everywhere — so every page, every JSON-LD block
 * and /llms.txt read their facts from here, and a number changes in one place.
 *
 * Every fact below is true of the app and checkable in its code: the prices are
 * Plutto Star's, the counts are the catalog's (102 traditions on the globe,
 * 109 languages in onboarding), the ephemeris is the one the backend calls.
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
    'Plutto is an astrology app you can talk to. From your date, time and place of birth it computes your chart with Swiss Ephemeris and reads it through Vedic, Western, Chinese, KP and numerology traditions — 102 traditions in all — out loud, in 109 languages.',
  description:
    'Plutto is an astrology app you can talk to: Vedic, Western, Chinese (BaZi), KP and numerology readings from your real birth chart, computed with Swiss Ephemeris, spoken in 109 languages. Free to start.',
  company: 'XOOTEQ LAB PRIVATE LIMITED',
  companyShort: 'Xooteq Lab',
  companyUrl: 'https://xooteq.com',
  email: 'support@plutto.space',
  founded: '2026',
  counts: { traditions: 102, languages: 109, regions: 12 },
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

/** Per-page metadata with a canonical, OpenGraph and Twitter card that agree. */
export function pageMeta({ title, description, path = '/', type = 'website' }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    // The card image is named here because a page's own openGraph REPLACES the
    // inherited one in Next — without it every page but the home shared bare.
    openGraph: { title: `${title} — Plutto`, description, url: abs(path), siteName: 'Plutto', type,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Plutto — astrology you can talk to' }] },
    twitter: { card: 'summary_large_image', title: `${title} — Plutto`, description, images: ['/twitter-image'] },
  };
}

// ── JSON-LD ────────────────────────────────────────────────────────────────
const ORG_ID = `${SITE.url}/#organization`;
const APP_ID = `${SITE.url}/#app`;
const SITE_ID = `${SITE.url}/#website`;

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.companyShort,
    legalName: SITE.company,
    url: SITE.companyUrl,
    logo: `${SITE.url}/icon.png`,
    email: SITE.email,
    brand: { '@type': 'Brand', name: SITE.name, url: SITE.url },
    sameAs: [SITE.companyUrl, SITE.playUrl],
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE.name,
    alternateName: 'Plutto astrology',
    url: SITE.url,
    description: SITE.description,
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  };
}

export function appLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': APP_ID,
    name: SITE.name,
    alternateName: 'Plutto: astrology you can talk to',
    description: SITE.definition,
    url: SITE.url,
    applicationCategory: 'LifestyleApplication',
    applicationSubCategory: 'Astrology',
    operatingSystem: SITE.platforms.join(', '),
    downloadUrl: SITE.playUrl,
    installUrl: SITE.playUrl,
    inLanguage: 'en',
    availableLanguage: `${SITE.counts.languages} languages`,
    publisher: { '@id': ORG_ID },
    featureList: [
      'Vedic astrology (Jyotish): grahas, bhavas, dashas, yogas, doshas, gochara, muhurta, Guna Milan',
      'KP astrology: sub-lords and horary (prashna) by number',
      'Western astrology: planets, aspects, transits, profections, synastry',
      'Chinese astrology (BaZi): Four Pillars, Da Yun, Liu Nian, Wu Xing, He Hun',
      'Numerology: Ank Jyotish, Lo Shu grid, name, mobile and business-name numbers',
      'Tarot, Lenormand, runes, ogham, I Ching and geomancy readings',
      `A globe of ${SITE.counts.traditions} traditions, each read from your chart`,
      'Spoken readings and a voice conversation with the Oracle',
    ],
    offers: [
      { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: SITE.currency },
      ...SITE.plans.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: p.price,
        priceCurrency: SITE.currency,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: p.price,
          priceCurrency: SITE.currency,
          billingDuration: p.period,
        },
        url: `${SITE.url}/pricing`,
      })),
    ],
  };
}

export function breadcrumbLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Plutto', path: '/' }, ...items].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path),
    })),
  };
}

export function faqLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleLd({ title, description, path, updated }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    url: abs(path),
    dateModified: updated,
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: { '@id': APP_ID },
    inLanguage: 'en',
  };
}

/** Prints JSON-LD. `<` is escaped so no string in the data can close the tag. */
export function JsonLd({ data }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
