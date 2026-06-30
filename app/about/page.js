import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Starfield from '../components/Starfield';

export const metadata = {
  title: 'About',
  description:
    'Plutto is a voice-first astrology oracle by xooteq Lab — built on Swiss Ephemeris, voiced on OpenAI Realtime.',
};

export default function AboutPage() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10 pt-32 md:pt-44 px-6 md:px-12">
        <section className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.42em] text-white/50">
            About
          </p>

          <h1 className="mt-8 font-serif font-light text-white text-[44px] md:text-[64px] leading-[1.05] tracking-[-0.01em]">
            An oracle that
            <br />
            <em className="italic text-white/85">speaks back.</em>
          </h1>

          <div className="mt-14 space-y-7 text-[17px] md:text-[18px] leading-[1.7] text-white/75 font-serif font-light">
            <p>
              <span className="float-left mr-3 mt-1 font-serif text-[72px] md:text-[88px] font-medium leading-[0.75] text-white">
                P
              </span>
              lutto is an astrology app, but not a horoscope. It is a voice
              you can talk to — trained on Parashara and Ptolemy, BaZi and
              the Krishnamurti school — and it does not deal in twelve
              boxes. It names the pattern, in plain words, before the
              chart speaks for it.
            </p>

            <p>
              You enter your birth once. You choose a tradition. The chart
              follows you — Vedic when you want exactness, Western when
              you want psychology, Chinese when you want the elements,
              numerology when a name needs measuring. The voice changes
              with the lens. Your memory is kept.
            </p>

            <p>
              Plutto is built by <span className="text-white">xooteq Lab</span>.
              The charts are computed with Swiss Ephemeris — the same
              source observatories use. The voice runs on OpenAI Realtime.
              You can interrupt it, hold it, switch traditions mid-sentence.
            </p>
          </div>

          <div className="mt-20 border-t border-white/8 pt-10">
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              <Stat n="5" label="Traditions" />
              <Stat n="89" label="Languages" />
              <Stat n="19" label="Divisional charts" />
              <Stat n="300+" label="Classical yogas" />
            </dl>
          </div>

          <p className="mt-20 text-[11px] uppercase tracking-[0.4em] text-white/40">
            iOS &amp; Android — soon
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-serif font-light text-white text-[36px] md:text-[44px] leading-none tabular-nums">
        {n}
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.32em] text-white/45">
        {label}
      </div>
    </div>
  );
}
