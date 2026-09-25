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
import Device from './app/Device';
import AppVideo from './app/AppVideo';
import LockApp from './app/LockApp';

const VoiceVideo = () => <AppVideo name="voice" poster="/app/screens/voice.png" label="Plutto's voice mode" />;
const OnboardingShot = () => <AppVideo name="when" poster="/app/screens/when-start.jpg" still="/app/screens/onboarding.png" label="Plutto asking your name and when you were born" />;
const Morning = () => <LockApp live />;

const STEPS = [
  { n: '01', color: '#A78BFA', title: 'Tell it when you arrived.',
    body: 'A date, a time, a place. Once. From then on every reading is about you, and nobody else.',
    Screen: OnboardingShot },
  { n: '02', color: '#38BDF8', title: 'Ask out loud.',
    body: 'Tap the wave and talk. It answers back, in your language, and you can argue with it.',
    Screen: VoiceVideo },
  { n: '03', color: '#FBBF24', title: 'Wake up already knowing.',
    body: 'Every morning at nine, one line written for the day you’re about to have.',
    Screen: Morning, lock: true },
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
        <div className="sticky top-[calc(50vh-340px)] flex justify-center">
          <div className="relative">
            <div aria-hidden="true" className="absolute -inset-24 rounded-full blur-3xl transition-colors duration-700"
                 style={{ background: `radial-gradient(closest-side, ${STEPS[active].color}40, transparent)` }} />
            <Device width={320} statusTime={STEPS[active].lock ? '' : '9:41'}>
              {STEPS.map(({ Screen, n }, i) => (
                <div key={n} className={`absolute inset-0 transition-all duration-700 ease-out ${i === active ? 'scale-100 opacity-100 blur-0' : i < active ? 'scale-[0.94] opacity-0 blur-md' : 'scale-[1.06] opacity-0 blur-md'}`}>
                  <Screen />
                </div>
              ))}
            </Device>
          </div>
        </div>
      </div>

      <ol>
        {STEPS.map(({ n, color, title, body, Screen, lock }, i) => (
          <li
            key={n}
            ref={(el) => { refs.current[i] = el; }}
            data-i={i}
            className="flex flex-col justify-center py-10 md:min-h-[68vh] md:py-0"
          >
            <div className={`relative transition-all duration-700 md:pl-8 ${i === active ? 'md:opacity-100 md:translate-x-0' : 'md:opacity-30 md:translate-x-2'}`}>
              {/* the progress rail: fills while this step owns the phone */}
              <span aria-hidden="true" className="absolute bottom-1 left-0 top-1 hidden w-[2px] overflow-hidden rounded-full bg-white/10 md:block">
                <span className="block w-full rounded-full transition-all duration-700 ease-out" style={{ background: color, height: i <= active ? '100%' : '0%' }} />
              </span>
              <span className="text-[15px] font-semibold tabular-nums" style={{ color }}>{n}</span>
              <h3 className="mt-3 text-[clamp(1.9rem,3.6vw,2.9rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
                {title}
              </h3>
              <p className="mt-4 max-w-[34ch] text-[18px] leading-relaxed text-white/55">{body}</p>
            </div>
            {/* the phone for this step (narrow screens only) */}
            <div className="mt-10 flex justify-center md:hidden">
              <Device width={250} statusTime={lock ? '' : '9:41'}><Screen /></Device>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
