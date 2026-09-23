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
import FadeUp from '../../components/FadeUp';
import StoreBadges from '../../components/StoreBadges';
import PlanetMark from '../../components/site/PlanetMark';
import { SHELF_COLOR } from '../../lib/traditions';

export const metadata = {
  title: 'How it works',
  description:
    'Plutto computes real charts with Swiss Ephemeris, reads them through the tradition that fits your question, and answers out loud in your language.',
};

const MONO = 'text-[14px] font-semibold text-[#A78BFA]';

const MOVEMENTS = [
  {
    n: '01',
    color: SHELF_COLOR.south_asia,
    planet: 'sun',
    title: 'The moment',
    lead: 'A date, a time, a place. Nothing else.',
    body:
      'From those three it works out exactly where the sky stood — with Swiss Ephemeris, the same source observatories use. Your own moment, not twelve paragraphs written last year for everybody born in a month.',
  },
  {
    n: '02',
    color: SHELF_COLOR.china,
    planet: 'mars',
    title: 'The oracle',
    lead: 'Then the right oracle reads it.',
    body:
      'A hundred and two traditions, each pinned to the city that wrote it — cowries at Ile-Ife, a cup in London, a poet in Shiraz, the stars at Varanasi. Plutto picks the one that fits you and your question.',
  },
  {
    n: '03',
    color: SHELF_COLOR.sky,
    planet: 'venus',
    title: 'The voice',
    lead: 'It talks, and you can interrupt it.',
    body:
      'The reading is spoken, not printed at you. Cut in, push back, ask what it means — it keeps the thread, in any of a hundred languages, and it remembers you tomorrow.',
  },
];

const REFUSALS = [
  ['It does not pretend to be certain.',
   'An omen describes a sky, not a life. When a question is not one it can answer, it says so.'],
  ['It does not deal in fear.',
   'No death dates. No doom. No remedy sold for a curse it invented.'],
  ['It does not make you read.',
   'Everything here is a conversation first. The working is underneath when you want it.'],
];

const REFUSAL_HUES = [
  SHELF_COLOR.south_asia,
  SHELF_COLOR.china,
  SHELF_COLOR.pacific,
  SHELF_COLOR.sky,
];

export default function AboutPage() {
  return (
    <>

      <div data-no-auto-case data-no-binary className="sentence-case relative z-10 font-ui">
        {/* ───────────────────────── HEAD ───────────────────────── */}
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-8 md:pt-16">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <FadeUp>
                <p className={MONO}>Information</p>
              </FadeUp>

              <FadeUp delay={0.08}>
                <h1
                  data-no-auto-case
                  className="mt-5 font-semibold tracking-[-0.04em] text-white"
                  style={{ fontSize: 'clamp(2.1rem,5.6vw,3.9rem)', lineHeight: 1.08, maxWidth: '16ch' }}
                >
                  An oracle that shows its working.
                </h1>
              </FadeUp>

              <FadeUp delay={0.2}>
                <p data-no-auto-case className="mt-9 max-w-xl text-[18px] leading-[1.65] text-white/60">
                  Most astrology apps are a magazine column with a subscription
                  attached. This is a library — real traditions, real
                  arithmetic, read aloud by something you can argue with.
                </p>
              </FadeUp>
            </div>

            <div className="flex justify-center md:col-span-5">
              <FadeUp delay={0.14}>
                <PlanetMark name="neptune" size={330} />
              </FadeUp>
            </div>
          </div>
        </section>

        {/* ───────────────────── THE THREE MOVEMENTS ───────────────── */}
        <section className="border-t border-white/[0.07] bg-[#050509]/40">
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <FadeUp>
              <p className={MONO}>What happens when you ask</p>
            </FadeUp>

            <ol className="mt-14 space-y-14 md:space-y-20">
              {MOVEMENTS.map((m, i) => (
                <FadeUp key={m.n} delay={0.06 * i}>
                  <li className="grid grid-cols-1 gap-6 border-t border-white/[0.07] pt-10 md:grid-cols-12 md:gap-10">
                    <div className="md:col-span-3">
                      <PlanetMark name={m.planet} size={150} />
                      <span
                        className="mt-5 block text-[2rem] font-semibold leading-none tracking-[-0.04em]"
                        style={{ color: m.color }}
                      >
                        {m.n}
                      </span>
                      <span className="mt-2 block text-[17px] font-semibold text-white">
                        {m.title}
                      </span>
                    </div>

                    <div className="md:col-span-9">
                      <p
                        data-no-auto-case
                        className="font-semibold tracking-[-0.03em] text-white"
                        style={{ fontSize: 'clamp(1.5rem,3.2vw,2.15rem)', lineHeight: 1.22 }}
                      >
                        {m.lead}
                      </p>
                      <p data-no-auto-case className="mt-6 max-w-2xl text-[17px] leading-[1.65] text-white/60">
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
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-5xl px-6">
            <FadeUp>
              <p className={MONO}>Three things it will not do</p>
            </FadeUp>

            <FadeUp delay={0.08}>
              <h2
                data-no-auto-case
                className="mt-5 max-w-3xl font-semibold tracking-[-0.035em] text-white"
                style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', lineHeight: 1.16 }}
              >
                You are right to be sceptical.
                <span data-no-auto-case className="text-[#8A8A8E]"> Here is what
                we will not sell you.</span>
              </h2>
            </FadeUp>

            <dl className="mt-16 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
              {REFUSALS.map(([head, body], i) => (
                <FadeUp key={head} delay={0.05 * i}>
                  <div
                    className="border-l pl-6"
                    style={{ borderColor: `${REFUSAL_HUES[i]}59` }}
                  >
                    <dt
                      data-no-auto-case
                      className="text-[20px] font-semibold leading-[1.3] tracking-[-0.02em] text-white"
                    >
                      {head}
                    </dt>
                    <dd data-no-auto-case className="mt-4 text-[16px] leading-[1.6] text-white/50">
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
          <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
            <FadeUp>
              <p className={MONO}>Under it</p>
            </FadeUp>

            <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-10 md:grid-cols-3">
              <Fact color={SHELF_COLOR.south_asia} k="Ephemeris" v="Swiss Ephemeris" note="The sky, to the second of arc. What observatories run on." />
              <Fact color={SHELF_COLOR.china} k="Voice" v="OpenAI Realtime" note="Spoken, interruptible, in the language you already use." />
              <Fact color={SHELF_COLOR.pacific} k="Shelves" v="Twelve" note="Cards, cowries, coins, letters, stars." />
              <Fact color={SHELF_COLOR.sky} k="Traditions" v="102 of them" note="Named as their own people name them." />
              <Fact color={SHELF_COLOR.americas} k="Languages" v="Over a hundred" note="It speaks the one your phone is in." />
            </div>

            <FadeUp delay={0.15}>
              <p data-no-auto-case className="mt-16 max-w-2xl text-[17px] leading-[1.65] text-white/60">
                Built by{' '}
                <span data-no-auto-case className="text-[#F0F0F0]">Xooteq Lab</span>, a studio
                making voice-first tools for the ancient sciences. What we keep —{' '}
                {/* The policy is served by the API, not by this app — the same
                    URL the footer and the phone's settings screen point at. */}
                <a
                  href="https://api.plutto.space/privacy"
                  className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white"
                >
                  and what we do not
                </a>{' '}
                — is written in plain words, not in a policy nobody reads.
              </p>
            </FadeUp>
          </div>
        </section>

        {/* ───────────────────── THE DOOR ───────────────────── */}
        <section className="border-t border-white/[0.07]">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
            <FadeUp>
              <p
                data-no-auto-case
                className="font-semibold tracking-[-0.04em] text-white"
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
                  className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90"
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
function Fact({ k, v, note, color }) {
  return (
    <div>
      <dt className="text-[13px] font-semibold" style={{ color }}>{k}</dt>
      <dd>
        <span data-no-auto-case className="mt-2 block text-[22px] font-semibold tracking-[-0.02em] text-white">
          {v}
        </span>
        <span data-no-auto-case className="mt-2 block text-[15px] leading-[1.6] text-white/50">
          {note}
        </span>
      </dd>
    </div>
  );
}
