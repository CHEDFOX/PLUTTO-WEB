'use client';

/**
 * THE FAN — seven real cards, held open.
 *
 * The first picture on the page is the product itself: cards the app actually
 * deals, from five of its decks, fanned the way a reader holds them. The Moon,
 * the Star and the Sun sit in the middle in their full 1909 colour; the runes,
 * ogham, Lenormand and I Ching around them are the app's own dark-and-gold
 * line art. The colour is where the eye goes, and it goes to the sky.
 *
 * The fan is one rotation per card about a point far below the hand, so the
 * arc is geometry rather than seven hand-placed positions. Pointing at it opens
 * it a little wider, the way a hand offers a fan. It breathes, slowly, unless
 * the reader has asked for less motion.
 */

import { useState } from 'react';
import { cardSrc, CARD_RATIO } from '../../lib/decks';

const HAND = [
  { deck: 'ogham', id: 'beith', alt: 'Ogham — Beith' },
  { deck: 'runes', id: 'sowilo', alt: 'Rune — Sowilo' },
  { deck: 'tarot', id: 'the_moon', alt: 'Tarot — The Moon' },
  { deck: 'tarot', id: 'the_star', alt: 'Tarot — The Star' },
  { deck: 'tarot', id: 'the_sun', alt: 'Tarot — The Sun' },
  { deck: 'lenormand', id: 'star', alt: 'Lenormand — Star' },
  { deck: 'iching', id: 'qian', alt: 'I Ching — Qian, Heaven' },
];

const STEP = 9;        // degrees between cards at rest
const OPEN = 1.3;      // how much wider the fan opens when pointed at

export default function Fan() {
  const [open, setOpen] = useState(false);
  const mid = (HAND.length - 1) / 2;

  return (
    <div
      className="fan relative mx-auto"
      style={{ '--w': 'clamp(78px, 11vw, 142px)', width: 'calc(var(--w) * 4.4)', height: `calc(var(--w) * ${CARD_RATIO} * 1.34)` }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <style>{`
        @keyframes fan-breathe { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        .fan-breath { animation: fan-breathe 7s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .fan-breath { animation: none; } }
      `}</style>

      <div className="fan-breath absolute inset-0">
        {HAND.map((c, i) => {
          const k = i - mid;
          const angle = k * STEP * (open ? OPEN : 1);
          const centre = k === 0;
          return (
            <div
              key={c.id}
              className="absolute bottom-0 left-1/2 overflow-hidden rounded-[6px] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                width: 'var(--w)',
                height: `calc(var(--w) * ${CARD_RATIO})`,
                marginLeft: 'calc(var(--w) / -2)',
                transformOrigin: '50% 260%',
                transform: `rotate(${angle}deg) translateY(${centre ? '-7%' : '0'})`,
                zIndex: 10 - Math.abs(k),
                boxShadow: centre
                  ? '0 30px 70px -18px rgba(120,170,255,0.45), 0 0 0 1px rgba(255,255,255,0.10)'
                  : '0 22px 50px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)',
              }}
            >
              <img
                src={cardSrc(c.deck, c.id)}
                alt={c.alt}
                width={300}
                height={527}
                decoding="async"
                fetchPriority={centre ? 'high' : 'auto'}
                className="h-full w-full select-none object-cover"
                draggable="false"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
