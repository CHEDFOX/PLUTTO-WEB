/**
 * /traditions — the atlas: all 102 traditions on Plutto's globe, by region,
 * each with the place it began and why it is pinned there.
 *
 * The data is the backend's own (library_map.build_map → app/lib/atlas.json):
 * a considered answer to "where was this first practised" for every one. It is
 * the most specific, most checkable page on the site — the kind an answer
 * engine cites — so it is plain markup, a real list, and an ItemList of
 * DefinedTerms.
 */
import ATLAS from '../../lib/data/atlas.json';
import { SHELF_COLOR } from '../../lib/content/traditions';
import { pageMeta } from '../../lib/seo/pageMeta';
import { breadcrumbLd } from '../../lib/seo/structuredData';
import { JsonLd } from '../../components/seo/JsonLd';
import { abs, SITE } from '../../lib/seo/site';
import { Doc } from '../../components/doc/Doc';
import { DocDoor } from '../../components/doc/DocDoor';
import { LINK } from '../../components/doc/classes';

const KIND = {
  birth: 'read from your birth',
  cast: 'cast or drawn',
  moment: 'read from the moment you ask',
  practice: 'a practice',
  body: 'read from the body',
};

export const metadata = pageMeta({
  title: 'The World\'s Astrology & Divination Traditions, Mapped',
  description: `The astrology and divination traditions Plutto reads — Vedic, BaZi, Mérìndínlógún, Fāl-e Ḥāfeẓ, Qi Men Dun Jia, Tử Vi, Mahabote — by region, with where each began.`,
  path: '/traditions',
});

export default function TraditionsPage() {
  const byRegion = ATLAS.regions.map((r) => ({ ...r, items: ATLAS.traditions.filter((t) => t.region === r.id) })).filter((r) => r.items.length);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    '@id': abs('/traditions'),
    name: "The traditions on Plutto's globe",
    hasDefinedTerm: ATLAS.traditions.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.name,
      description: `${t.note} Began in ${t.place}.`,
      inDefinedTermSet: abs('/traditions'),
    })),
  };
  return (
    <>
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbLd([{ name: 'Traditions', path: '/traditions' }])} />
      <Doc
        eyebrow="The atlas"
        title="Every tradition, and where it began."
        lead={`Plutto reads your chart through astrology and divination traditions from across the world. Each is pinned on the app's globe at the place it was first practised — a founding place where there is one, a founding centre where there is not — and each is named as its own people name it.`}
        crumbs={[{ name: 'Traditions', path: '/traditions' }]}
      >
        <nav aria-label="Regions" className="flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {byRegion.map((r) => <a key={r.id} href={`#${r.id}`} className={LINK}>{r.title}</a>)}
        </nav>
        {byRegion.map((r) => (
          <section key={r.id} id={r.id} className="scroll-mt-24">
            <h2 className="flex items-center gap-3"><span aria-hidden="true" className="inline-block h-3 w-3" style={{ background: SHELF_COLOR[r.id] || '#111111' }} />{r.title}</h2>
            <dl className="mt-6 divide-y divide-white/[0.06]">
              {r.items.map((t) => (
                <div key={t.id} className="grid grid-cols-1 gap-1 py-4 md:grid-cols-12 md:gap-6">
                  <dt className="md:col-span-4">
                    <span className="text-[16px] font-semibold text-white">{t.name}</span>
                    <span className="block text-[13px] text-white/40">{t.place} · {KIND[t.kind] || t.kind}</span>
                  </dt>
                  <dd className="text-[15px] text-white/60 md:col-span-8">{t.note}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
        <DocDoor links={[{ href: '/guides', label: 'Guides' }, { href: '/faq', label: 'FAQ' }]} />
      </Doc>
    </>
  );
}
