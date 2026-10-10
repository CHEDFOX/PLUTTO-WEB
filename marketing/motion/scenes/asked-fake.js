/**
 * ASKED PLUTTO · FAKE — "Is astrology fake?", asked of the astrology app itself.
 *
 * Plutto Pop: full-voltage colour fields that cut on the beat (blue → ink →
 * yellow → pink → blue → yellow → violet), Inter Black slabs that slam in with
 * an elastic overshoot, the narrator's asides in Caveat on stickers, one ink
 * outline and one hard shadow everywhere (LINE, SHADOW — in stage px, also on
 * the phone, so a zoom never fattens a line), a slow sunburst and halftone
 * behind, sparkles only where a word lands.
 *
 * The phone is a flat cartoon phone (cream body, ink outline, hard offset
 * shadow) holding the real recording (asked/ask-fake). Only the reply is
 * scripted, so the honesty tag rides the top rail whenever the reply — or the
 * room it opened — is on screen.
 *
 * Footage (s): type 1.18 · send 4.21 · reply fades in 6.70, line one done 6.80
 *   · "A chart cast to the minute you / were born can," streams 7.17–7.60
 *   · chips 8.40 · tap "Show me the score" 10.73 · Receipts 11.03
 *   · tap "It happened" 15.70 → "1 of 1 came true" 15.77.
 */
import { el, prog, ease, lerp, clamp, rng, POP, spring, popBg, sticker, sparkle, marquee, popScore, footage } from '../lib.js';
import { events, remap, honest, tapRing, pulse } from '../asked.js';

const C = POP;
const NS = 'http://www.w3.org/2000/svg';
const LINE = 6, SHADOW = 12, STROKE = 8;     // ink outline, hard shadow, text stroke (half of it shows) — stage px
const K = 520 / 590;                          // recording px → screen px
const SW = 520, SH = 1128, BEZ = 24, BW = SW + 2 * BEZ, BH = SH + 2 * BEZ, RAD = 84;

// ── the clock ───────────────────────────────────────────────────────────────
// Footage moments (asked/ask-fake.events.json, and the reply's stream read off its frames).
const F = { start: 1.05, send: 4.21, reply: 6.70, line1: 6.805, pay: 7.12, payEnd: 7.65, chips: 8.40, tap: 10.73, open: 11.10, hap: 15.70, flip: 15.767 };
const RATE = { type: 1.25, wait: 1.8, slow: 0.4 };
const T = {};
T.send = (F.send - F.start) / RATE.type;                 // 2.53 — typing at 1.25×
T.reply = T.send + (F.reply - F.send) / RATE.wait;       // 3.91 — the orbit at 1.8×
T.freeze = T.reply + (F.line1 - F.reply);                // 4.02 — held on "Most of what you've seen is."
T.go = T.freeze + 1.4;
T.pay = T.go + (F.pay - F.line1);                        // 5.74 — the payoff, in slow motion
T.payEnd = T.pay + (F.payEnd - F.pay) / RATE.slow;
T.chips = T.payEnd + (F.chips - F.payEnd);
T.tap = 9.25;                                            // "Show me the score"
T.room = T.tap + (11.03 - F.tap);                        // Receipts opens (real time)
T.open = T.tap + (F.open - F.tap);
T.hap = 11.95;                                           // "It happened"
T.flip = T.hap + (F.flip - F.hap);                       // 1 of 1 came true
T.end = 14.85;
const DUR = 18.85;
const CLOCK = [[0, F.start, RATE.type], [T.send, F.send, RATE.wait], [T.reply, F.reply, 1], [T.freeze, F.line1, 0], [T.go, F.line1, 1],
  [T.pay, F.pay, RATE.slow], [T.payEnd, F.payEnd, 1], [T.chips, F.chips, (F.tap - F.chips) / (T.tap - T.chips)], [T.tap, F.tap, 1],
  [T.open, F.open, (F.hap - F.open) / (T.hap - T.open)], [T.hap, F.hap, 1]];
/** Footage time → the first film time that shows it. */
const CLK = remap(CLOCK);
const filmAt = (ft) => { let a = 0, b = DUR; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (CLK(m) >= ft) b = m; else a = m; } return b; };

// The payoff streams in two-word chunks; each word lands when its pixels do.
// [word, footage time it appears, row]
const PAY = [['A', 7.167, 0], ['chart', 7.267, 0], ['cast', 7.267, 0], ['to', 7.367, 1], ['the', 7.367, 1], ['minute', 7.433, 1], ['you', 7.433, 2], ['were', 7.533, 2], ['born', 7.533, 2]];
const CAN_AT = 7.600;
// Underlines under the payoff in the app, chunk by chunk: [footage time, x reached] on lines 3 and 4 (recording px).
const U3 = [[7.167, 157], [7.267, 269], [7.367, 335], [7.433, 460]];
const U4 = [[7.533, 145], [7.600, 191]];

// ── where the phone sits (centre offset from the stage centre; top = its top edge) ──
const top = (y, s) => y + (BH / 2) * s - 960;
const HOOK = { x: 0, y: top(744, 0.75), s: 0.75, rz: -3 };
const READ = { x: 0, y: top(800, 1.6), s: 1.6, rz: 0 };
const ROOM = { x: 0, y: top(566, 1.35), s: 1.35, rz: 0 };
const SCORE = { x: 0, y: top(566, 1.6), s: 1.6, rz: 0 };
const mix = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), s: lerp(a.s, b.s, k), rz: lerp(a.rz, b.rz, k) });

function pose(t) {
  let p;
  if (t < T.send) {
    p = { ...HOOK, y: HOOK.y + (1 - spring(prog(t, 0.02, 0.8))) * 1100 };
    p.y += Math.sin(t * 2.4) * 5;
  } else if (t < T.room) {
    p = mix(HOOK, READ, ease.outExpo(prog(t, T.send, T.send + 0.75)));
    p.s *= 1 - 0.025 * pulse(t, T.tap, 0.3);
  } else if (t < T.flip) {
    p = mix(READ, ROOM, ease.outExpo(prog(t, T.room, T.room + 0.7)));
    p.s *= 1 - 0.025 * pulse(t, T.hap, 0.3);
  } else {
    p = mix(ROOM, SCORE, ease.outExpo(prog(t, T.flip + 0.04, T.flip + 0.8)));
  }
  if (t >= T.send) p.y += Math.sin((t - T.send) * 2) * 4;
  return p;
}
/** A point on the recording (590×1280 px) → the stage, for pose P. */
function onStage(P, rx, ry) {
  const lx = (BEZ + rx * K - BW / 2) * P.s, ly = (BEZ + ry * K - BH / 2) * P.s, a = (P.rz * Math.PI) / 180;
  return [540 + P.x + lx * Math.cos(a) - ly * Math.sin(a), 960 + P.y + lx * Math.sin(a) + ly * Math.cos(a)];
}

let S = {};

// ── type and stickers ───────────────────────────────────────────────────────
// Tracking opens a little as the size drops, so the outlines of small slabs never fuse letter to letter.
const slabCss = (size, color) => ({ position: 'absolute', left: 0, top: 0, fontFamily: 'Inter', fontWeight: 900, fontSize: `${size}px`, lineHeight: 1, letterSpacing: size >= 140 ? '-0.02em' : '0.03em',
  textTransform: 'uppercase', color, whiteSpace: 'nowrap', WebkitTextStroke: `${STROKE}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`, opacity: 0 });
/** Shrink a line until it fits the column (the type never clips). */
function fit(e, max = 920) { const w = e.offsetWidth; if (w > max) e.style.fontSize = `${(parseFloat(e.style.fontSize) * max) / w}px`; return e; }
/** A slab line, optionally with outlined echoes stepping out behind it. */
function slab(parent, text, { size, color = C.white, echoes = 0, echo = C.white, max = 920 }) {
  const box = el('div', 'abs', { left: 0, top: 0, opacity: 0, whiteSpace: 'nowrap' }, parent);
  const ech = [];
  for (let i = echoes; i >= 1; i--) {
    ech.push(el('div', '', { ...slabCss(size, 'transparent'), WebkitTextStroke: `3px ${echo}`, textShadow: 'none', opacity: 0.6 - i * 0.14 }, box, text));
  }
  const main = el('div', '', { ...slabCss(size, color), position: 'relative', opacity: 1 }, box, text);
  fit(main, max);
  ech.forEach((e) => { e.style.fontSize = main.style.fontSize; });
  return { box, main, ech: ech.reverse() };
}
/** A narrator's aside: Caveat on a sticker. */
const aside = (parent, text, bg, size = 80) => sticker(parent, text, { bg, size, pad: '6px 34px 12px', r: 22, shadow: SHADOW,
  style: { left: 0, top: 0, fontFamily: 'Hand', fontWeight: 700, letterSpacing: '0', lineHeight: 1.1, opacity: 0 } });
/** Centre-anchored placement: (x, y) is the element's centre on the stage. */
function put(e, x, y, s = 1, r = 0, o = 1) {
  e.style.opacity = o;
  e.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${r}deg) scale(${s})`;
}
/**
 * One element's life: in at a (slam: falls in from big; pop: grows from nothing,
 * both with the elastic overshoot), out at z (it shrinks away where it stood).
 */
function life(e, t, a, z, { x, y, r = 0, kind = 'slam', from = 1.9 }) {
  if (t < a || t > z + 0.18) { e.style.opacity = 0; return 0; }
  const p = prog(t, a, a + (kind === 'slam' ? 0.5 : 0.45));
  let s = kind === 'slam' ? lerp(from, 1, spring(p)) : spring(p);
  let rr = r + (1 - spring(p)) * (kind === 'slam' ? 0 : -10), yy = y, o = 1;
  if (t > z) { const q = ease.inCubic(prog(t, z, z + 0.18)); s *= 1 - 0.85 * q; o = 1 - q; }   // out: shrinks away where it stood
  put(e, x, yy, s, rr, o);
  return 1;
}

function svg(parent, style, vb) {
  const s = document.createElementNS(NS, 'svg');
  if (vb) s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', overflow: 'visible', ...style });
  parent.appendChild(s);
  return s;
}

/** The cartoon phone: hard shadow, side keys, cream body, the real recording, an island. */
function phone(parent) {
  const dev = el('div', 'abs', { left: `${540 - BW / 2}px`, top: `${960 - BH / 2}px`, width: `${BW}px`, height: `${BH}px`, transformOrigin: '50% 50%' }, parent);
  const shadow = el('div', 'abs', { left: 0, top: 0, width: `${BW}px`, height: `${BH}px`, borderRadius: `${RAD}px`, background: C.ink }, dev);
  const keys = [[BW - 5, 236, 100], [BW - 5, 362, 64], [-9, 300, 84]].map(([x, y, h]) => el('div', 'abs', { left: `${x}px`, top: `${y}px`, width: '14px', height: `${h}px`, borderRadius: '7px', background: C.cream }, dev));
  const face = el('div', 'abs', { left: 0, top: 0, width: `${BW}px`, height: `${BH}px`, borderRadius: `${RAD}px`, background: C.cream }, dev);
  const screen = el('div', 'abs', { left: `${BEZ}px`, top: `${BEZ}px`, width: `${SW}px`, height: `${SH}px`, borderRadius: `${RAD - BEZ}px`, overflow: 'hidden', background: '#000' }, face);
  const f = footage(screen, 'ask-fake', { w: 590, h: 1280, style: { left: 0, top: 0 } });
  f.el.style.width = `${SW}px`; f.el.style.height = `${SH}px`;
  el('div', 'abs', { left: `${SW / 2 - 54}px`, top: '12px', width: '108px', height: '30px', borderRadius: '15px', background: C.ink }, screen);
  const marks = svg(screen, { left: 0, top: 0, width: `${SW}px`, height: `${SH}px` }, `0 0 ${SW} ${SH}`);
  const rim = el('div', 'abs', { left: `${BEZ}px`, top: `${BEZ}px`, width: `${SW}px`, height: `${SH}px`, borderRadius: `${RAD - BEZ}px` }, face);
  return {
    dev, at: f.at, marks,
    pose(P) {
      const L = LINE / P.s, D = SHADOW / P.s;
      dev.style.transform = `translate(${P.x}px, ${P.y}px) rotate(${P.rz}deg) scale(${P.s})`;
      shadow.style.transform = `translate(${D}px, ${D}px)`;
      shadow.style.boxShadow = `0 0 0 ${L}px ${C.ink}`;
      face.style.boxShadow = `0 0 0 ${L}px ${C.ink}`;
      rim.style.boxShadow = `0 0 0 ${L}px ${C.ink}`;
      keys.forEach((k) => { k.style.boxShadow = `0 0 0 ${L}px ${C.ink}`; });
    },
  };
}

export default {
  duration: DUR,
  poster: 1.75,
  score() {
    const hits = [0, 0.14, 0.58, T.freeze + 0.08, T.freeze + 0.6, ...[0, 1, 3, 5, 7].map((k) => filmAt(PAY[k][1] + 0.004)),
      T.tap, T.room + 0.06, T.room + 0.24, T.hap, T.flip + 0.14, T.flip + 0.6];
    const can = filmAt(CAN_AT + 0.004);
    const c = popScore({ duration: DUR, end: T.end, hits, cuts: [T.send, T.reply, can, T.room, T.flip], tick: [T.send + 0.05, T.reply - 0.05] });
    // Typing: a key per character while the question goes in.
    const R = rng(11);
    for (let t = 0.12; t < T.send - 0.08; t += 0.06 + R() * 0.06) c.push({ i: 'key', t, g: 0.14 });
    c.push({ i: 'blip', t: T.send, n: 84, g: 0.22 });
    // The payoff: a rising mallet per word, the last one with a crash.
    [0, 1, 3, 5, 7].forEach((k, j) => c.push({ i: 'mallet', t: filmAt(PAY[k][1] + 0.004), n: [74, 76, 79, 81, 83][j], g: 0.22, d: 0.4 }));
    c.push({ i: 'mallet', t: can, n: 86, g: 0.3, d: 0.8 }, { i: 'crash', t: can, g: 0.28 });
    // The taps.
    c.push({ i: 'blip', t: T.tap, n: 86, g: 0.26 }, { i: 'blip', t: T.hap, n: 88, g: 0.26 });
    c.push({ i: 'pluck', t: T.flip + 0.14, n: 86, g: 0.18, dur: 1.4 });
    return c;
  },

  async setup(stage) {
    await Promise.all(['900 100px Inter', '700 80px Hand', '500 34px Mono'].map((f) => document.fonts.load(f)));
    const ev = await events('ask-fake');
    if (Math.abs(ev.send_0 - F.send) > 0.02 || Math.abs(ev.tap_chip - F.tap) > 0.02 || Math.abs(ev.tap_happened - F.hap) > 0.02) console.warn('asked-fake: the recording moved; re-read its events');
    S.clock = CLK;

    S.bg = popBg(stage);
    S.cam = el('div', 'layer', { zIndex: 10, transformOrigin: '50% 40%' }, stage);
    S.d = phone(S.cam);

    // Marks inside the app, screen px: the first line underlined, the payoff underlined as it streams, the score boxed.
    const u = (y) => `<path d="M 0 ${(y * K).toFixed(1)} H 1" fill="none" stroke="${C.yellow}" stroke-linecap="round"/>`;
    S.d.marks.innerHTML = u(206) + u(287) + u(327)
      + `<rect x="${24 * K}" y="${212 * K}" width="${300 * K}" height="${126 * K}" rx="${22 * K}" fill="none" stroke="${C.yellow}" stroke-linecap="round" pathLength="1"/>`;
    [S.u1, S.u3, S.u4] = [...S.d.marks.querySelectorAll('path')];
    S.box = S.d.marks.querySelector('rect');

    const ov = el('div', 'layer', { zIndex: 20 }, S.cam);
    S.ov = ov;
    // HOOK
    S.is = slab(ov, 'Is astrology', { size: 116 });
    S.fake = slab(ov, 'fake?', { size: 260, color: C.yellow, echoes: 2, echo: C.white });
    S.asked = aside(ov, 'I asked the astrology app.', C.white, 72);
    // THE WAIT: the Oracle's typing bubble.
    S.wait = el('div', 'abs', { left: 0, top: 0, width: '375px', height: '268px', opacity: 0 }, ov);
    const bub = `M 75 0 H 225 A 75 75 0 0 1 225 150 H 138 L 64 212 L 86 150 H 75 A 75 75 0 0 1 75 0 Z`;
    svg(S.wait, { left: 0, top: 0, width: '375px', height: '268px' }, '0 0 300 214').innerHTML =   // drawn at 1.25×: line and shadow divided back
      `<path d="${bub}" transform="translate(${SHADOW / 1.25},${SHADOW / 1.25})" fill="${C.ink}"/><path d="${bub}" fill="${C.white}" stroke="${C.ink}" stroke-width="${LINE / 1.25}" stroke-linejoin="round"/>`
      + [96, 150, 204].map((x) => `<circle class="dot" cx="${x}" cy="75" r="17" fill="${C.ink}"/>`).join('');
    S.dots = [...S.wait.querySelectorAll('.dot')];
    // THE REPLY
    S.agreed = slab(ov, 'It agreed.', { size: 168 });
    S.mostly = aside(ov, '(mostly)', C.pink, 84);
    S.rows = [0, 1, 2].map(() => el('div', 'abs', { left: 0, top: 0, whiteSpace: 'nowrap', textAlign: 'center' }, ov));
    S.words = PAY.map(([w, , row], i) => {
      const e = el('span', '', { ...slabCss(96, C.white), position: 'relative', display: 'inline-block', transformOrigin: '50% 75%', marginRight: i < PAY.length - 1 && PAY[i + 1][2] === row ? '0.24em' : 0 }, S.rows[row], w);
      return e;
    });
    // One size for all three rows: the widest decides.
    const wide = Math.max(...S.rows.map((r) => r.offsetWidth));
    if (wide > 920) S.words.forEach((w) => { w.style.fontSize = `${(96 * 920) / wide}px`; });
    S.can = slab(ov, 'can.', { size: 236, color: C.yellow, echoes: 2, echo: C.white });
    // THE ROOM
    S.then = slab(ov, 'Then it showed me', { size: 86 });
    S.its = slab(ov, 'its score.', { size: 156, color: C.yellow });
    S.itself = slab(ov, 'It marks itself.', { size: 104 });
    S.public = aside(ov, 'in public.', C.pink, 84);

    // Sparkles, only where a word lands.
    S.sparks = [
      { e: sparkle(ov, { size: 76, color: C.yellow }), x: 120, y: 360, a: 0.3, z: T.send },
      { e: sparkle(ov, { size: 52, color: C.white }), x: 960, y: 560, a: 0.42, z: T.send },
      { e: sparkle(ov, { size: 70, color: C.white }), x: 252, y: 616, a: 0, z: T.tap, can: true },
      { e: sparkle(ov, { size: 50, color: C.cyan }), x: 846, y: 690, a: 0.1, z: T.tap, can: true },
      { e: sparkle(ov, { size: 60, color: C.white }), x: 930, y: 404, a: T.flip + 0.75, z: T.end },
    ];
    S.sparks.forEach((s) => { s.e.style.left = '0'; s.e.style.top = '0'; s.e.style.opacity = 0; });

    // The top rail: the series, then the honesty tag. Same chip, same place.
    const rail = { fontFamily: 'Mono', fontWeight: 500, fontSize: '34px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink, background: C.cream,
      padding: '8px 26px', borderRadius: '999px', border: `${LINE}px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}`, whiteSpace: 'nowrap' };
    S.series = el('div', 'abs', { ...rail, left: 0, top: 0, zIndex: 35, opacity: 0 }, stage, 'Asked Plutto');
    S.honest = honest(stage, { color: C.ink, bg: C.cream, style: { ...rail, top: '0px', bottom: 'auto', left: '0px' } });
    S.honestEl = stage.lastElementChild;
    S.ring = tapRing(stage, { color: C.yellow, size: 150 });

    // THE END CARD — violet, behind an iris that opens from the score.
    const end = el('div', 'layer', { zIndex: 39, background: C.violet, overflow: 'hidden', opacity: 0 }, stage);
    S.endL = end;
    S.iris = el('div', 'abs', { left: 0, top: 0, borderRadius: '50%', border: `${LINE}px solid ${C.ink}`, boxSizing: 'border-box', zIndex: 40, opacity: 0, pointerEvents: 'none' }, stage);
    S.endBurst = el('div', 'abs', { left: '-760px', top: '-900px', width: '2600px', height: '2600px', borderRadius: '50%', opacity: 0.14 }, end);
    S.endDots = el('div', 'layer', { opacity: 0.16, backgroundImage: `radial-gradient(${C.ink} 26%, transparent 28%)`, backgroundSize: '26px 26px',
      WebkitMaskImage: 'linear-gradient(160deg, transparent 45%, #000 95%)', maskImage: 'linear-gradient(160deg, transparent 45%, #000 95%)' }, end);
    S.tape = marquee(end, ['Vedic', 'Western', 'Chinese', 'Tarot', 'Numerology', 'I Ching', 'Runes'], { y: 1430, rot: -6, bg: C.white, size: 52 });
    S.mark = el('div', 'abs', { left: 0, top: 0, display: 'flex', alignItems: 'center', gap: '30px', whiteSpace: 'nowrap', opacity: 0 }, end);
    S.ringMark = el('div', '', { width: '128px', height: '128px', borderRadius: '50%', background: 'linear-gradient(135deg, #fff, rgba(255,255,255,0.45))', position: 'relative',
      border: `${LINE}px solid ${C.ink}`, boxShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`, boxSizing: 'border-box' }, S.mark);
    el('div', '', { position: 'absolute', inset: '24px', borderRadius: '50%', background: C.ink }, S.ringMark);
    el('div', '', { ...slabCss(150, C.white), position: 'relative', opacity: 1, textTransform: 'none', letterSpacing: '-0.045em' }, S.mark, 'Plutto');
    S.l1 = el('div', 'abs', { ...slabCss(78, C.white), textTransform: 'none', letterSpacing: '-0.03em', WebkitTextStroke: `8px ${C.ink}`, textShadow: `8px 8px 0 ${C.ink}` }, end, 'The one that');
    S.l2 = slab(end, 'keeps', { size: 176, color: C.yellow });
    S.l3 = slab(end, 'receipts.', { size: 176, color: C.yellow });
    S.cta = sticker(end, 'plutto.space', { bg: C.yellow, size: 64, pad: '22px 58px', r: 999, shadow: SHADOW, style: { left: 0, top: 0, opacity: 0 } });
    S.sub = el('div', 'abs', { left: 0, top: 0, fontFamily: 'Inter', fontWeight: 800, fontSize: '38px', color: C.white, letterSpacing: '0.01em', whiteSpace: 'nowrap', opacity: 0 }, end, 'Free to start · Android · Web');
  },

  async frame(t) {
    // ── the field: one colour per beat, cut on the beat ──
    const can = filmAt(CAN_AT + 0.004), wordA = filmAt(PAY[0][1] + 0.004);
    const field = t < T.send ? C.blue : t < T.reply ? C.ink : t < wordA ? C.yellow : t < T.room ? C.pink : t < T.flip ? C.blue : C.yellow;
    const dark = field === C.ink;
    const cy = t < T.send ? 24 : t < T.room ? 26 : 20;
    S.bg(t, field, { rays: dark ? C.violet : '#fff', dotColor: dark ? C.violet : C.ink, cx: 50, cy, spin: 9 });

    // A punch on every slam.
    const punch = [0.12, T.send, T.reply, T.freeze + 0.1, wordA, can, T.room, T.flip].reduce((m, a) => Math.max(m, pulse(t, a, 0.28)), 0);
    S.cam.style.transform = `scale(${1 + punch * 0.022})`;

    // ── the phone ──
    const P = pose(t);
    if (t < T.end + 0.6) await S.d.at(S.clock(t));
    S.d.pose(P);
    S.d.dev.style.opacity = t < T.end + 0.6 ? 1 : 0;
    // Marks in the app (stroke in screen px, so 8 stage px at any zoom).
    const sw = 8 / P.s, under = (e, x0, x1, on, until = T.tap) => { e.setAttribute('d', `M ${(x0 * K).toFixed(1)} ${e.getAttribute('d').split(' ')[2]} H ${(lerp(x0, x1, on) * K).toFixed(1)}`); e.setAttribute('stroke-width', sw); e.style.opacity = on > 0.001 ? 1 - ease.inCubic(prog(t, until - 0.15, until)) : 0; };
    under(S.u1, 38, 348, ease.outCubic(prog(t, T.freeze + 0.2, T.freeze + 0.55)), wordA);
    const chunks = (list, x0) => { let x = x0; let prev = x0; for (const [ft, xe] of list) { const a = filmAt(ft + 0.004); x = lerp(prev, xe, ease.outCubic(prog(t, a, a + 0.12))); if (t < a) break; prev = xe; } return x; };
    const x3 = chunks(U3, 145), x4 = chunks(U4, 37);
    under(S.u3, 145, x3, x3 > 146 ? 1 : 0);
    under(S.u4, 37, x4, x4 > 38 ? 1 : 0);
    S.box.setAttribute('stroke-width', sw);
    S.box.style.strokeDasharray = '1 1';
    S.box.style.strokeDashoffset = 1 - ease.inOutCubic(prog(t, T.flip + 0.35, T.flip + 0.85));
    S.box.style.opacity = t > T.flip + 0.35 ? 1 : 0;

    // ── HOOK ──
    life(S.is.box, t, -0.12, T.send, { x: 540, y: 296 });
    life(S.fake.box, t, 0.1, T.send + 0.03, { x: 540, y: 464, r: -2 });
    S.fake.ech.forEach((e, k) => { const q = ease.outCubic(prog(t, 0.3, 0.75)) * (k + 1) * 13; e.style.transform = `translate(${q}px, ${q}px)`; });
    life(S.asked, t, 0.58, T.send + 0.06, { x: 548, y: 648, r: -3, kind: 'pop' });
    // The rail: the series name, then the honesty tag from the moment the reply exists.
    life(S.series, t, 0.3, T.send, { x: 540, y: 187, kind: 'pop' });
    const hon = t >= T.reply && t < T.end + 0.6;   // until the iris has covered the app
    S.honest(hon ? 1 : 0);
    if (hon) put(S.honestEl, 540, 187, spring(prog(t, T.reply, T.reply + 0.45)), 0);

    // ── THE WAIT ──
    if (life(S.wait, t, T.send + 0.2, T.reply - 0.16, { x: 540, y: 480, kind: 'pop' })) {
      S.dots.forEach((d, k) => d.setAttribute('cy', 75 - Math.max(0, Math.sin((t - T.send) * 9 - k * 0.9)) * 16));
    }

    // ── THE REPLY: it agreed (mostly) ──
    life(S.agreed.box, t, T.freeze + 0.08, T.go + 0.05, { x: 540, y: 470, r: -2 });
    life(S.mostly, t, T.freeze + 0.6, T.go, { x: 760, y: 628, r: 5, kind: 'pop' });

    // ── THE PAYOFF, word by word as it streams ──
    const out = T.tap - 0.04;
    const rowY = [304, 404, 504];
    S.rows.forEach((r, i) => { const q = ease.inCubic(prog(t, out + i * 0.03, out + 0.18 + i * 0.03)); put(r, 540, rowY[i], 1 - 0.85 * q, 0, t > wordA - 0.01 ? 1 - q : 0); });
    S.words.forEach((w, i) => {
      const prev = i > 0 && PAY[i - 1][1] === PAY[i][1];
      const a = filmAt(PAY[i][1] + 0.004) + (prev ? 0.07 : 0);
      if (t < a) { w.style.opacity = 0; return; }
      const p = prog(t, a, a + 0.42);
      w.style.opacity = 1; w.style.transform = `scale(${lerp(1.7, 1, spring(p))})`;
    });
    life(S.can.box, t, can, out + 0.09, { x: 540, y: 670, r: -3, from: 2.4 });
    S.can.ech.forEach((e, k) => { const q = ease.outCubic(prog(t, can + 0.15, can + 0.6)) * (k + 1) * 13; e.style.transform = `translate(${q}px, ${q}px)`; });

    // ── THE ROOM ──
    life(S.then.box, t, T.room + 0.06, T.hap - 0.12, { x: 540, y: 292 });
    life(S.its.box, t, T.room + 0.24, T.hap - 0.09, { x: 540, y: 420, r: -2 });
    // ── IT MARKS ITSELF. IN PUBLIC. ──
    life(S.itself.box, t, T.flip + 0.14, T.end + 0.6, { x: 540, y: 300, r: -1.5 });
    life(S.public, t, T.flip + 0.6, T.end + 0.6, { x: 704, y: 436, r: 4, kind: 'pop' });

    // Sparkles.
    S.sparks.forEach((s) => {
      const a = s.can ? can + s.a : s.a, z = s.z;
      if (t < a || t > z) { s.e.style.opacity = 0; return; }
      const k = spring(prog(t, a, a + 0.5)) * (0.8 + 0.2 * Math.sin((t - a) * 5));
      s.e.style.opacity = 1;
      s.e.style.transform = `translate(${s.x}px, ${s.y}px) translate(-50%, -50%) rotate(${(t - a) * 50}deg) scale(${k})`;
    });

    // ── the taps ──
    // The ring rides the glass: it stays on the screen point that was tapped, even as the phone moves.
    if (t < T.room) S.ring(t, T.tap, ...onStage(P, 143, 448));                 // the chip's ring ends on the cut
    else S.ring(t, t < T.hap - 0.1 ? -9 : T.hap, ...onStage(P, 124, 770));

    // ── THE END CARD ──
    const te = t - T.end;
    S.endL.style.opacity = te >= 0 ? 1 : 0;
    S.iris.style.opacity = te >= 0 && te < 0.56 ? 1 : 0;   // the iris has an ink edge, like everything else
    if (te >= 0) {
      const [ox, oy] = onStage(pose(T.end), 60, 274);
      const r = ease.inOutCubic(prog(te, 0, 0.55)) * 2300;
      S.endL.style.clipPath = `circle(${r}px at ${ox}px ${oy}px)`;
      Object.assign(S.iris.style, { width: `${2 * r + LINE}px`, height: `${2 * r + LINE}px`, transform: `translate(${ox - r - LINE / 2}px, ${oy - r - LINE / 2}px)` });
      S.endBurst.style.background = `repeating-conic-gradient(from ${t * 9}deg at 50% 50%, #fff 0deg 7deg, transparent 7deg 18deg)`;
      S.tape(t, ease.outCubic(prog(te, 0.9, 1.2)));
      put(S.mark, 540, 430, spring(prog(te, 0.2, 0.95)), (1 - spring(prog(te, 0.2, 0.95))) * -8, 1);
      S.ringMark.style.transform = `rotate(${te * 30}deg)`;
      life(S.l1, t, T.end + 0.42, 99, { x: 540, y: 646, kind: 'pop' });
      life(S.l2.box, t, T.end + 0.55, 99, { x: 540, y: 794, r: -3 });
      life(S.l3.box, t, T.end + 0.7, 99, { x: 540, y: 952, r: -3 });
      life(S.cta, t, T.end + 0.95, 99, { x: 540, y: 1156, r: -2, kind: 'pop' });
      put(S.sub, 540, 1288 + (1 - ease.outExpo(prog(te, 1.15, 1.6))) * 30, 1, 0, ease.outCubic(prog(te, 1.15, 1.45)));
    }
  },
};
