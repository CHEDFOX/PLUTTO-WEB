/**
 * THE LANDING PAGE — the divination library, shown with its own cards.
 *
 * WHY THE EARLIER VERSIONS MISSED. Every one of them was type, hairlines and
 * abstract objects — a drawn moon, a shelf of coloured bars, an astrolabe. A
 * visitor never once saw the thing they would get. The app deals real cards
 * from real decks, and those files were sitting in the backend the whole time.
 * They are the picture now.
 *
 * ONE THING PER SCREEN:
 *   1 · a fan of real cards, with the Moon, the Star and the Sun in colour
 *   2 · six decks face down — tap one and it turns over
 *   3 · the five sky systems, as the app's own round art
 *   4 · the Oracle answering
 *   5 · a door
 *
 * THE PSYCHOLOGY is in section 2. A card turned over is a small reward that
 * varies, so people turn another; and it arrives with its name but not its
 * meaning, which is a question left open. The meaning is in the app. Every
 * other section is there to be read in a second.
 *
 * COLOUR comes from the tarot's own 1909 inks — the only vivid thing on a black
 * page, which is why it reads as vivid. Gold stays the brand's accent and is
 * used once.
 */

import Link from 'next/link';
import Starfield from '../components/Starfield';
import StoreBadges from '../components/StoreBadges';
import FadeUp from '../components/FadeUp';
import Fan from '../components/site/Fan';
import Draw from '../components/site/Draw';
import Ask from '../components/site/Ask';

const MONO = 'font-mono uppercase text-[0.66rem] tracking-[0.34em] text-[#6E6E72]';

const SYSTEMS = [
  { id: 'vedic', name: 'Vedic' },
  { id: 'western', name: 'Western' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'kp', name: 'KP' },
  { id: 'numerology', name: 'Numerology' },
];

function H2({ children }) {
  return (
    <h2
      data-no-auto-case
      className="text-center font-editorial text-[#F0F0F0]"
      style={{ fontSize: 'clamp(1.9rem,4.2vw,3rem)', lineHeight: 1.1 }}
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ─────────────────────── 1 · THE HAND ─────────────────────── */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-20 pt-8 text-center md:pb-24 md:pt-10">
          <FadeUp>
            <p className={MONO}>The divination library</p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1
              data-no-auto-case
              className="mt-6 font-editorial text-[#F0F0F0]"
              style={{ fontSize: 'clamp(2.5rem,6.4vw,4.8rem)', lineHeight: 1.02 }}
            >
              Every oracle,
              <br />
              in one place.
            </h1>
          </FadeUp>

          <FadeUp delay={0.16}>
            <p data-no-auto-case className="mt-6 font-body text-[1.02rem] text-[#9A9AA0]">
              Tarot, runes, I Ching, the stars. Ask anything.
            </p>
          </FadeUp>

          <FadeUp delay={0.24} className="mt-10 w-full">
            <div data-no-binary>
              <Fan />
            </div>
          </FadeUp>

          <FadeUp delay={0.34}>
            <div className="mt-10 flex flex-col items-center gap-5">
              <a
                href="#draw"
                data-no-binary
                className="cta-glow inline-flex items-center justify-center rounded-full bg-[#F0F0F0] px-9 py-[0.95rem] font-body text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[#0A0A0A]"
              >
                Draw a card
              </a>
              <Link
                href="/app"
                data-no-binary
                className="font-body text-[0.72rem] uppercase tracking-[0.24em] text-[#8A8A8E] underline-offset-[6px] transition-colors hover:text-[#F0F0F0] hover:underline"
              >
                Open the app
              </Link>
            </div>
          </FadeUp>
        </section>

        {/* ─────────────────────── 2 · PICK A DECK ─────────────────────── */}
        <section id="draw" className="scroll-mt-16 border-t border-white/[0.07] px-6 py-20 md:py-28">
          <FadeUp>
            <H2>Pick a deck.</H2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="mt-14" data-no-binary>
              <Draw />
            </div>
          </FadeUp>
        </section>

        {/* ─────────────────────── 3 · THE SKY ─────────────────────── */}
        <section className="border-t border-white/[0.07] px-6 py-20 md:py-28">
          <FadeUp>
            <H2>
              And the sky,
              <span data-no-auto-case className="text-[#6E6E72]"> five ways.</span>
            </H2>
          </FadeUp>

          <FadeUp delay={0.12}>
            <ul className="mx-auto mt-14 grid max-w-[980px] grid-cols-3 gap-x-6 gap-y-10 md:grid-cols-5">
              {SYSTEMS.map((s) => (
                <li key={s.id} className="flex flex-col items-center">
                  <img
                    src={`/library/systems/system_${s.id}.png`}
                    alt=""
                    width={220}
                    height={220}
                    loading="lazy"
                    className="aspect-square w-full max-w-[150px] object-contain"
                    style={{
                      mixBlendMode: 'screen',
                      WebkitMaskImage: 'radial-gradient(circle, #000 58%, transparent 71%)',
                      maskImage: 'radial-gradient(circle, #000 58%, transparent 71%)',
                    }}
                  />
                  <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#9A9AA0]">
                    {s.name}
                  </p>
                </li>
              ))}
            </ul>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p className={`${MONO} mt-16 text-center`}>
              102 traditions · 12 shelves · 100+ languages
            </p>
          </FadeUp>
        </section>

        {/* ─────────────────────── 4 · THE ANSWER ─────────────────────── */}
        <section className="border-t border-white/[0.07] px-6 py-20 md:py-28">
          <FadeUp>
            <H2>Then ask it anything.</H2>
          </FadeUp>
          <FadeUp delay={0.12}>
            <div className="mx-auto mt-12 max-w-3xl" data-no-binary>
              <Ask />
            </div>
          </FadeUp>
        </section>

        {/* ─────────────────────── 5 · THE DOOR ─────────────────────── */}
        <section className="border-t border-white/[0.07] px-6 py-20 text-center md:py-28">
          <FadeUp>
            <img
              src="/library/art/M1.png"
              alt=""
              width={320}
              height={320}
              loading="lazy"
              className="mx-auto w-[min(62vw,260px)] object-contain"
              style={{ mixBlendMode: 'screen' }}
            />
          </FadeUp>

          <FadeUp delay={0.1}>
            <p
              data-no-auto-case
              className="mt-10 font-editorial italic text-[#F0F0F0]"
              style={{ fontSize: 'clamp(2rem,5.4vw,3.4rem)', lineHeight: 1.06 }}
            >
              Your question is waiting.
            </p>
          </FadeUp>

          <FadeUp delay={0.2}>
            <div className="mt-10 flex justify-center">
              <Link
                href="/app"
                data-no-binary
                className="cta-glow inline-flex items-center justify-center rounded-full bg-[#F0F0F0] px-9 py-[0.95rem] font-body text-[0.76rem] font-semibold uppercase tracking-[0.24em] text-[#0A0A0A]"
              >
                Open Plutto
              </Link>
            </div>
          </FadeUp>

          {/* Kept deliberately plain. Google's OAuth brand verification
              rejected this page once for not saying what the app does; this
              sentence is the anchor that keeps it from happening again if the
              brand is re-audited. Do not remove without checking the consent
              screen still reads "Plutto" rather than the raw Supabase host. */}
          <FadeUp delay={0.28}>
            <p data-no-auto-case className="mx-auto mt-16 max-w-[52ch] font-body text-[0.92rem] leading-[1.75] text-[#5E5E64]">
              Plutto is an astrology oracle you can talk back to. Give it a
              date, a time and a place; it works out where the sky stood and
              reads it to you out loud, in your language.
            </p>
          </FadeUp>

          <FadeUp delay={0.36}>
            <div className="mx-auto mt-14 max-w-4xl border-t border-white/[0.07] pt-12">
              <StoreBadges />
            </div>
          </FadeUp>
        </section>
      </div>
    </>
  );
}
