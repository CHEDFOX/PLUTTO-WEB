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
import { Doc, DocDoor, MONO, LINK } from '../../../components/site/Doc';

export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.map((g) => ({ slug: g.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) return {};
  return pageMeta({ title: g.title, description: g.description, path: `/guides/${g.slug}`, type: 'article' });
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const g = GUIDE_BY_SLUG[slug];
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  return (
    <>
      <JsonLd data={articleLd({ title: g.title, description: g.description, path, updated: UPDATED })} />
      <JsonLd data={faqLd(g.faqs)} />
      <JsonLd data={breadcrumbLd([{ name: 'Guides', path: '/guides' }, { name: g.name, path }])} />
      <Doc
        eyebrow="Guide"
        title={g.title}
        crumbs={[{ name: 'Guides', path: '/guides' }, { name: g.name, path }]}
      >
        <section aria-label="In short">
          <p className="!mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">{g.answer}</p>
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
