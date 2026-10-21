/**
 * sitemap.xml: every page meant to be found, built from the same data as the pages. The web app
 * (/app) is a signed-in tool, not a page, and is not listed.
 */
export const revalidate = 3600;   // /panchang's lastModified follows its hourly ISR

import { GUIDES, UPDATED } from './lib/content/guides';
import { abs } from './lib/seo/site';
import { SECTIONS, refPath } from './lib/content/refpages';
import { TOOLS, toolPath } from './lib/content/tools';
import { CAL_YEARS } from './lib/astro/skycal';
import { ARTICLES } from './lib/content/magazine';

export default function sitemap() {
  const at = new Date(UPDATED);
  const page = (path, priority, changeFrequency = 'monthly') => ({ url: abs(path), lastModified: at, changeFrequency, priority });
  return [
    page('/', 1.0, 'weekly'),
    page('/about', 0.8),
    page('/pricing', 0.8),
    page('/faq', 0.8),
    page('/traditions', 0.8),
    page('/guides', 0.8),
    page('/magazine', 0.8, 'weekly'),
    ...ARTICLES.map((a) => page(`/magazine/${a.slug}`, 0.7)),
    ...GUIDES.map((g) => page(`/guides/${g.slug}`, 0.7)),
    ...Object.entries(SECTIONS).flatMap(([key, s]) => [
      page(s.base, 0.7),
      ...s.items.map((x) => page(refPath(key, x.slug), 0.6)),
    ]),
    page('/tools', 0.7),
    ...TOOLS.map((t) => page(toolPath(t.slug), 0.7)),
    page('/tools/embed', 0.4),
    { url: abs('/panchang'), lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    page('/sky-calendar', 0.7),
    ...CAL_YEARS.flatMap((y) => ['mercury-retrograde', 'eclipses', 'transits'].map((k) => page(`/${k}/${y}`, 0.7))),
    page('/editorial-standards', 0.4, 'yearly'),
  ];
}
