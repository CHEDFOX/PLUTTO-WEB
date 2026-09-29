/**
 * CINEMA 04 · FIVE THOUSAND YEARS — the brand film. Script carved in stone,
 * found by firelight on three drum hits: Egypt, Sumer, the North. Then the
 * sky, turning over a desert, and one figure looking up. "Every age asked
 * the same question." The drop turns it round: the app asking you — its
 * first question, for real — "When did you arrive on Earth?"
 */
import { cinema, title, show, phone3d, cineEnd, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { wallShot, skyShot, CARVINGS } from '../shots.js';

const DRUMS = [b(2), b(4), b(6)], SKY = b(8), ASK = b(11), HOLE = b(14), DROP = b(15), END = b(23);
// As the site's frieze has them (components/site/Ancient.js).
const WHERE = ['Egypt · 3000 BC', 'Sumer · 2500 BC', 'The North · 700 AD'];
let S = {};
export default {
  duration: 18.6,
  poster: 10.4,
  score() {
    const c = [
      { i: 'pad', t: 0, end: HOLE, ns: [38, 45, 50, 53], g: 0.07, bright: 420 },
      { i: 'braam', t: 0.3, n: 26, dur: 1.4, g: 0.35 },
      { i: 'whoosh', t: SKY - 0.5, dur: 0.8, g: 0.3 },
      { i: 'boom', t: SKY, g: 0.6 },
      { i: 'bell', t: SKY + 0.1, n: 81, g: 0.08, dur: 4 },
      { i: 'pulse', t: SKY, end: HOLE, n: 50, g: 0.13 },
      { i: 'hit', t: ASK, g: 0.9 }, { i: 'braam', t: ASK, n: 41, dur: 1.6, g: 0.45 },
      { i: 'riser', t: b(10), end: HOLE, g: 0.5 },
      { i: 'roll', t: b(12), end: HOLE, g: 0.55 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.4, g: 0.62 },
      { i: 'groove', t: DROP, bars: 2, n: 38, line: [0, 0, 5, 3] },
      { i: 'braam', t: b(19), n: 43, dur: 2, g: 0.42 },
      { i: 'reverse', end: END, dur: 1.2, g: 0.35 },
      { i: 'boom', t: END, g: 0.7 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: 17.8, ns: [50, 57, 62], g: 0.05 },
    ];
    // Taiko and a braam on each carving.
    DRUMS.forEach((t, k) => c.push({ i: 'tom', t, f: 68, g: 1, verb: 0.7, d: 1.3 }, { i: 'tom', t: t + 0.3, f: 90, g: 0.45, verb: 0.6 }, { i: 'braam', t, n: [38, 36, 41][k], dur: 1, g: 0.35 }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.wall = await wallShot();
    S.sky = await skyShot();
    S.hero = phone3d(S.cine.props, 'when', { w: 610 });
    const T = S.cine.titles;
    S.where = WHERE.map((w) => title(T, w, { kind: 'caps', top: 1480 }));
    S.t1 = title(T, 'Every age asked the same question.', { kind: 'italic', top: 470, width: 880 });
    S.ask = title(T, 'What happens next?', { kind: 'slab', size: 112, top: 520, width: 1000 });
    S.hole = title(T, 'Now it asks you.', { kind: 'caps', top: 940 });
    S.h1 = title(S.cine.over, 'Five thousand years old.', { kind: 'italic', size: 78, top: 110 });
    S.h2 = title(S.cine.over, 'Talks back.', { kind: 'serif', size: 118, top: 196, style: { fontWeight: 600 } });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 1812 });
    S.end = cineEnd(stage, { line: 'When did you arrive on Earth?', cta: 'Find out — plutto.space' });
  },
  async frame(t) {
    const { g } = S.cine;
    const shake = impulse(t, [...DRUMS, ASK], 0.5) * 0.7 + impulse(t, [DROP], 0.6);
    let cam;
    S.hero.pose(t, { o: 0 });
    if (t < SKY) {
      // Track along the wall, whipping to the next carving on each drum.
      let pan = CARVINGS[0].x - 540 + 160 * (1 - ease.outCubic(prog(t, 0, DRUMS[0])));
      DRUMS.forEach((d, k) => { if (k) pan = lerp(pan, CARVINGS[k].x - 540, ease.inOutCubic(prog(t, d - 0.18, d + 0.12))); });
      const k = DRUMS.filter((d) => t >= d - 0.05).length - 1, c = CARVINGS[Math.max(0, k)];
      const flare = impulse(t, DRUMS, 0.7);
      S.wall(g, t, { pan, lx: 540, ly: c.y + 420, radius: k < 0 ? 520 : 760, flare, light: k < 0 ? 0.45 : 1 });
      const d = drift(t, 0.6);
      cam = { zoom: lerp(1.08, 1.0, ease.outCubic(prog(t, 0, SKY))), x: d.x, y: d.y, bars: 250, fade: 1 - ease.outCubic(prog(t, 0, 1)),
        tint: ['rgba(20,60,90,1)', 'rgba(255,140,50,1)'], tintOpacity: 0.4 };
    } else if (t < HOLE) {
      S.sky(g, t - SKY, { exposure: 3, meteor: b(12.3) - SKY });
      const d = drift(t, 0.4);
      cam = { zoom: lerp(1.0, 1.14, ease.inCubic(prog(t, SKY, HOLE))), oy: 60, x: d.x, y: d.y, bars: 250,
        flash: 0.5 * (1 - ease.outCubic(prog(t, SKY, SKY + 0.3))), tint: ['rgba(10,50,120,1)', 'rgba(200,110,70,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 250 };
    } else {
      S.sky(g, t - SKY, { exposure: 3 });
      g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, 0, 1080, 1920);
      const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
      S.hero.pose(t, { x: 0, y: 120, s: lerp(0.9, 1, k), ry: lerp(-20, -6, k), rx: lerp(10, 3, k) });
      await S.hero.at(1.5 + (t - DROP) * 2.1);
      const push = ease.inOutCubic(prog(t, b(19), b(21.5)));
      cam = { zoom: lerp(1, 1.7, push), ox: 50, oy: 42, bars: lerp(250, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
        flash: 0.85 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))), tint: ['rgba(30,50,140,1)', 'rgba(210,110,70,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });
    S.where.forEach((e, k) => show(e, t, DRUMS[k] + 0.1, k < 2 ? DRUMS[k + 1] - 0.25 : SKY - 0.25, { mode: 'fade', d: 0.3, out: 0.15 }));
    show(S.t1, t, SKY + 0.4, ASK - 0.2, { out: 0.2 });
    show(S.ask, t, ASK, HOLE, { mode: 'cut' });
    show(S.hole, t, HOLE + 0.08, DROP - 0.15, { mode: 'fade', d: 0.25, out: 0.1 });
    show(S.h1, t, DROP + 0.4, b(19));
    show(S.h2, t, b(17), b(19.2), { mode: 'cut' });
    show(S.rec, t, DROP + 0.8, END - 0.3, { mode: 'fade' });
    S.end(t - END);
  },
};
