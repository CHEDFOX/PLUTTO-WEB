'use client';

/**
 * THE ROLL-CALL — a hundred and two traditions, moving past.
 *
 * The number is the argument, and a number is not felt when it is read: "102
 * traditions" is a claim, while a row of names that does not stop before you
 * look away is evidence. So the list is shown at a speed that makes it
 * unfinishable on purpose — you can read any name, and you cannot read them
 * all, which is the honest impression of a library this size.
 *
 * Two rows travelling opposite ways, because a single direction reads as a
 * ticker (news, prices, urgency) and two read as a current.
 *
 * MOTION. The track is duplicated and translated by exactly −50%, so the loop
 * is seamless without measurement. `prefers-reduced-motion` stops it dead and
 * leaves a legible, scrollable row — not a blank space.
 */

import { TRADITIONS } from '../../lib/traditions';

function Row({ items, reverse, seconds }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-4" style={{ '--roll-dur': `${seconds}s` }}>
      {/* The ends are faded with two overlays rather than a CSS mask: the page
          behind them is black, the effect is identical, and a gradient the
          browser composites is one less thing to be supported. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent md:w-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent md:w-40" />
      <ul
        className={`roll-track flex w-max items-baseline gap-10 ${reverse ? 'roll-rev' : ''}`}
        aria-hidden={reverse ? 'true' : undefined}
      >
        {doubled.map((t, i) => (
          <li key={`${t.label}-${i}`} className="flex shrink-0 items-baseline gap-3 whitespace-nowrap">
            <span className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-[#C7C7C7]">
              {t.label}
            </span>
            <span className="font-editorial text-[0.95rem] italic text-[#D4AF37]/55">
              {t.place}
            </span>
            <span className="ml-7 h-[3px] w-[3px] rounded-full bg-white/20" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RollCall() {
  const half = Math.ceil(TRADITIONS.length / 2);
  return (
    <div>
      <style>{`
        @keyframes roll-left  { from { transform: translate3d(0,0,0); }    to { transform: translate3d(-50%,0,0); } }
        @keyframes roll-right { from { transform: translate3d(-50%,0,0); } to { transform: translate3d(0,0,0); } }
        .roll-track { animation: roll-left var(--roll-dur) linear infinite; }
        .roll-track.roll-rev { animation-name: roll-right; }
        @media (prefers-reduced-motion: reduce) {
          .roll-track { animation: none; }
        }
      `}</style>

      <Row items={TRADITIONS.slice(0, half)} seconds={150} />
      <Row items={TRADITIONS.slice(half)} seconds={175} reverse />
    </div>
  );
}
