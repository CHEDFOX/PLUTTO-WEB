'use client';

/**
 * PICK A DECK — the product, played rather than shown.
 *
 * Six decks lie face down. Tap one and it turns over to a real card, drawn at
 * random from the whole deck: any of the 78 tarot, 36 Lenormand, 24 runes,
 * 20 ogham, the 8 trigrams, the 16 geomantic figures. The reader gets the card
 * and its name, and not what it means. That open question is the point: the
 * meaning is one tap away, in the app, where it is read against their chart.
 *
 * Tapping a turned card shuffles it back and draws again, so the pull to try
 * one more is built in. The face is loaded BEFORE the card turns, so the flip
 * never lands on an empty rectangle.
 *
 * No request is made to the API. The cards are static files and the draw is
 * Math.random in the browser; there is nothing here to fail, bill, or leak.
 */

import { useRef, useState } from 'react';
import Link from 'next/link';
import { DECKS, cardSrc, backSrc, CARD_RATIO } from '../../lib/decks';

const FLIP_MS = 650;

function pick(deck, avoid) {
  const pool = deck.cards.length > 1 ? deck.cards.filter((c) => c !== avoid) : deck.cards;
  return pool[Math.floor(Math.random() * pool.length)];
}

function preload(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });
}

export default function Draw() {
  // deckId → { card, up }
  const [state, setState] = useState({});
  const [last, setLast] = useState(null);   // { deck, card } — the most recent draw
  const busy = useRef({});

  const draw = async (deck) => {
    if (busy.current[deck.id]) return;
    busy.current[deck.id] = true;
    const cur = state[deck.id];

    // Face up already: turn it back first, then draw a new one.
    if (cur && cur.up) {
      setState((s) => ({ ...s, [deck.id]: { ...cur, up: false } }));
      await new Promise((r) => setTimeout(r, FLIP_MS * 0.9));
    }
    const card = pick(deck, cur && cur.card);
    await preload(cardSrc(deck.id, card));
    setState((s) => ({ ...s, [deck.id]: { card, up: true } }));
    setLast({ deck, card });
    busy.current[deck.id] = false;
  };

  return (
    <div>
      <style>{`
        .flip { perspective: 1200px; }
        .flip-inner { transform-style: preserve-3d; transition: transform ${FLIP_MS}ms cubic-bezier(.3,.7,.2,1); }
        .flip-up .flip-inner { transform: rotateY(180deg); }
        .flip-face { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .flip-front { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) { .flip-inner { transition: none; } }
      `}</style>

      <div className="mx-auto grid max-w-[980px] grid-cols-3 gap-x-5 gap-y-8 md:grid-cols-6 md:gap-x-6">
        {DECKS.map((d) => {
          const st = state[d.id];
          const up = !!(st && st.up);
          return (
            <div key={d.id} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => draw(d)}
                aria-label={up ? `${d.nameOf(st.card)}. Draw again from ${d.name}` : `Draw a card from ${d.name}`}
                className={`flip group relative w-full max-w-[140px] outline-none ${up ? 'flip-up' : ''}`}
                style={{ aspectRatio: `1 / ${CARD_RATIO}` }}
              >
                <div className="flip-inner absolute inset-0">
                  {/* back */}
                  <div className="flip-face absolute inset-0 overflow-hidden rounded-[6px] shadow-[0_18px_40px_-16px_rgba(0,0,0,0.9)] ring-1 ring-white/10 transition-transform duration-300 group-hover:-translate-y-1.5">
                    <img src={backSrc(d.id)} alt="" width={300} height={527} loading="lazy"
                         className="h-full w-full object-cover" draggable="false" />
                  </div>
                  {/* face */}
                  <div className="flip-face flip-front absolute inset-0 overflow-hidden rounded-[6px] ring-1 ring-white/15 shadow-[0_24px_60px_-18px_rgba(140,180,255,0.35)]">
                    {st ? (
                      <img src={cardSrc(d.id, st.card)} alt={d.nameOf(st.card)} width={300} height={527}
                           className="h-full w-full object-cover" draggable="false" />
                    ) : null}
                  </div>
                </div>
              </button>
              <p className="mt-3 font-mono text-[0.6rem] uppercase tracking-[0.28em] text-[#8A8A8E]">
                {d.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* What was drawn — and the question it leaves open. Fixed height so the
          grid above never jumps when the first card turns. */}
      <div className="mt-14 flex min-h-[8.5rem] flex-col items-center text-center" aria-live="polite">
        {last ? (
          <>
            <p data-no-auto-case className="font-editorial text-[2rem] leading-tight text-[#F0F0F0] md:text-[2.6rem]">
              {last.deck.nameOf(last.card)}
            </p>
            <p className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.3em] text-[#6E6E72]">
              {last.deck.name}
            </p>
            <Link
              href="/app"
              data-no-binary
              className="mt-6 font-body text-[0.8rem] uppercase tracking-[0.22em] text-[#F0F0F0] underline decoration-white/30 underline-offset-[7px] transition-colors hover:decoration-white"
            >
              What does it mean for you →
            </Link>
          </>
        ) : (
          <p className="pt-6 font-mono text-[0.64rem] uppercase tracking-[0.3em] text-[#6E6E72]">
            Tap a deck
          </p>
        )}
      </div>
    </div>
  );
}
