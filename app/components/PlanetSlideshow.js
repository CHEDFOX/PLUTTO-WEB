'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// Ordered traditionally: seven classical + two lunar nodes, then modern outer.
// Filenames match the assets in /public/planets/ verbatim (case-sensitive).
const FRAMES = [
  { src: '/planets/sun.png',     label: 'Sun' },
  { src: '/planets/moon.png',    label: 'Moon' },
  { src: '/planets/mercury.png', label: 'Mercury' },
  { src: '/planets/venus.png',   label: 'Venus' },
  { src: '/planets/mars.png',    label: 'Mars' },
  { src: '/planets/jupiter.png', label: 'Jupiter' },
  { src: '/planets/saturn.png',  label: 'Saturn' },
  { src: '/planets/rahu.png',    label: 'Rahu' },
  { src: '/planets/ketu.png',    label: 'Ketu' },
  { src: '/planets/Uranus.png',  label: 'Uranus' },
  { src: '/planets/Neptune.png', label: 'Neptune' },
];

const INTERVAL_MS = 5000;

export default function PlanetSlideshow({ size = 460 }) {
  const [idx, setIdx] = useState(0);
  const [alive, setAlive] = useState(FRAMES);

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || alive.length <= 1) return;

    const id = setInterval(() => {
      setIdx((i) => (i + 1) % alive.length);
    }, INTERVAL_MS);
    return () => clearInterval(id);
  }, [alive.length]);

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
      className="relative"
      style={{
        width: `min(100%, ${size}px)`,
        aspectRatio: '1 / 1',
      }}
      role="img"
      aria-label={current.label}
    >
      {/* Soft blue halo — matches the Orb bloom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-6%]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(127,184,255,0.18), transparent 65%)',
          filter: 'blur(28px)',
          animation: 'orb-breathe 9s ease-in-out infinite',
        }}
      />

      {/* Frames — same box, same object-fit, so every planet registers
          at pixel-identical position. Only the pixels crossfade. */}
      <AnimatePresence mode="sync">
        <motion.img
          key={current.src}
          src={current.src}
          alt=""
          draggable="false"
          onError={() => dropFrame(current.src)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
        />
      </AnimatePresence>
    </div>
  );
}
