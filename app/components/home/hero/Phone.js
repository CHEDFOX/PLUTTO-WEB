'use client';

import { motion, useTransform } from 'framer-motion';
import { wrap, along, layer } from './stackPath';

export function Phone({ turn, index, isFront, children }) {
  const at = (t) => along(wrap(index - t));
  const x = useTransform(turn, (t) => at(t).x);
  const y = useTransform(turn, (t) => at(t).y);
  const scale = useTransform(turn, (t) => at(t).scale);
  const rotate = useTransform(turn, (t) => at(t).rotate);
  // Darkening is a black veil, not a CSS brightness filter: a filter repaints
  // the playing video under it on every frame.
  const shade = useTransform(turn, (t) => 1 - at(t).bright);
  const zIndex = useTransform(turn, (t) => layer(wrap(index - t)));
  return (
    <motion.div className="absolute will-change-transform" style={{ x, y, scale, rotate, zIndex }}>
      {children}
      {/* will-change: opacity keeps this on the compositor. Without it every
          per-frame opacity write repainted and re-rasterised the veil — three
          280×587 repaints a frame, the largest cost left in a turn. */}
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[46px] bg-black" style={{ opacity: shade, willChange: 'opacity' }} />
      {/* a sheen crosses the glass as the phone settles at the front */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[46px]">
        <motion.div
          className="absolute inset-y-0 w-[70%] will-change-transform"
          style={{ background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,0.13) 50%, transparent 62%)' }}
          initial={false}
          animate={isFront ? { x: ['-120%', '190%'] } : { x: '-120%' }}
          transition={isFront ? { duration: 1.3, ease: [0.4, 0, 0.2, 1], delay: 0.95 } : { duration: 0 }}
        />
      </div>
    </motion.div>
  );
}
