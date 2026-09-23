'use client';

/**
 * PARALLAX — moves its children against the scroll while the element crosses
 * the viewport: `y` is the travel in px from entering to leaving, `x` likewise,
 * `rotate` in degrees, `scale` as [from, to]. Nothing moves under reduced motion.
 */

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function Parallax({ children, y = 0, x = 0, rotate = 0, scale, className = '', style }) {
  const ref = useRef(null);
  const calm = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const ty = useTransform(scrollYProgress, [0, 1], [y / 2, -y / 2]);
  const tx = useTransform(scrollYProgress, [0, 1], [x / 2, -x / 2]);
  const r = useTransform(scrollYProgress, [0, 1], [rotate / 2, -rotate / 2]);
  const s = useTransform(scrollYProgress, [0, 1], scale || [1, 1]);
  return (
    <motion.div ref={ref} className={className} style={calm ? style : { ...style, y: ty, x: tx, rotate: r, scale: s }}>
      {children}
    </motion.div>
  );
}
