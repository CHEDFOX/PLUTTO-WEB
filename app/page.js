import Link from 'next/link';
import Nav from './components/Nav';
import Footer from './components/Footer';
import Starfield from './components/Starfield';

export default function Home() {
  return (
    <>
      <Starfield />
      <Nav />

      <main className="relative z-10">
        {/* ─────── HERO ─────── */}
        <section className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6 md:px-12 pt-32 pb-24">
          <h1 className="font-serif font-light text-white text-[44px] sm:text-[60px] md:text-[78px] leading-[1.04] tracking-[-0.012em]">
            Three Traditions.
            <br />
            <span className="italic">One Place To Ask Better Questions.</span>
          </h1>

          <div className="mt-14 md:mt-16 max-w-2xl space-y-6">
            <p className="font-serif font-light text-white/75 text-[17px] md:text-[19px] leading-[1.7]">
              For Thousands Of Years, Civilizations Looked At The Same Sky
              And Arrived At Different Ways Of Understanding Life.
            </p>
            <p className="font-serif font-light text-white/75 text-[17px] md:text-[19px] leading-[1.7]">
              Plutto Brings Those Perspectives Together—Not To Tell You What
              To Believe, But To Help You Explore Why They Were Asking These
              Questions In The First Place.
            </p>
          </div>

          <div className="mt-20 md:mt-24 flex flex-col items-center gap-5">
            <span className="text-gold text-[28px] leading-none select-none">
              ↓
            </span>
            <Link
              href="#archive"
              className="text-[11px] uppercase tracking-[0.32em] text-gold pb-2 border-b border-gold/60 hover:border-gold transition-colors"
            >
              Explore The Archive
            </Link>
          </div>
        </section>

        {/* ─────── WHAT IS PLUTTO? ─────── */}
        <Section eyebrow="What Is Plutto?">
          <div className="max-w-3xl mx-auto text-center font-serif font-light text-white text-[22px] md:text-[32px] leading-[1.42] space-y-7">
            <p>We Don&rsquo;t Ask You To Choose Between Vedic, Western, Or BaZi.</p>
            <p>We Think Each Tradition Is Asking A Different Question.</p>
            <div className="pt-2 text-white/75 space-y-3 text-[20px] md:text-[28px]">
              <p>One Studies Timing.</p>
              <p>Another Explores Identity.</p>
              <p>Another Examines Cycles And Environment.</p>
            </div>
            <p className="pt-4">The Interesting Part Isn&rsquo;t Where They Disagree.</p>
            <p className="italic">It&rsquo;s Where They Unexpectedly Agree.</p>
          </div>
        </Section>

        {/* ─────── THREE LENSES ─────── */}
        <Section eyebrow="Three Lenses">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="font-serif font-light text-white text-[34px] md:text-[48px] leading-[1.18]">
              One Question.
              <br />
              <em className="italic">Three Perspectives.</em>
            </h2>

            <div className="mt-16 md:mt-20">
              <p className="text-[10px] uppercase tracking-[0.42em] text-white/45 mb-6">
                Question
              </p>
              <p className="font-serif font-light text-white text-[26px] md:text-[40px] leading-[1.3]">
                <span className="text-gold mr-1">&ldquo;</span>
                Why Does This Period Of Life Feel Different?
                <span className="text-gold ml-1">&rdquo;</span>
              </p>
            </div>

            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-white/10">
              <Lens name="Vedic" answer="How Has The Quality Of Time Changed?" />
              <Lens name="Western" answer="What Part Of Your Identity Is Evolving?" />
              <Lens name="BaZi" answer="What Cycles And Environments Are Influencing Your Decisions?" />
            </div>

            <div className="mt-24 font-serif font-light text-white/85 text-[19px] md:text-[24px] leading-[1.6] space-y-1.5">
              <p>Different Traditions.</p>
              <p>Different Reasoning.</p>
              <p className="italic text-white">One Human Experience.</p>
            </div>
          </div>
        </Section>

        {/* ─────── THE ARCHIVE ─────── */}
        <Section eyebrow="The Archive" id="archive">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-serif font-light text-white text-[40px] md:text-[60px] leading-[1.05]">
              A Place For Curious Minds.
            </h2>

            <div className="mt-14 max-w-2xl mx-auto font-serif font-light text-white/75 text-[18px] md:text-[22px] leading-[1.6] space-y-5">
              <p>Not Because You Need To Memorize Astrology.</p>
              <p>
                Because Understanding How These Systems Think Is Far More
                Interesting Than Memorizing What They Say.
              </p>
            </div>

            <div className="mt-20 text-left">
              <p className="text-center text-[10px] uppercase tracking-[0.42em] text-white/45 mb-10">
                Topics Include
              </p>
              <ul className="space-y-5 max-w-xl mx-auto font-serif font-light text-white text-[19px] md:text-[22px] leading-[1.4]">
                <Topic>Why Does Birth Time Matter?</Topic>
                <Topic>Why Is Saturn Misunderstood?</Topic>
                <Topic>Why Do Different Traditions Interpret The Same Sky Differently?</Topic>
                <Topic>Can Destiny Change?</Topic>
                <Topic>Why Did Ancient Civilizations Keep Looking Upward?</Topic>
              </ul>
            </div>
          </div>
        </Section>

        {/* ─────── HUMAN LOG ─────── */}
        <section className="px-6 md:px-12 py-32 md:py-44">
          <div className="mx-auto max-w-2xl">
            <p className="text-[10px] uppercase tracking-[0.42em] text-white/45 mb-2">
              Human Log
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/35 mb-12">
              Observation 014
            </p>
            <div className="font-serif font-light text-white text-[22px] md:text-[30px] leading-[1.5] space-y-6">
              <p>
                Humans Have Spent Thousands Of Years Asking The Sky Difficult
                Questions.
              </p>
              <p className="italic text-white/70">Curiously,</p>
              <p>
                Most Of The Difficult Answers Were Waiting Much Closer To Home.
              </p>
            </div>
          </div>
        </section>

        {/* ─────── SMALL NOTE ─────── */}
        <section className="px-6 md:px-12 py-28 md:py-36">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[10px] uppercase tracking-[0.42em] text-white/45 mb-10">
              Small Note
            </p>
            <div className="font-serif font-light italic text-white/85 text-[19px] md:text-[24px] leading-[1.6] space-y-5">
              <p>Mercury Retrograde Has Received Many Complaints.</p>
              <p>
                Mercury Would Like To Remind Everyone That Proofreading
                Remains A Personal Responsibility.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}

function Section({ eyebrow, children, id }) {
  return (
    <section id={id} className="px-6 md:px-12 py-32 md:py-44">
      <p className="text-center text-[10px] uppercase tracking-[0.42em] text-white/45 mb-16 md:mb-20">
        {eyebrow}
      </p>
      {children}
    </section>
  );
}

function Lens({ name, answer }) {
  return (
    <div className="py-8 md:py-2 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.32em] text-white/55 mb-5">
        {name}
      </p>
      <p className="font-serif font-light text-white text-[18px] md:text-[20px] leading-[1.45]">
        {answer}
      </p>
    </div>
  );
}

function Topic({ children }) {
  return (
    <li className="flex items-start gap-4">
      <span className="text-gold mt-[0.55em] leading-none text-[10px] select-none">
        ●
      </span>
      <span>{children}</span>
    </li>
  );
}
