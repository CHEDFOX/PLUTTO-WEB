'use client';

/**
 * THE APP'S STARFIELD — src/components/Starfield.js, ported to a canvas.
 *
 * Same seeded generator (sr), same 280 stars in the same three depth layers at
 * the same positions for a 393 × 852 screen, same colours, same radii, the same
 * four shared twinkle channels (7 / 11 / 13 / 17 s) interpolated through the
 * same five sine points, and the same slow sway (80 s across, 110 s down,
 * in-out sine). The gyroscope tilt is left out: a web page has no phone to tilt.
 */

import { useEffect, useRef } from 'react';

const W = 393, H = 852, COUNT = 280;
const sr = (seed) => { const x = Math.sin(seed) * 10000; return x - Math.floor(x); };
const COLORS = ['#FFFFFF', '#FFFFFF', '#FFF8F0', '#FFF5E8', '#F0F4FF', '#E8EEFF'];
const PERIODS = [7000, 11000, 13000, 17000];

const STARS = Array.from({ length: COUNT }, (_, i) => {
  const s = i + 1;
  const dr = sr(s * 31);
  const depth = dr < 0.65 ? 0 : dr < 0.9 ? 1 : 2;
  const size = depth === 0 ? 0.15 + sr(s * 11) * 0.25 : depth === 1 ? 0.3 + sr(s * 11) * 0.35 : 0.5 + sr(s * 13) * 0.4;
  const base = depth === 0 ? 0.04 + sr(s * 17) * 0.12 : depth === 1 ? 0.08 + sr(s * 17) * 0.22 : 0.15 + sr(s * 17) * 0.3;
  const amt = depth === 0 ? 0.3 + sr(s * 43) * 0.3 : depth === 1 ? 0.4 + sr(s * 43) * 0.35 : 0.5 + sr(s * 43) * 0.3;
  const phase = sr(s * 41);
  const v = (k) => Math.max(0.02, base + base * amt * Math.sin(((k / 4 + phase) % 1) * Math.PI * 2) * 0.5);
  return {
    x: sr(s * 3) * W, y: sr(s * 5) * H * 1.3, size,
    drift: depth === 0 ? 0.3 : depth === 1 ? 0.65 : 1,
    group: Math.floor(sr(s * 37) * 4),
    pts: [v(0), v(1), v(2), v(3), v(0)],
    color: COLORS[Math.floor(sr(s * 47) * COLORS.length)],
  };
});

const inOutSin = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
const pingpong = (t, ms) => { const p = (t % (2 * ms)) / ms; return inOutSin(p <= 1 ? p : 2 - p); };

export default function Starfield() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    const ctx = cv.getContext('2d');
    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0, on = true;
    const t0 = performance.now();
    const draw = (now) => {
      const t = calm ? 0 : now - t0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const dx = pingpong(t, 80000) * 6, dy = pingpong(t, 110000) * 4;
      for (const s of STARS) {
        const p = ((t % PERIODS[s.group]) / PERIODS[s.group]) * 4;
        const k = Math.min(3, Math.floor(p)), f = p - k;
        ctx.globalAlpha = s.pts[k] + (s.pts[k + 1] - s.pts[k]) * f;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x + dx * s.drift, s.y + dy * s.drift, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (on && !calm) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => {
      on = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (on) raf = requestAnimationFrame(draw);
    });
    io.observe(cv);
    raf = requestAnimationFrame(draw);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); };
  }, []);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute left-0 top-0" style={{ width: W, height: H }} />;
}
