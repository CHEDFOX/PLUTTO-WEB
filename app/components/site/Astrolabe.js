'use client';

/**
 * THE PLATE — an instrument, drawn rather than photographed.
 *
 * The page needs a third kind of picture. The moon at the top is astronomical,
 * the roll-call is kinetic type; this is the draughtsman's register — the ring
 * of degrees off the back of an astrolabe, which is what every one of these
 * traditions was actually using before it was software.
 *
 * Nothing here is decorative-only: the outer ring is 72 marks, one per five
 * degrees, with the long marks on the twelve sign boundaries; the inner dots
 * sit at the seven classical planets' own symbols' spacing. It is generated,
 * not drawn by hand, so it stays exact at any size.
 *
 * The ring turns once every four minutes — slow enough that it reads as still
 * and is noticed only by someone who stays. `prefers-reduced-motion` stops it.
 */

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const SIGNS = Array.from({ length: 12 }, (_, i) => i * 30);

// Seven marks on the inner circle, at no particular longitude: this is a plate,
// not a chart, and pretending it is somebody's chart would be a small lie.
const DOTS = [18, 64, 112, 157, 203, 268, 322];

export default function Astrolabe({ size = 380 }) {
  return (
    <div className="relative" style={{ width: `min(76vw, ${size}px)`, aspectRatio: '1 / 1' }} aria-hidden="true">
      <style>{`
        @keyframes plate-spin { to { transform: rotate(360deg); } }
        .plate-ring  { animation: plate-spin 240s linear infinite; transform-origin: 50% 50%; }
        .plate-inner { animation: plate-spin 400s linear infinite reverse; transform-origin: 50% 50%; }
        @media (prefers-reduced-motion: reduce) {
          .plate-ring, .plate-inner { animation: none; }
        }
      `}</style>

      <svg viewBox="-100 -100 200 200" width="100%" height="100%">
        <defs>
          <radialGradient id="plate-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(212,175,55,0.07)" />
            <stop offset="70%" stopColor="rgba(212,175,55,0.02)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        <circle r="86" fill="url(#plate-glow)" />

        {/* The degree ring */}
        <g className="plate-ring">
          <circle r="88" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.4" />
          <circle r="80" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.3" />
          {TICKS.map((d) => {
            const major = d % 30 === 0;
            return (
              <line
                key={d}
                x1="0"
                y1={-88}
                x2="0"
                y2={major ? -78 : -84}
                transform={`rotate(${d})`}
                stroke={major ? 'rgba(212,175,55,0.7)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={major ? 0.7 : 0.4}
              />
            );
          })}
        </g>

        {/* The twelve houses, as radii that stop short of the centre */}
        <g className="plate-inner">
          <circle r="58" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="0.35" strokeDasharray="1 4" />
          {SIGNS.map((d) => (
            <line
              key={d}
              x1="0"
              y1={-58}
              x2="0"
              y2={-34}
              transform={`rotate(${d})`}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="0.35"
            />
          ))}
          {DOTS.map((d, i) => (
            <circle
              key={d}
              cx="0"
              cy={-58}
              r={i === 2 ? 1.8 : 1.1}
              transform={`rotate(${d})`}
              fill={i === 2 ? '#D4AF37' : 'rgba(255,255,255,0.55)'}
            />
          ))}
        </g>

        {/* The rule and the centre — the only things that do not move */}
        <line x1="-34" y1="0" x2="34" y2="0" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
        <line x1="0" y1="-34" x2="0" y2="34" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />
        <circle r="26" fill="none" stroke="rgba(212,175,55,0.28)" strokeWidth="0.5" />
        <circle r="2.2" fill="#D4AF37" opacity="0.8" />
      </svg>
    </div>
  );
}
