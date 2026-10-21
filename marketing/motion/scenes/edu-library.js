/**
 * Edu, The library (demo series, cut like a product-launch keynote): a split-flap board clatters through the ways cultures
 * asked one question, each a tradition in app/lib/data/atlas.json, then guides through the real app (tagged replies).
 */
import { el, prog, ease, lerp, rng } from '../lib.js';
import { LIB, atlas, libEnd, libScore } from '../library.js';
import { events, remap, device, honest, tapRing } from '../asked.js';
import { stars } from '../lib.js';

const DUR = 41, END = 36.5;
const FLAP = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·-';
const CREAM = LIB.cream;

// Seven ways of asking. Board text is plain capitals, as a real board's would be.
const PLATES = [
  { s: 'INDIA', b: 'Vedic', match: 'VEDIC', line: 'A chart cast to the minute you were born.', glow: '214,120,60' },
  { s: 'YORUBA · WEST AFRICA', b: 'Merindinlogun', match: 'MERINDINLOGUN', line: 'Sixteen cowrie shells thrown on a mat. Count the ones that land mouth-up.', glow: '120,90,200' },
  { s: 'THE NORSE', b: 'Younger Futhark', match: 'YOUNGER FUTHARK', line: 'Sixteen runes, cut into wood.', glow: '90,140,200' },
  { s: 'PERSIA', b: 'Fāl-e Hāfez', match: 'FAL-E HAFEZ', line: 'Open the poet Hafez at random. Iran still does, on the longest night of the year.', glow: '60,160,140' },
  { s: 'MESOAMERICA', b: 'Mayan', match: 'MAYAN', line: '260 named days. You were born on one of them.', glow: '200,90,70' },
  { s: 'JAPAN · TEMPLES', b: 'Omikuji', match: 'OMIKUJI', line: 'Paper fortunes. The bad ones get tied to a tree and left behind.', glow: '200,80,120' },
  { s: 'EVERYWHERE', b: 'Chiromancy', match: 'CHIROMANCY', line: 'Your palm: the one book you always carry.', glow: '180,150,90' },
];
const P0 = 3.0, PD = 1.7;                       // plates: 3.0 → 14.9
const RUN = [15.0, 17.4];                       // the rattle through the rest
const STEPS = { home: 21.0, sky: 25.0, ask: 29.0, open: 32.5 };
const TAP = [[33.62, 'quit', 120, 488], [34.88, 'quit', 294, 760]];

// The phone (same geometry as the demo film).
const SW = 560, BEZ = 17, K = SW / 590, BW = SW + 2 * BEZ, BH = Math.round(SW * 1280 / 590) + 2 * BEZ;
const N = { x: 0, y: 260, s: 0.72, rx: 3, ry: 0, rz: 0 };
const focus = (sx, sy, s, ty) => ({ x: -(BEZ + sx * K - BW / 2) * s, y: ty - 960 - (BEZ + sy * K - BH / 2) * s, s, rx: 0, ry: 0, rz: 0 });
const mix = (a, b, k) => Object.fromEntries(Object.keys(a).map((key) => [key, lerp(a[key], b[key] ?? a[key], k)]));
function onStage(P, sx, sy) { return [540 + P.x + (BEZ + sx * K - BW / 2) * P.s, 960 + P.y + (BEZ + sy * K - BH / 2) * P.s]; }
const spring = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 2.6));

let S = {};

// The film
export default {
  duration: DUR,
  poster: 5.9,

  score() {
    const flips = [];
    const hits = [P0, ...PLATES.map((_, i) => P0 + i * PD).slice(1), 17.4, 19.0, STEPS.home, STEPS.sky, STEPS.ask, STEPS.open];
    const c = libScore({ duration: DUR, end: END, hits, flips, turns: [20.6] });
    // The clatter: a burst of small clicks every time the board changes.
    const R = rng(3);
    const burst = (t, d = 0.36, g = 0.1) => { for (let x = t; x < t + d; x += 0.05 + R() * 0.04) c.push({ i: 'blip', t: x, n: 84 + Math.floor(R() * 12), g: g * 0.8, dur: 0.05 }); };
    [0.2, 0.7, 1.0].forEach((t) => burst(t, 0.45, 0.12));
    PLATES.forEach((_, i) => burst(P0 + i * PD, 0.42));
    for (let t = RUN[0]; t < RUN[1]; t += 0.1) burst(t, 0.09, 0.09);
    [17.4, 19.0, STEPS.home, STEPS.sky, STEPS.ask, STEPS.open].forEach((t) => burst(t, 0.42));
    c.push({ i: 'riser', t: RUN[0], end: RUN[1], g: 0.2 }, { i: 'boom', t: RUN[1], g: 0.45 });
    TAP.forEach(([t]) => c.push({ i: 'blip', t, n: 86, g: 0.18 }));
    return c;
  },

  async setup(stage) {
    stage.style.background = LIB.night;
    await Promise.all(['500 60px Mono', 'italic 500 64px Cormorant', '700 120px Inter'].map((f) => document.fonts.load(f)));
    const A = await atlas();
    const fold = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/\s*\(.*\)/, '').replace(/[^A-Za-z0-9 \-·]/g, '').toUpperCase();
    const qv = await events('ask-quit');

    S.stars = stars(stage, { seed: 11, n: 160, speed: 1 });
    S.glow = el('div', 'abs', { left: '-300px', top: '200px', width: '1680px', height: '1400px' }, stage);

    // The dataset: every tradition in the atlas, as a tile, a point, then one core.
    const pal = ['#E07A4F', '#5B8DEF', '#3FB6A8', '#C77DDB', '#E0B04F', '#7FA7FF', '#F06A8B', '#8CCB6A', '#B98A5E', '#6FD3E8', '#A99CFF', '#E8E2D0'];
    const order = A.regions.map((r) => r.id);
    S.items = A.list.map((x, i) => {
      const col = i % 6, row = Math.floor(i / 6);
      const z = 1 - (2 * i + 1) / A.list.length, r = Math.sqrt(1 - z * z), ph = i * 2.399963;
      return { n: fold(x.name).slice(0, 16), color: pal[order.indexOf(x.region) % pal.length], gx: 60 + col * 162 + 75, gy: 290 + row * 82 + 35, sx: Math.cos(ph) * r, sy: z, sz: Math.sin(ph) * r, k: PLATES.findIndex((p) => fold(x.name).startsWith(p.match)) };
    });
    S.cv = el('canvas', 'layer', { zIndex: 5 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');
    // Captions: the hook, the counter, the sample card, the model card.
    const mono = (top, size, color = LIB.dim) => el('div', 'abs center', { top: `${top}px`, font: `500 ${size}px/1.3 Mono`, letterSpacing: '0.2em', textTransform: 'uppercase', color, opacity: 0, zIndex: 20 }, stage);
    S.hook = el('div', 'abs center', { top: '800px', whiteSpace: 'nowrap', font: '700 104px/1 Inter', letterSpacing: '-0.045em', color: '#fff', opacity: 0, zIndex: 20 }, stage, 'What happens next?');
    S.hookSub = mono(950, 26); S.hookSub.textContent = 'asked in every culture · in every age';
    S.count = mono(170, 26, CREAM);
    S.card = el('div', 'abs', { left: '150px', width: '780px', top: '700px', padding: '40px 48px', borderRadius: '28px', background: 'rgba(12,14,20,0.92)', zIndex: 20, opacity: 0,
      boxShadow: '0 0 0 1px rgba(255,255,255,0.14), 0 40px 120px rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }, stage);
    S.cardK = el('div', '', { font: '500 22px/1.3 Mono', letterSpacing: '0.2em', color: LIB.dim, textTransform: 'uppercase' }, S.card);
    S.cardN = el('div', '', { font: '700 72px/1.02 Inter', letterSpacing: '-0.04em', color: '#fff', margin: '18px 0 20px' }, S.card);
    S.cardL = el('div', '', { font: 'italic 500 50px/1.16 Cormorant', color: CREAM }, S.card);
    S.big = el('div', 'abs center', { top: '1500px', font: '700 92px/1.04 Inter', letterSpacing: '-0.045em', color: '#fff', opacity: 0, zIndex: 20 }, stage);
    S.spec = el('div', 'abs', { left: '90px', top: '150px', width: '900px', zIndex: 20, opacity: 0 }, stage);
    S.specK = el('div', '', { font: '500 24px/1 Mono', letterSpacing: '0.24em', color: LIB.dim }, S.spec);
    S.specV = el('div', '', { font: '700 76px/1.04 Inter', letterSpacing: '-0.045em', color: '#fff', marginTop: '18px' }, S.spec);

    // The voice: serif lines under the board.
    const voice = (a, b, text, phase) => ({ a, b, phase, e: el('div', 'abs', { left: '90px', width: '900px', textAlign: phase ? 'left' : 'center', font: 'italic 500 64px/1.14 Cormorant', color: CREAM, opacity: 0, zIndex: 12 }, stage, text) });
    S.voice = [
      voice(STEPS.home + 0.3, STEPS.sky - 0.15, 'Every book on the shelf<br>reads that same sky.', 1),
      voice(STEPS.sky + 0.3, STEPS.ask - 0.15, 'Kabbalah. Vedic. Chinese BaZi.<br>Each reads you its own way.', 1),
      voice(STEPS.ask + 0.3, STEPS.open - 0.15, 'It answers like it knows you,<br>because it read you first.', 1),
      voice(STEPS.open + 0.3, END - 0.15, 'Ask about your job:<br>sixteen Yoruba cowries answer.', 1),
    ];

    // The phones: the real app.
    S.clock = {
      home: remap([[0, 0.3, 0], [STEPS.home, 0.3, 1]]),
      sky: remap([[0, 1.0, 0], [STEPS.sky, 1.0, 5]]),
      quick: remap([[0, 0.9, 0], [STEPS.ask, 0.9, 2.3], [30.0, 3.21, 2.0], [31.4, 5.96, 0.4]]),
      quit: remap([[0, 10.3, 0], [STEPS.open, 10.3, 1], [34.1, qv.tap_chip + 0.58, (qv.tap_throw - qv.tap_chip - 0.58) / (34.88 - 34.1)], [34.88, qv.tap_throw, 1]]),
    };
    S.dev = {};
    for (const [k, name] of [['home', 'tour-home'], ['sky', 'tour-explore'], ['quick', 'ask-quickfire'], ['quit', 'ask-quit']]) S.dev[k] = device(stage, name, { skin: 'glass', w: SW });
    S.ring = tapRing(stage, { color: CREAM, size: 110 });
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 90, color: LIB.dim, bg: 'rgba(255,255,255,0.05)', style: { fontSize: '22px' } });
    S.end = libEnd(stage, { line: 'Every way humans ever asked.<br>One model of you.', sub: 'Vedic · Yoruba cowries · Runes · Hafez · and every other', cta: 'plutto.space' });
    S.free = el('div', 'abs center', { top: '1700px', font: '500 24px/1 Mono', letterSpacing: '0.2em', color: LIB.dim, opacity: 0, zIndex: 101 }, stage, 'FREE TO START · ANDROID · WEB');
  },

  async frame(t) {
    S.stars(t);

    S.glow.style.background = `radial-gradient(closest-side, rgba(110,130,255,${t < 20.6 ? 0.16 : 0.2}), transparent)`;
    S.glow.style.transform = `translateY(${Math.sin(t * 0.4) * 40}px)`;
    drawData(t);

    // The hook.
    const hk = ease.outExpo(prog(t, 0.2, 0.9)) * (1 - ease.inCubic(prog(t, 2.7, 3.0)));
    S.hook.style.opacity = hk; S.hook.style.transform = `translateY(${(1 - ease.outExpo(prog(t, 0.2, 0.9))) * 40}px)`;
    S.hookSub.style.opacity = ease.outCubic(prog(t, 0.9, 1.4)) * (1 - ease.inCubic(prog(t, 2.7, 3.0)));

    // The counter, as the dataset loads.
    let n = 0;
    if (t >= P0) n = Math.round(lerp(0, 60, ease.outCubic(prog(t, P0, RUN[0]))));
    if (t >= RUN[0]) n = Math.round(lerp(60, 102, ease.inOutCubic(prog(t, RUN[0], RUN[1]))));
    S.count.textContent = 'every tradition · every continent';
    S.count.style.opacity = t >= P0 && t < 19.0 ? 1 - ease.inCubic(prog(t, 18.6, 19.0)) : 0;

    // The sample card: one tradition at a time, lifted out of the grid.
    const pk = Math.floor((t - P0) / PD);
    if (t >= P0 && pk < PLATES.length) {
      const p = PLATES[pk], u = t - P0 - pk * PD;
      S.cardK.textContent = `sample ${String(pk + 1).padStart(2, '0')} · ${p.s}`; S.cardN.textContent = p.b; S.cardL.textContent = p.line;
      const i = ease.outExpo(prog(u, 0.05, 0.45)), o = ease.inCubic(prog(u, PD - 0.18, PD));
      S.card.style.opacity = i * (1 - o);
      S.card.style.transform = `translateY(${(1 - i) * 50 - o * 30}px) scale(${lerp(0.94, 1, i)})`;
    } else S.card.style.opacity = 0;

    // The claim, under the cloud.
    const BIG = [[17.5, 18.9, 'Every tradition.<br>One model of you.'], [19.1, 20.5, 'Plutto.']];
    const bg = BIG.find(([a, b]) => t >= a && t < b + 0.2);
    if (bg) { S.big.innerHTML = bg[2]; const i = ease.outExpo(prog(t, bg[0], bg[0] + 0.5)), o = ease.inCubic(prog(t, bg[1], bg[1] + 0.2)); S.big.style.opacity = i * (1 - o); S.big.style.transform = `translateY(${(1 - i) * 30}px)`; }
    else S.big.style.opacity = 0;

    // The model card over the app.
    const SPEC = [[STEPS.home, 'INPUT', 'Your birth minute.'], [STEPS.sky, 'CONTEXT', 'Every tradition, at once.'], [STEPS.ask, 'PROMPT', 'Anything. In your words.'], [STEPS.open, 'OUTPUT', 'The right tool opens.']];
    const sp = SPEC.filter(([a]) => t >= a).pop();
    if (sp && t < END) { S.specK.textContent = sp[1]; S.specV.textContent = sp[2]; const i = ease.outExpo(prog(t, sp[0], sp[0] + 0.5)); S.spec.style.opacity = i; S.spec.style.transform = `translateY(${(1 - i) * 24}px)`; }
    else S.spec.style.opacity = 0;

    // The voice.
    S.voice.forEach((v) => {
      const i = ease.outCubic(prog(t, v.a, v.a + 0.5)), o = ease.inCubic(prog(t, v.b, v.b + 0.2));
      const on = t >= v.a && t < v.b + 0.2;
      v.e.style.opacity = on ? i * (1 - o) : 0;
      v.e.style.top = '330px'; v.e.style.font = 'italic 500 50px/1.16 Cormorant'; v.e.style.color = LIB.dim;
      v.e.style.filter = on && i < 1 ? `blur(${(1 - i) * 10}px)` : 'none';
      v.e.style.transform = `translateY(${(1 - i) * 24}px)`;
    });

    // The phones.
    const P = {};
    const idle = (p) => ({ ...p, y: p.y + Math.sin(t * 1.3) * 6, ry: p.ry + Math.sin(t * 0.5) * 4 });
    const swap = (p, a, b) => { const i = 1 - ease.outExpo(prog(t, a, a + 0.4)), o = ease.inCubic(prog(t, b - 0.14, b)); return { ...p, x: p.x + 1150 * i - 1150 * o, ry: p.ry - 22 * i + 16 * o, blur: (i + o) * 14 }; };
    if (t >= 20.8 && t < STEPS.sky) {
      const r = spring(prog(t, 20.8, 21.7));
      const p = idle({ ...N, y: lerp(1500, N.y, r), rx: lerp(30, N.rx, r) });
      const o = ease.inCubic(prog(t, STEPS.sky - 0.14, STEPS.sky));
      P.home = { ...p, x: -1150 * o, blur: o * 14 };
    }
    if (t >= STEPS.sky - 0.05 && t < STEPS.ask) P.sky = swap(idle(N), STEPS.sky, STEPS.ask);
    if (t >= STEPS.ask - 0.05 && t < STEPS.open) {
      const TYPE = focus(295, 1062, 1.25, 1260), REP = focus(300, 230, 1.15, 1080);
      P.quick = swap(mix(TYPE, REP, ease.inOutCubic(prog(t, 29.9, 30.3))), STEPS.ask, STEPS.open);
    }
    if (t >= STEPS.open - 0.05 && t < END) {
      const F = focus(250, 400, 1.12, 1150);
      P.quit = swap(mix(N, F, 1 - spring(prog(t, 33.75, 34.4))), STEPS.open, 99);
      const g2 = ease.inCubic(prog(t, END - 0.35, END));
      P.quit.o = 1 - g2;
    }
    for (const [k, d] of Object.entries(S.dev)) {
      const p = P[k];
      if (!p) { d.pose(t, { o: 0 }); continue; }
      await d.at(S.clock[k](t));
      d.pose(t, { x: p.x, y: p.y, s: p.s, rx: p.rx, ry: p.ry, rz: p.rz, o: p.o ?? 1 });
      d.body.style.filter = p.blur > 0.3 ? `blur(${p.blur.toFixed(1)}px)` : 'none';
    }
    const tp = TAP.filter(([a]) => t >= a - 0.02).pop();
    if (tp && P[tp[1]]) { const [x, y] = onStage(P[tp[1]], tp[2], tp[3]); S.ring(t, tp[0], x, y); } else S.ring(t, -9, 0, 0);
    S.honest(t >= STEPS.ask + 0.3 && t < END ? ease.outCubic(prog(t, STEPS.ask + 0.3, STEPS.ask + 0.6)) : 0);

    // The end.
    S.end(t - END);
    S.free.style.opacity = ease.outCubic(prog(t, END + 1.4, END + 1.9));
  },
};

/** The dataset, drawn: a grid of tiles (3–17.4 s), a rotating cloud (17.4–19 s), one core (19–20.6 s). */
function drawData(t) {
  const g = S.g;
  g.clearRect(0, 0, 1080, 1920);
  if (t < P0 - 0.2 || t > 21.2) return;
  const cloud = ease.inOutCubic(prog(t, RUN[1] - 0.2, RUN[1] + 0.8)), core = ease.inCubic(prog(t, 19.0, 20.2)), gone = prog(t, 20.4, 21.0);
  const pk = Math.floor((t - P0) / PD), rot = t * 0.6;
  const cx = 540, cy = 860, R = 380;
  const pts = S.items.map((it, i) => {
    const shown = t >= P0 + (i / 102) * (RUN[1] - P0);
    const x3 = it.sx * Math.cos(rot) - it.sz * Math.sin(rot), z3 = it.sx * Math.sin(rot) + it.sz * Math.cos(rot);
    const per = 1 / (1.6 - z3 * 0.5);
    const px = cx + x3 * R * per * 1.3, py = cy + it.sy * R * per * 1.3;
    const x = lerp(lerp(it.gx, px, cloud), cx, core), y = lerp(lerp(it.gy, py, cloud), cy, core);
    return { it, x, y, z: z3, shown, lit: it.k === pk && t < RUN[0] };
  }).sort((a, b) => a.z - b.z);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  for (const p of pts) {
    if (!p.shown) continue;
    const a = (1 - gone) * (cloud > 0 ? 0.45 + 0.55 * (p.z + 1) / 2 : 1);
    g.globalAlpha = a;
    if (cloud < 0.5) {
      const w = lerp(150, 10, cloud * 2), h = lerp(70, 10, cloud * 2);
      g.fillStyle = p.lit ? p.it.color : 'rgba(255,255,255,0.045)';
      g.strokeStyle = p.lit ? p.it.color : 'rgba(255,255,255,0.12)';
      g.beginPath(); g.roundRect(p.x - w / 2, p.y - h / 2, w, h, 10); g.fill(); g.stroke();
      g.fillStyle = p.lit ? '#0b0d14' : p.it.color;
      g.font = '500 13px Mono';
      g.globalAlpha = a * (1 - cloud * 2);
      g.fillText(p.it.n, p.x, p.y);
    } else {
      const r = lerp(5, 2.5, core) * (0.7 + 0.6 * (p.z + 1) / 2);
      g.fillStyle = p.it.color;
      g.beginPath(); g.arc(p.x, p.y, r, 0, 6.283); g.fill();
      if (core < 0.2 && p.z > 0.55) { g.globalAlpha = a * 0.8 * (1 - core * 5); g.font = '500 15px Mono'; g.fillStyle = 'rgba(239,230,210,0.8)'; g.fillText(p.it.n, p.x, p.y - 16); }
    }
  }
  // lines between near neighbours in the cloud: the connections
  if (cloud > 0.6 && core < 1) {
    g.globalAlpha = 0.12 * (1 - core) * (1 - gone); g.strokeStyle = '#A9B4FF'; g.lineWidth = 1;
    for (let i = 0; i < pts.length; i += 2) { const q = pts[(i * 7 + 3) % pts.length]; g.beginPath(); g.moveTo(pts[i].x, pts[i].y); g.lineTo(q.x, q.y); g.stroke(); }
  }
  // the core
  if (core > 0) {
    g.globalAlpha = 1 - gone;
    const rr = lerp(10, 90, core) * (1 + 0.05 * Math.sin(t * 8));
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rr * 3);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(180,190,255,0.7)'); gr.addColorStop(1, 'rgba(110,130,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, rr * 3, 0, 6.283); g.fill();
  }
  g.globalAlpha = 1;
}
