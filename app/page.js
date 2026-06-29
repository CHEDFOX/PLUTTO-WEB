import Starfield from './components/Starfield';
import Mark from './components/Mark';

export default function Home() {
  return (
    <>
      <Starfield />

      <main className="relative z-10">
        {/* HERO */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
          <p className="mb-10 text-[10px] uppercase tracking-[0.42em] text-white/45">
            An astrology oracle
          </p>

          <h1 className="font-serif text-[18vw] sm:text-[14vw] md:text-[11rem] leading-[0.9] tracking-tight">
            Plutto<Mark className="ml-2 align-top text-[0.18em]" />
          </h1>

          <p className="mt-10 font-serif italic text-lg md:text-2xl text-white/75">
            Every reading. Every system.
          </p>

          <p className="mt-6 max-w-md text-sm md:text-base text-white/55">
            A voice you can talk to. Five traditions, read for you in the
            language that finds you.
          </p>

          <a
            href="#oracle"
            className="group mt-16 inline-flex items-center gap-3 border border-gold/70 px-7 py-3 text-[11px] uppercase tracking-[0.36em] text-gold transition-colors hover:bg-gold hover:text-black"
          >
            Soon
            <span className="inline-block transition-transform group-hover:translate-y-[2px]">
              ↓
            </span>
          </a>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.4em] text-white/25">
            Scroll
          </div>
        </section>

        {/* ORACLE */}
        <section
          id="oracle"
          className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center"
        >
          <p className="mb-8 text-[10px] uppercase tracking-[0.42em] text-white/45">
            The Oracle
          </p>

          <h2 className="font-serif text-5xl md:text-7xl leading-tight max-w-3xl">
            Talk to the stars,
            <br />
            <em className="not-italic text-white/80">out loud.</em>
          </h2>

          <div className="my-16">
            <Ring />
          </div>

          <p className="max-w-xl text-base md:text-lg text-white/65 leading-relaxed">
            A voice you can interrupt. A memory that holds your chart.
            <br className="hidden md:block" /> Five distinct voices — one
            for each tradition.
          </p>
        </section>

        {/* FIVE TRADITIONS */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
          <p className="mb-8 text-[10px] uppercase tracking-[0.42em] text-white/45">
            Five traditions, one home
          </p>

          <h2 className="font-serif text-5xl md:text-7xl leading-tight max-w-3xl">
            Read your life in the
            <br />
            <em className="not-italic text-white/80">
              language that finds you.
            </em>
          </h2>

          <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-4 gap-y-3 font-serif text-base md:text-2xl text-white">
            <li>Vedic</li>
            <li><Mark /></li>
            <li>Western</li>
            <li><Mark /></li>
            <li>Chinese</li>
            <li><Mark /></li>
            <li>KP</li>
            <li><Mark /></li>
            <li>Numerology</li>
          </ul>

          <p className="mt-10 max-w-xl text-sm md:text-base text-white/55">
            Parashara, Hellenistic Hermetica, BaZi Four Pillars, Krishnamurti
            Paddhati, Chaldean &amp; Pythagorean — switch any time. Your chart
            follows.
          </p>
        </section>

        {/* DEPTH */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
          <p className="mb-10 text-[10px] uppercase tracking-[0.42em] text-white/45">
            Classical, not generic
          </p>

          <h2 className="font-serif text-4xl md:text-6xl leading-tight max-w-2xl mb-20">
            Receipts under
            <br />
            <em className="not-italic text-white/80">every reading.</em>
          </h2>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 max-w-4xl w-full">
            <Stat n="300+" label="Classical yogas" />
            <Stat n="19" label="Divisional charts" />
            <Stat n="7" label="Dasha systems" />
            <Stat n="89" label="Languages" />
          </dl>

          <p className="mt-20 text-[10px] uppercase tracking-[0.4em] text-white/35">
            Voice on OpenAI Realtime
            <span className="mx-3 text-white/20">·</span>
            Charts on Swiss Ephemeris
          </p>
        </section>

        {/* FOOTER */}
        <footer className="relative border-t border-white/10 px-6 py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:justify-between">
            <div className="font-serif text-xl">
              Plutto<Mark className="ml-1 text-[0.55em] align-top" />
            </div>

            <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-[11px] uppercase tracking-[0.32em] text-white/55">
              <a
                href="https://api.plutto.space/privacy"
                className="transition-colors hover:text-white"
              >
                Privacy
              </a>
              <a
                href="https://api.plutto.space/static/terms.html"
                className="transition-colors hover:text-white"
              >
                Terms
              </a>
              <a
                href="https://api.plutto.space/static/delete.html"
                className="transition-colors hover:text-white"
              >
                Delete account
              </a>
              <a
                href="mailto:support@plutto.space"
                className="transition-colors hover:text-white"
              >
                Contact
              </a>
            </nav>
          </div>

          <p className="mt-12 text-center text-[10px] uppercase tracking-[0.4em] text-white/25">
            © xooteq Lab
          </p>
        </footer>
      </main>
    </>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-serif text-5xl md:text-6xl text-white tabular-nums">
        {n}
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-[0.32em] text-white/45">
        {label}
      </div>
    </div>
  );
}

function Ring() {
  return (
    <svg
      width="260"
      height="260"
      viewBox="0 0 260 260"
      aria-hidden="true"
      className="block"
    >
      <circle
        cx="130"
        cy="130"
        r="128"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="0.6"
      />
      <circle
        cx="130"
        cy="130"
        r="100"
        fill="none"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="0.6"
      />
      <circle
        cx="130"
        cy="130"
        r="68"
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.6"
      />
      <circle cx="130" cy="130" r="3" fill="#D4AF37" />
    </svg>
  );
}
