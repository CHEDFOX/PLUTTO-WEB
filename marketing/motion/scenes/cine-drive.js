/**
 * CINEMA 03 · OUT LOUD — a night drive; streetlights go over on the beat and
 * wash the cabin orange, faster and faster. "Some things you can only say out
 * loud." The drop: Plutto's voice mode, listening (the real recording).
 */
import { cinema, title, show, phone3d, cineEnd, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { roadShot } from '../shots.js';

const HOLE = b(14), DROP = b(15), END = b(23);
const PASSES = [2, 4, 6, 7, 8, 9, 10, 11, 12, 12.5, 13, 13.5, 15, 16, 17, 18, 19, 20, 21, 22].map(b);
let S = {};
export default {
  duration: 18,
  poster: 11.6,
  score() {
    const c = [
      { i: 'engine', t: 0, end: HOLE, g: 0.3 },
      { i: 'pad', t: 0.3, end: HOLE, ns: [45, 52, 57, 60], g: 0.06 },
      { i: 'groove', t: b(4), bars: 4, n: 33, style: 'sparse', g: 0.55 },
      { i: 'pulse', t: b(8), end: HOLE, n: 45, g: 0.14 },
      { i: 'riser', t: b(10), end: HOLE, g: 0.5 },
      { i: 'roll', t: b(12), end: HOLE, g: 0.55 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 33, dur: 2.4, g: 0.6 },
      { i: 'groove', t: DROP, bars: 2, n: 33, line: [0, 0, 3, -2] },
      { i: 'engine', t: DROP, end: END, g: 0.12 },
      { i: 'braam', t: b(19), n: 36, dur: 2, g: 0.4 },
      { i: 'reverse', end: END, dur: 1.2, g: 0.35 },
      { i: 'boom', t: END, g: 0.7 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: 17.2, ns: [45, 52, 57], g: 0.05 },
    ];
    PASSES.forEach((p, i) => { if (p < HOLE || p >= DROP) c.push({ i: 'whoosh', t: p - 0.3, dur: 0.6, g: p >= DROP ? 0.18 : 0.3, from: i % 2 ? -0.1 : 0.1, to: i % 2 ? -0.9 : 0.9 }); });
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.road = await roadShot({ passes: PASSES });
    S.hero = phone3d(S.cine.props, 'voice', { w: 610 });
    const T = S.cine.titles;
    S.cap = title(T, 'The long way home', { kind: 'caps', top: 330 });
    S.t1 = title(T, 'Some things you can only say out loud.', { kind: 'italic', top: 1000, width: 900 });
    S.t2 = title(T, 'Alone. In the car. At one in the morning.', { kind: 'italic', top: 1000, width: 900 });
    S.hole = title(T, 'So say it.', { kind: 'caps', top: 940 });
    S.h1 = title(S.cine.over, 'Say it out loud.', { kind: 'serif', size: 112, top: 150, style: { fontWeight: 600 } });
    S.h2 = title(S.cine.over, 'It answers.', { kind: 'italic', size: 96, top: 1560 });
    S.h3 = title(S.cine.over, 'In 109 languages', { kind: 'caps', size: 26, top: 1690 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 1812 });
    S.end = cineEnd(stage);
  },
  async frame(t) {
    const { g } = S.cine;
    const shake = impulse(t, [DROP], 0.6);
    let cam;
    S.hero.pose(t, { o: 0 });
    if (t < HOLE) {
      S.road(g, t);
      const d = drift(t, 0.5);
      cam = { zoom: lerp(1.0, 1.1, ease.inCubic(prog(t, 0, HOLE))), oy: 46, x: d.x, y: d.y, bars: 250, fade: 1 - ease.outCubic(prog(t, 0, 1.2)),
        tint: ['rgba(0,90,130,1)', 'rgba(240,130,50,1)'], tintOpacity: 0.45 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 250 };
    } else {
      S.road(g, t, { bump: 0.4 });
      g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 0, 1080, 1920);
      const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
      S.hero.pose(t, { x: 0, y: 40, s: lerp(0.88, 0.96, k), ry: lerp(-18, -6, k), rx: lerp(8, 3, k) });
      await S.hero.at(1 + (t - DROP) * 1.4);
      cam = { zoom: lerp(1, 1.22, ease.inOutSine(prog(t, DROP, END))), oy: 42, bars: lerp(250, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
        flash: 0.8 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))), flashColor: '#ffd9b0',
        tint: ['rgba(30,60,140,1)', 'rgba(230,120,60,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });
    show(S.cap, t, b(1), b(4), { mode: 'fade' });
    show(S.t1, t, b(4), b(8.4));
    show(S.t2, t, b(8.8), HOLE - 0.25);
    show(S.hole, t, HOLE + 0.08, DROP - 0.15, { mode: 'fade', d: 0.25, out: 0.1 });
    show(S.h1, t, DROP + 0.1, END - 0.3, { mode: 'cut' });
    show(S.h2, t, b(18), END - 0.3);
    show(S.h3, t, b(19.5), END - 0.3, { mode: 'fade' });
    show(S.rec, t, DROP + 0.8, b(17.8), { mode: 'fade', out: 0.2 });
    S.end(t - END);
  },
};
