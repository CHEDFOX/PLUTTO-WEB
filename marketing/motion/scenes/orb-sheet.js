/**
 * ORB · THE SHEET — v2. A white sheet; Plutto's voice orb, drawn here at full
 * size (a plasma sphere in the app's colours, lit, with its light on the
 * paper), sits near the bottom and speaks. Every word leaves the orb: it is
 * born at the orb's centre in the orb's colour and flies to its place on the
 * sheet, where the line stays. A thread of sound runs from the orb to the
 * line being spoken; each line's key word is set big, in the orb's colour of
 * that moment, with a marker swipe. Older lines soften to grey. At the end the
 * orb rolls up the sheet and becomes the ring in the Plutto mark.
 */
import { el, set, scribble, prog, ease, lerp, rng, W, H } from '../lib.js';
import { title, show } from '../cine.js';
import { fbm, paint, canvas } from '../shots.js';

const INK = '#12111A', PAPER = '#FBFAF7';
// The orb's palette, in the order it drifts through (the app's plasma).
const HUES = [[255, 63, 160], [124, 58, 237], [18, 191, 232], [46, 224, 142], [255, 138, 42]];
const STAG = 0.13;
const SAY = [
  { t: 0.9, text: 'hey.', font: 'b', size: 84, em: 0, rot: -2 },
  { t: 2.3, text: 'you took the long way home again.', font: 'i', size: 62, em: 4 },
  { t: 5.4, text: 'radio off. still thinking about it.', font: 's', size: 62, em: 3, rot: 1 },
  { t: 8.6, text: 'say it out loud.', font: 'b', size: 72, em: 3 },
  { t: 11.3, text: 'i’m listening.', font: 'i', size: 84, em: 1, rot: -1.5 },
];
const BRAND = 14.4, END = 18;
const OX = 540, OY = 1440, OR = 225;
const PENTA = [72, 74, 76, 79, 81, 84, 86, 88];
let S = {};

/** The orb's colour at t: a slow drift through HUES, sped up while it speaks. */
function hueAt(t) {
  const k = (t * 0.22) % HUES.length, i = Math.floor(k), f = ease.inOutSine(k - i);
  const a = HUES[i], b = HUES[(i + 1) % HUES.length];
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];
}
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const mix = (a, b, f) => [lerp(a[0], b[0], f), lerp(a[1], b[1], f), lerp(a[2], b[2], f)];

/** The orb, drawn: plasma blobs clipped to a sphere, shaded, lit, with a glass highlight. */
function drawOrb(g, t, x, y, r, sx, sy, col) {
  const R = rng(3), blobs = S.blobs;
  g.save(); g.translate(x, y); g.scale(sx, sy);
  // Its light on the paper: a coloured bloom under and around it.
  const bloom = g.createRadialGradient(0, r * 0.6, r * 0.2, 0, r * 0.6, r * 2.2);
  bloom.addColorStop(0, rgb(col, 0.28)); bloom.addColorStop(1, rgb(col, 0));
  g.fillStyle = bloom; g.fillRect(-r * 3, -r * 2, r * 6, r * 5);
  // The sphere.
  g.beginPath(); g.arc(0, 0, r, 0, 6.2832); g.clip();
  const base = g.createRadialGradient(-r * 0.2, -r * 0.2, 0, 0, 0, r);
  base.addColorStop(0, rgb(mix(col, [255, 255, 255], 0.35))); base.addColorStop(0.6, rgb(col)); base.addColorStop(1, rgb(mix(col, [20, 10, 40], 0.55)));
  g.fillStyle = base; g.fillRect(-r, -r, 2 * r, 2 * r);
  g.globalCompositeOperation = 'lighter';
  blobs.forEach((b, i) => {
    const c = HUES[(i + Math.floor(t * 0.22)) % HUES.length];
    const bx = Math.sin(t * b.sx + b.px) * r * 0.55, by = Math.cos(t * b.sy + b.py) * r * 0.55, br = r * (0.35 + 0.25 * Math.sin(t * b.sr + b.pr));
    const gr = g.createRadialGradient(bx, by, 0, bx, by, br);
    gr.addColorStop(0, rgb(c, 0.55)); gr.addColorStop(1, rgb(c, 0));
    g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r);
  });
  g.globalCompositeOperation = 'multiply';
  const shade = g.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.2, 0, 0, r);       // the far side turns away from the light
  shade.addColorStop(0.55, 'rgba(255,255,255,1)'); shade.addColorStop(1, 'rgba(90,60,140,1)');
  g.fillStyle = shade; g.fillRect(-r, -r, 2 * r, 2 * r);
  g.globalCompositeOperation = 'screen';
  const rim = g.createRadialGradient(-r * 0.25, -r * 0.3, r * 0.55, 0, 0, r);   // a rim light along the lower-right edge, from the paper's glow
  rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(0.86, 'rgba(0,0,0,0)'); rim.addColorStop(1, 'rgba(255,240,230,0.55)');
  g.fillStyle = rim; g.fillRect(-r, -r, 2 * r, 2 * r);
  g.globalCompositeOperation = 'source-over';
  const hi = g.createRadialGradient(-r * 0.38, -r * 0.45, 0, -r * 0.38, -r * 0.45, r * 0.5);   // the glass highlight
  hi.addColorStop(0, 'rgba(255,255,255,0.85)'); hi.addColorStop(0.35, 'rgba(255,255,255,0.25)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = hi; g.fillRect(-r, -r, 2 * r, 2 * r);
  g.restore();
  void R;
}

export default {
  duration: END,
  poster: 12.2,
  score() {
    const c = [
      { i: 'pad', t: 0, end: BRAND, ns: [57, 64, 69, 71], g: 0.05, bright: 900, verb: 0.6 },
      { i: 'whoosh', t: 0.05, dur: 0.6, g: 0.18, from: 0, to: 0 },
      { i: 'bell', t: 0.35, n: 88, g: 0.06, dur: 2.5 },
      { i: 'reverse', end: BRAND, dur: 0.8, g: 0.22 },
      { i: 'hit', t: BRAND, g: 0.35 }, { i: 'sting', t: BRAND + 0.05, g: 0.8 },
      { i: 'pad', t: BRAND, end: END, ns: [57, 64, 69], g: 0.04 },
    ];
    for (let k = 2; k < 24; k++) {                       // a light, dry beat under the voice
      const t = k * 0.6;
      c.push(k % 2 === 0 ? { i: 'kick', t, g: 0.3 } : { i: 'snare', t, g: 0.15, verb: 0.35 });
      c.push({ i: 'hat', t, g: 0.09, p: -0.3 }, { i: 'hat', t: t + 0.3, g: 0.06, p: 0.3 });
    }
    SAY.forEach((line, li) => {                          // the orb speaks: one tuned blip per word, the line's end dips
      const ws = line.text.split(' ');
      ws.forEach((w, i) => {
        const last = i === ws.length - 1;
        c.push({ i: 'blip', t: line.t + i * STAG, n: PENTA[(li * 3 + i * 2) % PENTA.length] - (last ? 5 : 0), g: 0.26, dur: last ? 0.16 : 0.1, slide: last ? -2 : 3 });
      });
      c.push({ i: 'bell', t: line.t, n: 93 + li * 2, g: 0.035, dur: 1.6 });
    });
    return c;
  },
  async setup(stage) {
    stage.style.background = PAPER;
    const R = rng(12);
    S.blobs = Array.from({ length: 5 }, () => ({ sx: 0.5 + R(), sy: 0.4 + R(), sr: 0.6 + R(), px: R() * 6.28, py: R() * 6.28, pr: R() * 6.28 }));
    // Paper: fibre, and a soft vignette so the sheet is a surface, not a void.
    const fibre = paint(270, 480, fbm(270, 480, { scale: 3, oct: 2, seed: 4 }), (v) => [40, 30, 20, Math.round(Math.abs(v - 0.5) * 26)]);
    const bg = el('canvas', 'layer', {}, stage); bg.width = W; bg.height = H; const bgg = bg.getContext('2d');
    bgg.drawImage(fibre, 0, 0, W, H);
    const vg = bgg.createRadialGradient(540, 900, 300, 540, 960, 1300); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(40,30,60,0.10)');
    bgg.fillStyle = vg; bgg.fillRect(0, 0, W, H);
    // The world: the orb, its shadow, the thread, the rings.
    const cv = el('canvas', 'layer', {}, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    // The transcript: each line laid out in place, then measured, so its words can fly in from the orb.
    S.col = el('div', 'abs', { left: '96px', top: '330px', width: '900px' }, stage);
    S.lines = SAY.map((l) => {
      const root = el('div', '', { fontSize: `${l.size}px`, lineHeight: 1.16, color: INK, marginBottom: '22px', transformOrigin: '0 50%', position: 'relative',
        ...(l.font === 'b' ? { fontFamily: 'Inter', fontWeight: 900, letterSpacing: '-0.03em' }
          : { fontFamily: 'Cormorant', fontWeight: l.font === 'i' ? 500 : 600, fontStyle: l.font === 'i' ? 'italic' : 'normal' }) }, S.col);
      const spans = l.text.split(' ').map((w, i) => {
        const sp = el('span', '', { display: 'inline-block', opacity: 0, whiteSpace: 'nowrap', position: 'relative' }, root, w);
        if (i === l.em) Object.assign(sp.style, { fontFamily: 'Inter', fontWeight: 900, fontStyle: 'normal', fontSize: `${Math.round(l.size * 1.24)}px`, letterSpacing: '-0.03em', lineHeight: 0.9, verticalAlign: '-0.06em' });
        if (i < l.text.split(' ').length - 1) root.appendChild(document.createTextNode(' '));
        return sp;
      });
      return { root, spans, cfg: l };
    });
    await document.fonts.ready;
    // Where each word lands, relative to the orb, so its flight can start at the orb's centre.
    S.lines.forEach((k) => {
      k.spans.forEach((sp) => { const r = sp.getBoundingClientRect(); sp.dx = OX - (r.left + r.width / 2); sp.dy = OY - (r.top + r.height / 2); });
      const em = k.spans[k.cfg.em], r = em.getBoundingClientRect();
      // A marker swipe under the key word, drawn on when it lands.
      k.swipe = scribble(stage, `M 0 ${r.height * 0.86} C ${r.width * 0.3} ${r.height * 0.8}, ${r.width * 0.6} ${r.height * 0.95}, ${r.width + 6} ${r.height * 0.84}`,
        { left: `${r.left - 4}px`, top: `${r.top}px`, width: `${r.width + 10}px`, height: `${r.height}px`, opacity: 0.55, mixBlendMode: 'multiply' }, { width: Math.max(10, r.height * 0.22), color: '#000' });
      k.swipePath = stage.lastChild.querySelector('path');
    });
    S.cap = el('div', 'abs', { left: 0, right: 0, top: `${OY + OR + 96}px`, textAlign: 'center', fontFamily: 'Inter', fontWeight: 500, fontSize: '22px', letterSpacing: '0.42em', textTransform: 'uppercase', color: 'rgba(18,17,26,0.42)', opacity: 0 }, stage, 'listening');
    // The mark, in ink; the orb becomes its ring.
    S.brand = el('div', 'abs', { left: 0, right: 0, top: '780px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '26px', opacity: 0 }, stage);
    S.slot = el('div', '', { width: '112px', height: '112px' }, S.brand);
    S.word = el('div', '', { fontFamily: 'Inter', fontSize: '124px', fontWeight: 700, letterSpacing: '-0.035em', color: INK }, S.brand, 'Plutto');
    S.tag = title(stage, 'Five thousand years old. <em>Talks back.</em>', { kind: 'italic', size: 60, top: 950, color: INK, style: { textShadow: 'none', fontStyle: 'normal' } });
    S.tag.querySelector('em').style.color = '#FF3FA0';
    S.cta = title(stage, 'plutto.space', { kind: 'caps', size: 26, top: 1070, color: 'rgba(18,17,26,0.6)', style: { textShadow: 'none', color: 'rgba(18,17,26,0.6)' } });
  },
  async frame(t) {
    const g = S.g; g.clearRect(0, 0, W, H);
    const col = hueAt(t);
    // What is being said, and the hit of the latest word.
    let hit = 0, speaking = null;
    SAY.forEach((l, li) => { const n = l.text.split(' ').length; if (t >= l.t && t < l.t + n * STAG + 0.5) speaking = li;
      for (let i = 0; i < n; i++) { const w = l.t + i * STAG; if (t >= w && t < w + 0.32) hit = Math.max(hit, Math.pow(1 - (t - w) / 0.32, 2)); } });
    // The orb: rises in, breathes, squashes on each word, then rolls up into the mark.
    const inK = ease.outCubic(prog(t, 0, 1.1));
    const gone = ease.inOutCubic(prog(t, BRAND, BRAND + 1.1));
    if (!S.dest) { const r = S.slot.getBoundingClientRect(); S.dest = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    const ox = lerp(OX, S.dest.x, gone), oy = lerp(OY + (1 - inK) * 800, S.dest.y, gone), orr = lerp(OR, 56, gone);
    const breathe = 1 + 0.025 * Math.sin(t * 2.4), sq = 1 + 0.12 * hit;
    if (gone < 1) {
      // Shadow on the sheet.
      const sh = g.createRadialGradient(ox, oy + orr * 1.25, 0, ox, oy + orr * 1.25, orr * 1.5);
      sh.addColorStop(0, 'rgba(30,20,60,0.32)'); sh.addColorStop(1, 'rgba(30,20,60,0)');
      g.save(); g.translate(ox, oy + orr * 1.25); g.scale(1.4, 0.32); g.translate(-ox, -(oy + orr * 1.25)); g.fillStyle = sh; g.fillRect(0, 0, W, H); g.restore();
      // Rings, when a line begins.
      SAY.forEach((l, li) => { const k = (t - l.t) / 1.6; if (k < 0 || k > 1) return;
        for (let r = 0; r < 3; r++) { const kk = k - r * 0.12; if (kk < 0) continue;
          g.strokeStyle = rgb(hueAt(l.t)); g.globalAlpha = 0.5 * (1 - kk) * (1 - gone); g.lineWidth = 3 - r * 0.7;
          g.beginPath(); g.arc(ox, oy, orr * 1.1 + kk * 900, 0, 6.2832); g.stroke(); } });
      g.globalAlpha = 1;
      // The thread of sound: from the orb up to the line being spoken, alive with the voice.
      if (speaking !== null) {
        const k = S.lines[speaking], r = k.root.getBoundingClientRect(), ty = r.top + r.height + 6, tx = r.left + Math.min(r.width, 420);
        g.strokeStyle = rgb(col, 0.55); g.lineWidth = 2.5; g.beginPath();
        for (let s = 0; s <= 1; s += 0.02) {
          const x = lerp(ox, tx, s), y = lerp(oy - orr, ty, ease.inOutSine(s));
          const amp = (8 + 40 * hit) * Math.sin(s * 22 + t * 30) * Math.sin(s * Math.PI);
          if (s === 0) g.moveTo(x, y); else g.lineTo(x + amp, y);
        }
        g.stroke();
      }
      drawOrb(g, t, ox, oy, orr, breathe * (1 + 0.5 * (sq - 1)) * (1 - gone * 0.3), breathe * (1 - 0.5 * (sq - 1)) * (1 - gone * 0.3), col);
    }
    set(S.cap, { o: inK * (1 - gone) * (speaking === null ? 1 : 0) });
    // The words: each born at the orb, in its colour, flying to its place; the line then holds.
    S.lines.forEach((k, li) => {
      const l = k.cfg, n = k.spans.length, next = SAY[li + 1]?.t ?? BRAND;
      const lineCol = hueAt(l.t);
      const soft = li < SAY.length - 1 ? ease.outCubic(prog(t, next, next + 0.6)) : 0;
      const out = ease.inCubic(prog(t, BRAND - 0.2, BRAND + 0.4));
      k.root.style.transform = `rotate(${l.rot || 0}deg)`;
      k.root.style.opacity = 1 - out;
      k.spans.forEach((sp, i) => {
        const w = l.t + i * STAG, f = ease.outCubic(prog(t, w, w + 0.6)), land = ease.outBack(prog(t, w + 0.25, w + 0.6));
        if (t < w) { sp.style.opacity = 0; return; }
        const em = i === l.em;
        const c = em ? mix(lineCol, [0, 0, 0], soft * 0.55) : mix(INK.match(/\w\w/g).map((h) => parseInt(h, 16)), [150, 150, 158], soft);
        sp.style.color = em ? rgb(mix(lineCol, c, 1)) : rgb(c);
        sp.style.opacity = Math.min(1, f * 3);
        sp.style.transform = `translate(${sp.dx * (1 - f)}px, ${sp.dy * (1 - f)}px) scale(${lerp(0.25, 1, f) * (em ? lerp(1, 1.06, 1 - land) : 1)}) rotate(${(1 - f) * -25}deg)`;
        sp.style.filter = f < 1 ? `blur(${(1 - f) * 4}px)` : 'none';
      });
      // The marker swipe lands with the key word, in the line's colour, and greys with it.
      const wEm = l.t + l.em * STAG;
      k.swipe(ease.outCubic(prog(t, wEm + 0.45, wEm + 0.9)));
      k.swipePath.setAttribute('stroke', rgb(mix(lineCol, [160, 160, 168], soft)));
      k.swipePath.parentNode.style.opacity = 0.5 * (1 - out);
      void n;
    });
    // The mark: the orb has become its ring; the word writes itself beside it.
    const bk = ease.outCubic(prog(t, BRAND + 0.9, BRAND + 1.5));
    S.brand.style.opacity = t >= BRAND + 0.9 ? 1 : 0;
    S.word.style.clipPath = `inset(0 ${100 - 100 * bk}% 0 0)`; S.word.style.transform = `translateX(${(1 - bk) * -30}px)`;
    if (gone >= 1) {
      g.fillStyle = INK; g.beginPath(); g.arc(S.dest.x, S.dest.y, 56, 0, 6.2832); g.fill();
      g.fillStyle = PAPER; g.beginPath(); g.arc(S.dest.x, S.dest.y, 30, 0, 6.2832); g.fill();
    }
    show(S.tag, t, BRAND + 1.5, 99, { d: 0.9 });
    show(S.cta, t, BRAND + 2.0, 99, { mode: 'fade', d: 0.7 });
  },
};
