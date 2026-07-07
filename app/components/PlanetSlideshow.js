'use client';

import { useEffect, useReducer, useRef } from 'react';

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

// Cadence — pure crossfade with no blank between:
//   the outgoing planet fades 1 → 0 over FADE_MS at the same time as the
//   incoming planet fades 0 → 1, then holds visible for CYCLE_MS. No halo,
//   no blank, no interruption — one continuous glide.
const CYCLE_MS = 5000;
const FADE_MS = 2200;

// Hover shake — a subtle jitter on the current planet while the pointer is
// over the frame. Kept scoped to this component via an inline <style>.
const HOVER_STYLES = `
  @keyframes planet-hover-shake {
    0%   { transform: translate(0, 0) rotate(0deg); }
    20%  { transform: translate(-1.6px,  1px)  rotate(-0.5deg); }
    40%  { transform: translate( 1.6px, -1px)  rotate( 0.5deg); }
    60%  { transform: translate(-1px,   -1.6px) rotate(-0.3deg); }
    80%  { transform: translate( 1px,    1.6px) rotate( 0.3deg); }
    100% { transform: translate(0, 0) rotate(0deg); }
  }
  .planet-slideshow:hover img {
    animation: planet-hover-shake 700ms ease-in-out infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    .planet-slideshow:hover img { animation: none; }
  }
`;

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

  // Live ref so a dropped frame doesn't reset the interval.
  const aliveLenRef = useRef(alive.length);
  useEffect(() => {
    aliveLenRef.current = alive.length;
  }, [alive.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    if (aliveLenRef.current <= 1) return;

    const id = setInterval(() => {
      dispatch({ type: 'advance' });
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, []);

  const currentLabel = alive[idx]?.label ?? 'Planet';

  return (
    <>
      <style>{HOVER_STYLES}</style>
      <div
        className="planet-slideshow relative mx-auto"
        style={{ width: `${size}px`, maxWidth: '100%' }}
        role="img"
        aria-label={currentLabel}
      >
        {/* Padding-bottom trick forces the container to be square
            regardless of aspect-ratio CSS support. */}
        <div style={{ paddingBottom: '100%' }} aria-hidden="true" />

        {/* All frames mounted at once, stacked at the same position. The
            frame at `idx` is fully opaque; every other frame is at 0. When
            `idx` advances, one image fades 1 → 0 and the next fades 0 → 1
            on the same clock — the two curves overlap, so the transition
            reads as one continuous glide with no gap between planets. */}
        {alive.map((frame, i) => (
          <img
            key={frame.src}
            src={frame.src}
            alt=""
            draggable="false"
            onError={() => dispatch({ type: 'drop', src: frame.src })}
            className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
            style={{
              opacity: i === idx ? 1 : 0,
              transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1), transform 250ms ease-out`,
            }}
          />
        ))}
      </div>
    </>
  );
}
