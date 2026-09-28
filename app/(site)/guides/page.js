/**
 * /guides — every system Plutto reads, one guide each (app/lib/guides.js).
 */
import Link from 'next/link';
import { GUIDES } from '../../lib/guides';
import { pageMeta, breadcrumbLd, JsonLd, SITE, abs } from '../../lib/seo';
import { Doc, DocDoor, LINK } from '../../components/site/Doc';
import { cardPath } from '../../lib/cards';

const REFERENCE = [
  ['/nakshatras', 'The 27 nakshatras — the lunar mansions of Vedic astrology'],
  ['/grahas', 'The 9 grahas — the planets of Vedic astrology'],
  ['/zodiac-signs', 'The 12 zodiac signs'],
  ['/chinese-zodiac', 'The 12 Chinese zodiac animals, with every year from 1924 to 2043'],
  ['/tools/moon-sign-nakshatra', 'Moon sign, nakshatra and dasha calculator'],
  ['/tools', 'All free calculators: life path number, Chinese zodiac, name numerology'],
];

const TITLE = 'Astrology Guides: Vedic, KP, Western, Chinese';
const DESC = 'Plain-language guides to every system Plutto reads — Vedic (Jyotish), KP, Western, Chinese BaZi, numerology, tarot and astrocartography: how each works and what it reads.';

export const metadata = pageMeta({ title: TITLE, description: DESC, path: '/guides', image: cardPath('guides') });

export default function GuidesIndex() {
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Plutto guides',
    itemListElement: GUIDES.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/guides/${g.slug}`), name: g.title })),
  };
  return (
    <>
      <JsonLd data={list} />
      <JsonLd data={breadcrumbLd([{ name: 'Guides', path: '/guides' }])} />
      <Doc
        eyebrow="Guides"
        title="Every system Plutto reads, explained."
        lead={`${SITE.definition} These are the systems it reads, each in its own words.`}
        crumbs={[{ name: 'Guides', path: '/guides' }]}
      >
        <ul className="mt-2 divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {GUIDES.map((g) => (
            <li key={g.slug} className="py-7">
              <h2 className="!mt-0 text-[22px] font-semibold text-white">
                <Link href={`/guides/${g.slug}`} className="hover:underline hover:decoration-white/40 hover:underline-offset-4">{g.title}</Link>
              </h2>
              <p className="!mt-3 text-[15px] text-white/55">{g.description}</p>
            </li>
          ))}
        </ul>
        <h2>Reference and calculators</h2>
        <ul className="mt-4 space-y-2">
          {REFERENCE.map(([href, label]) => (
            <li key={href}><Link href={href} className={LINK}>{label}</Link></li>
          ))}
        </ul>
        <DocDoor links={[{ href: '/traditions', label: `All ${SITE.counts.traditions} traditions` }, { href: '/faq', label: 'FAQ' }]} />
      </Doc>
    </>
  );
}
