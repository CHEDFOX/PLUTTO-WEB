'use client';

/**
 * THE MOON, RIGHT NOW — drawn from arithmetic, not from a picture.
 *
 * The first thing the landing page says about Plutto should be true at the
 * second you read it. A stock photograph of a full moon says "astrology
 * website"; a terminator computed for this millisecond says "there is an
 * ephemeris behind this". So the disc below is not an asset — the illumination,
 * the age, the direction it is filling and the date of the next full moon are
 * all computed in the reader's browser when the page loads.
 *
 * THE MATH is Meeus' low-precision phase (Astronomical Algorithms, ch. 49): the
 * mean elongation of the Moon from the Sun, corrected by the six largest
 * periodic terms, gives the phase angle, and k = (1 + cos i)/2 is the lit
 * fraction. It is good to about 1% — far better than the eye can read off a
 * 220px disc — and it needs no network, no ephemeris file and no key. The real
 * charts in the app are Swiss Ephemeris; this is the doorbell, not the engine.
 *
 * THE TERMINATOR is two arcs: the lit limb (a half-circle) and the terminator
 * itself (a half-ellipse whose semi-minor axis is r·(1−2k), signed). At k=0 the
 * ellipse is the limb itself and the lit area vanishes; at k=0.5 it collapses
 * to a straight line; at k=1 it is the far limb and the disc is full. Waning is
 * the same figure mirrored, because the Moon fills from the right and empties
 * from the right.
 *
 * Rendered only after mount. The server has no "now" that will still be true
 * when the page arrives, and a server-rendered phase would hydrate into a
 * different one.
 */

import { useEffect, useState } from 'react';

const SYNODIC = 29.530588853;
const RAD = Math.PI / 180;

function phaseAt(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545) / 36525;

  // Mean elongation of the Moon from the Sun, the Sun's mean anomaly, the
  // Moon's mean anomaly. Degrees.
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;

  // Phase angle: 0° is full, 180° is new.
  const i =
    180 -
    D -
    6.289 * Math.sin(Mp * RAD) +
    2.1 * Math.sin(M * RAD) -
    1.274 * Math.sin((2 * D - Mp) * RAD) -
    0.658 * Math.sin(2 * D * RAD) -
    0.214 * Math.sin(2 * Mp * RAD) -
    0.11 * Math.sin(D * RAD);

  const lit = (1 + Math.cos(i * RAD)) / 2;

  // Age from the mean elongation alone: 0 at new, half a synodic month at full.
  const age = (((D % 360) + 360) % 360) / 360 * SYNODIC;
  const waxing = age < SYNODIC / 2;

  const toFull = (((SYNODIC / 2 - age) % SYNODIC) + SYNODIC) % SYNODIC;
  const full = new Date(date.getTime() + toFull * 86400000);

  return { lit, age, waxing, full };
}

function name(lit, waxing) {
  if (lit < 0.02) return 'New Moon';
  if (lit > 0.98) return 'Full Moon';
  if (Math.abs(lit - 0.5) < 0.04) return waxing ? 'First Quarter' : 'Last Quarter';
  const half = lit < 0.5 ? 'Crescent' : 'Gibbous';
  return `${waxing ? 'Waxing' : 'Waning'} ${half}`;
}

/** The lit region as one closed path, for a disc of radius r centred on 0,0. */
function litPath(r, lit) {
  const x = r * (1 - 2 * lit);       // signed semi-minor axis of the terminator
  const rx = Math.max(Math.abs(x), 0.01);
  const innerSweep = x > 0 ? 0 : 1;  // the arc has to pass through +x
  return [
    `M 0 ${-r}`,
    `A ${r} ${r} 0 0 1 0 ${r}`,            // the lit limb, down the right side
    `A ${rx} ${r} 0 0 ${innerSweep} 0 ${-r}`, // the terminator, back up
    'Z',
  ].join(' ');
}

export default function MoonNow({ size = 260 }) {
  const [p, setP] = useState(null);

  useEffect(() => {
    const tick = () => setP(phaseAt(new Date()));
    tick();
    // Once a minute is far more often than the sky changes; it is here so a tab
    // left open overnight is not lying by morning.
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, []);

  const r = 50;
  // Square, and never wider than the phone it is on.
  const box = { width: `min(68vw, ${size}px)`, aspectRatio: '1 / 1' };
  if (!p) return <div style={box} aria-hidden="true" />;

  const pct = Math.round(p.lit * 100);
  const label = name(p.lit, p.waxing);
  const fullOn = p.full.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

  return (
    <figure className="m-0 flex flex-col items-center">
      <svg
        style={box}
        viewBox="-60 -60 120 120"
        role="img"
        aria-label={`${label}, ${pct} percent lit`}
      >
        <defs>
          <radialGradient id="moon-body" cx="38%" cy="32%" r="78%">
            <stop offset="0%" stopColor="#FFFDF5" />
            <stop offset="62%" stopColor="#E9E3D2" />
            <stop offset="100%" stopColor="#BDB6A4" />
          </radialGradient>
          <filter id="moon-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" />
          </filter>
          <radialGradient id="moon-edge" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(20,18,12,0.38)" />
          </radialGradient>
          <radialGradient id="moon-halo" cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="rgba(212,175,55,0)" />
            <stop offset="86%" stopColor="rgba(212,175,55,0.10)" />
            <stop offset="100%" stopColor="rgba(212,175,55,0)" />
          </radialGradient>
          {/* The maria are clipped to the LIT region, not to the disc. Clipped
              to the disc they sit on the night side too, as pale circles on
              black — which reads as holes in the moon rather than as ground. */}
          {/* The transform sits on the PATH, not on a wrapping <g>: a group is
              not a legal child of clipPath, and a browser that follows the spec
              drops it — taking the whole clip, and the maria, with it. */}
          <clipPath id="moon-lit">
            <path d={litPath(r, p.lit)} transform={p.waxing ? undefined : 'scale(-1,1)'} />
          </clipPath>
        </defs>

        <circle cx="0" cy="0" r="58" fill="url(#moon-halo)" />

        {/* The unlit disc stays visible — earthshine, and it keeps the moon a
            sphere rather than a floating sliver. */}
        <circle cx="0" cy="0" r={r} fill="rgba(255,255,255,0.045)" />
        <circle cx="0" cy="0" r={r} fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.4" />

        <g transform={p.waxing ? undefined : 'scale(-1,1)'}>
          <path d={litPath(r, p.lit)} fill="url(#moon-body)" />
        </g>

        {/* Maria, roughly where the near side carries them. Faint, soft-edged
            and irregular: texture that survives being looked at, not a diagram
            of craters. */}
        <g clipPath="url(#moon-lit)" opacity="0.4" fill="#8B8169" filter="url(#moon-soft)">
          <ellipse cx="-13" cy="-19" rx="14" ry="10" transform="rotate(-18 -13 -19)" />
          <ellipse cx="7" cy="-25" rx="9" ry="6" transform="rotate(12 7 -25)" />
          <ellipse cx="19" cy="-7" rx="10" ry="13" transform="rotate(8 19 -7)" />
          <ellipse cx="-23" cy="5" rx="8" ry="9" />
          <ellipse cx="-3" cy="13" rx="16" ry="10" transform="rotate(-8 -3 13)" />
          <circle cx="25" cy="23" r="4.5" />
          <circle cx="-31" cy="-29" r="3" />
        </g>

        {/* A whisper of shadow at the limb, so the disc reads as a sphere. */}
        <circle cx="0" cy="0" r={r} fill="url(#moon-edge)" />
      </svg>

      <figcaption className="mt-6 text-center">
        <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-[#8A8A8E]">
          The sky, this minute
        </p>
        <p className="mt-3 font-display text-[0.98rem] uppercase tracking-[0.28em] text-[#F0F0F0]">
          {label}
        </p>
        <p className="mt-3 font-mono text-[0.66rem] tracking-[0.18em] text-[#8A8A8E]">
          {pct}% LIT · DAY {p.age.toFixed(1)} OF {SYNODIC.toFixed(1)}
          <br />
          <span className="text-[#D4AF37]/70">NEXT FULL ≈ {fullOn}</span>
        </p>
      </figcaption>
    </figure>
  );
}
