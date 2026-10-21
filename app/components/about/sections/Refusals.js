import FadeUp from '../../motion/FadeUp';
import { SHELF_COLOR } from '../../../lib/content/traditions';
import { MONO } from '../classes';
import { Lines } from '../Lines';

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

export default function Refusals() {
  return (
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
            You don&apos;t have to believe us.
            <span data-no-auto-case className="text-graphite"> You shouldn&apos;t.</span>
          </h2>
        </FadeUp>

        <FadeUp delay={0.08}>
          <p data-no-auto-case className="mt-10 max-w-md text-[15px] leading-[1.9] text-white/50">
            <Lines text={'Ask how the chart was calculated.\nAsk which tradition we\u2019re using.\nAsk where an interpretation comes from.\n\nPlutto is built to show its work wherever the tradition allows it.\n\nBecause mystery is interesting.\nMystery without honesty isn\u2019t.'} />
          </p>
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
  );
}
