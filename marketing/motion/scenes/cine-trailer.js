/**
 * CINEMA 05 · THE TRAILER — every world of the series, cut on the beat.
 *   0.0  HOOK: 3:07 and a buzzing phone. "Everyone has a 3 AM question."
 *   1.8  one per beat: The offer. The ex. The drive home. (recognition, three
 *        times — the viewer finds theirs)
 *   3.6  stone, then stars: "Five thousand years of asking."
 *   4.8  faster, and faster; silence; "Ask."
 *   6.0  DROP: TALKS BACK. — the real app, the real answer, the quote.
 *  10.8  the clock's colon becomes the Plutto ring. "What's yours?"
 */
import { cinema, title, show, phone3d, ringEnd, kinetic, kin, quote, impulse, b, lerp, prog, ease } from '../cine.js';
import { clockShot, cityShot, rainShot, roadShot, wallShot, skyShot, CARVINGS } from '../shots.js';
import { kickTimes } from '../sound.js';

const HOLE = b(9.5), DROP = b(10), PHONE = b(11), QUOTE = b(14), DOT = b(17.5), END = b(18);
const WORDS = [[b(3), 'The offer.'], [b(4), 'The ex.'], [b(5), 'The drive home.']];
const CUTS = [[0, 'clock'], [b(3), 'city'], [b(4), 'rain'], [b(5), 'road'], [b(6), 'wall'], [b(7), 'sky'],
  ...['clock', 'city', 'rain', 'road', 'wall', 'sky'].map((s, k) => [b(8 + k * 0.25), s])];
const KICKS = kickTimes(DROP, 2);
let S = {};
export default {
  duration: b(24),
  poster: b(15.5),
  score() {
    const c = [
      { i: 'buzz', t: 0.02, g: 0.6 }, { i: 'boom', t: 0, g: 0.55 },
      { i: 'pad', t: 0, end: HOLE, ns: [50, 57, 62, 65], g: 0.05 },
      { i: 'groove', t: b(3), bars: 1, n: 38, style: 'half', g: 0.8 },
      { i: 'pulse', t: b(3), end: HOLE, n: 50, g: 0.12 },
      { i: 'tom', t: b(6), f: 66, g: 0.9, verb: 0.7, d: 1.2 }, { i: 'tom', t: b(7), f: 60, g: 0.9, verb: 0.7, d: 1.2 },
      { i: 'riser', t: b(7), end: HOLE, g: 0.55 },
      { i: 'roll', t: b(8), end: HOLE, g: 0.6, from: 6, to: 30 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.2, g: 0.65 },
      { i: 'groove', t: DROP, bars: 2, n: 38 },
      { i: 'whoosh', t: QUOTE - 0.3, dur: 0.45, g: 0.35 }, { i: 'braam', t: QUOTE, n: 41, dur: 2, g: 0.45 },
      { i: 'reverse', end: END, dur: 0.9, g: 0.4 },
      { i: 'boom', t: END, g: 0.75 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: b(23), ns: [50, 57, 62], g: 0.05 },
    ];
    WORDS.forEach(([t]) => c.push({ i: 'hit', t, g: 0.8 }));
    CUTS.filter(([t]) => t >= b(8)).forEach(([t]) => c.push({ i: 'whoosh', t: t - 0.1, dur: 0.22, g: 0.2 }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.shots = { clock: await clockShot(), city: await cityShot(), rain: await rainShot(), road: await roadShot({ passes: Array.from({ length: 14 }, (_, k) => b(k + 2.5)) }), wall: await wallShot(), sky: await skyShot() };
    S.bed = phone3d(S.cine.props, 'chat', { w: 280, persp: 1100, lit: 0.55 });
    S.hero = phone3d(S.cine.props, 'chat', { w: 610 });
    const T = S.cine.titles;
    S.hook = kinetic(T, 'Everyone has a / 3 AM question.', { size: 124, top: 290, width: 1000, em: [3, 4] });
    S.words = WORDS.map(([, w]) => title(T, w, { kind: 'slab', size: 140, top: 1150, width: 1000 }));
    S.t1 = kinetic(T, 'Five thousand years of asking.', { size: 118, top: 320, width: 900 });
    S.hole = title(T, 'Ask.', { kind: 'caps', top: 940 });
    S.big = title(S.cine.over, 'Talks back.', { kind: 'slab', size: 170, top: 850, width: 1060 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 250 });
    S.quote = quote(T, 'Yes — but not for the reason you keep giving.', 'Plutto, asked “Should I take the job?” · in the app', { size: 118, top: 560, em: [3] });
    S.end = ringEnd(stage, { from: { x: 464, y: 1085, d: 130, rgb: '255,59,48' }, prompt: 'What’s yours?' });
  },
  async frame(t) {
    const { g } = S.cine;
    const dropK = impulse(t, [DROP], 0.6), hitK = impulse(t, [0, ...WORDS.map((w) => w[0]), b(6), b(7)], 0.3);
    const shake = hitK * 0.5 + dropK;
    const pulse = t >= DROP && t < DOT ? impulse(t, KICKS, 0.2) : 0;
    let cam;
    S.hero.pose(t, { o: 0 });
    S.bed.pose(t, { o: t < b(3) ? 1 : 0, x: 250 + (t < 0.44 || (t > 0.64 && t < 1.06) ? 5 * Math.sin(t * 190) : 0), y: 470, rx: 66, rz: -16, on: 1, glow: 0.6 });
    await S.bed.at(0);
    const tint = ['rgba(0,80,120,1)', 'rgba(230,120,55,1)'];
    if (t < HOLE) {
      const [c0, name] = CUTS.filter(([c]) => t >= c).pop(), lt = t - c0, fast = c0 >= b(8);
      const draw = S.shots[name];
      if (name === 'clock') draw(g, t, { wake: 1, colon: Math.floor(t * 1.2) % 2 === 0 });
      else if (name === 'city') draw(g, t, { phone: 1 });
      else if (name === 'rain') draw(g, t, { heavy: 0.5 });
      else if (name === 'road') draw(g, t);
      else if (name === 'wall') draw(g, t, { pan: CARVINGS[1].x - 540 + 60 - lt * 40, ly: CARVINGS[1].y + 420, flare: impulse(t, [c0], 0.6), radius: 760 });
      else draw(g, t, { exposure: 3 + lt * 2 });
      cam = { zoom: lerp(1.02, 1.1, ease.outCubic(prog(lt, 0, 1.2))) * (1 + 0.03 * hitK), oy: name === 'clock' ? 52 : 50, bars: 210,
        smear: fast ? (1 - prog(lt, 0, 0.12)) * (CUTS.findIndex((c) => c[0] === c0) % 2 ? 150 : -150) : 0,
        split: hitK * 12, flash: fast ? 0.2 * (1 - prog(lt, 0, 0.1)) : 0, leak: 0.3 * impulse(t, [b(6)], 0.9), tint, tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 210 };
    } else if (t < DOT) {
      S.shots.city(g, t);
      if (t < QUOTE) {
        g.fillStyle = `rgba(0,0,0,${t < PHONE ? 0.88 : 0.62})`; g.fillRect(0, 0, 1080, 1920);
        const k = ease.outExpo(prog(t, PHONE, PHONE + 1.2));
        S.hero.pose(t, { o: t >= PHONE ? 1 : 0, x: 0, y: 110, s: lerp(0.9, 1, k), ry: lerp(-24, -7, k), rx: lerp(10, 4, k), glow: 1 + pulse });
        await S.hero.at(2.4 + (t - PHONE) * 2.2);
        const push = ease.inOutCubic(prog(t, b(12.6), b(13.8)));
        cam = { zoom: lerp(1, 1.8, push), ox: 47, oy: 40, pulse, bars: lerp(210, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
          flash: 0.9 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.15))), split: dropK * 18,
          smear: t >= PHONE ? (1 - prog(t, PHONE, PHONE + 0.15)) * 150 : 0, tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.35 };
      } else {
        g.fillStyle = 'rgba(0,0,0,0.78)'; g.fillRect(0, 0, 1080, 1920);
        const w = 1 - ease.outCubic(prog(t, QUOTE, QUOTE + 0.3));
        cam = { zoom: 1.08, pulse, smear: w * 160, leak: 0.3 * w, tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.3 };
      }
    } else {
      S.shots.clock(g, t, { wake: 0, colon: true });
      cam = { zoom: lerp(3.2, 5, ease.outExpo(prog(t, DOT, END))), ox: 464 / 10.8, oy: 1085 / 19.2, smear: (1 - prog(t, DOT, DOT + 0.15)) * -120 };
    }
    S.cine.post(t, { ...cam, shake });
    kin(S.hook, t, -1.4, b(2.8));
    S.words.forEach((e, i) => show(e, t, WORDS[i][0], i < 2 ? WORDS[i + 1][0] : b(6), { mode: 'cut' }));
    kin(S.t1, t, b(6) + 0.05, b(7.8));
    show(S.hole, t, HOLE + 0.04, DROP - 0.08, { mode: 'fade', d: 0.15, out: 0.05 });
    show(S.big, t, DROP, PHONE, { mode: 'cut' });
    show(S.rec, t, PHONE + 0.6, QUOTE - 0.1, { mode: 'fade', out: 0.1 });
    S.quote(t, QUOTE + 0.2, DOT - 0.65);
    S.end(t - END);
  },
};
