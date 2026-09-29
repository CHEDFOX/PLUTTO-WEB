/**
 * CINEMA 01 · 3:07 — a bedside clock, a heartbeat, a phone lighting up, a
 * figure at a window over the city. Three words on three hits, silence, and
 * the drop: the real app, answering "Should I take the job?".
 */
import { cinema, title, show, phone3d, cineEnd, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { clockShot, cityShot } from '../shots.js';

const WAKE = b(8), CUT = b(10), HOLE = b(14), DROP = b(15), END = b(23);
const WORDS = [[CUT, 'Take the job.'], [b(11), 'Leave the city.'], [b(12), 'Start again.']];
let S = {};
export default {
  duration: 18,
  poster: 11.2,
  score() {
    const c = [
      { i: 'room', t: 0, end: HOLE, g: 0.03 },
      { i: 'pad', t: 0.2, end: HOLE, ns: [50, 57, 62, 65], g: 0.07 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'whoosh', t: WAKE - 0.5, dur: 0.7, g: 0.25, from: 0.6, to: 0.2 },
      { i: 'bell', t: WAKE, n: 86, g: 0.1, dur: 2 },
      { i: 'pulse', t: b(6), end: HOLE, n: 50, g: 0.14 },
      { i: 'riser', t: CUT, end: HOLE, g: 0.5 },
      { i: 'roll', t: b(12), end: HOLE, g: 0.6 },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.4, g: 0.62 },
      { i: 'groove', t: DROP, bars: 2, n: 38 },
      { i: 'braam', t: b(19), n: 41, dur: 2, g: 0.42 },
      { i: 'reverse', end: END, dur: 1.2, g: 0.35 },
      { i: 'boom', t: END, g: 0.7 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: 17.2, ns: [50, 57, 62], g: 0.06 },
    ];
    for (let k = 1; k < 10; k += 2) c.push({ i: 'heartbeat', t: b(k), g: 0.4 + k * 0.04 });
    WORDS.forEach(([t]) => c.push({ i: 'hit', t, g: 0.85 }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.clock = await clockShot();
    S.city = await cityShot();
    S.bed = phone3d(S.cine.props, 'chat', { w: 280, persp: 1100, lit: 0.5 });
    S.hero = phone3d(S.cine.props, 'chat', { w: 610 });
    const T = S.cine.titles;
    S.t1 = title(T, 'Everyone’s asleep.', { kind: 'italic', top: 390 });
    S.t2 = title(T, 'Except the question.', { kind: 'italic', top: 390 });
    S.words = WORDS.map(([, w]) => title(T, w, { kind: 'slab', size: 118, top: 360, width: 1000 }));
    S.hole = title(T, 'So you ask.', { kind: 'caps', top: 940 });
    S.h1 = title(S.cine.over, 'Five thousand years old.', { kind: 'italic', size: 78, top: 110 });
    S.h2 = title(S.cine.over, 'Talks back.', { kind: 'serif', size: 118, top: 196, style: { fontWeight: 600 } });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 1812 });
    S.end = cineEnd(stage, { line: 'Some questions don’t wait for morning.' });
  },
  async frame(t) {
    const { g } = S.cine, hits = [...WORDS.map((w) => w[0]), DROP];
    const shake = impulse(t, hits, 0.5) * (t >= DROP ? 1 : 0.5);
    let cam = {};
    const wake = ease.outCubic(prog(t, WAKE, WAKE + 0.4));
    S.bed.pose(t, { o: t < CUT ? 1 : 0, x: 250, y: 470, rx: 66, rz: -16, on: wake, glow: 0.6 });
    S.hero.pose(t, { o: 0 });
    if (t < CUT) {
      S.clock(g, t, { wake, colon: Math.floor(t) % 2 === 0 });
      const d = drift(t, 0.6);
      cam = { zoom: lerp(1.0, 1.12, ease.inOutSine(prog(t, 0, CUT))), oy: 55, x: d.x, y: d.y, bars: 250, fade: 1 - ease.outCubic(prog(t, 0.1, 1.1)),
        tint: ['rgba(10,40,70,1)', 'rgba(110,25,20,1)'], tintOpacity: 0.35 };
      await S.bed.at(0);
    } else if (t < HOLE) {
      S.city(g, t, { phone: ease.outCubic(prog(t, CUT, CUT + 0.6)) });
      const d = drift(t, 1);
      cam = { zoom: lerp(1.04, 1.2, ease.inCubic(prog(t, CUT, HOLE))), ox: 34, oy: 70, x: d.x, y: d.y, bars: 250,
        tint: ['rgba(0,80,120,1)', 'rgba(200,110,50,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 250 };
    } else {
      S.city(g, t);
      g.fillStyle = 'rgba(0,0,0,0.62)'; g.fillRect(0, 0, 1080, 1920);
      const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
      S.hero.pose(t, { x: 0, y: 120, s: lerp(0.9, 1.0, k) + 0.02 * prog(t, DROP, END), ry: lerp(-24, -7, k), rx: lerp(10, 4, k), rz: lerp(-3, 0, k) });
      await S.hero.at(2.4 + (t - DROP) * 1.2);
      // Then push in until the answer reads at phone size.
      const push = ease.inOutCubic(prog(t, b(19), b(21.5)));
      cam = { zoom: lerp(1, 1.85, push), ox: 47, oy: 40, bars: lerp(250, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))), flash: 0.85 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))),
        tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });
    show(S.t1, t, b(2), b(5.4));
    show(S.t2, t, b(6), b(9.4));
    S.words.forEach((e, i) => show(e, t, WORDS[i][0], i < 2 ? WORDS[i + 1][0] : HOLE, { mode: 'cut' }));
    show(S.hole, t, HOLE + 0.08, DROP - 0.15, { mode: 'fade', d: 0.25, out: 0.1 });
    show(S.h1, t, DROP + 0.5, b(19));
    show(S.h2, t, b(17), b(19.2), { mode: 'cut' });
    show(S.rec, t, DROP + 0.8, END - 0.3, { mode: 'fade' });
    S.end(t - END);
  },
};
