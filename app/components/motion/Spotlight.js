'use client';

/**
 * A card lit where the pointer is: a radial glow follows the cursor and the hairline brightens near it
 * (.spot in globals.css). CSS variables only, one listener per tile.
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
