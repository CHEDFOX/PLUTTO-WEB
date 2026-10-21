/**
 * /magazine: the contents page (cover story, pages from the app, the rest of the issue, facts from the
 * margins), plain server markup. Content and sources: app/lib/content/magazine.js.
 */
import Link from 'next/link';
import { ARTICLES, ARTICLE_BY_SLUG, APP_PAGES, COVER, PUBLISHED } from '../../lib/content/magazine';
import { pageMeta } from '../../lib/seo/pageMeta';
import { breadcrumbLd } from '../../lib/seo/structuredData';
import { JsonLd } from '../../components/seo/JsonLd';
import { abs } from '../../lib/seo/site';
import { ArticleCard } from '../../components/magazine/ArticleCard';
import { AppPage } from '../../components/magazine/AppPage';
import { KICKER, LABEL } from '../../components/magazine/classes';
import { LINK } from '../../components/doc/classes';

const TITLE = 'The Plutto Magazine: stories the sky left behind';
const DESCRIPTION = 'Short, sourced stories about the sky and what people did with it: the planetary clock that named your week, the I Ching counting in binary, a bronze computer that predicted eclipses, and more.';

export const metadata = pageMeta({ title: TITLE, description: DESCRIPTION, path: '/magazine' });

const ISSUE = new Date(`${PUBLISHED}T12:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export default function MagazinePage() {
  const cover = ARTICLE_BY_SLUG[COVER];
  const rest = ARTICLES.filter((a) => a.slug !== COVER);
  const [lead, ...grid] = rest;
  const list = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'The Plutto Magazine',
    itemListElement: ARTICLES.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/magazine/${a.slug}`), name: a.title })),
  };

  return (
    <>
      <JsonLd data={list} />
      <JsonLd data={breadcrumbLd([{ name: 'Magazine', path: '/magazine' }])} />
      <div data-no-auto-case className="sentence-case relative z-10 font-ui">
        <header className="mx-auto max-w-6xl px-6 pt-10 md:pt-14">
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-white pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/70">
            <span>The Plutto Magazine</span>
            <span>Issue of {ISSUE}</span>
          </div>
          <h1 className="mt-8 max-w-[16ch] font-display text-[clamp(2.6rem,7.5vw,5.6rem)] leading-[0.98] tracking-[-0.02em] text-white" style={{ textWrap: 'balance' }}>
            Stories the sky left behind
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-[1.65] text-white/70">
            How a planetary clock named your week. Why the I Ching was already counting in binary. What Shang kings asked
            of ox bones about the rain. Short reads, every fact with its source.
          </p>
        </header>

        <section aria-labelledby="cover" className="mx-auto mt-14 max-w-6xl px-6">
          <p className={`${LABEL} mb-5`}>Cover story</p>
          <h2 id="cover" className="sr-only">Cover story</h2>
          <ArticleCard a={cover} wide eager headingLevel={3} />
        </section>

        <section aria-labelledby="from-the-app" className="mt-20 border-y-2 border-white bg-white/[0.035] py-14">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="min-w-0">
                <p className={KICKER}>From the app</p>
                <h2 id="from-the-app" className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-white">The magazine you carry</h2>
                <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-white/65">
                  Plutto is set like this too: a new issue every day, written for one reader from their own sky. Tap a page to open it.
                </p>
              </div>
              <Link href="/app" className="inline-flex h-12 items-center justify-center bg-white px-6 font-mono text-[12px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90">
                Open Plutto
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-10 max-w-6xl">
            <div className="flex snap-x scroll-px-6 gap-7 overflow-x-auto px-6 pb-4 [scrollbar-width:thin]">
              {APP_PAGES.map((p) => <AppPage key={p.key} k={p.key} />)}
            </div>
          </div>
        </section>

        <section aria-labelledby="in-this-issue" className="mx-auto mt-20 max-w-6xl px-6">
          <div className="flex items-baseline justify-between border-b border-white pb-3">
            <h2 id="in-this-issue"><span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white">In this issue</span></h2>
          </div>
          <div className="mt-10"><ArticleCard a={lead} wide /></div>
          <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {grid.map((a) => <ArticleCard key={a.slug} a={a} />)}
          </div>
        </section>

        <section aria-labelledby="margins" className="mx-auto mt-24 max-w-6xl px-6">
          <div className="border-t-2 border-white pt-10">
            <p className={KICKER}>From the margins</p>
            <h2 id="margins" className="mt-3 font-display text-[clamp(1.9rem,4vw,3rem)] leading-[1.05] text-white">Worth knowing</h2>
          </div>
          <ol className="mt-10 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {ARTICLES.map((a, i) => {
              const fact = a.body.find((b) => b.fact)?.fact;
              if (!fact) return null;
              return (
                <li key={a.slug} className="grid grid-cols-[2.4rem_1fr] gap-3">
                  <span className="font-display text-[30px] leading-none text-white/35" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="min-w-0">
                    <p className="text-[17px] leading-[1.6] text-white/85">{fact}</p>
                    <Link href={`/magazine/${a.slug}`} className={`mt-2 inline-block text-[14px] ${LINK}`}>{a.title}</Link>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="mx-auto mt-24 max-w-6xl px-6 pb-24">
          <div className="border-t border-white/[0.15] pt-12">
            <p className="max-w-2xl font-display text-[clamp(1.6rem,3vw,2.2rem)] leading-[1.15] text-white">
              The sky has been asked questions for as long as there has been writing. Ask it yours.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/app" className="inline-flex h-12 items-center justify-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-opacity hover:opacity-90">
                Open Plutto in this browser
              </Link>
              <Link href="/traditions" className={LINK}>The traditions, one by one</Link>
              <Link href="/sky-calendar" className={LINK}>The sky calendar</Link>
            </div>
            <p className="mt-12 text-[13px] text-white/40">
              Plutto presents these traditions for reflection; it does not claim that astrology predicts events. Pictures are
              public domain or openly licensed, credited on each story.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
