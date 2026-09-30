/**
 * sitemap.xml — every page meant to be found, built from the same data the
 * pages are, so a new guide is in the sitemap the moment it exists.
 * The web app (/app) is not listed: it is a signed-in tool, not a page.
 */
export const revalidate = 3600;   // /panchang's lastModified follows its hourly ISR

import { GUIDES, UPDATED } from './lib/guides';
import { abs } from './lib/seo';
import { SECTIONS, refPath } from './lib/refpages';
import { TOOLS, toolPath } from './lib/tools';
import { CAL_YEARS } from './lib/skycal';

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
