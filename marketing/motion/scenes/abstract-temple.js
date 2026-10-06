/** ABSTRACT 02 · THE TEMPLE — Hilma af Klint: spirals, petals and concentric colour on pale paper, to bells and a choir. True story: she painted abstraction five years before anyone, and said the paintings were dictated. */
import { sheet, draw, paintAll, captions, showCaptions, absEnd, el, prog, ease } from '../abstract.js';
import { grid } from '../signal.js';

const INK = '#2a2430', PAPER = '#f1e9dd';
const ROSE = '#e39aa6', PEACH = '#f0b784', LILAC = '#b79fd6', SKY = '#8fb8d8', LEAF = '#9fbf8f', GOLD = '#d9b65a';
const G = grid(72);
const { st, t } = G;
const BLOOM = t(2), END = t(4);
const marks = [], cues = [{ i: 'tempo', bpm: 72 }, { i: 'room', t: 0, end: 16, g: 0.03 }];
const note = (at, m, c) => { marks.push({ at, ...m }); if (c) cues.push({ t: at, ...c }); };
// the choir underneath, a chord change at the bloom and the end
cues.push({ i: 'choir', t: 0, end: BLOOM, ns: [57, 61, 64], g: 0.26, vowel: 'u' }, { i: 'choir', t: BLOOM, end: END, ns: [55, 59, 62, 66], g: 0.3, vowel: 'o' }, { i: 'choir', t: END, end: 15.4, ns: [57, 61, 64, 69], g: 0.32, vowel: 'a' });
// intro: a spiral unwinds to a mallet arpeggio; a bell on each beat draws a ring
const ARP = [69, 73, 76, 81, 76, 73];
for (let b = 0; b < 2; b++) for (let s = 0; s < 16; s += 2) cues.push({ i: 'mallet', t: t(b, 0, s), n: ARP[(b * 8 + s / 2) % 6], g: 0.2, d: 0.9, echo: 0.3 });
note(0.3, { k: 'spiral', x: 540, y: 880, r: 380, turns: 4, w: 10, c: LILAC, dur: 3.4 });
[[0, 0, 300, ROSE], [0, 2, 240, PEACH], [1, 0, 180, SKY], [1, 2, 120, LEAF]].forEach(([b, k, r, c], i) => note(t(b, k), { k: 'ring', x: 540, y: 880, r, w: 26, c, dur: 1.4, alpha: 0.85 }, { i: 'bell', n: [69, 73, 76, 81][i], g: 0.14, dur: 3, verb: 0.65 }));
cues.push({ i: 'tom', t: t(1), f: 60, g: 0.3, verb: 0.7, d: 1.4 });
// the bloom: a riser into a soft boom; petals open two rings deep, one per mallet note; the altar discs
cues.push({ i: 'riser', t: t(1, 2), end: BLOOM - 0.1, g: 0.22 }, { i: 'reverse', end: BLOOM, dur: 1.2, g: 0.3 });
cues.push({ i: 'boom', t: BLOOM, g: 0.5 }, { i: 'tom', t: BLOOM, f: 48, g: 0.6, verb: 0.8, d: 2 }, { i: 'crash', t: BLOOM, g: 0.2, d: 2.5 });
note(BLOOM, { k: 'petals', x: 540, y: 880, r: 520, n: 10, c: ROSE, c2: PEACH, dur: 1.6 });
note(BLOOM + 0.5, { k: 'petals', x: 540, y: 880, r: 330, n: 8, c: SKY, c2: LILAC, a: 0.39, dur: 1.4 });
note(BLOOM + 1.0, { k: 'disc', x: 540, y: 880, r: 110, c: GOLD, dur: 0.9 });
note(BLOOM + 1.2, { k: 'disc', x: 540, y: 880, r: 48, c: INK, dur: 0.6 });
for (let b = 2; b < 4; b++) {
  for (let s = 0; s < 16; s += 2) cues.push({ i: 'mallet', t: t(b, 0, s), n: ARP[(b * 8 + s / 2) % 6] + (b === 3 ? 2 : 0), g: 0.22, d: 0.9, echo: 0.3 });
  for (let k = 0; k < 4; k++) { cues.push({ i: 'tom', t: t(b, k), f: k ? 72 : 52, g: k ? 0.18 : 0.4, verb: 0.7, d: k ? 0.6 : 1.4 }); if (k === 2) cues.push({ i: 'shaker', t: t(b, k), g: 0.05 }); }
  cues.push({ i: 'bell', t: t(b), n: [81, 85][b - 2], g: 0.13, dur: 3.5, verb: 0.7 }, { i: 'chop', t: t(b, 2), n: [69, 73][b - 2], dur: 0.6, g: 0.16, vowel: 'o', echo: 0.4 });
  // the small altar figures around: a disc + ring pair per beat, orbiting out
  for (let k = 0; k < 4; k++) {
    const a = ((b - 2) * 4 + k) / 8 * Math.PI * 2 - Math.PI / 2, R = 640, x = 540 + Math.cos(a) * R, y = 880 + Math.sin(a) * R * 1.25;
    note(t(b, k), { k: 'disc', x, y, r: 26, c: [ROSE, SKY, PEACH, LEAF][k], dur: 0.6 });
    note(t(b, k) + 0.2, { k: 'ring', x, y, r: 44, w: 5, c: INK, dur: 0.8, alpha: 0.6 });
  }
}
// the end
cues.push({ i: 'boom', t: END, g: 0.55 }, { i: 'sting', t: END + 0.05, g: 0.8 }, { i: 'bell', t: END + 0.4, n: 93, g: 0.1, dur: 4 });
[0, 0.3, 0.6, 0.9].forEach((k, i) => cues.push({ i: 'mallet', t: END + 0.8 + k, n: [69, 73, 76, 81][i], g: 0.18, d: 1.4, echo: 0.3 }));

const S = {};
export default {
  duration: 15.4,
  poster: t(3, 1),
  score: () => cues,
  async setup(stage) {
    await Promise.all(['900 120px Inter', '800 66px Inter', '500 28px Mono', 'italic 500 92px Cormorant'].map((f) => document.fonts.load(f)));
    S.g = sheet(stage, { color: PAPER, fibre: [120, 100, 90], wobble: 1.2, seed: 5 });
    S.caps = captions(stage, [
      { t0: 0.5, t1: BLOOM - 0.1, y: 150, kind: 'cap', html: 'Hilma af Klint · Stockholm · 1906' },
      { t0: 0.9, t1: BLOOM - 0.1, y: 200, kind: 'serif', html: 'She painted abstraction<br>five years before anyone.' },
      { t0: BLOOM + 0.3, t1: t(3) + 0.4, y: 1480, kind: 'serif', html: 'She said the paintings<br>were dictated.' },
      { t0: t(3) + 0.6, t1: END - 0.1, y: 1480, kind: 'serif', html: 'Some signs arrive<br>before we have words.' },
    ], { ink: INK });
    S.end = absEnd(stage, { ink: INK, paperColor: PAPER, accent: ROSE, line: 'Ask what yours say.', sub: 'The library of divination' });
  },
  async frame(t_) {
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    const breath = 1 + Math.sin(t_ * 1.2) * 0.006;
    g.save(); g.translate(540, 880); g.scale(breath, breath); g.rotate(Math.sin(t_ * 0.25) * 0.02); g.translate(-540, -880);
    paintAll(g, marks, t_, { pop: false });
    g.restore();
    showCaptions(S.caps, t_);
    S.end(t_ - END);
  },
};
