'use client';

import { useEffect, useReducer, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

// Cadence — planets orbit through the frame with a beat of blank between:
//   enter from lower-left (TRANS_MS)  →  hold at center (STAY_MS)  →
//   exit toward lower-right (TRANS_MS) →  blank sky (HOLD_MS)  →  next
const STAY_MS = 3200;
const TRANS_MS = 1500;
const HOLD_MS = 700;

// Ease that reads as a slow, weighted glide across the frame.
const ORBIT_EASE = [0.32, 0, 0.28, 1];

// The offset positions describe an orbital arc: planets enter from the
// lower-left below the frame and exit to the lower-right below the frame,
// crossing through center at rest. Percentages so the arc stays
// proportional to the container size.
const OFFSCREEN_ENTER = { x: '-110%', y: '18%' };
const CENTER          = { x: '0%',    y: '0%'  };
const OFFSCREEN_EXIT  = { x: '110%',  y: '18%' };

// { alive, idx } live in one reducer so an errored image can't leave the
// two out of sync (previous version scheduled a nested setIdx inside a
// setAlive updater, which fires twice under React Strict Mode).
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
  const [waiting, setWaiting] = useState(false);

  // Keep a live ref to alive.length so the timer's callback advances the
  // right amount even if a frame errors mid-cycle. Without this, changes
  // to alive would need to be a useEffect dependency and would reset the
  // in-flight STAY / HOLD timer.
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
    if (waiting) {
      // Outgoing planet is animating away. Wait for the exit to complete
      // plus the blank-sky hold before advancing to the next planet.
      timer = setTimeout(() => {
        dispatch({ type: 'advance' });
        setWaiting(false);
      }, TRANS_MS + HOLD_MS);
    } else {
      // A planet is at center. Let it linger, then trigger the exit.
      timer = setTimeout(() => setWaiting(true), STAY_MS);
    }
    return () => clearTimeout(timer);
  }, [waiting]);

  const current = alive[idx] ?? FRAMES[0];

  return (
    <div
      className="relative mx-auto"
      style={{ width: `${size}px`, maxWidth: '100%' }}
      role="img"
      aria-label={current.label}
    >
      {/* Padding-bottom trick forces the container to be square
          regardless of aspect-ratio CSS support. */}
      <div style={{ paddingBottom: '100%' }} aria-hidden="true" />

      {/* Halo — sits OUTSIDE the clip wrapper so its negative inset can
          bleed cleanly beyond the square instead of being flat-clipped. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(93,186,232,0.18), transparent 65%)',
          filter: 'blur(28px)',
          animation: 'orb-breathe 9s ease-in-out infinite',
        }}
      />

      {/* Clip wrapper — mirrors the square footprint and hides the
          sliding planet as it leaves the frame. */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Single motion.img whose key is the planet src. AnimatePresence
            with mode="wait" guarantees the outgoing planet finishes its
            exit slide before the incoming planet mounts — giving a clean
            orbital pass with a beat of empty sky between. No `initial`
            prop here, so the FIRST planet also plays its enter animation
            on mount instead of popping in. */}
        <AnimatePresence mode="wait">
          {!waiting && (
            <motion.img
              key={current.src}
              src={current.src}
              alt=""
              draggable="false"
              onError={() => dispatch({ type: 'drop', src: current.src })}
              className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
              initial={{ ...OFFSCREEN_ENTER, opacity: 0 }}
              animate={{ ...CENTER, opacity: 1 }}
              exit={{ ...OFFSCREEN_EXIT, opacity: 0 }}
              transition={{
                duration: TRANS_MS / 1000,
                ease: ORBIT_EASE,
                opacity: { duration: TRANS_MS / 1000, ease: 'linear' },
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
