import FadeUp from '../../motion/FadeUp';
import PlanetMark from '../PlanetMark';
import { SHELF_COLOR } from '../../../lib/content/traditions';
import { MONO } from '../classes';
import { Lines } from '../Lines';

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
    title: 'The reading',
    lead: 'Bring the question. Plutto brings the tradition.',
    body:
      'Behind every answer is a system.\nBehind every system are centuries of observation, interpretation and human thought.\n\nPlutto calculates what can be calculated.\nThen it interprets what those patterns have meant within the tradition.\n\nYou ask.\nIt looks.\nYou continue.',
  },
  {
    n: '03',
    color: SHELF_COLOR.sky,
    planet: 'venus',
    title: 'The voice',
    lead: 'It talks, and it listens.',
    body:
      'The reading is spoken, not printed at you. Push back, ask what it means — it keeps the thread, in your own language, and it remembers you tomorrow.',
  },
];

export default function Movements() {
  return (
    <section className="border-t border-white/[0.07] bg-white/[0.03]">
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
                  <span className="mt-5 block font-display text-[2.6rem] font-bold leading-none text-white">
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
                  <p data-no-auto-case className="mt-8 max-w-xl text-[15px] leading-[1.9] text-white/50">
                    <Lines text={m.body} />
                  </p>
                </div>
              </li>
            </FadeUp>
          ))}
        </ol>
      </div>
    </section>
  );
}
