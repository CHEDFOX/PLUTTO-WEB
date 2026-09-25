/**
 * THE LANDING PAGE — built the way a product company builds one.
 *
 * WHAT CHANGED, AND WHY. The earlier pages were set in an editorial serif with
 * wide-spaced mono captions, under a custom cursor and a per-word glitch. Each
 * choice was defensible; together they read as a studio's portfolio, not a
 * company's product. Big product pages share a grammar a visitor recognises
 * before reading a word:
 *
 *   · one sans face, heavy and tightly tracked for headlines (Inter)
 *   · the product, on a phone, in the first screen
 *   · a bento of features, each tile one claim with its own picture
 *   · a closing band with the store badges
 *
 * The app's own face (Baloo 2) appears only INSIDE the phones, where it is the
 * app's type, not the site's.
 *
 * Kept from before: the six decks you can turn over (#draw) — the one thing on
 * the page that is play rather than description. The plain sentence Google's
 * OAuth brand verification needs is the page description (see `metadata`).
 */

import Link from 'next/link';
import Image from 'next/image';
import FadeUp from '../components/FadeUp';
import StoreBadges from '../components/StoreBadges';
import GetAppLink from '../components/GetAppLink';
import Draw from '../components/site/Draw';
import Device from '../components/site/app/Device';
import AppVideo from '../components/site/app/AppVideo';
import Shot from '../components/site/app/Shot';
import LockApp from '../components/site/app/LockApp';
import Marquee from '../components/site/Marquee';
import Story from '../components/site/Story';
import Words from '../components/site/motion/Words';
import HeroStage from '../components/site/HeroStage';
import Spotlight from '../components/site/motion/Spotlight';
import Ancient from '../components/site/Ancient';
import { Note, Arrow, Underline } from '../components/site/ink/Ink';

// The greetings the app's own language screen cycles through (onboarding_content.LANGUAGES).
const GREETINGS = ['Hello', 'Hola', 'Bonjour', 'مرحبا', 'Olá', 'Привет', '你好', 'こんにちは', '안녕하세요', 'Hallo', 'नमस्ते', 'নমস্কার', 'வணக்கம்', 'నమస్కారం', 'السلام علیکم', 'ආයුබෝවන්'];

function H2({ children, className = '' }) {
  return (
    <h2 className={`text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white ${className}`}>
      {typeof children === 'string' ? <Words text={children} stagger={0.06} /> : children}
    </h2>
  );
}

function Tile({ className = '', glow, children }) {
  return (
    <Spotlight
      glow={glow ? glow.replace(/0\.\d+\)$/, '0.22)') : 'rgba(255,255,255,0.08)'}
      className={`relative overflow-hidden rounded-[28px] bg-[#0c0c11] p-7 ring-1 ring-white/[0.08] transition-transform duration-500 hover:-translate-y-1 md:p-8 ${className}`}
      style={glow ? { backgroundImage: `radial-gradient(90% 70% at 100% 0%, ${glow}, transparent 70%)` } : undefined}
    >
      <div className="relative z-10 h-full">{children}</div>
    </Spotlight>
  );
}

function TileText({ title, body }) {
  return (
    <>
      <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[24px]">{title}</h3>
      <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-white/55">{body}</p>
    </>
  );
}

// The sentence Google's OAuth brand verification needs (it once rejected this
// page for not saying what the app does) lives in the description now, not on
// the page. Do not remove it without checking the consent screen still reads
// "Plutto" rather than the raw Supabase host.
export const metadata = {
  description:
    'Plutto is an astrology reader you can talk back to. Give it a date, a time and a place; it works out where the sky stood and reads it to you out loud, in your language.',
};

export default function Home() {
  return (
    <div data-no-auto-case data-no-binary className="sentence-case relative z-10 font-ui">
      {/* ─────────────────────────── HERO ───────────────────────────
          Text left, the product right — the product visible in the first
          screen, and running. Neptune rises behind the phones: the brand's
          best art, used as a horizon rather than a sticker. */}
      <HeroStage
        neptune={<Image src="/planets/neptune-alpha.png" alt="" width={1600} height={2057} priority sizes="(min-width: 1024px) 1600px, 1100px" className="h-auto w-full" />}
        copy={(
          <>
            <FadeUp>
              <Link href="/#draw" className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3.5 text-[13px] text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">Try it</span>
                Draw a card, no sign-up
                <span aria-hidden="true">→</span>
              </Link>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="mx-auto mt-7 max-w-[13ch] text-[clamp(2.9rem,6.6vw,5.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white lg:mx-0">
                <Words text="Five thousand years old." delay={0.1} />{' '}
                <Underline delay={1.2}><Words text="Talks back." delay={0.55} wordClassName="shimmer-text pr-[0.06em]" /></Underline>
              </h1>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <GetAppLink className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03]">
                  Get the app
                </GetAppLink>
                <Link href="/app" className="inline-flex h-12 items-center gap-1.5 rounded-full px-6 text-[15px] font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/[0.06]">
                  Try it on the web <span aria-hidden="true">→</span>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.24}>
              <p className="mt-10 text-[13px] text-white/35 lg:hidden">
                Tarot · Lenormand · Runes · Ogham · I Ching · Geomancy · Astrology
              </p>
            </FadeUp>

            {/* the hand: a nudge toward the phones, in the voice of a friend */}
            <div className="mt-12 hidden items-center gap-3 lg:flex">
              <Note tilt={-4} delay={1.2}>ask about the job. or the ex. it’s heard worse.</Note>
              <Arrow dir="right" width={56} className="mt-2" delay={1.6} />
            </div>
          </>
        )}
        phones={[
          { key: 'chat', caption: 'Ask it anything — it answers.',
            mobile: <Device width={300}><AppVideo name="chat" poster="/app/screens/chat-empty.png" still="/app/screens/chat-poster.png" label="Plutto answering a question" /></Device>,
            node: <Device width={280}><AppVideo name="chat" poster="/app/screens/chat-empty.png" still="/app/screens/chat-poster.png" label="Plutto answering a question" /></Device> },
          { key: 'tarot', caption: 'Lay the cards — it reads them.',
            node: <Device width={280}><AppVideo name="tarot" poster="/app/screens/tarot-start.jpg" still="/app/screens/tarot.png" label="Laying tarot cards in Plutto" /></Device>,
            small: <Device width={270}><Shot src="/app/screens/tarot.png" alt="A tarot card turned over in Plutto" /></Device> },
          { key: 'push', caption: 'A line about your day, every morning at nine.',
            node: <Device width={280} statusTime=""><LockApp live /></Device>,
            idle: <Device width={280} statusTime=""><LockApp live={false} /></Device>,
            small: <Device width={270} statusTime=""><LockApp /></Device> },
        ]}
      />

      {/* ─────────────────────────── THE LIBRARY ─────────────────────────── */}
      <section className="lazy-section py-24 md:py-32">
        <FadeUp className="px-6 text-center">
          <H2 className="mx-auto max-w-[18ch]">Every way the world ever asked.</H2>
          <p className="mx-auto mt-4 max-w-[44ch] text-[17px] text-white/55">The oldest decks on earth, dealt to you and read for you. Not a horoscope column. The real thing.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-14">
            <Marquee />
          </div>
        </FadeUp>
        {/* the oldest question, in the scripts that first asked it */}
        <div className="relative mt-24 md:mt-32">
          {/* 𒀭 — the Sumerian sign for sky, and for god: a star */}
          <span aria-hidden="true" className="watermark script-cunei hidden text-[24vw] md:block">𒀭</span>
          <FadeUp delay={0.05} className="relative">
            <Ancient />
          </FadeUp>
        </div>
      </section>

      {/* ─────────────────────────── HOW IT WORKS ─────────────────────────── */}
      <section id="how" className="lazy-section scroll-mt-20 border-t border-white/[0.08] pt-24 md:pt-32">
        <FadeUp className="px-6 text-center">
          <H2>How it gets to know you.</H2>
        </FadeUp>
        <div className="mt-6 md:mt-0">
          <Story />
        </div>
      </section>

      {/* ─────────────────────────── FEATURES ─────────────────────────── */}
      <section id="features" className="lazy-section scroll-mt-20 border-t border-white/[0.08] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <H2 className="max-w-[20ch]">Made for the question you keep to yourself.</H2>
          </FadeUp>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Decks */}
            <FadeUp className="md:col-span-2">
              <Tile className="h-full min-h-[340px]" glow="rgba(56,189,248,0.25)">
                <TileText title="Real cards. Your hand." body="You shuffle, you choose, it reads what you drew. Never the same draw twice." />
                <div aria-hidden="true" className="relative mt-8 h-[150px]">
                  {[['tarot/the_sun', -14, -60, -26, -92], ['runes/sowilo', 0, 0, 0, 0], ['tarot/the_moon', 14, 60, 26, 92]].map(([src, r, x, r2, x2], i) => (
                    <img key={src} src={`/library/${src}.webp`} alt="" width={300} height={527} loading="lazy"
                         className="fan-card absolute left-1/2 top-0 w-[84px] rounded-[6px] ring-1 ring-white/15 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.9)]"
                         style={{ '--x': `${x}px`, '--r': `${r}deg`, '--x2': `${x2}px`, '--r2': `${r2}deg`, animationDelay: `${-i * 1.3}s`, transformOrigin: '50% 120%' }} />
                  ))}
                </div>
              </Tile>
            </FadeUp>

            {/* Languages */}
            <FadeUp className="md:col-span-4" delay={0.05}>
              <Tile className="h-full min-h-[300px]" glow="rgba(244,114,182,0.22)">
                <div className="md:pr-[170px]">
                  <TileText title="It speaks yours." body="109 languages. The reading arrives in the one you dream in." />
                  <div aria-hidden="true" className="mt-8 flex flex-wrap gap-2">
                    {GREETINGS.slice(0, 10).map((g, i) => (
                      <span key={g} className="greet-chip rounded-full bg-white/[0.06] px-3 py-1.5 text-[14px] text-white/80 ring-1 ring-white/10" style={{ animationDelay: `${i * 0.9}s` }}>{g}</span>
                    ))}
                  </div>
                </div>
                {/* The app's own language screen, recorded: the greeting cycles through the languages. */}
                <div className="pointer-events-none absolute -bottom-40 right-6 hidden md:block">
                  <Device width={160}><AppVideo name="language" poster="/app/screens/language-start.jpg" still="/app/screens/language.png" label="Plutto's language screen" /></Device>
                </div>
              </Tile>
            </FadeUp>

            {/* Exact — the arithmetic under it all */}
            <FadeUp className="md:col-span-2">
              <Tile className="h-full min-h-[300px]" glow="rgba(251,146,60,0.25)">
                <TileText title="Your minute, not your month." body="Swiss Ephemeris, the same arithmetic observatories use. The sky exactly as it stood when you arrived." />
                <div aria-hidden="true" data-no-auto-case className="mt-8 space-y-1.5 font-mono text-[13px] text-white/60">
                  {[['☉', 'Sun', '14°32′', 'Gemini'], ['☽', 'Moon', '02°08′', 'Scorpio'], ['↑', 'Rising', '27°51′', 'Leo'], ['♄', 'Saturn', '19°44′', 'Pisces']].map(([g, n, d, sgn]) => (
                    <div key={n} className="flex items-center gap-3">
                      <span className="w-4 text-center text-white/85">{g}</span>
                      <span className="w-14 text-white/45">{n}</span>
                      <span className="tabular-nums text-white/85">{d}</span>
                      <span className="text-white/45">{sgn}</span>
                    </div>
                  ))}
                </div>
              </Tile>
            </FadeUp>

            {/* Traditions */}
            <FadeUp className="md:col-span-2" delay={0.05}>
              <Tile className="h-full min-h-[260px]" glow="rgba(52,211,153,0.2)">
                <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[24px]">
                  102 ways to read a life. <Note tilt={-5} size="text-[21px]" className="ml-1 align-baseline">and counting</Note>
                </h3>
                <p className="mt-2 max-w-[38ch] text-[15px] leading-relaxed text-white/55">It picks the tradition that fits the question. You just ask.</p>
                <div aria-hidden="true" className="mt-7 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/35">
                  {['Ifá', 'Jyotiṣa', 'I Ching', 'Tarot', 'Norse runes', 'Ogham', 'Geomancy', 'Lenormand', 'Hafez', 'Tasseography'].map((t) => <span key={t}>{t}</span>)}
                </div>
              </Tile>
            </FadeUp>

            {/* Private */}
            <FadeUp className="md:col-span-2" delay={0.1}>
              <Tile className="h-full min-h-[260px]">
                <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="mb-6 opacity-80">
                  <rect x="4" y="10.5" width="16" height="10" rx="3" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.3" fill="white" />
                </svg>
                <TileText title="Yours. Only yours." body="What you ask stays with you. Gone in one tap, whenever you say." />
              </Tile>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── TRY A CARD ─────────────────────────── */}
      <section id="draw" className="lazy-section relative scroll-mt-20 overflow-hidden border-t border-white/[0.08] px-6 py-24 md:py-32">
        {/* 𓂀 — the eye, watching the card turn */}
        <span aria-hidden="true" className="watermark script-hiero hidden text-[36vw] md:block">𓂀</span>
        <FadeUp className="relative text-center">
          <H2>Turn a card.</H2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[17px] text-white/55">Tap a deck. Tap again for another.</p>
          <div className="mt-6 flex items-end justify-center gap-2">
            <Note tilt={-6} delay={0.3}>go on.</Note>
            <Arrow dir="down" width={26} className="mb-1" delay={0.7} />
          </div>
        </FadeUp>
        <FadeUp delay={0.1} className="relative">
          <div className="mt-14">
            <Draw />
          </div>
        </FadeUp>
      </section>

      {/* ─────────────────────────── DOWNLOAD ─────────────────────────── */}
      <section id="download" className="lazy-section scroll-mt-20 px-6 pb-16 md:pb-20">
        <FadeUp>
          <div className="aurora relative mx-auto max-w-6xl overflow-hidden rounded-[36px] px-6 py-20 text-center ring-1 ring-white/10 md:py-24"
               style={{ background: '#0a0a10' }}>
            <div className="relative z-10">
            <H2 className="mx-auto max-w-[16ch]">Your question is waiting.</H2>
            <p className="mx-auto mt-4 max-w-[34ch] text-[17px] text-white/60">Ask it here, free. Or take it with you.</p>
            <div className="mt-9 flex justify-center">
              <Link href="/app" className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90">
                Open Plutto on the web
              </Link>
            </div>
            <StoreBadges className="mt-6" />
            <div className="mt-8"><Note tilt={-3} delay={0.4}>we’ll wait.</Note></div>
            </div>
          </div>
        </FadeUp>

      </section>
    </div>
  );
}
