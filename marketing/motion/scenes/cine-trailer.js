/**
 * CINEMA 05 · THE TRAILER — every world of the series, cut on the beat: the
 * 3 AM, the offer, the ex, the long way home; five thousand years of asking;
 * then faster, and faster, silence, and the drop — the app answering.
 */
import { cinema, title, show, phone3d, cineEnd, impulse, b, lerp, prog, ease } from '../cine.js';
import { clockShot, cityShot, rainShot, roadShot, wallShot, skyShot, CARVINGS } from '../shots.js';

const HOLE = b(14), DROP = b(15), END = b(23);
const WORDS = [[b(2), 'The 3 AM.'], [b(3), 'The offer.'], [b(4), 'The ex.'], [b(5), 'The long way home.']];
const CUTS = [[b(2), 'clock'], [b(3), 'city'], [b(4), 'rain'], [b(5), 'road'], [b(6), 'wall'], [b(8), 'sky'],
  ...['clock', 'city', 'rain', 'road', 'wall', 'sky', 'city', 'rain'].map((s, k) => [b(10 + k * 0.5), s])];
let S = {};
export default {
  duration: 18,
  poster: 10.2,
  score() {
    const c = [
      { i: 'boom', t: b(0.5), g: 0.7 }, { i: 'braam', t: b(0.5), n: 38, dur: 1.6, g: 0.45 },
      { i: 'pad', t: b(0.5), end: HOLE, ns: [50, 57, 62, 65], g: 0.05 },
      { i: 'groove', t: b(2), bars: 2, n: 38, style: 'half', g: 0.8 },
      { i: 'pulse', t: b(6), end: HOLE, n: 50, g: 0.13 },
      { i: 'bell', t: b(6), n: 81, g: 0.08, dur: 3 },
      { i: 'riser', t: b(10), end: HOLE, g: 0.55 },
      { i: 'roll', t: b(10), end: HOLE, g: 0.6, from: 3, to: 28 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.4, g: 0.65 },
      { i: 'groove', t: DROP, bars: 2, n: 38 },
      { i: 'braam', t: b(19), n: 41, dur: 2, g: 0.45 },
      { i: 'reverse', end: END, dur: 1.2, g: 0.35 },
      { i: 'boom', t: END, g: 0.7 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: 17.2, ns: [50, 57, 62], g: 0.05 },
    ];
    WORDS.forEach(([t]) => c.push({ i: 'hit', t, g: 0.8 }));
    [b(6), b(8)].forEach((t) => c.push({ i: 'tom', t, f: 66, g: 0.9, verb: 0.7, d: 1.2 }));
    CUTS.filter(([t]) => t >= b(10)).forEach(([t]) => c.push({ i: 'whoosh', t: t - 0.15, dur: 0.3, g: 0.2 }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.shots = { clock: await clockShot(), city: await cityShot(), rain: await rainShot(), road: await roadShot({ passes: Array.from({ length: 14 }, (_, k) => b(k + 2.5)) }), wall: await wallShot(), sky: await skyShot() };
    S.hero = phone3d(S.cine.props, 'chat', { w: 610 });
    const T = S.cine.titles;
    S.open = title(T, 'Everyone carries one question.', { kind: 'caps', top: 940, width: 1000 });
    S.words = WORDS.map(([, w]) => title(T, w, { kind: 'slab', size: 124, top: 1380, width: 1000 }));
    S.t1 = title(T, 'Five thousand years of asking.', { kind: 'italic', top: 1360, width: 900 });
    S.t2 = title(T, 'Something finally answers.', { kind: 'italic', top: 1360, width: 900 });
    S.hole = title(T, 'Ask.', { kind: 'caps', top: 940 });
    S.big = title(S.cine.over, 'Talks back.', { kind: 'slab', size: 150, top: 860, width: 1060 });
    S.h1 = title(S.cine.over, 'Five thousand years old.', { kind: 'italic', size: 78, top: 110 });
    S.h2 = title(S.cine.over, 'Talks back.', { kind: 'serif', size: 118, top: 196, style: { fontWeight: 600 } });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 1812 });
    S.end = cineEnd(stage, { line: 'Ask it anything.' });
  },
  async frame(t) {
    const { g } = S.cine;
    const shake = impulse(t, [b(0.5), ...WORDS.map((w) => w[0])], 0.4) * 0.6 + impulse(t, [DROP], 0.6);
    let cam;
    S.hero.pose(t, { o: 0 });
    const cur = CUTS.filter(([c]) => t >= c).pop();
    if (t < b(2) || t >= HOLE && t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 250 };
    } else if (t < DROP) {
      const [c0, name] = cur, lt = t - c0;
      const draw = S.shots[name];
      if (name === 'clock') draw(g, t, { wake: 1, colon: true });
      else if (name === 'city') draw(g, t, { phone: 1 });
      else if (name === 'rain') draw(g, t, { heavy: 0.5 });
      else if (name === 'road') draw(g, t);
      else if (name === 'wall') draw(g, t, { pan: CARVINGS[1].x - 540 + 60 - lt * 40, ly: CARVINGS[1].y + 420, flare: impulse(t, [c0], 0.6) });
      else draw(g, t, { exposure: 3 + lt * 2 });
      cam = { zoom: lerp(1.0, 1.08, ease.outCubic(prog(lt, 0, 1.2))), oy: name === 'clock' ? 52 : 50, bars: 250,
        flash: 0.45 * (1 - ease.outCubic(prog(t, c0, c0 + 0.2))) * (c0 >= b(10) ? 1 : 0.6),
        tint: ['rgba(0,80,120,1)', 'rgba(230,120,55,1)'], tintOpacity: 0.4 };
    } else {
      S.shots.city(g, t);
      g.fillStyle = 'rgba(0,0,0,0.62)'; g.fillRect(0, 0, 1080, 1920);
      const on = t >= b(16);
      const k = ease.outExpo(prog(t, b(16), b(16) + 1.2));
      S.hero.pose(t, { o: on ? 1 : 0, x: 0, y: 120, s: lerp(0.9, 1, k), ry: lerp(-24, -7, k), rx: lerp(10, 4, k) });
      await S.hero.at(2.4 + (t - b(16)) * 1.35);
      const push = ease.inOutCubic(prog(t, b(19), b(21.5)));
      cam = { zoom: lerp(1, 1.85, push), ox: 47, oy: 40, bars: lerp(250, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
        flash: 0.9 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.5))) + 0.5 * (1 - ease.outCubic(prog(t, b(16), b(16) + 0.3))) * (t >= b(16) ? 1 : 0),
        fade: on ? 0 : 0.35, tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });
    show(S.open, t, b(0.5), b(1.8), { mode: 'fade', d: 0.3, out: 0.15 });
    S.words.forEach((e, i) => show(e, t, WORDS[i][0], i < 3 ? WORDS[i + 1][0] : b(6), { mode: 'cut' }));
    show(S.t1, t, b(6) + 0.1, b(7.8), { out: 0.15 });
    show(S.t2, t, b(8) + 0.1, b(9.8), { out: 0.15 });
    show(S.hole, t, HOLE + 0.08, DROP - 0.15, { mode: 'fade', d: 0.25, out: 0.1 });
    show(S.big, t, DROP, b(16), { mode: 'cut' });
    show(S.h1, t, b(16) + 0.3, b(19));
    show(S.h2, t, b(17), b(19.2), { mode: 'cut' });
    show(S.rec, t, b(16) + 0.8, END - 0.3, { mode: 'fade' });
    S.end(t - END);
  },
};
