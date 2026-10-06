/** ABSTRACT 03 · ZERO — Malevich's Suprematism: a black square, then red and black planes fly across white to a techno pulse. "A horoscope is a picture. A chart is a system." */
import { sheet, draw, paintAll, captions, showCaptions, absEnd, el, prog, ease } from '../abstract.js';
import { grid } from '../signal.js';

const INK = '#111113', RED = '#c8321f', PAPER = '#f3f1ea';
const G = grid(128);
const { st, t } = G;
const DROP = t(2), END = t(6);
const marks = [], cues = [{ i: 'tempo', bpm: 128 }, { i: 'room', t: 0, end: 15, g: 0.03 }];
const note = (at, m, c) => { marks.push({ at, ...m }); if (c) cues.push({ t: at, ...c }); };
// intro: the black square on a single boom, a pulse ticking under it
cues.push({ i: 'boom', t: 0.3, g: 0.55 });
note(0.3, { k: 'rect', x: 540, y: 820, w: 520, h: 520, c: INK, dur: 0.3 });
cues.push({ i: 'pulse', t: 0.3, end: DROP - 0.12, n: 45, bpm: 128, g: 0.16, open: [300, 3000] });
for (let s = 0; s < 32; s += 4) cues.push({ i: 'kick', t: t(0, 0, s), g: s < 16 ? 0.45 : 0.7 });
for (let s = 16; s < 32; s += 2) cues.push({ i: 'hat', t: t(0, 0, s), g: 0.12, p: s % 4 ? 0.3 : -0.3 });
// the square tilts: each beat of bar 2 a thin bar flies out of it
for (let k = 0; k < 4; k++) note(t(1, k), { k: 'bar', x: 540, y: 820, len: 420 + k * 60, w: 14, a: -0.9 + k * 0.25, c: k % 2 ? RED : INK, dur: 0.25 }, { i: 'synth', n: [57, 60, 64, 67][k], dur: st, wave: 'square', cut: 800 + k * 500, q: 5, g: 0.26, echo: 0.15 });
cues.push({ i: 'riser', t: t(1), end: DROP - 0.12, g: 0.45 }, { i: 'roll', t: t(1, 2), end: DROP - 0.12, g: 0.4, from: 6, to: 28 }, { i: 'silence', t: DROP - 0.12, end: DROP });
// the drop: techno — kick, offbeat open hat, a rumbling sub, a stab; planes fly in on every stab
cues.push({ i: 'boom', t: DROP, g: 0.7 }, { i: 'crash', t: DROP, g: 0.3 }, { i: 'pump', t: DROP, end: END, depth: 0.6 });
const PLANES = [
  { x: 300, y: 420, w: 420, h: 90, a: -0.55, c: RED }, { x: 760, y: 1300, w: 560, h: 60, a: -0.55, c: INK }, { x: 220, y: 1500, w: 180, h: 180, a: -0.55, c: INK },
  { x: 820, y: 560, w: 260, h: 40, a: -0.55, c: RED }, { x: 640, y: 1100, w: 120, h: 380, a: -0.55, c: RED }, { x: 160, y: 1000, w: 300, h: 34, a: 0.3, c: INK },
  { x: 900, y: 1620, w: 90, h: 90, a: -0.55, c: RED }, { x: 400, y: 1640, w: 480, h: 24, a: -0.55, c: INK }, { x: 760, y: 280, w: 60, h: 60, a: 0.2, c: INK },
  { x: 120, y: 300, w: 200, h: 26, a: -0.55, c: RED }, { x: 960, y: 900, w: 46, h: 300, a: -0.55, c: INK }, { x: 540, y: 1780, w: 700, h: 18, a: 0, c: INK },
];
let pi = 0;
for (let b = 2; b < 6; b++) {
  for (let k = 0; k < 4; k++) {
    cues.push({ i: 'kick', t: t(b, k), g: 0.95 }, { i: 'hat', t: t(b, k, 2), g: 0.22, open: true }, { i: 'subb', t: t(b, k, 1), n: 33, dur: st * 2.6, g: 0.45 });
    if (k % 2) cues.push({ i: 'clap', t: t(b, k), g: 0.6 }, { i: 'snare', t: t(b, k), g: 0.5, verb: 0.15 });
    for (let s = 0; s < 4; s += 1) cues.push({ i: 'hat', t: t(b, k, s), g: s % 2 ? 0.07 : 0.11, p: s % 2 ? 0.35 : -0.35 });
  }
  // the stab pattern, a plane on each
  [[0, 57], [3, 57], [6, 60], [10, 57], [13, 55]].forEach(([s, n], j) => {
    cues.push({ i: 'saw', t: t(b, 0, s), ns: [n, n + 7, n + 12], dur: 0.08, cut: 2200, env: 3, q: 1.5, g: 0.5, verb: 0.15, echo: 0.1, oct: true });
    if (pi < PLANES.length && (j % 2 === 0 || b > 3)) note(t(b, 0, s), { ...PLANES[pi++], k: 'rect', dur: 0.18 });
  });
  cues.push({ i: 'synth', t: t(b, 3, 2), n: 69, dur: st * 1.5, wave: 'square', cut: 2600, env: 2, q: 3, g: 0.14, echo: 0.3 });
}
// the square itself leans further into the drop
note(DROP, { k: 'rect', x: 540, y: 820, w: 520, h: 520, a: -0.55, c: INK, dur: 0.3 });
cues.push({ i: 'boom', t: END, g: 0.85 }, { i: 'sting', t: END + 0.05, g: 0.9 }, { i: 'subb', t: END, n: 33, dur: 1.6, g: 0.4 }, { i: 'saw', t: END, ns: [45, 52, 57, 64], dur: 2, a: 0.02, rel: 1.2, cut: 1200, env: 1.5, g: 0.3, verb: 0.5 });

const S = {};
export default {
  duration: 14.6,
  poster: t(5, 2),
  score: () => cues,
  async setup(stage) {
    await Promise.all(['900 120px Inter', '800 66px Inter', '500 28px Mono'].map((f) => document.fonts.load(f)));
    S.g = sheet(stage, { color: PAPER, fibre: [100, 100, 100], wobble: 0.8, seed: 7 });
    S.caps = captions(stage, [
      { t0: 0.5, t1: DROP - 0.1, y: 150, kind: 'cap', html: 'Malevich · Black Square · 1915' },
      { t0: 0.8, t1: t(1) - 0.1, y: 1240, kind: 'big', html: 'A horoscope<br>is a picture.' },
      { t0: t(1), t1: DROP - 0.12, y: 1240, kind: 'big', html: 'A chart is<br>a system.' },
      { t0: DROP + 0.2, t1: t(4) - 0.1, y: 150, kind: 'cap', html: 'Positions · angles · periods · transits' },
      { t0: t(4), t1: END - 0.1, y: 150, kind: 'cap', html: 'To the second · 102 traditions' },
    ], { ink: INK });
    S.end = absEnd(stage, { ink: INK, paperColor: PAPER, accent: RED, line: 'Your system, running.', sub: 'Free to start · Android · Web' });
  },
  async frame(t_) {
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    const kick = cues.filter((c) => c.i === 'kick' && c.g > 0.8 && c.t <= t_).reduce((a, c) => Math.max(a, Math.exp(-(t_ - c.t) * 12)), 0);
    const flare = t_ >= DROP ? Math.exp(-(t_ - DROP) * 2) : 0;
    g.save(); g.translate(540 + Math.sin(t_ * 90) * flare * 8, 960 + Math.cos(t_ * 70) * flare * 8); g.scale(1 + kick * 0.015, 1 + kick * 0.015); g.translate(-540, -960);
    // the first square is painted over by the tilted one after the drop
    paintAll(g, marks.filter((m) => !(m.at === 0.3 && t_ >= DROP)), t_);
    g.restore();
    showCaptions(S.caps, t_);
    S.end(t_ - END);
  },
};
