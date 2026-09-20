'use client';

/**
 * THE EXCHANGE — the product, demonstrated instead of described.
 *
 * A screenshot of a chat is a picture of someone else using an app. A question
 * that types itself, waits, and is answered while you watch is the app. It
 * costs nothing — no API call, no session, no key — because the three exchanges
 * below are written down: this is a demonstration, and pretending otherwise by
 * hitting the real Oracle from an unauthenticated marketing page would be both
 * a leak and a bill.
 *
 * The two voices are set in two faces on purpose. The question is monospace —
 * something typed, by a person, with a caret. The answer is the editorial serif
 * the readings are set in, and it arrives a word at a time, because that is how
 * it arrives in the app and because a paragraph that appears all at once reads
 * as a file that was already there.
 *
 * Nothing starts until the block is on screen, and `prefers-reduced-motion`
 * shows the whole exchange at rest.
 */

import { useEffect, useRef, useState } from 'react';

const EXCHANGES = [
  {
    q: 'Should I take the job?',
    lens: 'VEDIC · BPHS',
    a: 'Saturn sits on your tenth until March. Take it — read the contract twice, and do not judge it before spring. Saturn pays late. It pays.',
  },
  {
    q: 'Why do I keep meeting the same person?',
    lens: 'WESTERN · TROPICAL',
    a: 'The ruler of your seventh also rules your twelfth — the house of what you cannot see yourself doing. It is not the same person. It is the same silence, and you keep calling it familiarity.',
  },
  {
    q: '¿Es buen mes para mudarme?',
    lens: 'CHINO · BAZI',
    a: 'Metal sobre madera: un corte limpio, no una ruptura. Del 9 al 21 el terreno está firme. Firma dentro de esa ventana, o espera a la luna nueva.',
  },
];

const TYPE_MS = 42;     // per character of the question
const WORD_MS = 58;     // per word of the answer
const THINK_MS = 900;   // the beat between the question landing and the answer
const READ_MS = 4200;   // how long a finished exchange stays before the next

export default function Ask() {
  const box = useRef(null);
  const [live, setLive] = useState(false);
  const [calm, setCalm] = useState(false);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState('');
  const [words, setWords] = useState(0);

  useEffect(() => {
    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setLive(true),
      { rootMargin: '-15% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const ex = EXCHANGES[i];
  const answer = ex.a.split(' ');

  useEffect(() => {
    if (!live || calm) return;
    let t;
    const timers = [];
    setTyped('');
    setWords(0);

    // The question, character by character.
    let n = 0;
    t = setInterval(() => {
      n += 1;
      setTyped(ex.q.slice(0, n));
      if (n >= ex.q.length) {
        clearInterval(t);
        // The pause is the point: it is the only moment on the page that looks
        // like something is being worked out rather than played back.
        timers.push(setTimeout(() => {
          let w = 0;
          const wt = setInterval(() => {
            w += 1;
            setWords(w);
            if (w >= answer.length) {
              clearInterval(wt);
              timers.push(setTimeout(() => setI((k) => (k + 1) % EXCHANGES.length), READ_MS));
            }
          }, WORD_MS);
          timers.push(wt);
        }, THINK_MS));
      }
    }, TYPE_MS);
    timers.push(t);

    return () => timers.forEach((x) => { clearInterval(x); clearTimeout(x); });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, live, calm]);

  const shownQ = calm ? ex.q : typed;
  const shownA = calm ? ex.a : answer.slice(0, words).join(' ');
  const asking = !calm && typed.length < ex.q.length;
  const thinking = !calm && !asking && words === 0;

  return (
    <div ref={box} className="rounded-2xl border border-white/10 bg-[#07070B]/70 p-7 backdrop-blur-sm md:p-11">
      <div className="flex items-center justify-between gap-6">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-[#8A8A8E]">
          You
        </span>
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.3em] text-[#D4AF37]/70">
          {ex.lens}
        </span>
      </div>

      <p data-no-auto-case className="mt-4 min-h-[3.2em] font-mono text-[1.02rem] leading-relaxed text-[#F0F0F0] md:min-h-[1.8em] md:text-[1.18rem]">
        {shownQ}
        {asking ? <span className="ask-caret ml-[2px] inline-block w-[0.55ch] bg-[#F0F0F0] align-middle">&nbsp;</span> : null}
      </p>

      <div className="mt-8 h-px w-full bg-gradient-to-r from-[#D4AF37]/35 via-white/10 to-transparent" />

      <div className="mt-8 flex items-baseline gap-4">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.34em] text-[#8A8A8E]">
          Plutto
        </span>
        {thinking ? (
          <span className="ask-think font-mono text-[0.6rem] tracking-[0.4em] text-[#8A8A8E]">•••</span>
        ) : null}
      </div>

      <p data-no-auto-case className="mt-4 min-h-[7.5em] font-editorial text-[1.22rem] leading-[1.62] text-[#D8D8D8] md:min-h-[5.4em] md:text-[1.5rem]">
        {shownA}
      </p>

      <style>{`
        @keyframes ask-blink { 0%,45% { opacity: 1 } 55%,100% { opacity: 0 } }
        .ask-caret { animation: ask-blink 1s step-end infinite; }
        @keyframes ask-pulse { 0%,100% { opacity: .25 } 50% { opacity: .9 } }
        .ask-think { animation: ask-pulse 1.1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .ask-caret, .ask-think { animation: none; }
        }
      `}</style>
    </div>
  );
}
