import { abs } from './site';

/** Per-page metadata with a canonical, OpenGraph and Twitter card that agree. */
export function pageMeta({ title, description, path = '/', type = 'website', image }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    // The card image is named here because a page's own openGraph replaces the inherited one in Next.
    openGraph: { title: `${title} — Plutto`, description, url: abs(path), siteName: 'Plutto', type,
      images: [{ url: image || '/opengraph-image', width: 1200, height: 630, alt: image ? title : 'Plutto — astrology you can talk to' }] },
    twitter: { card: 'summary_large_image', title: `${title} — Plutto`, description, images: [image || '/twitter-image'] },
  };
}
