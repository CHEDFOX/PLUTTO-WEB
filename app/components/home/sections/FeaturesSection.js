import FadeUp from '../../motion/FadeUp';
import Device from '../../phone/Device';
import AppVideo from '../../phone/AppVideo';
import { Lines } from '../Lines';
import { H2 } from '../H2';
import { Tile } from '../Tile';
import { TileText } from '../TileText';

// The greetings the app's own language screen cycles through (the backend's onboarding_content).
const GREETINGS = ['Hello', 'Hola', 'Bonjour', 'مرحبا', 'Olá', 'Привет', '你好', 'こんにちは', '안녕하세요', 'Hallo', 'नमस्ते', 'নমস্কার', 'வணக்கம்', 'నమస్కారం', 'السلام علیکم', 'ආයුබෝවන්'];

export default function FeaturesSection() {
  return (
    <section id="features" className="lazy-section scroll-mt-20 border-t border-white/[0.08] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <FadeUp>
          <H2 className="max-w-[20ch]">Made for the question you keep to yourself.</H2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-6">
          {/* Decks */}
          <FadeUp className="md:col-span-2">
            <Tile className="h-full min-h-[340px]">
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
            <Tile className="h-full min-h-[300px]">
              <div className="md:pr-[170px]">
                <TileText title="It speaks yours." body="Pick your language once. The reading arrives in the one you dream in." />
                <div aria-hidden="true" className="mt-8 flex flex-wrap gap-2">
                  {GREETINGS.slice(0, 10).map((g, i) => (
                    <span key={g} className="greet-chip rounded-[2px] bg-white/[0.04] px-3 py-1.5 text-[14px] text-white/80 ring-1 ring-white/10" style={{ animationDelay: `${i * 0.9}s` }}>{g}</span>
                  ))}
                </div>
              </div>
              {/* The app's own language screen, recorded: the greeting cycles through the languages. */}
              <div className="pointer-events-none absolute -bottom-40 right-6 hidden md:block">
                <Device width={160}><AppVideo name="language" poster="/app/screens/language-start.jpg" still="/app/screens/language.png" label="Plutto's language screen" /></Device>
              </div>
            </Tile>
          </FadeUp>

          {/* Precision */}
          <FadeUp className="md:col-span-2">
            <Tile className="h-full min-h-[300px]">
              <TileText title="Your minute. Not your month." body={<Lines className="mt-1" text={'The heavens never stand still.\nNeither does your life.\n\nYesterday\u2019s sky is gone.\nTomorrow\u2019s has not arrived.\n\nThere is only this moment—\nand everything it contains.'} />} />
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
            <Tile className="h-full min-h-[260px]">
              <h3 className="text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white md:text-[24px]">
                The divine has many languages.
              </h3>
              <p className="mt-3 max-w-[38ch]">
                <Lines text={'Across civilizations, people learned to look in different places.\n\nThe sky.\nThe cards.\nThe numbers.\nThe symbols.\nThe moment itself.\n\nDifferent languages.\nOne ancient human desire:\nto understand what cannot yet be seen.'} />
              </p>
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
  );
}
