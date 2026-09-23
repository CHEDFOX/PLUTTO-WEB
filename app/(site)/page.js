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
 *   · a row of hard numbers
 *   · a bento of features, each tile one claim with its own picture
 *   · a closing band with the store badges
 *
 * The app's own face (Baloo 2) appears only INSIDE the phones, where it is the
 * app's type, not the site's.
 *
 * Kept from before: the six decks you can turn over (#draw) — the one thing on
 * the page that is play rather than description — and the plain sentence that
 * Google's OAuth brand verification needs (see the note at the bottom).
 */

import Link from 'next/link';
import Image from 'next/image';
import FadeUp from '../components/FadeUp';
import StoreBadges from '../components/StoreBadges';
import Draw from '../components/site/Draw';
import Device from '../components/site/app/Device';
import AppVideo from '../components/site/app/AppVideo';
import Shot from '../components/site/app/Shot';
import LockApp, { PUSH } from '../components/site/app/LockApp';
import CountUp from '../components/site/CountUp';
import Marquee from '../components/site/Marquee';
import Story from '../components/site/Story';

const STATS = [
  [102, '', 'traditions'],
  [6, '', 'card decks'],
  [182, '', 'cards to draw'],
  [100, '+', 'languages'],
];

// The greetings the app's own language screen cycles through (onboarding_content.LANGUAGES).
const GREETINGS = ['Hello', 'Hola', 'Bonjour', 'مرحبا', 'Olá', 'Привет', '你好', 'こんにちは', '안녕하세요', 'Hallo', 'नमस्ते', 'নমস্কার', 'வணக்கம்', 'నమస్కారం', 'السلام علیکم', 'ආයුබෝවන්'];

function Eyebrow({ children, color = '#A78BFA' }) {
  return <p className="text-[14px] font-semibold" style={{ color }}>{children}</p>;
}

function H2({ children, className = '' }) {
  return (
    <h2 className={`text-[clamp(2rem,4.6vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white ${className}`}>
      {children}
    </h2>
  );
}

function Tile({ className = '', glow, children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] bg-[#0c0c11] p-7 ring-1 ring-white/[0.08] md:p-8 ${className}`}
      style={glow ? { backgroundImage: `radial-gradient(90% 70% at 100% 0%, ${glow}, transparent 70%)` } : undefined}
    >
      {children}
    </div>
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

export default function Home() {
  return (
    <div data-no-auto-case data-no-binary className="sentence-case relative z-10 font-ui">
      {/* ─────────────────────────── HERO ───────────────────────────
          Text left, the product right — the product visible in the first
          screen, and running. Neptune rises behind the phones: the brand's
          best art, used as a horizon rather than a sticker. */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0"
             style={{ background: 'radial-gradient(40% 50% at 72% 60%, rgba(56,120,255,0.22), transparent 70%), radial-gradient(35% 40% at 20% 30%, rgba(124,92,255,0.18), transparent 70%)' }} />

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-6 px-6 pt-12 lg:min-h-[calc(100svh-64px)] lg:grid-cols-[1.05fr_1fr] lg:gap-4 lg:pt-0">
          <div className="text-center lg:text-left">
            <FadeUp>
              <Link href="/#draw" className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] py-1.5 pl-1.5 pr-3.5 text-[13px] text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
                <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">Try it</span>
                Draw a card — no sign-up
                <span aria-hidden="true">→</span>
              </Link>
            </FadeUp>

            <FadeUp delay={0.06}>
              <h1 className="mx-auto mt-7 max-w-[12ch] text-[clamp(2.9rem,6.6vw,5.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-white lg:mx-0">
                The oracle in your{' '}
                <span className="bg-gradient-to-r from-sky-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">pocket.</span>
              </h1>
            </FadeUp>

            <FadeUp delay={0.12}>
              <p className="mx-auto mt-6 max-w-[34ch] text-[clamp(1.05rem,1.6vw,1.25rem)] leading-relaxed text-white/60 lg:mx-0">
                Tarot, runes, I Ching and your stars — read for you, out loud, in your language.
              </p>
            </FadeUp>

            <FadeUp delay={0.18}>
              <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <a href="#download" className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-transform hover:scale-[1.03]">
                  Get the app
                </a>
                <Link href="/app" className="inline-flex h-12 items-center gap-1.5 rounded-full px-6 text-[15px] font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/[0.06]">
                  Try it on the web <span aria-hidden="true">→</span>
                </Link>
              </div>
            </FadeUp>

            <FadeUp delay={0.24}>
              <p className="mt-10 text-[13px] text-white/35">
                Tarot · Lenormand · Runes · Ogham · I Ching · Geomancy · Astrology
              </p>
            </FadeUp>
          </div>

          {/* The phones. The side two are desktop-only; on a phone one is enough. */}
          <FadeUp delay={0.2} y={40}>
            <div className="relative mx-auto flex h-[650px] justify-center lg:h-[720px] lg:items-center">
              {/* Neptune, rising. The render is mostly black sky with the
                  planet across its middle ~45%, so it is drawn far larger than
                  the column and positioned so only its upper arc shows below
                  the phones. Screen blend drops the black. */}
              <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[-90px] w-[1100px] max-w-none -translate-x-1/2 lg:top-[-250px] lg:w-[1600px]"
                   style={{ mixBlendMode: 'screen' }}>
                <Image src="/planets/Neptune.png" alt="" width={1600} height={2057} priority sizes="(min-width: 1024px) 1600px, 1100px" className="h-auto w-full" />
              </div>
              <div className="float-b absolute left-1/2 top-24 hidden lg:block" style={{ marginLeft: -300 }}>
                <Device width={270} className="-rotate-[7deg] opacity-95"><Shot src="/app/screens/tarot.png" alt="A tarot card turned over in Plutto" /></Device>
              </div>
              <div className="float-a absolute left-1/2 top-24 hidden lg:block" style={{ marginLeft: 30 }}>
                <Device width={270} statusTime="" className="rotate-[7deg] opacity-95"><LockApp /></Device>
              </div>
              <Device width={300} className="relative z-10"><AppVideo name="chat" poster="/app/screens/chat-empty.png" still="/app/screens/chat-poster.png" label="Plutto answering a question" /></Device>
            </div>
          </FadeUp>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-12 bg-gradient-to-b from-transparent to-black lg:h-40" />
      </section>

      {/* ─────────────────────────── STATS ─────────────────────────── */}
      <section className="relative border-y border-white/[0.08] bg-black">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {STATS.map(([n, suffix, l], i) => (
            <div key={l} className={`px-6 py-10 text-center md:py-12 ${i % 2 ? 'border-l border-white/[0.08]' : ''} ${i > 1 ? 'border-t border-white/[0.08] md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}>
              <dt className="text-[clamp(2.2rem,4.4vw,3.4rem)] font-semibold tracking-[-0.045em] text-white">
                <CountUp to={n} suffix={suffix} />
              </dt>
              <dd className="mt-1 text-[14px] text-white/50">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─────────────────────────── THE LIBRARY ─────────────────────────── */}
      <section className="py-24 md:py-32">
        <FadeUp className="px-6 text-center">
          <Eyebrow color="#F472B6">The library</Eyebrow>
          <H2 className="mx-auto mt-3 max-w-[18ch]">Every oracle the world kept.</H2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[17px] text-white/55">Every card here is in the app — dealt for you, and read for you.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-14">
            <Marquee />
          </div>
        </FadeUp>
      </section>

      {/* ─────────────────────────── HOW IT WORKS ─────────────────────────── */}
      <section id="how" className="scroll-mt-20 border-t border-white/[0.08] pt-24 md:pt-32">
        <FadeUp className="px-6 text-center">
          <Eyebrow>How it works</Eyebrow>
          <H2 className="mt-3">Ask. Listen. Know.</H2>
        </FadeUp>
        <div className="mt-6 md:mt-0">
          <Story />
        </div>
      </section>

      {/* ─────────────────────────── FEATURES ─────────────────────────── */}
      <section id="features" className="scroll-mt-20 border-t border-white/[0.08] px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <Eyebrow>Features</Eyebrow>
            <H2 className="mt-3 max-w-[18ch]">Every oracle. One conversation.</H2>
          </FadeUp>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Talk to it */}
            <FadeUp className="md:col-span-4">
              <Tile className="h-full min-h-[340px]" glow="rgba(124,92,255,0.35)">
                <TileText title="Talk to it. Out loud." body="Ask by voice or text. Push back, ask why. It keeps the thread — and remembers you tomorrow." />
                <div aria-hidden="true" className="mt-10 flex h-[120px] w-full items-center justify-between">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const h = 14 + Math.round(Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 96);
                    return <span key={i} className="wave-bar w-[4px] flex-none rounded-full bg-gradient-to-t from-violet-500 to-sky-300" style={{ height: h, opacity: 0.35 + (h / 110) * 0.65, animationDelay: `${-(i % 9) * 0.16}s` }} />;
                  })}
                </div>
              </Tile>
            </FadeUp>

            {/* Decks */}
            <FadeUp className="md:col-span-2" delay={0.05}>
              <Tile className="h-full min-h-[340px]" glow="rgba(56,189,248,0.25)">
                <TileText title="Six real decks." body="Tarot, Lenormand, runes, ogham, I Ching, geomancy." />
                <div aria-hidden="true" className="relative mt-8 h-[150px]">
                  {[['tarot/the_sun', -14, -60], ['runes/sowilo', 0, 0], ['tarot/the_moon', 14, 60]].map(([src, r, x]) => (
                    <img key={src} src={`/library/${src}.webp`} alt="" width={300} height={527} loading="lazy"
                         className="absolute left-1/2 top-0 w-[84px] rounded-[6px] ring-1 ring-white/15 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.9)]"
                         style={{ transform: `translateX(calc(-50% + ${x}px)) rotate(${r}deg)`, transformOrigin: '50% 120%' }} />
                  ))}
                </div>
              </Tile>
            </FadeUp>

            {/* Languages */}
            <FadeUp className="md:col-span-3" delay={0.05}>
              <Tile className="h-full min-h-[300px]" glow="rgba(244,114,182,0.22)">
                <TileText title="It speaks your language." body="109 of them. Pick yours once and every reading arrives in it." />
                <div aria-hidden="true" className="mt-8 flex flex-wrap gap-2">
                  {GREETINGS.map((g) => (
                    <span key={g} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[14px] text-white/80 ring-1 ring-white/10">{g}</span>
                  ))}
                </div>
              </Tile>
            </FadeUp>

            {/* Morning — the real push, word for word */}
            <FadeUp className="md:col-span-3" delay={0.1}>
              <Tile className="h-full min-h-[300px]" glow="rgba(251,146,60,0.25)">
                <TileText title="A line every morning." body="At nine, wherever you are. One line about your day — short enough to remember at noon." />
                <div aria-hidden="true" className="mt-8 flex items-start gap-3 rounded-[22px] bg-white/[0.1] p-3.5 ring-1 ring-white/10 backdrop-blur">
                  <Image src="/app/icon.png" alt="" width={38} height={38} className="h-[38px] w-[38px] flex-none rounded-[9px]" />
                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between text-[14px]">
                      <span className="font-semibold text-white">{PUSH.title}</span>
                      <span className="text-white/45">now</span>
                    </div>
                    <p className="text-[14px] leading-snug text-white/85">{PUSH.body}</p>
                  </div>
                </div>
              </Tile>
            </FadeUp>

            {/* Traditions */}
            <FadeUp className="md:col-span-3" delay={0.05}>
              <Tile className="h-full min-h-[260px]" glow="rgba(52,211,153,0.2)">
                <TileText title="102 traditions." body="From Ile-Ife to Varanasi, each named as its own people name it. Plutto picks the one that fits your question." />
                <div aria-hidden="true" className="mt-7 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-white/35">
                  {['Ifá', 'Jyotiṣa', 'I Ching', 'Tarot', 'Norse runes', 'Ogham', 'Geomancy', 'Lenormand', 'Hafez', 'Tasseography'].map((t) => <span key={t}>{t}</span>)}
                </div>
              </Tile>
            </FadeUp>

            {/* Private */}
            <FadeUp className="md:col-span-3" delay={0.1}>
              <Tile className="h-full min-h-[260px]">
                <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" className="mb-6 opacity-80">
                  <rect x="4" y="10.5" width="16" height="10" rx="3" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.3" fill="white" />
                </svg>
                <TileText title="Private by design." body="Your birth details and your questions stay yours. Delete your account, and everything with it, in one tap." />
              </Tile>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── TRY A CARD ─────────────────────────── */}
      <section id="draw" className="scroll-mt-20 border-t border-white/[0.08] px-6 py-24 md:py-32">
        <FadeUp className="text-center">
          <Eyebrow color="#38BDF8">Try it now</Eyebrow>
          <H2 className="mt-3">Pick a deck.</H2>
          <p className="mx-auto mt-4 max-w-[40ch] text-[17px] text-white/55">Tap one to turn a card. Tap again to draw another.</p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="mt-14">
            <Draw />
          </div>
        </FadeUp>
      </section>

      {/* ─────────────────────────── DOWNLOAD ─────────────────────────── */}
      <section id="download" className="scroll-mt-20 px-6 pb-16 md:pb-20">
        <FadeUp>
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[36px] px-6 py-20 text-center ring-1 ring-white/10 md:py-24"
               style={{ background: 'radial-gradient(70% 90% at 50% 0%, rgba(124,92,255,0.45), transparent 70%), radial-gradient(50% 60% at 15% 100%, rgba(56,189,248,0.2), transparent 70%), radial-gradient(50% 60% at 85% 100%, rgba(244,114,182,0.2), transparent 70%), #0a0a10' }}>
            <H2 className="mx-auto max-w-[16ch]">Your question is waiting.</H2>
            <p className="mx-auto mt-4 max-w-[38ch] text-[17px] text-white/60">Open it here in your browser, or get it on your phone.</p>
            <div className="mt-9 flex justify-center">
              <Link href="/app" className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90">
                Open Plutto on the web
              </Link>
            </div>
            <StoreBadges className="mt-6" />
          </div>
        </FadeUp>

        {/* Kept deliberately plain. Google's OAuth brand verification
            rejected this page once for not saying what the app does; this
            sentence is the anchor that keeps it from happening again if the
            brand is re-audited. Do not remove without checking the consent
            screen still reads "Plutto" rather than the raw Supabase host. */}
        <p className="mx-auto mt-16 max-w-[60ch] text-center text-[14px] leading-relaxed text-white/40">
          Plutto is an astrology oracle you can talk back to. Give it a
          date, a time and a place; it works out where the sky stood and
          reads it to you out loud, in your language.
        </p>
      </section>
    </div>
  );
}
