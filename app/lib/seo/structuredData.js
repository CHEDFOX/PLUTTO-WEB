import { SITE, abs } from './site';

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
    publishingPrinciples: `${SITE.url}/editorial-standards`,
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
    publisher: { '@id': ORG_ID },
    featureList: [
      'Vedic astrology (Jyotish): grahas, bhavas, dashas, yogas, doshas, gochara, muhurta, Guna Milan',
      'KP astrology: sub-lords and horary (prashna) by number',
      'Western astrology: planets, aspects, transits, profections, synastry',
      'Chinese astrology (BaZi): Four Pillars, Da Yun, Liu Nian, Wu Xing, He Hun',
      'Numerology: Ank Jyotish, Lo Shu grid, name, mobile and business-name numbers',
      'Tarot, Lenormand, runes, ogham, I Ching and geomancy readings',
      'A globe of the world\'s traditions, each read from your chart',
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

// The day the guides and reference pages first went up; dateModified moves.
const PUBLISHED = '2026-09-28';

export function articleLd({ title, description, path, updated, image }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    url: abs(path),
    image: abs(image || '/opengraph-image'),
    datePublished: PUBLISHED,
    dateModified: updated,
    isPartOf: { '@id': SITE_ID },
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    about: { '@id': APP_ID },
    inLanguage: 'en',
    // The one paragraph that answers the page's question, marked for voice
    // assistants (every article page gives its answer paragraph this class).
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.speakable'] },
  };
}
