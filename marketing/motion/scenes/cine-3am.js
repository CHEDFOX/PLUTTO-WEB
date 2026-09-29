/**
 * CINEMA 01 · 3:07 — built for the scroll.
 *   0.0  HOOK: the phone buzzing on the nightstand at 3:07. "Can't sleep?"
 *        (a question in the second person, on screen from frame 0, with the
 *        one sound everybody turns their head for).
 *   1.5  a joke that lands the relatability: "It's not the coffee."
 *   2.4  the turn, on a hit: "It's the offer." Three more hits, three more
 *        options: Take it? Stay? Start over? — escalation.
 *   5.7  dead air. "So you ask."
 *   6.0  DROP: the real app, the real question, the real answer.
 *   8.4  the payoff as a pull quote: "Yes — but not for the reason you keep
 *        giving." (an open loop: which reason?)
 *  10.8  the clock's colon swells into the Plutto ring; the lockup; a question
 *        for the comments.
 *  14.1  the callback: 3:08. Sleep. (relief, a laugh, and a reason to loop)
 */
import { cinema, title, show, phone3d, ringEnd, kinetic, kin, quote, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { clockShot, cityShot } from '../shots.js';
import { kickTimes } from '../sound.js';

const CUT = b(4), HITS = [b(6), b(7), b(8)], HOLE = b(9.5), DROP = b(10), QUOTE = b(14), DOT = b(17.5), END = b(18), CB = b(23.5);
const KICKS = kickTimes(DROP, 2);
let S = {};
export default {
  duration: b(26),
  poster: b(15.5),
  score() {
    return [
      { i: 'buzz', t: 0.02, g: 0.7 },
      { i: 'hit', t: 0, g: 0.5 },
      { i: 'pad', t: 0, end: HOLE, ns: [50, 57, 62, 65], g: 0.07 },
      { i: 'pulse', t: b(2), end: HOLE, n: 50, g: 0.13 },
      { i: 'hit', t: CUT, g: 0.9 }, { i: 'braam', t: CUT, n: 38, dur: 1.1, g: 0.4 },
      ...HITS.map((t, k) => ({ i: 'hit', t, g: 0.75 + k * 0.1 })),
      { i: 'riser', t: b(7.5), end: HOLE, g: 0.5 },
      { i: 'roll', t: b(8), end: HOLE, g: 0.55 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.2, g: 0.62 },
      { i: 'groove', t: DROP, bars: 2, n: 38 },
      { i: 'whoosh', t: QUOTE - 0.3, dur: 0.45, g: 0.35 }, { i: 'braam', t: QUOTE, n: 41, dur: 2, g: 0.45 },
      { i: 'reverse', end: END, dur: 0.9, g: 0.4 },
      { i: 'boom', t: END, g: 0.75 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: CB, ns: [50, 57, 62], g: 0.05 },
      { i: 'room', t: CB, end: b(26), g: 0.03 },
      { i: 'pluck', t: CB + 0.1, n: 69, g: 0.16 }, { i: 'pluck', t: CB + 0.55, n: 62, g: 0.14, dur: 2.5 },
    ];
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.clock = await clockShot();
    S.city = await cityShot();
    S.bed = phone3d(S.cine.props, 'chat', { w: 280, persp: 1100, lit: 0.55 });
    S.hero = phone3d(S.cine.props, 'chat', { w: 610 });
    const T = S.cine.titles;
    S.hook = kinetic(T, 'Can’t sleep?', { size: 170, top: 300 });
    S.joke = kinetic(T, 'It’s not the coffee.', { size: 110, top: 330 });
    S.turn = title(T, 'It’s the offer.', { kind: 'slab', size: 124, top: 330, width: 1000 });
    S.opts = ['Take it?', 'Stay?', 'Start over?'].map((w) => title(T, w, { kind: 'slab', size: 150, top: 1180, width: 1000 }));
    S.hole = title(T, 'So you ask.', { kind: 'caps', top: 940 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 250 });
    S.quote = quote(T, 'Yes — but not for the reason you keep giving.', 'Plutto, asked “Should I take the job?” · in the app', { size: 118, top: 560, em: [3] });
    S.cb = kinetic(T, '3:08. Sleep.', { size: 140, top: 330 });
    S.end = ringEnd(stage, { from: { x: 464, y: 1085, d: 130, rgb: '255,59,48' }, prompt: 'What’s your 3 AM question?' });
  },
  async frame(t) {
    const { g } = S.cine;
    const hitK = impulse(t, [CUT, ...HITS], 0.3), dropK = impulse(t, [DROP], 0.6);
    const shake = impulse(t, [CUT, ...HITS], 0.45) * 0.6 + dropK;
    let cam;
    S.hero.pose(t, { o: 0 });
    // The phone buzzes: two pulses, it shivers on the wood.
    const buzzing = (t < 0.44 || (t > 0.64 && t < 1.06)) ? 1 : 0;
    const wake = t < CUT ? 1 : 0;
    S.bed.pose(t, { o: t < CUT || (t >= CB) ? 1 : 0, x: 250 + buzzing * 5 * Math.sin(t * 190), y: 470 + buzzing * 2 * Math.cos(t * 170), rx: 66, rz: -16 + buzzing * 0.6 * Math.sin(t * 140),
      on: t >= CB ? 0 : wake, glow: 0.6 });
    await S.bed.at(0);
    if (t < CUT) {
      S.clock(g, t, { wake: 1, colon: Math.floor(t * 1.2) % 2 === 0 });
      const d = drift(t, 0.6);
      cam = { zoom: lerp(1.06, 1.14, ease.outCubic(prog(t, 0, CUT))), oy: 55, x: d.x, y: d.y, bars: 210, split: buzzing * 3,
        tint: ['rgba(10,40,70,1)', 'rgba(110,25,20,1)'], tintOpacity: 0.35 };
    } else if (t < HOLE) {
      S.city(g, t, { phone: 1 });
      const d = drift(t, 1);
      cam = { zoom: lerp(1.04, 1.24, ease.inCubic(prog(t, CUT, HOLE))) * (1 + 0.04 * hitK), ox: 34, oy: 70, x: d.x, y: d.y, bars: 210,
        split: hitK * 14, flash: hitK * 0.12, leak: 0.35 * impulse(t, [CUT], 0.9),
        tint: ['rgba(0,80,120,1)', 'rgba(200,110,50,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 210 };
    } else if (t < DOT) {
      S.city(g, t);
      const pulse = impulse(t, KICKS, 0.2);
      if (t < QUOTE) {
        g.fillStyle = 'rgba(0,0,0,0.62)'; g.fillRect(0, 0, 1080, 1920);
        const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
        S.hero.pose(t, { x: 0, y: 110, s: lerp(0.9, 1.0, k), ry: lerp(-24, -7, k), rx: lerp(10, 4, k), rz: lerp(-3, 0, k), glow: 1 + pulse });
        await S.hero.at(2.3 + (t - DROP) * 2);
        const push = ease.inOutCubic(prog(t, b(12), b(13.6)));
        cam = { zoom: lerp(1, 1.8, push), ox: 47, oy: 40, pulse, bars: lerp(210, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))),
          flash: 0.85 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))), split: dropK * 16,
          tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.35 };
      } else {
        g.fillStyle = 'rgba(0,0,0,0.78)'; g.fillRect(0, 0, 1080, 1920);
        const w = 1 - ease.outCubic(prog(t, QUOTE, QUOTE + 0.3));
        cam = { zoom: 1.08, pulse, smear: w * 160, leak: 0.3 * w, tint: ['rgba(40,40,120,1)', 'rgba(200,100,70,1)'], tintOpacity: 0.3 };
      }
    } else if (t < CB) {
      // Back to the clock, right into the colon — which becomes the ring.
      S.clock(g, t, { wake: 0, colon: true });
      cam = { zoom: lerp(3.2, 5, ease.outExpo(prog(t, DOT, END))), ox: 464 / 10.8, oy: 1085 / 19.2, smear: (1 - prog(t, DOT, DOT + 0.15)) * -120 };
    } else {
      S.clock(g, t, { wake: 0, colon: Math.floor(t * 1.2) % 2 === 0, str: '308' });
      cam = { zoom: 1.1, oy: 55, bars: 210, flash: 0.3 * (1 - prog(t, CB, CB + 0.3)), tint: ['rgba(10,40,70,1)', 'rgba(110,25,20,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });
    kin(S.hook, t, -1.4, b(2.3));
    kin(S.joke, t, b(2.5), CUT - 0.25);
    show(S.turn, t, CUT, b(6), { mode: 'cut' });
    S.opts.forEach((e, i) => show(e, t, HITS[i], i < 2 ? HITS[i + 1] : HOLE, { mode: 'cut' }));
    show(S.hole, t, HOLE + 0.04, DROP - 0.08, { mode: 'fade', d: 0.15, out: 0.05 });
    show(S.rec, t, DROP + 0.8, QUOTE - 0.1, { mode: 'fade', out: 0.1 });
    S.quote(t, QUOTE + 0.2, DOT - 0.65);
    S.end(t - END, t >= CB ? 1 : 0);
    kin(S.cb, t, CB + 0.15, 99);
  },
};
