import Link from 'next/link';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import Starfield from '../../components/Starfield';

export const metadata = {
  title: 'Why Plutto',
  description:
    'What Plutto is, how it reads you, and why it is worth the two minutes it asks for.',
};

const REASONS = [
  {
    n: '01',
    title: 'Five traditions, one voice',
    body:
      'Most apps read you through a single system. Plutto computes Jyotish, Hermetica, BaZi, the Krishnamurti school and the science of numbers from the same birth moment — then answers as one voice. Where independent traditions agree without knowing about each other, that agreement is the strongest signal there is.',
  },
  {
    n: '02',
    title: 'The real sky, not a template',
    body:
      'Every reading begins with research-grade astronomical calculation of where the sky actually was at your birth — the same ephemeris observatories use. Nothing here is a pre-written paragraph shuffled between twelve boxes.',
  },
  {
    n: '03',
    title: 'An oracle you can talk to',
    body:
      'Ask in your own words and be answered from your own chart. It does not lecture, it does not hedge, and it does not end with a menu. It tells you the one thing you came for, and it is willing to tell you something you would rather not hear.',
  },
  {
    n: '04',
    title: 'Time, made readable',
    body:
      'The great cycles each tradition uses to read a life in motion — periods, transits, luck pillars, the turning of a year. Not what you are. What is moving through you now, and when it eases.',
  },
];

export default function WhyPage() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10 pt-32 md:pt-44 px-6 md:px-12">
        <section className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.42em] text-white/50">
            Before you begin
          </p>

          <h1 className="mt-8 font-display font-normal uppercase text-white text-[22px] md:text-[38px] leading-[1.5] tracking-title">
            Everything has
            <br />
            a pattern
          </h1>

          <div className="mt-14 space-y-7 text-[17px] md:text-[18px] leading-[1.7] text-white/75 font-serif font-light">
            <p>
              <span className="float-left mr-3 mt-1 font-serif text-[72px] md:text-[88px] font-medium leading-[0.75] text-white">
                F
              </span>
              or thousands of years, every civilisation that looked up built its own
              science of pattern — and each one saw something the others missed.
              Plutto is an evolving encyclopedia of that knowledge, computed against
              the real sky and read back to you in plain language.
            </p>

            <p>
              It asks for one thing: the moment you began. Date, place, and — if you
              know it — the hour. From that single point, every tradition in the app
              starts speaking at once.
            </p>
          </div>

          {/* Why it is worth trying */}
          <div className="mt-20 space-y-14">
            {REASONS.map((r) => (
              <div key={r.n} className="border-t border-mist pt-8">
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
                  {r.n}
                </p>
                <h2 className="mt-3 font-display font-normal uppercase text-[15px] md:text-[19px] leading-[1.55] tracking-title text-white">
                  {r.title}
                </h2>
                <p className="mt-4 text-[16px] md:text-[17px] leading-[1.75] text-white/65 font-serif font-light">
                  {r.body}
                </p>
              </div>
            ))}
          </div>

          {/* The ask */}
          <div className="mt-24 border-t border-mist pt-14 pb-32">
            <h2 className="font-display font-normal uppercase text-[19px] md:text-[28px] leading-[1.5] tracking-title text-white">
              Two minutes, and it
              <br />
              knows where to look
            </h2>
            <p className="mt-6 max-w-xl text-[16px] leading-[1.75] text-white/60 font-serif font-light">
              Enter your birth moment and ask the oracle one real question — the one
              you have actually been carrying. That is the whole test. If it does not
              tell you something true, nothing here will.
            </p>

            <Link
              href="/app"
              className="mt-12 inline-block rounded-full bg-white px-12 py-4 text-[11px]
                         uppercase tracking-[0.32em] text-black hover:brightness-110
                         transition-all"
            >
              Try it
            </Link>

            <p className="mt-6 text-[11px] leading-relaxed text-white/25">
              Sign in once with Google — your chart and your conversation then
              follow you to the app.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
