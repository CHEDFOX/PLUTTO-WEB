import Link from 'next/link';
import Starfield from './components/Starfield';
import PlanetSlideshow from './components/PlanetSlideshow';
import StoreBadges from './components/StoreBadges';
import FadeUp from './components/FadeUp';

export default function Home() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ─────────────────── HERO ─────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pt-16 md:pt-24 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-center">
            <div className="md:col-span-6 order-2 md:order-1">
              <FadeUp>
                <p
                  className="uppercase text-[#F0F0F0]"
                  style={{
                    fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                    fontSize: '0.8rem',
                    letterSpacing: '3px',
                  }}
                >
                  The Search For Meaning
                </p>
              </FadeUp>

              <FadeUp delay={0.1}>
                {/* Set in caps and spaced wide: the display face has no italic
                    and needs none — the emphasis is the spacing itself. */}
                <h1
                  className="mt-6 font-display font-normal uppercase text-[#F0F0F0]"
                  style={{
                    fontSize: 'clamp(1.5rem, 3.4vw, 2.6rem)',
                    lineHeight: 1.5,
                    letterSpacing: '0.3em',
                  }}
                >
                  We&apos;ve Always
                  <br />
                  Looked Up
                </h1>
              </FadeUp>

              <FadeUp delay={0.25}>
                <p
                  className="mt-8 max-w-xl text-[#C0C0C0]"
                  style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
                >
                  For thousands of years, humanity searched the sky for meaning.
                  With Plutto, you join the expedition — an oracle that reads the
                  heavens across every tradition, and speaks the pattern back to
                  you in plain words.
                </p>
              </FadeUp>

              <FadeUp delay={0.4}>
                <div className="mt-10 flex items-center gap-5">
                  <Link
                    href="/about"
                    className="cta-glow inline-flex items-center justify-center rounded-md bg-[#F0F0F0] px-7 py-4 text-[#0A0A0A] font-body font-semibold uppercase"
                    style={{ fontSize: '0.8rem', letterSpacing: '3px' }}
                  >
                    See Through
                  </Link>
                </div>
              </FadeUp>
            </div>

            {/* Twelve planets, one at a time */}
            <div className="md:col-span-6 order-1 md:order-2 flex items-center justify-center">
              <FadeUp delay={0.15}>
                <PlanetSlideshow size={460} />
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ─────────────────── WHAT PLUTTO IS ─────────────────── */}
        {/* Kept deliberately short. Google's OAuth brand verification rejected
            this page once for not saying what the app does; these two lines are
            the anchor that keeps it from happening again if the brand is ever
            re-audited. The register stays ours — one plain noun, no feature
            list. Do not remove without checking the consent screen still reads
            "Plutto" rather than the raw Supabase host. */}
        <section className="mx-auto max-w-3xl px-6 pb-8">
          <FadeUp>
            <p
              className="uppercase text-[#F0F0F0]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.8rem',
                letterSpacing: '3px',
              }}
            >
              What Plutto Is
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <p
              className="mt-8 text-[#C0C0C0]"
              style={{ fontSize: '1.05rem', lineHeight: 1.7 }}
            >
              An astrology oracle, and a voice you can argue with. You give it a
              date, a time, a place; it computes the geometry of that moment and
              talks to you about it — out loud, in your language.
            </p>
          </FadeUp>
        </section>

        {/* ─────────────────── DOWNLOAD ─────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24 text-center">
          <FadeUp>
            <StoreBadges />
          </FadeUp>
        </section>
      </div>
    </>
  );
}
