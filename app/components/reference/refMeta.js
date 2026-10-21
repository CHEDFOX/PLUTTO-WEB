/** Page metadata (title, description, share card) for the reference hub and detail pages. */
import { SECTIONS, refPath } from '../../lib/content/refpages';
import { pageMeta } from '../../lib/seo/pageMeta';
import { cardPath } from '../../lib/seo/shareCards';

export function hubMeta(key) {
  const s = SECTIONS[key];
  return pageMeta({ title: s.hubTitle, description: s.hubDescription, path: s.base, image: cardPath(s.base.slice(1)) });
}

export function detailMeta(key, slug) {
  const s = SECTIONS[key];
  const x = s.items.find((i) => i.slug === slug);
  if (!x) return {};
  const p = s.page(x);
  return pageMeta({ title: p.title, description: p.description, path: refPath(key, slug), type: 'article', image: cardPath(s.base.slice(1), slug) });
}
