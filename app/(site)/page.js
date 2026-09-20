/**
 * THE LANDING PAGE.
 *
 * The argument it makes, in order, because the order is the design:
 *
 *  1. THE SKY IS REAL AND IT IS MOVING. The moon at the top is computed in the
 *     reader's browser for the minute they arrived. Before a single claim is
 *     made, something on the page is demonstrably true right now.
 *  2. THE TRADITIONS DISAGREE. The objection every sceptical reader already
 *     has — "they can't all be right" — is put on the page in the reader's own
 *     words, in the third section, before they can raise it. Plutto's answer is
 *     not that one tradition wins; it is that you get to see the argument. An
 *     objection you raise yourself and answer honestly converts; one you dodge
 *     is the reason the reader leaves.
 *  3. THE LIBRARY IS ENORMOUS. A hundred and two real traditions with their
 *     real cities, moving past faster than they can be read. The number is
 *     the claim; the unreadable roll is the proof.
 *  4. IT ANSWERS. The exchange types itself. No screenshot, no mockup, no
 *     phone-in-a-hand render — the interaction, running.
 *  5. THE NUMBERS. Four, large, in the display face. Credibility, cheap.
 *  6. ONE DOOR. Open it in the browser, or take the app.
 *
 * Five type registers do five jobs and never swap: Julius (display caps) for
 * headlines, Instrument Serif for anything the Oracle says or a tradition is
 * named in, JetBrains Mono for instruments and labels, DM Sans for prose,
 * Josefin for the mark alone. Gold is used on this page in single strokes —
 * a rule, a word, the rim of the moon — and nowhere as a fill.
 */

import Link from 'next/link';
import Starfield from '../components/Starfield';
import StoreBadges from '../components/StoreBadges';
import FadeUp from '../components/FadeUp';
import MoonNow from '../components/site/MoonNow';
import RollCall from '../components/site/RollCall';
import Ask from '../components/site/Ask';
import Astrolabe from '../components/site/Astrolabe';

const MONO = 'font-mono uppercase text-[0.7rem] tracking-[0.32em] text-[#8A8A8E]';

/** A section's label. Always mono, always the same size: the page's furniture. */
function Eyebrow({ children, className = '' }) {
  return <p className={`${MONO} ${className}`}>{children}</p>;
}

export default function Home() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ───────────────────────── 1 · HERO ───────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 md:pb-28 md:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <FadeUp>
                <Eyebrow>Est. the first night someone counted stars</Eyebrow>
              </FadeUp>

              <FadeUp delay={0.08}>
                {/* Three lines, three registers. The eye reads the caps as a
                    structure, drops into the serif as into a sentence, and is
                    caught by the third line, which is the whole proposition. */}
                <h1 className="mt-7">
                  <span
                    className="block font-display uppercase text-[#F0F0F0]"
                    style={{ fontSize: 'clamp(1.6rem,4.6vw,3.1rem)', lineHeight: 1.18, letterSpacing: '0.3em' }}
                  >
                    The Same Sky
                  </span>
                  <span
                    className="mt-3 block font-editorial italic text-[#D8D8D8]"
                    style={{ fontSize: 'clamp(2rem,5.6vw,3.7rem)', lineHeight: 1.08, maxWidth: '14ch' }}
                  >
                    read a hundred and two ways
                  </span>
                  <span
                    className="mt-5 block font-display uppercase text-[#D4AF37]"
                    style={{ fontSize: 'clamp(0.82rem,1.7vw,1.06rem)', letterSpacing: '0.34em' }}
                  >
                    and no two agree
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p data-no-auto-case className="mt-9 max-w-xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                  Plutto computes the real geometry of your moment — Swiss
                  Ephemeris, the same source observatories use — and then reads
                  it back to you through the tradition you choose. Vedic.
                  Western. Chinese. Yorùbá. Maya. Out loud, in your language,
                  in plain words you can argue with.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="mt-11 flex flex-wrap items-center gap-4">
                  <Link
                    href="/app"
                    data-no-binary
                    className="cta-glow inline-flex items-center justify-center rounded-md bg-[#F0F0F0] px-8 py-4 font-body text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]"
                  >
                    Open the Oracle
                  </Link>
                  <Link
                    href="/about"
                    data-no-binary
                    className="inline-flex items-center rounded-md border border-white/15 px-7 py-4 font-body text-[0.78rem] uppercase tracking-[0.22em] text-[#D8D8D8] transition-colors hover:border-[#D4AF37]/45 hover:text-[#F0F0F0]"
                  >
                    How it works
                  </Link>
                </div>
                <p className="mt-5 font-mono text-[0.64rem] uppercase tracking-[0.26em] text-[#6E6E72]">
                  No install. Works in this browser.
                </p>
              </FadeUp>
            </div>

            <div className="flex justify-center md:col-span-5">
              <FadeUp delay={0.14}>
                <div data-no-binary>
                  <MoonNow size={300} />
                </div>
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ───────────────────── 2 · THE DISAGREEMENT ───────────────── */}
        <section className="border-t border-white/[0.07] bg-[#050509]/40">
          <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
            <FadeUp>
              <Eyebrow>One hour · three verdicts</Eyebrow>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-7 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.14 }}
              >
                Tuesday, ten past four.
                <span data-no-auto-case className="text-[#8A8A8E]"> Every tradition below is
                looking at exactly the same sky.</span>
              </h2>
            </FadeUp>

            <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
              <Verdict
                lens="Vedic · Parāśara"
                reading="Moon in Āśleṣā, its lord in the eighth."
                verdict="Hold the news. Nothing signed today."
                voice="serif"
              />
              <Verdict
                lens="Hellenistic · Tropical"
                reading="Mercury cazimi. Ascendant Libra, ruler angular."
                verdict="The best hour this month to speak."
                voice="mono"
              />
              <Verdict
                lens="Chinese · BaZi"
                reading="丙午 hour. Fire sitting on fire, no water in sight."
                verdict="Heat. Useful only if you can aim it."
                voice="mark"
                glyph="午"
              />
            </div>

            <FadeUp delay={0.15}>
              <p data-no-auto-case className="mt-12 max-w-2xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                Three thousand years of careful people, looking at one afternoon,
                reaching three different answers.{' '}
                <span data-no-auto-case className="text-[#F0F0F0]">
                  Plutto does not quietly pick one for you.
                </span>{' '}
                It computes all of them, tells you which lens it is speaking
                through, and lets you change lenses mid-sentence. The
                disagreement is not the bug in astrology. It is the only
                interesting thing in it.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 3 · THE ROLL-CALL ───────────────────── */}
        <section className="pb-16 pt-24 md:pb-20 md:pt-32">
          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <Eyebrow>The library</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2
                className="mt-7 max-w-2xl font-display uppercase text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.15rem,2.5vw,1.7rem)', lineHeight: 1.5, letterSpacing: '0.26em' }}
              >
                A hundred and two ways
                <br />
                of telling time
              </h2>
            </FadeUp>
          </div>

          <div className="mt-14 border-y border-white/[0.07] py-6" data-no-binary>
            <RollCall />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <FadeUp>
              <p data-no-auto-case className="mt-12 max-w-2xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                Each one is pinned to the city it was written in, on a globe you
                can turn. Every one of them was somebody&apos;s astronomy, kept
                by somebody&apos;s grandmother, and most of them have never been
                computed by anything before.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 4 · THE EXCHANGE ───────────────────── */}
        <section className="border-t border-white/[0.07] bg-[#050509]/40">
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
            <FadeUp>
              <Eyebrow>Ask it anything</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-7 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.14 }}
              >
                It is not a horoscope.
                <span data-no-auto-case className="text-[#8A8A8E]"> It is a voice that has read
                the chart and will answer the question you actually asked.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.16}>
              <div className="mt-14" data-no-binary>
                <Ask />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 5 · THE NUMBERS ───────────────────── */}
        <section className="pb-16 pt-24 md:pb-24 md:pt-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 gap-14 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-7">
                <FadeUp>
                  <Eyebrow>What is inside</Eyebrow>
                </FadeUp>

                <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12">
                  <Number n="79" label="Readings" note="Daily, yearly, natal, electional, synastry — each one computed, none of them written in advance." />
                  <Number n="102" label="Traditions" note="Named as their own people name them, pinned where they were written." />
                  <Number n="100+" label="Languages" note="The Oracle speaks the one your phone is already in." />
                  <Number n="19" label="Divisional charts" note="Vargas, yogas, dashās — the exact machinery, not a summary of it." />
                </dl>

                {/* Kept deliberately short and deliberately plain. Google's
                    OAuth brand verification rejected this page once for not
                    saying what the app does; this paragraph is the anchor that
                    keeps it from happening again if the brand is re-audited.
                    Do not remove without checking the consent screen still
                    reads "Plutto" rather than the raw Supabase host. */}
                <FadeUp delay={0.1}>
                  <div className="mt-16 border-l border-[#D4AF37]/30 pl-6">
                    <Eyebrow>What Plutto is</Eyebrow>
                    <p data-no-auto-case className="mt-5 max-w-xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                      An astrology oracle, and a voice you can argue with. You
                      give it a date, a time, a place; it computes the geometry
                      of that moment and talks to you about it — out loud, in
                      your language.
                    </p>
                  </div>
                </FadeUp>
              </div>

              <div className="flex items-center justify-center md:col-span-5">
                <FadeUp delay={0.18}>
                  <Astrolabe size={400} />
                </FadeUp>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────── 6 · THE DOOR ───────────────────── */}
        <section className="border-t border-white/[0.07]">
          <div className="mx-auto max-w-4xl px-6 py-28 text-center md:py-36">
            <FadeUp>
              <p
                data-no-auto-case
                className="font-editorial italic text-[#F0F0F0]"
                style={{ fontSize: 'clamp(2.2rem,7vw,4.6rem)', lineHeight: 1.05 }}
              >
                We&apos;ve always looked up.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <p data-no-auto-case className="mx-auto mt-7 max-w-md font-body text-[1.02rem] leading-[1.7] text-[#8A8A8E]">
                Now there is something up there that answers.
              </p>
            </FadeUp>

            <FadeUp delay={0.2}>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/app"
                  data-no-binary
                  className="cta-glow inline-flex items-center justify-center rounded-md bg-[#F0F0F0] px-9 py-4 font-body text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]"
                >
                  Open it in this browser
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.3}>
              <div className="mt-20 border-t border-white/[0.07] pt-16">
                <StoreBadges />
              </div>
            </FadeUp>
          </div>
        </section>
      </div>
    </>
  );
}

/**
 * One tradition's verdict on the shared hour.
 *
 * Each card is set in a different face, and that is the argument made without
 * a sentence: these are not three skins on one engine, they are three ways of
 * thinking that do not share a vocabulary. `serif` is the voice of a text,
 * `mono` of an instrument, `mark` of a character older than either.
 */
function Verdict({ lens, reading, verdict, voice, glyph }) {
  const body = {
    serif: 'font-editorial text-[1.32rem] leading-[1.5] italic',
    mono: 'font-mono text-[0.94rem] leading-[1.7] uppercase tracking-[0.06em]',
    mark: 'font-mark font-light text-[1.12rem] leading-[1.7] uppercase tracking-[0.22em]',
  }[voice];

  return (
    <div className="relative overflow-hidden bg-[#08080D] p-8 md:p-10">
      {glyph ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-editorial text-[14rem] leading-none text-white/[0.045]"
        >
          {glyph}
        </span>
      ) : null}

      <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#D4AF37]/70">
        {lens}
      </p>

      <p data-no-auto-case className="mt-7 min-h-[4.4em] font-body text-[0.92rem] leading-[1.7] text-[#8A8A8E]">
        {reading}
      </p>

      <div className="my-7 h-px w-10 bg-white/20" />

      <p data-no-auto-case className={`${body} text-[#F0F0F0]`}>{verdict}</p>
    </div>
  );
}

/** A large numeral and what it counts. */
function Number({ n, label, note }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span
          className="block font-display tabular-nums text-[#F0F0F0]"
          style={{ fontSize: 'clamp(2.4rem,5.4vw,3.6rem)', lineHeight: 1, letterSpacing: '-0.01em' }}
        >
          {n}
        </span>
        <span className="mt-4 block font-mono text-[0.66rem] uppercase tracking-[0.3em] text-[#D4AF37]/70">
          {label}
        </span>
        <span data-no-auto-case className="mt-4 block max-w-[24ch] font-body text-[0.9rem] leading-[1.65] text-[#8A8A8E]">
          {note}
        </span>
      </dd>
    </div>
  );
}
