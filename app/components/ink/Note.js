'use client';

/**
 * Handwritten aside in Caveat (`font-hand`) and sindoor ink (inkColor.js). Like the other ink marks, whose
 * strokes draw on (pathLength 0 to 1), it appears as it scrolls into view; reduced motion shows it at rest.
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
