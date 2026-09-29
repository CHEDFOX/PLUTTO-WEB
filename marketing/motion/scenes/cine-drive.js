/**
 * CINEMA 03 · OUT LOUD — built for the scroll.
 *   0.0  HOOK: a streetlight goes over, the cabin flares orange. "You took the
 *        long way home again." (the second person, a small true thing)
 *   2.4  "Radio off. Still thinking about it."
 *   3.6  three hits, three words, a streetlight on each: Say it. Out. Loud.
 *   6.0  DROP: Plutto's voice mode, listening (the real recording).
 *   7.8  the real language screen — Hello, Aloha, Talofa… "It answers in yours."
 *   9.6  the orb, huge, breathing on the kick — and it becomes the Plutto ring.
 *  14.1  the callback: the car rolls to a stop. "Home."
 */
import { cinema, title, show, phone3d, ringEnd, kinetic, kin, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { el, footage } from '../lib.js';
import { roadShot } from '../shots.js';
import { kickTimes } from '../sound.js';

const WORDS = [b(6), b(7), b(8)], HOLE = b(9.5), DROP = b(10), LANG = b(13), ORB = b(16), END = b(18), CB = b(23.5);
const PASSES = [0.3, b(2), b(3.5), b(5), ...WORDS, b(8.5), b(9), ...[10, 11, 12, 13, 14, 15, 16, 17].map(b)];
const KICKS = kickTimes(DROP, 2);
const V = 24, STOP = 1.1;
let S = {};
export default {
  duration: b(26),
  poster: b(14.5),
  score() {
    const c = [
      { i: 'engine', t: 0, end: HOLE, g: 0.3 },
      { i: 'pad', t: 0, end: HOLE, ns: [45, 52, 57, 60], g: 0.06 },
      { i: 'pulse', t: b(4), end: HOLE, n: 45, g: 0.13 },
      ...WORDS.map((t, k) => ({ i: 'hit', t, g: 0.75 + k * 0.1 })),
      { i: 'riser', t: b(7.5), end: HOLE, g: 0.5 },
      { i: 'roll', t: b(8), end: HOLE, g: 0.55 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 33, dur: 2.2, g: 0.6 },
      { i: 'groove', t: DROP, bars: 2, n: 33, line: [0, 0, 3, -2] },
      { i: 'engine', t: DROP, end: END, g: 0.1 },
      { i: 'whoosh', t: LANG - 0.3, dur: 0.45, g: 0.3 }, { i: 'bell', t: LANG, n: 81, g: 0.07, dur: 2 },
      { i: 'braam', t: ORB - 0.6, n: 36, dur: 1.6, g: 0.42 },
      { i: 'reverse', end: END, dur: 0.9, g: 0.4 },
      { i: 'boom', t: END, g: 0.75 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: CB, ns: [45, 52, 57], g: 0.05 },
      { i: 'engine', t: CB, end: CB + STOP - 0.6, g: 0.18 },
      { i: 'key', t: CB + STOP + 0.2, g: 0.2 }, { i: 'key', t: CB + STOP + 0.62, g: 0.16, del: true },
      { i: 'pluck', t: CB + STOP + 0.1, n: 69, g: 0.12, dur: 2 },
    ];
    PASSES.forEach((p, i) => { if (p < HOLE || (p >= DROP && p < END)) c.push({ i: 'whoosh', t: p - 0.3, dur: 0.6, g: p >= DROP ? 0.16 : 0.3, from: i % 2 ? -0.1 : 0.1, to: i % 2 ? -0.9 : 0.9 }); });
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.road = await roadShot({ passes: PASSES });
    S.voice = phone3d(S.cine.props, 'voice', { w: 610 });
    S.lang = phone3d(S.cine.props, 'language', { w: 610 });
    S.orbBox = el('div', 'abs', { left: '140px', top: '500px', width: '800px', height: '800px', opacity: 0,
      WebkitMaskImage: 'radial-gradient(circle, #000 52%, transparent 70%)', maskImage: 'radial-gradient(circle, #000 52%, transparent 70%)' }, S.cine.props);
    S.orb = footage(S.orbBox, 'voice', { crop: [120, 465, 350, 350], w: 800, h: 800, style: { left: 0, top: 0 } });
    const T = S.cine.titles;
    S.hook = kinetic(T, 'You took the long way / home again.', { size: 118, top: 290, width: 1000 });
    S.radio = kinetic(T, 'Radio off. / Still thinking about it.', { size: 104, top: 310, width: 1000 });
    S.words = ['Say it.', 'Out.', 'Loud.'].map((w) => title(T, w, { kind: 'slab', size: 170, top: 1150, width: 1000 }));
    S.hole = title(T, 'It’s listening.', { kind: 'caps', top: 940 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 250 });
    S.say = kinetic(S.cine.over, 'Say it out loud.', { size: 120, top: 300 });
    S.yours = kinetic(S.cine.over, 'It answers in yours.', { size: 120, top: 300 });
    S.n109 = title(S.cine.over, 'One of 109 languages', { kind: 'caps', size: 24, top: 450 });
    S.cb = kinetic(T, 'Home.', { size: 180, top: 320, italic: false });
    S.end = ringEnd(stage, { from: { x: 540, y: 900, d: 640, rgb: '160,120,255' }, cta: 'Say it · plutto.space', prompt: 'What would you say out loud?' });
  },
  async frame(t) {
    const { g } = S.cine;
    const hitK = impulse(t, WORDS, 0.3), dropK = impulse(t, [DROP], 0.6);
    const shake = hitK * 0.5 + dropK;
    const pulse = t >= DROP && t < END ? impulse(t, KICKS, 0.2) : 0;
    let cam;
    S.voice.pose(t, { o: 0 }); S.lang.pose(t, { o: 0 }); S.orbBox.style.opacity = 0;
    if (t < HOLE) {
      S.road(g, t);
      const d = drift(t, 0.5);
      cam = { zoom: lerp(1.02, 1.12, ease.inCubic(prog(t, 0, HOLE))) * (1 + 0.035 * hitK), oy: 46, x: d.x, y: d.y, bars: 210, split: hitK * 12,
        leak: 0.25 * impulse(t, [0.3], 0.8), tint: ['rgba(0,90,130,1)', 'rgba(240,130,50,1)'], tintOpacity: 0.45 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 210 };
    } else if (t < END) {
      S.road(g, t, { bump: 0.4 });
      g.fillStyle = `rgba(0,0,0,${t < ORB ? 0.58 : 0.82})`; g.fillRect(0, 0, 1080, 1920);
      const bars = lerp(210, 0, ease.outExpo(prog(t, DROP, DROP + 0.5)));
      const tint = ['rgba(30,60,140,1)', 'rgba(230,120,60,1)'];
      if (t < LANG) {
        const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
        S.voice.pose(t, { x: 0, y: 110, s: lerp(0.88, 0.97, k), ry: lerp(-18, -6, k), rx: lerp(8, 3, k), glow: 1 + 1.5 * pulse });
        await S.voice.at(1 + (t - DROP) * 1.4);
        cam = { pulse, bars, flash: 0.8 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))), flashColor: '#ffd9b0', split: dropK * 16, tint, tintOpacity: 0.35 };
      } else if (t < ORB) {
        const k = ease.outExpo(prog(t, LANG, LANG + 0.8));
        S.lang.pose(t, { x: 0, y: 110, s: lerp(0.9, 0.97, k), ry: lerp(16, 5, k), rx: lerp(8, 3, k), glow: 1 + pulse });
        await S.lang.at(1 + (t - LANG) * 2.6);
        const w = 1 - ease.outCubic(prog(t, LANG, LANG + 0.3));
        cam = { pulse, smear: w * -160, tint, tintOpacity: 0.35 };
      } else {
        S.orbBox.style.opacity = 1;
        S.orbBox.style.transform = `scale(${lerp(0.7, 0.8, ease.outCubic(prog(t, ORB, END))) * (1 + 0.05 * pulse)})`;
        await S.orb.at(4 + (t - ORB) * 1.2);
        const w = 1 - ease.outCubic(prog(t, ORB, ORB + 0.3));
        cam = { pulse, smear: w * 140, leak: 0.25 * w, tint, tintOpacity: 0.3 };
      }
    } else {
      // The callback: roll to a stop.
      const tau = Math.max(0, t - CB), D0 = CB * V;
      const dist = tau < STOP ? D0 + V * (tau - (tau * tau) / (2 * STOP)) : D0 + (V * STOP) / 2;
      S.road(g, t, { dist, bump: Math.max(0, 1 - tau / STOP) });
      cam = { zoom: 1.06, oy: 46, bars: 210, flash: 0.25 * (1 - prog(t, CB, CB + 0.3)), tint: ['rgba(0,90,130,1)', 'rgba(240,130,50,1)'], tintOpacity: 0.45 };
    }
    S.cine.post(t, { ...cam, shake });
    kin(S.hook, t, -1.4, b(3.8));
    kin(S.radio, t, b(4), b(5.9));
    S.words.forEach((e, i) => show(e, t, WORDS[i], i < 2 ? WORDS[i + 1] : HOLE, { mode: 'cut' }));
    show(S.hole, t, HOLE + 0.04, DROP - 0.08, { mode: 'fade', d: 0.15, out: 0.05 });
    show(S.rec, t, DROP + 0.8, ORB - 0.2, { mode: 'fade', out: 0.1 });
    kin(S.say, t, DROP + 0.3, LANG - 0.3);
    kin(S.yours, t, LANG + 0.2, ORB - 0.3);
    show(S.n109, t, LANG + 0.8, ORB - 0.2, { mode: 'fade', out: 0.1 });
    S.end(t - END, t >= CB ? 1 : 0);
    kin(S.cb, t, CB + 0.35, 99);
  },
};
