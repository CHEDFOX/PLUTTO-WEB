/**
 * ASKED PLUTTO · THE EX — studio editorial.
 *
 * Warm ivory paper, near-black ink, one clay accent. Three continuous-line
 * drawings draw themselves on beside the real app in a real phone: a door left
 * ajar (the question), a phone put face down (the advice), a full moon (the
 * night it names). Cormorant set large on a strict left margin, Mono for the
 * small print, slow eases, one move per beat. A soft score: pads, a felt-piano
 * pulse, a few plucks, two knocks on wood.
 *
 * Footage: ask-ex (real recording; only the reply is scripted → honest tag).
 *   type 1.19 · send 4.52 · reply streams 7.00–8.45 · chip 10.75 · room 11.2
 *   · scroll ends 14.4 · "Knock on the night" 16.18 · end 18.59
 */
import { el, prog, ease, lerp, clamp, rng, W, H } from '../lib.js';
import { remap, device, honest } from '../asked.js';

const PAPER = '#F0EEE6', INK = '#191919', CLAY = '#D97757';
const ML = 96;                 // the margin every line hangs from
const SW = 4.5;                // the pen
const NS = 'http://www.w3.org/2000/svg';
const DUR = 22;
const DOOR_Y = 1560 - 600 * 1.15;   // the door's floor sits at y 1560

// Film time → footage time. Typing at 1.6×, the wait at 1.5×, the reply streamed at 0.42×
// so it can be read, the static chips sped past, the room opening in real time.
const CLOCK = [[0, 0.95, 1], [0.25, 1.19, 1.6], [2.33, 4.52, 1.5], [3.86, 6.82, 0.42], [7.74, 8.45, 1.7],
  [9.09, 10.75, 1], [9.69, 11.35, 1.3], [11.61, 13.85, 1], [12.16, 14.4, 0.7], [14.70, 16.18, 1]];

// The beats (film seconds).
const T = {
  send: 2.33, pushA: 2.35, pushB: 3.85,
  answer: 4.29,          // "No. Not the version you miss." lands in the app
  dont: 6.27,            // "Don't text tonight." lands
  chip: 9.05,            // the chip is tapped (footage 10.75)
  room: 9.54,            // the room opens (footage 11.2)
  told: 9.9,
  circle: 12.35,         // the scroll has settled: the full moon's date is on screen
  knockLine: 14.3,
  knock: 14.66,          // "Knock on the night" (footage 16.18)
  out: 16.85,            // the phone leaves
  end: 17.35,            // the end card
};

// Device poses: the hook (lower right, a little turned), the reading (pushed in), the room (settled).
const A = { x: 190, y: 233, s: 0.72, rx: 2, ry: -7 };
const B = { x: 0, y: 563, s: 1.55, rx: 0, ry: 0 };
const C = { x: 0, y: 613, s: 1.55, rx: 0, ry: 0 };

let S = {};

// ── the pen ─────────────────────────────────────────────────────────────────
/** A smooth path through points (Catmull-Rom as cubic Béziers). */
function smooth(pts) {
  const f = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  let d = `M${f(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
    d += ` C${f([p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6])} ${f([p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6])} ${f(p2)}`;
  }
  return d;
}
/** A slow, seeded wander along a stroke: the hand's unsteadiness (fixed, not boiling). */
function wander(seed) {
  const R = rng(seed), a = R() * 6.28, b = R() * 6.28, c = R() * 6.28;
  return (s) => Math.sin(s * 0.019 + a) * 0.6 + Math.sin(s * 0.053 + b) * 0.3 + Math.sin(s * 0.12 + c) * 0.15;
}
/** A ruled line by hand: a polyline, resampled and nudged along its normal. */
function handLine(poly, { step = 12, amp = 1.3, seed = 1 } = {}) {
  const f = wander(seed), pts = [];
  let acc = 0;
  for (let i = 0; i < poly.length - 1; i++) {
    const [x0, y0] = poly[i], [x1, y1] = poly[i + 1];
    const L = Math.hypot(x1 - x0, y1 - y0) || 1, n = Math.max(1, Math.round(L / step)), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
    for (let k = i ? 1 : 0; k <= n; k++) { const u = k / n, o = f(acc + u * L) * amp; pts.push([x0 + (x1 - x0) * u + nx * o, y0 + (y1 - y0) * u + ny * o]); }
    acc += L;
  }
  return smooth(pts);
}
/** An arc or a loop by hand: angles in degrees, `grow` widens it as it goes (a pen's overshoot). */
function handArc(cx, cy, rx, ry, a0, a1, { amp = 1.2, seed = 1, grow = 0, step = 5, rot = 0 } = {}) {
  const f = wander(seed), pts = [], n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / step)), c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180);
  for (let k = 0; k <= n; k++) {
    const u = k / n, a = ((a0 + (a1 - a0) * u) * Math.PI) / 180, g = 1 + grow * u, o = f(u * Math.abs(a1 - a0) * 2) * amp;
    const x = Math.cos(a) * (rx * g + o), y = Math.sin(a) * (ry * g + o);
    pts.push([cx + x * c - y * s, cy + x * s + y * c]);
  }
  return smooth(pts);
}
/** A rounded rectangle's outline as a polyline, rotated, starting mid-bottom (where a pen would start). */
function roundRect(cx, cy, hw, hh, r, rot = 0, over = 0) {
  const pts = [], arc = (ox, oy, a0) => { for (let k = 0; k <= 6; k++) { const a = ((a0 + k * 15) * Math.PI) / 180; pts.push([ox + Math.cos(a) * r, oy + Math.sin(a) * r]); } };
  pts.push([0, hh]);
  arc(-hw + r, hh - r, 90); arc(-hw + r, -hh + r, 180); arc(hw - r, -hh + r, 270); arc(hw - r, hh - r, 0);
  pts.push([0, hh], [over, hh]);
  const c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180);
  return pts.map(([x, y]) => [cx + x * c - y * s, cy + x * s + y * c]);
}
/** Strokes drawn one after another by a single pen. set(p): 0 → 1 drawn; p falling retracts from the end. */
function pen(parent, ds, { color = INK, width = SW } = {}) {
  const paths = ds.map((d) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', width);
    p.setAttribute('stroke-linecap', 'round'); p.setAttribute('stroke-linejoin', 'round');
    parent.appendChild(p); return p;
  });
  let lens = null, total = 0;
  return (p) => {
    if (!lens) { lens = paths.map((x) => x.getTotalLength()); total = lens.reduce((a, b) => a + b, 0); }
    let acc = 0;
    const on = clamp(p) * total;
    paths.forEach((x, i) => {
      const L = lens[i], drawn = clamp(on - acc, 0, L);
      x.style.strokeDasharray = `${L} ${L}`; x.style.strokeDashoffset = `${L - drawn}`; x.style.opacity = drawn > 0.5 ? 1 : 0;
      acc += L;
    });
  };
}
function svg(parent, w, h, style = {}, vb = `0 0 ${w} ${h}`) {
  const s = document.createElementNS(NS, 'svg');
  s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style });
  parent.appendChild(s); return s;
}
function group(parent, x = 0, y = 0) { const g = document.createElementNS(NS, 'g'); g.setAttribute('transform', `translate(${x} ${y})`); parent.appendChild(g); return g; }

// ── type ────────────────────────────────────────────────────────────────────
/** A block of serif lines, each word in its own mask (generous, so Cormorant's descenders never clip). */
function lines(parent, rows, { size, top, left = ML, italic = false, weight = 500, lh = 1.0, align = 'left', width = null, color = INK, track = '-0.012em' }) {
  const box = el('div', 'abs', { left: `${left}px`, top: `${top}px`, width: width ? `${width}px` : 'auto', fontFamily: 'Cormorant', fontStyle: italic ? 'italic' : 'normal',
    fontWeight: weight, fontSize: `${size}px`, lineHeight: lh, letterSpacing: track, color, textAlign: align, zIndex: 20, opacity: 0 }, parent);
  const spans = [];
  rows.forEach((r) => {
    const row = el('div', '', { whiteSpace: 'nowrap' }, box);
    r.split(' ').forEach((w, i, all) => {
      const m = el('span', '', { display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.06em 0.04em 0.3em', margin: '-0.06em -0.04em -0.3em' }, row);
      spans.push(el('span', '', { display: 'inline-block' }, m, w));
      if (i < all.length - 1) row.appendChild(document.createTextNode(' '));
    });
  });
  return { box, spans };
}
/** Words rise out of their masks from a (outExpo); from b the block lifts a little and fades (calm exits, no clipped fragments). */
function play(L, t, a, b, { stagger = 0.09, dur = 1.1 } = {}) {
  const on = t >= a - 0.02 && t < b + 0.4;
  L.box.style.opacity = on ? 1 - ease.inOutCubic(prog(t, b, b + 0.38)) : 0;
  if (!on) return;
  L.box.style.transform = `translateY(${-16 * ease.inCubic(prog(t, b, b + 0.38))}px)`;
  L.spans.forEach((s, i) => {
    const k = ease.outExpo(prog(t, a + i * stagger, a + i * stagger + dur));
    s.style.transform = `translateY(${(1 - k) * 140}%)`;
  });
}
const mono = (parent, text, style = {}) => el('div', 'abs', { fontFamily: 'Mono', fontWeight: 500, fontSize: '34px', letterSpacing: '0.14em', textTransform: 'uppercase',
  color: INK, whiteSpace: 'nowrap', zIndex: 20, ...style }, parent, text);

const mix = (p, q, k) => ({ x: lerp(p.x, q.x, k), y: lerp(p.y, q.y, k), s: lerp(p.s, q.s, k), rx: lerp(p.rx, q.rx, k), ry: lerp(p.ry, q.ry, k) });

export default {
  duration: DUR,
  poster: 1.95,
  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.02 }];
    // Harmony: D minor → B♭ → F → G → Fmaj7, soft pads crossfading.
    const chords = [[0, 4.25, [50, 57, 62, 65]], [4.25, 9.5, [46, 53, 58, 62]], [9.5, 14.6, [41, 53, 57, 60]], [14.6, T.end, [43, 50, 55, 59]], [T.end, DUR - 0.3, [41, 48, 57, 64]]];
    chords.forEach(([t, end, ns]) => c.push({ i: 'pad', t, end, ns, g: 0.085, bright: 820, verb: 0.6 }));
    // The pulse: a felt piano on quiet eighths, following the chords — waiting, not dancing.
    const pulseNotes = [[0.3, 4.25, [74, 69]], [4.25, 9.5, [70, 65]], [9.5, 14.6, [72, 69]], [14.6, T.out + 0.2, [74, 71]]];
    pulseNotes.forEach(([a, b, ns]) => { for (let t = a, k = 0; t < b - 0.05; t += 0.4, k++) c.push({ i: 'pluck', t, n: ns[k % 2], g: k % 4 === 0 ? 0.055 : 0.035, dur: 0.9 }); });
    // Typing: thirty-one keys under the sped-up recording.
    for (let k = 0; k < 31; k++) c.push({ i: 'key', t: 0.27 + k * (2.03 / 31), g: 0.045 });
    // The beats.
    c.push({ i: 'tom', t: 0.02, f: 52, g: 0.3, verb: 0.7, d: 1.4 }, { i: 'bell', t: 0.02, n: 81, g: 0.12, dur: 3 });
    c.push({ i: 'pluck', t: 1.15, n: 69, g: 0.09, dur: 1.6 });
    c.push({ i: 'blip', t: T.send, n: 86, g: 0.07 });
    c.push({ i: 'whoosh', t: T.pushA, dur: 1.4, g: 0.07, from: -0.3, to: 0.3 });
    c.push({ i: 'tom', t: T.answer, f: 46, g: 0.36, verb: 0.75, d: 1.6 });
    [62, 69, 74, 77].forEach((n, i) => c.push({ i: 'pluck', t: T.answer + i * 0.025, n, g: 0.1, dur: 3 }));
    c.push({ i: 'tom', t: T.dont, f: 50, g: 0.28, verb: 0.7, d: 1.3 });
    [65, 70, 74].forEach((n, i) => c.push({ i: 'pluck', t: T.dont + i * 0.025, n, g: 0.09, dur: 2.6 }));
    c.push({ i: 'bell', t: T.dont + 0.05, n: 82, g: 0.07, dur: 2.4 });
    c.push({ i: 'blip', t: T.chip, n: 88, g: 0.07 });
    c.push({ i: 'tom', t: T.room, f: 46, g: 0.28, verb: 0.75, d: 1.5 }, { i: 'bell', t: T.room, n: 77, g: 0.12, dur: 3 }, { i: 'bell', t: T.room + 0.18, n: 84, g: 0.07, dur: 3 });
    [72, 76, 81].forEach((n, i) => c.push({ i: 'pluck', t: T.circle + i * 0.09, n, g: 0.09, dur: 2.2 }));
    c.push({ i: 'conga', t: T.knock + 0.02, f: 240, g: 0.26 }, { i: 'conga', t: T.knock + 0.2, f: 236, g: 0.22 });   // knock, knock
    c.push({ i: 'bell', t: T.knock + 0.3, n: 86, g: 0.08, dur: 2.6 });
    c.push({ i: 'whoosh', t: T.out, dur: 1.0, g: 0.06, from: 0.2, to: -0.2 });
    c.push({ i: 'sting', t: T.end + 0.8, g: 0.7 });
    [53, 60, 64, 69, 72].forEach((n, i) => c.push({ i: 'pluck', t: T.end + 0.85 + i * 0.03, n, g: 0.055, dur: 4 }));
    return c;
  },

  async setup(stage) {
    stage.style.background = PAPER;
    S.clock = remap(CLOCK);

    // ── the paper: ivory, a soft tooth, a few fibres, the faintest falloff ──
    const pc = el('canvas', 'layer', { zIndex: 0 }, stage); pc.width = W; pc.height = H;
    const g = pc.getContext('2d'), R = rng(5);
    g.fillStyle = PAPER; g.fillRect(0, 0, W, H);
    const tooth = document.createElement('canvas'); tooth.width = 540; tooth.height = 960;
    const tg = tooth.getContext('2d'), img = tg.createImageData(540, 960);
    for (let i = 0; i < img.data.length; i += 4) { const v = R(); const c = v > 0.5 ? 255 : 70; img.data[i] = c; img.data[i + 1] = c - 4; img.data[i + 2] = c - 10; img.data[i + 3] = Math.round(Math.abs(v - 0.5) * 2 * 16); }
    tg.putImageData(img, 0, 0); g.drawImage(tooth, 0, 0, W, H);
    for (let k = 0; k < 520; k++) {
      const x = R() * W, y = R() * H, a = R() * 6.28, l = 8 + R() * 30;
      g.strokeStyle = `rgba(110,92,70,${0.025 + R() * 0.04})`; g.lineWidth = 0.5 + R() * 0.7;
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + Math.cos(a + 0.6) * l * 0.5, y + Math.sin(a + 0.6) * l * 0.5, x + Math.cos(a) * l, y + Math.sin(a) * l); g.stroke();
    }
    const vg = g.createRadialGradient(540, 900, 380, 540, 960, 1350);
    vg.addColorStop(0, 'rgba(80,60,40,0)'); vg.addColorStop(1, 'rgba(80,60,40,0.09)');
    g.fillStyle = vg; g.fillRect(0, 0, W, H);

    // ── the drawings on the paper (under the phone) ──
    const ink = svg(stage, W, H, { zIndex: 5 });
    // A door left ajar: the frame on its floor, the leaf swung in, a knob — and light in the gap.
    const DK = 1.15, dk = (pts) => pts.map(([x, y]) => [x * DK, y * DK]);
    const door = group(ink, ML, DOOR_Y);
    S.doorG = door;
    const slit = document.createElementNS(NS, 'path');
    slit.setAttribute('d', `M${dk([[205, 86], [258, 62], [258, 598], [205, 580]]).map((q) => q.join(' ')).join(' L')} Z`);
    slit.setAttribute('fill', CLAY); slit.setAttribute('opacity', 0);
    door.appendChild(slit); S.slit = slit;
    S.door = pen(door, [
      handLine(dk([[0, 600], [40, 600], [40, 60], [260, 60], [260, 600], [320, 600]]), { seed: 3 }),
      handLine(dk([[40, 60], [205, 86], [205, 580], [40, 600]]), { seed: 4, amp: 1 }),
      handArc(190 * DK, 336 * DK, 9, 9, -90, 280, { seed: 5, amp: 0.4, step: 20 }),
    ]);
    // A phone put face down on the table.
    const ph = group(ink, 628, 318);
    S.phoneG = ph;
    const rot = -9, pc0 = [170, 98];
    const local = (x, y) => { const c = Math.cos((rot * Math.PI) / 180), s = Math.sin((rot * Math.PI) / 180); return [pc0[0] + x * c - y * s, pc0[1] + x * s + y * c]; };
    const lens = (x, y, r, seed) => { const [cx, cy] = local(x, y); return handArc(cx, cy, r, r, -80, 292, { seed, amp: 0.25, step: 20 }); };
    S.phone = pen(ph, [
      handLine([[0, 198], [330, 198]], { seed: 7 }),
      handLine(roundRect(pc0[0], pc0[1], 130, 62, 24, rot, 14), { seed: 8, amp: 0.9 }),
      handLine(roundRect(...local(-86, -22), 28, 28, 12, rot, 8), { seed: 9, amp: 0.5 }),
      lens(-86, -34, 9, 10), lens(-86, -9, 9, 11),
    ]);
    // The full moon: one loop that overshoots its own start, three craters.
    const moon = group(ink, 840, 352);
    S.moonG = moon;
    // The full moon over still water: the horizon, the moon (one sea, so it reads as the moon and never as a face),
    // and its reflection broken into three strokes.
    const sea = (cx, cy, rx, ry, rot, a0, a1, ph) => { const pts = [], c = Math.cos(rot), sn = Math.sin(rot);
      for (let k = 0; k <= 48; k++) { const a = ((a0 + (a1 - a0) * k / 48) * Math.PI) / 180;
        const r = 1 + 0.13 * Math.sin(2 * a + ph) + 0.08 * Math.sin(3 * a + ph * 2.3) + 0.05 * Math.sin(5 * a + ph * 0.7);
        const x = Math.cos(a) * rx * r, y = Math.sin(a) * ry * r; pts.push([cx + x * c - y * sn, cy + x * sn + y * c]); }
      return smooth(pts); };
    S.moon = pen(moon, [
      handLine([[-122, 112], [122, 112]], { seed: 18, amp: 1 }),
      handArc(0, 0, 70, 70, 100, 482, { seed: 12, amp: 1.1, grow: 0.02, step: 4 }),
      sea(-17, -19, 30, 19, -0.5, -165, 170, 0.6),
      sea(24, 22, 14, 9, 0.35, -150, 185, 2.1),
      handLine([[-56, 134], [56, 134]], { seed: 19, amp: 0.6 }),
      handLine([[-34, 153], [34, 153]], { seed: 20, amp: 0.5 }),
      handLine([[-14, 170], [14, 170]], { seed: 24, amp: 0.3 }),
    ]);

    // ── the phone: a real one, on paper, with a soft diffuse shadow ──
    S.d = device(stage, 'ask-ex', { skin: 'glass', w: 540, persp: 2600,
      shadow: '0 0 0 1.5px rgba(25,25,25,0.55), 0 30px 60px -12px rgba(70,50,30,0.30), 0 80px 140px -30px rgba(70,50,30,0.26)' });
    S.d.el.style.zIndex = 10;
    // Marks made ON the screen (in the recording's own pixels), so they ride with the phone.
    const scr = svg(S.d.screen, S.d.w, S.d.h, { zIndex: 3, width: '100%', height: '100%' }, '0 0 590 1280');
    scr.setAttribute('preserveAspectRatio', 'none');
    const k = 3.2;   // ≈ the 4.5 px pen once the phone is pushed in to 1.55×
    S.under1 = pen(scr, [handLine([[70, 212], [200, 214], [334, 209]], { seed: 21, amp: 1.2, step: 10 })], { color: CLAY, width: k });
    S.under2 = pen(scr, [handLine([[132, 331], [230, 333], [316, 328]], { seed: 22, amp: 1.2, step: 10 })], { color: CLAY, width: k });
    S.loop = pen(scr, [handArc(160, 497, 150, 99, 38, 410, { seed: 23, amp: 0.8, grow: 0.014, step: 4, rot: -6 })], { color: CLAY, width: k });
    S.rings = [[158, 448], [161, 290]].map(([x, y]) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('fill', 'none'); c.setAttribute('stroke', CLAY); c.setAttribute('stroke-width', k); c.setAttribute('opacity', 0);
      scr.appendChild(c);
      return { c };
    });

    // ── the words ──
    S.kicker = mono(stage, 'Asked Plutto', { left: `${ML}px`, top: '166px', color: 'rgba(25,25,25,0.62)' });
    S.hook = lines(stage, ['Is my ex', 'coming back?'], { size: 168, top: 236, lh: 0.98 });
    S.asked = lines(stage, ['I asked.'], { size: 68, top: 616, italic: true });
    S.honest = honest(stage, { color: INK, bg: 'transparent', style: { left: `${ML}px`, top: '160px', bottom: 'auto', transform: 'none', fontSize: '34px', letterSpacing: '0.12em',
      padding: '9px 24px 8px', border: `2px solid ${INK}`, zIndex: 35 } });
    S.payoff = lines(stage, ['Not the version', 'you miss.'], { size: 124, top: 252 });
    S.dontL = lines(stage, ['Don’t text', 'tonight.'], { size: 124, top: 252 });
    S.told = lines(stage, ['It told me', 'which night', 'to wait for.'], { size: 92, top: 252, lh: 1.04 });
    S.knockL = lines(stage, ['It’ll knock', 'on the night.'], { size: 92, top: 252, lh: 1.04 });

    // ── the end card ──
    const end = el('div', 'layer', { zIndex: 25 }, stage);
    S.endBox = end;
    // The line is the hero; the name signs it; the address and the small print close it.
    S.endLine = lines(end, ['Wait for the', 'right night.'], { size: 124, top: 730, left: 0, width: W, align: 'center' });
    const mark = el('div', 'abs', { left: 0, right: 0, top: '1072px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '22px', opacity: 0 }, end);
    const ms = svg(mark, 70, 70, { position: 'relative' });
    S.ring = pen(ms, [handArc(35, 35, 27, 27, -90, 272, { seed: 31, amp: 0.25, step: 6 })], { color: INK, width: 13 });
    el('div', '', { fontFamily: 'Cormorant', fontWeight: 600, fontSize: '92px', lineHeight: 1, letterSpacing: '-0.005em', color: INK, paddingBottom: '8px' }, mark, 'Plutto');
    S.mark = mark;
    S.cta = el('div', 'abs', { left: '50%', top: '1226px', transform: 'translateX(-50%)', background: CLAY, color: PAPER, fontFamily: 'Inter', fontWeight: 600, fontSize: '44px',
      letterSpacing: '-0.01em', padding: '22px 54px 24px', borderRadius: '999px', whiteSpace: 'nowrap', opacity: 0 }, end, 'plutto.space');
    S.sub = mono(end, 'Free to start · Android · Web', { left: 0, right: 0, top: '1376px', textAlign: 'center', color: 'rgba(25,25,25,0.66)', letterSpacing: '0.12em', opacity: 0 });
  },

  async frame(t) {
    // ── the phone ──
    let p;
    if (t < T.pushA) {
      const k = ease.outExpo(prog(t, -0.3, 1.0));
      p = { ...A, y: A.y + (1 - k) * 1100, ry: lerp(-9, A.ry, ease.outCubic(prog(t, 0, 2.3))) };
    } else if (t < 9.2) {
      p = mix(A, B, ease.inOutCubic(prog(t, T.pushA, T.pushB)));
      const drift = ease.inOutSine(prog(t, T.pushB, 9.2));
      p.s += 0.02 * drift; p.y += 12 * drift;
    } else if (t < T.out) {
      const B2 = { ...B, s: B.s + 0.02, y: B.y + 12 };
      p = mix(B2, C, ease.inOutCubic(prog(t, 9.2, 10.4)));
      const drift = ease.inOutSine(prog(t, 10.4, T.out));
      p.s += 0.02 * drift; p.y += 12 * drift;
    } else {
      p = { ...C, s: C.s + 0.02, y: C.y + 12 };
      p.y += 1500 * ease.inOutCubic(prog(t, T.out, T.out + 0.8));
    }
    S.d.pose(t, p);
    await S.d.at(S.clock(t));

    // ── the hook ──
    S.kicker.style.opacity = (1 - ease.inCubic(prog(t, 2.15, 2.5)));
    S.kicker.style.transform = `translateY(${-14 * ease.inCubic(prog(t, 2.15, 2.5))}px)`;
    play(S.hook, t, -0.5, 2.2, { stagger: 0.07, dur: 0.9 });
    play(S.asked, t, 1.12, 2.28, { stagger: 0.1, dur: 1.0 });
    const doorOut = ease.inCubic(prog(t, 2.3, 2.75));
    S.door(ease.inOutCubic(prog(t, 0.12, 1.75)));
    S.slit.setAttribute('opacity', 0.92 * ease.outCubic(prog(t, 1.55, 2.0)));
    S.doorG.setAttribute('transform', `translate(${ML - 60 * doorOut} ${DOOR_Y})`);
    S.doorG.style.opacity = 1 - doorOut;

    // ── the answer ──
    S.honest(ease.outCubic(prog(t, 3.55, 3.95)) * (1 - ease.inCubic(prog(t, T.out - 0.1, T.out + 0.3))));
    play(S.payoff, t, T.answer, 5.88);
    S.under1(ease.inOutCubic(prog(t, 4.8, 5.25)) * (1 - ease.inOutCubic(prog(t, 5.95, 6.2))));
    play(S.dontL, t, T.dont + 0.08, 8.7);
    S.under2(ease.inOutCubic(prog(t, 6.8, 7.2)) * (1 - ease.inOutCubic(prog(t, 8.55, 8.8))));
    S.phone(ease.inOutCubic(prog(t, 6.5, 7.75)));
    S.phoneG.style.opacity = 1 - ease.inCubic(prog(t, 8.72, 9.1));

    // ── the room ──
    play(S.told, t, T.told, 13.88);
    S.loop(ease.inOutCubic(prog(t, T.circle, T.circle + 0.75)) * (1 - ease.inOutCubic(prog(t, 13.85, 14.2))));
    play(S.knockL, t, T.knockLine, T.out - 0.25);
    // Taps: a clay ring opening from the finger, and the touch itself.
    [[T.chip, 0], [T.knock, 1]].forEach(([a, i]) => {
      const q = prog(t, a, a + 0.7), { c } = S.rings[i];
      const on = q > 0 && q < 1;
      c.setAttribute('r', lerp(18, 62, ease.outCubic(q)));
      c.setAttribute('opacity', on ? 1 - ease.inCubic(q) : 0);
    });

    // ── the moon: drawn in the room, then carried to the centre for the end ──
    S.moon(ease.inOutCubic(prog(t, 10.1, 11.6)));
    const mv = ease.inOutCubic(prog(t, T.out, T.end + 0.5));
    S.moonG.setAttribute('transform', `translate(${lerp(840, 540, mv)} ${lerp(352, 466, mv)})`);

    // ── the end card ──
    const e = t - T.end;
    play(S.endLine, t, T.end + 0.25, 99, { stagger: 0.1, dur: 1.2 });
    S.ring(ease.inOutCubic(prog(e, 0.75, 1.45)));
    S.mark.style.opacity = e > 0.7 ? 1 : 0;
    const word = S.mark.lastChild;
    word.style.opacity = ease.outCubic(prog(e, 0.9, 1.4));
    word.style.transform = `translateY(${(1 - ease.outExpo(prog(e, 0.9, 1.9))) * 24}px)`;
    S.cta.style.opacity = ease.outCubic(prog(e, 1.3, 1.8));
    S.cta.style.transform = `translateX(-50%) translateY(${(1 - ease.outExpo(prog(e, 1.3, 2.2))) * 24}px)`;
    S.sub.style.opacity = ease.outCubic(prog(e, 1.6, 2.1));
  },
};
