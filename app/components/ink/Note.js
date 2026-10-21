'use client';

/**
 * INK — the hand in the margins.
 *
 * A product page is set in one cold sans. These are the marks a person leaves
 * on it: a handwritten aside, an arrow drawn toward the thing that matters, a
 * loose line under the word that carries the sentence. Every stroke is an SVG
 * path drawn ON as it scrolls into view (pathLength 0 → 1), so it looks written
 * rather than printed. The hand is Caveat (`font-hand`). In the magazine edition
 * the ink is the editor's red pencil (sindoor) on the printed page, so it reads
 * as a different substance from the type around it. Reduced motion shows
 * everything at rest.
 */

import { motion } from 'framer-motion';
import useCalm from '../motion/useCalm';
import { INK } from './inkColor';

const EASE = [0.22, 1, 0.36, 1];

/** A handwritten aside. `tilt` is degrees; a note is never perfectly straight. */
export function Note({ children, className = '', tilt = -3, delay = 0, size = 'text-[22px] md:text-[26px]' }) {
  const calm = useCalm();
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
