/** SIGNAL 01 · SIGNS — house, 120 bpm, F minor. An eye forms out of light; the build pulls it into a vortex; the drop throws it into a hexagram, the moon, Saturn; it ends as Plutto's ring. */
import { signal, grid, hits } from '../signal.js';

const G = grid(120);
const DROP = G.t(3), END = G.t(6);
// voicings (MIDI) and roots, one chord a bar
const CH = { Fm: [53, 56, 60, 65], Db: [49, 53, 56, 61], Eb: [51, 55, 58, 63], Ab: [48, 51, 56, 60] };
const ROOT = { Fm: 41, Db: 37, Eb: 39, Ab: 44 };
const BARS = ['Fm', 'Db', 'Eb', 'Fm', 'Db', 'Eb'];
// the hook, sixteenth → note, one line per drop bar
const HOOK = [[[0, 84], [3, 80], [6, 77], [8, 80], [10, 82], [12, 84, 3]], [[0, 84], [3, 80], [6, 77], [8, 80], [10, 77], [12, 75, 3]], [[0, 82], [3, 79], [6, 75], [8, 79], [10, 82], [12, 87, 4]]];

function song() {
  const { st, t } = G, c = [{ i: 'tempo', bpm: 120 }, { i: 'room', t: 0, end: 15, g: 0.03 }];
  // intro: a soft chord bed, vocal calls answering through the delay, hats coming in
  for (let b = 0; b < 2; b++) {
    const ch = CH[BARS[b]];
    c.push({ i: 'saw', t: t(b), ns: ch, dur: G.bar - 0.1, a: 0.5, rel: 0.8, cut: 650 + b * 250, env: 1.2, g: 0.2, verb: 0.5 });
  }
  [[0, 6, 80, 'a'], [0, 10, 77, 'o'], [1, 6, 82, 'a'], [1, 10, 80, 'e'], [1, 14, 77, 'o']].forEach(([b, s, n, v]) => c.push({ i: 'chop', t: t(b, 0, s), n, dur: 0.22, g: 0.24, vowel: v, echo: 0.45 }));
  for (let s = 0; s < 16; s += 2) c.push({ i: 'hat', t: t(1, 0, s), g: s % 4 ? 0.12 : 0.07 });
  c.push({ i: 'kick', t: t(1, 3), g: 0.35 });
  // build: the arp opens, kicks on every beat, the roll, the riser, then dead air
  const arp = [63, 67, 70, 75, 79, 75, 70, 67];
  for (let s = 0; s < 16; s++) c.push({ i: 'synth', t: t(2, 0, s), n: arp[s % 8], dur: st * 0.8, g: 0.3, cut: 700 + s * 260, q: 6, echo: 0.15 });
  c.push({ i: 'saw', t: t(2), ns: CH.Eb, dur: G.bar - 0.2, a: 0.3, cut: 900, env: 1, g: 0.4, verb: 0.4 });
  for (let k = 0; k < 4; k++) c.push({ i: 'kick', t: t(2, k), g: 0.55 + k * 0.08 });
  c.push({ i: 'roll', t: t(2, 1), end: DROP - 0.16, g: 0.55, from: 4, to: 22 });
  c.push({ i: 'riser', t: t(2), end: DROP - 0.16, g: 0.5 }, { i: 'reverse', end: DROP, dur: 1, g: 0.35 });
  c.push({ i: 'chop', t: t(2, 3, 2), n: 84, dur: 0.3, g: 0.35, vowel: 'a', echo: 0.5 });
  c.push({ i: 'silence', t: DROP - 0.16, end: DROP });
  // drop: four on the floor, a pumping chord stab, the vocal hook, an offbeat sub
  c.push({ i: 'boom', t: DROP, g: 0.7 }, { i: 'crash', t: DROP, g: 0.4 }, { i: 'fall', t: DROP + 0.1, dur: 1.8, g: 0.22 });
  c.push({ i: 'pump', t: DROP, end: END, depth: 0.6 });
  for (let b = 3; b < 6; b++) {
    const ch = CH[BARS[b]], root = ROOT[BARS[b]];
    for (let k = 0; k < 4; k++) {
      c.push({ i: 'kick', t: t(b, k), g: 0.95 }, { i: 'hat', t: t(b, k, 2), g: 0.2, open: true, p: 0.1 });
      c.push({ i: 'subb', t: t(b, k, 2), n: root, dur: st * 1.6, g: 0.5 });
      if (k % 2) c.push({ i: 'clap', t: t(b, k), g: 0.85 });
    }
    for (let s = 0; s < 16; s++) c.push({ i: 'shaker', t: t(b, 0, s), g: s % 4 === 2 ? 0.05 : 0.09, p: s % 2 ? 0.3 : -0.3 });
    hits('x..x..x...x..x..', t(b), st).forEach((x) => c.push({ i: 'saw', t: x, ns: ch.map((n) => n + 12), dur: 0.11, cut: 2600, env: 2.6, g: 0.55, verb: 0.2, echo: 0.1 }));
    HOOK[b - 3].forEach(([s, n, len = 1.5]) => {
      c.push({ i: 'chop', t: t(b, 0, s), n, dur: st * len, g: 0.42, vowel: s % 4 ? 'o' : 'a', echo: 0.22, scoop: 1 });
      c.push({ i: 'saw', t: t(b, 0, s), n: n - 12, dur: st * len, cut: 2200, g: 0.22, verb: 0.15 });
    });
  }
  // into the end: a snare fill, the impact, the sting, a long chord
  for (let s = 12; s < 16; s++) c.push({ i: 'snare', t: t(5, 0, s), g: 0.4 + (s - 12) * 0.12, verb: 0.2 });
  c.push({ i: 'boom', t: END, g: 0.85 }, { i: 'crash', t: END, g: 0.35 }, { i: 'sting', t: END + 0.05, g: 0.9 });
  c.push({ i: 'saw', t: END, ns: [...CH.Fm, 72], dur: 2.4, a: 0.02, rel: 1.4, cut: 1600, env: 1.6, g: 0.4, verb: 0.6 });
  c.push({ i: 'choir', t: END, end: 14.6, ns: [65, 68, 72], g: 0.35, vowel: 'a' });
  c.push({ i: 'subb', t: END, n: 41, dur: 1.4, g: 0.35 });
  c.push({ i: 'chop', t: END + 0.5, n: 77, dur: 0.5, g: 0.3, vowel: 'o', echo: 0.55 });
  return c;
}

export default signal({
  duration: 15,
  end: END,
  poster: G.t(4, 3),
  palette: ['#38e1ff', '#9b6bff', '#ff4fd8', 'rgba(70,40,190,0.55)', 'rgba(0,140,190,0.4)'],
  keys: [
    { t: 0, s: 'cloud' },
    { t: 0.5, s: 'eye', m: 2.4, stagger: 0.9 },
    { t: G.t(2), s: 'vortex', m: 1.1, stagger: 0.5 },
    { t: DROP, s: 'burst', m: 0.22, stagger: 0 },
    { t: DROP + 0.26, s: 'hexagram', m: 0.55, stagger: 0.18 },
    { t: G.t(4), s: 'moon', m: 0.5, stagger: 0.2 },
    { t: G.t(5), s: 'saturn', m: 0.5, stagger: 0.2, spin: 0.08 },
    { t: END, s: 'ring', m: 0.8, stagger: 0.25 },
  ],
  texts: [
    { t0: 0.6, t1: G.t(2) - 0.1, html: 'For 5,000 years', y: 1400, kind: 'cap' },
    { t0: 1.0, t1: G.t(2) - 0.1, html: 'we read the signs.', y: 1460, kind: 'big' },
    { t0: G.t(2, 0), t1: G.t(2, 1), html: 'The stars.', y: 1440, kind: 'big' },
    { t0: G.t(2, 1), t1: G.t(2, 2), html: 'The cards.', y: 1440, kind: 'big' },
    { t0: G.t(2, 2), t1: G.t(2, 3), html: 'The bones.', y: 1440, kind: 'big' },
    { t0: G.t(2, 3), t1: DROP - 0.16, html: 'Your hand.', y: 1440, kind: 'big' },
    { t0: DROP + 0.3, t1: G.t(4) - 0.05, html: 'I Ching', y: 1460, kind: 'mid' },
    { t0: DROP + 0.4, t1: G.t(4) - 0.05, html: 'China · 3,000 years', y: 1550, kind: 'cap' },
    { t0: G.t(4) + 0.1, t1: G.t(5) - 0.05, html: 'The moon', y: 1460, kind: 'mid' },
    { t0: G.t(4) + 0.2, t1: G.t(5) - 0.05, html: '27 lunar mansions', y: 1550, kind: 'cap' },
    { t0: G.t(5) + 0.1, t1: END - 0.05, html: 'Saturn', y: 1460, kind: 'mid' },
    { t0: G.t(5) + 0.2, t1: END - 0.05, html: 'Your chart, today', y: 1550, kind: 'cap' },
  ],
  endLine: 'Now the signs answer.',
  song,
});
