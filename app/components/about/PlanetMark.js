/** Decorative planet render from public/planets, grayscale, served through next/image at twice its drawn size. */

import Image from 'next/image';

const PLANETS = {
  sun: '/planets/sun.png',
  venus: '/planets/venus.png',
  mars: '/planets/mars.png',
  neptune: '/planets/Neptune.png',
};

export default function PlanetMark({ name, size = 74, className = '' }) {
  const src = PLANETS[name];
  if (!src) return null;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block select-none ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt=""
        width={size * 2}
        height={size * 2}
        className="h-full w-full object-contain"
        sizes={`${size}px`}
        // Grayscale like every photograph on the site; the render's own near-black square is kept, as a plate.
        style={{ filter: 'grayscale(1)' }}
      />
    </span>
  );
}
