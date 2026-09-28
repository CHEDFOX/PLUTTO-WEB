/**
 * sitemap.xml — every page meant to be found, built from the same data the
 * pages are, so a new guide is in the sitemap the moment it exists.
 * The web app (/app) is not listed: it is a signed-in tool, not a page.
 */
import { GUIDES, UPDATED } from './lib/guides';
import { abs } from './lib/seo';

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
  ];
}
