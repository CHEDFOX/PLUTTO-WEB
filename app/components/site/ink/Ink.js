'use client';

/**
 * INK — the hand in the margins.
 *
 * A product page is set in one cold sans. These are the marks a person leaves
 * on it: a handwritten aside, an arrow drawn toward the thing that matters, a
 * loose line under the word that carries the sentence. Every stroke is an SVG
 * path drawn ON as it scrolls into view (pathLength 0 → 1), so it looks written
 * rather than printed. The hand is Caveat (`font-hand`), the ink is a pale
 * parchment cream rather than white so it reads as a different substance from
 * the type around it. Reduced motion shows everything at rest.
 */

import { motion, useReducedMotion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1];
export const INK = '#EFE6D2';

/** A handwritten aside. `tilt` is degrees; a note is never perfectly straight. */
export function Note({ children, className = '', tilt = -3, delay = 0, size = 'text-[22px] md:text-[26px]' }) {
  const calm = useReducedMotion();
  return (
    <motion.span
      className={`font-hand inline-block font-medium leading-none ${size} ${className}`}
      style={{ color: INK, rotate: tilt }}
      initial={calm ? false : { opacity: 0, y: 8, rotate: tilt - 3 }}
      whileInView={{ opacity: 0.85, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

/** One or more strokes drawn on when seen. `d` may hold several subpaths. */
export function Stroke({ d, box = '0 0 100 100', className = '', delay = 0, duration = 1, strokeWidth = 2.4, style }) {
  const calm = useReducedMotion();
  return (
    <svg viewBox={box} fill="none" aria-hidden="true" className={className} style={{ overflow: 'visible', color: INK, ...style }}>
      <motion.path
        d={d} stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"
        initial={calm ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 0.85 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ pathLength: { duration, delay, ease: 'easeInOut' }, opacity: { duration: 0.15, delay } }}
      />
    </svg>
  );
}

const ARROWS = {
  // a wavy shaft and an open head, the way an arrow is drawn in a margin
  down: { box: '0 0 40 80', d: 'M20 4 C 13 24, 27 44, 19 70 M 8 58 C 12 64, 16 69, 19 74 C 23 68, 27 63, 31 59' },
  right: { box: '0 0 80 40', d: 'M4 20 C 24 12, 44 28, 70 19 M 58 8 C 64 12, 69 16, 74 19 C 68 23, 63 27, 59 31' },
  upright: { box: '0 0 80 60', d: 'M6 54 C 24 46, 40 22, 66 10 M 50 8 C 56 8, 62 8, 68 9 C 67 15, 66 21, 65 27' },
};

/** A hand-drawn arrow. `dir`: down | right | upright. */
export function Arrow({ dir = 'down', className = '', delay = 0.2, width = 40 }) {
  const a = ARROWS[dir] || ARROWS.down;
  return <Stroke d={a.d} box={a.box} className={className} delay={delay} duration={0.8} style={{ width }} />;
}

/** A loose double line under the word that carries the sentence. */
export function Underline({ children, className = '', delay = 0.7 }) {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <Stroke
        box="0 0 200 20"
        d="M4 9 C 50 2, 120 15, 196 6 M 10 15 C 70 8, 130 18, 188 12"
        strokeWidth={3.2}
        className="absolute left-0 top-full h-[0.26em] w-full -translate-y-[0.08em]"
        delay={delay} duration={0.9}
      />
    </span>
  );
}

/** A ring drawn round a word, the way a reader circles the one that matters. */
export function Ring({ children, className = '', delay = 0.4 }) {
  return (
    <span className={`relative inline-block px-[0.15em] ${className}`}>
      {children}
      <Stroke
        box="0 0 200 80"
        d="M 100 8 C 150 4, 198 20, 196 42 C 194 66, 140 78, 92 74 C 40 70, 2 56, 6 36 C 10 16, 60 6, 118 10"
        strokeWidth={2.6}
        className="absolute -inset-x-[0.2em] -inset-y-[0.12em] h-[calc(100%+0.24em)] w-[calc(100%+0.4em)]"
        delay={delay} duration={1}
      />
    </span>
  );
}
