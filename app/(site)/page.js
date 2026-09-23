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
import FadeUp from '../components/FadeUp';
import StoreBadges from '../components/StoreBadges';
import Draw from '../components/site/Draw';
import { Phone, ChatScreen, CardScreen, LockScreen } from '../components/site/Phone';

const STATS = [
  ['102', 'traditions'],
  ['6', 'card decks'],
  ['100+', 'languages'],
  ['Voice', 'and text'],
];

const GREETINGS = ['Hello', 'Hola', 'Bonjour', 'مرحبا', 'Olá', 'Привет', '你好', 'こんにちは', '안녕하세요', 'नमस्ते', 'வணக்கம்', 'Merhaba', 'Ciao', 'Hallo', 'Xin chào', 'Jambo'];

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
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[-10%] h-[900px]"
             style={{ background: 'radial-gradient(50% 45% at 50% 55%, rgba(124,92,255,0.35), transparent 70%), radial-gradient(30% 30% at 30% 70%, rgba(56,189,248,0.18), transparent 70%), radial-gradient(30% 30% at 72% 68%, rgba(244,114,182,0.16), transparent 70%)' }} />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 text-center md:pt-16">
          <FadeUp>
            <Link href="/#draw" className="inline-flex items-center gap-2 rounded-full bg-white/[0.06] px-3.5 py-1.5 text-[13px] text-white/75 ring-1 ring-white/10 transition-colors hover:bg-white/[0.1]">
              <span className="rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-black">Try it</span>
              Draw a card — no sign-up
              <span aria-hidden="true">→</span>
            </Link>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h1 className="mx-auto mt-7 max-w-[14ch] text-[clamp(2.75rem,8vw,5.75rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
              The oracle in your pocket.
            </h1>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="mx-auto mt-6 max-w-[36ch] text-[clamp(1.05rem,1.8vw,1.3rem)] leading-relaxed text-white/60">
              Tarot, runes, I Ching and your stars — read for you, out loud, in your language.
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#download" className="inline-flex h-12 items-center rounded-full bg-white px-7 text-[15px] font-semibold text-black transition-opacity hover:opacity-90">
                Get the app
              </a>
              <Link href="/app" className="inline-flex h-12 items-center gap-1.5 rounded-full px-6 text-[15px] font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/[0.06]">
                Try it on the web <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeUp>

          {/* Three phones. The side two are desktop-only; on a phone one is enough. */}
          <FadeUp delay={0.26} y={48}>
            <div className="relative mx-auto mt-14 flex h-[560px] justify-center md:mt-16 md:h-[700px]">
              <Phone floating className="left-1/2 top-16 hidden -translate-x-[118%] -rotate-[6deg] scale-[0.86] opacity-90 md:block">
                <CardScreen />
              </Phone>
              <Phone floating className="left-1/2 top-16 hidden translate-x-[18%] rotate-[6deg] scale-[0.86] opacity-90 md:block">
                <LockScreen />
              </Phone>
              <Phone className="relative z-10 origin-top scale-[0.84] md:scale-100">
                <ChatScreen />
              </Phone>
            </div>
          </FadeUp>
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-black" />
      </section>

      {/* ─────────────────────────── STATS ─────────────────────────── */}
      <section className="border-y border-white/[0.08]">
        <dl className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {STATS.map(([n, l], i) => (
            <div key={l} className={`px-6 py-10 text-center ${i % 2 ? 'border-l border-white/[0.08]' : ''} ${i > 1 ? 'border-t border-white/[0.08] md:border-t-0' : ''} ${i === 2 ? 'md:border-l' : ''}`}>
              <dt className="text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.04em] text-white">{n}</dt>
              <dd className="mt-1 text-[14px] text-white/50">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ─────────────────────────── FEATURES ─────────────────────────── */}
      <section id="features" className="scroll-mt-20 px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <FadeUp>
            <Eyebrow>Features</Eyebrow>
            <H2 className="mt-3 max-w-[18ch]">Every oracle. One conversation.</H2>
          </FadeUp>

          <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
            {/* Talk to it */}
            <FadeUp className="md:col-span-4">
              <Tile className="h-full min-h-[340px]" glow="rgba(124,92,255,0.35)">
                <TileText title="Talk to it. Out loud." body="Ask by voice or text. Interrupt it, push back, ask why. It keeps the thread — and remembers you tomorrow." />
                <div aria-hidden="true" className="mt-10 flex h-[120px] w-full items-center justify-between">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const h = 14 + Math.round(Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) * 96);
                    return <span key={i} className="w-[4px] flex-none rounded-full bg-gradient-to-t from-violet-500 to-sky-300" style={{ height: h, opacity: 0.35 + (h / 110) * 0.65 }} />;
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
                <TileText title="It speaks your language." body="Over a hundred of them. It answers in the one your phone is already in." />
                <div aria-hidden="true" className="mt-8 flex flex-wrap gap-2">
                  {GREETINGS.map((g) => (
                    <span key={g} className="rounded-full bg-white/[0.06] px-3 py-1.5 text-[14px] text-white/80 ring-1 ring-white/10">{g}</span>
                  ))}
                </div>
              </Tile>
            </FadeUp>

            {/* Morning */}
            <FadeUp className="md:col-span-3" delay={0.1}>
              <Tile className="h-full min-h-[300px]" glow="rgba(251,146,60,0.25)">
                <TileText title="A reading every morning." body="One line, before the day starts. Short enough to remember at noon." />
                <div aria-hidden="true" className="mt-8 rounded-[20px] bg-white/[0.08] p-4 ring-1 ring-white/10 backdrop-blur">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-[10px] bg-black ring-1 ring-white/10">
                      <span className="relative inline-block h-[16px] w-[16px] rounded-full bg-gradient-to-br from-white to-white/40">
                        <span className="absolute inset-[4px] rounded-full bg-black" />
                      </span>
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between text-[13px]">
                        <span className="font-semibold text-white">Your morning</span>
                        <span className="text-white/45">7:30</span>
                      </div>
                      <p className="text-[14px] text-white/80">A quiet day for decisions. Say the hard thing before noon.</p>
                    </div>
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
