/**
 * /guides/<slug> — one system, in full (content: app/lib/guides.js).
 *
 * Order is for the reader who asked a question: the answer first, in one
 * paragraph; then how the system works; then what Plutto reads for it; then
 * the short questions. Article + FAQPage + BreadcrumbList structured data.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, GUIDE_BY_SLUG, UPDATED } from '../../../lib/guides';
import { pageMeta, breadcrumbLd, faqLd, articleLd, JsonLd } from '../../../lib/seo';
import { cardPath } from '../../../lib/cards';
import { CAL_YEARS } from '../../../lib/skycal';
import { Doc, DocDoor, MONO, LINK } from '../../../components/site/Doc';

export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map((g) => ({ slug: g.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) return {};
  return pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}`, type: 'article', image: cardPath('guides', g.slug) });
}

// From each guide into the reference pages and calculators it explains. The
// sky-calendar links follow the build's year within the years published.
const Y = Math.min(Math.max(new Date().getUTCFullYear(), CAL_YEARS[0]), CAL_YEARS[CAL_YEARS.length - 1]);
const DEEPER = {
  'vedic-astrology': [['/tools/moon-sign-nakshatra', 'Find your Moon sign, nakshatra and dasha'], ['/tools/kundli-matching', 'Kundli matching (Guna Milan)'], ['/tools/sade-sati', 'Sade Sati calculator'], ['/panchang', 'Today’s panchang'], [`/transits/${Y}`, 'Saturn, Jupiter and Rahu–Ketu transits'], ['/nakshatras', 'The 27 nakshatras'], ['/grahas', 'The 9 grahas'], ['/zodiac-signs', 'The 12 signs (rashis)']],
  'kp-astrology': [['/nakshatras', 'The 27 nakshatras — KP’s star lords'], ['/grahas', 'The 9 grahas'], ['/tools/moon-sign-nakshatra', 'Find your Moon’s nakshatra']],
  'western-astrology': [['/zodiac-signs', 'The 12 zodiac signs'], [`/mercury-retrograde/${Y}`, 'Mercury retrograde dates'], [`/eclipses/${Y}`, 'Eclipse dates'], ['/tools/moon-sign-nakshatra', 'Find your Moon sign (Western and Vedic)']],
  'chinese-astrology': [['/tools/chinese-zodiac', 'Find your Chinese zodiac animal'], ['/chinese-zodiac', 'The 12 animals, with every year from 1924 to 2043']],
  numerology: [['/tools/life-path-number', 'Life path number calculator'], ['/tools/name-numerology', 'Name numerology calculator (Pythagorean and Chaldean)']],
};

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  return (
    <>
      <JsonLd data={articleLd({ title: g.title, description: g.description, path, updated: UPDATED, image: cardPath('guides', g.slug) })} />
      <JsonLd data={faqLd(g.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Guides', path: '/guides' }, { name: g.name, path }])} />
      <Doc
        eyebrow="Guide"
        title={g.title}
        crumbs={[{ name: 'Guides', path: '/guides' }, { name: g.name, path }]}
      >
        <section aria-label="In short">
          <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{g.answer}</p>
        </section>

        {g.sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((t, i) => <p key={i}>{t}</p>)}
          </section>
        ))}

        <section>
          <h2>What Plutto reads for {g.name}</h2>
          <ul className="mt-5 max-w-2xl list-disc space-y-2 pl-5 marker:text-white/30">
            {g.inPlutto.map((x) => <li key={x}>{x}</li>)}
          </ul>
          <p>
            Every reading is computed from your own date, time and place of birth with Swiss Ephemeris, and spoken in
            your language. <Link href="/pricing" className={LINK}>Free to start</Link>.
          </p>
        </section>

        <section>
          <h2>Questions</h2>
          {g.faqs.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>

        {DEEPER[g.slug] ? (
          <section className="mt-14">
            <p className={MONO}>Look it up</p>
            <ul className="mt-4 space-y-2">
              {DEEPER[g.slug].map(([href, label]) => <li key={href}><Link href={href} className={LINK}>{label}</Link></li>)}
            </ul>
          </section>
        ) : null}

        <section className="mt-14">
          <p className={MONO}>Read next</p>
          <ul className="mt-4 space-y-2">
            {g.related.map((r) => GUIDE_BY_SLUG[r] ? (
              <li key={r}><Link href={`/guides/${r}`} className={LINK}>{GUIDE_BY_SLUG[r].title}</Link></li>
            ) : null)}
          </ul>
        </section>

        <p className="!mt-12 text-[13px] text-white/35">Updated {UPDATED}. Plutto presents these traditions for reflection; it does not claim that astrology predicts events.</p>
        <DocDoor links={[{ href: '/guides', label: 'All guides' }, { href: '/traditions', label: 'All 102 traditions' }]} />
      </Doc>
    </>
  );
}
