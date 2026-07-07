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
                  className="uppercase text-[#2962FF]"
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
                <h1
                  className="mt-6 font-display font-bold text-[#F0F0F0]"
                  style={{
                    fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
                    lineHeight: 1.05,
                    letterSpacing: '-0.02em',
                  }}
                >
                  We&apos;ve Always
                  <br />
                  Looked{' '}
                  <em
                    className="italic text-[#2962FF]"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Up
                  </em>
                  .
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
                    className="cta-glow inline-flex items-center justify-center rounded-md bg-[#2962FF] px-7 py-4 text-[#0A0A0A] font-body font-semibold uppercase"
                    style={{ fontSize: '0.8rem', letterSpacing: '3px' }}
                  >
                    See Through
                  </Link>
                  <a
                    href="#corpus"
                    className="uppercase text-[#888] transition-colors hover:text-[#F0F0F0]"
                    style={{
                      fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                      fontSize: '0.8rem',
                      letterSpacing: '3px',
                    }}
                  >
                    The Corpus →
                  </a>
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

        {/* ─────────────────── CORPUS ─────────────────── */}
        <section id="corpus" className="mx-auto max-w-7xl px-6 py-24">
          <FadeUp>
            <p
              className="uppercase text-[#2962FF] text-center"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.8rem',
                letterSpacing: '3px',
              }}
            >
              The Corpus
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2
              className="mt-4 font-display font-bold text-[#F0F0F0] text-center"
              style={{
                fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                letterSpacing: '-0.02em',
              }}
            >
              The Most Comprehensive
              <br className="hidden md:block" />
              {' '}Astrological Corpus.
            </h2>
          </FadeUp>

          <FadeUp delay={0.2}>
            <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 border-t border-border pt-12">
              <Stat n="5"    label="Traditions" />
              <Stat n="19"   label="Divisional Charts" />
              <Stat n="300+" label="Classical Yogas" />
              <Stat n="89"   label="Languages" />
            </dl>
          </FadeUp>
        </section>

        {/* ─────────────────── FOUNDATIONS ─────────────────── */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeUp delay={0}>
              <FoundationCard
                eyebrow="Ephemeris"
                title="Swiss Ephemeris"
                body="The same source observatories use — sub-arc-second precision, across millennia."
              />
            </FadeUp>
            <FadeUp delay={0.1}>
              <FoundationCard
                eyebrow="Voice"
                title="OpenAI Realtime"
                body="A voice you can interrupt, hold, switch traditions mid-sentence with. Not a monologue."
              />
            </FadeUp>
            <FadeUp delay={0.2}>
              <FoundationCard
                eyebrow="Memory"
                title="One Chart, Every Lens"
                body="Enter your birth once. Choose a tradition. Your reading — and its memory — follows you across systems."
              />
            </FadeUp>
          </div>
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

function Stat({ n, label }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="font-display font-bold text-[#F0F0F0] tabular-nums"
        style={{
          fontSize: 'clamp(2.25rem, 4vw, 3rem)',
          letterSpacing: '-0.03em',
          lineHeight: 1,
        }}
      >
        {n}
      </div>
      <div
        className="mt-4 uppercase text-[#888]"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: '0.72rem',
          letterSpacing: '3px',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FoundationCard({ eyebrow, title, body }) {
  return (
    <div
      className="relative p-8 rounded-lg h-full transition-colors"
      style={{
        background: 'linear-gradient(180deg, rgba(41,98,255,0.03), rgba(255,255,255,0))',
        border: '1px solid rgba(41,98,255,0.10)',
      }}
    >
      <p
        className="uppercase text-[#2962FF]"
        style={{
          fontFamily: "'JetBrains Mono', ui-monospace, monospace",
          fontSize: '0.72rem',
          letterSpacing: '3px',
        }}
      >
        {eyebrow}
      </p>
      <h3
        className="mt-4 font-display font-bold text-[#F0F0F0]"
        style={{ fontSize: '1.35rem', letterSpacing: '-0.02em' }}
      >
        {title}
      </h3>
      <p className="mt-3 text-[#888]" style={{ fontSize: '0.95rem', lineHeight: 1.7 }}>
        {body}
      </p>
    </div>
  );
}
