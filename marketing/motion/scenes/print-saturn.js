/**
 * PRINT · SATURN — a Swiss screenprint: three flat inks (vermilion, cobalt,
 * black) overprinted on cream, a grid, flush-left type that wipes up out of
 * its line. Saturn is a halftone; a numeral counts the 29½ years it takes to
 * come back, and a small orbit diagram clicks home into the notch marked
 * BIRTH. The line never says "astrology": it says why 28 felt like that.
 */
import { el, prog, ease, lerp, rng, W, H, paper, marks, wordsOf, stamp, stampIn, colophon, colophonIn, voice } from '../print.js';

const CREAM = '#EFE7D6';
const INK = { red: '#F2471C', blue: '#2140D6', black: '#141414' };
const SAY = [
  { t: 0.5, text: 'saturn takes / 29½ years', em: [2] },
  { t: 2.9, text: 'to come back / to where it stood / the day you / were born.', em: [] },
  { t: 6.0, text: 'that’s why 28 / felt like that.', em: [2, 5] },
  { t: 8.5, text: 'it isn’t a crisis. / it’s a return.', em: [6] },
  { t: 10.9, text: 'ask what it / came back for.', em: [] },
];
const BRAND = 13.2, END = 17;
const STAG = 0.1, LINE_TOP = 1075, SIZE = 92;
const P = { x: 610, y: 650, r: 200 };                 // the planet
const ORB = { x: 905, y: 925, r: 76, done: 10.6 };    // the orbit diagram
let S = {};

export default {
  duration: END,
  poster: END - 0.3,
  score() {
    const c = [{ i: 'room', t: 0, end: END, g: 0.03 }];
    for (let k = 0; k * 0.6 < BRAND; k++) {             // precise: a kick on every beat, hats between, a pulse under
      const t = k * 0.6;
      c.push({ i: 'kick', t, g: 0.26 }, { i: 'hat', t: t + 0.3, g: 0.08, p: 0.25 });
      if (k % 4 === 3) c.push({ i: 'hat', t: t + 0.45, g: 0.05, p: -0.25 });
    }
    c.push({ i: 'pulse', t: 0, end: BRAND, n: 38, g: 0.14, open: [300, 1800] });
    for (let k = 0; k < 30; k++) c.push({ i: 'key', t: 0.5 + (k / 29.5) * 10.1, g: 0.05 });   // the counter, year by year
    c.push({ i: 'braam', t: 8.5, n: 38, dur: 2.2, g: 0.28 });
    c.push({ i: 'bell', t: ORB.done, n: 86, g: 0.12, dur: 3 }, { i: 'hit', t: ORB.done, g: 0.2 });
    c.push({ i: 'reverse', end: BRAND + 0.15, dur: 0.8, g: 0.2 }, { i: 'sting', t: BRAND + 0.15, g: 0.75 });
    c.push({ i: 'pad', t: BRAND + 0.15, end: END, ns: [50, 57, 62], g: 0.05 });
    c.push({ i: 'tom', t: BRAND + 2.62, f: 190, g: 0.22, verb: 0.2, d: 0.1 });
    return voice(c, SAY, { stag: STAG, g: 0.2, thock: 150 });
  },
  async setup(stage) {
    stage.style.background = CREAM;
    const b = paper(stage, { color: CREAM, fibre: [120, 95, 70], seed: 14 });
    // The grid everything hangs on.
    b.strokeStyle = INK.black; b.globalAlpha = 0.1; b.lineWidth = 1.5;
    [90, 540, 990].forEach((x) => { b.beginPath(); b.moveTo(x, 60); b.lineTo(x, H - 60); b.stroke(); });
    [360, 1040, 1480].forEach((y) => { b.beginPath(); b.moveTo(60, y); b.lineTo(W - 60, y); b.stroke(); });
    b.globalAlpha = 1;
    marks(b, INK.black, { alpha: 0.4, target: null });
    // Ink: every plate multiplies onto the paper.
    const cv = el('canvas', 'layer', { mixBlendMode: 'multiply' }, stage); cv.width = W; cv.height = H; S.g = cv.getContext('2d');
    // The numeral, counting the years: huge, vermilion, overprinted behind the planet.
    S.num = el('div', 'abs', { left: '60px', top: '250px', fontFamily: 'Inter', fontWeight: 900, fontSize: '400px', letterSpacing: '-0.07em', lineHeight: 1, color: INK.red, mixBlendMode: 'multiply', opacity: 0.92 }, stage, '0');
    S.numLab = el('div', 'abs', { left: '96px', top: '214px', fontFamily: 'Mono', fontWeight: 500, fontSize: '20px', letterSpacing: '0.18em', color: INK.black }, stage, 'YEARS SINCE YOU WERE BORN');
    S.orbLab = el('div', 'abs', { left: `${ORB.x - 120}px`, width: '240px', top: `${ORB.y + ORB.r + 22}px`, textAlign: 'center', fontFamily: 'Mono', fontWeight: 500, fontSize: '16px', letterSpacing: '0.18em', color: INK.black }, stage, 'ONE ORBIT');
    // The lines: flush left, each word wiping up out of its own line.
    S.lines = SAY.map((l) => {
      const box = el('div', 'abs', { left: '90px', right: '90px', top: `${LINE_TOP}px`, fontFamily: 'Inter', fontWeight: 800, fontSize: `${SIZE}px`, lineHeight: 1.02, letterSpacing: '-0.04em', color: INK.black, mixBlendMode: 'multiply' }, stage);
      const words = [];
      l.text.split(' / ').forEach((row) => {
        const r = el('div', '', { whiteSpace: 'nowrap' }, box);
        row.split(' ').forEach((w, j) => {
          const i = words.length, clip = el('span', '', { display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em', marginRight: '0.24em' }, r);
          words.push(el('span', '', { display: 'inline-block', transform: 'translateY(110%)', color: l.em.includes(i) ? INK.red : INK.black }, clip, w));
        });
      });
      return { box, words };
    });
    // The poster.
    S.title = el('div', 'abs', { left: '96px', top: '1000px', fontFamily: 'Mono', fontWeight: 500, fontSize: '22px', letterSpacing: '0.24em', color: INK.blue, opacity: 0 }, stage, 'SATURN RETURN — 29.5 YEARS');
    S.wm = el('div', 'abs', { left: '82px', top: '1040px', overflow: 'hidden', fontFamily: 'Inter', fontWeight: 900, fontSize: '212px', letterSpacing: '-0.06em', lineHeight: 1.04, color: INK.black, mixBlendMode: 'multiply' }, stage);
    S.wmIn = el('div', '', { transform: 'translateY(105%)' }, S.wm, 'Plutto');
    S.tag = el('div', 'abs', { left: '90px', top: '1268px', overflow: 'hidden', fontFamily: 'Inter', fontWeight: 700, fontSize: '56px', letterSpacing: '-0.03em', lineHeight: 1.1, color: INK.blue, mixBlendMode: 'multiply' }, stage);
    S.tagIn = el('div', '', { transform: 'translateY(105%)' }, S.tag, 'ask what it came back for.');
    S.stamp = stamp(stage, 'PLUTTO.SPACE', { top: 1360, ink: INK.red, border: INK.black, size: 26, tilt: -3 });
    S.stamp.wrap.style.justifyContent = 'flex-start'; S.stamp.wrap.style.paddingLeft = '90px';
    S.colo = colophon(stage, 'SCREENPRINT — THREE INKS, ONE ORBIT', 'N° 004', { ink: INK.black });
  },
  async frame(t) {
    const g = S.g; g.clearRect(0, 0, W, H);
    // The beat, for the plates' shake.
    const beat = Math.pow(1 - ((t % 0.6) / 0.6), 6) * (t < BRAND ? 1 : 0);
    // Saturn, a halftone: the bands turn, the light comes from the upper left.
    const spin = t * 0.35, dot = 11;
    const planet = (ink, dx, dy, ang, weight) => {
      const a = ang * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), n = Math.ceil(P.r / dot) + 1;
      g.fillStyle = ink; g.beginPath();
      for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) {
        const gx = i * dot, gy = j * dot, x = gx * ca - gy * sa, y = gx * sa + gy * ca, u = x / P.r, v = y / P.r, rr = u * u + v * v;
        if (rr > 1) continue;
        const nz = Math.sqrt(1 - rr), lit = Math.max(0, -0.5 * u - 0.55 * v + 0.67 * nz);
        const band = 0.5 + 0.5 * Math.sin(v * 13 + Math.sin(u * 3 + spin) * 0.8);
        const d = weight * (0.2 + 0.8 * (1 - lit)) * (0.55 + 0.45 * band);
        if (d < 0.04) continue;
        const rad = dot * 0.62 * Math.sqrt(Math.min(1, d));
        g.moveTo(P.x + x + dx + rad, P.y + y + dy); g.arc(P.x + x + dx, P.y + y + dy, rad, 0, 6.2832);
      }
      g.fill();
    };
    const ring = (half) => {
      g.save(); g.translate(P.x - 4 * beat, P.y + 3 * beat); g.rotate(-0.36);
      g.beginPath(); g.rect(-500, half < 0 ? -200 : 0, 1000, 200); g.clip();
      g.fillStyle = INK.red; g.beginPath();
      g.ellipse(0, 0, 400, 104, 0, 0, 6.2832); g.ellipse(0, 0, 300, 70, 0, 0, 6.2832, true); g.fill('evenodd');
      g.fillStyle = CREAM; g.beginPath(); g.ellipse(0, 0, 352, 88, 0, 0, 6.2832); g.ellipse(0, 0, 344, 85, 0, 0, 6.2832, true); g.fill('evenodd');   // the Cassini gap
      g.restore();
    };
    const born = ease.outBack(prog(t, 0.1, 1.1));
    if (born > 0) {
      g.save(); g.translate(P.x, P.y); g.scale(born, born); g.translate(-P.x, -P.y);
      ring(-1);
      planet(INK.blue, 3 * beat, -2 * beat, 15, 1);
      planet(INK.black, -2 * beat, 2 * beat, 45, 0.22);
      ring(1);
      g.restore();
    }
    // The numeral counts the years; it lands on 29½ as the orbit closes.
    const yrs = 29.5 * ease.inOutSine(prog(t, 0.5, ORB.done));
    S.num.textContent = yrs >= 29.5 ? '29½' : String(Math.floor(yrs));
    // The orbit diagram: the dot goes round once and clicks into the notch.
    const o = prog(t, 0.5, ORB.done), home = ease.outCubic(prog(t, ORB.done, ORB.done + 0.5));
    g.strokeStyle = INK.black; g.lineWidth = 2.5; g.beginPath(); g.arc(ORB.x, ORB.y, ORB.r, 0, 6.2832); g.stroke();
    g.lineWidth = 6; g.strokeStyle = INK.red; g.beginPath(); g.arc(ORB.x, ORB.y, ORB.r, -Math.PI / 2, -Math.PI / 2 + 6.2832 * ease.inOutSine(o)); g.stroke();
    g.fillStyle = INK.black; g.fillRect(ORB.x - 2, ORB.y - ORB.r - 18, 4, 36);                          // the notch: birth
    g.font = '500 15px Mono'; g.textAlign = 'center'; g.fillText('BIRTH', ORB.x, ORB.y - ORB.r - 28);
    const a = -Math.PI / 2 + 6.2832 * ease.inOutSine(o);
    g.fillStyle = INK.red; g.beginPath(); g.arc(ORB.x + Math.cos(a) * ORB.r, ORB.y + Math.sin(a) * ORB.r, 13 + 10 * home * (1 - home) * 4, 0, 6.2832); g.fill();
    // The lines wipe up word by word, and out upward when the next arrives.
    S.lines.forEach(({ box, words }, li) => {
      const l = SAY[li], next = SAY[li + 1]?.t ?? BRAND;
      words.forEach((w, i) => {
        const p = ease.outExpo(prog(t, l.t + i * STAG, l.t + i * STAG + 0.5)), q = ease.inCubic(prog(t, next - 0.3 + i * 0.02, next + i * 0.02));
        w.style.transform = `translateY(${(1 - p) * 110 - q * 110}%)`;
      });
    });
    // The poster.
    const tt = ease.outCubic(prog(t, BRAND + 0.5, BRAND + 1.1));
    S.title.style.opacity = tt; S.title.style.clipPath = `inset(0 ${(1 - tt) * 100}% 0 0)`;
    S.wmIn.style.transform = `translateY(${(1 - ease.outExpo(prog(t, BRAND + 0.7, BRAND + 1.4))) * 105}%)`;
    S.tagIn.style.transform = `translateY(${(1 - ease.outExpo(prog(t, BRAND + 1.4, BRAND + 2.0))) * 105}%)`;
    stampIn(S.stamp, t, BRAND + 2.5);
    colophonIn(S.colo, t, BRAND + 2.8, 0.7);
  },
};
