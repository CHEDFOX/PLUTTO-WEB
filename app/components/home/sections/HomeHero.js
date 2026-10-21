import Link from 'next/link';
import Image from 'next/image';
import FadeUp from '../../motion/FadeUp';
import GetAppLink from '../../store/GetAppLink';
import Device from '../../phone/Device';
import AppVideo from '../../phone/AppVideo';
import Shot from '../../phone/Shot';
import LockApp from '../../phone/LockApp';
import Words from '../../motion/Words';
import HeroStage from '../hero/HeroStage';
import { Note } from '../../ink/Note';
import { Arrow } from '../../ink/Arrow';
import { Underline } from '../../ink/Underline';
import { Lines } from '../Lines';

// Hero: the copy on the left, the running product on the right, Neptune rising behind the phones.
export default function HomeHero() {
  return (
    <HeroStage
      neptune={<Image src="/planets/neptune-alpha.png" alt="" width={1600} height={2057} priority sizes="(min-width: 1024px) 1600px, 1100px" className="h-auto w-full grayscale" />}
      copy={(
        <>
          <FadeUp>
            <Link href="/#draw" className="inline-flex items-center gap-2 rounded-[2px] py-1.5 pl-1.5 pr-3.5 text-[13px] text-white/75 ring-1 ring-white transition-colors hover:bg-white/[0.06]">
              <span className="bg-white px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-black">Try it</span>
              Draw a card, no sign-up
              <span aria-hidden="true">→</span>
            </Link>
          </FadeUp>

          <FadeUp delay={0.06}>
            <h1 className="mx-auto mt-10 max-w-[15ch] text-[clamp(2rem,4.4vw,3.6rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white lg:mx-0">
              <Words text="The stars have been speaking" delay={0.1} />{' '}
              <Underline delay={1.2}><Words text="for a very long time." delay={0.55} wordClassName="shimmer-text pr-[0.06em]" /></Underline>
            </h1>
          </FadeUp>

          <FadeUp delay={0.12}>
            <p className="mx-auto mt-8 max-w-[36ch] lg:mx-0">
              <Lines text={'Now you can speak back.\n\nPlutto is a living oracle built from the ancient languages humans have used to read the unseen.'} />
            </p>
          </FadeUp>

          <FadeUp delay={0.18}>
            <div className="mt-9 flex flex-row flex-wrap items-center justify-center gap-3 lg:justify-start">
              <GetAppLink className="inline-flex h-12 items-center rounded-[2px] bg-white px-7 font-mono text-[13px] uppercase tracking-[0.18em] text-black transition-transform hover:scale-[1.03]">
                Ask Plutto
              </GetAppLink>
              <Link href="/app" className="inline-flex h-12 items-center gap-1.5 rounded-[2px] px-6 font-mono text-[13px] uppercase tracking-[0.18em] text-white ring-1 ring-white transition-colors hover:bg-white/[0.06]">
                Enter Plutto <span aria-hidden="true">→</span>
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={0.24}>
            <p className="mt-10 text-[13px] text-white/35 lg:hidden">
              Tarot · Lenormand · Runes · Ogham · I Ching · Geomancy · Astrology
            </p>
          </FadeUp>

          {/* handwritten note pointing at the phones */}
          <div className="mt-12 hidden items-center gap-3 lg:flex">
            <Note tilt={-4} delay={1.2}>ask about the job. or the ex. it’s heard worse.</Note>
            <Arrow dir="right" width={56} className="mt-2" delay={1.6} />
          </div>
        </>
      )}
      phones={[
        { key: 'chat', caption: 'Ask it anything — it answers.',
          mobile: <Device width={260}><AppVideo name="chat" poster="/app/screens/chat-empty.png" still="/app/screens/chat-poster.png" label="Plutto answering a question" /></Device>,
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
  );
}
