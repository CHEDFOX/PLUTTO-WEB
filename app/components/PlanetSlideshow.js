'use client';

import { useEffect, useState } from 'react';

// Ordered traditionally: seven classical + two lunar nodes, then modern outer.
// Filenames match the assets in /public/planets/ verbatim (case-sensitive).
const FRAMES = [
  { src: '/planets/sun.png',     label: 'Sun' },
  { src: '/planets/mercury.png', label: 'Mercury' },
  { src: '/planets/venus.png',   label: 'Venus' },
  { src: '/planets/mars.png',    label: 'Mars' },
  { src: '/planets/saturn.png',  label: 'Saturn' },
  { src: '/planets/rahu.png',    label: 'Rahu' },
  { src: '/planets/ketu.png',    label: 'Ketu' },
  { src: '/planets/Uranus.png',  label: 'Uranus' },
  { src: '/planets/Neptune.png', label: 'Neptune' },
];

// Cadence — designed as a contemplative loop:
//   fade in (FADE_MS)  →  hold visible (STAY_MS − FADE_MS)  →
//   fade out (FADE_MS) →  hold blank (HOLD_MS)  →  next planet
// One planet cycle = STAY_MS + FADE_MS + HOLD_MS  ≈ 6.1s
const STAY_MS = 3800;
const FADE_MS = 1400;
const HOLD_MS = 900;

export default function PlanetSlideshow({ size = 460 }) {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);
  const [alive, setAlive] = useState(FRAMES);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || alive.length <= 1) return;

    let timer;
    if (visible) {
      // Currently showing the planet — stay lit, then start fading out.
      timer = setTimeout(() => setVisible(false), STAY_MS);
    } else {
      // Currently fading out / holding blank — wait for the fade to
      // complete AND the blank hold, then swap idx and fade the next
      // planet in.
      timer = setTimeout(() => {
        setIdx((i) => (i + 1) % alive.length);
        setVisible(true);
      }, FADE_MS + HOLD_MS);
    }
    return () => clearTimeout(timer);
  }, [visible, alive.length]);

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

      {/* All frames mounted at once, stacked at the same position. The
          frame at `idx` is fully opaque only when `visible` is true; when
          `visible` flips to false every frame is at 0 opacity, giving the
          slideshow a moment of blank breath between planets before the
          next one fades in. */}
      {alive.map((frame, i) => (
        <img
          key={frame.src}
          src={frame.src}
          alt=""
          draggable="false"
          onError={() => dropFrame(frame.src)}
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
