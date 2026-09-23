'use client';

/** A number that counts up once, the first time it scrolls into view. */

import { useEffect, useRef, useState } from 'react';

export default function CountUp({ to, suffix = '', ms = 1400 }) {
  const el = useRef(null);
  const [n, setN] = useState(to);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setN(0);
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const p = Math.min(1, (t - t0) / ms);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    if (el.current) io.observe(el.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to, ms]);

  return <span ref={el} className="tabular-nums">{n}{suffix}</span>;
}
