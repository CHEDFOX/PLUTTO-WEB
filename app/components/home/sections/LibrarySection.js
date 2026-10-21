import FadeUp from '../../motion/FadeUp';
import Marquee from '../marquee/Marquee';
import Ancient from '../Ancient';
import { Lines } from '../Lines';
import { H2 } from '../H2';

export default function LibrarySection() {
  return (
    <section className="lazy-section py-24 md:py-32">
      <FadeUp className="px-6 text-center">
        <H2 className="mx-auto max-w-[18ch]">The unseen has many languages.</H2>
        <p className="mx-auto mt-10 max-w-[40ch]">
          <Lines text={'The stars speak in cycles.\nSymbols speak in archetypes.\nNumbers speak in patterns.\nCards speak in stories.\nTime speaks in change.\n\nDifferent traditions learned to listen in different ways.\n\nPlutto brings these languages together—\nnot to tell you what to believe,\nbut to give you another way to look.'} />
        </p>
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
        <FadeUp delay={0.1} className="relative px-6">
          <p className="mx-auto mt-16 max-w-[36ch] text-center md:mt-24">
            <Lines text={'A light moving across the sky.\nA number appearing twice.\nA card turned at the right moment.\nA pattern where there should have been none.\n\nFor thousands of years, we have looked.\n\nNot because the unknown was frightening.\nBecause it was there.\n\nAnd perhaps—\nbecause some part of us believed it had something to say.'} />
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
