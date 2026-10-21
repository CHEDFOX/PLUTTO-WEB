/**
 * /magazine/<slug> — one story (content: app/lib/magazine.js).
 *
 * Set like a feature: kicker, headline, standfirst; the picture with its
 * caption and credit; the text with a drop cap, one pull quote and one fact in
 * the margin; then the page of the app the story leads to, the sources, and
 * what to read next. Article + BreadcrumbList structured data.
 */
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ARTICLES, ARTICLE_BY_SLUG, APP_PAGE, PUBLISHED, readMinutes } from '../../../lib/magazine';
import { pageMeta, breadcrumbLd, articleLd, JsonLd } from '../../../lib/seo';
import { ArticleCard, AppPage, Figure, KICKER, LABEL } from '../../../components/site/magazine/Parts';
import { LINK } from '../../../components/site/Doc';

export const dynamicParams = false;
export function generateStaticParams() { return ARTICLES.map((a) => ({ slug: a.slug })); }

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) return {};
  return pageMeta({ title: a.title, description: a.standfirst, path: `/magazine/${a.slug}`, type: 'article' });
}

const DATE = new Date(`${PUBLISHED}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function Block({ b, first }) {
  if (b.h) return <h2 className="mt-14 font-display text-[clamp(1.5rem,2.6vw,1.9rem)] leading-tight text-white">{b.h}</h2>;
  if (b.quote) {
    return (
      <blockquote className="my-12 border-l-2 border-sindoor pl-6 md:-ml-8">
        <p className="font-display text-[clamp(1.55rem,3.2vw,2.15rem)] italic leading-[1.22] text-white">{b.quote}</p>
      </blockquote>
    );
  }
  if (b.fact) {
    return (
      <aside className="my-12 border-y border-white py-6">
        <p className={LABEL}>Did you know</p>
        <p className="mt-3 text-[17px] leading-[1.65] text-white/90">{b.fact}</p>
      </aside>
    );
  }
  return (
    <p className={`mt-6 ${first ? 'first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.4em] first-letter:leading-[0.82] first-letter:text-white' : ''}`}>
      {b.p}
    </p>
  );
}

export default async function MagazineArticle({ params }) {
  const { slug } = await params;
  const a = ARTICLE_BY_SLUG[slug];
  if (!a) notFound();
  const path = `/magazine/${a.slug}`;
  const app = APP_PAGE[a.app];
  const firstP = a.body.findIndex((b) => b.p);
  const i = ARTICLES.indexOf(a);
  const next = [1, 2, 3].map((k) => ARTICLES[(i + k) % ARTICLES.length]);

  return (
    <>
      <JsonLd data={articleLd({ title: a.title, description: a.standfirst, path, updated: PUBLISHED })} />
      <JsonLd data={breadcrumbLd([{ name: 'Magazine', path: '/magazine' }, { name: a.title, path }])} />
      <article data-no-auto-case className="sentence-case relative z-10 font-ui">
        <header className="mx-auto max-w-4xl px-6 pt-8 md:pt-14">
          <nav aria-label="Breadcrumb" className="text-[13px] text-white/45">
            <Link href="/" className="hover:text-white">Plutto</Link>
            <span className="mx-2">/</span>
            <Link href="/magazine" className="hover:text-white">Magazine</Link>
          </nav>
          <div className="mt-10 text-center">
            <p className={KICKER}>{a.kicker}</p>
            <h1 className="mx-auto mt-5 max-w-[20ch] font-display text-[clamp(2.2rem,5.6vw,4.1rem)] leading-[1.04] tracking-[-0.015em] text-white" style={{ textWrap: 'balance' }}>
              {a.title}
            </h1>
            <p className="speakable mx-auto mt-6 max-w-2xl text-[19px] leading-[1.6] text-white/75">{a.standfirst}</p>
            <p className={`mt-6 ${LABEL}`}>
              <span className="whitespace-nowrap">The Plutto Magazine</span> · <span className="whitespace-nowrap">{DATE}</span> · <span className="whitespace-nowrap">{readMinutes(a)} min read</span>
            </p>
          </div>
        </header>

        <Figure a={a} />

        <div className="mx-auto max-w-[44rem] px-6 pt-10 font-body text-[18px] leading-[1.75] text-white/80">
          {a.body.map((b, k) => <Block key={k} b={b} first={k === firstP} />)}
          {a.link ? (
            <p className="mt-10"><Link href={a.link.href} className={LINK}>{a.link.label} →</Link></p>
          ) : null}
        </div>

        {/* THE PAGE OF THE APP THIS STORY LEADS TO */}
        {app ? (
          <section aria-labelledby="in-the-app" className="mx-auto mt-20 max-w-4xl px-6">
            <div className="grid items-center gap-10 border-y-2 border-white py-12 md:grid-cols-[220px_1fr]">
              <div className="mx-auto w-[200px] md:w-full"><AppPage k={app.key} size="card" cta="Open it" /></div>
              <div className="min-w-0">
                <p className={KICKER}>In the app</p>
                <h2 id="in-the-app" className="mt-3 font-display text-[clamp(1.8rem,3.4vw,2.5rem)] leading-[1.08] text-white">{app.title}</h2>
                <p className="mt-3 max-w-md text-[17px] leading-relaxed text-white/70">{app.line}</p>
                <Link href="/app" className="mt-7 inline-flex h-12 items-center justify-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90">
                  Open Plutto
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section aria-labelledby="sources" className="mx-auto mt-14 max-w-[44rem] px-6">
          <h2 id="sources"><span className={LABEL}>Sources</span></h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[14px] leading-relaxed text-white/60 marker:text-white/35">
            {a.sources.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <p className="mt-8 text-[13px] text-white/40">
            Plutto presents these traditions for reflection; it does not claim that astrology predicts events.
          </p>
        </section>

        <section aria-labelledby="read-next" className="mx-auto mt-20 max-w-6xl px-6 pb-24">
          <div className="flex items-baseline justify-between border-b border-white pb-3">
            <h2 id="read-next"><span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white">Read next</span></h2>
            <Link href="/magazine" className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/60 hover:text-white">The whole issue →</Link>
          </div>
          <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
            {next.map((n) => <ArticleCard key={n.slug} a={n} />)}
          </div>
        </section>
      </article>
    </>
  );
}
