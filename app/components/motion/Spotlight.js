'use client';

/**
 * SPOTLIGHT — a card that lights up where the pointer is: a soft radial glow
 * follows the cursor inside it, and its hairline brightens near the pointer.
 * The colour is the tile's own. Pure CSS variables, one listener per tile.
 */

import { useRef } from 'react';

export default function Spotlight({ children, className = '', glow = 'rgba(167,139,250,0.35)', style }) {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--mx', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onPointerMove={move} className={`spot group ${className}`} style={{ '--glow': glow, ...style }}>
      {children}
    </div>
  );
}
