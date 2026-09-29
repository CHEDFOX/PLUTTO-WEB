/**
 * CINEMA 02 · UNSENT — built for the scroll.
 *   0.0  HOOK: "Draft eleven." over rain, a message already being typed —
 *        the sound of keys from frame 0. (Specific, a little embarrassing,
 *        instantly familiar.)
 *   2.4  on a hit: "Don't send it." — and it deletes, fast, which feels good.
 *   3.6  the reframe, with a smile: "Ask something that won't leave you on read."
 *   6.0  DROP: a real tarot draw in the app.
 *   8.4  the payoff: "Recovery, or asking for the help at last."
 *  10.8  a raindrop swells into the Plutto ring; "Who were you about to text?"
 *  14.1  the callback: the empty draft. "Unsent. Proud of you."
 */
import { cinema, title, show, phone3d, ringEnd, kinetic, kin, quote, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { el } from '../lib.js';
import { rainShot } from '../shots.js';
import { kickTimes } from '../sound.js';

const DRAFT = 'hey. i know it’s late but';
const TYPE0 = 0.1, NO = b(4), DEL = 0.03, HOLE = b(9.5), DROP = b(10), QUOTE = b(14), DROPLET = b(17.5), END = b(18), CB = b(23.5);
const AT = [...DRAFT].map((c, i) => TYPE0 + i * 0.068 + (i > 3 ? 0.22 : 0) + (i > 13 ? 0.12 : 0));
const KICKS = kickTimes(DROP, 2);
let S = {};
export default {
  duration: b(26),
  poster: b(15.5),
  score() {
    const c = [
      { i: 'rain', t: 0, end: HOLE, g: 0.22 },
      { i: 'pad', t: 0, end: HOLE, ns: [50, 53, 57, 62], g: 0.06, bright: 700 },
      { i: 'hit', t: NO, g: 0.85 }, { i: 'braam', t: NO, n: 38, dur: 1, g: 0.35 },
      { i: 'pulse', t: b(5), end: HOLE, n: 50, g: 0.12, open: [300, 2200] },
      { i: 'riser', t: b(7.5), end: HOLE, g: 0.45 },
      { i: 'roll', t: b(8), end: HOLE, g: 0.5 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.2, g: 0.55 },
      { i: 'groove', t: DROP, bars: 2, n: 38, line: [0, 0, 3, 5] },
      { i: 'rain', t: DROP, end: END, g: 0.07, drips: 4 },
      { i: 'whoosh', t: QUOTE - 0.3, dur: 0.45, g: 0.35 }, { i: 'braam', t: QUOTE, n: 41, dur: 2, g: 0.42 },
      { i: 'reverse', end: END, dur: 0.9, g: 0.4 },
      { i: 'boom', t: END, g: 0.75 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: CB, ns: [50, 57, 62], g: 0.05 },
      { i: 'rain', t: CB, end: b(26), g: 0.12, drips: 5 },
      { i: 'pluck', t: CB + 0.15, n: 65, g: 0.15 }, { i: 'pluck', t: CB + 0.6, n: 69, g: 0.15, dur: 2.5 },
    ];
    [69, 65, 62, 64].forEach((n, k) => c.push({ i: 'pluck', t: b(0.5 + k * 1.5), n, g: 0.17 }));
    AT.forEach((t) => c.push({ i: 'key', t, g: 0.16 }));
    [...DRAFT].forEach((_, k) => c.push({ i: 'key', t: NO + 0.05 + k * DEL, g: 0.1, del: true }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.rain = await rainShot();
    S.hero = phone3d(S.cine.props, 'tarot', { w: 610 });
    const T = S.cine.titles;
    S.hook = kinetic(T, 'Draft eleven.', { size: 160, top: 300, italic: false, style: { fontWeight: 500 } });
    S.bar = el('div', 'abs', { left: '90px', width: '900px', top: '1180px', padding: '34px 44px', borderRadius: '60px', background: 'rgba(20,22,30,0.55)',
      border: '1.5px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(18px)', fontFamily: 'Inter', fontWeight: 500, fontSize: '46px', color: '#EDEBE6', opacity: 0, whiteSpace: 'nowrap', overflow: 'hidden' }, T);
    S.text = el('span', '', {}, S.bar);
    S.caret = el('span', '', { display: 'inline-block', width: '4px', height: '52px', background: '#9fb4ff', verticalAlign: '-10px', marginLeft: '4px' }, S.bar);
    S.no = kinetic(T, 'Don’t send it.', { size: 150, top: 300 });
    S.reframe = kinetic(T, 'Ask something that won’t leave you on read.', { size: 104, top: 330, width: 900, em: [6, 7] });
    S.hole = title(T, 'Draw a card.', { kind: 'caps', top: 940 });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 250 });
    S.quote = quote(T, 'Recovery, or asking for the help at last.', 'Five of Pentacles, reversed · drawn in the app', { size: 118, top: 560, em: [5] });
    S.cb = kinetic(T, 'Unsent. / Proud of you.', { size: 130, top: 320, width: 1000, em: [0] });
    S.end = ringEnd(stage, { from: { x: 540, y: 960, d: 170, rgb: '255,178,90' }, cta: 'Draw yours · plutto.space', prompt: 'Who were you about to text?' });
  },
  async frame(t) {
    const { g } = S.cine;
    const dropK = impulse(t, [DROP], 0.6), noK = impulse(t, [NO], 0.35);
    const shake = noK * 0.5 + dropK;
    let cam;
    S.hero.pose(t, { o: 0 });
    if (t < HOLE) {
      S.rain(g, t, { heavy: ease.inCubic(prog(t, b(6), HOLE)) });
      const d = drift(t, 0.8);
      cam = { zoom: lerp(1.04, 1.16, ease.inOutSine(prog(t, 0, HOLE))) * (1 + 0.03 * noK), x: d.x, y: d.y, bars: 210, split: noK * 12,
        tint: ['rgba(0,70,110,1)', 'rgba(230,120,60,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 210 };
    } else if (t < DROPLET) {
      S.rain(g, t, { heavy: 0.3 });
      const pulse = impulse(t, KICKS, 0.2);
      if (t < QUOTE) {
        g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, 0, 1080, 1920);
        const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
        S.hero.pose(t, { x: 0, y: 110, s: lerp(0.9, 1, k), ry: lerp(20, 6, k), rx: lerp(10, 3, k), rz: lerp(3, 0, k), glow: 1 + pulse });
        await S.hero.at(4.0 + (t - DROP) * 1.6);
        const push = ease.inOutCubic(prog(t, b(12.6), b(13.8)));
        cam = { zoom: lerp(1, 1.9, push), ox: 50, oy: 36, pulse, bars: lerp(210, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))), flash: 0.8 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))),
          split: dropK * 16, tint: ['rgba(40,60,130,1)', 'rgba(210,110,70,1)'], tintOpacity: 0.35 };
      } else {
        g.fillStyle = 'rgba(0,0,0,0.76)'; g.fillRect(0, 0, 1080, 1920);
        const w = 1 - ease.outCubic(prog(t, QUOTE, QUOTE + 0.3));
        cam = { zoom: 1.08, pulse, smear: w * 160, leak: 0.3 * w, tint: ['rgba(40,60,130,1)', 'rgba(210,110,70,1)'], tintOpacity: 0.3 };
      }
    } else if (t < CB) {
      S.rain(g, t, { hero: 1 });
      cam = { zoom: lerp(3, 5.3, ease.outExpo(prog(t, DROPLET, END))), ox: 50, oy: 50, smear: (1 - prog(t, DROPLET, DROPLET + 0.15)) * 120 };
    } else {
      S.rain(g, t);
      cam = { zoom: 1.08, bars: 210, flash: 0.25 * (1 - prog(t, CB, CB + 0.3)), tint: ['rgba(0,70,110,1)', 'rgba(230,120,60,1)'], tintOpacity: 0.4 };
    }
    S.cine.post(t, { ...cam, shake });

    // The draft: typed, then deleted on the hit. After the film, the bar again — empty.
    const typed = AT.filter((x) => t >= x).length, deleted = Math.max(0, Math.floor((t - NO - 0.05) / DEL) + 1);
    S.text.textContent = t >= CB ? '' : DRAFT.slice(0, t < NO ? typed : Math.max(0, DRAFT.length - deleted));
    const idle = t >= CB || (t > AT[AT.length - 1] && t < NO);
    S.caret.style.opacity = idle ? (Math.floor(t * 2.2) % 2 ? 0 : 1) : 1;
    S.bar.style.opacity = t >= CB ? ease.outCubic(prog(t, CB, CB + 0.3)) : 1 - ease.inCubic(prog(t, NO + DRAFT.length * DEL + 0.2, b(6)));
    kin(S.hook, t, -1.4, NO - 0.2);
    kin(S.no, t, NO, b(5.8), { stagger: 0.07 });
    kin(S.reframe, t, b(6), HOLE - 0.35);
    show(S.hole, t, HOLE + 0.04, DROP - 0.08, { mode: 'fade', d: 0.15, out: 0.05 });
    show(S.rec, t, DROP + 0.8, QUOTE - 0.1, { mode: 'fade', out: 0.1 });
    S.quote(t, QUOTE + 0.2, DROPLET - 0.65);
    S.end(t - END, t >= CB ? 1 : 0);
    kin(S.cb, t, CB + 0.15, 99);
  },
};
