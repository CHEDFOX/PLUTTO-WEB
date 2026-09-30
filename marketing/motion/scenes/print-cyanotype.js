/**
 * PRINT · CYANOTYPE — a sun print. The sheet starts the colour of unexposed
 * emulsion (ferric yellow-green) and develops to Prussian blue; whatever
 * blocked the light stays paper-white. What develops is the night the viewer
 * was born: the stars, the moon, then the chart of it, drawn in light. The
 * wheel's rim thickens into the Plutto ring, and the print is a poster.
 */
import { el, prog, ease, lerp, rng, W, H, fbm, paint, wordsOf, develop, label, labelIn, stamp, stampIn, colophon, colophonIn, voice } from '../print.js';

const WHITE = '#F3F1EA';
const UNEXP = [192, 196, 122], BLUE = [18, 60, 132];
const SAY = [
  { t: 0.7, text: 'on the night you were born,' },
  { t: 3.1, text: 'the sky held still / for a photograph.' },
  { t: 5.8, text: 'nobody showed it to you.' },
  { t: 8.0, text: 'we kept a copy.' },
  { t: 10.5, text: 'it has been waiting / to be read out loud.' },
];
const BRAND = 13.0, END = 17;
const LINE_Y = 1240, STAG = 0.16;
const CX = 540, CY = 680, CR = 300;                // the chart wheel
const RING = { x: 540, y: 555, r: 180, w: 62 };    // …and the ring it becomes
const PLANETS = [['SUN', 14], ['MOON', 2], ['MERCURY', 27], ['VENUS', 9], ['MARS', 21], ['JUPITER', 5], ['SATURN', 18], ['RAHU', 11]];
let S = {};

const mix = (a, b, p) => a.map((v, i) => Math.round(lerp(v, b[i], p)));

export default {
  duration: END,
  poster: END - 0.4,
  score() {
    const c = [
      { i: 'room', t: 0, end: END, g: 0.05 },
      { i: 'pad', t: 0, end: BRAND + 0.4, ns: [50, 57, 62, 69], g: 0.06, bright: 700, verb: 0.7 },
      { i: 'whoosh', t: 0.05, dur: 1.4, g: 0.12, from: -0.6, to: 0.6 },
      { i: 'heartbeat', t: 5.9, g: 0.5 }, { i: 'heartbeat', t: 6.9, g: 0.35 },
      { i: 'bell', t: 8.0, n: 81, g: 0.1, dur: 4 },
      { i: 'riser', t: 8.3, end: 10.3, g: 0.08 },
      { i: 'reverse', end: BRAND + 1.05, dur: 0.9, g: 0.18 },
      { i: 'sting', t: BRAND + 1.05, g: 0.7 },
      { i: 'pad', t: BRAND + 1.05, end: END, ns: [50, 57, 62], g: 0.05, bright: 600 },
      { i: 'tom', t: BRAND + 3.0, f: 190, g: 0.22, verb: 0.2, d: 0.1 },
    ];
    PLANETS.forEach((_, i) => c.push({ i: 'blip', t: 9.2 + i * 0.14, n: [79, 81, 84, 86, 88, 91][i % 6], g: 0.06, dur: 0.06, slide: 2 }));
    return voice(c, SAY, { stag: STAG, inst: 'pluck', scale: [74, 76, 79, 81, 83, 86], g: 0.12, thock: 0 });
  },
  async setup(stage) {
    stage.style.background = WHITE;
    const R = rng(21);
    // The sheet: watercolour paper.
    const bg = el('canvas', 'layer', {}, stage); S.bg = bg; bg.width = W; bg.height = H; const b = bg.getContext('2d');
    b.fillStyle = WHITE; b.fillRect(0, 0, W, H);
    b.drawImage(paint(135, 240, fbm(135, 240, { scale: 40, oct: 3, seed: 3 }), (v) => [120, 110, 90, Math.round(v * 16)]), 0, 0, W, H);
    // The emulsion, brushed on by hand: horizontal strokes with ragged ends, a little uneven.
    const M = document.createElement('canvas'); M.width = W; M.height = H; const m = M.getContext('2d');
    m.fillStyle = '#000';
    for (let y = 62; y < 1850; y += 56) {                // wide overlapping strokes, bristles dragged out at both ends
      const h = 72 + R() * 18, x0 = 58 + R() * 26, x1 = W - 58 - R() * 26;
      m.globalAlpha = 1; m.fillRect(x0, y, x1 - x0, h);
      for (let k = 0; k < 70; k++) {
        const yy = y + R() * h, th = 1 + R() * 2.2;
        m.globalAlpha = 0.2 + R() * 0.7; m.fillRect(x0 - Math.pow(R(), 2) * 52, yy, 52, th);
        m.globalAlpha = 0.2 + R() * 0.7; m.fillRect(x1 - 52 + Math.pow(R(), 2) * 52, yy + R() * 3, 52, th);
      }
    }
    const tex = paint(270, 480, fbm(270, 480, { scale: 5, oct: 4, seed: 9 }), (v) => [0, 0, 0, Math.round(40 + v * 70)]);
    const streak = paint(40, 480, fbm(40, 480, { scale: 3, oct: 3, seed: 12 }), (v) => [0, 0, 0, Math.round(v * 90)]);   // the brush's streaks, stretched sideways
    const sheet = (rgb, dark) => {
      const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
      g.fillStyle = `rgb(${rgb})`; g.fillRect(0, 0, W, H);
      g.globalAlpha = dark; g.drawImage(tex, 0, 0, W, H); g.drawImage(streak, 0, 0, W, H); g.globalAlpha = 1;
      g.globalCompositeOperation = 'destination-in'; g.drawImage(M, 0, 0);
      return c;
    };
    S.unexp = sheet(UNEXP, 0.25); S.exp = sheet(BLUE, 0.55);
    // What blocked the light: the stars and the moon of that night.
    S.sky = document.createElement('canvas'); S.sky.width = W; S.sky.height = H; const k = S.sky.getContext('2d');
    k.fillStyle = WHITE; k.strokeStyle = WHITE;
    S.stars = [];
    for (let i = 0; i < 230; i++) {
      const x = 90 + R() * (W - 180), y = 110 + R() * 1700, r = Math.pow(R(), 3) * 3.4 + 0.7;
      S.stars.push({ x, y, r });
    }
    // A constellation (the seven of the Plough), drawn in light as the photograph is named.
    S.const = [[210, 430], [300, 468], [382, 458], [452, 520], [446, 612], [548, 648], [574, 560]].map(([x, y]) => ({ x, y, r: 3.2 }));
    S.stars.push(...S.const);
    S.stars.forEach(({ x, y, r }) => {
      if (r > 2.4) { const h = k.createRadialGradient(x, y, 0, x, y, r * 6); h.addColorStop(0, 'rgba(243,241,234,0.35)'); h.addColorStop(1, 'rgba(243,241,234,0)'); k.fillStyle = h; k.globalAlpha = 1; k.fillRect(x - r * 6, y - r * 6, r * 12, r * 12); }
      k.fillStyle = WHITE; k.globalAlpha = r > 2.4 ? 1 : 0.55 + R() * 0.4; k.beginPath(); k.arc(x, y, r, 0, 6.28); k.fill();
    });
    // The moon: a crescent, soft-edged the way anything laid on the paper prints.
    const mc = document.createElement('canvas'); mc.width = mc.height = 220; const mg = mc.getContext('2d');
    mg.fillStyle = WHITE; mg.beginPath(); mg.arc(110, 110, 66, 0, 6.28); mg.fill();
    mg.globalCompositeOperation = 'destination-out'; mg.beginPath(); mg.arc(140, 90, 58, 0, 6.28); mg.fill();
    k.globalAlpha = 1; k.filter = 'blur(2px)'; k.drawImage(mc, 815 - 110, 330 - 110); k.filter = 'none';
    // The layer every developed thing is drawn into, and the printed type.
    const cv = el('canvas', 'layer', {}, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    S.print = cv;
    const line = { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 600, color: WHITE, textAlign: 'center', lineHeight: 1.12 };
    S.lines = SAY.map((l) => {
      const box = el('div', 'abs', { left: '120px', width: '840px', top: `${LINE_Y}px`, transform: 'translateY(-50%)', fontSize: '66px', ...line }, stage);
      const spans = [];
      l.text.split(' ').forEach((w, j, all) => {
        if (w === '/') { box.appendChild(document.createElement('br')); return; }
        spans.push(el('span', '', { display: 'inline-block', opacity: 0 }, box, w));
        if (j < all.length - 1 && all[j + 1] !== '/') box.appendChild(document.createTextNode(' '));
      });
      return { box, spans };
    });
    // The poster.
    S.wm = el('div', 'abs', { left: 0, right: 0, top: '800px', textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: '196px', letterSpacing: '-0.055em', lineHeight: 1, color: WHITE, opacity: 0 }, stage, 'Plutto');
    S.label = label(stage, 'THE SKY YOU WERE BORN UNDER', { top: 1036, ink: WHITE, blend: 'normal' });
    S.tag = el('div', 'abs', { left: 0, right: 0, top: '1090px', textAlign: 'center', fontSize: '124px', ...line }, stage);
    S.tagw = ['talks', 'back.'].map((w, i) => { if (i) S.tag.appendChild(document.createTextNode(' ')); return el('span', '', { display: 'inline-block', opacity: 0 }, S.tag, w); });
    S.stamp = stamp(stage, 'PLUTTO.SPACE', { top: 1298, ink: WHITE, style: { mixBlendMode: 'normal' } });
    S.colo = colophon(stage, 'CYANOTYPE — ONE NIGHT’S EXPOSURE', 'N° 002', { ink: WHITE });
  },
  async frame(t) {
    const g = S.g; g.clearRect(0, 0, W, H);
    // Exposure: the sheet turns from yellow-green to blue; the stars were never exposed.
    const dev = ease.inOutCubic(prog(t, 0.2, 4.2));
    g.drawImage(S.unexp, 0, 0);
    g.globalAlpha = dev; g.drawImage(S.exp, 0, 0);
    g.globalAlpha = Math.min(1, dev * 1.15); g.drawImage(S.sky, 0, 0); g.globalAlpha = 1;
    // A slow push in, the way you'd lean over a print.
    const push = `scale(${1 + 0.035 * ease.inOutSine(prog(t, 0, END))})`; S.print.style.transform = S.bg.style.transform = push;
    // The constellation, drawn as the photograph is named.
    const cn = ease.inOutCubic(prog(t, 3.6, 5.4)) * (1 - ease.inCubic(prog(t, 7.8, 8.6)));
    if (cn > 0) {
      g.strokeStyle = WHITE; g.lineWidth = 2; g.globalAlpha = 0.8 * Math.min(1, cn * 3); g.beginPath();
      const pts = S.const, segs = (pts.length - 1) * Math.min(1, cn);
      for (let i = 0; i < segs; i++) {
        const a = pts[i], z = pts[i + 1], f = Math.min(1, segs - i);
        g.moveTo(a.x, a.y); g.lineTo(lerp(a.x, z.x, f), lerp(a.y, z.y, f));
      }
      g.stroke(); g.globalAlpha = 1;
    }
    // The chart of that night, drawn in light; then its rim becomes the ring.
    const w = prog(t, 8.1, 10.4), m = ease.inOutCubic(prog(t, BRAND, BRAND + 1.05));
    if (w > 0) {
      const cx = lerp(CX, RING.x, m), cy = lerp(CY, RING.y, m), sc = lerp(1, RING.r / CR, m), fade = 1 - m;
      const arc = (r, p, lw, a = 1) => { if (p <= 0) return; g.globalAlpha = a; g.lineWidth = lw; g.beginPath(); g.arc(cx, cy, r * sc, -Math.PI / 2, -Math.PI / 2 + 6.2832 * p); g.stroke(); };
      g.strokeStyle = WHITE; g.fillStyle = WHITE; g.filter = 'blur(0.6px)';
      arc(CR, ease.inOutCubic(prog(w, 0, 0.45)), lerp(3, RING.w, m));
      if (fade > 0) {
        arc(CR - 48, ease.inOutCubic(prog(w, 0.1, 0.55)), 2, fade);
        arc(110, ease.inOutCubic(prog(w, 0.2, 0.6)), 2, fade);
        for (let i = 0; i < 12; i++) {                        // the twelve houses
          const p = ease.outCubic(prog(w, 0.3 + i * 0.03, 0.5 + i * 0.03)), a = (i / 12) * 6.2832 - Math.PI / 2;
          if (p <= 0) continue;
          g.globalAlpha = fade; g.lineWidth = 2; g.beginPath();
          g.moveTo(cx + Math.cos(a) * 110 * sc, cy + Math.sin(a) * 110 * sc); g.lineTo(cx + Math.cos(a) * lerp(110, CR - 48, p) * sc, cy + Math.sin(a) * lerp(110, CR - 48, p) * sc); g.stroke();
        }
        for (let i = 0; i < 72; i++) {                        // degree ticks on the rim
          const p = prog(w, 0.4 + i * 0.004, 0.45 + i * 0.004), a = (i / 72) * 6.2832 - Math.PI / 2, L = i % 6 ? 12 : 26;
          if (p <= 0) continue;
          g.globalAlpha = fade * p; g.lineWidth = 2; g.beginPath();
          g.moveTo(cx + Math.cos(a) * (CR - 48) * sc, cy + Math.sin(a) * (CR - 48) * sc); g.lineTo(cx + Math.cos(a) * (CR - 48 + L) * sc, cy + Math.sin(a) * (CR - 48 + L) * sc); g.stroke();
        }
        g.filter = 'none'; g.font = '500 17px Mono'; g.textAlign = 'center';
        PLANETS.forEach(([name, deg], i) => {                  // where each one stood
          const p = ease.outBack(prog(t, 9.2 + i * 0.14, 9.6 + i * 0.14)); if (p <= 0) return;
          const a = ((i * 47 + deg * 3) % 360) * Math.PI / 180 - Math.PI / 2, rr = (i % 2 ? 150 : 205) * sc;
          const x = cx + Math.cos(a) * rr, y = cy + Math.sin(a) * rr;
          g.globalAlpha = fade * Math.min(1, p); g.beginPath(); g.arc(x, y, 7 * Math.min(1.2, p), 0, 6.28); g.fill();
          g.fillText(`${name} ${String(deg).padStart(2, '0')}°`, x, y - 16);
        });
      }
      g.filter = 'none'; g.globalAlpha = 1;
    }
    // The lines, developed word by word; each fades back as the next comes up.
    S.lines.forEach(({ box, spans }, li) => {
      const l = SAY[li], next = SAY[li + 1]?.t ?? BRAND;
      spans.forEach((sp, i) => develop(sp, t, l.t + i * STAG));
      box.style.color = `rgb(${mix(BLUE, [243, 241, 234], dev)})`;
      const out = ease.inCubic(prog(t, next - 0.3, next + 0.2));
      box.style.opacity = 1 - out; box.style.filter = out > 0 ? `blur(${out * 12}px)` : 'none';
    });
    // The poster.
    develop(S.wm, t, BRAND + 1.0, 0.9);
    labelIn(S.label, t, BRAND + 1.6);
    S.tagw.forEach((e, i) => develop(e, t, BRAND + 2.0 + i * STAG));
    stampIn(S.stamp, t, BRAND + 2.95);
    colophonIn(S.colo, t, BRAND + 2.9, 0.7);
  },
};
