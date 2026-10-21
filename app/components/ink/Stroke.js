'use client';

import { motion } from 'framer-motion';
import useCalm from '../motion/useCalm';
import { INK } from './inkColor';

/** One or more strokes drawn on when seen. `d` may hold several subpaths. */
export function Stroke({ d, box = '0 0 100 100', className = '', delay = 0, duration = 1, strokeWidth = 2.4, style }) {
  const calm = useCalm();
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
