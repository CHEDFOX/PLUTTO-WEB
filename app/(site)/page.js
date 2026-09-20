/**
 * THE LANDING PAGE — minimal.
 *
 * WHAT WAS WRONG. The page had grown six sections, coloured washes behind every
 * one of them, cards with borders and watermarks, a four-up grid of numerals, a
 * rotating instrument and a rainbow headline. Every element was defensible and
 * together they were noise: a reader cannot be impressed by ten things at once,
 * and a page that shouts has to be read rather than felt.
 *
 * THE RULE NOW: one thing per screen, and the thing is large.
 *
 *   1 · a sentence and a planet
 *   2 · the collection, as a shelf
 *   3 · three oracles disagreeing, as three lines
 *   4 · the Oracle answering, as type on black
 *   5 · the moon tonight, and a door
 *
 * Everything else was cut: the colour washes, the card chrome, the instrument,
 * the numbers grid (now one hairline row of four facts), the second and third
 * lines of every paragraph. Colour survives in exactly one place — the spines,
 * where it carries meaning — plus the three oracle labels, which are the same
 * hues quoting the same shelves. Gold appears once per screen at most.
 *
 * The psychology is in the restraint: space reads as confidence, one focal
 * object per screen reads as expensive, and a reader who is never asked to
 * choose where to look keeps scrolling.
 */

import Link from 'next/link';
import Starfield from '../components/Starfield';
import StoreBadges from '../components/StoreBadges';
import FadeUp from '../components/FadeUp';
import MoonNow from '../components/site/MoonNow';
import Shelf from '../components/site/Shelf';
import Ask from '../components/site/Ask';
import PlanetMark from '../components/site/PlanetMark';
import { SHELF_COLOR } from '../lib/traditions';

const MONO = 'font-mono uppercase text-[0.66rem] tracking-[0.34em] text-[#6E6E72]';

const FACTS = [
  ['102', 'Traditions'],
  ['12', 'Shelves'],
  ['79', 'Readings'],
  ['100+', 'Languages'],
];

const ORACLES = [
  {
    name: 'Mérìndínlógún',
    place: 'Ile-Ife',
    color: SHELF_COLOR.africa,
    method: 'Sixteen cowries, thrown once.',
    says: 'Not this road. Ask again at the new moon.',
  },
  {
    name: 'Fāl-e Ḥāfeẓ',
    place: 'Shiraz',
    color: SHELF_COLOR.persia,
    method: 'The poet, opened at random.',
    says: 'Go. The door you fear is open already.',
  },
  {
    name: 'Kau Chim',
    place: 'Quanzhou',
    color: SHELF_COLOR.china,
    method: 'One stick, shaken till it falls.',
    says: 'Wait three days. Then speak first.',
  },
];

export default function Home() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ─────────────────────── 1 · A SENTENCE ─────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-24 pt-8 md:pb-32 md:pt-16">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <FadeUp>
                <p className={MONO}>The divination library</p>
              </FadeUp>

              <FadeUp delay={0.1}>
                <h1
                  data-no-auto-case
                  className="mt-8 font-editorial text-[#F0F0F0]"
                  style={{ fontSize: 'clamp(2.4rem,6.2vw,4.6rem)', lineHeight: 1.04, maxWidth: '12ch' }}
                >
                  A hundred and two ways of asking.
                </h1>
              </FadeUp>

              <FadeUp delay={0.22}>
                <p data-no-auto-case className="mt-8 max-w-[34ch] font-body text-[1.05rem] leading-[1.7] text-[#9A9AA0]">
                  Cards, cowries, coins, stars. Out loud, in your language.
                </p>
              </FadeUp>

              <FadeUp delay={0.32}>
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Link
                    href="/app"
                    data-no-binary
                    className="cta-glow inline-flex items-center justify-center rounded-full bg-[#F0F0F0] px-8 py-[0.95rem] font-body text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[#0A0A0A]"
                  >
                    Ask it something
                  </Link>
                  <Link
                    href="/about"
                    data-no-binary
                    className="font-body text-[0.76rem] uppercase tracking-[0.24em] text-[#8A8A8E] underline-offset-[6px] transition-colors hover:text-[#F0F0F0] hover:underline"
                  >
                    How it works
                  </Link>
                </div>
              </FadeUp>
            </div>

            <div className="flex justify-center md:col-span-5">
              <FadeUp delay={0.16}>
                <PlanetMark name="sun" size={340} className="opacity-95" />
              </FadeUp>
            </div>
          </div>

          {/* The numbers, once, as a rule rather than as a grid of cards. */}
          <FadeUp delay={0.4}>
            <dl className="mt-20 flex flex-wrap items-baseline gap-x-10 gap-y-4 border-t border-white/[0.08] pt-6 md:gap-x-16">
              {FACTS.map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <dt className="font-display text-[1.05rem] text-[#F0F0F0]">{n}</dt>
                  <dd className={MONO}>{label}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>
        </section>

        {/* ─────────────────────── 2 · THE SHELF ─────────────────────── */}
        <section className="border-t border-white/[0.07] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp>
              <h2
                data-no-auto-case
                className="font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', lineHeight: 1.12 }}
              >
                Twelve shelves.
                <span data-no-auto-case className="text-[#6E6E72]"> A hundred and
                two spines.</span>
              </h2>
            </FadeUp>
          </div>

          <FadeUp delay={0.12}>
            <div className="mt-14" data-no-binary>
              <Shelf />
            </div>
          </FadeUp>
        </section>

        {/* ────────────────────── 3 · THREE ORACLES ────────────────────── */}
        <section className="border-t border-white/[0.07] py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <FadeUp>
              <h2
                data-no-auto-case
                className="font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', lineHeight: 1.12 }}
              >
                Ask three.
                <span data-no-auto-case className="text-[#6E6E72]"> They will not
                agree.</span>
              </h2>
            </FadeUp>

            {/* Three lines, not three cards. The border chrome was carrying no
                information the colour of the name did not already carry. */}
            <ul className="mt-14">
              {ORACLES.map((o, i) => (
                <FadeUp key={o.name} delay={0.06 * i}>
                  <li className="grid grid-cols-1 gap-3 border-t border-white/[0.07] py-8 md:grid-cols-12 md:items-baseline md:gap-8">
                    <div className="md:col-span-3">
                      <p
                        data-no-auto-case
                        className="font-mono text-[0.68rem] uppercase tracking-[0.26em]"
                        style={{ color: o.color }}
                      >
                        {o.name}
                      </p>
                      <p className="mt-2 font-mono text-[0.6rem] uppercase tracking-[0.26em] text-[#5E5E64]">
                        {o.place}
                      </p>
                    </div>

                    <p data-no-auto-case className="font-body text-[0.92rem] leading-[1.7] text-[#6E6E72] md:col-span-3">
                      {o.method}
                    </p>

                    <p
                      data-no-auto-case
                      className="font-editorial italic text-[#F0F0F0] md:col-span-6"
                      style={{ fontSize: 'clamp(1.2rem,2.2vw,1.55rem)', lineHeight: 1.35 }}
                    >
                      {o.says}
                    </p>
                  </li>
                </FadeUp>
              ))}
            </ul>

            <FadeUp delay={0.2}>
              <p data-no-auto-case className="mt-10 max-w-[44ch] font-body text-[1rem] leading-[1.7] text-[#9A9AA0]">
                <span data-no-auto-case className="text-[#F0F0F0]">
                  Plutto never picks for you.
                </span>{' '}
                It names the oracle and shows you the argument.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ─────────────────────── 4 · THE ANSWER ─────────────────────── */}
        <section className="border-t border-white/[0.07] py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <FadeUp>
              <h2
                data-no-auto-case
                className="font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', lineHeight: 1.12 }}
              >
                Then argue with it.
              </h2>
            </FadeUp>

            <FadeUp delay={0.12}>
              <div className="mt-12" data-no-binary>
                <Ask />
              </div>
            </FadeUp>
          </div>
        </section>

        {/* ─────────────────────── 5 · TONIGHT ─────────────────────── */}
        <section className="border-t border-white/[0.07] py-20 text-center md:py-28">
          <div className="mx-auto max-w-4xl px-6">
            <FadeUp>
              <div className="flex justify-center" data-no-binary>
                <MoonNow size={190} />
              </div>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p
                data-no-auto-case
                className="mt-14 font-editorial italic text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,5.4vw,3.4rem)', lineHeight: 1.06 }}
              >
                We&apos;ve always looked up.
              </p>
            </FadeUp>

            <FadeUp delay={0.22}>
              <div className="mt-10 flex justify-center">
                <Link
                  href="/app"
                  data-no-binary
                  className="cta-glow inline-flex items-center justify-center rounded-full bg-[#F0F0F0] px-9 py-[0.95rem] font-body text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[#0A0A0A]"
                >
                  Open it in this browser
                </Link>
              </div>
            </FadeUp>

            {/* Kept deliberately plain. Google's OAuth brand verification
                rejected this page once for not saying what the app does; this
                sentence is the anchor that keeps it from happening again if the
                brand is re-audited. Do not remove without checking the consent
                screen still reads "Plutto" rather than the raw Supabase host. */}
            <FadeUp delay={0.3}>
              <p data-no-auto-case className="mx-auto mt-16 max-w-[52ch] font-body text-[0.92rem] leading-[1.75] text-[#5E5E64]">
                Plutto is an astrology oracle you can talk back to. Give it a
                date, a time and a place; it works out where the sky stood and
                reads it to you out loud, in your language.
              </p>
            </FadeUp>

            <FadeUp delay={0.38}>
              <div className="mt-14 border-t border-white/[0.07] pt-12">
                <StoreBadges />
              </div>
            </FadeUp>
          </div>
        </section>
      </div>
    </>
  );
}
