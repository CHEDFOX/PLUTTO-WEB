/**
 * THE LANDING PAGE — the world's divination library, with the lights on.
 *
 * THE POSITION. Not "an astrology app": a collection. A hundred and two
 * traditions, filed on twelve shelves, every one of them computed. That is a
 * claim no competitor can copy in a quarter, so the page leads with it and the
 * design serves it — the centrepiece is the shelf itself.
 *
 * THE COLOUR. Twelve hues, one per shelf, taken from the backend's own regions
 * (see lib/traditions.js). Colour here is information: a spine's hue says where
 * it is filed, and the wall of them sorts itself into bands before a word is
 * read. Behind the type sit room-sized washes of the same hues at a few
 * percent. Gold is not part of that palette — it stays the brand's own accent,
 * spent on one thing per screen.
 *
 * THE COPY. Every block is a headline and, at most, one line under it. The
 * library is the argument; prose explaining the library would only get in its
 * way. Nothing here says in twenty words what it can say in eight.
 *
 * Five faces, five jobs: Julius (display caps) for structure, Instrument Serif
 * for anything the Oracle or a tradition says, JetBrains Mono for instruments
 * and labels, DM Sans for the few lines of prose, Josefin for the mark.
 */

import Link from 'next/link';
import Starfield from '../components/Starfield';
import StoreBadges from '../components/StoreBadges';
import FadeUp from '../components/FadeUp';
import MoonNow from '../components/site/MoonNow';
import Shelf from '../components/site/Shelf';
import Ask from '../components/site/Ask';
import Aurora from '../components/site/Aurora';
import { SHELF_COLOR } from '../lib/traditions';

const MONO = 'font-mono uppercase text-[0.7rem] tracking-[0.32em] text-[#8A8A8E]';

function Eyebrow({ children }) {
  return <p className={MONO}>{children}</p>;
}

export default function Home() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ───────────────────────── 1 · HERO ───────────────────────── */}
        <section className="relative overflow-hidden pb-20 pt-10 md:pb-28 md:pt-20">
          <Aurora
            blobs={[
              { color: SHELF_COLOR.persia, x: '8%', y: '18%', size: 620, opacity: 0.2 },
              { color: SHELF_COLOR.china, x: '62%', y: '4%', size: 460, opacity: 0.14 },
              { color: SHELF_COLOR.sky, x: '84%', y: '72%', size: 560, opacity: 0.16 },
            ]}
          />

          <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <FadeUp>
                <Eyebrow>The world&apos;s divination library</Eyebrow>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1 className="mt-7">
                  <span
                    className="block font-display uppercase text-[#F0F0F0]"
                    style={{ fontSize: 'clamp(1.15rem,2.9vw,1.95rem)', lineHeight: 1.25, letterSpacing: '0.3em' }}
                  >
                    One hundred and two
                  </span>
                  {/* The only place on the page where colour is type: the
                      spectrum runs through the library's own twelve hues. */}
                  <span
                    data-no-auto-case
                    className="mt-3 block bg-clip-text font-editorial italic text-transparent"
                    style={{
                      fontSize: 'clamp(1.95rem,4.7vw,3.5rem)',
                      lineHeight: 1.08,
                      whiteSpace: 'nowrap',
                      backgroundImage: `linear-gradient(94deg, ${SHELF_COLOR.south_asia} 6%, ${SHELF_COLOR.east_asia} 54%, ${SHELF_COLOR.pacific} 96%)`,
                    }}
                  >
                    ways to read tonight
                  </span>
                  <span
                    className="mt-5 block font-display uppercase text-[#D4AF37]"
                    style={{ fontSize: 'clamp(0.8rem,1.6vw,1rem)', letterSpacing: '0.34em' }}
                  >
                    All of them computed
                  </span>
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p data-no-auto-case className="mt-9 max-w-md font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                  Your sky, to the arc-second — read by whichever tradition you
                  ask for. Out loud, in your language.
                </p>
              </FadeUp>

              <FadeUp delay={0.3}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
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

        {/* ───────────────────────── 2 · THE SHELF ──────────────────── */}
        <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#050509]/40">
          <Aurora
            blobs={[
              { color: SHELF_COLOR.americas, x: '18%', y: '88%', size: 760, opacity: 0.13 },
              { color: SHELF_COLOR.east_asia, x: '80%', y: '10%', size: 660, opacity: 0.13 },
            ]}
          />

          <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-20 md:pb-20 md:pt-28">
            <FadeUp>
              <Eyebrow>The collection</Eyebrow>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-6 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.14 }}
              >
                Twelve shelves.
                <span data-no-auto-case className="text-[#8A8A8E]"> A hundred and
                two spines.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.16}>
              <div className="mt-14" data-no-binary>
                <Shelf />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 3 · THE DISAGREEMENT ───────────────── */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <FadeUp>
              <Eyebrow>One hour · three verdicts</Eyebrow>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-6 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.14 }}
              >
                Tuesday, ten past four.
                <span data-no-auto-case className="text-[#8A8A8E]"> The same sky,
                three times.</span>
              </h2>
            </FadeUp>

            <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
              <Verdict
                lens="Vedic · Parāśara"
                color={SHELF_COLOR.south_asia}
                reading="Moon in Āśleṣā, its lord in the eighth."
                verdict="Hold the news. Nothing signed today."
                voice="serif"
              />
              <Verdict
                lens="Hellenistic · Tropical"
                color={SHELF_COLOR.sky}
                reading="Mercury cazimi. Ascendant Libra, ruler angular."
                verdict="The best hour this month to speak."
                voice="mono"
              />
              <Verdict
                lens="Chinese · BaZi"
                color={SHELF_COLOR.china}
                reading="丙午 hour. Fire on fire, no water in sight."
                verdict="Heat. Useful only if you can aim it."
                voice="mark"
                glyph="午"
              />
            </div>

            <FadeUp delay={0.15}>
              <p data-no-auto-case className="mt-10 max-w-xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                <span data-no-auto-case className="text-[#F0F0F0]">
                  Plutto never picks for you.
                </span>{' '}
                It names the lens and shows you the argument.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 4 · THE EXCHANGE ───────────────────── */}
        <section className="relative overflow-hidden border-t border-white/[0.07] bg-[#050509]/40">
          <Aurora
            blobs={[
              { color: SHELF_COLOR.letters, x: '12%', y: '20%', size: 560, opacity: 0.14 },
              { color: SHELF_COLOR.folk, x: '88%', y: '80%', size: 520, opacity: 0.12 },
            ]}
          />

          <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
            <FadeUp>
              <Eyebrow>Ask it anything</Eyebrow>
            </FadeUp>
            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-6 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,4.4vw,3.2rem)', lineHeight: 1.14 }}
              >
                Not a horoscope.
                <span data-no-auto-case className="text-[#8A8A8E]"> A voice that
                has read your chart.</span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.16}>
              <div className="mt-12" data-no-binary>
                <Ask />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 5 · THE NUMBERS ───────────────────── */}
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <FadeUp>
              <Eyebrow>What is inside</Eyebrow>
            </FadeUp>

            <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
              <Number n="102" label="Traditions" note="Every continent." color={SHELF_COLOR.south_asia} />
              <Number n="79" label="Readings" note="None written in advance." color={SHELF_COLOR.china} />
              <Number n="100+" label="Languages" note="Yours is one." color={SHELF_COLOR.sky} />
              <Number n="19" label="Vargas" note="The machinery itself." color={SHELF_COLOR.americas} />
            </dl>

            {/* Kept deliberately plain. Google's OAuth brand verification
                rejected this page once for not saying what the app does; this
                paragraph is the anchor that keeps it from happening again if
                the brand is re-audited. Do not remove without checking the
                consent screen still reads "Plutto" rather than the raw
                Supabase host. */}
            <FadeUp delay={0.12}>
              <div className="mt-16 border-l border-[#D4AF37]/30 pl-6">
                <Eyebrow>What Plutto is</Eyebrow>
                <p data-no-auto-case className="mt-4 max-w-xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                  An astrology oracle you can talk back to. Give it a date, a
                  time and a place; it computes that moment&apos;s geometry and
                  reads it to you out loud, in your language.
                </p>
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── 6 · THE DOOR ───────────────────── */}
        <section className="relative overflow-hidden border-t border-white/[0.07]">
          <Aurora
            blobs={[{ color: SHELF_COLOR.persia, x: '50%', y: '30%', size: 820, opacity: 0.15 }]}
          />

          <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
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
              <p data-no-auto-case className="mx-auto mt-6 font-body text-[1.02rem] text-[#8A8A8E]">
                Now something answers.
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
 * Three faces and three colours, because these are not three skins on one
 * engine — they are three ways of thinking that do not share a vocabulary. The
 * colour is the shelf each one is filed on, the same hue its spine carries.
 */
function Verdict({ lens, color, reading, verdict, voice, glyph }) {
  const body = {
    serif: 'font-editorial text-[1.32rem] leading-[1.5] italic',
    mono: 'font-mono text-[0.94rem] leading-[1.7] uppercase tracking-[0.06em]',
    mark: 'font-mark font-light text-[1.12rem] leading-[1.7] uppercase tracking-[0.22em]',
  }[voice];

  return (
    <div className="relative overflow-hidden bg-[#08080D] p-8 md:p-10">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />
      {glyph ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-10 top-1/2 -translate-y-1/2 select-none font-editorial text-[14rem] leading-none"
          style={{ color: `${color}14` }}
        >
          {glyph}
        </span>
      ) : null}

      <p className="font-mono text-[0.62rem] uppercase tracking-[0.3em]" style={{ color }}>
        {lens}
      </p>

      <p data-no-auto-case className="mt-7 min-h-[4.4em] font-body text-[0.92rem] leading-[1.7] text-[#8A8A8E]">
        {reading}
      </p>

      <div className="my-7 h-px w-10" style={{ background: `${color}66` }} />

      <p data-no-auto-case className={`${body} text-[#F0F0F0]`}>{verdict}</p>
    </div>
  );
}

/** A large numeral and what it counts. */
function Number({ n, label, note, color }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span
          className="block font-display tabular-nums"
          style={{ fontSize: 'clamp(2.4rem,5.4vw,3.6rem)', lineHeight: 1, color }}
        >
          {n}
        </span>
        <span className="mt-4 block font-mono text-[0.66rem] uppercase tracking-[0.3em] text-[#F0F0F0]">
          {label}
        </span>
        <span data-no-auto-case className="mt-3 block font-body text-[0.9rem] leading-[1.65] text-[#8A8A8E]">
          {note}
        </span>
      </dd>
    </div>
  );
}
