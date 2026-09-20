/**
 * A PLANET, AS A SECTION MARK.
 *
 * The eight renders in /public/planets are the best art the brand owns, and
 * they were doing nothing but cycling in one box on one page. Here one stands
 * beside each section's label — a body per section, in the classical order, so
 * scrolling the page walks out from the Sun.
 *
 * Served through next/image so the 1.4MB Sun arrives as a ~20KB webp at the
 * size it is actually drawn; the originals stay untouched on disk.
 */

import Image from 'next/image';

export const PLANETS = {
  sun: '/planets/sun.png',
  mercury: '/planets/mercury.png',
  venus: '/planets/venus.png',
  mars: '/planets/mars.png',
  rahu: '/planets/rahu.png',
  ketu: '/planets/ketu.png',
  uranus: '/planets/Uranus.png',
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
        // The renders carry their own near-black background, which shows as a
        // dark square on any section that is not pure black. These are glowing
        // bodies on black, so screen blending drops that square exactly and
        // leaves the body — the whole site is dark, so there is nowhere it can
        // wash out.
        style={{ mixBlendMode: 'screen' }}
      />
    </span>
  );
}
