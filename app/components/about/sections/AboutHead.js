import FadeUp from '../../motion/FadeUp';
import PlanetMark from '../PlanetMark';
import { MONO } from '../classes';
import { Lines } from '../Lines';

export default function AboutHead() {
  return (
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
              Mystery deserves precision.
            </h1>
          </FadeUp>

          <FadeUp delay={0.2}>
            <p data-no-auto-case className="mt-10 max-w-md text-[15px] leading-[1.9] text-white/50">
              <Lines text={'We do not need to make the unknown less mysterious by making the mathematics mysterious too.\n\nPlanetary positions are calculated.\nTraditional systems are identified.\nMethods are documented.\nInterpretation comes after calculation.\n\nWhere there is something to measure—\nwe measure it.\n\nWhere there is something to interpret—\nwe tell you that we are interpreting it.'} />
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
  );
}
