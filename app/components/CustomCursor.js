'use client';

import { useEffect, useRef, useState } from 'react';

const NUM_LINES = 24;
const LINE_LENGTH = 14;
const LINE_GAP = 6;
const RING_SIZE = (LINE_LENGTH + LINE_GAP) * 2 + 8;

const CustomCursor = () => {
  const wrapRef = useRef(null);
  const target = useRef({ x: -100, y: -100 });
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(mq.matches && !reduce.matches);
    update();
    mq.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      mq.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('cursor-hidden');
      return;
    }
    document.documentElement.classList.add('cursor-hidden');

    const onMove = (e) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      if (!visible) setVisible(true);
      const el = e.target;
      const isInteractive = !!el?.closest?.(
        'a, button, [role="button"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])',
      );
      setHovering((prev) => (prev !== isInteractive ? isInteractive : prev));
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    window.addEventListener('mouseenter', onEnter);

    let raf = 0;
    const tick = () => {
      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mouseenter', onEnter);
      document.documentElement.classList.remove('cursor-hidden');
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  const lines = Array.from({ length: NUM_LINES });
  const scale = hovering ? 1.35 : 1;

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="fixed left-0 top-0 z-[9999] pointer-events-none"
      style={{
        width: RING_SIZE,
        height: RING_SIZE,
        opacity: visible ? 1 : 0,
        transition: 'opacity 200ms ease',
        willChange: 'transform',
      }}
    >
      <div
        className="absolute inset-0 transition-transform duration-200"
        style={{ transform: `scale(${scale})` }}
      >
        {lines.map((_, i) => {
          const angle = (360 / NUM_LINES) * i;
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 bg-white/70"
              style={{
                width: 1,
                height: LINE_LENGTH,
                transformOrigin: 'center top',
                transform: `translate(-50%, 0) rotate(${angle}deg) translateY(${LINE_GAP}px)`,
              }}
            />
          );
        })}
        <span
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: 6,
            height: 6,
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#7FB8FF',
            boxShadow: '0 0 10px rgba(127,184,255,0.8)',
          }}
        />
      </div>
    </div>
  );
};

export default CustomCursor;
