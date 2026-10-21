'use client';

import { Stroke } from './Stroke';

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
