import FadeUp from '../../motion/FadeUp';
import Draw from '../Draw';
import { Note } from '../../ink/Note';
import { Arrow } from '../../ink/Arrow';
import { H2 } from '../H2';

export default function DrawSection() {
  return (
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
  );
}
