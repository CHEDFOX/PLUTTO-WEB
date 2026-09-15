'use client';

/**
 * THE GLOBE — the hundred and two traditions, on a turning earth.
 *
 * The SDUI feed has carried a `globe` node all along and web rendered nothing
 * for it, because the phone's globe is drawn on the GPU with Skia and there was
 * no honest two-line version. This is the honest version: a dot-matrix earth on
 * a 2D canvas, which is the look the reference asks for and costs no WebGL, no
 * shader and no three.js.
 *
 * HOW IT IS DRAWN, and why in this order:
 *
 *   1. THE LAND IS A HALFTONE, not a fill. A grid of points every ~1.6° of
 *      latitude and longitude, kept where the earth is land. Land is decided
 *      ONCE, by rasterising the coastline data into an off-screen equirectangular
 *      bitmap and reading its pixels — a point-in-polygon test per dot per frame
 *      would be tens of thousands of tests sixty times a second, and this is a
 *      single array lookup instead.
 *   2. THE COASTLINE IS A HAIRLINE over the dots. It is what makes the shapes
 *      readable at a glance: the dots give the texture, the outline gives the
 *      recognition.
 *   3. THE RIM is a soft ring just inside the edge — the atmosphere. Without it
 *      a dark sphere on a dark page has no edge at all.
 *
 * The pins are the traditions, from the same /library/map the phone reads, with
 * the same rule: unread ones are faint, a tradition you have read is gold and
 * stays gold. Tapping one opens its reading — the pin carries the section.
 *
 * The earth turns on its own and can be dragged, and it stops turning while a
 * pointer is down. `prefers-reduced-motion` stops the drift entirely; the globe
 * is then a still object you can still turn by hand.
 */

import { useEffect, useRef, useState } from 'react';
import { geoOrthographic, geoEquirectangular, geoPath, geoCircle } from 'd3-geo';
import { feature, mesh } from 'topojson-client';

// HOW MANY POINTS THE WHOLE SPHERE IS MADE OF. Land keeps roughly a third of
// them, which is the ~9,000 dots the halftone is drawn from.
// The lattice's pitch and dot, in CSS pixels. 3.1 and 1.25 are the reference's
// proportions: dense enough to read as a screen rather than as dots, open enough
// that the coastline still has black to sit against.
const PITCH = 3.1;
const DOT = 1.25;
const MASK_W = 2048, MASK_H = 1024;

/**
 * Land, as a lookup: one bit per pixel of an equirectangular bitmap.
 *
 * Rasterised through d3 rather than by walking the rings by hand. The hand-
 * rolled version drew a faint dotted line across the Atlantic, and the reason is
 * the antimeridian: a polygon whose ring crosses ±180° has to be CUT there and
 * closed along the edge, and joining its points in order instead draws a segment
 * straight back across the whole map. d3.geoPath does that cutting; it is the
 * entire job of a projection's clipping.
 *
 * The mapping has to match the sampling below exactly — scale W/2π and a centred
 * translate put lon -180…180 across the full width and lat 90…-90 down the
 * height, which is what the lattice assumes.
 */
function buildLandMask(land) {
  const c = document.createElement('canvas');
  c.width = MASK_W; c.height = MASK_H;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, MASK_W, MASK_H);
  const proj = geoEquirectangular()
    .scale(MASK_W / (2 * Math.PI))
    .translate([MASK_W / 2, MASK_H / 2]);
  const path = geoPath(proj, ctx);
  ctx.beginPath();
  path(land);
  ctx.fillStyle = '#fff';
  ctx.fill();
  const px = ctx.getImageData(0, 0, MASK_W, MASK_H).data;
  const mask = new Uint8Array(MASK_W * MASK_H);
  for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4] > 127 ? 1 : 0;
  return mask;
}

/**
 * THE HALFTONE IS A SCREEN LATTICE, not a set of points on the sphere.
 *
 * Two versions of this were wrong before the reference was looked at closely
 * enough. A latitude/longitude grid bunches into arcs at the poles. A Fibonacci
 * spiral fixes the bunching and replaces it with faint spiral rows, which is the
 * same fault wearing a different hat: any set of points fixed to the SPHERE is
 * distorted by the projection, and the eye reads the distortion as structure.
 *
 * The reference has none of that: its dots are the same size and the same
 * distance apart everywhere on the disc, because the screen is what they are
 * spaced on. So the lattice is a fixed grid over the globe's circle, and each
 * cell asks the earth what is underneath it — a texture laid over a sphere
 * rather than painted onto one.
 *
 * It is cheap, which is the other reason. The inverse projection of a grid point
 * depends only on where it is on the disc and on the tilt, never on the spin —
 * spinning only slides the longitude. So the inverse is computed ONCE per size
 * and each frame is an add and an array lookup per dot.
 */
function buildLattice(r, pitch, tilt) {
  const lat = [], lonRel = [], px = [], py = [];
  const t = (tilt * Math.PI) / 180;
  const cosT = Math.cos(t), sinT = Math.sin(t);
  for (let y = -r; y <= r; y += pitch) {
    for (let x = -r; x <= r; x += pitch) {
      const d2 = x * x + y * y;
      if (d2 > r * r) continue;                       // outside the disc
      // Orthographic inverse on the unit sphere, then undo the tilt. Written out
      // rather than called through d3 because this is the hot loop.
      const X = x / r, Y = -y / r;
      const Z = Math.sqrt(Math.max(0, 1 - X * X - Y * Y));
      const y2 = Y * cosT - Z * sinT;
      const z2 = Y * sinT + Z * cosT;
      lat.push(Math.asin(Math.max(-1, Math.min(1, y2))) * (180 / Math.PI));
      lonRel.push(Math.atan2(X, z2) * (180 / Math.PI));
      px.push(x); py.push(y);
    }
  }
  return {
    lat: Float32Array.from(lat), lonRel: Float32Array.from(lonRel),
    px: Float32Array.from(px), py: Float32Array.from(py), n: lat.length,
  };
}

export default function Globe({ inset = 64, pins = [], lit = [], onOpenPin, height }) {
  const wrap = useRef(null);
  const canvas = useRef(null);
  const state = useRef({ rot: 18, dragging: false, lastX: 0, tilt: -12 });
  const [geo, setGeo] = useState(null);      // { mask, border }
  const lattice = useRef(null);              // rebuilt only when the size changes
  const [hover, setHover] = useState(null);

  // The land, fetched once and turned into dots + an outline.
  useEffect(() => {
    let live = true;
    fetch('/land-110m.json')
      .then((r) => r.json())
      .then((topo) => {
        if (!live) return;
        const land = feature(topo, topo.objects.land);
        const border = mesh(topo, topo.objects.land);
        const mask = buildLandMask(land);   // the whole FeatureCollection, cut by d3
        setGeo({ mask, border });
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  useEffect(() => {
    if (!geo || !canvas.current) return;
    const cv = canvas.current;
    const ctx = cv.getContext('2d');
    const litSet = new Set(lit || []);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    let raf = 0, stop = false;

    const draw = () => {
      const box = wrap.current?.getBoundingClientRect();
      if (!box) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.floor(box.width));
      const h = Math.max(1, Math.floor(box.height));
      if (cv.width !== w * dpr || cv.height !== h * dpr) {
        cv.width = w * dpr; cv.height = h * dpr;
        cv.style.width = `${w}px`; cv.style.height = `${h}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const r = Math.max(40, Math.min(w, h) / 2 - inset / 2);
      const proj = geoOrthographic()
        .scale(r)
        .translate([w / 2, h / 2])
        .rotate([state.current.rot, state.current.tilt]);
      const path = geoPath(proj, ctx);

      // the sphere itself, barely lighter than the page
      ctx.beginPath();
      path(geoCircle().center([-state.current.rot, -state.current.tilt]).radius(90)());
      ctx.fillStyle = 'rgba(255,255,255,0.018)';
      ctx.fill();

      // 1 · the halftone
      if (!lattice.current || lattice.current.r !== r) {
        lattice.current = { r, ...buildLattice(r, PITCH, state.current.tilt) };
      }
      const L = lattice.current;
      const rot = state.current.rot;
      const cx = w / 2, cy = h / 2;
      ctx.fillStyle = 'rgba(228,234,246,0.55)';
      for (let i = 0; i < L.n; i++) {
        // The spin is one addition. Longitude wraps, latitude never moves.
        let lon = L.lonRel[i] - rot;
        lon = ((lon + 180) % 360 + 360) % 360 - 180;
        const mx = (((lon + 180) / 360) * MASK_W) | 0;
        const my = (((90 - L.lat[i]) / 180) * MASK_H) | 0;
        if (!geo.mask[my * MASK_W + mx]) continue;
        ctx.fillRect(cx + L.px[i], cy + L.py[i], DOT, DOT);
      }

      // 2 · the coastline, and it GLOWS. In the reference the outline is the
      // brightest thing on the globe and carries a soft halo — that bloom is
      // what makes a hairline read as light rather than as a drawn border. One
      // wide, dim pass under one sharp pass does it without a blur filter.
      ctx.beginPath();
      path(geo.border);
      ctx.strokeStyle = 'rgba(190,215,255,0.20)';
      ctx.lineWidth = 2.6;
      ctx.stroke();
      ctx.beginPath();
      path(geo.border);
      ctx.strokeStyle = 'rgba(255,255,255,0.92)';
      ctx.lineWidth = 0.65;
      ctx.stroke();

      // 3 · the atmosphere
      // A TIGHT EDGE, not a halo. The first version glowed blue for a tenth of
      // the radius and read as a lens flare around a planet; the reference has a
      // pale hairline of atmosphere sitting just inside the limb and almost
      // nothing outside it.
      const g = ctx.createRadialGradient(w / 2, h / 2, r * 0.965, w / 2, h / 2, r * 1.02);
      g.addColorStop(0, 'rgba(198,214,244,0)');
      g.addColorStop(0.55, 'rgba(198,214,244,0.13)');
      g.addColorStop(1, 'rgba(198,214,244,0)');
      ctx.beginPath(); ctx.arc(w / 2, h / 2, r * 1.02, 0, Math.PI * 2);
      ctx.fillStyle = g; ctx.fill();

      // the traditions
      const hits = [];
      for (const pin of pins) {
        if (typeof pin.lat !== 'number' || typeof pin.lon !== 'number') continue;
        const p = proj([pin.lon, pin.lat]);
        if (!p) continue;
        const on = litSet.has(pin.id);
        const big = hover && hover.id === pin.id;
        ctx.beginPath();
        ctx.arc(p[0], p[1], big ? 3.6 : 2.4, 0, Math.PI * 2);
        ctx.fillStyle = on ? '#D4AF37' : 'rgba(255,255,255,0.72)';
        ctx.fill();
        if (on) {
          ctx.beginPath();
          ctx.arc(p[0], p[1], big ? 8 : 6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(212,175,55,0.16)';
          ctx.fill();
        }
        hits.push({ pin, x: p[0], y: p[1] });
      }
      cv._hits = hits;

      if (!state.current.dragging && !reduce) state.current.rot += 0.06;
      if (!stop) raf = requestAnimationFrame(draw);
    };

    draw();
    return () => { stop = true; cancelAnimationFrame(raf); };
  }, [geo, pins, lit, inset, hover]);

  // Drag to turn, click to open. A pin is small, so the hit radius is generous
  // and the nearest one within it wins — the same rule the phone's touch test
  // uses, for the same reason.
  const nearest = (e) => {
    const cv = canvas.current;
    const box = cv?.getBoundingClientRect();
    if (!cv?._hits || !box) return null;
    const x = e.clientX - box.left, y = e.clientY - box.top;
    let best = null, bd = 16;
    for (const h of cv._hits) {
      const d = Math.hypot(h.x - x, h.y - y);
      if (d < bd) { bd = d; best = h.pin; }
    }
    return best;
  };

  return (
    <div ref={wrap} className="relative w-full select-none"
         style={{ height: height || 'min(70vw, 460px)' }}>
      <canvas
        ref={canvas}
        className="block h-full w-full touch-pan-y"
        onPointerDown={(e) => {
          state.current.dragging = true;
          state.current.lastX = e.clientX;
          e.currentTarget.setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (state.current.dragging) {
            state.current.rot += (e.clientX - state.current.lastX) * 0.35;
            state.current.lastX = e.clientX;
          } else {
            const p = nearest(e);
            if ((p?.id || null) !== (hover?.id || null)) setHover(p);
          }
        }}
        onPointerUp={(e) => {
          state.current.dragging = false;
          const p = nearest(e);
          if (p?.open && onOpenPin) onOpenPin(p.open, p);
        }}
        onPointerLeave={() => { state.current.dragging = false; setHover(null); }}
        style={{ cursor: hover ? 'pointer' : 'grab' }}
      />
      {/* The name of whatever is under the pointer. The phone has no hover, so
          it names a tradition only once tapped; a pointer can be told sooner. */}
      {hover ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center">
          <p className="text-[11px] uppercase tracking-[0.26em] text-white/70">{hover.label}</p>
          {hover.place ? <p className="mt-1 text-[10px] tracking-[0.18em] text-white/30">{hover.place}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
