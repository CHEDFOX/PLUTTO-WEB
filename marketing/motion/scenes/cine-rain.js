/**
 * CINEMA 02 · UNSENT — rain on a window, the street's lights melting behind
 * it, a message typed at midnight and deleted. "Some messages shouldn't be
 * sent. Some questions should." The drop: a real tarot draw in the app —
 * Five of Pentacles, reversed: "Recovery, or asking for the help at last."
 */
import { cinema, title, show, phone3d, cineEnd, impulse, drift, b, lerp, prog, ease } from '../cine.js';
import { el } from '../lib.js';
import { rainShot } from '../shots.js';

const DRAFT = 'hey. i know it’s late but';
const TYPE0 = b(2), KEY = 0.1, DEL0 = b(7), DEL = 0.034;
const HOLE = b(14), DROP = b(15), END = b(23);
// When each character lands (a human rhythm: a hesitation after the full stop).
const AT = [...DRAFT].map((c, i) => TYPE0 + i * KEY + (i > 3 ? 0.35 : 0) + (i > 13 ? 0.2 : 0));
let S = {};
export default {
  duration: 18,
  poster: 12.6,
  score() {
    const c = [
      { i: 'rain', t: 0, end: HOLE, g: 0.24 },
      { i: 'pad', t: 0.3, end: HOLE, ns: [50, 53, 57, 62], g: 0.06, bright: 700 },
      { i: 'pulse', t: b(10), end: HOLE, n: 50, g: 0.12, open: [300, 2200] },
      { i: 'riser', t: b(10), end: HOLE, g: 0.45 },
      { i: 'roll', t: b(12), end: HOLE, g: 0.5 },
      { i: 'silence', t: HOLE, end: DROP },
      { i: 'boom', t: DROP }, { i: 'braam', t: DROP, n: 38, dur: 2.2, g: 0.55 },
      { i: 'groove', t: DROP, bars: 2, n: 38, line: [0, 0, 3, 5] },
      { i: 'rain', t: DROP, end: END, g: 0.08, drips: 4 },
      { i: 'hit', t: b(19), g: 0.7 },
      { i: 'reverse', end: END, dur: 1.2, g: 0.35 },
      { i: 'boom', t: END, g: 0.7 }, { i: 'sting', t: END + 0.05 },
      { i: 'pad', t: END, end: 17.2, ns: [50, 57, 62], g: 0.05 },
    ];
    // A felt-piano figure, falling, one note every beat and a half.
    [69, 65, 62, 64, 65, 62, 60, 62].forEach((n, k) => c.push({ i: 'pluck', t: b(1 + k * 1.5), n, g: 0.2 }));
    AT.forEach((t) => c.push({ i: 'key', t, g: 0.16 }));
    [...DRAFT].forEach((_, k) => c.push({ i: 'key', t: DEL0 + k * DEL, g: 0.1, del: true }));
    return c;
  },
  async setup(stage) {
    S.cine = cinema(stage);
    S.rain = await rainShot();
    S.hero = phone3d(S.cine.props, 'tarot', { w: 610 });
    const T = S.cine.titles;
    S.draft = title(T, 'Draft eleven', { kind: 'caps', top: 330 });
    // The message being written: a plain glass bar, nobody's app in particular.
    S.bar = el('div', 'abs', { left: '90px', width: '900px', top: '1410px', padding: '34px 44px', borderRadius: '60px', background: 'rgba(20,22,30,0.55)',
      border: '1.5px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(18px)', fontFamily: 'Inter', fontWeight: 500, fontSize: '46px', color: '#EDEBE6', opacity: 0, whiteSpace: 'nowrap', overflow: 'hidden' }, T);
    S.text = el('span', '', {}, S.bar);
    S.caret = el('span', '', { display: 'inline-block', width: '4px', height: '52px', background: '#9fb4ff', verticalAlign: '-10px', marginLeft: '4px' }, S.bar);
    S.t1 = title(T, 'Some messages shouldn’t be sent.', { kind: 'italic', top: 560, width: 900 });
    S.t2 = title(T, 'Some questions should.', { kind: 'italic', top: 600, width: 900 });
    S.hole = title(T, 'Ask the cards.', { kind: 'caps', top: 940 });
    S.h1 = title(S.cine.over, 'Draw a card.', { kind: 'serif', size: 118, top: 150, style: { fontWeight: 600 } });
    S.rec = title(S.cine.over, '● Recorded in the Plutto app', { kind: 'caps', size: 20, top: 1812 });
    S.end = cineEnd(stage, { line: 'It’s heard worse.' });
  },
  async frame(t) {
    const { g } = S.cine;
    const shake = impulse(t, [DROP], 0.6) + 0.4 * impulse(t, [b(19)], 0.4);
    let cam;
    S.hero.pose(t, { o: 0 });
    if (t < HOLE) {
      S.rain(g, t, { heavy: ease.inCubic(prog(t, b(10), HOLE)) });
      const d = drift(t, 0.8);
      cam = { zoom: lerp(1.02, 1.12, ease.inOutSine(prog(t, 0, HOLE))), x: d.x, y: d.y, bars: 250, fade: 1 - ease.outCubic(prog(t, 0, 1.2)),
        tint: ['rgba(0,70,110,1)', 'rgba(230,120,60,1)'], tintOpacity: 0.4 };
    } else if (t < DROP) {
      g.fillStyle = '#000'; g.fillRect(0, 0, 1080, 1920);
      cam = { bars: 250 };
    } else {
      S.rain(g, t, { heavy: 0.3 });
      g.fillStyle = 'rgba(0,0,0,0.6)'; g.fillRect(0, 0, 1080, 1920);
      const k = ease.outExpo(prog(t, DROP, DROP + 1.2));
      S.hero.pose(t, { x: 0, y: 110, s: lerp(0.9, 1, k), ry: lerp(20, 6, k), rx: lerp(10, 3, k), rz: lerp(3, 0, k) });
      await S.hero.at(4.5 + (t - DROP));
      const push = ease.inOutCubic(prog(t, b(19.5), b(21.5)));
      cam = { zoom: lerp(1, 1.9, push), ox: 50, oy: 36, bars: lerp(250, 0, ease.outExpo(prog(t, DROP, DROP + 0.5))), flash: 0.8 * (1 - ease.outCubic(prog(t, DROP, DROP + 0.45))),
        tint: ['rgba(40,60,130,1)', 'rgba(210,110,70,1)'], tintOpacity: 0.35 };
    }
    S.cine.post(t, { ...cam, shake });

    // The draft: typed, held, deleted.
    const typed = AT.filter((x) => t >= x).length, deleted = Math.max(0, Math.floor((t - DEL0) / DEL) + 1);
    const n = t < DEL0 ? typed : Math.max(0, DRAFT.length - deleted);
    S.text.textContent = DRAFT.slice(0, n);
    S.caret.style.opacity = (t > TYPE0 - 0.4 && t < AT[0]) || (t > AT[AT.length - 1] && t < DEL0) ? (Math.floor(t * 2.2) % 2 ? 0 : 1) : 1;
    S.bar.style.opacity = ease.outCubic(prog(t, TYPE0 - 0.6, TYPE0 - 0.1)) * (1 - ease.inCubic(prog(t, DEL0 + DRAFT.length * DEL + 0.2, b(9.5))));
    show(S.draft, t, b(1), b(8), { mode: 'fade' });
    show(S.t1, t, b(8.5), b(11.2));
    show(S.t2, t, b(11.5), HOLE - 0.2);
    show(S.hole, t, HOLE + 0.08, DROP - 0.15, { mode: 'fade', d: 0.25, out: 0.1 });
    show(S.h1, t, DROP + 0.1, b(19.2), { mode: 'cut' });
    show(S.rec, t, DROP + 0.8, END - 0.3, { mode: 'fade' });
    S.end(t - END);
  },
};
