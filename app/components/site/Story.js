'use client';

/**
 * HOW IT WORKS — told by scrolling, the way product pages tell it.
 *
 * On a wide screen the phone holds still in the left column while three steps
 * scroll past on the right; whichever step is in the middle of the viewport
 * owns the screen, and the phone crossfades to it. On a phone there is no room
 * for a pinned device beside text, so each step carries its own, smaller one.
 */

import { useEffect, useRef, useState } from 'react';
import { Phone, WhenScreen, VoiceScreen, CardScreen } from './Phone';

const STEPS = [
  { n: '01', color: '#A78BFA', title: 'Tell it when you arrived.',
    body: 'A date, a time, a place. Thirty seconds, once — and every reading after is yours alone.',
    Screen: WhenScreen },
  { n: '02', color: '#38BDF8', title: 'Ask out loud.',
    body: 'Talk to it like a person. Interrupt it, push back, ask why. It answers in your language.',
    Screen: VoiceScreen },
  { n: '03', color: '#F472B6', title: 'Get a straight answer.',
    body: 'It picks the oracle that fits — a card, a rune, your stars — and tells you what it means for you.',
    Screen: CardScreen },
];

export default function Story() {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActive(Number(e.target.dataset.i));
      }),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-2 md:gap-16">
      {/* the pinned phone (wide screens only) */}
      <div className="hidden md:block">
        <div className="sticky top-[calc(50vh-330px)] flex justify-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-24 rounded-full blur-3xl transition-colors duration-700"
                 style={{ background: `radial-gradient(closest-side, ${STEPS[active].color}40, transparent)` }} />
            <Phone>
              {STEPS.map(({ Screen, n }, i) => (
                <div key={n} className={`absolute inset-0 transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}>
                  <Screen />
                </div>
              ))}
            </Phone>
          </div>
        </div>
      </div>

      <ol>
        {STEPS.map(({ n, color, title, body, Screen }, i) => (
          <li
            key={n}
            ref={(el) => { refs.current[i] = el; }}
            data-i={i}
            className="flex flex-col justify-center py-10 md:min-h-[80vh] md:py-0"
          >
            <div className={`transition-opacity duration-500 ${i === active ? 'md:opacity-100' : 'md:opacity-30'}`}>
              <span className="text-[15px] font-semibold tabular-nums" style={{ color }}>{n}</span>
              <h3 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
                {title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-[18px] leading-relaxed text-white/55">{body}</p>
            </div>
            {/* the phone for this step (narrow screens only) */}
            <div className="mt-10 flex h-[500px] justify-center overflow-hidden md:hidden">
              <Phone className="origin-top scale-[0.75]"><Screen /></Phone>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
