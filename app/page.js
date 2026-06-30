import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Starfield from './components/Starfield';
import Orb from './components/Orb';
import NatalWheel from './components/NatalWheel';
import StoreBadges from './components/StoreBadges';

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10 pt-32 md:pt-40 px-4 md:px-12">
        {/* HERO CARD */}
        <section className="mx-auto max-w-6xl hero-card px-6 md:px-16 py-16 md:py-24">
          <div className="text-center">
            <h1 className="font-serif text-[40px] sm:text-[56px] md:text-[88px] font-medium text-white leading-none tracking-[0.32em] md:tracking-[0.42em] uppercase pr-[-0.42em]">
              Plutto
            </h1>
          </div>

          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-12 items-center gap-12 md:gap-8">
            {/* Copy */}
            <div className="md:col-span-6 md:pl-2">
              <h2 className="font-serif text-[34px] md:text-[44px] font-light text-white leading-[1.08] tracking-[-0.01em]">
                Thousands of years
                <br />
                of observation.
              </h2>
              <p className="mt-8 max-w-md text-[16px] leading-relaxed text-white/65">
                One place to explore how humanity has tried to
                understand time, choice, and ourselves.
              </p>
              <div className="mt-10">
                <Link
                  href="/about"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-[11px] uppercase tracking-[0.32em] text-black transition-colors hover:bg-gold"
                >
                  Learn more
                </Link>
              </div>
            </div>

            {/* Visual — gold orb inside a faint natal wheel */}
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative">
                <NatalWheel
                  variant="faint"
                  size={420}
                  center={<Orb size="sm" />}
                />
              </div>
            </div>
          </div>

          {/* Carousel dots — static decoration matching The Pattern's pacing */}
          <div className="mt-16 flex items-center justify-center gap-3">
            <Dot active />
            <Dot />
            <Dot />
            <Dot />
          </div>
        </section>

        {/* DOWNLOAD */}
        <section className="mx-auto max-w-6xl mt-24 md:mt-32 text-center">
          <StoreBadges />
        </section>

        {/* QUIET DEPTH LINE */}
        <section className="mx-auto max-w-3xl mt-24 md:mt-32 text-center border-t border-white/8 pt-12">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/45">
            Built on Swiss Ephemeris
            <span className="mx-3 text-white/20">·</span>
            Voice on OpenAI Realtime
          </p>
          <p className="mt-6 text-[12px] text-white/35">
            300+ classical yogas
            <span className="mx-2">·</span>
            19 divisional charts
            <span className="mx-2">·</span>
            7 dasha systems
            <span className="mx-2">·</span>
            89 languages
          </p>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Dot({ active }) {
  return (
    <span
      className={`block h-1.5 w-1.5 rounded-full ${
        active ? 'bg-white' : 'bg-white/20'
      }`}
    />
  );
}
