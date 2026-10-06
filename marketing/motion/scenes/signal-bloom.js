/** SIGNAL 03 · BLOOM — afro house, 122 bpm, A minor. A lotus of light; the build pulls it in; the drop writes hello in Hindi, Arabic and Japanese; it ends as Plutto's ring. */
import { signal, grid, hits, word } from '../signal.js';

const G = grid(122);
const DROP = G.t(3), END = G.t(6);
const CH = { Am: [57, 60, 64, 69], F: [53, 57, 60, 65], G: [55, 59, 62, 67] };
const ROOT = { Am: 45, F: 41, G: 43 };
const DROPBARS = ['Am', 'F', 'G'];
const OST = [69, 72, 76, 72, 79, 76, 72, 74];
const HOOK = [[0, 76], [2, 79], [4, 81], [7, 79], [10, 76], [12, 74], [14, 72]];
const WORDS = [['नमस्ते', 'Deva', 'Namaste', 'Hindi'], ['مرحبا', 'Arabic', 'Marhaba', 'Arabic'], ['こんにちは', 'JP', 'Konnichiwa', 'Japanese']];

function song() {
  const { st, t } = G, c = [{ i: 'tempo', bpm: 122 }, { i: 'room', t: 0, end: 15, g: 0.03 }];
  // intro: a marimba figure, a hum, hand drums waking up
  c.push({ i: 'choir', t: 0, end: DROP, ns: [57, 60, 64], g: 0.3, vowel: 'u' });
  for (let b = 0; b < 2; b++) hits('x.x..x.x..x.x...', t(b), st).forEach((x, k) => c.push({ i: 'mallet', t: x, n: OST[k % 8], g: 0.38, d: 0.45, echo: 0.2 }));
  for (let b = 0; b < 2; b++) hits('x.....x...x.x...', t(b), st).forEach((x, k) => c.push({ i: 'conga', t: x, f: k % 2 ? 260 : 190, g: 0.22 + b * 0.1, p: -0.3 }));
  for (let s = 0; s < 16; s++) c.push({ i: 'shaker', t: t(1, 0, s), g: s % 2 ? 0.04 : 0.06 });
  // build: a sung climb, a drum roll, the riser, dead air
  [69, 72, 74, 76, 79, 81, 84, 86].forEach((n, k) => c.push({ i: 'chop', t: t(2, 0, k * 2), n, dur: st * 1.6, g: 0.22 + k * 0.02, vowel: k % 2 ? 'o' : 'a', echo: 0.25 }));
  for (let x = t(2), k = 0; x < DROP - 0.18; k++) { const p = (x - t(2)) / G.bar; c.push({ i: 'conga', t: x, f: k % 2 ? 240 : 200, g: 0.2 + p * 0.35, slap: k % 3 === 0, p: k % 2 ? 0.3 : -0.3 }); x += st * (1.6 - p * 1.1); }
  for (let k = 0; k < 4; k++) c.push({ i: 'kick', t: t(2, k), g: 0.5 + k * 0.08 });
  c.push({ i: 'riser', t: t(2), end: DROP - 0.18, g: 0.42 }, { i: 'reverse', end: DROP, dur: 0.9, g: 0.3 });
  c.push({ i: 'silence', t: DROP - 0.18, end: DROP });
  // drop: the groove — kick, hand drums, 3-3-2 rim, a rolling bass, plucked chords, the marimba hook, voices answering
  c.push({ i: 'boom', t: DROP, g: 0.65 }, { i: 'crash', t: DROP, g: 0.35 }, { i: 'fall', t: DROP + 0.1, dur: 1.6, g: 0.18 });
  c.push({ i: 'pump', t: DROP, end: END, depth: 0.45 });
  DROPBARS.forEach((name, j) => {
    const b = 3 + j, ch = CH[name], root = ROOT[name];
    for (let k = 0; k < 4; k++) c.push({ i: 'kick', t: t(b, k), g: 0.92 }, { i: 'hat', t: t(b, k, 2), g: 0.16, open: true, p: 0.15 });
    for (let s = 0; s < 16; s++) c.push({ i: 'shaker', t: t(b, 0, s), g: s % 4 === 2 ? 0.1 : 0.06, p: s % 2 ? 0.35 : -0.2 });
    hits('x..x..x.x..x..x.', t(b), st).forEach((x) => c.push({ i: 'rim', t: x, g: 0.2, p: 0.25 }));
    hits('..x...x...x.x..x', t(b), st).forEach((x, k) => c.push({ i: 'conga', t: x, f: [190, 260, 260, 190][k % 4], g: 0.34, slap: k % 4 === 1, p: -0.35 }));
    c.push({ i: 'clap', t: t(b, 1), g: 0.6 }, { i: 'clap', t: t(b, 3), g: 0.6 });
    hits('x..x..x.....x...', t(b), st).forEach((x, k) => c.push({ i: 'subb', t: x, n: k === 3 ? root + 12 : root, dur: st * 2.2, g: 0.5 }));
    hits('..x...x...x...x.', t(b), st).forEach((x) => c.push({ i: 'saw', t: x, ns: ch.map((n) => n + 12), dur: 0.09, cut: 1500, env: 3, q: 2, g: 0.45, verb: 0.25, echo: 0.15 }));
    HOOK.forEach(([s, n]) => c.push({ i: 'mallet', t: t(b, 0, s), n: n + (j === 2 ? 2 : 0), g: 0.34, d: 0.5, echo: 0.15 }));
    c.push({ i: 'chop', t: t(b, 3), n: 84, dur: st * 1.5, g: 0.32, vowel: 'a', echo: 0.3 }, { i: 'chop', t: t(b, 3, 2), n: 81, dur: st * 1.8, g: 0.28, vowel: 'o', echo: 0.3 });
  });
  // the end
  c.push({ i: 'boom', t: END, g: 0.8 }, { i: 'sting', t: END + 0.05, g: 0.9 });
  c.push({ i: 'choir', t: END, end: 14.6, ns: [57, 60, 64, 69], g: 0.3, vowel: 'a' });
  c.push({ i: 'subb', t: END, n: 45, dur: 1.4, g: 0.35 });
  [69, 72, 76, 81, 84].forEach((n, k) => c.push({ i: 'mallet', t: END + 0.5 + k * st * 2, n, g: 0.22, d: 0.8, echo: 0.3 }));
  return c;
}

const wordKeys = WORDS.map(([w, f], j) => ({ t: j ? G.t(3 + j) : DROP + 0.26, s: `w${j}`, draw: word(w, f, 300), m: j ? 0.5 : 0.55, stagger: j ? 0.2 : 0.18 }));

export default signal({
  duration: 15,
  end: END,
  poster: G.t(3, 2),
  palette: ['#4dffc3', '#ff7a59', '#d6ff5c', 'rgba(0,140,110,0.5)', 'rgba(200,70,40,0.42)'],
  fonts: WORDS.map(([w, f]) => [`600 300px ${f}`, w]),
  keys: [
    { t: 0, s: 'cloud' },
    { t: 0.4, s: 'lotus', m: 2.3, stagger: 0.9, spin: 0.04 },
    { t: G.t(2), s: 'vortex', m: 1.0, stagger: 0.5 },
    { t: DROP, s: 'burst', m: 0.22, stagger: 0 },
    ...wordKeys,
    { t: END, s: 'ring', m: 0.8, stagger: 0.25 },
  ],
  texts: [
    { t0: 0.6, t1: G.t(2) - 0.1, html: 'Ask anything', y: 1400, kind: 'cap' },
    { t0: 0.9, t1: G.t(2) - 0.1, html: 'in your own words.', y: 1460, kind: 'big' },
    { t0: G.t(2, 0), t1: G.t(2, 1), html: 'Out loud.', y: 1440, kind: 'big' },
    { t0: G.t(2, 1), t1: G.t(2, 2), html: 'In writing.', y: 1440, kind: 'big' },
    { t0: G.t(2, 2), t1: G.t(2, 3), html: 'At 3 a.m.', y: 1440, kind: 'big' },
    { t0: G.t(2, 3), t1: DROP - 0.18, html: 'Anywhere.', y: 1440, kind: 'big' },
    ...WORDS.flatMap(([, , say, lang], j) => {
      const a = j ? G.t(3 + j) + 0.1 : DROP + 0.3, b = G.t(4 + j) - 0.05;
      return [{ t0: a, t1: b, html: say, y: 1460, kind: 'mid' }, { t0: a + 0.1, t1: b, html: lang, y: 1550, kind: 'cap' }];
    }),
  ],
  endLine: 'Ask in 109 languages.',
  endSub: 'Free to start · Android · Web',
  song,
});
