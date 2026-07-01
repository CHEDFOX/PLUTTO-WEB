'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Spring-physics floating planet — plutto's signature chrome piece.
 *
 * Behavior (ported from XOOTEQ):
 *  - While `active` is false, the planet sits at `anchor` (bottom-right).
 *  - While `active` is true, it drifts via constant slow velocity with a
 *    sine-noise heading wobble, softly reflecting off viewport edges.
 *  - Rotation gently tracks horizontal velocity (a sense of lean/weight).
 *  - A breathing scale pulses in and out.
 *  - Click smooth-scrolls back to the top of the page.
 */
const FloatingLogo = ({ active = true, anchor, size = 72 }) => {
  const [pos, setPos] = useState(anchor);
  const [rot, setRot] = useState(0);
  const [scale, setScale] = useState(1);

  const stateRef = useRef({
    x: anchor.x,
    y: anchor.y,
    vx: 0,
    vy: 0,
    rotation: 0,
    breath: 0,
  });
  const rafRef = useRef(null);
  const startedRef = useRef(false);
  const [imgSrc, setImgSrc] = useState('/floating-logo.png');

  useEffect(() => {
    if (!active) {
      stateRef.current.x = anchor.x;
      stateRef.current.y = anchor.y;
      stateRef.current.vx = 0;
      stateRef.current.vy = 0;
      setPos(anchor);
      setRot(0);
      setScale(1);
    }
  }, [anchor.x, anchor.y, active]);

  useEffect(() => {
    if (!active) return;
    if (startedRef.current) return;
    startedRef.current = true;

    const SPEED = 0.045; // px/ms ≈ 45 px/s
    const TURN_RATE = 0.0006;
    const PADDING = size * 0.7;

    const initAngle = Math.random() * Math.PI * 2;
    stateRef.current.vx = Math.cos(initAngle) * SPEED;
    stateRef.current.vy = Math.sin(initAngle) * SPEED;

    let last = performance.now();
    let headingNoise = Math.random() * 1000;

    const tick = (now) => {
      const dt = Math.min(48, now - last);
      last = now;
      const s = stateRef.current;

      headingNoise += dt * TURN_RATE;
      const currentAngle = Math.atan2(s.vy, s.vx);
      const wobble =
        Math.sin(headingNoise) * 0.6 + Math.sin(headingNoise * 0.37) * 0.4;
      const newAngle = currentAngle + wobble * dt * TURN_RATE * 2;
      s.vx = Math.cos(newAngle) * SPEED;
      s.vy = Math.sin(newAngle) * SPEED;

      s.x += s.vx * dt;
      s.y += s.vy * dt;

      const w = window.innerWidth;
      const h = window.innerHeight;
      if (s.x < PADDING) {
        s.x = PADDING;
        s.vx = Math.abs(s.vx);
      } else if (s.x > w - PADDING) {
        s.x = w - PADDING;
        s.vx = -Math.abs(s.vx);
      }
      if (s.y < PADDING) {
        s.y = PADDING;
        s.vy = Math.abs(s.vy);
      } else if (s.y > h - PADDING) {
        s.y = h - PADDING;
        s.vy = -Math.abs(s.vy);
      }

      const targetRot = Math.max(-6, Math.min(6, s.vx * 40));
      s.rotation += (targetRot - s.rotation) * 0.04;

      s.breath += dt * 0.0015;
      const breathPulse = Math.sin(s.breath) * 0.02;
      const nextScale = 1 + breathPulse;

      setPos({ x: s.x, y: s.y });
      setRot(s.rotation);
      setScale(nextScale);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active, size]);

  return (
    <button
      type="button"
      aria-label="Return to top"
      onClick={() =>
        typeof window !== 'undefined' &&
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      className="fixed z-50 cursor-pointer transition-[filter] duration-300 hover:[filter:drop-shadow(0_0_28px_rgba(127,184,255,0.7))] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
      style={{
        left: 0,
        top: 0,
        width: size,
        height: size,
        transform: `translate3d(${pos.x - size / 2}px, ${
          pos.y - size / 2
        }px, 0) rotate(${rot}deg) scale(${scale})`,
        willChange: 'transform, filter',
        filter: active
          ? 'drop-shadow(0 0 18px rgba(127,184,255,0.45))'
          : 'none',
      }}
    >
      <img
        src={imgSrc}
        alt=""
        draggable="false"
        className="w-full h-full object-contain select-none pointer-events-none"
        onError={() => setImgSrc('/icon.svg')}
      />
    </button>
  );
};

export default FloatingLogo;
