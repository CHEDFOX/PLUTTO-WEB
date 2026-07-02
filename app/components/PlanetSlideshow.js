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
      className="relative flex flex-col items-center"
      style={{ width: size, maxWidth: '100%' }}
      aria-label="Planetary slideshow"
    >
      <div className="relative" style={{ width: size, height: size, maxWidth: '100%' }}>
        {/* Soft blue halo — matches the Orb bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-12%]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(127,184,255,0.20), transparent 65%)',
            filter: 'blur(28px)',
            animation: 'orb-breathe 9s ease-in-out infinite',
          }}
        />

        <div className="relative w-full h-full overflow-hidden rounded-full">
          <AnimatePresence mode="sync">
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.label}
              draggable="false"
              onError={() => dropFrame(current.src)}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{
                opacity: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
                scale: { duration: 6, ease: 'linear' },
              }}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />
          </AnimatePresence>
        </div>
      </div>

      {/* Label */}
      <div className="mt-6 h-4 relative w-full">
        <AnimatePresence mode="wait">
          <motion.p
            key={current.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 text-center uppercase text-[#7FB8FF]"
            style={{
              fontFamily: "'JetBrains Mono', ui-monospace, monospace",
              fontSize: '0.72rem',
              letterSpacing: '0.42em',
              paddingLeft: '0.42em',
            }}
          >
            {current.label}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {alive.map((f, i) => {
          const active = i === idx;
          return (
            <button
              key={f.src}
              type="button"
              aria-label={`Show ${f.label}`}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all"
              style={{
                width: active ? 22 : 6,
                height: 6,
                background: active ? '#7FB8FF' : 'rgba(255,255,255,0.25)',
                boxShadow: active ? '0 0 10px rgba(127,184,255,0.55)' : 'none',
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
