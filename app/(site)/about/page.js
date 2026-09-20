/**
 * THE INFORMATION PAGE.
 *
 * The landing page's job is to make someone curious; this page's job is to make
 * them trust it, which is a different job and wants a different shape. So it is
 * built as a document rather than as a sequence of scenes: a numbered spine of
 * three movements down the left, one claim each, with the plain machinery
 * spelled out beside it — and then, before the close, the list of things Plutto
 * will NOT do. That list is the most persuasive block on the page. Anyone who
 * has been sold a horoscope app already suspects everything here; naming the
 * suspicions in our own words, in the affirmative, is what answers them.
 *
 * Every number on this page is real and comes from the backend catalog: 79
 * sections, 102 traditions on the globe, 19 vargas, the languages already
 * warmed in onboarding_translations.json. If a claim here cannot be pointed at
 * in the code, it does not belong on this page.
 */

import Link from 'next/link';
import Starfield from '../../components/Starfield';
import FadeUp from '../../components/FadeUp';
import StoreBadges from '../../components/StoreBadges';
import Astrolabe from '../../components/site/Astrolabe';

export const metadata = {
  title: 'How it works',
  description:
    'Plutto computes real charts with Swiss Ephemeris, reads them through the tradition you choose, and answers out loud in your language.',
};

const MONO = 'font-mono uppercase text-[0.7rem] tracking-[0.32em] text-[#8A8A8E]';

const MOVEMENTS = [
  {
    n: '01',
    title: 'The moment',
    lead: 'A date, a time, a place. Nothing else.',
    body:
      'From those three facts Plutto computes where every body in the sky actually stood — with Swiss Ephemeris, the same source observatories and planetariums use, to the arc-second. Not a table of twelve sun-sign paragraphs written last year. Your ascendant, your houses, the exact degrees, the vargas, the dashā you are standing in today.',
  },
  {
    n: '02',
    title: 'The lens',
    lead: 'The same chart, read by whichever tradition you ask for.',
    body:
      'Vedic in the Parāśara line, Western tropical, Chinese BaZi, the Krishnamurti system, numerology — and a hundred and two older traditions pinned to the cities they were written in. Plutto always tells you which lens is speaking, and you can change it in the middle of a conversation. When two lenses disagree, you are shown both. That is the honest answer.',
  },
  {
    n: '03',
    title: 'The voice',
    lead: 'It talks, and you can interrupt it.',
    body:
      'The reading is spoken, not printed at you — you can cut in, push back, ask it what it means, and it keeps the thread. It speaks the language your phone is already in, over a hundred of them, and it remembers what you told it last time so you are not introducing yourself every morning.',
  },
];

const REFUSALS = [
  ['It does not pick a tradition behind your back.',
   'Every reading is labelled with the system that produced it. Where the systems disagree, the disagreement is the answer, and you get both.'],
  ['It does not pretend to be certain.',
   'A chart is a description of a sky, not a verdict on a life. Plutto will tell you what a placement has classically meant and where the texts argue with each other — and it will say when a question is not one astrology answers.'],
  ['It does not deal in fear.',
   'No death dates, no doom, no medical or legal advice, and nothing designed to make you buy a remedy to lift a curse it invented.'],
  ['It does not make you read.',
   'Every feature is a conversation first. The chart is there underneath when you want the machinery, and out of the way when you do not.'],
];

export default function AboutPage() {
  return (
    <>
      <Starfield />

      <div className="relative z-10">
        {/* ───────────────────────── HEAD ───────────────────────── */}
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 md:pt-20">
          <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-7">
              <FadeUp>
                <p className={MONO}>Information</p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1
                  data-no-auto-case
                  className="mt-7 font-editorial text-[#F0F0F0]"
                  style={{ fontSize: 'clamp(2.1rem,5.6vw,3.9rem)', lineHeight: 1.08, maxWidth: '16ch' }}
                >
                  An oracle with the arithmetic still attached.
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p data-no-auto-case className="mt-9 max-w-xl font-body text-[1.05rem] leading-[1.75] text-[#B4B4B8]">
                  Most astrology apps are a magazine column with a subscription
                  attached. Plutto is the machinery: real ephemeris, real
                  traditions, read aloud by something you can argue with. This
                  page is what it does, how, and what it refuses to do.
                </p>
              </FadeUp>
            </div>

            <div className="flex justify-center md:col-span-5">
              <FadeUp delay={0.14}>
                <Astrolabe size={340} />
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ───────────────────── THE THREE MOVEMENTS ───────────────── */}
        <section className="border-t border-white/[0.07] bg-[#050509]/40">
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
            <FadeUp>
              <p className={MONO}>What happens when you ask</p>
            </FadeUp>

            <ol className="mt-16 space-y-16 md:space-y-24">
              {MOVEMENTS.map((m, i) => (
                <FadeUp key={m.n} delay={0.06 * i}>
                  <li className="grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-10 md:grid-cols-12 md:gap-10">
                    <div className="md:col-span-3">
                      <span className="block font-display text-[2.4rem] leading-none text-[#D4AF37]/60">
                        {m.n}
                      </span>
                      <span className="mt-4 block font-display uppercase text-[0.9rem] tracking-[0.28em] text-[#F0F0F0]">
                        {m.title}
                      </span>
                    </div>

                    <div className="md:col-span-9">
                      <p
                        data-no-auto-case
                        className="font-editorial text-[#F0F0F0]"
                        style={{ fontSize: 'clamp(1.5rem,3.2vw,2.15rem)', lineHeight: 1.22 }}
                      >
                        {m.lead}
                      </p>
                      <p data-no-auto-case className="mt-6 max-w-2xl font-body text-[1.02rem] leading-[1.75] text-[#B4B4B8]">
                        {m.body}
                      </p>
                    </div>
                  </li>
                </FadeUp>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────────────────── WHAT IT WILL NOT DO ───────────────── */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-5xl px-6">
            <FadeUp>
              <p className={MONO}>Four things it will not do</p>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-7 max-w-3xl font-editorial text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', lineHeight: 1.16 }}
              >
                You are right to be sceptical.
                <span data-no-auto-case className="text-[#8A8A8E]"> Here is what
                we have promised ourselves not to sell you.</span>
              </h2>
            </FadeUp>

            <dl className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
              {REFUSALS.map(([head, body], i) => (
                <FadeUp key={head} delay={0.05 * i}>
                  <div className="border-l border-[#D4AF37]/25 pl-6">
                    <dt
                      data-no-auto-case
                      className="font-editorial text-[1.32rem] leading-[1.35] text-[#F0F0F0]"
                    >
                      {head}
                    </dt>
                    <dd data-no-auto-case className="mt-4 font-body text-[0.98rem] leading-[1.72] text-[#8A8A8E]">
                      {body}
                    </dd>
                  </div>
                </FadeUp>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────────────────── THE MACHINERY, NAMED ───────────────── */}
        <section className="border-t border-white/[0.07] bg-[#050509]/40">
          <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
            <FadeUp>
              <p className={MONO}>Under it</p>
            </FadeUp>

            <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3">
              <Fact k="Ephemeris" v="Swiss Ephemeris" note="Arc-second positions, the source professional astronomy software is built on." />
              <Fact k="Voice" v="OpenAI Realtime" note="Spoken, interruptible, and answering in the language you already use." />
              <Fact k="Systems" v="Five, side by side" note="Vedic (BPHS), Western tropical, Chinese BaZi, Krishnamurti, numerology." />
              <Fact k="Readings" v="79 of them" note="Daily through yearly, natal, electional, synastry — each computed for your chart." />
              <Fact k="Traditions" v="102 on the globe" note="Named as their own people name them, pinned to the cities they were written in." />
              <Fact k="Charts" v="19 vargas" note="Divisionals, yogas and dashās — the exact machinery, not a summary of it." />
            </div>

            <FadeUp delay={0.15}>
              <p data-no-auto-case className="mt-16 max-w-2xl font-body text-[1.02rem] leading-[1.75] text-[#B4B4B8]">
                Plutto is built by{' '}
                <span data-no-auto-case className="text-[#F0F0F0]">Xooteq Lab</span>, a studio
                making voice-first tools for the ancient sciences. The Oracle is
                our first release. What you do with it —{' '}
                {/* The policy is served by the API, not by this app — the same
                    URL the footer and the phone's settings screen point at. */}
                <a
                  href="https://api.plutto.space/privacy"
                  className="text-[#D4AF37]/80 underline underline-offset-4 hover:text-[#D4AF37]"
                >
                  and what we keep
                </a>{' '}
                — is written down in plain words, not in a policy nobody reads.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── THE DOOR ───────────────────── */}
        <section className="border-t border-white/[0.07]">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
            <FadeUp>
              <p
                data-no-auto-case
                className="font-editorial italic text-[#F0F0F0]"
                style={{ fontSize: 'clamp(1.9rem,5.4vw,3.4rem)', lineHeight: 1.1 }}
              >
                Ask it something you actually want to know.
              </p>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div className="mt-12 flex justify-center">
                <Link
                  href="/app"
                  data-no-binary
                  className="cta-glow inline-flex items-center justify-center rounded-md bg-[#F0F0F0] px-9 py-4 font-body text-[0.78rem] font-semibold uppercase tracking-[0.22em] text-[#0A0A0A]"
                >
                  Open it in this browser
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.25}>
              <div className="mt-20 border-t border-white/[0.07] pt-16">
                <StoreBadges />
              </div>
            </FadeUp>
          </div>
        </section>
      </div>
    </>
  );
}

/** One line of the specification: what it is, what it is called, why it matters. */
function Fact({ k, v, note }) {
  return (
    <div>
      <dt className="font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#D4AF37]/70">{k}</dt>
      <dd>
        <span data-no-auto-case className="mt-4 block font-display text-[1.12rem] uppercase tracking-[0.16em] text-[#F0F0F0]">
          {v}
        </span>
        <span data-no-auto-case className="mt-4 block font-body text-[0.92rem] leading-[1.7] text-[#8A8A8E]">
          {note}
        </span>
      </dd>
    </div>
  );
}
