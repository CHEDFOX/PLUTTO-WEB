'use client';

import { useEffect, useReducer, useRef, useState } from 'react';

// Traditional order (Saturn removed): five classical + two lunar nodes,
// then the modern outer planets. Filenames match /public/planets/ verbatim
// — case-sensitive on production Linux hosts.
const FRAMES = [
  { src: '/planets/sun.png',     label: 'Sun' },
  { src: '/planets/mercury.png', label: 'Mercury' },
  { src: '/planets/venus.png',   label: 'Venus' },
  { src: '/planets/mars.png',    label: 'Mars' },
  { src: '/planets/rahu.png',    label: 'Rahu' },
  { src: '/planets/ketu.png',    label: 'Ketu' },
  { src: '/planets/Uranus.png',  label: 'Uranus' },
  { src: '/planets/Neptune.png', label: 'Neptune' },
];

// Cadence — designed as a contemplative loop:
//   fade in (FADE_MS)  →  hold visible (STAY_MS − FADE_MS)  →
//   fade out (FADE_MS) →  hold blank (HOLD_MS)  →  next planet
const STAY_MS = 3800;
const FADE_MS = 1400;
const HOLD_MS = 900;

const initialState = { alive: FRAMES, idx: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'advance':
      return { ...state, idx: (state.idx + 1) % state.alive.length };
    case 'drop': {
      const next = state.alive.filter((f) => f.src !== action.src);
      if (next.length === 0) return state; // keep the broken frame rather than render nothing
      return {
        alive: next,
        idx: state.idx >= next.length ? 0 : state.idx,
      };
    }
    default:
      return state;
  }
}

export default function PlanetSlideshow({ size = 460 }) {
  const [{ alive, idx }, dispatch] = useReducer(reducer, initialState);
  const [visible, setVisible] = useState(true);

  // Live ref to alive.length so a dropped frame doesn't reset the timer.
  const aliveLenRef = useRef(alive.length);
  useEffect(() => {
    aliveLenRef.current = alive.length;
  }, [alive.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (aliveLenRef.current <= 1) return;

    let timer;
    if (visible) {
      // Currently showing the planet — stay lit, then start fading out.
      timer = setTimeout(() => setVisible(false), STAY_MS);
    } else {
      // Fading out / holding blank — wait for the fade to complete AND
      // the blank hold, then swap idx and fade the next planet in.
      timer = setTimeout(() => {
        dispatch({ type: 'advance' });
        setVisible(true);
      }, FADE_MS + HOLD_MS);
    }
    return () => clearTimeout(timer);
  }, [visible]);

  const currentLabel = alive[idx]?.label ?? 'Planet';

  return (
    <div
      className="relative mx-auto"
      style={{ width: `${size}px`, maxWidth: '100%' }}
      role="img"
      aria-label={currentLabel}
    >
      {/* Padding-bottom trick forces the container to be square
          regardless of aspect-ratio CSS support. */}
      <div style={{ paddingBottom: '100%' }} aria-hidden="true" />

      {/* Halo — sits outside the clip container so its negative inset
          can bleed cleanly beyond the square. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(78,197,242,0.18), transparent 65%)',
          filter: 'blur(28px)',
          animation: 'orb-breathe 9s ease-in-out infinite',
        }}
      />

      {/* All frames mounted at once, stacked at the same position. The
          frame at `idx` is fully opaque only when `visible` is true; when
          `visible` flips to false every frame is at 0 opacity, giving a
          moment of blank breath between planets before the next fades in. */}
      {alive.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt=""
          draggable="false"
          onError={() => dispatch({ type: 'drop', src: frame.src })}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            opacity: i === idx && visible ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      ))}
    </div>
  );
}
