/**
 * /editorial-standards — THE METHOD (the nav's "Method"): every system Plutto reads,
 * what each is read from and what it rests on (app/lib/method.js, written from the
 * backend's provenance registry), then how the site's own pages are written and how
 * to report a mistake. Search engines and answer engines weigh a source by whether
 * it says who stands behind it and how it checks itself; this page is that
 * statement, named as the organization's publishingPrinciples in the JSON-LD.
 */
import Link from 'next/link';
import { pageMeta, breadcrumbLd, JsonLd, abs, SITE } from '../../lib/seo';
import { UPDATED } from '../../lib/guides';
import { Doc, LINK, MONO } from '../../components/site/Doc';
import { METHOD, FROM, EVIDENCE } from '../../lib/method';

const PATH = '/editorial-standards';
const TITLE = 'Method and Sources';
const DESC = 'Every tradition Plutto reads, what each one is read from and the classical works it rests on; how the astronomy is computed, how AI is used, and how to report a correction.';

export const metadata = pageMeta({ title: TITLE, description: DESC, path: PATH });

// The site's own pages and calculators (the app's systems are in app/lib/method.js).
const SOURCES = [
  ['Astronomy', 'Swiss Ephemeris (Astrodienst), for every planetary position, house cusp and ayanamsa. Vedic charts use the Lahiri ayanamsa; KP the Krishnamurti ayanamsa with Placidus cusps; Western charts the tropical zodiac with Placidus houses.'],
  ['Vedic astrology (Jyotish)', 'Brihat Parashara Hora Shastra for the grahas, nakshatras, the Vimshottari dasha and the vargas; Phaladeepika and Saravali for yogas and interpretation.'],
  ['KP astrology', 'K. S. Krishnamurti’s KP Readers, for the sub-lord theory, the 249 divisions and horary by number.'],
  ['Western astrology', 'Ptolemy’s Tetrabiblos for the signs, rulerships and dignities, read beside the modern psychological tradition.'],
  ['Chinese astrology (BaZi)', 'The Zi Ping method (Yuan Hai Zi Ping) for the Four Pillars, with the solar-term calendar, so the year turns at Li Chun rather than on 1 January.'],
  ['Numerology', 'Pythagorean letter values for the life path and name numbers; Cheiro’s Chaldean table for Chaldean name numbers; Ank Jyotish for the Indian moolank and bhagyank.'],
  ['Kundli matching', 'The classical Ashtakoota tables as the standard references publish them (Drik Panchang’s Ashtakuta tutorials and the widely reproduced koota tables) — every table is printed on the calculator’s page, with the choices where schools differ.'],
  ['Sky calendar and Sade Sati', 'Retrograde stations, eclipses, sign ingresses and Saturn’s movements for Sade Sati are generated with Swiss Ephemeris itself (scripts/ephemeris.py), sidereal positions exactly as the app computes them — Lahiri ayanamsa, Rahu as the true node, with the mean node shown beside it.'],
  ['The calculators', 'The Moon sign and Chinese zodiac calculators compute in your browser with astronomy-engine (MIT licence), using the Lahiri ayanamsa and ΔT of Swiss Ephemeris itself; tested against Swiss Ephemeris on 5,000 random moments from 1900 to 2100, the Moon agreed within 4.2 arcseconds. Birth times are converted with the IANA time-zone history your browser ships. The sign-ingress and Li Chun times on the reference pages are computed the same way.'],
];

export default function Page() {
  const page = {
    '@context': 'https://schema.org', '@type': 'WebPage', name: TITLE, url: abs(PATH), description: DESC,
    dateModified: UPDATED, publisher: { '@id': `${SITE.url}/#organization` }, inLanguage: 'en',
  };
  return (
    <>
      <JsonLd data={page} />
      <JsonLd data={breadcrumbLd([{ name: 'Method', path: PATH }])} />
      <Doc eyebrow="Method" title="Every system, and what it rests on" crumbs={[{ name: 'Method', path: PATH }]}>
        <p className="speakable !mt-0 max-w-2xl text-[19px] leading-[1.65] text-white/85">
          Each tradition in Plutto is read by its own rules, from its own classical sources, and named as its own people name it. The astronomy is computed, never estimated; the interpretations are the traditions’ own; and nothing here is presented as science or as advice.
        </p>
        <p>
          Below is every system the app reads, what a reading needs from you, and the works and conventions it is built on. Where a system is modern, it is dated as modern. Where something cannot honestly be computed, it is taught instead, and the page says so.
        </p>

        <nav aria-label="Regions" className="!mt-10 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {METHOD.map((r) => <a key={r.id} href={`#${r.id}`} className={LINK}>{r.title}</a>)}
        </nav>

        {METHOD.map((r) => (
          <section key={r.id} id={r.id} className="scroll-mt-24">
            <h2>{r.title}</h2>
            {r.lead ? <p>{r.lead}</p> : null}
            <dl className="mt-6 divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {r.items.map((t) => (
                <div key={t.name} className="grid grid-cols-1 gap-2 py-5 md:grid-cols-12 md:gap-6">
                  <dt className="min-w-0 md:col-span-4">
                    <span className="block text-[16px] font-semibold leading-snug text-white">{t.name}</span>
                    <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/45">{FROM[t.from]}</span>
                  </dt>
                  <dd className="min-w-0 text-[15px] leading-[1.65] text-white/65 md:col-span-8">{t.basis}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}

        <h2>What the tests found</h2>
        <p>
          The published tests are kept beside the methods, the negative results included: {EVIDENCE} Knowing where a method comes from says nothing about whether it works, and Plutto never claims that it does.
        </p>

        <h2>What we stand behind</h2>
        <p>The positions are exact: they come from Swiss Ephemeris, the same astronomical library professional astrology software is built on. The calculators show their working, so any result can be checked by hand.</p>
        <p>The meanings are the traditions’ own, stated as what the tradition holds — “Vedic astrology reads the Moon’s nakshatra as…”, not “you are…”. Where traditions disagree, we say so and name both.</p>

        <h2>What we do not claim</h2>
        <p>Astrology is not a science, and Plutto does not claim to predict the future. No page gives medical, legal or financial advice. We publish no ratings, review counts or user numbers until there are real ones to publish.</p>

        <h2>How AI is used</h2>
        <p>Readings inside the app are generated by AI language models from your computed chart: the positions are calculated first, and the model interprets them within the tradition you choose. The spoken voice is AI as well. The pages on this site are drafted with AI assistance, then edited and checked against the sources below.</p>

        <h2>On this site</h2>
        <p>The guides, reference pages and free calculators on plutto.space rest on these.</p>
        <dl className="mt-6 max-w-2xl divide-y divide-white/[0.07] border-y border-white/[0.07]">
          {SOURCES.map(([k, v]) => (
            <div key={k} className="py-4">
              <dt className="font-semibold text-white">{k}</dt>
              <dd className="mt-1">{v}</dd>
            </div>
          ))}
        </dl>

        <h2>Corrections</h2>
        <p>
          Found a mistake — a wrong degree, a misattributed meaning, a calculation that disagrees with yours? Write to{' '}
          <a href={`mailto:${SITE.email}?subject=Correction`} className={LINK}>{SITE.email}</a> with the page and what you found. We fix factual errors and update the page’s date.
        </p>
        <p>Last reviewed {new Date(UPDATED).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>

        <p className={`!mt-12 ${MONO}`}>Read on</p>
        <p className="!mt-3">
          <Link href="/traditions" className={LINK}>The traditions, by region</Link> · <Link href="/guides" className={LINK}>Guides</Link> · <Link href="/tools" className={LINK}>Calculators</Link> · <Link href="/faq" className={LINK}>FAQ</Link> · <Link href="/about" className={LINK}>How it works</Link>
        </p>
      </Doc>
    </>
  );
}
