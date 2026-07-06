'use client';

import { useEffect, useState } from 'react';
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
// One full planet cycle = STAY + TRANS + HOLD (the incoming TRANS overlaps
// with the outgoing planet's absence, so it isn't double-counted).
const STAY_MS = 3200;
const TRANS_MS = 1500;
const HOLD_MS = 700;

// Ease that reads as a slow, weighted glide across the frame.
const ORBIT_EASE = [0.32, 0, 0.28, 1];

// The offset positions describe an orbital arc: planets enter from the
// lower-left below the frame and exit to the lower-right below the frame,
// crossing through center at rest. Rendered as percentages so the arc
// stays proportional to the container size.
const OFFSCREEN_ENTER = { x: '-110%', y: '18%' };
const CENTER          = { x: '0%',    y: '0%'  };
const OFFSCREEN_EXIT  = { x: '110%',  y: '18%' };

export default function PlanetSlideshow({ size = 460 }) {
  const [idx, setIdx] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [alive, setAlive] = useState(FRAMES);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || alive.length <= 1) return;

    let timer;
    if (waiting) {
      // Outgoing planet is animating away. Wait for the exit to complete
      // plus the blank-sky hold before advancing to the next planet.
      timer = setTimeout(() => {
        setIdx((i) => (i + 1) % alive.length);
        setWaiting(false);
      }, TRANS_MS + HOLD_MS);
    } else {
      // A planet is at center. Let it linger, then trigger the exit.
      timer = setTimeout(() => setWaiting(true), STAY_MS);
    }
    return () => clearTimeout(timer);
  }, [waiting, alive.length]);

  const dropFrame = (src) => {
    setAlive((prev) => {
      const next = prev.filter((f) => f.src !== src);
      if (next.length === 0) return prev;
      setIdx((i) => (i >= next.length ? 0 : i));
      return next;
    });
  };

  const current = alive[idx] ?? FRAMES[0];

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{ width: `${size}px`, maxWidth: '100%' }}
      role="img"
      aria-label={current.label}
    >
      {/* Padding-bottom trick forces the container to be square
          regardless of aspect-ratio CSS support. */}
      <div style={{ paddingBottom: '100%' }} aria-hidden="true" />

      {/* Soft blue halo behind the images */}
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

      {/* Single motion.img whose key is the planet src. AnimatePresence
          with mode="wait" guarantees the outgoing planet finishes its
          exit slide before the incoming planet mounts and slides in —
          giving us a clean orbital pass with a beat of empty sky between. */}
      <AnimatePresence mode="wait" initial={false}>
        {!waiting && (
          <motion.img
            key={current.src}
            src={current.src}
            alt=""
            draggable="false"
            onError={() => dropFrame(current.src)}
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
  );
}
