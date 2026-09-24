'use client';

/**
 * TILT — the phone cluster leans toward the pointer, a few degrees, on a
 * spring, in real 3D. Listens to the whole window so the phones answer the
 * cursor wherever it is on the hero. Off for touch and reduced motion.
 */

import { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function Tilt({ children, max = 8, className = '', innerClassName = 'h-full w-full', onHover }) {
  const calm = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 90, damping: 18, mass: 0.6 });
  const ry = useSpring(useMotionValue(0), { stiffness: 90, damping: 18, mass: 0.6 });
  useEffect(() => {
    if (calm || window.matchMedia('(hover: none)').matches) return undefined;
    const on = (e) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      ry.set(x * max * 2);
      rx.set(-y * max * 1.2);
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, [calm, max, rx, ry]);
  return (
    <div className={className} style={{ perspective: 1400 }}
         onPointerEnter={onHover ? () => onHover(true) : undefined} onPointerLeave={onHover ? () => onHover(false) : undefined}>
      <motion.div style={{ rotateX: rx, rotateY: ry, willChange: 'transform' }} className={innerClassName}>
        {children}
      </motion.div>
    </div>
  );
}
