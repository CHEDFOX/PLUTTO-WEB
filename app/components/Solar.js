'use client';

/**
 * THE SOLAR SYSTEM — the wheel, the lit field, the reading beneath.
 *
 * `/api/public/solar-system` returns twelve bodies and twelve life-fields, and
 * the web app had no idea what to do with either: the shape is neither blocks
 * nor pages, so it fell through the adapter and the feature opened as its own
 * title. This draws it.
 *
 * The geometry is taken from the phone (src/render/SolarSystem.js), not invented,
 * because the two must agree about where a planet is:
 *
 *   • WHOLE-SIGN. Field N occupies the sign (ascendant + N - 1). The ascendant
 *     is recovered from any body carrying both a longitude and a `cup`, so the
 *     wedge that lights is exactly the one the backend means by that number.
 *   • THE ANGLE IS THE DATA. A body sits at its ecliptic longitude and nowhere
 *     else — moving it around the ring would draw it in a field it is not in. So
 *     bodies within a few degrees of each other step INWARD instead; the radius
 *     carries no meaning and is free to spend.
 *   • Screen angles run clockwise with y down, longitude runs counter-clockwise,
 *     which is the minus on every sine below.
 *
 * SVG rather than a canvas: twelve dots and twelve wedges is not a rendering
 * problem, and an SVG circle can be a real focusable button — so the wheel is
 * reachable from a keyboard, which the phone's touch version cannot offer.
 */

import { useMemo, useState } from 'react';

const RAD = Math.PI / 180;

// The relative sizes the phone draws, so Jupiter reads as Jupiter.
const BASE_R = { Sun: 6.5, Moon: 4.6, Mercury: 2.6, Venus: 3.6, Mars: 3.0, Jupiter: 8.0,
                 Saturn: 7.0, Uranus: 5.2, Neptune: 5.0, Pluto: 2.4, Rahu: 2.8, Ketu: 2.8 };

const VIEW = 640;                 // the wheel's own coordinate space
const CX = VIEW / 2, CY = VIEW / 2;
const R = VIEW * 0.40;
const PLANET_AT = 0.63;           // orbit radius, as a fraction of R
const STACK_STEP = 0.13;          // how far in a crowded body steps
const MIN_SEP = 8;                // degrees under which two bodies are "stacked"
const MAX_STACK = 3;

/** The wedge for one whole-sign field, as an SVG path. */
function wedge(signIndex) {
  const a0 = signIndex * 30, a1 = a0 + 30;
  const p = (deg, r) => [CX + Math.cos(deg * RAD) * r, CY - Math.sin(deg * RAD) * r];
  const [x0, y0] = p(a0, R * 1.02);
  const [x1, y1] = p(a1, R * 1.02);
  return `M ${CX} ${CY} L ${x0} ${y0} A ${R * 1.02} ${R * 1.02} 0 0 0 ${x1} ${y1} Z`;
}

export default function Solar({ data, theme, title }) {
  const [sel, setSel] = useState(null);   // {kind:'planet'|'field', id|n}

  const planets = useMemo(
    () => (Array.isArray(data?.planets) ? data.planets : []).filter((p) => p && typeof p.lon === 'number'),
    [data]
  );
  const fields = Array.isArray(data?.fields) ? data.fields : [];
  const accent = theme?.solar?.accent || '#D4AF37';

  // The ascendant sign, recovered exactly as the phone recovers it.
  const asc = useMemo(() => {
    const p = planets.find((q) => Number.isInteger(q.cup));
    if (!p) return 0;
    return ((Math.floor(p.lon / 30) - (p.cup - 1)) % 12 + 12) % 12;
  }, [planets]);

  // Crowding: walk the bodies in longitude order and step each one inward when
  // it is within MIN_SEP of the one before, wrapping across 0°.
  const levels = useMemo(() => {
    const order = [...planets].sort((a, b) => a.lon - b.lon);
    const out = {};
    let prev = null, lvl = 0;
    for (const p of order) {
      lvl = prev == null ? 0 : (p.lon - prev.lon < MIN_SEP ? (lvl + 1) % (MAX_STACK + 1) : 0);
      out[p.id] = lvl;
      prev = p;
    }
    if (order.length > 1) {
      const gap = (order[0].lon + 360) - order[order.length - 1].lon;
      if (gap < MIN_SEP && out[order[0].id] === 0) {
        out[order[0].id] = (out[order[order.length - 1].id] + 1) % (MAX_STACK + 1);
      }
    }
    return out;
  }, [planets]);

  const placed = useMemo(() => planets.map((p) => {
    const rad = R * (PLANET_AT - (levels[p.id] || 0) * STACK_STEP);
    return {
      p,
      x: CX + Math.cos(p.lon * RAD) * rad,
      y: CY - Math.sin(p.lon * RAD) * rad,
      r: Math.max(7, (BASE_R[p.id] || 3) * 1.7),
      field: Number.isInteger(p.cup) ? p.cup : (((Math.floor(p.lon / 30) - asc) % 12 + 12) % 12) + 1,
    };
  }), [planets, levels, asc]);

  const selField = sel ? (sel.kind === 'planet' ? placed.find((q) => q.p.id === sel.id)?.field : sel.n) : null;
  const reading = sel
    ? (sel.kind === 'planet'
        ? planets.find((q) => q.id === sel.id)
        : fields.find((f) => f.field === sel.n))
    : null;
  const sections = Array.isArray(reading?.sections)
    ? reading.sections.filter((s) => s && (s.title || s.body)) : [];
  const holds = sel?.kind === 'field'
    ? placed.filter((q) => q.field === sel.n).map((q) => q.p.name || q.p.id) : [];

  if (!planets.length) return null;

  return (
    <div className="mx-auto w-full max-w-3xl px-6 pb-24">
      <svg viewBox={`0 0 ${VIEW} ${VIEW}`} className="mx-auto block w-full max-w-[560px]"
           role="group" aria-label={title || 'The solar system'}>
        {/* the lit field */}
        {selField != null && (
          <path d={wedge(((asc + selField - 1) % 12 + 12) % 12)}
                fill={accent} opacity={sel.kind === 'field' ? 0.17 : 0.1} />
        )}

        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(150,172,210,0.20)" strokeWidth="1" />
        <circle cx={CX} cy={CY} r={R * 0.845} fill="none" stroke="rgba(150,172,210,0.11)" strokeWidth="1" />

        {/* the sign boundaries */}
        {Array.from({ length: 12 }, (_, i) => {
          const a = i * 30;
          return (
            <line key={i}
                  x1={CX + Math.cos(a * RAD) * R * 0.845} y1={CY - Math.sin(a * RAD) * R * 0.845}
                  x2={CX + Math.cos(a * RAD) * R} y2={CY - Math.sin(a * RAD) * R}
                  stroke="rgba(150,172,210,0.26)" strokeWidth="1" />
          );
        })}

        {/* the twelve fields — the numbers start at the ascendant, and the whole
            wedge is the target, exactly as a tap on the phone is */}
        {Array.from({ length: 12 }, (_, i) => {
          const n = i + 1;
          const mid = (((asc + n - 1) % 12) * 30) + 15;
          const rr = R * 0.915;
          const on = selField === n;
          return (
            <g key={n} onClick={() => setSel({ kind: 'field', n })} style={{ cursor: 'pointer' }}
               role="button" tabIndex={0} aria-label={`Field ${n}`}
               onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel({ kind: 'field', n })}>
              <path d={wedge(((asc + n - 1) % 12 + 12) % 12)} fill="transparent" />
              <text x={CX + Math.cos(mid * RAD) * rr} y={CY - Math.sin(mid * RAD) * rr + 5}
                    textAnchor="middle" fontSize="15" fontFamily="var(--font-mono), monospace"
                    fill={on ? accent : 'rgba(186,198,222,0.45)'}>{n}</text>
            </g>
          );
        })}

        <circle cx={CX} cy={CY} r="4" fill="rgba(186,198,222,0.5)" />

        {placed.map(({ p, x, y, r }) => {
          const on = sel?.kind === 'planet' && sel.id === p.id;
          return (
            <g key={p.id} onClick={() => setSel({ kind: 'planet', id: p.id })} style={{ cursor: 'pointer' }}
               role="button" tabIndex={0} aria-label={p.name || p.id}
               onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel({ kind: 'planet', id: p.id })}>
              {/* an invisible disc so the target is a finger/pointer size, never
                  the two-pixel dot Pluto actually is */}
              <circle cx={x} cy={y} r={Math.max(22, r + 12)} fill="transparent" />
              <circle cx={x} cy={y} r={r} fill={on ? accent : 'rgba(231,233,241,0.92)'} />
              <text x={x} y={y - r - 9} textAnchor="middle" fontSize="12"
                    fill={on ? accent : 'rgba(186,198,222,0.6)'}>
                {p.name || p.id}{p.retro ? ' ℞' : ''}
              </text>
            </g>
          );
        })}
      </svg>

      {!sel && (
        <p className="mt-4 text-center text-[10px] uppercase tracking-[0.3em] text-white/30">
          Tap a planet, or the field it stands in
        </p>
      )}

      {sel && (
        <article className="mt-10">
          <div className="flex items-baseline gap-4">
            <h2 className="font-display text-[28px] leading-none text-white md:text-[34px]">
              {sel.kind === 'planet'
                ? (reading?.name || sel.id)
                : `Field ${sel.n}`}
            </h2>
            <p className="text-[10px] uppercase tracking-[0.28em]" style={{ color: accent }}>
              {sel.kind === 'planet'
                ? `Field ${placed.find((q) => q.p.id === sel.id)?.field} · ${(
                    planets.find((q) => q.id === sel.id).lon % 30
                  ).toFixed(1)}°`
                : [reading?.title, holds.join(' · ')].filter(Boolean).join('  ·  ')}
            </p>
          </div>

          {reading?.significance && (
            <p className="mt-6 max-w-[60ch] font-serif text-[19px] leading-[1.6] text-white/90">
              {reading.significance}
            </p>
          )}

          {sections.length > 0
            ? sections.map((s, i) => (
                <section key={i} className="mt-8 border-t border-mist pt-6">
                  {s.title && (
                    <p className="text-[9.5px] uppercase tracking-[0.24em]" style={{ color: accent }}>
                      {s.title}
                    </p>
                  )}
                  {s.body && (
                    <p className="mt-3 max-w-[62ch] whitespace-pre-line font-serif text-[16px] leading-[1.7] text-white/75">
                      {s.body}
                    </p>
                  )}
                </section>
              ))
            : reading?.body && (
                <p className="mt-6 max-w-[62ch] whitespace-pre-line font-serif text-[16px] leading-[1.7] text-white/75">
                  {reading.body}
                </p>
              )}

          <button onClick={() => setSel(null)}
                  className="mt-10 rounded border border-mist px-4 py-2 text-[11px] text-white/60 hover:text-white">
            Back to the sky
          </button>
        </article>
      )}
    </div>
  );
}
