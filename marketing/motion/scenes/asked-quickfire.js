/**
 * ASKED · QUICKFIRE — "3 questions I was scared to ask."
 *
 * A printed comic page come alive. Newsprint cream, ink panel borders and
 * cream gutters, Ben-Day dots in cyan / magenta / yellow, caption boxes,
 * speech balloons and starbursts. The camera travels across one page: a tier
 * of panels for each question (it pulls back as it travels, so the page
 * shows), a close-up panel for the answer that lands, and a last panel for
 * the end card. The real app sits in an ink phone inside each panel, panned so
 * the newest exchange is centred; the panel border crops it, as a comic would.
 *
 * One ink weight (LINE) and one hard shadow (SHADOW) everywhere, in page px;
 * the phones counter-scale theirs so a zoom never fattens a line.
 *
 * The footage is a real recording (asked/ask-quickfire); only the replies are
 * scripted, so the honesty tag rides along whenever a reply is on screen.
 */
import { el, prog, ease, lerp, rng, spring, popScore } from '../lib.js';
import { events, remap, device, honest } from '../asked.js';

const C = { paper: '#F4ECD8', white: '#FFFDF6', ink: '#141218', cyan: '#00A0DC', magenta: '#E5177E', yellow: '#FFD31A' };
const NS = 'http://www.w3.org/2000/svg';
const LINE = 8, SHADOW = 12;
const SW = 590;                         // the phone's screen = the recording, 1:1
const BEZ = Math.round(SW * 0.05);      // 30
const BODY_H = 1280 + BEZ * 2;          // 1340
const PH = 1.366;                       // the phone in a tier panel (body 888 wide)
const CU = 1.75;                        // the phone in the close-up

// Where each tier sits on the page (its top-left), and the page point the camera centres on.
const TIER = [[0, 0], [1160, 0], [0, 2000], [1160, 2000], [580, 4000]];
const cam = (i) => ({ x: TIER[i][0] + 540, y: TIER[i][1] + 960 });
const PANEL = { x: 72, y: 380, w: 936, h: 1160 };      // the phone panel in a tier (tier coords)
const CLOSE = { x: 72, y: 900, w: 936, h: 540 };       // the close-up panel (tier 3)
const CX = -(CLOSE.w / 2 - LINE) + 16 + (SW / 2 + BEZ) * CU;   // the close-up phone's x: its left bezel just inside the panel

// Film time.
const T = {
  send1: 1.47, r1: 2.42, oof: 3.36, go1: 4.85,
  send2: 6.03, r2: 7.02, fair: 7.95, go2: 9.45,
  send3: 10.81, r3: 12.23, go3: 11.98,
  words: [12.55, 12.95, 13.3, 13.8],
  ouch: 14.5, chip: 15.15, go4: 15.95, end: 16.45,
};
const DUR = 20.0;
const TRAVEL = [[T.go1, 0, 1, 0.62], [T.go2, 1, 2, 0.62], [T.go3, 2, 3, 0.5], [T.go4, 3, 4, 0.55]];

let S = {};

// ── helpers ────────────────────────────────────────────────────────────────
function svg(parent, style, vb) {
  const s = document.createElementNS(NS, 'svg');
  if (vb) s.setAttribute('viewBox', vb);
  Object.assign(s.style, { position: 'absolute', overflow: 'visible', ...style });
  parent.appendChild(s);
  return s;
}
/** Ben-Day dots on newsprint: a dot field that fades across the panel. */
const dots = (color, size = 22, angle = 150) => ({
  backgroundColor: C.white,
  backgroundImage: `linear-gradient(${angle}deg, ${C.white} 10%, rgba(255,253,246,0) 75%), radial-gradient(${color} 34%, transparent 36%)`,
  backgroundSize: `100% 100%, ${size}px ${size}px`,
});
function panel(parent, x, y, w, h, bg) {
  return el('div', 'abs', { left: `${x}px`, top: `${y}px`, width: `${w}px`, height: `${h}px`, border: `${LINE}px solid ${C.ink}`, boxSizing: 'border-box', overflow: 'hidden', ...bg }, parent);
}
/** A caption box: flat colour, ink border, hard shadow. */
function caption(parent, html, { x, y, w = null, bg = C.yellow, size = 60, font = 'Inter', weight = 900, color = C.ink, pad = '18px 30px', style = {} }) {
  return el('div', 'abs', { left: `${x}px`, top: `${y}px`, width: w ? `${w}px` : 'auto', background: bg, border: `${LINE}px solid ${C.ink}`, boxShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`,
    fontFamily: font, fontWeight: weight, fontSize: `${size}px`, lineHeight: 1.05, color, padding: pad, boxSizing: 'border-box', whiteSpace: 'nowrap', transformOrigin: '0% 0%', ...style }, parent, html);
}
/** A starburst: jagged spikes, ink outline, hard shadow; the word on top. */
function burst(parent, word, { cx, cy, rx, ry, spikes = 16, seed = 1, fill = C.yellow, text = C.magenta, size = 200, rot = -6 }) {
  const R = rng(seed), pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 + (R() - 0.5) * 0.12, k = i % 2 ? 0.66 + R() * 0.08 : 0.92 + R() * 0.12;
    pts.push(`${(Math.cos(a) * rx * k).toFixed(1)},${(Math.sin(a) * ry * k).toFixed(1)}`);
  }
  const box = el('div', 'abs', { left: `${cx}px`, top: `${cy}px`, width: 0, height: 0, opacity: 0 }, parent);
  const s = svg(box, { left: 0, top: 0, width: '1px', height: '1px' });
  s.innerHTML = `<polygon points="${pts.join(' ')}" transform="translate(${SHADOW},${SHADOW})" fill="${C.ink}"/>
    <polygon points="${pts.join(' ')}" fill="${fill}" stroke="${C.ink}" stroke-width="${LINE}" stroke-linejoin="miter"/>`;
  el('div', 'abs', { left: '-500px', width: '1000px', top: `${-size * 0.56}px`, textAlign: 'center', fontFamily: 'Anton', fontSize: `${size}px`, lineHeight: 1.1, color: text, letterSpacing: '0.01em',
    WebkitTextStroke: `${LINE * 2}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: `${LINE}px ${LINE}px 0 ${C.ink}`, whiteSpace: 'nowrap' }, box, word);
  return { box, rot };
}
/** Pop a burst in at a: overshoot, a small spin; out at z. */
function showBurst(b, t, a, z = 99) {
  if (t < a || t >= z) { b.box.style.opacity = 0; return; }
  const p = prog(t, a, a + 0.42), s = lerp(0.25, 1, spring(p));
  b.box.style.opacity = 1;
  b.box.style.transform = `scale(${s}) rotate(${b.rot + (1 - ease.outCubic(p)) * -14}deg)`;
}
/** A speech balloon: an ellipse and a tail, outlined as one shape (stroke under, fill over). */
function balloon(parent, html, { cx, cy, tail, padX = 0.62, padY = 0.72, font = 'Anton', size = 100, lh = 1.04, fill = C.white, style = {} }) {
  const box = el('div', 'abs', { left: 0, top: 0, opacity: 0 }, parent);
  const back = svg(box, { left: 0, top: 0, width: '1px', height: '1px' });
  const txt = el('div', 'abs', { fontFamily: font, fontSize: `${size}px`, lineHeight: lh, color: C.ink, textAlign: 'center', whiteSpace: 'nowrap', textTransform: 'uppercase', letterSpacing: '0.01em', ...style }, box, html);
  const w = txt.offsetWidth, h = txt.offsetHeight;
  const rx = w * padX + 40, ry = h * padY + 20;
  txt.style.left = `${cx - w / 2}px`; txt.style.top = `${cy - h / 2}px`;
  const [ax, ay] = tail.from, [bx, by] = tail.to, n = tail.w / 2;
  const ang = Math.atan2(by - ay, bx - ax) + Math.PI / 2;
  const tri = `${ax + Math.cos(ang) * n},${ay + Math.sin(ang) * n} ${bx},${by} ${ax - Math.cos(ang) * n},${ay - Math.sin(ang) * n}`;
  const shape = (attrs) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" ${attrs}/><polygon points="${tri}" ${attrs}/>`;
  back.innerHTML = `<g transform="translate(${SHADOW},${SHADOW})">${shape(`fill="${C.ink}" stroke="${C.ink}" stroke-width="${LINE * 2}" stroke-linejoin="miter"`)}</g>
    ${shape(`fill="${C.ink}" stroke="${C.ink}" stroke-width="${LINE * 2}" stroke-linejoin="miter"`)}${shape(`fill="${fill}"`)}`;
  box.style.transformOrigin = `${bx}px ${by}px`;   // it grows out of its tail, as a voice does
  return { box, txt, rx, ry };
}
function showBalloon(b, t, a, z = 99) {
  if (t < a || t >= z) { b.box.style.opacity = 0; return; }
  b.box.style.opacity = 1;
  b.box.style.transform = `scale(${lerp(0.3, 1, spring(prog(t, a, a + 0.45)))})`;
}
/** A pop for a caption box: in from a slight tilt. */
function popIn(e, t, a, { z = 99, r = -1.5, base = '' } = {}) {
  if (t < a || t >= z) { e.style.opacity = 0; return; }
  const p = prog(t, a, a + 0.4);
  e.style.opacity = 1;
  e.style.transform = `${base} scale(${lerp(0.6, 1, spring(p))}) rotate(${r + (1 - ease.outCubic(p)) * -4}deg)`;
}

/** The phone's offset in its panel that puts recording row `sy` at the panel's centre. */
const focusY = (sy, s) => -(BEZ + sy - BODY_H / 2) * s;

/** The camera at t: the page point on the stage centre, and its zoom. Travels pull back to show the page. */
function camera(t) {
  let c = cam(0), s = 1;
  for (const [a, i, j, d] of TRAVEL) {
    if (t < a) break;
    const p = prog(t, a, a + d), e = ease.inOutCubic(p), A = cam(i), B = cam(j);
    c = { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e) };
    s = 1 - 0.36 * Math.sin(Math.PI * ease.inOutSine(p));
  }
  // OUCH: the page takes the hit.
  const u = t - T.ouch;
  if (u > 0 && u < 0.6) { const k = Math.exp(-u * 7); c.x += Math.sin(u * 70) * 16 * k; c.y += Math.cos(u * 55) * 12 * k; s *= 1 + 0.04 * k; }
  return { ...c, s };
}

export default {
  duration: DUR,
  poster: 0.7,
  score() {
    const hits = [0.02, T.send1, T.oof, T.send2, T.fair, T.send3, ...T.words, T.ouch, T.chip];
    const cuts = [T.go1 + 0.31, T.go2 + 0.31, T.go3 + 0.25];
    const c = popScore({ duration: DUR, end: T.end, hits, cuts, tick: [T.send3, T.r3] });
    c.push({ i: 'crash', t: T.oof, g: 0.22 }, { i: 'boom', t: T.oof, g: 0.35 });
    c.push({ i: 'eight', t: T.fair, n: 43, dur: 0.6, g: 0.5, to: 38, at: 0.2 });
    c.push({ i: 'riser', t: T.send3, end: T.r3, g: 0.25 });
    c.push({ i: 'boom', t: T.words[3], g: 0.45 }, { i: 'crash', t: T.ouch, g: 0.35 }, { i: 'boom', t: T.ouch, g: 0.55 });
    const R = rng(9);
    [[0.0, T.send1], [T.go1 + 0.3, T.send2], [T.go2 + 0.3, T.send3]].forEach(([a, b]) => {
      for (let t = a + 0.05; t < b - 0.04; t += 0.06 + R() * 0.05) c.push({ i: 'key', t, g: 0.13 });
    });
    return c;
  },

  async setup(stage) {
    stage.style.background = C.paper;
    await Promise.all(['400 100px Anton', '900 60px Inter', '800 60px Inter', '500 34px Mono'].map((f) => document.fonts.load(f)));
    const ev = await events('ask-quickfire');

    // Film time → footage time. Typing ×1.6–1.8, the loading orbit ×2 (×1.5 on the
    // last, for the wait), every reply in real time; the last one lands at half speed.
    S.clock = remap([
      [0, 0.85, 1.6],
      [T.send1, ev.send_0, 2.0],
      [T.r1, 5.1, 1],
      [T.go1 + 0.25, 7.78, 1.8],
      [T.send2, ev.send_1, 2.0],
      [T.r2, 11.45, 1],
      [T.go2 + 0.25, 14.05, 1.8],
      [T.send3, ev.send_2, 1.5],
      [T.r3, 18.24, 0.5],
      [T.r3 + 0.72, 18.6, 1],
    ]);

    // The page.
    S.page = el('div', 'abs', { left: 0, top: 0, width: '2400px', height: '6000px', transformOrigin: '0 0', background: C.paper }, stage);
    const tier = (i) => el('div', 'abs', { left: `${TIER[i][0]}px`, top: `${TIER[i][1]}px`, width: '1080px', height: '1920px' }, S.page);
    S.tiers = TIER.map((_, i) => tier(i));

    // The three phone panels and the close-up.
    const bgs = [dots(C.cyan, 22, 160), dots(C.magenta, 22, 200), { backgroundColor: C.white }];
    S.panels = [0, 1, 2].map((i) => panel(S.tiers[i], PANEL.x, PANEL.y, PANEL.w, PANEL.h, bgs[i]));
    // Q3's panel: speed lines for the wait.
    S.speed = el('div', 'layer', { background: `repeating-conic-gradient(from 0deg at 50% 46%, ${C.ink} 0deg 1.4deg, transparent 1.4deg 7deg)`, opacity: 0,
      WebkitMaskImage: 'radial-gradient(closest-side, transparent 58%, #000 100%)', maskImage: 'radial-gradient(closest-side, transparent 58%, #000 100%)', transform: 'scale(1.6)' }, S.panels[2]);
    S.close = panel(S.tiers[3], CLOSE.x, CLOSE.y, CLOSE.w, CLOSE.h, dots(C.yellow, 22, 120));

    const phone = (parent) => {
      const d = device(parent, 'ask-quickfire', { skin: 'ink', w: SW, ink: C.ink, body: C.white });
      d.screen.style.border = 'none';
      return d;
    };
    S.d = [...S.panels.map(phone), phone(S.close)];
    S.d.forEach((d) => { d.el.style.zIndex = 1; });

    // HOOK: one caption box over the first panel.
    S.hook = caption(S.tiers[0], `<div style="font-family:Anton;font-weight:400;font-size:178px;line-height:1;color:${C.magenta};-webkit-text-stroke:${LINE * 2}px ${C.ink};paint-order:stroke fill;text-shadow:${LINE}px ${LINE}px 0 ${C.ink};letter-spacing:0.01em">3 QUESTIONS</div>`
      + `<div style="font-family:Anton;font-weight:400;font-size:92px;line-height:1.05;margin-top:10px;letter-spacing:0.02em">I WAS SCARED TO ASK.</div>`,
      { x: 72, y: 196, w: 936, bg: C.yellow, pad: '30px 0 34px', style: { textAlign: 'center', zIndex: 5, transformOrigin: '50% 50%' } });

    // Each tier: the question, lettered, and the counter in the panel's corner.
    const QS = ['“what’s my toxic trait?”', '“will i be rich?”', '“should i text him?”'];
    S.q = QS.map((q, i) => caption(S.tiers[i], q, { x: 72, y: 196, w: 936, bg: C.white, size: 62, weight: 800, pad: '26px 40px', style: { letterSpacing: '-0.02em', zIndex: 4 } }));
    S.n = [0, 1, 2].map((i) => caption(S.tiers[i], `${i + 1}/3`, { x: 72, y: PANEL.y, bg: C.yellow, font: 'Anton', weight: 400, size: 64, pad: '10px 30px 12px', style: { boxShadow: 'none', letterSpacing: '0.04em', zIndex: 4 } }));
    S.n.push(caption(S.tiers[3], '3/3', { x: 72, y: CLOSE.y, bg: C.yellow, font: 'Anton', weight: 400, size: 64, pad: '10px 30px 12px', style: { boxShadow: 'none', letterSpacing: '0.04em', zIndex: 4 } }));

    // Reactions.
    S.oof = burst(S.tiers[0], 'OOF.', { cx: 640, cy: 1300, rx: 300, ry: 190, seed: 4, fill: C.yellow, text: C.magenta, size: 210, rot: -7 });
    S.oof.box.style.zIndex = 6;
    S.fair = balloon(S.tiers[1], '…fair.', { cx: 620, cy: 1385, tail: { from: [760, 1420], to: [900, 1520], w: 60 }, size: 120, padX: 0.66, padY: 0.62, style: { textTransform: 'none' } });
    S.fair.box.style.zIndex = 6;

    // The payoff: the Oracle's line, lettered in a balloon whose tail points at the phone.
    S.say = balloon(S.tiers[3], `<div>NOT TONIGHT.</div><div>TONIGHT YOU WANT</div><div>AN ANSWER,</div><div style="color:${C.magenta}">NOT HIM.</div>`,
      { cx: 540, cy: 470, tail: { from: [330, 640], to: [270, 880], w: 72 }, size: 100, lh: 1.02, padX: 0.6, padY: 0.66 });
    S.say.box.style.zIndex = 6;
    S.sayLines = [...S.say.txt.children];
    S.ouch = burst(S.tiers[3], 'OUCH.', { cx: 790, cy: 872, rx: 220, ry: 144, spikes: 18, seed: 11, fill: C.magenta, text: C.yellow, size: 156, rot: 8 });
    S.ouch.box.style.zIndex = 7;
    // Under OUCH: ink over the cropped tail of the question bubble, so no stray letters peek past the burst.
    S.mask = el('div', 'abs', { right: 0, top: 0, width: '420px', height: '92px', background: '#000', zIndex: 2, opacity: 0 }, S.close);
    // The chip under the reply, ringed in marker (it is the next thing to ask).
    S.ring = svg(S.tiers[3], { left: 0, top: 0, width: '1px', height: '1px', zIndex: 6 });
    S.ring.innerHTML = `<path d="" fill="none" stroke="${C.magenta}" stroke-width="${LINE + 2}" stroke-linecap="round"/>`;
    S.ringPath = S.ring.firstChild;

    // The end card: the last panel on the page.
    const E = S.tiers[4];
    S.endPanel = panel(E, 72, 200, 936, 1360, dots(C.cyan, 22, 200));
    S.mark = el('div', 'abs', { left: 0, right: 0, top: '330px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '34px', opacity: 0 }, E);
    const rm = svg(S.mark, { position: 'relative', width: '170px', height: '170px' }, '-85 -85 170 170');
    rm.innerHTML = `<circle cx="${SHADOW * 0.8}" cy="${SHADOW * 0.8}" r="76" fill="${C.ink}"/><circle r="76" fill="${C.yellow}" stroke="${C.ink}" stroke-width="${LINE}"/><circle r="32" fill="${C.ink}"/>`;
    S.ringMark = rm;
    el('div', '', { fontFamily: 'Anton', fontSize: '200px', lineHeight: 1, color: C.white, WebkitTextStroke: `${LINE * 2}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`, letterSpacing: '0.01em' }, S.mark, 'Plutto');
    S.endSay = balloon(E, 'Ask yours.', { cx: 540, cy: 830, tail: { from: [680, 910], to: [790, 1030], w: 70 }, size: 150, padX: 0.56, padY: 0.72, fill: C.yellow });
    S.cta = el('div', 'abs', { left: '50%', top: '1110px', fontFamily: 'Anton', fontSize: '96px', lineHeight: 1, color: C.ink, background: C.white, border: `${LINE}px solid ${C.ink}`, boxShadow: `${SHADOW}px ${SHADOW}px 0 ${C.ink}`,
      padding: '22px 64px 26px', whiteSpace: 'nowrap', letterSpacing: '0.02em', opacity: 0 }, E, 'plutto.space');
    S.sub = el('div', 'abs', { left: '50%', top: '1330px', fontFamily: 'Mono', fontWeight: 500, fontSize: '34px', letterSpacing: '0.08em', textTransform: 'uppercase', color: C.ink, background: C.white,
      border: `${LINE * 0.75}px solid ${C.ink}`, padding: '10px 26px', whiteSpace: 'nowrap', opacity: 0 }, E, 'Free to start · Android · Web');

    // The honesty tag: a small caption box on the stage, above the platform's bottom rail.
    S.honest = honest(stage, { color: C.ink, bg: C.white, bottom: 272, style: { fontSize: '34px', letterSpacing: '0.06em', padding: '8px 24px', borderRadius: 0, border: `6px solid ${C.ink}`, boxShadow: `8px 8px 0 ${C.ink}` } });
  },

  async frame(t) {
    // ── camera ──
    const c = camera(t);
    S.page.style.transform = `translate(540px, 960px) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;

    // ── phones: each panel keeps its own moment (a comic panel holds still once read) ──
    const span = [[0, T.go1 + 0.3], [T.go1 + 0.25, T.go2 + 0.3], [T.go2 + 0.25, T.go3 + 0.3], [T.go3, DUR]];
    const ft = [];
    for (let i = 0; i < 4; i++) {
      const [a, b] = span[i];
      ft[i] = S.clock(Math.min(Math.max(t, a), b));
    }
    // Only draw phones the camera can see.
    const vis = (i) => { const [x, y] = TIER[i]; const hw = 540 / c.s, hh = 960 / c.s; return x < c.x + hw && x + 1080 > c.x - hw && y < c.y + hh && y + 1920 > c.y - hh; };
    await Promise.all([0, 1, 2, 3].map((i) => (vis(i) ? S.d[i].at(ft[i]) : null)));

    // Pans inside the panels: the input while typing, the exchange once sent.
    const pan = (a, from, to, d = 0.6) => lerp(from, to, ease.inOutCubic(prog(t, a, a + d)));
    const f0 = pan(T.send1 + 0.02, 760, 330, 0.55);
    const f1 = pan(T.send2 + 0.02, 760, 560, 0.5);
    const f2 = 800;
    [f0, f1, f2].forEach((f, i) => {
      const d = S.d[i];
      d.pose(t, { y: focusY(f, PH), s: PH });
      d.body.style.borderWidth = `${LINE / PH}px`; d.body.style.boxShadow = `${SHADOW / PH}px ${SHADOW / PH}px 0 ${C.ink}`;
    });
    // The close-up follows the reply as the app scrolls it up.
    const fc = lerp(958, 830, ease.inOutSine(prog(ft[3], 18.3, 18.58)));
    const dc = S.d[3];
    dc.pose(t, { x: CX, y: focusY(fc, CU), s: CU });
    dc.body.style.borderWidth = `${LINE / CU}px`; dc.body.style.boxShadow = `${SHADOW / CU}px ${SHADOW / CU}px 0 ${C.ink}`;

    // ── HOOK ──
    if (t < T.send1 + 0.4) {
      const p = prog(t, 0, 0.28), q = ease.inCubic(prog(t, T.send1, T.send1 + 0.22));
      S.hook.style.opacity = 1 - q;
      S.hook.style.transform = `translate(0px, ${-q * 520}px) rotate(${-2 - q * 4}deg) scale(${lerp(1.18, 1, ease.outBack(p))})`;
    } else S.hook.style.opacity = 0;

    // ── questions and counters ──
    popIn(S.q[0], t, T.send1 + 0.24, { r: -1 });
    popIn(S.q[1], t, T.go1 + 0.42, { r: 1 });
    popIn(S.q[2], t, T.go2 + 0.42, { r: -1 });
    popIn(S.n[0], t, T.send1 + 0.3, { r: 0 });
    popIn(S.n[1], t, T.go1 + 0.5, { r: 0 });
    popIn(S.n[2], t, T.go2 + 0.5, { r: 0 });
    popIn(S.n[3], t, T.go3 + 0.35, { r: 0 });

    // ── reactions ──
    showBurst(S.oof, t, T.oof);
    showBalloon(S.fair, t, T.fair);
    S.speed.style.opacity = 0.16 * ease.outCubic(prog(t, T.send3, T.send3 + 0.6));
    S.speed.style.transform = `scale(${1.6 - 0.15 * prog(t, T.send3, T.r3)}) rotate(${t * 2}deg)`;

    // ── the payoff ──
    showBalloon(S.say, t, T.words[0] - 0.12);
    S.sayLines.forEach((e, k) => {
      const p = prog(t, T.words[k], T.words[k] + 0.3);
      e.style.opacity = p > 0 ? 1 : 0;
      e.style.transform = `scale(${lerp(0.5, 1, spring(p))})`;
    });
    showBurst(S.ouch, t, T.ouch);
    S.mask.style.opacity = t >= T.ouch + 0.05 ? 1 : 0;
    // The marker ring round the chip (recording ≈ 38…369 × 890…925 px).
    {
      const sx = (x) => 540 + CX - (SW / 2 + BEZ) * CU + (BEZ + x) * CU;
      const sy = (y) => CLOSE.y + CLOSE.h / 2 + (y - fc) * CU;
      const cx = (sx(38) + sx(369)) / 2, cy = sy(907), rx = (sx(369) - sx(38)) / 2 + 34, ry = 64;
      let d = '';
      for (let i = 0; i <= 64; i++) {
        const a = -2.4 + (i / 64) * Math.PI * 2.15, r = 1 + 0.03 * Math.sin(i * 0.7);
        d += `${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * r).toFixed(1)} ${(cy + Math.sin(a) * ry * r + i * 0.25).toFixed(1)}`;
      }
      S.ringPath.setAttribute('d', d);
      const len = S.ringPath.getTotalLength();
      S.ringPath.style.strokeDasharray = len;
      S.ringPath.style.strokeDashoffset = len * (1 - ease.outCubic(prog(t, T.chip, T.chip + 0.45)));
      S.ring.style.opacity = t >= T.chip ? 1 : 0;
    }

    // ── honesty: whenever a reply is on screen ──
    S.honest(t >= T.r1 && t < T.go4 + 0.25 ? 1 : 0);

    // ── end card ──
    const te = t - T.end;
    const pop = (e, a, base = '', r = 0) => {
      const p = prog(te, a, a + 0.45);
      e.style.opacity = p > 0 ? 1 : 0;
      e.style.transform = `${base} scale(${lerp(0.4, 1, spring(p))}) rotate(${r}deg)`;
    };
    pop(S.mark, 0.0);
    S.ringMark.style.transform = `rotate(${Math.max(0, te) * 30}deg)`;
    showBalloon(S.endSay, te, 0.25);
    pop(S.cta, 0.5, 'translateX(-50%)', -2);
    pop(S.sub, 0.7, 'translateX(-50%)');
  },
};
