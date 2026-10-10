/**
 * ASKED · TOXIC — "I asked an app if I'm the toxic one."
 *
 * A hand-drawn cartoon: ink outlines that boil (the line is re-drawn every third
 * frame, as a hand-inked film is), flat cream / tomato / sky / mustard fills,
 * a pair of cartoon gloves holding the real app, sweat drops, "?!" and "!!",
 * speech bubbles, squash-and-stretch type and speed lines. One ink weight and
 * one hard shadow everywhere (LINE, SHADOW), set in stage pixels even on the
 * phone, so a zoom never fattens a line.
 *
 * The footage is a real recording of the app (asked/ask-toxic); only the reply
 * is scripted, so the honesty tag rides along whenever the reply is on screen.
 */
import { el, prog, ease, lerp, rng, spring } from '../lib.js';
import { events, remap, device, honest, tapRing } from '../asked.js';

const C = { cream: '#FFF6E6', tomato: '#FF4545', sky: '#1FC8F0', mustard: '#FFC93C', ink: '#14102B' };
const NS = 'http://www.w3.org/2000/svg';
const LINE = 8, SHADOW = 12;           // the ink line and the hard shadow, stage px
const K = 520 / 590;                   // recording px → screen px
const BODY = { w: 572, h: 1180 };      // the phone's body (screen 520 + a 26 px bezel)

// Film time. The footage times these land on are in setup().
const T = {
  send: 2.933, reply: 3.92, freeze: 4.02, go: 5.10,
  words: [5.28, 5.42, 5.50, 5.66, 5.72, 5.85],   // YOU · LEAVE · FIRST, · IN · YOUR · HEAD. — as each streams in
  tap: 8.618, room: 9.04, three: 9.72, argue: 10.02, me: 13.60, fill: 13.72, accurate: 14.02,
  iris: 15.70, end: 16.06,
};
const DUR = 20.0;

// Where the phone sits: the hook, the reply (zoomed for reading), the room.
const HOOK = { x: 0, y: 290, s: 0.82, rz: -3 };
const PAY = { x: 0, y: 700, s: 1.6, rz: 0 };
const ROOM = { x: 0, y: 565, s: 1.5, rz: 0 };

let S = {};

// ── helpers ────────────────────────────────────────────────────────────────
const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), rz: lerp(a.rz, b.rz, k) });
/** Squash and stretch: up tall, land wide, settle. Returns [scaleX, scaleY]. */
function squash(p, amt = 0.4) {
  if (p <= 0) return [0, 0];
  if (p >= 1) return [1, 1];
  const s = spring(p), w = Math.sin(p * Math.PI * 3) * Math.pow(1 - p, 2) * amt;
  return [s * (1 - w), s * (1 + w)];
}
/** A slam: falls in from big, lands with a squash. */
function slam(p) {
  if (p <= 0) return [0, 0, 0];
  if (p >= 1) return [1, 1, 1];
  if (p < 0.3) { const s = lerp(1.7, 1, ease.inCubic(p / 0.3)); return [s, s, Math.min(1, p / 0.08)]; }
  const q = (p - 0.3) / 0.7, w = Math.sin(q * Math.PI * 2.5) * Math.pow(1 - q, 2) * 0.22;
  return [1 + w, 1 - w, 1];
}
/** Zip off upward (the exit). */
function zip(e, q, extra = '') {
  e.style.opacity = 1 - q;
  e.style.transform = `${extra} translateY(${-q * 380}px) scale(${1 - q * 0.3}, ${1 + q * 0.6})`;
}
function svg(parent, style, vb) {
  const s = document.createElementNS(NS, 'svg');
  if (vb) s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', overflow: 'visible', ...style });
  parent.appendChild(s);
  return s;
}
/** Display type: flat fill, ink outline, hard ink shadow. */
const toon = (fill, size) => ({ fontFamily: 'Anton', fontSize: `${size}px`, lineHeight: 1, color: fill, textTransform: 'uppercase', letterSpacing: '0.01em',
  WebkitTextStroke: `${LINE * 2}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: `${SHADOW + LINE}px ${SHADOW + LINE}px 0 ${C.ink}`, whiteSpace: 'nowrap' });
/** A speech bubble: one path (rounded body + tail), the shadow under it, the words over it. */
function bubble(parent, html, { fill = C.cream, font = 'Hand', weight = 700, size = 76, lh = 1.05, padX = 48, padY = 20, tail = { x: 0.3, dx: -50, len: 70, w: 64 }, top = 330, cx = 540, align = 'center', style = {} } = {}) {
  const box = el('div', 'abs', { left: 0, top: 0, opacity: 0 }, parent);
  const back = svg(box, { left: 0, top: 0, width: '10px', height: '10px' });
  const txt = el('div', '', { position: 'relative', fontFamily: font, fontWeight: weight, fontSize: `${size}px`, lineHeight: lh, color: C.ink, padding: `${padY}px ${padX}px`, whiteSpace: 'nowrap', textAlign: align, ...style }, box, html);
  const w = txt.offsetWidth, h = txt.offsetHeight, r = Math.min(h / 2, 46);
  const bx = tail.x * w, tx = bx + tail.dx, ty = h + tail.len;
  const d = `M ${r} 0 H ${w - r} A ${r} ${r} 0 0 1 ${w} ${r} V ${h - r} A ${r} ${r} 0 0 1 ${w - r} ${h} H ${bx + tail.w / 2} L ${tx} ${ty} L ${bx - tail.w / 2} ${h} H ${r} A ${r} ${r} 0 0 1 0 ${h - r} V ${r} A ${r} ${r} 0 0 1 ${r} 0 Z`;
  back.innerHTML = `<path d="${d}" transform="translate(${SHADOW + LINE / 2},${SHADOW + LINE / 2})" fill="${C.ink}"/><path d="${d}" fill="${fill}" stroke="${C.ink}" stroke-width="${LINE}" stroke-linejoin="round"/>`;
  box.style.left = `${cx - w / 2}px`; box.style.top = `${top}px`;
  box.style.transformOrigin = `${tx}px ${ty}px`;   // it pops from the tail, as a voice does
  return { box, w, h };
}
const showBubble = (b, t, a, z) => {
  if (t < a || t > z + 0.2) { b.box.style.opacity = 0; return; }
  if (t > z) { zip(b.box, prog(t, z, z + 0.2)); return; }
  const [sx, sy] = squash(prog(t, a, a + 0.45));
  b.box.style.opacity = 1; b.box.style.transform = `scale(${sx}, ${sy})`;
};
/** A line of display words that pop one by one. lines: [[word, fill], …] per row. */
function wordRows(parent, rows, { size, top, gap }) {
  const words = [];
  rows.forEach((row, i) => {
    const r = el('div', 'abs', { left: '72px', width: '936px', top: `${top + i * gap}px`, textAlign: 'center' }, parent);
    row.forEach(([w, fill], j) => {
      const e = el('span', '', { display: 'inline-block', ...toon(fill, size), transformOrigin: '50% 85%', opacity: 0, marginRight: j < row.length - 1 ? '0.2em' : 0 }, r, w);
      words.push(e);
    });
  });
  return words;
}
const popWord = (e, t, a, out) => {
  if (t < a || t > out + 0.2) { e.style.opacity = 0; return; }
  if (t > out) { zip(e, prog(t, out, out + 0.2)); return; }
  const [sx, sy] = squash(prog(t, a, a + 0.42), 0.5);
  e.style.opacity = 1; e.style.transform = `scale(${sx}, ${sy})`;
};
/** A doodle in Marker ("?!", "!!"), flat fill, outlined. */
const doodle = (parent, text, { size, fill, line = C.ink, x, y, r }) =>
  el('div', 'abs', { left: `${x}px`, top: `${y}px`, fontFamily: 'Marker', fontSize: `${size}px`, lineHeight: 1, color: fill, WebkitTextStroke: `${LINE * 2}px ${line}`, paintOrder: 'stroke fill',
    textShadow: line === C.ink ? `${SHADOW + LINE}px ${SHADOW + LINE}px 0 ${C.ink}` : 'none', transformOrigin: '50% 90%', opacity: 0, rotate: `${r}deg` }, parent, text);
const popDoodle = (e, t, a, z) => {
  if (t < a || t > z) { e.style.opacity = 0; return; }
  const [sx, sy] = squash(prog(t, a, a + 0.4), 0.55);
  const wob = Math.sin((t - a) * 9) * 3 * Math.exp(-(t - a) * 2);
  e.style.opacity = 1; e.style.transform = `scale(${sx}, ${sy}) rotate(${wob}deg)`;
};

/** A point on the recording (sx, sy in its 590×1280 px) → the stage, for pose P. */
function onStage(P, sx, sy) { return bodyOnStage(P, 26 + sx * K, 26 + sy * K); }
/** A point on the phone's body (0…572, 0…1180) → the stage. */
function bodyOnStage(P, bx, by) {
  const lx = (bx - BODY.w / 2) * P.s, ly = (by - BODY.h / 2) * P.s, a = (P.rz * Math.PI) / 180;
  return [540 + P.x + lx * Math.cos(a) - ly * Math.sin(a), 960 + P.y + lx * Math.sin(a) + ly * Math.cos(a)];
}

/** Where the phone is at t. */
function pose(t) {
  let p;
  if (t < T.send) {
    const k = spring(prog(t, -0.15, 0.6));
    p = { ...HOOK, y: HOOK.y + (1 - k) * 760 + Math.sin(t * 2.6) * 6 };
  } else if (t < T.room) {
    p = mix(HOOK, PAY, ease.outExpo(prog(t, T.send + 0.02, T.send + 0.6)));   // the snap zoom into the conversation
    if (t > T.send + 0.5 && t < T.reply) { const j = Math.floor(t * 15); p.x += Math.sin(j * 2.1) * 3; p.y += Math.cos(j * 1.7) * 2; }   // a nervous shiver while it thinks
    if (t >= T.reply) p.y += Math.sin((t - T.reply) * 2.2) * 4;
  } else {
    p = mix(PAY, ROOM, spring(prog(t, T.room, T.room + 0.6)));
    const q = prog(t, T.room, T.room + 0.5);
    if (q > 0 && q < 1) { const w = Math.sin(q * Math.PI * 2.5) * Math.pow(1 - q, 2) * 0.06; p.sq = [1 + w, 1 - w]; }
    p.y += Math.sin((t - T.room) * 2.2) * 4;
    const u = t - T.fill;
    if (u > 0 && u < 0.7) { p.x += Math.sin(u * Math.PI * 14) * 16 * Math.exp(-u * 6); p.rz += Math.sin(u * Math.PI * 10) * 1.2 * Math.exp(-u * 5); }
  }
  return p;
}

// ── the gloves (body coordinates; the right hand is the left one, mirrored) ──
const PALM = 'M 160 700 C 40 690 -40 720 -90 800 C -114 846 -114 932 -108 1010 C -102 1090 -98 1140 -82 1188 L 170 1188 Z';
const CUFF = 'M -112 1176 Q 30 1156 192 1176 L 184 1262 Q 30 1244 -104 1262 Z';
const RIDGE = 'M -106 1220 Q 30 1202 188 1220';
const SLEEVE = 'M -96 1240 L 182 1240 L 110 1780 L -270 1780 Z';
const THUMB = { a: [-62, 1150], b: [104, 1040], w: 74 };

export default {
  duration: DUR,
  poster: 1.6,
  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.03 }];
    const B = 0.5;
    const groove = (a, b, g = 1) => {
      for (let t = a; t < b - 0.01; t += B) c.push({ i: 'kick', t, g: 0.32 * g }, { i: 'hat', t: t + B / 2, g: 0.09 * g, open: true });
      for (let t = a + B; t < b - 0.01; t += 2 * B) c.push({ i: 'clap', t, g: 0.15 * g });
      const line = [38, 38, 41, 36];
      for (let t = a, k = 0; t < b - 0.01; t += 4 * B, k++) {
        const n = line[k % 4];
        c.push({ i: 'bass', t, n, dur: 0.5, g: 0.4 * g });
        if (t + 1.5 * B < b) c.push({ i: 'bass', t: t + 1.5 * B, n, dur: 0.25, g: 0.28 * g });
        if (t + 3 * B < b) c.push({ i: 'bass', t: t + 3 * B, n: n + 12, dur: 0.25, g: 0.24 * g });
      }
      const mel = [74, 77, 79, 77, 81, 79, 77, 74];   // a bouncy marimba on the off-beats
      for (let t = a + B / 2, k = 0; t < b - 0.01; t += B, k++) c.push({ i: 'mallet', t, n: mel[k % mel.length], g: 0.12 * g, d: 0.35 });
    };
    // The hook: groove, typing, three landings.
    groove(0, T.send);
    const R = rng(5);
    for (let t = 0.12; t < T.send - 0.05; t += 0.055 + R() * 0.05) c.push({ i: 'key', t, g: 0.16 });
    [[0, 74], [0.14, 77], [0.4, 81]].forEach(([t, n]) => c.push({ i: 'hit', t, g: 0.38 }, { i: 'pluck', t, n, g: 0.18, dur: 1 }));
    c.push({ i: 'boom', t: 0.43, g: 0.4 }, { i: 'blip', t: 0.62, n: 86, g: 0.22 });
    // Sent: the beat drops out, a tick while it thinks.
    c.push({ i: 'whoosh', t: T.send - 0.15, dur: 0.35, g: 0.3 }, { i: 'blip', t: T.send, n: 84, g: 0.25 });
    c.push({ i: 'pulse', t: T.send + 0.05, end: T.reply, n: 62, bpm: 120, g: 0.14 }, { i: 'riser', t: T.send + 0.1, end: T.reply, g: 0.22 });
    c.push({ i: 'blip', t: 3.08, n: 79, g: 0.2, slide: 7 }, { i: 'blip', t: 3.5, n: 88, g: 0.12 }, { i: 'blip', t: 3.66, n: 86, g: 0.1 });
    // The reply: a hit, then held breath under the aside.
    c.push({ i: 'hit', t: T.reply, g: 0.42 }, { i: 'pluck', t: T.reply, n: 74, g: 0.2, dur: 1.4 });
    c.push({ i: 'pad', t: T.reply, end: T.go + 0.2, ns: [62, 65, 69], g: 0.06, bright: 900 });
    c.push({ i: 'blip', t: T.freeze + 0.05, n: 79, g: 0.24 }, { i: 'rim', t: 4.5, g: 0.18 }, { i: 'rim', t: 4.75, g: 0.14 });
    // The payoff, word by word, then the groove back in.
    [74, 77, 79, 81, 84, 86].forEach((n, k) => c.push({ i: 'mallet', t: T.words[k], n, g: 0.3, d: 0.5 }, { i: 'hit', t: T.words[k], g: k === 5 ? 0.5 : 0.2 }));
    c.push({ i: 'boom', t: T.words[5], g: 0.5 }, { i: 'crash', t: T.words[5], g: 0.25 });
    groove(T.words[5], T.fill);
    // The chip, the room.
    c.push({ i: 'blip', t: T.tap, n: 86, g: 0.28 }, { i: 'hit', t: T.tap, g: 0.36 });
    c.push({ i: 'whoosh', t: T.room - 0.22, dur: 0.4, g: 0.32 }, { i: 'boom', t: T.room, g: 0.45 });
    c.push({ i: 'hit', t: T.three, g: 0.3 }, { i: 'pluck', t: T.three, n: 79, g: 0.16, dur: 1 }, { i: 'blip', t: T.argue, n: 76, g: 0.16 });
    c.push({ i: 'whoosh', t: 11.2, dur: 0.5, g: 0.16, from: 0.4, to: -0.4 });
    // "That's me" → rude. accurate.: a hit and a comic 808 drop.
    c.push({ i: 'blip', t: T.me, n: 84, g: 0.24 }, { i: 'hit', t: T.fill, g: 0.5 }, { i: 'crash', t: T.fill, g: 0.3 });
    c.push({ i: 'eight', t: T.fill, n: 43, dur: 0.9, g: 0.7, to: 31, at: 0.3 });
    c.push({ i: 'hit', t: T.accurate, g: 0.38 }, { i: 'pluck', t: T.accurate, n: 86, g: 0.18, dur: 1.2 });
    groove(T.fill + 0.5, T.iris - 0.3, 0.9);
    // The iris and the end card.
    c.push({ i: 'riser', t: T.iris - 0.6, end: T.end, g: 0.3 }, { i: 'reverse', end: T.end, dur: 0.8, g: 0.25 });
    c.push({ i: 'whoosh', t: T.iris, dur: 0.35, g: 0.28, from: 0.7, to: -0.7 });
    c.push({ i: 'boom', t: T.end, g: 0.75 }, { i: 'sting', t: T.end + 0.05 });
    c.push({ i: 'hit', t: T.end + 0.35, g: 0.3 }, { i: 'blip', t: T.end + 0.6, n: 79, g: 0.2 });
    for (let t = T.end + 0.9; t < DUR - 0.5; t += B) c.push({ i: 'kick', t, g: 0.16 }, { i: 'hat', t: t + B / 2, g: 0.06 });
    c.push({ i: 'pad', t: T.end, end: DUR, ns: [62, 66, 69], g: 0.05, bright: 1400 });
    return c;
  },

  async setup(stage) {
    stage.style.background = C.ink;
    await Promise.all(['400 100px Anton', '700 76px Hand', '400 100px Marker', '500 34px Mono'].map((f) => document.fonts.load(f)));
    const ev = await events('ask-toxic');
    // Film time → footage time. Typing ×1.8, the orbit ×2.6, the reply untouched
    // (held once on "Sometimes, yes." for the callout; the payoff phrase in slow
    // motion), idle seconds quicker, the chip and the room in real time.
    S.clock = remap([
      [0, ev.type_0 - 0.18, 1.8],
      [T.send, ev.send_0, 2.6],
      [T.reply, 8.85, 1],
      [T.freeze, 8.97, 0],
      [T.go, 8.97, 0.35],
      [5.90, 9.25, 1],
      [7.34, ev.answered_0 + 0.03, (ev.tap_chip - ev.answered_0 - 0.03) / (T.tap - 7.34)],
      [T.tap, ev.tap_chip, 1],
      [9.298, ev.tap_chip + 0.68, 1.25],
      [11.226, 16.10, 1],
      [11.726, ev.scrolled_line1 + 0.02, (ev.tap_thatsme - ev.scrolled_line1 - 0.02) / (T.me - 11.726)],
      [T.me, ev.tap_thatsme, 1],
    ]);

    // The boil: one turbulence for the stage, one scaled to the phone so its line boils the same amount.
    const defs = svg(stage, { width: 0, height: 0 });
    defs.innerHTML = `
      <filter id="boil" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>
      <filter id="boilD" filterUnits="userSpaceOnUse" x="-500" y="-500" width="1600" height="2800"><feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="1"/><feDisplacementMap in="SourceGraphic" scale="6" xChannelSelector="R" yChannelSelector="G"/></filter>`;
    S.turb = [...defs.querySelectorAll('feTurbulence')];
    S.dispD = defs.querySelectorAll('feDisplacementMap')[1];

    // Colour field, then speed lines behind everything drawn.
    S.bg = el('div', 'layer', { background: C.tomato }, stage);
    S.speed = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', filter: 'url(#boil)' }, '0 0 1080 1920');
    S.speedPath = document.createElementNS(NS, 'path'); S.speed.appendChild(S.speedPath);

    // The phone, redrawn as a cartoon: the body, its shadow and the gloves are one boiling drawing.
    const d = device(stage, 'ask-toxic', { skin: 'ink', w: 520, ink: C.ink, body: C.mustard });
    Object.assign(d.body.style, { background: 'transparent', border: 'none', boxShadow: 'none', padding: '26px', transformStyle: 'flat' });   // flat: z-index, not depth, orders the drawing
    d.screen.style.border = 'none';
    S.d = d;
    const back = svg(d.body, { left: 0, top: 0, width: `${BODY.w}px`, height: `${BODY.h}px`, zIndex: -1, filter: 'url(#boilD)', strokeLinejoin: 'round', strokeLinecap: 'round' }, `0 0 ${BODY.w} ${BODY.h}`);
    const hand = `<path d="${SLEEVE}" fill="${C.sky}" stroke="${C.ink}"/><path d="${PALM}" fill="${C.cream}" stroke="${C.ink}"/><path d="${CUFF}" fill="${C.cream}" stroke="${C.ink}"/><path d="${RIDGE}" fill="none" stroke="${C.ink}"/>`;
    back.innerHTML = `
      <g>${hand}</g><g transform="translate(${BODY.w},0) scale(-1,1)">${hand}</g>
      <rect class="sh" width="${BODY.w}" height="${BODY.h}" rx="92" fill="${C.ink}"/>
      <rect x="560" y="250" width="26" height="96" rx="10" fill="${C.mustard}" stroke="${C.ink}"/>
      <rect x="560" y="372" width="26" height="62" rx="10" fill="${C.mustard}" stroke="${C.ink}"/>
      <rect x="-14" y="300" width="26" height="84" rx="10" fill="${C.mustard}" stroke="${C.ink}"/>
      <rect width="${BODY.w}" height="${BODY.h}" rx="92" fill="${C.mustard}" stroke="${C.ink}"/>`;
    S.backSvg = back; S.sh = back.querySelector('.sh');
    const front = svg(d.body, { left: 0, top: 0, width: `${BODY.w}px`, height: `${BODY.h}px`, zIndex: 5, filter: 'url(#boilD)', strokeLinecap: 'round', strokeLinejoin: 'round' }, `0 0 ${BODY.w} ${BODY.h}`);
    const thumb = (m) => {
      const [ax, ay] = THUMB.a, [bx, by] = THUMB.b, ang = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
      const nx = ax + (bx - ax) * 0.86, ny = ay + (by - ay) * 0.86;
      return `<g${m ? ` transform="translate(${BODY.w},0) scale(-1,1)"` : ''}>
        <line class="to" x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${C.ink}"/>
        <line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${C.cream}" stroke-width="${THUMB.w}"/>
        <ellipse cx="${nx}" cy="${ny}" rx="19" ry="14" transform="rotate(${ang} ${nx} ${ny})" fill="${C.cream}" stroke="${C.ink}" class="thin"/>
      </g>`;
    };
    front.innerHTML = `
      <rect x="26" y="26" width="520" height="1128" rx="68" fill="none" stroke="${C.ink}"/>
      <path class="glint" d="M 13 170 L 13 330" stroke="${C.cream}"/>
      ${thumb(false)}${thumb(true)}`;
    S.frontSvg = front; S.thumbOut = [...front.querySelectorAll('.to')]; S.thin = [...front.querySelectorAll('.thin')]; S.glint = front.querySelector('.glint');

    // Marker underlines on the reply, drawn on as it streams (screen px).
    const marks = svg(d.screen, { left: 0, top: 0, width: '520px', height: '1128px', zIndex: 2, filter: 'url(#boilD)' }, '0 0 520 1128');
    const u = (x0, x1, y) => `M ${x0 * K} ${y * K} Q ${((x0 + x1) / 2) * K} ${(y + 3) * K} ${x1 * K} ${(y - 2) * K}`;
    marks.innerHTML = [u(34, 202, 239), u(281, 470, 278), u(34, 152, 319)].map((dd) => `<path d="${dd}" fill="none" stroke="${C.tomato}" stroke-linecap="round"/>`).join('');
    S.marks = [...marks.querySelectorAll('path')];

    // Effects on the stage: sweat drops, the tap impacts.
    S.fx = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', filter: 'url(#boil)', zIndex: 32 }, '0 0 1080 1920');
    const drop = 'M 0 -44 C 16 -16 28 0 28 16 A 28 28 0 1 1 -28 16 C -28 0 -16 -16 0 -44 Z';
    S.fx.innerHTML = [0, 1, 2].map(() => `<g class="drop" opacity="0"><path d="${drop}" fill="${C.sky}" stroke="${C.ink}" stroke-width="${LINE}" stroke-linejoin="round"/><ellipse cx="-9" cy="10" rx="6" ry="10" fill="${C.cream}"/></g>`).join('')
      + `<g class="imp" fill="none" stroke-linecap="round">${Array.from({ length: 8 }, () => `<line stroke="${C.ink}" stroke-width="${10 + LINE * 2}"/><line stroke="${C.mustard}" stroke-width="10"/>`).join('')}</g>`;
    S.drops = [...S.fx.querySelectorAll('.drop')];
    S.imp = [...S.fx.querySelectorAll('.imp line')];
    S.ring = tapRing(stage, { color: C.mustard, size: 150 });

    // Type and doodles — one boiling layer.
    const ov = el('div', 'layer', { zIndex: 30, filter: 'url(#boil)' }, stage);
    S.hook = [
      el('div', 'abs', { left: '72px', width: '936px', top: '186px', textAlign: 'center', ...toon(C.cream, 128), transformOrigin: '50% 90%' }, ov, 'I asked an app'),
      el('div', 'abs', { left: '72px', width: '936px', top: '318px', textAlign: 'center', ...toon(C.cream, 128), transformOrigin: '50% 90%' }, ov, 'if I’m the'),
      el('div', 'abs', { left: '72px', width: '936px', top: '452px', textAlign: 'center', ...toon(C.mustard, 206), transformOrigin: '50% 90%' }, ov, 'toxic one.'),
    ];
    S.bang = doodle(ov, '!!', { size: 150, fill: C.mustard, x: 866, y: 296, r: 12 });
    S.huh = doodle(ov, '?!', { size: 280, fill: C.mustard, line: C.cream, x: 392, y: 250, r: 8 });
    S.aside1 = bubble(ov, '(it didn’t take my side)', { fill: C.cream, top: 330, tail: { x: 0.3, dx: -56, len: 76, w: 64 } });
    S.pay = wordRows(ov, [[['You', C.cream], ['leave', C.cream]], [['first,', C.cream]], [['in', C.mustard], ['your', C.mustard], ['head.', C.mustard]]], { size: 136, top: 246, gap: 150 });
    S.aside2 = bubble(ov, 'then it showed me why', { fill: C.mustard, top: 330, tail: { x: 0.28, dx: -60, len: 80, w: 64 } });
    S.three = el('div', 'abs', { left: '72px', width: '936px', top: '250px', textAlign: 'center', ...toon(C.tomato, 150), transformOrigin: '50% 90%', opacity: 0 }, ov, 'three things.');
    S.argue = el('div', 'abs', { left: '72px', width: '936px', top: '432px', textAlign: 'center', fontFamily: 'Hand', fontWeight: 700, fontSize: '76px', lineHeight: 1, color: C.ink, opacity: 0, transformOrigin: '50% 90%' }, ov, 'specific enough to argue with.');
    S.rude = el('div', 'abs', { left: '72px', width: '936px', top: '250px', textAlign: 'center', ...toon(C.cream, 168), transformOrigin: '50% 90%', opacity: 0 }, ov, 'rude.');
    S.acc = el('div', 'abs', { left: '72px', width: '936px', top: '436px', textAlign: 'center', ...toon(C.mustard, 168), transformOrigin: '50% 90%', opacity: 0 }, ov, 'accurate.');
    S.bang2 = doodle(ov, '!!', { size: 150, fill: C.sky, x: 770, y: 262, r: 14 });

    // The honesty tag: a cream label on the top rail, crisp (it does not boil).
    S.honest = honest(stage, { color: C.ink, bg: C.cream, style: { top: '158px', bottom: 'auto', fontSize: '34px', letterSpacing: '0.06em', padding: '8px 24px', border: `5px solid ${C.ink}`, boxShadow: `6px 6px 0 ${C.ink}` } });
    S.honestEl = stage.lastElementChild;

    // The end card, behind the iris.
    S.endL = el('div', 'layer', { zIndex: 39, background: C.cream, opacity: 0 }, stage);
    const eb = el('div', 'layer', { filter: 'url(#boil)' }, S.endL);
    S.mark = el('div', 'abs', { left: 0, right: 0, top: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '36px' }, eb);
    S.ringMark = svg(S.mark, { position: 'relative', width: '184px', height: '184px' }, '-92 -92 184 184');
    S.ringMark.innerHTML = `<circle cx="${SHADOW + LINE / 2}" cy="${SHADOW + LINE / 2}" r="82" fill="${C.ink}"/><circle r="82" fill="${C.mustard}" stroke="${C.ink}" stroke-width="${LINE}"/>
      <circle r="35" fill="${C.ink}"/><path d="M -57 -30 A 64 64 0 0 1 -21 -60" fill="none" stroke="${C.cream}" stroke-width="10" stroke-linecap="round"/>`;
    S.word = el('div', '', { ...toon(C.tomato, 212), textTransform: 'none', letterSpacing: '0.005em', transformOrigin: '50% 90%' }, S.mark, 'Plutto');
    S.endBubble = bubble(eb, 'Ask what<br>your friends<br><span style="color:' + C.cream + ';-webkit-text-stroke:' + LINE * 2 + 'px ' + C.ink + ';paint-order:stroke fill">won’t say.</span>',
      { fill: C.sky, font: 'Anton', weight: 400, size: 128, lh: 1.02, padX: 76, padY: 38, top: 618, tail: { x: 0.74, dx: 46, len: 84, w: 70 }, style: { textTransform: 'uppercase', letterSpacing: '0.01em' } });
    S.cta = el('div', 'abs', { left: '50%', top: '1206px', fontFamily: 'Anton', fontSize: '94px', lineHeight: 1, color: C.ink, background: C.mustard, border: `${LINE}px solid ${C.ink}`, borderRadius: '999px',
      boxShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`, padding: '18px 64px 22px', whiteSpace: 'nowrap', letterSpacing: '0.01em', opacity: 0 }, eb, 'plutto.space');
    S.sub = el('div', 'abs center', { top: '1400px', fontFamily: 'Mono', fontWeight: 500, fontSize: '36px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink, opacity: 0 }, S.endL, 'Free to start · Android · Web');

    // The iris: a cartoon's "that's all", closing on the button and opening on the card.
    S.iris = el('div', 'layer', { zIndex: 40, pointerEvents: 'none', display: 'none' }, stage);
  },

  async frame(t) {
    const f = Math.round(t * 30), step = Math.floor(f / 3);
    S.turb.forEach((n) => n.setAttribute('seed', String(1 + (step % 9))));

    // The field: tomato hook, ink while it thinks, sky for the reply, cream for the room, tomato for the verdict.
    S.bg.style.background = t < T.send ? C.tomato : t < T.reply ? C.ink : t < T.room ? C.sky : t < T.fill ? C.cream : C.tomato;

    // ── the phone ──
    const P = pose(t), live = t < T.end;
    if (live) await S.d.at(S.clock(t));
    S.d.pose(t, { x: P.x, y: P.y, s: P.s, rz: P.rz, o: live ? 1 : 0 });
    if (P.sq) S.d.body.style.transform += ` scale(${P.sq[0]}, ${P.sq[1]})`;
    const lw = LINE / P.s;
    S.backSvg.style.strokeWidth = lw; S.frontSvg.style.strokeWidth = lw;
    S.thumbOut.forEach((e) => e.setAttribute('stroke-width', THUMB.w + 2 * lw));
    S.thin.forEach((e) => e.setAttribute('stroke-width', lw * 0.7));
    S.glint.setAttribute('stroke-width', 6 / P.s);
    S.sh.setAttribute('transform', `translate(${(SHADOW + LINE / 2) / P.s},${(SHADOW + LINE / 2) / P.s})`);
    S.dispD.setAttribute('scale', (6 / P.s).toFixed(2));
    S.turb[1].setAttribute('baseFrequency', (0.028 * P.s).toFixed(4));

    // Underlines on the reply: "Sometimes, yes." in the freeze; the payoff as it streams.
    const draw = (e, a, b) => { const len = e.getTotalLength(); e.style.strokeDasharray = len; e.style.strokeDashoffset = len * (1 - ease.outCubic(prog(t, a, b))); e.setAttribute('stroke-width', 12 / P.s); e.style.opacity = t < T.room - 0.3 ? 1 : 0; };
    draw(S.marks[0], T.freeze + 0.15, T.freeze + 0.5);
    draw(S.marks[1], T.words[0], T.words[3]);
    draw(S.marks[2], T.words[3], T.words[5] + 0.08);

    // ── speed lines ──
    const BURSTS = [{ a: -0.25, b: T.send, cx: 540, cy: 470, r: 520 }, { a: T.words[5], b: T.words[5] + 0.75, cx: 540, cy: 440, r: 540 },
      { a: T.room, b: T.room + 0.5, cx: 540, cy: 1000, r: 600 }, { a: T.fill, b: T.iris, cx: 540, cy: 430, r: 520 }];
    const bu = BURSTS.find((x) => t >= x.a && t < x.b);
    if (bu) {
      const R = rng(step * 13 + 7), N = 60, inn = (1 - ease.outExpo(prog(t, bu.a, bu.a + 0.3))) * 700;
      const fade = bu.b - bu.a < 1 ? 1 - ease.inCubic(prog(t, bu.b - 0.3, bu.b)) : 1;
      let dd = '';
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2 + (R() - 0.5) * 0.07, w = 0.006 + R() * 0.012, r0 = bu.r + R() * 220 + inn, r1 = 1500;
        const p = (ang, r) => `${(bu.cx + Math.cos(ang) * r).toFixed(1)},${(bu.cy + Math.sin(ang) * r).toFixed(1)}`;
        dd += `M${p(a - w, r1)}L${p(a + w, r1)}L${p(a, r0)}Z`;
      }
      S.speedPath.setAttribute('d', dd); S.speedPath.setAttribute('fill', C.ink);
      S.speed.style.opacity = fade;
    } else S.speed.style.opacity = 0;

    // ── HOOK ──
    [[S.hook[0], -0.12], [S.hook[1], 0.14], [S.hook[2], 0.4]].forEach(([e, a], i) => {
      if (t >= T.send) { const q = prog(t, T.send + i * 0.03, T.send + 0.2 + i * 0.03); if (q >= 1) { e.style.opacity = 0; return; } zip(e, q); return; }
      if (i === 2) { const [sx, sy, o] = slam(prog(t, a, a + 0.55)); e.style.opacity = o; e.style.transform = `scale(${sx}, ${sy})`; return; }
      const [sx, sy] = squash(prog(t, a, a + 0.45), 0.22);
      e.style.opacity = t >= a ? 1 : 0; e.style.transform = `scale(${sx}, ${sy})`;
    });
    popDoodle(S.bang, t, 0.62, T.send);

    // ── the wait: "?!" and sweat ──
    popDoodle(S.huh, t, T.send + 0.12, T.reply);
    const P1 = mix(HOOK, PAY, 1);
    [[0, 3.42, 40, -1], [1, 3.56, 532, 1], [2, 3.7, 70, -1]].forEach(([i, a, bx, dir]) => {
      const u = t - a, g = S.drops[i];
      if (u < 0 || u > 0.75 || t >= T.reply) { g.setAttribute('opacity', 0); return; }
      const [x0, y0] = bodyOnStage(P1, bx, 30);
      const vx = dir * (340 + i * 50), vy = -820, x = x0 + vx * u, y = y0 + vy * u + 1700 * u * u;
      const ang = (Math.atan2(vy + 3400 * u, vx) * 180) / Math.PI + 90;
      const s = squash(prog(u, 0, 0.25))[1];
      g.setAttribute('opacity', 1 - ease.inCubic(prog(u, 0.55, 0.75)));
      g.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(ang + 180).toFixed(1)}) scale(${(1.5 * s).toFixed(3)})`);
    });

    // ── the reply: the aside, then the payoff ──
    showBubble(S.aside1, t, T.freeze + 0.02, T.go - 0.06);
    const outPay = T.tap - 0.16;
    const order = [0, 1, 2, 3, 4, 5];
    order.forEach((k) => popWord(S.pay[k], t, T.words[k], outPay + k * 0.02));

    // ── the chip ──
    showBubble(S.aside2, t, T.tap - 0.06, T.room + 0.56);
    const chip = onStage(pose(T.tap), 160, 522);
    const btn = onStage(pose(T.me), 113, 348);
    const impact = (a, x, y) => {
      const p = prog(t, a, a + 0.42), on = p > 0 && p < 1;
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * Math.PI * 2 + 0.39, r0 = lerp(64, 128, ease.outCubic(p)), r1 = r0 + lerp(62, 6, ease.outCubic(p));
        [S.imp[i * 2], S.imp[i * 2 + 1]].forEach((l) => {
          l.setAttribute('x1', x + Math.cos(ang) * r0); l.setAttribute('y1', y + Math.sin(ang) * r0);
          l.setAttribute('x2', x + Math.cos(ang) * r1); l.setAttribute('y2', y + Math.sin(ang) * r1);
          l.style.opacity = on ? 1 : 0;
        });
      }
      return on;
    };
    if (!impact(T.tap, chip[0], chip[1])) impact(T.me, btn[0], btn[1]);
    S.ring(t, t < T.me - 0.1 ? T.tap : T.me, t < T.me - 0.1 ? chip[0] : btn[0], t < T.me - 0.1 ? chip[1] : btn[1]);

    // ── the room ──
    const outRoom = T.me - 0.1;
    popWord(S.three, t, T.three, outRoom);
    if (t < T.argue || t > outRoom + 0.2) S.argue.style.opacity = 0;
    else if (t > outRoom) zip(S.argue, prog(t, outRoom, outRoom + 0.2));
    else { const [sx, sy] = squash(prog(t, T.argue, T.argue + 0.4), 0.3); S.argue.style.opacity = 1; S.argue.style.transform = `scale(${sx}, ${sy}) rotate(-1.5deg)`; }

    // ── rude. accurate. ──
    [[S.rude, T.fill], [S.acc, T.accurate]].forEach(([e, a]) => {
      if (t < a || t >= T.end) { e.style.opacity = 0; return; }
      const [sx, sy, o] = slam(prog(t, a, a + 0.5));
      e.style.opacity = o; e.style.transform = `scale(${sx}, ${sy})`;
    });
    popDoodle(S.bang2, t, T.accurate + 0.3, T.end);

    // ── the honesty tag, whenever the reply (or the room it opened) is on screen ──
    const hon = t >= T.reply && t < T.iris + 0.3;
    S.honest(hon ? 1 : 0);
    const [hx, hy] = squash(prog(t, T.reply, T.reply + 0.4), 0.3);
    S.honestEl.style.transform = `translateX(-50%) scale(${hon ? hx : 1}, ${hon ? hy : 1}) rotate(-1deg)`;

    // ── the iris and the end card ──
    const te = t - T.end;
    if (t >= T.iris && t < T.end + 0.5) {
      S.iris.style.display = 'block';
      let x, y, r;
      if (t < T.end) { [x, y] = onStage(pose(t), 113, 348); r = lerp(1500, 0, ease.inCubic(prog(t, T.iris, T.end - 0.06))); }
      else { x = 540; y = 438; r = lerp(0, 1800, ease.inCubic(prog(te, 0, 0.45))); }
      S.iris.style.background = r <= 0.5 ? C.ink : `radial-gradient(circle at ${x}px ${y}px, transparent ${r}px, ${C.ink} ${r + 1}px)`;
    } else S.iris.style.display = 'none';

    S.endL.style.opacity = te >= 0 ? 1 : 0;
    if (te >= 0) {
      const [mx, my] = squash(prog(te, 0.08, 0.5), 0.45);
      S.ringMark.style.transform = `scale(${mx}, ${my}) rotate(${te * 40}deg)`;
      const [wx, wy] = squash(prog(te, 0.18, 0.6), 0.45);
      S.word.style.transform = `scale(${wx}, ${wy})`;
      const [bx, by] = squash(prog(te, 0.34, 0.8), 0.35);
      S.endBubble.box.style.opacity = te >= 0.34 ? 1 : 0; S.endBubble.box.style.transform = `scale(${bx}, ${by})`;
      const [cx, cy] = squash(prog(te, 0.62, 1.05), 0.4);
      S.cta.style.opacity = te >= 0.62 ? 1 : 0; S.cta.style.transform = `translateX(-50%) scale(${cx}, ${cy}) rotate(-2deg)`;
      S.sub.style.opacity = ease.outCubic(prog(te, 0.8, 1.1));
      S.sub.style.transform = `translateY(${(1 - ease.outExpo(prog(te, 0.8, 1.2))) * 24}px)`;
    }
  },
};
