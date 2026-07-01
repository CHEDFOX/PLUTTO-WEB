'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const COUNT = 12;
const EXT = 'png'; // switch to 'jpg' / 'webp' if the assets aren't PNG
const INTERVAL_MS = 5000;

const FRAMES = Array.from({ length: COUNT }, (_, i) => `/planets/${i + 1}.${EXT}`);

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
      const next = prev.filter((s) => s !== src);
      if (next.length === 0) return prev;
      setIdx((i) => (i >= next.length ? 0 : i));
      return next;
    });
  };

  const current = alive[idx] ?? FRAMES[0];

  return (
    <div
      className="relative"
      style={{ width: size, height: size, maxWidth: '100%' }}
      aria-label="Planetary slideshow"
    >
      {/* Soft blue halo underneath — matches the Orb bloom */}
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
            key={current}
            src={current}
            alt=""
            draggable="false"
            onError={() => dropFrame(current)}
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

      {/* Dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {alive.map((_, i) => {
          const active = i === idx;
          return (
            <button
              key={i}
              type="button"
              aria-label={`Show planet ${i + 1}`}
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
