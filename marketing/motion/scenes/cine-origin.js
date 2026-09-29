/**
 * CINEMA 04 · FIVE THOUSAND YEARS — the brand film, built for the scroll.
 *   0.0  HOOK: a taiko hit, a torch flares, an ankh cut in stone. "Life."
 *   1.2  cuneiform: "Fate."   2.4  runes: "What becomes."  (the site's frieze)
 *   3.6  the sky wheeling over a desert; one figure looking up.
 *        "Every age asked the same thing:" — "What happens next?"
 *   6.0  DROP: the turn — the app asking you its first question, for real.
 *   8.4  the payoff: "When did you arrive on Earth?"
 *  10.5  the camera falls into the star trails round the pole — the rings of
 *        the sky become the Plutto ring.
 */
import { cinema, title, show, phone3d, ringEnd, kinetic, kin, quote, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { wallShot, skyShot, CARVINGS } from '../shots.js';
import { kickTimes } from '../sound.js';

const DRUMS = [0, b(2), b(4)], SKY = b(6), ASK = b(8), HOLE = b(9.5), DROP = b(10), QUOTE = b(14), POLE = b(17.3), END = b(18);
const KICKS = kickTimes(DROP, 2);
// As the site's frieze has them (components/site/Ancient.js).
const MEANS = ['Life.', 'Fate.', 'What becomes.'], WHERE = ['Egypt · 3000 BC', 'Sumer · 2500 BC', 'The North · 700 AD'];
let S = {};
export default {
  duration: b(24),
  poster: b(15.5),
  score() {
    const c = [
      { i: 'pad', t: 0, end: HOLE, ns: [38, 45, 50, 53], g: 0.07, bright: 420 },
      { i: 'whoosh', t: SKY - 0.35, dur: 0.5, g: 0.3 },
      { i: 'boom', t: SKY, g: 0.6 }, { i: 'bell', t: SKY + 0.1, n: 81, g: 0.08, dur: 4 },
      { i: 'pulse', t: SKY, end: HOLE, n: 50, g: 0.13 },
      { i: 'hit', t: ASK, g: 0.95 }, { i: 'braam', t: ASK, n: 41, dur: 1.4, g: 0.45 },
      { i: 'riser', t: b(7), end: HOLE, g: 0.5 },
      { i: 'roll', t: b(8), end: HOLE, g: 0.55 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.2, g: 0.62 },
      { i: 'groove', t: DROP, bars: 2, n: 38, line: [0, 0, 5, 3] },
      { i: 'whoosh', t: QUOTE - 0.3, dur: 0.45, g: 0.35 }, { i: 'braam', t: QUOTE, n: 43, dur: 2, g: 0.42 },
      { i: 'reverse', end: END, dur: 1, g: 0.4 },
      { i: 'boom', t: END, g: 0.75 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: b(23), ns: [50, 57, 62], g: 0.05 },
    ];
    DRUMS.forEach((t, k) => c.push({ i: 'tom', t: t + 0.01, f: 68, g: 1, verb: 0.7, d: 1.3 }, { i: 'tom', t: t + 0.31, f: 90, g: 0.45, verb: 0.6 }, { i: 'braam', t: t + 0.01, n: [38, 36, 41][k], dur: 0.9, g: 0.35 }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.wall = await wallShot();
    S.sky = await skyShot();
    S.hero = phone3d(S.cine.props, 'when', { w: 610 });
    const T = S.cine.titles;
    S.means = MEANS.map((m) => kinetic(T, m, { size: 190, top: 300, italic: false, style: { fontWeight: 500 } }));
    S.where = WHERE.map((w) => title(T, w, { kind: 'caps', top: 1440 }));
    S.t1 = kinetic(T, 'Every age asked the same thing:', { size: 104, top: 330, width: 900 });
    S.ask = title(T, 'What happens next?', { kind: 'slab', size: 124, top: 330, width: 1000 });
    S.hole = title(T, 'Now it asks you.', { kind: 'caps', top: 940 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 250 });
    S.quote = quote(T, 'When did you arrive on Earth?', 'Plutto’s first question · in the app', { size: 124, top: 580, em: [5] });
    S.end = ringEnd(stage, { from: { x: 560, y: 360, d: 150, rgb: '215,225,255' }, cta: 'Find out · plutto.space', prompt: 'What would you ask it first?' });
  },
  async frame(t) {
    const { g } = S.cine;
    const dropK = impulse(t, [DROP], 0.6), drumK = impulse(t, [...DRUMS, ASK], 0.4);
    const shake = drumK * 0.6 + dropK;
    const pulse = t >= DROP && t < END ? impulse(t, KICKS, 0.2) : 0;
    let cam;
    S.hero.pose(t, { o: 0 });
    if (t < SKY) {
      let pan = CARVINGS[0].x - 540;
      DRUMS.forEach((d, k) => { if (k) pan = lerp(pan, CARVINGS[k].x - 540, ease.inOutCubic(prog(t, d - 0.16, d + 0.1))); });
      const k = DRUMS.filter((d) => t >= d - 0.05).length - 1, c = CARVINGS[Math.max(0, k)];
      const whip = DRUMS.slice(1).reduce((m, d) => Math.max(m, 1 - Math.abs(t - d + 0.03) / 0.13), 0);
      S.wall(g, t, { pan, lx: 540, ly: c.y + 420, radius: 760, flare: impulse(t, DRUMS, 0.7) });
      const d = drift(t, 0.6);
      cam = { zoom: lerp(1.06, 1.0, ease.outCubic(prog(t, 0, SKY))) * (1 + 0.03 * drumK), x: d.x, y: d.y, bars: 210, smear: Math.max(0, whip) * -200,
        split: drumK * 8, leak: 0.3 * impulse(t, DRUMS, 0.8), tint: ['rgba(20,60,90,1)', 'rgba(255,140,50,1)'], tintOpacity: 0.4 };
    } else if (t < HOLE) {
      S.sky(g, t - SKY, { exposure: 3, meteor: b(8.6) - SKY });
      const d = drift(t, 0.4), ak = impulse(t, [ASK], 0.35);
      cam = { zoom: lerp(1.0, 1.14, ease.inCubic(prog(t, SKY, HOLE))) * (1 + 0.03 * ak), oy: 60, x: d.x, y: d.y, bars: 210, split: ak * 12,
        flash: 0.5 * (1 - ease.outCubic(prog(t, SKY, SKY + 0.3))), tint: ['rgba(10,50,120,1)', 'rgba(200,110,70,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 210 };
    } else if (t < POLE) {
      S.sky(g, t - SKY, { exposure: 3 });
      const tint = ['rgba(30,50,140,1)', 'rgba(210,110,70,1)'];
      if (t < QUOTE) {
        g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, 0, 1080, 1920);
        const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
        S.hero.pose(t, { x: 0, y: 110, s: lerp(0.9, 1, k), ry: lerp(-20, -6, k), rx: lerp(10, 3, k), glow: 1 + pulse });
        await S.hero.at(3 + (t - DROP) * 2.4);
        const push = ease.inOutCubic(prog(t, b(12.4), b(13.8)));
        cam = { zoom: lerp(1, 1.6, push), ox: 50, oy: 40, pulse, bars: lerp(210, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
          flash: 0.85 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))), split: dropK * 16, tint, tintOpacity: 0.35 };
      } else {
        g.fillStyle = 'rgba(0,0,0,0.45)'; g.fillRect(0, 0, 1080, 1920);
        const w = 1 - ease.outCubic(prog(t, QUOTE, QUOTE + 0.3));
        cam = { zoom: 1.04, pulse, smear: w * 160, leak: 0.25 * w, tint, tintOpacity: 0.3 };
      }
    } else {
      // Fall into the pole: the sky's own rings.
      S.sky(g, t - SKY, { exposure: 3 });
      cam = { zoom: lerp(1, 3.4, ease.inCubic(prog(t, POLE, END))), ox: 560 / 10.8, oy: 360 / 19.2, tint: ['rgba(30,50,140,1)', 'rgba(210,110,70,1)'], tintOpacity: 0.3 };
    }
    S.cine.post(t, { ...cam, shake });
    S.means.forEach((m, k) => kin(m, t, k ? DRUMS[k] : -1.4, (k < 2 ? DRUMS[k + 1] : SKY) - 0.15, { stagger: 0.12 }));
    S.where.forEach((e, k) => show(e, t, DRUMS[k] + (k ? 0.1 : -1), k < 2 ? DRUMS[k + 1] - 0.2 : SKY - 0.2, { mode: 'fade', d: 0.25, out: 0.1 }));
    kin(S.t1, t, SKY + 0.3, ASK - 0.3);
    show(S.ask, t, ASK, HOLE, { mode: 'cut' });
    show(S.hole, t, HOLE + 0.04, DROP - 0.08, { mode: 'fade', d: 0.15, out: 0.05 });
    show(S.rec, t, DROP + 0.8, QUOTE - 0.1, { mode: 'fade', out: 0.1 });
    S.quote(t, QUOTE + 0.2, POLE - 0.35);
    S.end(t - END);
  },
};
