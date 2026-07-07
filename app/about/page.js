import Starfield from '../components/Starfield';
import FadeUp from '../components/FadeUp';

export const metadata = {
  title: 'About',
  description:
    'Plutto is a voice-first astrology oracle — built on Swiss Ephemeris, voiced on OpenAI Realtime.',
};

export default function AboutPage() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ─────────────────── HERO ─────────────────── */}
        <section className="mx-auto max-w-4xl px-6 pt-16 md:pt-24 pb-16">
          <FadeUp>
            <p
              className="uppercase text-[#5F82EA]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.72rem',
                letterSpacing: '0.32em',
              }}
            >
              About
            </p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h1
              className="mt-6 font-display font-bold text-[#F0F0F0]"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
              }}
            >
              An Oracle That{' '}
              <em
                className="italic text-[#5F82EA]"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
              >
                Speaks
              </em>{' '}
              Back.
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p
              className="mt-8 max-w-2xl text-[#C0C0C0]"
              style={{ fontSize: '1.1rem', lineHeight: 1.7 }}
            >
              Not a horoscope. A voice you can talk to — trained on Parashara
              and Ptolemy, BaZi and the Krishnamurti school — that names the
              pattern in plain words, before the chart speaks for it.
            </p>
          </FadeUp>
        </section>

        {/* ─────────────────── PROSE ─────────────────── */}
        <section className="mx-auto max-w-3xl px-6 py-16">
          <FadeUp>
            <div
              className="space-y-8 text-[#B0B0B0]"
              style={{ fontSize: '1.05rem', lineHeight: 1.75 }}
            >
              <p>
                Plutto does not deal in twelve boxes. You enter your birth once.
                You choose a tradition. The chart follows you — Vedic when you
                want exactness, Western when you want psychology, Chinese when
                you want the elements, numerology when a name needs measuring.
                The voice changes with the lens. Your memory is kept.
              </p>

              <p>
                Charts are computed with{' '}
                <span className="text-[#F0F0F0]">Swiss Ephemeris</span> — the
                same source observatories use. The voice runs on{' '}
                <span className="text-[#F0F0F0]">OpenAI Realtime</span>. You can
                interrupt it, hold it, switch traditions mid-sentence.
              </p>

              <p>
                Plutto is built by{' '}
                <span className="text-[#F0F0F0]">Xooteq Lab</span> — a studio
                shipping voice-first tools for the ancient sciences. The
                Oracle is our first release.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ─────────────────── STATS ─────────────────── */}
        <section className="mx-auto max-w-4xl px-6 py-24">
          <FadeUp>
            <p
              className="uppercase text-[#5F82EA] text-center"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.32em',
              }}
            >
              By The Numbers
            </p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <dl className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 border-t border-border pt-12">
              <Stat n="5"    label="Traditions" />
              <Stat n="89"   label="Languages" />
              <Stat n="19"   label="Divisional Charts" />
              <Stat n="300+" label="Classical Yogas" />
            </dl>
          </FadeUp>
        </section>

        {/* ─────────────────── OUTRO ─────────────────── */}
        <section className="mx-auto max-w-4xl px-6 py-16 text-center">
          <FadeUp>
            <p
              className="uppercase text-[#888]"
              style={{
                fontFamily: "'JetBrains Mono', ui-monospace, monospace",
                fontSize: '0.7rem',
                letterSpacing: '0.4em',
              }}
            >
              iOS &amp; Android — Coming Soon
            </p>
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
          fontSize: '0.65rem',
          letterSpacing: '0.3em',
        }}
      >
        {label}
      </div>
    </div>
  );
}
