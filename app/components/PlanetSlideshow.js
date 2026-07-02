'use client';

import { useEffect, useState } from 'react';

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
const FADE_MS = 1600;

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

  const currentLabel = alive[idx]?.label ?? 'Planet';

  return (
    <div
      className="relative mx-auto"
      style={{ width: `${size}px`, maxWidth: '100%' }}
      role="img"
      aria-label={currentLabel}
    >
      {/* Padding-bottom trick forces the container to be square (height = width)
          regardless of browser aspect-ratio support. */}
      <div style={{ paddingBottom: '100%' }} aria-hidden="true" />

      {/* Soft blue halo behind the images */}
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

      {/* All frames mounted at once, stacked at the same position.
          Opacity is toggled via CSS transitions — the frame at `idx` is
          fully opaque, every other frame is invisible. Because every img
          shares `absolute inset-0` + `object-contain`, planets that don't
          fill the canvas simply sit smaller inside the same footprint,
          never cropped, always registering at pixel-identical positions. */}
      {alive.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt=""
          draggable="false"
          onError={() => dropFrame(frame.src)}
          className="absolute inset-0 w-full h-full object-contain select-none pointer-events-none"
          style={{
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${FADE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          }}
        />
      ))}
    </div>
  );
}
