'use client';

/**
 * THE HERO PHONE, RUNNING.
 *
 * A still screenshot of a chat is a picture of someone else's conversation. This
 * one happens while you watch: the question types itself into the composer,
 * sends, the Oracle pauses, and the answer arrives a word at a time — the way it
 * arrives in the app. Three exchanges, looping. The words are written down: no
 * API call, nothing to fail or bill. Reduced motion shows the first at rest.
 */

import { useEffect, useRef, useState } from 'react';
import { Sky, StatusBar } from './Phone';

const EXCHANGES = [
  { q: 'Should I take the job?',
    a: 'Take it. The first winter is cold and the money comes late — but it comes. Read the contract twice.' },
  { q: 'Is he coming back?',
    a: 'Not the way he left. If he returns, you will have to meet him again as a stranger. Decide first whether you want to.' },
  { q: '¿Es buen mes para mudarme?',
    a: 'Sí. Un corte limpio, no una ruptura. Del 9 al 21 el suelo está firme — múdate dentro de esa ventana.' },
];

const TYPE_MS = 55, WORD_MS = 70, THINK_MS = 1100, HOLD_MS = 3800;

export default function LiveChat() {
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState('');
  const [sent, setSent] = useState(false);
  const [words, setWords] = useState(0);
  const [calm, setCalm] = useState(false);
  const box = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.2 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const ex = EXCHANGES[i];
  const answer = ex.a.split(' ');

  useEffect(() => {
    if (!live || calm) return undefined;
    const timers = [];
    const later = (fn, ms) => timers.push(setTimeout(fn, ms));
    setTyped(''); setSent(false); setWords(0);
    let n = 0;
    const t = setInterval(() => {
      n += 1; setTyped(ex.q.slice(0, n));
      if (n >= ex.q.length) {
        clearInterval(t);
        later(() => {
          setSent(true); setTyped('');
          later(() => {
            let w = 0;
            const wt = setInterval(() => {
              w += 1; setWords(w);
              if (w >= answer.length) { clearInterval(wt); later(() => setI((k) => (k + 1) % EXCHANGES.length), HOLD_MS); }
            }, WORD_MS);
            timers.push(wt);
          }, THINK_MS);
        }, 350);
      }
    }, TYPE_MS);
    timers.push(t);
    return () => timers.forEach((x) => { clearInterval(x); clearTimeout(x); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, live, calm]);

  const showSent = calm || sent;
  const shownA = calm ? ex.a : answer.slice(0, words).join(' ');
  const thinking = !calm && sent && words === 0;

  return (
    <div ref={box} className="absolute inset-0 flex flex-col text-left">
      <Sky />
      <StatusBar />
      <div className="relative z-10 flex items-center justify-center gap-2 pb-3 pt-2 font-ui">
        <span className="relative inline-block h-[16px] w-[16px] rounded-full bg-gradient-to-br from-white to-white/40">
          <span className="absolute inset-[4px] rounded-full bg-[#04040a]" />
        </span>
        <span className="text-[15px] font-semibold tracking-[-0.01em] text-white">Plutto</span>
      </div>

      <div className="relative z-10 flex flex-1 flex-col gap-5 px-5 pt-3">
        <div className={`self-end rounded-2xl bg-white/[0.08] px-[14px] py-[10px] font-ui text-[15px] leading-[22px] text-white/90 transition-all duration-300 ${showSent ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}`}>
          {ex.q}
        </div>
        {thinking ? (
          <div className="flex gap-1.5 pl-1" aria-hidden="true">
            {[0, 1, 2].map((d) => (
              <span key={d} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/60" style={{ animationDelay: `${d * 0.18}s` }} />
            ))}
          </div>
        ) : (
          <p className="font-app text-[17px] leading-[27px] text-white/85">{shownA}</p>
        )}
      </div>

      <div className="relative z-10 px-4 pb-8">
        <div className="flex h-[48px] items-center gap-3 rounded-full bg-white/[0.08] pl-5 pr-1.5 ring-1 ring-white/10">
          <span className={`flex-1 truncate font-ui text-[14px] ${typed ? 'text-white' : 'text-white/40'}`}>
            {typed || 'Ask anything'}
            {typed ? <span className="ml-px inline-block h-[15px] w-[1.5px] translate-y-[2px] animate-pulse bg-white" /> : null}
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            {typed ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 12V2M2.5 6.5 7 2l4.5 4.5" /></svg>
            ) : (
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" stroke="black" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <rect x="4" y="1" width="6" height="10" rx="3" /><path d="M1 8.5a6 6 0 0 0 12 0M7 14.5V17" />
              </svg>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
