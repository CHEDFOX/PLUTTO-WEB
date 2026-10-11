/**
 * ASKED · QUIT — "Should I quit my job without a plan?"
 *
 * A two-colour risograph and torn-paper collage. Two inks only, fluorescent
 * pink and blue, printed on cream stock: where they overprint they go purple,
 * and the blue plate never quite sits on the pink one. Every word is printed on
 * a scrap of torn paper (a white fibre fringe shows where it was torn); the
 * office around the phone (a door with an EXIT sign, a tie on a hook, sticky
 * notes, a coffee cup on the desk) is cut from the same two inks.
 *
 * It is animated as stop-motion: every pose is held for two frames (15 poses a
 * second), the footage included, and paper is laid down, never faded.
 *
 * The footage is a real recording of the app (asked/ask-quit); only the reply
 * is scripted, so the honesty label is taped to the phone whenever the reply
 * (or the room it opened) is on screen.
 */
import { el, prog, ease, lerp, rng, W, H } from '../lib.js';
import { events, remap, device, tapRing } from '../asked.js';
import { paper } from '../print.js';

const C = { paper: '#F4EEE1', sheet: '#FBF7EE', pink: '#FF48B0', blue: '#0078BF', purple: '#4B2E8C', fibre: '#FFFDF7', shadow: 'rgba(48,24,72,0.30)' };
const NS = 'http://www.w3.org/2000/svg';
const K = 520 / 590;                    // recording px → screen px
const BEZ = 16;                         // the paper skin's bezel at w 520
const BODY = { w: 552, h: 1160 };       // the phone's body
const DUR = 18.6;

// Film time. The footage moments these land on are set in setup().
const T = {
  slam: [0, 0.2, 0.47],                 // the hook's three scraps
  send: 2.375, said: 2.62, no: 2.88, reply: 3.35, outNo: 3.3,
  pay: [3.62, 3.87, 4.12],               // QUIT WITH · A DATE, · NOT A MOOD. — as the first line streams
  go: 5.3, nov: 5.75, outPay: 6.45, torn: 6.62, rip: 7.0,
  chip: 8.77, room: 8.9, throw: 10.88, land: 11.02, sixteen: 11.12, straight: 11.5,
  end: 14.4,
};

// Where the phone sits (x, y offsets from the stage centre; s scale; rz tilt).
const HOOK = { x: 0, y: 330, s: 0.8, rz: -2 };
const PAY = { x: 0, y: 668, s: 1.6, rz: 0 };
const ROOM = { x: 0, y: 430, s: 1.25, rz: -1 };
const CALL = { x: 0, y: 392, s: 1.4, rz: 0 };

let S = {};

// ── helpers ────────────────────────────────────────────────────────────────
const twos = (t) => Math.floor(t * 15 + 1e-6) / 15;            // stop-motion: a pose every second frame
const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), rz: lerp(a.rz, b.rz, k) });
/** A point on the phone's body (0…552, 0…1160) → the stage, for pose P. */
function bodyOnStage(P, bx, by) {
  const lx = (bx - BODY.w / 2) * P.s, ly = (by - BODY.h / 2) * P.s, a = (P.rz * Math.PI) / 180;
  return [540 + P.x + lx * Math.cos(a) - ly * Math.sin(a), 960 + P.y + lx * Math.sin(a) + ly * Math.cos(a)];
}
/** A point on the recording (590×1280 px) → the stage. */
const onStage = (P, sx, sy) => bodyOnStage(P, BEZ + sx * K, BEZ + sy * K);

/** A torn edge: a polygon around a w×h box whose sides wander by up to amp px (inward). */
function torn(w, h, R, amp = 5, step = 22) {
  const pts = [];
  const side = (x0, y0, x1, y1, nx, ny) => {
    const len = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(len / step));
    for (let i = 0; i < n; i++) {
      const k = i / n, d = R() * amp;
      pts.push([x0 + (x1 - x0) * k + nx * d + (R() - 0.5) * 3, y0 + (y1 - y0) * k + ny * d + (R() - 0.5) * 3]);
    }
  };
  side(0, 0, w, 0, 0, 1); side(w, 0, w, h, -1, 0); side(w, h, 0, h, 0, -1); side(0, h, 0, 0, 1, 0);
  return pts;
}
const polyCss = (pts) => `polygon(${pts.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`;
const polySvg = (pts) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');

/** A grain tile (riso: the ink never quite covers), as a data URL for CSS backgrounds. */
function grainTile(seed, { light = 0.16, dark = 0.1, n = 2600 } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 220;
  const g = c.getContext('2d'), R = rng(seed);
  for (let i = 0; i < n; i++) {
    const lt = R() < 0.6;
    g.fillStyle = lt ? `rgba(255,253,245,${light * (0.4 + R() * 0.6)})` : `rgba(30,10,50,${dark * (0.4 + R() * 0.6)})`;
    g.beginPath(); g.arc(R() * 220, R() * 220, 0.6 + R() * 1.4, 0, 6.2832); g.fill();
  }
  return c.toDataURL();
}

/**
 * A word printed on a scrap of torn paper. stock: the paper (cream, pink, blue);
 * ink: the plate the letters are printed with; the other plate is laid off
 * register under it (that is the riso). Returns the wrapper (to animate).
 */
function scrap(parent, html, { stock = 'cream', size = 128, font = 'Anton', pad = [0.06, 0.2, 0.04], reg = [5, 4], R, style = {}, track = '0.01em' } = {}) {
  const wrap = el('div', '', { position: 'relative', display: 'inline-block', filter: `drop-shadow(5px 9px 6px ${C.shadow})`, opacity: 0, ...style }, parent);
  const bg = stock === 'pink' ? C.pink : stock === 'blue' ? C.blue : C.sheet;
  const ink = stock === 'blue' ? C.sheet : C.blue;
  const ghost = stock === 'pink' ? null : C.pink;
  const face = el('div', '', { position: 'relative', background: bg, backgroundImage: `url(${S.grainA})`, padding: `${size * pad[0]}px ${size * pad[1]}px ${size * pad[2]}px`,
    fontFamily: font, fontSize: `${size}px`, lineHeight: 1.08, letterSpacing: track, textTransform: font === 'Anton' ? 'uppercase' : 'none', whiteSpace: 'nowrap' }, wrap);
  // The off-register plate first, the key plate over it.
  if (ghost) el('div', '', { position: 'absolute', left: `${size * pad[1] + reg[0]}px`, top: `${size * pad[0] + reg[1]}px`, color: ghost, mixBlendMode: 'multiply', filter: 'url(#riso)', pointerEvents: 'none' }, face, html);
  el('div', '', { position: 'relative', color: ink, mixBlendMode: stock === 'blue' ? 'normal' : 'multiply', filter: 'url(#riso)' }, face, html);
  // Measure, then tear both the fibre fringe (cream, a little bigger) and the face.
  const w = face.offsetWidth, h = face.offsetHeight;
  const fringe = el('div', '', { position: 'absolute', left: '-4px', top: '-4px', width: `${w + 8}px`, height: `${h + 8}px`, background: C.fibre, clipPath: polyCss(torn(w + 8, h + 8, R, 4, 18)) }, wrap);
  wrap.insertBefore(fringe, face);
  face.style.clipPath = polyCss(torn(w, h, R, 7, 20));
  return wrap;
}

/** A row of scraps, centred at `top`. */
function row(parent, top, items, gap = 18) {
  const r = el('div', 'abs', { left: '72px', right: '72px', top: `${top}px`, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: `${gap}px` }, parent);
  return items.map(([html, o]) => scrap(r, html, o));
}

/** Laid down: a scrap drops in large and lifted, lands, settles (on twos). */
function lay(e, t, a, rot = 0, { from = 1.22, d = 0.22 } = {}) {
  const p = prog(t, a, a + d);
  if (t < a) { e.style.opacity = 0; return; }
  const k = Math.min(1, ease.outBack(p)), lift = 1 - p;
  e.style.opacity = 1;
  e.style.transform = `translateY(${-30 * lift}px) scale(${lerp(from, 1, k)}) rotate(${rot + 5 * lift}deg)`;
  e.style.filter = `drop-shadow(${5 + 10 * lift}px ${9 + 18 * lift}px ${6 + 8 * lift}px ${C.shadow})`;
}
/** Peeled off: lifted and pulled away up and aside. */
function peel(e, t, a, rot = 0, dir = 1, d = 0.27) {
  const p = prog(t, a, a + d);
  if (p <= 0) return false;
  const k = ease.inCubic(p);
  e.style.opacity = p >= 1 ? 0 : 1;
  e.style.transform = `translate(${dir * 520 * k}px, ${-360 * k}px) scale(${1 + 0.12 * k}) rotate(${rot + dir * 24 * k}deg)`;
  return true;
}
/** One scrap's life: laid at a, peeled at b. */
const life = (e, t, a, b, rot, dir = 1) => { if (!peel(e, t, b, rot, dir)) lay(e, t, a, rot); };

function svg(parent, style, vb) {
  const s = document.createElementNS(NS, 'svg');
  if (vb) s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', overflow: 'visible', ...style });
  parent.appendChild(s);
  return s;
}

// ── the office, cut from two inks (stage coordinates) ──────────────────────
function office(R) {
  const P = (pts, fill, extra = '') => `<polygon points="${polySvg(pts)}" fill="${fill}" style="mix-blend-mode:multiply" ${extra}/>`;
  const box = (x, y, w, h, fill, amp = 4) => P(torn(w, h, R, amp, 26).map(([a, b]) => [a + x, b + y]), fill);
  // The desk: a blue slab with a pink lip, overprinted.
  const desk = box(-20, 1690, 1120, 260, C.blue, 8) + box(-20, 1672, 1120, 34, C.pink, 6);
  // The door, its panels (pink over blue → purple), the knob, the EXIT sign.
  const door = box(44, 762, 254, 930, C.blue, 5) + box(78, 860, 186, 300, C.pink, 4) + box(78, 1210, 186, 400, C.pink, 4)
    + `<circle cx="266" cy="1244" r="17" fill="${C.pink}" style="mix-blend-mode:multiply"/><circle cx="270" cy="1240" r="17" fill="${C.blue}" style="mix-blend-mode:multiply" opacity="0.7"/>`;
  const exit = `<polygon points="${polySvg(torn(148, 60, R, 3, 26).map(([a, b]) => [a + 96, b + 780]))}" fill="${C.sheet}"/>`;
  // The tie, on its hook (its own group so it can sway).
  const tie = `<g class="tie">
      ${P([[-26, 0], [26, 0], [16, 44], [-16, 44]], C.blue)}
      ${P([[-15, 42], [15, 42], [46, 360], [0, 418], [-46, 360]], C.blue)}
      ${[90, 170, 250, 330].map((y) => P([[-60, y], [60, y - 40], [60, y - 14], [-60, y + 26]], C.pink, 'clip-path="url(#tieClip)"')).join('')}
    </g>`;
  const hook = `<circle cx="900" cy="742" r="12" fill="${C.blue}" style="mix-blend-mode:multiply"/>`;
  // The sticky notes.
  const note = (x, y, w, fill, rot) => `<g transform="translate(${x},${y}) rotate(${rot})">${P(torn(w, w, R, 3, 30).map(([a, b]) => [a - w / 2, b - w / 2]), fill)}</g>`;
  const notes = `<g transform="translate(172,1000) rotate(-5)"><polygon points="${polySvg(torn(150, 150, R, 3, 30).map(([a, b]) => [a - 75, b - 75]))}" fill="${C.sheet}"/></g>` + note(908, 1300, 170, C.pink, 6);
  // The coffee cup, the sleeve, the handle; steam is redrawn on twos.
  const cup = P([[812, 1540], [968, 1540], [950, 1690], [830, 1690]], C.pink) + box(818, 1584, 144, 40, C.blue, 3)
    + `<path d="M 960 1570 C 1012 1570 1012 1650 952 1650" fill="none" stroke="${C.blue}" stroke-width="16" style="mix-blend-mode:multiply"/>`
    + `<path class="steam" fill="none" stroke="${C.blue}" stroke-width="12" stroke-linecap="round" style="mix-blend-mode:multiply"/>`;
  return { desk, back: desk + door + exit + hook + notes, tie, cup };
}

/** A cowrie, cut from cream paper with a blue slit (for the throw). */
const cowrie = (R) => {
  const rx = 26, ry = 36, teeth = Array.from({ length: 6 }, (_, i) => { const y = -22 + i * 9; return `M -9 ${y} L 9 ${y}`; }).join(' ');
  return `<ellipse rx="${rx}" ry="${ry}" fill="${C.fibre}"/><ellipse rx="${rx - 2}" ry="${ry - 2}" fill="${C.sheet}" stroke="${C.blue}" stroke-width="4" style="mix-blend-mode:multiply"/>
    <path d="M ${R() * 2 - 1} -28 Q 3 0 0 28" stroke="${C.blue}" stroke-width="5" fill="none" style="mix-blend-mode:multiply"/><path d="${teeth}" stroke="${C.pink}" stroke-width="3" style="mix-blend-mode:multiply"/>`;
};

// ── the phone's pose at t ─────────────────────────────────────────────────
function pose(t) {
  let p;
  if (t < T.send) p = { ...HOOK };
  else if (t < T.room) p = mix(HOOK, PAY, ease.inOutCubic(prog(t, T.send, T.send + 0.47)));
  else if (t < T.throw + 0.07) p = mix(PAY, ROOM, ease.inOutCubic(prog(t, T.room, T.room + 0.4)));
  else p = mix(ROOM, CALL, ease.inOutCubic(prog(t, T.throw + 0.07, T.throw + 0.47)));
  // A hand-animated hold: the paper settles a hair differently on each pose.
  const R = rng(Math.floor(t * 15) * 7 + 3);
  p.x += (R() - 0.5) * 2.4; p.y += (R() - 0.5) * 2.4; p.rz += (R() - 0.5) * 0.24;
  return p;
}

export default {
  duration: DUR,
  poster: 1.2,
  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.03 }];
    const B = 0.5;
    // A dusty stop-motion groove: kick, a rim on the backbeat, a shaker, a plucky bass, mallets.
    const groove = (a, b, g = 1) => {
      for (let t = a; t < b - 0.01; t += B) c.push({ i: 'kick', t, g: 0.3 * g }, { i: 'shaker', t: t + B / 2, g: 0.08 * g });
      for (let t = a + B; t < b - 0.01; t += 2 * B) c.push({ i: 'rim', t, g: 0.2 * g }, { i: 'clap', t, g: 0.07 * g });
      const line = [41, 41, 44, 39];
      for (let t = a, k = 0; t < b - 0.01; t += 4 * B, k++) {
        const n = line[k % 4];
        c.push({ i: 'bass', t, n, dur: 0.45, g: 0.38 * g });
        if (t + 1.5 * B < b) c.push({ i: 'bass', t: t + 1.5 * B, n, dur: 0.22, g: 0.26 * g });
        if (t + 3 * B < b) c.push({ i: 'bass', t: t + 3 * B, n: n + 12, dur: 0.22, g: 0.2 * g });
      }
      const mel = [77, 80, 84, 82, 80, 77, 75, 77];
      for (let t = a + B / 2, k = 0; t < b - 0.01; t += B, k++) if (k % 2 === 0 || k % 8 === 5) c.push({ i: 'mallet', t, n: mel[k % mel.length], g: 0.1 * g, d: 0.3 });
    };
    const slap = (t, g = 0.3, f = 210) => c.push({ i: 'tom', t, f, g: g * 0.5, verb: 0.15, d: 0.07 }, { i: 'hit', t, g });   // paper laid down
    const rip = (t, g = 0.3) => c.push({ i: 'whoosh', t: t - 0.04, dur: 0.2, g, from: -0.3, to: 0.3 }, { i: 'shaker', t, g: 0.2 }, { i: 'shaker', t: t + 0.05, g: 0.14 });

    // HOOK: three scraps slammed down, typing under the groove.
    groove(0, T.send);
    [[0, 77], [0.2, 80], [0.47, 84]].forEach(([t, n], k) => { slap(t, k === 2 ? 0.48 : 0.34, 190 + k * 20); c.push({ i: 'pluck', t, n, g: 0.18, dur: 1 }); });
    c.push({ i: 'boom', t: 0.47, g: 0.4 });
    const R = rng(9);
    for (let t = 0.1; t < T.send - 0.05; t += 0.06 + R() * 0.05) c.push({ i: 'key', t, g: 0.15 });
    // Sent: the hook peeled off, the groove drops out, a tick while it thinks.
    rip(T.send, 0.32); c.push({ i: 'blip', t: T.send, n: 84, g: 0.22 });
    c.push({ i: 'pulse', t: T.send + 0.05, end: T.reply, n: 65, bpm: 120, g: 0.13 }, { i: 'riser', t: T.send + 0.1, end: T.no, g: 0.2 });
    slap(T.said, 0.26, 200);
    slap(T.no, 0.55, 150); c.push({ i: 'boom', t: T.no, g: 0.55 }, { i: 'eight', t: T.no, n: 41, dur: 0.7, g: 0.5, to: 34, at: 0.3 });
    // The payoff, a scrap per phrase as the reply streams; held under a pad.
    rip(T.outNo, 0.24);
    c.push({ i: 'pad', t: T.reply, end: T.outPay, ns: [65, 68, 72], g: 0.05, bright: 900 });
    T.pay.forEach((t, k) => { slap(t, k === 2 ? 0.5 : 0.32, 180 + k * 15); c.push({ i: 'mallet', t, n: [77, 80, 84][k], g: 0.26, d: 0.6 }); });
    c.push({ i: 'boom', t: T.pay[2], g: 0.45 }, { i: 'crash', t: T.pay[2], g: 0.18 });
    // The circle round "4 November": a pencil scratch and a bell.
    c.push({ i: 'whoosh', t: T.nov, dur: 0.42, g: 0.16, from: -0.5, to: 0.5 }, { i: 'bell', t: T.nov + 0.4, n: 84, g: 0.2, dur: 2 });
    groove(T.go + 0.2, T.end - 0.6, 0.85);
    // Still torn? → the rip.
    rip(T.outPay, 0.22); slap(T.torn, 0.36, 170); rip(T.rip, 0.42); c.push({ i: 'hit', t: T.rip, g: 0.32 });
    // The chip, lifted out of the app; the room.
    c.push({ i: 'blip', t: T.chip, n: 88, g: 0.26 }, { i: 'hit', t: T.chip, g: 0.4 }, { i: 'pluck', t: T.chip, n: 84, g: 0.2, dur: 1.2 });
    c.push({ i: 'whoosh', t: T.room - 0.1, dur: 0.4, g: 0.26 }, { i: 'boom', t: T.room + 0.15, g: 0.42 });
    // The throw: sixteen shells clatter down.
    c.push({ i: 'blip', t: T.throw, n: 86, g: 0.26 }, { i: 'hit', t: T.throw, g: 0.36 });
    const RS = rng(16);
    for (let k = 0; k < 16; k++) c.push({ i: k % 3 ? 'rim' : 'conga', t: T.throw + 0.06 + RS() * 0.22, f: 420 + RS() * 300, g: 0.12 + RS() * 0.1, p: (RS() - 0.5) * 0.8, slap: true });
    slap(T.sixteen, 0.5, 160); c.push({ i: 'boom', t: T.sixteen, g: 0.5 }, { i: 'crash', t: T.sixteen, g: 0.2 });
    slap(T.straight, 0.38, 200); c.push({ i: 'pluck', t: T.straight, n: 89, g: 0.2, dur: 1.4 });
    // The end sheet slides over; the sting.
    c.push({ i: 'riser', t: T.end - 1.0, end: T.end, g: 0.28 }, { i: 'reverse', end: T.end, dur: 0.7, g: 0.22 });
    c.push({ i: 'whoosh', t: T.end - 0.2, dur: 0.4, g: 0.3, from: 0.7, to: -0.7 });
    c.push({ i: 'boom', t: T.end + 0.05, g: 0.7 }, { i: 'sting', t: T.end + 0.1 });
    [0.35, 0.55, 0.8, 1.05, 1.3].forEach((d, k) => slap(T.end + d, 0.2 + (k === 2 ? 0.1 : 0), 180 + k * 12));
    for (let t = T.end + 1.6; t < DUR - 0.5; t += B) c.push({ i: 'kick', t, g: 0.14 }, { i: 'shaker', t: t + B / 2, g: 0.05 });
    c.push({ i: 'pad', t: T.end, end: DUR, ns: [65, 69, 72], g: 0.05, bright: 1300 });
    return c;
  },

  async setup(stage) {
    S = {};
    stage.style.background = C.paper;
    await Promise.all(['400 128px Anton', '900 100px Inter', '700 56px Hand', '500 34px Mono', '700 40px Typewriter'].map((f) => document.fonts.load(f)));
    const ev = await events('ask-quit');
    // Film time → footage time, on twos. Typing ×1.6 and the orbit ×2.2; the first
    // line of the reply in slow motion (×0.3) and held for the payoff; the rest of
    // the reply in real time; idle seconds quicker; the room and the throw real time.
    const R0 = 7.38, R1 = 7.64;                       // the reply's first line streams in here
    const opened = ev.shown_room + 0.38;              // the room has finished sliding up
    S.clock = remap([
      [0, ev.type_0 - 0.1, (ev.send_0 - ev.type_0 + 0.1) / T.send],
      [T.send, ev.send_0, (R0 - ev.send_0) / (T.reply - T.send)],
      [T.reply, R0, (R1 - R0) / (T.pay[2] + 0.07 - T.reply)],
      [T.pay[2] + 0.07, R1, 0],
      [T.go, R1, 1],
      [T.go + ev.answered_0 - R1, ev.answered_0, (ev.tap_chip - ev.answered_0) / (T.chip - (T.go + ev.answered_0 - R1))],
      [T.chip, ev.tap_chip, 1],
      [T.chip + opened - ev.tap_chip, opened, (ev.tap_throw - opened) / (T.throw - (T.chip + opened - ev.tap_chip))],
      [T.throw, ev.tap_throw, 1],
    ]);
    S.grainA = grainTile(4);

    // Filters: the riso (ink that misses in specks, edges that bleed) — reseeded on twos.
    const defs = svg(stage, { width: 0, height: 0 });
    defs.innerHTML = `
      <filter id="riso" x="-4%" y="-8%" width="108%" height="116%">
        <feTurbulence type="fractalNoise" baseFrequency="0.62" numOctaves="1" seed="2" result="n"/>
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  13 0 0 0 -8.3" result="holes"/>
        <feComposite in="SourceGraphic" in2="holes" operator="out" result="ink"/>
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="5" result="w"/>
        <feDisplacementMap in="ink" in2="w" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <filter id="cutEdge" x="-3%" y="-3%" width="106%" height="106%">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="7"/>
        <feDisplacementMap in="SourceGraphic" scale="5" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
      <clipPath id="tieClip"><polygon points="-15,42 15,42 46,360 0,418 -46,360"/></clipPath>`;
    S.turb = [...defs.querySelectorAll('feTurbulence')];

    // The stock: cream paper, fibres and specks.
    S.paperG = paper(stage, { color: C.paper, fibre: [120, 96, 110], wash: 0.5, specks: 260, seed: 21 });

    // The office (behind the phone).
    const R = rng(77);
    const off = office(R);
    S.office = svg(stage, { left: 0, top: 0, width: `${W}px`, height: `${H}px`, filter: 'url(#cutEdge)' }, `0 0 ${W} ${H}`);
    S.office.innerHTML = `<g style="filter:drop-shadow(4px 7px 5px ${C.shadow})">${off.back}<g class="tieHang">${off.tie}</g>${off.cup}</g>`;
    S.tie = S.office.querySelector('.tieHang');
    S.steam = S.office.querySelector('.steam');
    // The words on the office: EXIT on its sign, notes in pencil-blue hand.
    const word = (txt, st) => el('div', 'abs', { mixBlendMode: 'multiply', filter: 'url(#riso)', whiteSpace: 'nowrap', ...st }, stage, txt);
    word('EXIT', { left: '96px', top: '780px', width: '148px', textAlign: 'center', fontFamily: 'Anton', fontSize: '46px', lineHeight: '60px', color: C.blue, letterSpacing: '0.12em' });
    word('plan?', { left: '97px', top: '960px', width: '150px', textAlign: 'center', fontFamily: 'Hand', fontWeight: 700, fontSize: '58px', color: C.blue, transform: 'rotate(-5deg)' });
    word('rent', { left: '823px', top: '1258px', width: '170px', textAlign: 'center', fontFamily: 'Hand', fontWeight: 700, fontSize: '62px', color: C.blue, transform: 'rotate(6deg)' });

    // The phone: cut from blue paper, the pink plate laid off register behind it.
    const d = device(stage, 'ask-quit', { skin: 'paper', w: 520, body: C.blue, shadow: 'none' });
    d.body.style.backgroundImage = `url(${S.grainA})`;
    d.el.style.filter = `drop-shadow(14px 11px 0 ${C.pink}) drop-shadow(6px 16px 12px ${C.shadow})`;
    S.d = d;
    // The circle round "4 November", drawn on the glass in two inks (screen px).
    const marks = svg(d.screen, { left: 0, top: 0, width: '520px', height: '1128px', zIndex: 2 }, '0 0 520 1128');
    // On the film the date "4 November" spans x 349–473, y 261–281 of the recording,
    // and "yet." ends 7px to its left — too close to close a loop between them. So the
    // pen goes round it like a hand does: in over the "4", round the far end, back
    // under the "4", the left side left open (never touching "yet.").
    const cx = 412, cy = 272, rxL = 76, rxR = 84, ry = 25;
    const sp = (v) => Math.sign(v) * Math.pow(Math.abs(v), 2 / 3);
    const loop = (dx, dy) => { let p = ''; for (let i = 0; i <= 72; i++) { const k = i / 72, a = -Math.PI + 0.8 + k * (Math.PI * 2 - 1.6), c = Math.cos(a), wob = 1 + 0.025 * Math.sin(i * 0.9);
      const x = cx + sp(c) * (c < 0 ? rxL : rxR) * wob, y = cy + sp(Math.sin(a)) * ry * wob + k * 3; p += `${i ? 'L' : 'M'} ${((x + dx) * K).toFixed(1)} ${((y + dy) * K).toFixed(1)} `; } return p; };
    marks.innerHTML = `<path d="${loop(1.6, 1.4)}" fill="none" stroke="${C.blue}" stroke-linecap="round" opacity="0.9"/><path d="${loop(0, 0)}" fill="none" stroke="${C.pink}" stroke-linecap="round"/>`;
    S.circ = [...marks.querySelectorAll('path')];
    S.circ.forEach((p) => { p.dataset.len = p.getTotalLength(); });

    S.ring = tapRing(stage, { color: C.pink, size: 150 });

    // Type: every line a row of torn scraps.
    const ov = el('div', 'layer', { zIndex: 30 }, stage);
    const RT = rng(5);
    S.hook = [
      ...row(ov, 168, [['Should I quit', { size: 128, R: RT }]]),
      ...row(ov, 330, [['my job without', { size: 128, R: RT }]]),
      ...row(ov, 494, [['a plan?', { stock: 'pink', size: 176, R: RT }]]),
    ];
    S.said = row(ov, 184, [['It said', { size: 118, R: RT }]])[0];
    S.no = row(ov, 340, [['No.', { stock: 'pink', size: 270, R: RT, pad: [0.02, 0.18, 0.0] }]])[0];
    S.pay = [
      row(ov, 152, [['Quit with', { size: 150, R: RT }]])[0],
      row(ov, 322, [['a date,', { stock: 'pink', size: 150, R: RT }]])[0],
      row(ov, 492, [['not a mood.', { stock: 'blue', size: 128, R: RT }]])[0],
    ];
    // Still torn? — one scrap, torn in two.
    S.tornRow = el('div', 'abs', { left: '72px', right: '72px', top: '300px', display: 'flex', justifyContent: 'center', gap: '0px' }, ov);
    S.torn = [scrap(S.tornRow, 'Still', { size: 176, R: RT, pad: [0.06, 0.16, 0.04] }), scrap(S.tornRow, 'torn?', { size: 176, stock: 'pink', R: RT, pad: [0.06, 0.16, 0.04] })];
    // Ask the shells: the chip, cut out of the app and pinned up.
    S.chipBox = el('div', 'abs', { left: 0, top: 0, width: 0, height: 0, zIndex: 31 }, stage);
    S.chipScrap = scrap(S.chipBox, 'Ask the shells', { stock: 'blue', size: 104, R: RT, pad: [0.12, 0.34, 0.1] });
    Object.assign(S.chipScrap.style, { position: 'absolute', left: 0, top: 0 });
    S.chipW = S.chipScrap.offsetWidth; S.chipH = S.chipScrap.offsetHeight;
    // The callout after the throw.
    S.sixteen = row(ov, 156, [['16 shells.', { size: 150, R: RT }]])[0];
    S.straight = row(ov, 336, [['One straight answer.', { stock: 'pink', size: 84, R: RT, pad: [0.08, 0.22, 0.05] }]])[0];
    // Cut-paper cowries, tossed into the margins on the throw.
    S.shellSvg = svg(stage, { left: 0, top: 0, width: `${W}px`, height: `${H}px`, zIndex: 29, filter: 'url(#cutEdge)' }, `0 0 ${W} ${H}`);
    const RC = rng(31);
    const spots = [[76, 820, -20], [96, 1010, 25], [70, 1210, -8], [100, 1400, 40], [1004, 860, 15], [980, 1060, -30], [1010, 1260, 5], [982, 1450, -40]];
    S.shells = spots.map(([x, y, r], i) => {
      const g = document.createElementNS(NS, 'g'); g.innerHTML = cowrie(RC); g.setAttribute('opacity', 0);
      g.style.filter = `drop-shadow(3px 6px 3px ${C.shadow})`;
      S.shellSvg.appendChild(g);
      return { g, x, y, r, a: T.throw + 0.08 + i * 0.03, fx: x < 540 ? -160 : 160 };
    });

    // The honesty label, taped to the top of the phone.
    S.tag = el('div', 'abs', { left: 0, top: 0, zIndex: 34, opacity: 0, transformOrigin: '50% 50%' }, stage);
    const tagFace = el('div', '', { position: 'relative', background: C.sheet, backgroundImage: `url(${S.grainA})`, padding: '10px 26px 8px', fontFamily: 'Mono', fontWeight: 500, fontSize: '34px',
      letterSpacing: '0.04em', textTransform: 'uppercase', color: C.blue, whiteSpace: 'nowrap', filter: `drop-shadow(3px 5px 3px ${C.shadow})` }, S.tag, 'Real app · example reply');
    tagFace.style.clipPath = polyCss(torn(tagFace.offsetWidth, tagFace.offsetHeight, RT, 4, 18));
    el('div', 'abs', { left: '-26px', top: '-10px', width: '74px', height: '30px', background: C.pink, opacity: 0.55, mixBlendMode: 'multiply', transform: 'rotate(-28deg)' }, S.tag);
    el('div', 'abs', { right: '-26px', top: '-10px', width: '74px', height: '30px', background: C.pink, opacity: 0.55, mixBlendMode: 'multiply', transform: 'rotate(28deg)' }, S.tag);
    S.tagW = tagFace.offsetWidth; S.tagH = tagFace.offsetHeight;

    // ── the end sheet: slides over from the right, torn on its leading edge ──
    S.endL = el('div', 'abs', { left: 0, top: 0, width: `${W + 60}px`, height: `${H}px`, zIndex: 40, transform: `translateX(${W + 120}px)`, filter: `drop-shadow(-10px 0 14px ${C.shadow})` }, stage);
    const RE = rng(12);
    const sheet = el('div', 'abs', { left: 0, top: 0, width: `${W + 60}px`, height: `${H}px`, background: C.paper }, S.endL);
    const edge = [[0, 0]]; for (let y = 0; y <= H; y += 26) edge.push([RE() * 14, y]); edge.push([0, H]);
    sheet.style.clipPath = `polygon(${edge.map(([x, y]) => `${x.toFixed(1)}px ${y}px`).join(',')}, ${W + 60}px ${H}px, ${W + 60}px 0)`;
    const pc = el('canvas', 'abs', { left: 0, top: 0, width: `${W}px`, height: `${H}px` }, sheet); pc.width = W; pc.height = H;
    pc.getContext('2d').drawImage(S.paperG.canvas, 0, 0);
    S.endItems = el('div', 'abs', { left: 0, top: 0, width: `${W}px`, height: `${H}px` }, sheet);
    // The mark: a pink ring and a blue planet, overprinted, and the name.
    S.mark = el('div', 'abs', { left: 0, right: 0, top: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', opacity: 0 }, S.endItems);
    const ms = svg(S.mark, { position: 'relative', width: '150px', height: '150px', filter: 'url(#cutEdge)' }, '-75 -75 150 150');
    ms.innerHTML = `<circle r="44" fill="${C.blue}" style="mix-blend-mode:multiply" transform="translate(5,4)"/><circle r="60" fill="none" stroke="${C.pink}" stroke-width="18" style="mix-blend-mode:multiply"/><circle cx="54" cy="-40" r="11" fill="${C.blue}" style="mix-blend-mode:multiply"/>`;
    S.markSvg = ms;
    const nm = el('div', '', { position: 'relative', fontFamily: 'Inter', fontWeight: 900, fontSize: '128px', letterSpacing: '-0.045em', lineHeight: 1 }, S.mark);
    el('div', '', { color: C.blue, mixBlendMode: 'multiply', filter: 'url(#riso)' }, nm, 'Plutto');
    el('div', 'abs', { left: '6px', top: '5px', color: C.pink, mixBlendMode: 'multiply', filter: 'url(#riso)' }, nm, 'Plutto');
    S.endLine = [row(S.endItems, 570, [['Ask before', { size: 188, R: RE }]])[0], row(S.endItems, 794, [['you jump.', { stock: 'pink', size: 188, R: RE }]])[0]];
    S.cta = row(S.endItems, 1110, [['plutto.space', { stock: 'blue', size: 104, R: RE, font: 'Anton', track: '0.02em', pad: [0.1, 0.3, 0.08] }]])[0];
    S.sub = el('div', 'abs', { left: '72px', right: '72px', top: '1300px', textAlign: 'center', fontFamily: 'Typewriter', fontWeight: 700, fontSize: '46px', color: C.blue, mixBlendMode: 'multiply', filter: 'url(#riso)', opacity: 0 }, S.endItems, 'Free to start · Android · Web');
    // The desk again at the foot of the sheet: the cup, a note that says it.
    const endOff = svg(S.endItems, { left: 0, top: 0, width: `${W}px`, height: `${H}px`, filter: 'url(#cutEdge)' }, `0 0 ${W} ${H}`);
    const RO = rng(78), o2 = office(RO);
    endOff.innerHTML = `<g style="filter:drop-shadow(4px 7px 5px ${C.shadow})">${o2.desk}${o2.cup}</g>`;
    S.endOff = endOff; S.endSteam = endOff.querySelector('.steam');
  },

  async frame(t0) {
    const t = twos(t0), f = Math.round(t * 15);
    S.turb[0].setAttribute('seed', String(2 + (f % 7)));
    S.turb[2].setAttribute('seed', String(7 + (f % 3)));

    // ── the office: the tie sways on its hook, steam curls (on twos) ──
    S.tie.setAttribute('transform', `translate(900,750) rotate(${(Math.sin(t * 2.1) * 3.2).toFixed(2)})`);
    const steam = (k) => { let p = ''; [0, 1].forEach((j) => { const x0 = 862 + j * 46; p += `M ${x0} 1520 `; for (let i = 1; i <= 5; i++) p += `Q ${x0 + (i % 2 ? 16 : -16) * (1 + ((k + i + j) % 3) * 0.2)} ${1520 - i * 22 + 11} ${x0} ${1520 - i * 22} `; }); return p; };
    S.steam.setAttribute('d', steam(f));

    // ── the phone ──
    const P = pose(t), live = t < T.end + 0.3;
    if (live) await S.d.at(S.clock(t));
    S.d.pose(t, { x: P.x, y: P.y, s: P.s, rz: P.rz, o: live ? 1 : 0 });

    // ── the circle round "4 November" ──
    S.circ.forEach((p, k) => {
      const len = +p.dataset.len, q = ease.inOutCubic(prog(t, T.nov + k * 0.03, T.nov + 0.47 + k * 0.03));
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len * (1 - q);
      p.setAttribute('stroke-width', (k ? 7.5 : 6) / P.s);
      p.style.opacity = t >= T.nov && t < T.room ? 1 : 0;
    });

    // ── HOOK ── (on screen from the first frame; the first scrap is already landing)
    const hookRot = [-2, 1.5, -1.5];
    S.hook.forEach((e, i) => life(e, t, T.slam[i] - (i === 0 ? 0.08 : 0), T.send + i * 0.05, hookRot[i], i % 2 ? 1 : -1));

    // ── the wait: "It said" … "No." ──
    life(S.said, t, T.said, T.outNo, -2, -1);
    life(S.no, t, T.no, T.outNo + 0.05, 3, 1);

    // ── the payoff ──
    [[-1.5, -1], [2, 1], [-1, -1]].forEach(([r, dir], k) => life(S.pay[k], t, T.pay[k], T.outPay + k * 0.05, r, dir));

    // ── Still torn? — laid as one scrap, then ripped apart ──
    const rip = ease.outBack(prog(t, T.rip, T.rip + 0.27));
    const tornOut = T.chip - 0.05;
    S.torn.forEach((e, k) => {
      if (peel(e, t, tornOut + k * 0.04, k ? 4 : -3, k ? 1 : -1)) return;
      lay(e, t, T.torn, 0);
      if (t >= T.rip) e.style.transform += ` translate(${(k ? 1 : -1) * 26 * rip}px, ${(k ? 10 : -6) * rip}px) rotate(${(k ? 5 : -4) * rip}deg)`;
    });

    // ── the chip: tapped, then lifted out of the app and pinned up top ──
    const chipAt = onStage(pose(T.chip), 120, 490);
    if (t >= T.throw + 0.04 && t < T.throw + 1) S.ring(t, -10, 0, 0);
    else S.ring(t, t < T.chip + 0.3 ? T.chip : t < T.throw - 0.6 ? -10 : T.throw - 0.42, ...(t < T.throw - 0.6 ? chipAt : onStage(ROOM, 295, 760)));
    {
      const a = T.chip + 0.08, q = ease.inOutCubic(prog(t, a, a + 0.4));
      const x = lerp(chipAt[0], 540, q), y = lerp(chipAt[1], 330, q), s = lerp(0.42, 1, q);
      const out = prog(t, T.throw - 0.02, T.throw + 0.25);
      if (t < a || out >= 1) S.chipScrap.style.opacity = 0;
      else {
        S.chipScrap.style.opacity = 1;
        const k = ease.inCubic(out);
        S.chipScrap.style.transform = `translate(${x - S.chipW / 2 + 520 * k}px, ${y - S.chipH / 2 - 360 * k}px) scale(${s * (1 + 0.1 * k)}) rotate(${lerp(-6, -2, q) + 24 * k}deg)`;
        S.chipScrap.style.filter = `drop-shadow(${5 + 16 * (1 - q)}px ${9 + 26 * (1 - q)}px ${6 + 10 * (1 - q)}px ${C.shadow})`;
      }
    }

    // ── the throw: shells tossed into the margins, the callout ──
    S.shells.forEach(({ g, x, y, r, a, fx }) => {
      const p = prog(t, a, a + 0.27);
      if (t < a || t >= T.end) { g.setAttribute('opacity', 0); return; }
      const k = ease.outBack(p);
      g.setAttribute('opacity', 1);
      g.setAttribute('transform', `translate(${(x + fx * (1 - Math.min(1, k))).toFixed(1)},${(y - 220 * (1 - Math.min(1, k))).toFixed(1)}) rotate(${(r + 140 * (1 - p)).toFixed(1)}) scale(${lerp(1.5, 1, Math.min(1, k)).toFixed(3)})`);
    });
    life(S.sixteen, t, T.sixteen, T.end + 2, -1.5);
    life(S.straight, t, T.straight, T.end + 2, 1.5);

    // ── the honesty label: taped to the top of the phone while the reply or its room is up ──
    const tagOn = t >= T.reply && t < T.end + 0.3;
    if (tagOn) {
      const [tx, ty] = bodyOnStage(P, BODY.w / 2, 4);
      const q = Math.min(1, ease.outBack(prog(t, T.reply, T.reply + 0.2)));
      S.tag.style.opacity = 1;
      S.tag.style.transform = `translate(${tx - S.tagW / 2}px, ${ty - S.tagH / 2}px) rotate(${P.rz - 1.5}deg) scale(${lerp(1.2, 1, q)})`;
    } else S.tag.style.opacity = 0;

    // ── the end sheet ──
    const slide = ease.inOutCubic(prog(t, T.end - 0.3, T.end + 0.13));
    S.endL.style.transform = `translateX(${(1 - slide) * (W + 120) - 30}px)`;
    S.endL.style.display = slide > 0 ? 'block' : 'none';
    if (slide > 0) {
      const te = t - T.end;
      const mq = Math.min(1, ease.outBack(prog(te, 0.3, 0.52)));
      S.mark.style.opacity = te >= 0.3 ? 1 : 0;
      S.mark.style.transform = `scale(${lerp(1.25, 1, mq)}) rotate(${(1 - mq) * -6}deg)`;
      S.markSvg.style.transform = `rotate(${Math.floor(te * 7.5) * 4}deg)`;
      lay(S.endLine[0], t, T.end + 0.55, -2);
      lay(S.endLine[1], t, T.end + 0.8, 1.5);
      lay(S.cta, t, T.end + 1.05, -1.5);
      S.sub.style.opacity = te >= 1.3 ? 1 : 0;
      S.endSteam.setAttribute('d', steam(f + 1));
    }
  },
};
