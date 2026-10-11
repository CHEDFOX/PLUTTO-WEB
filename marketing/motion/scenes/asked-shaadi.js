/**
 * ASKED · SHAADI — "Shaadi kab hogi?", asked in Hinglish, answered in Hinglish.
 *
 * Indian truck art: hand-lettered Anton slabs with an ink edge and a painted
 * block shadow, a marigold garland and hanging ladis framing the stage, a
 * chevron border, painted nazar eyes and a "Pooch ke dekho!" rear panel on the
 * end card, all on deep indigo. Five paint colours (saffron, magenta, emerald,
 * cobalt, yellow) plus ink and cream; one edge weight (EDGE) everywhere.
 *
 * The rhythm is a dhol chaal (low dagga on the beat, the tilli on the swung
 * third) at 120 BPM; every big beat lands on a dagga hit.
 *
 * The footage is a real recording of the app (asked/ask-shaadi); only the reply
 * is scripted, so the honesty tag rides along whenever the reply is on screen.
 */
import { el, prog, ease, lerp, rng, spring } from '../lib.js';
import { events, remap, device, honest, tapRing } from '../asked.js';

const C = { indigo: '#16103F', deep: '#0E0A2C', ink: '#100A2E', cream: '#FFF3DC', saffron: '#FF8A00', magenta: '#E0218A', emerald: '#00A86B', cobalt: '#1F4FD8', yellow: '#FFD400' };
const NS = 'http://www.w3.org/2000/svg';
const EDGE = 12;                         // the ink edge on painted letters (stroke; 6 px shows)
const K = 520 / 590;                     // recording px → screen px
const BEZ = 44;                          // the painted bezel
const BODY = { w: 608, h: 1216 };

// Film time. The footage times these land on are in setup().
const T = {
  sub: 1.05, send: 2.28, reply: 3.45, slow: 4.55, fast: 5.69, answered: 5.99,
  words: [5.06, 5.16, 5.28, 5.40],         // dosti · se · shuru · hoga — as each streams in
  tap: 8.38, room: 8.74, scroll: 10.81, settled: 11.71, remind: 13.28, wipe: 15.0, end: 15.4,
};
const DUR = 19.6;

// Where the phone sits: the hook, the reply (zoomed to read), the room.
const HOOK = { x: 0, y: 330, s: 0.86, rz: -2.5 };
const PAY = { x: 0, y: 586, s: 1.5, rz: 0 };
const ROOM = { x: 0, y: 450, s: 1.4, rz: 0 };   // high enough that the tag clears the next row's button

let S = {};

// ── helpers ────────────────────────────────────────────────────────────────
const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), rz: lerp(a.rz, b.rz, k) });
function svg(parent, style, vb) {
  const s = document.createElementNS(NS, 'svg');
  if (vb) s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', overflow: 'visible', ...style });
  parent.appendChild(s);
  return s;
}
/** Painted signwriting: flat fill, ink edge, a block shadow in a second paint, ink under it. */
function letter(fill, size, drop = C.magenta, depth = Math.round(size / 16)) {
  const sh = [];
  for (let i = 1; i <= depth; i++) sh.push(`${i}px ${i}px 0 ${drop}`);
  sh.push(`${depth + 2}px ${depth + 3}px 0 ${C.ink}`, `${depth + 4}px ${depth + 6}px 0 ${C.ink}`);
  return { fontFamily: 'Anton', fontSize: `${size}px`, lineHeight: 1, color: fill, textTransform: 'uppercase', letterSpacing: '0.015em',
    WebkitTextStroke: `${EDGE}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: sh.join(','), whiteSpace: 'nowrap' };
}
/** The brush hand for asides: Marker, cream, ink edge, a small painted drop. */
const brush = (fill, size) => ({ fontFamily: 'Marker', fontSize: `${size}px`, lineHeight: 1.05, color: fill, WebkitTextStroke: `10px ${C.ink}`, paintOrder: 'stroke fill',
  textShadow: `5px 6px 0 ${C.ink}`, whiteSpace: 'nowrap' });
/** A centred line of type in the 72 px safe column. */
const line = (parent, html, top, style) => el('div', 'abs', { left: '72px', width: '936px', top: `${top}px`, textAlign: 'center', transformOrigin: '50% 80%', opacity: 0, ...style }, parent, html);

/** A painted slam: drops in from a little big, lands, a single bounce. */
function slam(e, t, a, out = 99, { from = 1.16, rot = 0 } = {}) {
  if (t < a || t > out + 0.22) { e.style.opacity = 0; return; }
  if (t > out) { const q = ease.inCubic(prog(t, out, out + 0.22)); e.style.opacity = 1 - q; e.style.transform = `translateY(${-q * 36}px) scale(${1 - q * 0.08}) rotate(${rot}deg)`; return; }
  const p = prog(t, a, a + 0.42);
  const s = p < 0.35 ? lerp(from, 1, ease.inCubic(p / 0.35)) : 1 + Math.sin(((p - 0.35) / 0.65) * Math.PI * 2) * 0.035 * (1 - (p - 0.35) / 0.65);
  e.style.opacity = 1;                   // paint lands opaque: no ghost frames
  e.style.transform = `scale(${s}) rotate(${rot}deg)`;
}
/** A brush line: wipes on left to right, like a stroke of paint. */
function wipeOn(e, t, a, out = 99) {
  if (t < a || t > out + 0.2) { e.style.opacity = 0; return; }
  if (t > out) { const q = ease.inCubic(prog(t, out, out + 0.2)); e.style.opacity = 1 - q; e.style.clipPath = 'none'; e.style.transform = `translateY(${-q * 60}px)`; return; }
  const p = ease.outCubic(prog(t, a, a + 0.45));
  e.style.opacity = 1; e.style.transform = 'none';
  e.style.clipPath = `inset(-30px ${(1 - p) * 100}% -30px -30px)`;
}

/** A marigold: saffron petals, a yellow heart (svg string at x, y). */
const marigold = (x, y, r = 17, deep = false) =>
  `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="${r}" fill="${deep ? '#F26A00' : C.saffron}" stroke="#B84A00" stroke-width="3" stroke-dasharray="4 3"/>` +
  `<circle r="${r * 0.58}" fill="${C.yellow}" stroke="#E08A00" stroke-width="2.5" stroke-dasharray="3 2.5"/><circle r="${r * 0.2}" fill="#C25500"/></g>`;
const leaf = (x, y, a) => `<path d="M 0 0 Q 9 -7 20 0 Q 9 7 0 0 Z" fill="${C.emerald}" stroke="${C.ink}" stroke-width="2" transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${a})"/>`;
/** A tassel: a cobalt bead, a magenta fringe. */
const tassel = (x, y) => `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)})"><circle r="9" fill="${C.cobalt}" stroke="${C.ink}" stroke-width="3"/>` +
  `<path d="M -10 8 L 10 8 L 14 52 L -14 52 Z" fill="${C.magenta}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>` +
  `<path d="M -6 14 L -8 48 M 0 14 L 0 48 M 6 14 L 8 48" stroke="${C.ink}" stroke-width="2" opacity="0.5"/></g>`;

/** A painted nazar eye: almond, cobalt iris, a lash fan and a magenta brow. */
function eye(cx, cy, flip, lid, look = 0) {
  const w = 92, h = 46 * lid;
  const m = flip ? `translate(${cx},${cy}) scale(-1,1)` : `translate(${cx},${cy})`;
  const lashes = [-0.7, -0.35, 0, 0.35, 0.7].map((k) => { const x = k * w * 0.8, y = -Math.sqrt(Math.max(0, 1 - k * k)) * h * 0.95; return `<line x1="${x}" y1="${y}" x2="${x * 1.18}" y2="${y - 22}" stroke="${C.ink}" stroke-width="6" stroke-linecap="round"/>`; }).join('');
  return `<g transform="${m}">
    <path d="M ${-w * 1.05} -78 Q 0 -128 ${w * 1.05} -70" fill="none" stroke="${C.ink}" stroke-width="22" stroke-linecap="round"/>
    <path d="M ${-w * 1.05} -78 Q 0 -128 ${w * 1.05} -70" fill="none" stroke="${C.magenta}" stroke-width="12" stroke-linecap="round"/>
    ${lashes}
    <path d="M ${-w} 0 Q 0 ${-h * 2} ${w} 0 Q 0 ${h * 2} ${-w} 0 Z" fill="${C.cream}" stroke="${C.ink}" stroke-width="8"/>
    <clipPath id="ec${flip ? 1 : 0}"><path d="M ${-w} 0 Q 0 ${-h * 2} ${w} 0 Q 0 ${h * 2} ${-w} 0 Z"/></clipPath>
    <g clip-path="url(#ec${flip ? 1 : 0})"><g transform="translate(${8 + (flip ? -look : look)},0)"><circle r="36" fill="${C.cobalt}" stroke="${C.ink}" stroke-width="6"/><circle r="16" fill="${C.ink}"/><circle cx="10" cy="-12" r="7" fill="${C.cream}"/></g></g>
  </g>`;
}

/** A point on the recording (sx, sy in its 590×1280 px) → the stage, for pose P. */
function onStage(P, sx, sy) {
  const bx = BEZ + sx * K, by = BEZ + sy * K;
  const lx = (bx - BODY.w / 2) * P.s, ly = (by - BODY.h / 2) * P.s, a = (P.rz * Math.PI) / 180;
  return [540 + P.x + lx * Math.cos(a) - ly * Math.sin(a), 960 + P.y + lx * Math.sin(a) + ly * Math.cos(a)];
}

/** Where the phone is at t. */
function pose(t) {
  if (t < T.send) {
    const k = ease.outBack ? ease.outBack(prog(t, 0, 0.5)) : spring(prog(t, 0, 0.5));
    return { ...HOOK, y: HOOK.y + (1 - k) * 640, rz: HOOK.rz + Math.sin(t * 1.8) * 0.6 };
  }
  if (t < T.tap + 0.1) {
    const p = mix(HOOK, PAY, ease.inOutCubic(prog(t, T.send, T.send + 0.7)));
    p.y += Math.sin((t - T.send) * 1.6) * 3;
    return p;
  }
  const p = mix(PAY, ROOM, ease.inOutCubic(prog(t, T.tap + 0.1, T.room + 0.5)));
  p.y += Math.sin((t - T.send) * 1.6) * 3;
  return p;
}

export default {
  duration: DUR,
  poster: 0.9,
  score() {
    const B = 0.5, c = [{ i: 'room', t: 0, end: DUR, g: 0.03 }];
    // The dhol chaal: dagga on the beat, the tilli on the swung third; a clap on 2 and 4.
    const chaal = (a, b, g = 1) => {
      for (let t = a, k = 0; t < b - 0.01; t += B, k++) {
        c.push({ i: 'tom', t, f: 68, g: 0.55 * g, verb: 0.2, d: 0.35 }, { i: 'kick', t, g: 0.22 * g });
        c.push({ i: 'conga', t: t + (B * 2) / 3, f: 330, g: 0.32 * g, slap: true, p: 0.25 });
        if (k % 2 === 1) c.push({ i: 'clap', t, g: 0.12 * g });
        c.push({ i: 'shaker', t: t + B / 3, g: 0.07 * g, p: -0.3 });
      }
      // The tumbi: a bright plucked riff on the eighths.
      const riff = [74, 77, 79, 77, 74, 72, 74, 0, 74, 77, 79, 81, 79, 77, 74, 0];
      for (let t = a, k = 0; t < b - 0.01; t += B / 2, k++) { const n = riff[k % riff.length]; if (n) c.push({ i: 'mallet', t, n, g: 0.1 * g, d: 0.22, verb: 0.15 }); }
      for (let t = a, k = 0; t < b - 0.01; t += 4 * B, k++) c.push({ i: 'bass', t, n: [38, 38, 41, 36][k % 4], dur: 0.7, g: 0.32 * g });
    };
    const dagga = (t, g = 0.9) => c.push({ i: 'tom', t, f: 52, g, verb: 0.5, d: 1.1 }, { i: 'boom', t, g: 0.42 * g });
    // HOOK: two daggas on the two words, then the chaal under the typing.
    dagga(0.02, 1); dagga(0.36, 0.8);
    c.push({ i: 'crash', t: 0.02, g: 0.22 });
    chaal(0.5, T.send - 0.1);
    const R = rng(11);
    for (let t = 0.4; t < T.send - 0.1; t += 0.06 + R() * 0.05) c.push({ i: 'key', t, g: 0.12 });
    c.push({ i: 'hit', t: T.sub, g: 0.25 }, { i: 'blip', t: T.sub, n: 81, g: 0.16 });
    // Sent: the dhol drops to a tilli roll that climbs into the reply.
    c.push({ i: 'whoosh', t: T.send - 0.18, dur: 0.4, g: 0.3 }, { i: 'blip', t: T.send, n: 86, g: 0.2 });
    for (let t = T.send + 0.2, k = 0; t < T.reply - 0.04; t += lerp(0.16, 0.06, k / 14), k++) c.push({ i: 'conga', t, f: 300 + k * 8, g: 0.12 + k * 0.012, slap: k % 2 === 0, p: k % 2 ? 0.3 : -0.3 });
    c.push({ i: 'riser', t: T.send + 0.2, end: T.reply, g: 0.2 });
    // The reply lands; the chaal comes back half-strength under the reading.
    dagga(T.reply, 0.75);
    c.push({ i: 'pad', t: T.reply, end: T.words[0], ns: [62, 69, 74], g: 0.05, bright: 900 });
    chaal(T.reply + 0.5, T.words[0] - 0.2, 0.55);
    // The payoff, one dagga per word, then the full chaal.
    T.words.forEach((t, k) => { dagga(t, k === 3 ? 1 : 0.7); c.push({ i: 'pluck', t, n: [74, 77, 79, 86][k], g: 0.18, dur: 1.2 }); });
    c.push({ i: 'crash', t: T.words[3], g: 0.3 });
    chaal(T.words[3] + 0.5, T.tap - 0.1);
    // The chip and the room.
    c.push({ i: 'blip', t: T.tap, n: 86, g: 0.25 }, { i: 'hit', t: T.tap, g: 0.3 });
    c.push({ i: 'whoosh', t: T.room - 0.25, dur: 0.4, g: 0.28 });
    dagga(T.room, 1); c.push({ i: 'crash', t: T.room, g: 0.22 });
    chaal(T.room + 0.5, T.remind - 0.1, 0.9);
    c.push({ i: 'whoosh', t: T.scroll, dur: 0.8, g: 0.14, from: 0.4, to: -0.4 });
    // "Remind me" → "Reminder set".
    c.push({ i: 'blip', t: T.remind, n: 88, g: 0.25 });
    dagga(T.remind + 0.1, 0.95); c.push({ i: 'crash', t: T.remind + 0.1, g: 0.26 }, { i: 'pluck', t: T.remind + 0.1, n: 81, g: 0.2, dur: 1.4 });
    chaal(T.remind + 0.6, T.wipe - 0.3, 1);
    // The wipe and the end card.
    c.push({ i: 'riser', t: T.wipe - 0.8, end: T.end, g: 0.28 }, { i: 'reverse', end: T.end, dur: 0.7, g: 0.22 });
    for (let t = T.wipe, k = 0; t < T.end - 0.02; t += 0.08, k++) c.push({ i: 'conga', t, f: 260 + k * 20, g: 0.22, slap: true });
    dagga(T.end, 1.1); c.push({ i: 'sting', t: T.end + 0.05 });
    c.push({ i: 'hit', t: T.end + 0.4, g: 0.28 }, { i: 'blip', t: T.end + 0.7, n: 79, g: 0.2 });
    chaal(T.end + 1.0, DUR - 0.6, 0.5);
    c.push({ i: 'pad', t: T.end, end: DUR, ns: [62, 66, 69], g: 0.05, bright: 1400 });
    return c;
  },

  async setup(stage) {
    stage.style.background = C.indigo;
    await Promise.all(['400 100px Anton', '400 64px Marker', '500 34px Mono'].map((f) => document.fonts.load(f)));
    const ev = await events('ask-shaadi');
    // Film time → footage time. Typing ×1.8, the orbit ×2, the reply at 1× with
    // the payoff phrase in slow motion (0.35×), the room's idle seconds ×1.5,
    // the scroll and both taps in real time.
    S.clock = remap([
      [0, 1.0, 1.8],
      [T.send, ev.send_0, 2.0],
      [T.reply, 7.45, 1],
      [T.slow, 8.55, 0.35],
      [T.fast, 8.95, 1],
      [T.answered, ev.answered_0, (ev.tap_chip - ev.answered_0) / (T.tap - T.answered)],
      [T.tap, ev.tap_chip, 1],
      [9.14, 12.40, 1.5],
      [T.scroll, 14.90, 1],
      [T.settled, 15.80, (ev.tap_remind - 15.80) / (T.remind - T.settled)],
      [T.remind, ev.tap_remind, 1],
    ]);

    // ── the ground: indigo, a soft lamp, a painted flower pattern ──
    S.bg = el('div', 'layer', { background: `radial-gradient(ellipse 80% 55% at 50% 46%, #2A1F74 0%, ${C.indigo} 60%, ${C.deep} 100%)` }, stage);
    const pat = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', opacity: 0.1 }, '0 0 1080 1920');
    pat.innerHTML = `<defs><pattern id="fl" width="120" height="120" patternUnits="userSpaceOnUse">
      <g transform="translate(60,60)" fill="${C.yellow}">${[0, 90, 180, 270].map((a) => `<ellipse rx="7" ry="16" cy="-14" transform="rotate(${a})"/>`).join('')}<circle r="5" fill="${C.magenta}"/></g>
      <g transform="translate(0,0)" fill="${C.emerald}"><circle r="4"/></g><g transform="translate(120,0)" fill="${C.emerald}"><circle r="4"/></g>
      <g transform="translate(0,120)" fill="${C.emerald}"><circle r="4"/></g><g transform="translate(120,120)" fill="${C.emerald}"><circle r="4"/></g></pattern></defs>
      <rect width="1080" height="1920" fill="url(#fl)"/>`;

    // ── the border: painted chevrons down both edges, a yellow keyline inside ──
    const bd = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', zIndex: 41 }, '0 0 1080 1920');
    const cols = [C.saffron, C.magenta, C.emerald, C.cobalt];
    let chev = '';
    for (let i = 0, y = -20; y < 1940; i++, y += 36) {
      const f = cols[i % 4];
      chev += `<path d="M 0 ${y} L 17 ${y + 18} L 34 ${y} L 34 ${y + 36} L 17 ${y + 54} L 0 ${y + 36} Z" fill="${f}"/>`;
      chev += `<path d="M 1046 ${y} L 1063 ${y + 18} L 1080 ${y} L 1080 ${y + 36} L 1063 ${y + 54} L 1046 ${y + 36} Z" fill="${f}"/>`;
    }
    bd.innerHTML = `${chev}<line x1="37" y1="0" x2="37" y2="1920" stroke="${C.ink}" stroke-width="6"/><line x1="1043" y1="0" x2="1043" y2="1920" stroke="${C.ink}" stroke-width="6"/>
      <line x1="42" y1="0" x2="42" y2="1920" stroke="${C.yellow}" stroke-width="4"/><line x1="1038" y1="0" x2="1038" y2="1920" stroke="${C.yellow}" stroke-width="4"/>`;

    // ── the phone, painted: chevron bezel, reflector dots, a yellow keyline ──
    const d = device(stage, 'ask-shaadi', { skin: 'paint', w: 520, ink: C.ink, frame: [C.saffron, C.magenta, C.emerald, C.cobalt], shadow: `14px 18px 0 ${C.ink}` });
    Object.assign(d.body.style, { padding: `${BEZ - 6}px`, transformStyle: 'flat' });
    d.screen.style.zIndex = 1; d.screen.style.border = `0`;
    const deco = svg(d.body, { left: '-6px', top: '-6px', width: `${BODY.w}px`, height: `${BODY.h}px`, zIndex: 0 }, `0 0 ${BODY.w} ${BODY.h}`);
    let dots = '';
    const R0 = BODY.w * 0.13, inset = 20;
    for (let y = 120; y < BODY.h - 120; y += 44) dots += `<circle cx="${inset}" cy="${y}" r="6"/><circle cx="${BODY.w - inset}" cy="${y}" r="6"/>`;
    for (let x = 120; x < BODY.w - 110; x += 44) dots += `<circle cx="${x}" cy="${inset}" r="6"/><circle cx="${x}" cy="${BODY.h - inset}" r="6"/>`;
    deco.innerHTML = `<g fill="${C.cream}" stroke="${C.ink}" stroke-width="3">${dots}</g>
      <rect x="${BEZ - 7}" y="${BEZ - 7}" width="${BODY.w - 2 * BEZ + 14}" height="${BODY.h - 2 * BEZ + 14}" rx="${R0 * 0.82 + 7}" fill="${C.ink}" stroke="${C.yellow}" stroke-width="5"/>`;
    S.d = d;

    // Paint on the reply: a yellow brush stroke under "dosti se shuru hoga," as it streams (screen px).
    const marks = svg(d.screen, { left: 0, top: 0, width: '520px', height: '1128px', zIndex: 2 }, '0 0 520 1128');
    const u = (x0, x1, y) => `M ${x0 * K} ${y * K} Q ${((x0 + x1) / 2) * K} ${(y + 2) * K} ${x1 * K} ${(y - 1.5) * K}`;
    marks.innerHTML = [u(264, 470, 327), u(34, 90, 367)].map((dd) => `<path d="${dd}" fill="none" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>`).join('');
    S.marks = [...marks.querySelectorAll('path')];

    // ── the garland: a marigold string across the top, two ladis down the sides ──
    S.gar = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', zIndex: 42 }, '0 0 1080 1920');

    // ── type ──
    const ov = el('div', 'layer', { zIndex: 30 }, stage);
    S.hook = [line(ov, 'Shaadi', 168, letter(C.yellow, 236, C.magenta)), line(ov, 'kab hogi?', 404, letter(C.cream, 172, C.cobalt))];
    S.sub = line(ov, 'Hinglish mein poocha…', 612, brush(C.saffron, 66));
    S.jawab = line(ov, '…Hinglish mein jawab mila.', 300, brush(C.cream, 60));
    S.gapEyes = svg(ov, { left: 0, top: 0, width: '1080px', height: '1920px', opacity: 0 }, '0 0 1080 1920');
    const pay = el('div', 'abs', { left: '72px', width: '936px', top: '176px', textAlign: 'center' }, ov);
    const row1 = el('div', '', { height: '186px' }, pay), row2 = el('div', '', { height: '186px' }, pay);
    S.pay = [['dosti', C.yellow, C.magenta, row1], ['se', C.yellow, C.magenta, row1], ['shuru', C.cream, C.emerald, row2], ['hoga', C.cream, C.emerald, row2]].map(([w, f, dr, r], i) =>
      el('span', '', { display: 'inline-block', ...letter(f, 176, dr), marginRight: i === 0 || i === 2 ? '0.24em' : 0, transformOrigin: '50% 85%', opacity: 0 }, r, w));
    S.dates = line(ov, 'Dates bhi.', 176, letter(C.yellow, 176, C.magenta));
    S.kundli = line(ov, 'Apni kundli se.', 404, brush(C.cream, 76));
    S.yaad = line(ov, 'Yaad bhi', 160, letter(C.cream, 176, C.cobalt));
    S.dilayega = line(ov, 'dilayega.', 340, letter(C.yellow, 176, C.magenta));
    S.ring = tapRing(stage, { color: C.yellow, size: 160 });
    S.ring2 = tapRing(stage, { color: C.magenta, size: 120 });

    // The honesty tag: a small painted panel, crisp, under the reply.
    S.honest = honest(stage, { color: C.ink, bg: C.yellow, bottom: 290, style: { fontFamily: 'Anton', fontWeight: 400, fontSize: '36px', letterSpacing: '0.08em', padding: '8px 26px 10px', borderRadius: '10px', border: `5px solid ${C.ink}`, boxShadow: `6px 7px 0 ${C.magenta}` } });
    S.honestEl = stage.lastElementChild;

    // ── the wipe: painted rings bursting out from the button ──
    S.wipe = svg(stage, { left: 0, top: 0, width: '1080px', height: '1920px', zIndex: 38, display: 'none' }, '0 0 1080 1920');
    S.wipe.innerHTML = [C.yellow, C.magenta, C.emerald, C.cobalt, C.indigo].map((f) => `<circle fill="${f}" stroke="${C.ink}" stroke-width="10"/>`).join('');
    S.wipeC = [...S.wipe.querySelectorAll('circle')];

    // ── the end card ──
    S.endL = el('div', 'layer', { zIndex: 39, opacity: 0, background: `radial-gradient(ellipse 80% 55% at 50% 40%, #2A1F74 0%, ${C.indigo} 60%, ${C.deep} 100%)` }, stage);
    const ep = svg(S.endL, { left: 0, top: 0, width: '1080px', height: '1920px', opacity: 0.1 }, '0 0 1080 1920');
    ep.innerHTML = '<rect width="1080" height="1920" fill="url(#fl)"/>';
    S.mark = el('div', 'abs', { left: 0, right: 0, top: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30px', transformOrigin: '50% 60%' }, S.endL);
    const rm = svg(S.mark, { position: 'relative', width: '150px', height: '150px' }, '-75 -75 150 150');
    rm.innerHTML = `<circle cx="9" cy="11" r="64" fill="${C.ink}"/><circle r="64" fill="${C.yellow}" stroke="${C.ink}" stroke-width="10"/><circle r="27" fill="${C.ink}"/>
      <path d="M -46 -24 A 52 52 0 0 1 -16 -48" fill="none" stroke="${C.cream}" stroke-width="9" stroke-linecap="round"/>`;
    S.ringMark = rm;
    el('div', '', { ...letter(C.yellow, 190, C.magenta), textTransform: 'none', letterSpacing: '0.01em' }, S.mark, 'Plutto');
    S.eLine = [line(S.endL, 'Apni bhasha mein', 556, letter(C.cream, 124, C.cobalt)), line(S.endL, 'poochho.', 700, letter(C.yellow, 176, C.magenta))];
    S.cta = el('div', 'abs', { left: '50%', top: '966px', fontFamily: 'Anton', fontSize: '96px', lineHeight: 1, color: C.ink, background: C.yellow, border: `8px solid ${C.ink}`, borderRadius: '22px',
      boxShadow: `12px 14px 0 ${C.magenta}, 18px 22px 0 ${C.ink}`, padding: '20px 60px 26px', whiteSpace: 'nowrap', letterSpacing: '0.02em', opacity: 0 }, S.endL, 'plutto.space');
    S.free = line(S.endL, 'Free to start · Android · Web', 1160, { fontFamily: 'Anton', fontSize: '46px', letterSpacing: '0.08em', color: C.cream, textTransform: 'uppercase' });
    // The rear panel: nazar eyes either side of "Pooch ke dekho!"
    S.panel = el('div', 'abs', { left: '72px', top: '1290px', width: '936px', height: '250px', opacity: 0 }, S.endL);
    S.panelSvg = svg(S.panel, { left: 0, top: 0, width: '936px', height: '250px' }, '0 0 936 250');
    S.panelBase = `<rect x="12" y="14" width="920" height="232" rx="28" fill="${C.ink}"/><rect x="4" y="4" width="920" height="232" rx="28" fill="${C.emerald}" stroke="${C.ink}" stroke-width="8"/>
      <rect x="24" y="24" width="880" height="192" rx="18" fill="none" stroke="${C.yellow}" stroke-width="5" stroke-dasharray="18 10"/>`;
    el('div', 'abs', { left: 0, width: '928px', top: '84px', textAlign: 'center', ...letter(C.yellow, 76, C.magenta, 5), WebkitTextStroke: `10px ${C.ink}` }, S.panel, 'Pooch ke dekho!');
  },

  async frame(t) {
    // ── the phone ──
    const P = pose(t), live = t < T.end;
    if (live) await S.d.at(S.clock(t));
    S.d.pose(t, { x: P.x, y: P.y, s: P.s, rz: P.rz, o: live ? 1 : 0 });

    // ── the garland: swings a little; the ladis sway ──
    {
      const sw = Math.sin(t * 1.3) * 4;
      let g = '';
      const sag = (x) => 64 + 46 * (1 - Math.pow((x - 540) / 560, 2)) + sw * Math.sin((x / 1080) * Math.PI);
      let path = 'M -20 ' + sag(-20).toFixed(1);
      for (let x = 0; x <= 1100; x += 20) path += ` L ${x} ${sag(x).toFixed(1)}`;
      g += `<path d="${path}" fill="none" stroke="${C.ink}" stroke-width="5"/>`;
      for (let x = 10, i = 0; x <= 1080; x += 34, i++) {
        if (i % 3 === 1) g += leaf(x - 2, sag(x) + 6, 30 + (i % 2) * 120);
        g += marigold(x, sag(x), 18, i % 2 === 1);
      }
      [[54, 0.0], [1026, 1.3]].forEach(([x0, ph]) => {
        const sway = Math.sin(t * 1.5 + ph) * 3;
        const top = sag(x0);
        g += `<path d="M ${x0} ${top} Q ${x0 + sway * 0.5} ${top + 240} ${x0 + sway} ${top + 470}" fill="none" stroke="${C.ink}" stroke-width="4"/>`;
        for (let k = 1; k <= 12; k++) { const q = k / 12; g += marigold(x0 + sway * q * q, top + q * 470, 15, k % 2 === 0); }
        g += tassel(x0 + sway, top + 486);
      });
      S.gar.innerHTML = g;
    }

    // ── HOOK: two painted words, slammed in on the first frames ──
    slam(S.hook[0], t, 0.0, T.send - 0.12, { from: 1.12, rot: -2 });
    slam(S.hook[1], t, 0.32, T.send - 0.06, { from: 1.2, rot: -1 });
    if (t < 0.02) { S.hook[0].style.opacity = 1; S.hook[0].style.transform = 'scale(1.12) rotate(-2deg)'; }
    // "Hinglish mein poocha…" — brushed on, then carried up as the phone zooms.
    if (t < T.send) wipeOn(S.sub, t, T.sub);
    else {
      const k = ease.inOutCubic(prog(t, T.send, T.send + 0.7));
      S.sub.style.opacity = t > T.words[0] - 0.4 ? 1 - prog(t, T.words[0] - 0.4, T.words[0] - 0.2) : 1;
      S.sub.style.clipPath = 'none';
      S.sub.style.transform = `translateY(${lerp(0, 196 - 612, k)}px)`;
    }
    wipeOn(S.jawab, t, T.reply + 0.1, T.words[0] - 0.3);
    // The wait: a pair of painted nazar eyes, watching the phone think.
    {
      const a = T.send + 0.35, z = T.reply;
      if (t < a || t > z + 0.2) S.gapEyes.style.opacity = 0;
      else {
        const p = prog(t, a, a + 0.35), q = prog(t, z, z + 0.2);
        const b = (t - a) % 0.9, lid = Math.min(ease.outBack(p), b > 0.75 ? Math.max(0.1, Math.abs(b - 0.82) / 0.07) : 1) * (1 - q);
        const look = Math.sin((t - a) * 5) * 16;
        S.gapEyes.style.opacity = 1;
        S.gapEyes.innerHTML = `<g transform="translate(350,440) scale(1.15)">${eye(0, 0, false, Math.max(0.05, lid), look)}</g><g transform="translate(730,440) scale(1.15)">${eye(0, 0, true, Math.max(0.05, lid), look)}</g>`;
      }
    }

    // ── the payoff: one word per stream, slammed ──
    S.pay.forEach((e, k) => slam(e, t, T.words[k], T.room - 0.2 + k * 0.03, { from: 1.12 }));
    const draw = (e, a, b) => { const len = e.getTotalLength(); e.style.strokeDasharray = len; e.style.strokeDashoffset = len * (1 - ease.outCubic(prog(t, a, b))); e.style.opacity = t < T.tap + 0.1 ? 1 : 0; };
    draw(S.marks[0], T.words[0], T.words[2] + 0.1);
    draw(S.marks[1], T.words[2] + 0.1, T.words[3] + 0.25);

    // ── the chip, the room ──
    const chip = onStage(pose(T.tap), 144, 488);
    const btn = onStage(pose(T.remind), 120, 288);
    S.ring(t, t < T.remind - 0.2 ? T.tap : T.remind, t < T.remind - 0.2 ? chip[0] : btn[0], t < T.remind - 0.2 ? chip[1] : btn[1]);
    S.ring2(t, t < T.remind - 0.2 ? T.tap + 0.1 : T.remind + 0.1, t < T.remind - 0.2 ? chip[0] : btn[0], t < T.remind - 0.2 ? chip[1] : btn[1]);
    slam(S.dates, t, T.room, T.remind - 0.12, { rot: -1.5 });
    wipeOn(S.kundli, t, T.room + 0.35, T.remind - 0.08);

    // ── "Remind me" → "Reminder set": Yaad bhi dilayega. ──
    slam(S.yaad, t, T.remind + 0.1, T.wipe - 0.05, { rot: -1.5 });
    slam(S.dilayega, t, T.remind + 0.3, T.wipe, { from: 1.2, rot: -1 });

    // ── the honesty tag, whenever the reply (or the room it opened) is on screen ──
    const hon = t >= T.reply && t < T.end;
    S.honest(hon ? Math.min(1, prog(t, T.reply, T.reply + 0.15) * 1) : 0);
    // In the room it drops to the floor of the safe area, clear of the next row's button.
    S.honestEl.style.transform = `translateX(-50%) translateY(${28 * ease.inOutCubic(prog(t, T.tap + 0.1, T.room + 0.5))}px) rotate(-1.5deg)`;

    // ── the wipe: rings burst from the Remind button ──
    if (t >= T.wipe && t < T.end + 0.05) {
      S.wipe.style.display = 'block';
      const [x, y] = onStage(pose(t), 120, 288);
      S.wipeC.forEach((c, i) => {
        const r = lerp(0, 2300, ease.inCubic(prog(t, T.wipe + i * 0.06, T.end - 0.02 - (4 - i) * 0.0)));
        c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', Math.max(0, r));
      });
    } else S.wipe.style.display = 'none';

    // ── the end card ──
    const te = t - T.end;
    S.endL.style.opacity = te >= 0 ? 1 : 0;
    if (te >= 0) {
      const pop = (e, a, extra = '') => { const p = prog(te, a, a + 0.42), s = p < 0.35 ? lerp(1.18, 1, ease.inCubic(p / 0.35)) : 1 + Math.sin(((p - 0.35) / 0.65) * Math.PI * 2) * 0.03 * (1 - (p - 0.35) / 0.65); e.style.opacity = te >= a ? 1 : 0; e.style.transform = `${extra} scale(${s})`; };
      pop(S.mark, 0.0);
      S.ringMark.style.transform = `rotate(${te * 30}deg)`;
      pop(S.eLine[0], 0.25, 'rotate(-1.5deg)');
      pop(S.eLine[1], 0.45, 'rotate(-1.5deg)');
      pop(S.cta, 0.75, 'translateX(-50%) rotate(-1deg)');
      S.free.style.opacity = ease.outCubic(prog(te, 0.95, 1.25));
      S.free.style.transform = `translateY(${(1 - ease.outExpo(prog(te, 0.95, 1.35))) * 24}px)`;
      pop(S.panel, 1.15, 'rotate(-1deg)');
      // The nazar eyes either side of the words: they blink.
      const b = (te + 0.4) % 2.6, lid = b > 2.4 ? Math.max(0.1, Math.abs(b - 2.5) / 0.1) : 1;
      S.panelSvg.innerHTML = S.panelBase + `<g transform="translate(118,128) scale(0.6)">${eye(0, 0, false, lid)}</g><g transform="translate(818,128) scale(0.6)">${eye(0, 0, true, lid)}</g>`;
    }
  },
};
