/** ABSTRACT 01 · COMPOSITION — Kandinsky's Bauhaus hand: circles, bars and triangles land on cream paper, one per note of a piano-stab house track. "Every chart is a composition." */
import { sheet, draw, paintAll, captions, showCaptions, absEnd, el, prog, ease } from '../abstract.js';
import { grid } from '../signal.js';

const INK = '#17171a', RED = '#d6402b', BLUE = '#1f4fb8', YEL = '#f2c230', PAPER = '#efe8d8';
const G = grid(118);
const { st, t } = G;
const DROP = t(2), END = t(6);
const CH = [[53, 56, 60, 63], [48, 51, 56, 60], [51, 55, 58, 62], [46, 50, 53, 58]];   // Fm · Ab · Eb · Bb-ish, a bar each over the drop

// the picture and the music, together: each mark is born on a note
const marks = [], cues = [{ i: 'tempo', bpm: 118 }, { i: 'room', t: 0, end: 15, g: 0.03 }];
const note = (at, m, c) => { marks.push({ at, ...m }); if (c) cues.push({ t: at, ...c }); };
// intro: the big elements, one per piano chord
note(0.4, { k: 'disc', x: 400, y: 760, r: 250, c: RED, dur: 0.5 }, { i: 'saw', ns: CH[0], dur: 0.9, a: 0.01, cut: 1800, env: 2, g: 0.45, verb: 0.4 });
cues.push({ i: 'subb', t: 0.4, n: 41, dur: 0.8, g: 0.4 }, { i: 'kick', t: 0.4, g: 0.7 });
note(t(0, 2), { k: 'bar', x: 150, y: 1180, len: 820, w: 30, a: -0.42, c: INK, dur: 0.35 }, { i: 'saw', ns: CH[1], dur: 0.7, a: 0.01, cut: 1800, env: 2, g: 0.4, verb: 0.4 });
cues.push({ i: 'subb', t: t(0, 2), n: 44, dur: 0.7, g: 0.4 }, { i: 'kick', t: t(0, 2), g: 0.7 });
note(t(1), { k: 'tri', x: 730, y: 520, r: 190, a: 0.3, c: BLUE, dur: 0.4 }, { i: 'saw', ns: CH[2], dur: 0.8, a: 0.01, cut: 1800, env: 2, g: 0.42, verb: 0.4 });
cues.push({ i: 'subb', t: t(1), n: 39, dur: 0.8, g: 0.4 }, { i: 'kick', t: t(1), g: 0.7 });
note(t(1, 2), { k: 'half', x: 300, y: 1330, r: 150, a: Math.PI, c: YEL, dur: 0.4 }, { i: 'saw', ns: CH[3], dur: 0.8, a: 0.01, cut: 1800, env: 2, g: 0.42, verb: 0.4 });
cues.push({ i: 'subb', t: t(1, 2), n: 46, dur: 0.7, g: 0.4 }, { i: 'kick', t: t(1, 2), g: 0.7 });
// the build: hats, a riser, then each eighth a small line fanning out of the red disc
for (let s = 8; s < 32; s += 2) cues.push({ i: 'hat', t: t(0, 0, s), g: 0.1 + (s - 8) * 0.004, p: s % 4 ? 0.3 : -0.3 });
for (let k = 0; k < 8; k++) note(t(1, 2) + k * st, { k: 'line', x: 400, y: 760, len: 330 + k * 20, a: -1.2 + k * 0.17, w: 6, c: INK, dur: 0.2 }, { i: 'synth', n: [72, 75, 79, 80, 84, 87, 91, 92][k], dur: st * 0.7, cut: 1200 + k * 400, q: 6, g: 0.28, echo: 0.2 });
cues.push({ i: 'riser', t: t(1), end: DROP - 0.14, g: 0.4 }, { i: 'reverse', end: DROP, dur: 0.8, g: 0.3 }, { i: 'silence', t: DROP - 0.14, end: DROP });
// the drop: four-on-the-floor, a stab on the off-eighths with a dot each, chords a bar, rings on the claps
cues.push({ i: 'boom', t: DROP, g: 0.6 }, { i: 'crash', t: DROP, g: 0.3 }, { i: 'pump', t: DROP, end: END, depth: 0.5 });
note(DROP, { k: 'ring', x: 400, y: 760, r: 330, w: 18, c: INK, dur: 0.5 });
const DOTS = [[720, 1000], [860, 1180], [980, 880], [620, 1420], [150, 500], [250, 320], [940, 1420], [120, 1500]];
let d = 0;
for (let b = 2; b < 6; b++) {
  const ch = CH[(b - 2) % 4];
  for (let k = 0; k < 4; k++) {
    cues.push({ i: 'kick', t: t(b, k), g: 0.95 }, { i: 'subb', t: t(b, k, 2), n: [41, 44, 39, 46][(b - 2) % 4], dur: st * 1.6, g: 0.5 }, { i: 'hat', t: t(b, k, 2), g: 0.18, open: true, p: 0.2 });
    if (k % 2) { cues.push({ i: 'clap', t: t(b, k), g: 0.8 }); note(t(b, k), { k: 'ring', x: 400, y: 760, r: 370 + ((b * 2 + k) % 3) * 40, w: 5, c: INK, dur: 0.35, alpha: 0.7 }); }
    for (const s of [0, 3]) if (!(k === 0 && s === 0 && b === 2)) {
      const [x, y] = DOTS[d++ % DOTS.length];
      const cc = [RED, BLUE, YEL, INK][d % 4];
      note(t(b, k, s), { k: 'disc', x, y, r: 22 + (d % 3) * 14, c: cc, dur: 0.25 }, { i: 'saw', ns: ch.map((n) => n + 12), dur: 0.1, cut: 2600, env: 2.6, g: 0.5, verb: 0.2, echo: 0.12 });
    }
  }
  for (let s = 0; s < 16; s++) cues.push({ i: 'shaker', t: t(b, 0, s), g: s % 4 === 2 ? 0.05 : 0.08, p: s % 2 ? 0.3 : -0.3 });
  // a bass pluck line each bar
  [[0, 65], [3, 68], [6, 72], [8, 68], [11, 65], [14, 63]].forEach(([s, n]) => cues.push({ i: 'synth', t: t(b, 0, s), n: n + (b % 2 ? 0 : -2), dur: st * 1.4, wave: 'sawtooth', cut: 900, env: 3, q: 4, g: 0.22, echo: 0.1 }));
}
// a second big shape per drop bar
note(t(3), { k: 'rect', x: 900, y: 1240, w: 180, h: 420, a: 0.5, c: BLUE, dur: 0.4 });
note(t(4), { k: 'checker', x: 760, y: 120, n: 6, s: 26, c: INK, dur: 0.6 });
note(t(5), { k: 'arc', x: 540, y: 1810, r: 520, a0: Math.PI * 1.1, a1: Math.PI * 1.9, w: 20, c: RED, dur: 0.6 });
// the end
cues.push({ i: 'boom', t: END, g: 0.8 }, { i: 'sting', t: END + 0.05, g: 0.9 }, { i: 'saw', t: END, ns: [53, 60, 65, 72], dur: 2.4, a: 0.02, rel: 1.4, cut: 1600, env: 1.6, g: 0.35, verb: 0.6 }, { i: 'subb', t: END, n: 41, dur: 1.4, g: 0.35 });

const S = {};
export default {
  duration: 14.6,
  poster: t(5, 2),
  score: () => cues,
  async setup(stage) {
    await Promise.all(['900 120px Inter', '800 66px Inter', '500 28px Mono', '700 84px Hand'].map((f) => document.fonts.load(f)));
    S.g = sheet(stage, { color: PAPER, seed: 3 });
    S.caps = captions(stage, [
      { t0: 0.5, t1: DROP - 0.1, y: 150, kind: 'cap', html: 'Kandinsky · Bauhaus · 1923' },
      { t0: 0.9, t1: DROP - 0.1, y: 200, kind: 'big', html: 'Every chart<br>is a<br>composition.' },
      { t0: DROP + 0.2, t1: t(4) - 0.1, y: 180, kind: 'mid', html: 'Nine planets.<br>Twelve houses.<br>One arrangement<br>only you have.' },
      { t0: t(4), t1: END - 0.1, y: 180, kind: 'mid', html: 'Plutto reads<br>the whole picture.' },
      { t0: t(4) + 0.3, t1: END - 0.1, y: 1740, kind: 'hand', html: 'not just your sun sign →', ink: RED, align: 'center' },
    ], { ink: INK });
    S.end = absEnd(stage, { ink: INK, paperColor: PAPER, accent: RED, line: 'Your chart, read whole.', sub: 'Vedic · Western · 100 more' });
  },
  async frame(t_) {
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    const kick = cues.filter((c) => c.i === 'kick' && c.t <= t_).reduce((a, c) => Math.max(a, Math.exp(-(t_ - c.t) * 10) * (c.g > 0.8 ? 1 : 0.4)), 0);
    g.save(); g.translate(540, 1200); g.scale(1 + kick * 0.012, 1 + kick * 0.012); g.translate(-540, -960);
    paintAll(g, marks, t_);
    g.restore();
    showCaptions(S.caps, t_);
    S.end(t_ - END);
  },
};
