/** SIGNAL 02 · ORBIT — trap, 140 bpm half-time, C minor. A sun of light; the build pulls it in; the drop throws it into the twelve houses, an eight-pointed star, a galaxy; it ends as Plutto's ring. */
import { signal, grid } from '../signal.js';

const G = grid(140);
const DROP = G.t(3), END = G.t(7);
// C harmonic minor: the bell line over the intro, the lead over the drop
const BELL = [[[0, 79], [4, 75], [8, 74], [12, 72]], [[0, 79], [4, 80], [8, 79], [12, 75]]];
const LEAD = [[0, 72], [3, 75], [6, 79], [8, 80], [10, 79], [12, 75], [14, 74]];
// the 808 line per bar: [sixteenth, note, glide-to]
const EIGHT = [[[0, 36], [6, 36], [10, 36, 39], [14, 34]], [[0, 32], [6, 32], [10, 36], [13, 31, 36]]];

function song() {
  const { st, t } = G, c = [{ i: 'tempo', bpm: 140 }, { i: 'room', t: 0, end: 15, g: 0.035 }];
  // intro: a dark choir, the bell line, a heartbeat of sub
  c.push({ i: 'choir', t: 0, end: DROP, ns: [60, 63, 67], g: 0.16, vowel: 'o' });
  for (let b = 0; b < 2; b++) BELL[b].forEach(([s, n]) => c.push({ i: 'bell', t: t(b, 0, s), n, g: 0.12, dur: 2.2, verb: 0.6 }));
  c.push({ i: 'eight', t: t(1), n: 36, dur: 0.6, g: 0.3 }, { i: 'eight', t: t(1, 2, 2), n: 36, dur: 0.5, g: 0.22 });
  for (let s = 0; s < 16; s += 2) c.push({ i: 'hat', t: t(1, 0, s), g: 0.07, p: 0.2 });
  // build: hats double, then triplet rolls; the riser; dead air
  for (let s = 0; s < 16; s++) c.push({ i: 'hat', t: t(2, 0, s), g: 0.08 + s * 0.006, p: s % 2 ? 0.3 : -0.3 });
  for (let x = t(2, 2); x < DROP - 0.2; x += st / 1.5) c.push({ i: 'hat', t: x, g: 0.1, p: 0.4 });
  c.push({ i: 'synth', t: t(2), n: 60, dur: G.bar - 0.3, wave: 'square', cut: 500, env: 6, q: 3, g: 0.22, verb: 0.3 });
  c.push({ i: 'riser', t: t(2), end: DROP - 0.2, g: 0.45 }, { i: 'reverse', end: DROP, dur: 0.9, g: 0.35 });
  c.push({ i: 'chop', t: t(2, 3), n: 79, dur: 0.35, g: 0.32, vowel: 'o', echo: 0.5 });
  c.push({ i: 'silence', t: DROP - 0.2, end: DROP });
  // drop: kick with the 808 and its slides, snare on three, rolling hats, the lead, adlibs
  c.push({ i: 'boom', t: DROP, g: 0.75 }, { i: 'crash', t: DROP, g: 0.35 }, { i: 'fall', t: DROP + 0.1, dur: 1.5, g: 0.2 });
  c.push({ i: 'pump', t: DROP, end: END, depth: 0.35 });
  c.push({ i: 'choir', t: DROP, end: END, ns: [60, 63, 67, 72], g: 0.2, vowel: 'a' });
  for (let b = 3; b < 7; b++) {
    const line = EIGHT[(b - 3) % 2];
    line.forEach(([s, n, to], j) => {
      const next = (line[j + 1]?.[0] ?? 16) - s;
      c.push({ i: 'kick', t: t(b, 0, s), g: 0.9 }, { i: 'eight', t: t(b, 0, s), n, dur: next * st * 0.95, g: 0.95, to, at: next * st * 0.55 });
    });
    c.push({ i: 'snare', t: t(b, 2), g: 0.9, verb: 0.25 }, { i: 'clap', t: t(b, 2), g: 0.7 });
    for (let s = 0; s < 16; s += 2) c.push({ i: 'hat', t: t(b, 0, s), g: s % 4 ? 0.11 : 0.16, p: s % 4 ? 0.25 : -0.15 });
    if (b % 2 === 0) for (let k = 0; k < 6; k++) c.push({ i: 'hat', t: t(b, 3) + (k * st * 4) / 6, g: 0.09 + k * 0.01, p: 0.35 });
    c.push({ i: 'hat', t: t(b, 1, 2), g: 0.16, open: true });
    LEAD.forEach(([s, n]) => c.push({ i: 'synth', t: t(b, 0, s), n: b % 2 ? n + 12 : n, dur: st * 1.6, wave: 'square', cut: 1800, env: 3, q: 2, g: 0.2, echo: 0.18, verb: 0.2 }));
    BELL[(b - 3) % 2].forEach(([s, n]) => c.push({ i: 'bell', t: t(b, 0, s), n: n + 12, g: 0.06, dur: 1.2 }));
    if (b === 4 || b === 6) c.push({ i: 'chop', t: t(b, 3, 2), n: 84, dur: 0.25, g: 0.3, vowel: 'a', echo: 0.5 });
  }
  // the end
  c.push({ i: 'boom', t: END, g: 0.85 }, { i: 'sting', t: END + 0.05, g: 0.9 });
  c.push({ i: 'eight', t: END, n: 36, dur: 2.2, g: 0.7, to: 24, at: 1.4 });
  c.push({ i: 'choir', t: END, end: 14.6, ns: [60, 63, 67, 72], g: 0.28, vowel: 'o' });
  c.push({ i: 'chop', t: END + 0.6, n: 79, dur: 0.6, g: 0.25, vowel: 'o', echo: 0.55 });
  return c;
}

export default signal({
  duration: 15,
  end: END,
  poster: G.t(4, 2),
  palette: ['#ff8a3d', '#ff3d6e', '#ffd1a1', 'rgba(190,50,40,0.5)', 'rgba(120,20,90,0.5)'],
  keys: [
    { t: 0, s: 'cloud' },
    { t: 0.4, s: 'sun', m: 2.2, stagger: 0.9, spin: 0.05 },
    { t: G.t(2), s: 'vortex', m: 1.0, stagger: 0.5 },
    { t: DROP, s: 'burst', m: 0.22, stagger: 0 },
    { t: DROP + 0.26, s: 'wheel', m: 0.55, stagger: 0.18, spin: 0.06 },
    { t: G.t(4) + G.bar / 2, s: 'star', m: 0.5, stagger: 0.2, spin: -0.05 },
    { t: G.t(6), s: 'galaxy', m: 0.5, stagger: 0.2, spin: 0.35 },
    { t: END, s: 'ring', m: 0.8, stagger: 0.25 },
  ],
  texts: [
    { t0: 0.6, t1: G.t(2) - 0.1, html: 'Your chart isn’t', y: 1400, kind: 'cap' },
    { t0: 0.9, t1: G.t(2) - 0.1, html: 'a horoscope.', y: 1460, kind: 'big' },
    { t0: G.t(2, 0), t1: G.t(2, 2), html: 'It’s the sky', y: 1440, kind: 'big' },
    { t0: G.t(2, 2), t1: DROP - 0.2, html: 'the second you arrived.', y: 1440, kind: 'big' },
    { t0: DROP + 0.3, t1: G.t(4) + G.bar / 2 - 0.05, html: '12 houses', y: 1460, kind: 'mid' },
    { t0: DROP + 0.4, t1: G.t(4) + G.bar / 2 - 0.05, html: 'Where it happens', y: 1550, kind: 'cap' },
    { t0: G.t(4) + G.bar / 2 + 0.1, t1: G.t(6) - 0.05, html: '9 planets', y: 1460, kind: 'mid' },
    { t0: G.t(4) + G.bar / 2 + 0.2, t1: G.t(6) - 0.05, html: 'What moves you', y: 1550, kind: 'cap' },
    { t0: G.t(6) + 0.1, t1: END - 0.05, html: 'One sky', y: 1460, kind: 'mid' },
    { t0: G.t(6) + 0.2, t1: END - 0.05, html: 'Read 102 ways', y: 1550, kind: 'cap' },
  ],
  endLine: 'Your chart, alive.',
  endSub: 'Free to start · Android · Web',
  song,
});
