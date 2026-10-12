/**
 * JOURNEY · ONE MESSAGE — what happens between "send" and the answer.
 *
 * The stops are the real path a message takes through the server
 * (app/services/oracle/pipeline.py, process_oracle_query):
 *   1 Read      — the classifier: language, tone, the real question
 *   2 Your sky  — the engine computes the birth sky, exactly
 *   3 Routing   — the traditions that fit the question are chosen
 *   4 Memory    — what you have told it before (topic portraits)
 *   5 Council   — each tradition judges its own evidence alone; relatives
 *                 collapse into one witness; agreement sets how sure to sound
 *   6 Timing    — real dates, from the chart
 *   7 Your voice— written in your language and your tone
 *   8 Return    — the reply streams back, and the tool that fits opens
 *
 * The phone is the real app (public/app/screens/ask-quit.webm); the reply is an
 * example written for the film, and the tag says so while it is on screen.
 */
import { el, prog, ease, lerp, rng } from '../lib.js';
import { device, honest, tapRing, events } from '../asked.js';

const DUR = 41;
const SEND = 3.8, J0 = 4.6, SD = 3.6;                // seven stops, 4.6 → 29.8
const RET = 29.8, END = 36.0;
const Q = 'should i quit my job without a plan?';
const A = 'Quit with a date, not a mood.';
const STOPS = [
  { k: 'Read', h: 'It reads you first.', l: 'Your language, your tone, and what you are really asking.', bg: ['#05122b', '#0a2a5c'], glow: '60,220,255' },
  { k: 'Your sky', h: 'Then it computes your sky.', l: 'Every planet where it stood, the minute you were born.', bg: ['#0b0830', '#1d1170'], glow: '255,170,70' },
  { k: 'Routing', h: 'It picks the traditions that fit.', l: 'A career question is not read the way a love question is.', bg: ['#14072e', '#3b1d6e'], glow: '255,120,200' },
  { k: 'Memory', h: 'It remembers you.', l: 'What you told it last month is part of this answer.', bg: ['#120a26', '#2c1460'], glow: '180,140,255' },
  { k: 'Council', h: 'Each tradition judges alone.', l: 'Where they agree, it speaks with certainty. Echoes count once.', bg: ['#1f0610', '#5c1424'], glow: '255,140,80' },
  { k: 'Timing', h: 'It finds real dates.', l: 'Not “soon”. A day you can put in a calendar.', bg: ['#02171a', '#06464c'], glow: '60,255,210' },
  { k: 'Your voice', h: 'Then it writes back.', l: 'In your language. In your tone. Like someone who knows you.', bg: ['#170a1e', '#3d0f4d'], glow: '255,200,120' },
];
// The phone (asked.device geometry at w 520).
const SW = 520, BEZ = 16, K = SW / 590, BW = SW + 2 * BEZ, BH = Math.round(SW * 1280 / 590) + 2 * BEZ;
const onStage = (P, sx, sy) => [540 + P.x + (BEZ + sx * K - BW / 2) * P.s, 960 + P.y + (BEZ + sy * K - BH / 2) * P.s];
let S = {};

const inout = (t, a, b, d = 0.35, o = 0.3) => ease.outCubic(prog(t, a, a + d)) * (1 - ease.inCubic(prog(t, b, b + o)));
const spring = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 2.6));
/** Local time at a stop, with the freeze: motion runs, holds still while the label lands, then runs on. */
const freeze = (u) => (u < 0.5 ? u : u < 1.05 ? 0.5 : u - 0.55);

export default {
  duration: DUR,
  poster: 20.6,

  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.025 }, { i: 'tempo', bpm: 120 }];
    // Typing, then the send.
    const R = rng(7);
    for (let t = 0.6; t < SEND - 0.2; t += 0.07 + R() * 0.05) c.push({ i: 'key', t, g: 0.12 });
    c.push({ i: 'pad', t: 0, end: SEND + 0.5, ns: [50, 57, 62], g: 0.06, bright: 600 });
    c.push({ i: 'blip', t: SEND, n: 86, g: 0.22 }, { i: 'whoosh', t: SEND + 0.1, dur: 0.6, g: 0.3, from: 0.3, to: -0.3 }, { i: 'riser', t: SEND, end: J0, g: 0.25 });
    // The journey: a steady cinematic pulse; each stop gets a whoosh in, a shutter on the freeze, its own colour of sound.
    c.push({ i: 'pump', t: J0, end: RET, depth: 0.4 });
    const CH = [[50, 57, 62, 65], [46, 53, 58, 62], [53, 57, 60, 65], [48, 55, 60, 64]];
    for (let t = J0, k = 0; t < RET - 0.01; t += 0.5, k++) {
      c.push({ i: 'kick', t, g: 0.42 }, { i: 'hat', t: t + 0.25, g: 0.06 });
      const ch = CH[Math.floor((t - J0) / 2) % 4];
      c.push({ i: 'pluck', t: t + 0.25, n: ch[k % 4] + 12, g: 0.07, dur: 1.2 });
      if (k % 8 === 0) c.push({ i: 'saw', t, ns: ch.slice(0, 3), dur: 3.6, a: 0.6, rel: 1.2, cut: 800, env: 1.3, g: 0.12, verb: 0.6, spread: 0.5 });
    }
    STOPS.forEach((s, i) => {
      const a = J0 + i * SD;
      c.push({ i: 'whoosh', t: a - 0.25, dur: 0.35, g: 0.26, from: i % 2 ? -0.7 : 0.7, to: i % 2 ? 0.7 : -0.7 });
      c.push({ i: 'hit', t: a + 0.5, g: 0.24 }, { i: 'subb', t: a + 0.5, n: 33, dur: 0.5, g: 0.36 }, { i: 'rim', t: a + 0.5, g: 0.18 });
      if (i === 0) for (let x = 0; x < 6; x++) c.push({ i: 'blip', t: a + 1.1 + x * 0.22, n: 84 + x * 2, g: 0.1 });
      if (i === 1) [74, 79, 81, 86, 88].forEach((n, x) => c.push({ i: 'bell', t: a + 1.1 + x * 0.3, n, g: 0.07 }));
      if (i === 2) for (let x = 0; x < 4; x++) c.push({ i: 'whoosh', t: a + 1.2 + x * 0.35, dur: 0.15, g: 0.08 });
      if (i === 3) [76, 81, 83].forEach((n, x) => c.push({ i: 'pluck', t: a + 1.2 + x * 0.4, n, g: 0.08, dur: 2 }));
      if (i === 4) c.push({ i: 'choir', t: a + 0.6, end: a + SD, ns: [57, 64, 69], g: 0.09, vowel: 'a' });
      if (i === 5) for (let x = 0; x < 8; x++) c.push({ i: 'rim', t: a + 1.1 + x * 0.25, g: 0.1 });
      if (i === 6) [72, 76, 79, 84].forEach((n, x) => c.push({ i: 'chop', t: a + 1.1 + x * 0.3, n, dur: 0.2, g: 0.1, vowel: x % 2 ? 'o' : 'a', echo: 0.3 }));
    });
    // The return: the pulse drops away, the reply lands, the tool opens.
    c.push({ i: 'reverse', end: RET + 0.6, dur: 1.0, g: 0.3 }, { i: 'boom', t: RET + 0.6, g: 0.5 }, { i: 'pad', t: RET, end: END, ns: [57, 64, 69], g: 0.06, bright: 1000 });
    c.push({ i: 'blip', t: 32.72, n: 86, g: 0.2 }, { i: 'blip', t: 33.86, n: 88, g: 0.2 }, { i: 'whoosh', t: 33.9, dur: 0.4, g: 0.18 });
    c.push({ i: 'boom', t: END, g: 0.6 }, { i: 'sting', t: END + 0.05, g: 0.7 }, { i: 'saw', t: END, ns: [57, 64, 69, 73], dur: 3, a: 0.2, rel: 1.6, cut: 1200, env: 1.4, g: 0.2, verb: 0.6, spread: 0.6 });
    return c;
  },

  async setup(stage) {
    stage.style.background = '#03040a';
    await Promise.all(['800 64px Inter', '600 40px Inter', 'italic 500 48px Cormorant', '500 84px Cormorant', '500 24px Mono', '700 140px Inter'].map((f) => document.fonts.load(f)));
    const qv = await events('ask-quit');
    S.qv = qv;

    // The world the message travels through: one layer per stop, each its own colour.
    S.bgs = STOPS.map((s) => el('div', 'layer', { opacity: 0, background: `radial-gradient(80% 55% at 50% 40%, ${s.bg[1]}, ${s.bg[0]} 70%)` }, stage));
    S.cv = el('canvas', 'layer', { zIndex: 2 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');
    S.stars = Array.from({ length: 220 }, (_, i) => { const r = rng(i + 3); return { x: r() * 1080, y: r() * 1920, z: 0.2 + r() * 0.8 }; });

    // Stop 1: the words and their tags.
    S.read = el('div', 'layer', { zIndex: 5, opacity: 0 }, stage);
    S.readWords = Q.split(' ').map((w, i) => el('span', '', { display: 'inline-block', margin: '0 12px', font: '700 78px/1.25 Inter', color: '#E8F7FF', letterSpacing: '-0.03em' }, null, w));
    const rw = el('div', 'abs center', { top: '420px', padding: '0 70px' }, S.read); S.readWords.forEach((w) => rw.appendChild(w));
    S.tags = [['language', 'English', '60,220,255'], ['tone', 'anxious · direct', '255,120,200'], ['topic', 'work', '255,200,90'], ['really asking', 'should I leave?', '140,255,160']].map(([k, v, c], i) =>
      el('div', 'abs', { left: `${[90, 560, 90, 560][i]}px`, top: `${[820, 820, 960, 960][i]}px`, width: '430px', padding: '16px 22px', borderRadius: '18px', border: `2px solid rgb(${c})`, background: `rgba(${c},0.12)`,
        boxShadow: `0 0 30px rgba(${c},0.4)`, color: '#fff', opacity: 0 }, S.read, `<div style="font:500 20px Mono;letter-spacing:.18em;text-transform:uppercase;color:rgb(${c})">${k}</div><div style="font:700 40px/1.2 Inter;margin-top:6px">${v}</div>`));
    S.beam = el('div', 'abs', { left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, transparent, #3CF2FF, transparent)', boxShadow: '0 0 40px #3CF2FF', opacity: 0 }, S.read);

    // Stop 2: the sky (planets on the canvas), Stop 3: the cards, Stop 5: the pillars.
    S.planetImgs = ['sun', 'mercury', 'venus', 'mars', 'Neptune', 'Uranus', 'rahu'].map((n) => { const i = new Image(); i.src = `../../public/planets/${n}.png`; return i; });
    S.route = el('div', 'layer', { zIndex: 5, opacity: 0 }, stage);
    const rc = el('div', 'abs', { left: '540px', top: '780px', width: 0, height: 0 }, S.route);
    const L = '../../public/library';
    const deck = ['tarot/the_star', 'runes/fehu', 'tarot/the_sun', 'iching/qian', 'tarot/the_moon', 'ogham/beith', 'tarot/wheel_of_fortune', 'lenormand/anchor', 'tarot/the_world', 'geomancy/albus', 'tarot/the_magician', 'runes/ansuz', 'tarot/the_hermit', 'iching/li', 'tarot/justice', 'lenormand/birds'];
    S.cards = deck.map((d, i) => { const e = el('img', 'abs', { left: '-70px', top: '-120px', width: '140px', height: '238px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 0 0 2px rgba(255,220,160,0.5), 0 14px 30px rgba(0,0,0,0.5)' }, rc); e.src = `${L}/${d}.webp`; return { e, a: (i / deck.length) * Math.PI * 2 }; });
    S.picked = [0, 4, 8, 12];
    S.pickNames = ['Vedic', 'Western', 'Chinese BaZi', 'Kabbalah'].map((n) => el('div', 'abs', { font: 'italic 500 44px/1 Cormorant', color: '#FFE9D2', textShadow: '0 0 20px rgba(255,120,200,0.9)', opacity: 0, whiteSpace: 'nowrap', transform: 'translateX(-50%)' }, rc, n));
    S.council = el('div', 'layer', { zIndex: 5, opacity: 0 }, stage);
    S.pillars = ['tarot/the_sun', 'runes/algiz', 'iching/kun', 'tarot/the_star', 'tarot/justice'].map((d, i) => {
      const x = 140 + i * 200;
      const col = el('div', 'abs', { left: `${x - 60}px`, top: '420px', width: '120px', height: '760px', borderRadius: '60px', background: 'linear-gradient(rgba(255,170,90,0.85), rgba(255,60,90,0.25) 70%, transparent)', boxShadow: '0 0 60px rgba(255,120,80,0.6)', transformOrigin: '50% 100%' }, S.council);
      const img = el('img', 'abs', { left: `${x - 55}px`, top: '300px', width: '110px', height: '187px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 0 0 2px rgba(255,230,180,0.7)' }, S.council); img.src = `${L}/${d}.webp`;
      const mark = el('div', 'abs', { left: `${x - 40}px`, top: '540px', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: i === 3 ? '#3b3b44' : '#fff', color: '#111', font: '800 46px/1 Inter', opacity: 0 }, S.council, i === 3 ? '–' : '✓');
      return { col, img, mark, x };
    });
    S.meter = el('div', 'abs', { left: '140px', right: '140px', top: '1260px', height: '26px', borderRadius: '13px', background: 'rgba(255,255,255,0.12)', overflow: 'hidden', opacity: 0 }, S.council);
    S.meterFill = el('div', '', { height: '100%', width: '0%', background: 'linear-gradient(90deg, #FF5A5F, #FFB347, #FFE08A)', boxShadow: '0 0 30px #FFB347' }, S.meter);
    S.meterL = el('div', 'abs center', { top: '1300px', font: '500 22px/1 Mono', letterSpacing: '0.2em', color: '#FFD9B0', opacity: 0 }, S.council, 'HOW SURE TO SOUND · STEADY');

    // Stop 6: the timeline.
    S.time = el('div', 'layer', { zIndex: 5, opacity: 0 }, stage);
    S.track = el('div', 'abs', { left: 0, top: '820px', width: '4200px', height: '4px', background: 'linear-gradient(90deg, rgba(60,255,210,0.1), #3CFFD2 30%, #3CFFD2 70%, rgba(60,255,210,0.1))', boxShadow: '0 0 30px #3CFFD2' }, S.time);
    ['AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR', 'MAY'].forEach((m, i) => {
      el('div', 'abs', { left: `${300 + i * 380}px`, top: '-26px', width: '2px', height: '56px', background: '#3CFFD2' }, S.track);
      el('div', 'abs', { left: `${300 + i * 380 - 40}px`, top: '50px', width: '80px', textAlign: 'center', font: '500 26px/1 Mono', letterSpacing: '0.15em', color: '#AFFFEF' }, S.track, m);
    });
    S.pinX = 300 + 3 * 380 + 380 * (3 / 30);
    S.pin = el('div', 'abs', { left: `${S.pinX - 18}px`, top: '-160px', width: '36px', height: '36px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 0 8px rgba(60,255,210,0.4), 0 0 60px #3CFFD2', opacity: 0 }, S.track);
    S.pinL = el('div', 'abs', { left: `${S.pinX - 300}px`, top: '-330px', width: '600px', textAlign: 'center', opacity: 0 }, S.track,
      '<div style="font:700 72px/1 Inter;color:#fff;letter-spacing:-0.03em">4 November</div><div style="font:italic 500 44px/1.2 Cormorant;color:#C8FFF2;margin-top:12px">a year for rest, foreign places,<br>and letting go begins</div>');

    // Stop 7: scripts condensing into the reply.
    S.voice = el('div', 'layer', { zIndex: 5, opacity: 0 }, stage);
    S.voiceLine = el('div', 'abs center', { top: '640px', font: 'italic 500 104px/1.05 Cormorant', color: '#FFF3E0', textShadow: '0 0 40px rgba(255,180,90,0.8)', padding: '0 60px', opacity: 0 }, S.voice, A);
    S.glyphs = [];
    const SCR = ['ᚠᚢᚦᚨᚱᚲᚷ', 'अकगजतनम', 'אבגדהוז', 'ابجدهوز', 'ΑΒΓΔΘΛΩ', 'あいうえおか', '天地人命運福'];
    const FN = ['Runic', 'Deva', 'Hebrew', 'Arabic', 'InterGreek', 'JP', 'CJK'];
    const RG = rng(12);
    for (let i = 0; i < 90; i++) { const s = Math.floor(RG() * SCR.length), cs = [...SCR[s]];
      S.glyphs.push({ e: el('div', 'abs', { font: `${40 + RG() * 50}px ${FN[s]}`, color: `hsl(${Math.floor(RG() * 360)}, 90%, 72%)`, textShadow: '0 0 18px currentColor' }, S.voice, cs[Math.floor(RG() * cs.length)]),
        x: RG() * 1080, y: 200 + RG() * 1300, a: RG() * 6.28 }); }

    // The messenger: the message itself, as it travels.
    S.msg = el('div', 'abs', { left: 0, top: 0, zIndex: 20, maxWidth: '720px', padding: '26px 36px', borderRadius: '40px', background: 'rgba(30,30,38,0.92)', color: '#fff', font: '600 44px/1.25 Inter', letterSpacing: '-0.01em',
      whiteSpace: 'nowrap', opacity: 0, transformOrigin: '50% 50%' }, stage, Q);
    S.trail = [];

    // The phone, the frame lines, the labels.
    S.dev = device(stage, 'ask-quit', { skin: 'glass', w: SW });
    S.dev.el.style.zIndex = 15;
    S.ring = tapRing(stage, { color: '#fff', size: 110 });
    S.freezeF = el('div', 'abs', { left: '28px', right: '28px', top: '28px', bottom: '28px', border: '3px solid rgba(255,255,255,0.9)', zIndex: 34, opacity: 0, pointerEvents: 'none' }, stage);
    S.floor = el('div', 'abs', { left: 0, right: 0, bottom: 0, height: '640px', zIndex: 33, opacity: 0, background: 'linear-gradient(rgba(3,4,10,0), rgba(3,4,10,0.88) 40%, rgba(3,4,10,0.95))' }, stage);
    S.card = el('div', 'abs', { left: '70px', right: '70px', top: '1440px', zIndex: 35, opacity: 0 }, stage);
    S.cardK = el('div', '', { font: '500 24px/1 Mono', letterSpacing: '0.22em', textTransform: 'uppercase' }, S.card);
    S.cardH = el('div', '', { font: '800 70px/1.02 Inter', letterSpacing: '-0.045em', color: '#fff', marginTop: '16px' }, S.card);
    S.cardL = el('div', '', { font: 'italic 500 48px/1.15 Cormorant', color: 'rgba(255,255,255,0.85)', marginTop: '14px' }, S.card);
    // the route map: eight dots across the top
    S.map = el('div', 'abs', { left: '120px', right: '120px', top: '110px', height: '30px', zIndex: 35, opacity: 0 }, stage);
    el('div', 'abs', { left: 0, right: 0, top: '14px', height: '2px', background: 'rgba(255,255,255,0.25)' }, S.map);
    S.dots = [...STOPS.map((s) => s.k), 'Answer'].map((k, i, all) => {
      const d = el('div', 'abs', { left: `${(i / (all.length - 1)) * 100}%`, top: '5px', width: '20px', height: '20px', marginLeft: '-10px', borderRadius: '50%', background: '#03040a', border: '2px solid rgba(255,255,255,0.5)' }, S.map);
      const l = el('div', 'abs', { left: `${(i / (all.length - 1)) * 100}%`, top: '40px', transform: 'translateX(-50%)', font: '500 17px/1 Mono', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', whiteSpace: 'nowrap' }, S.map, k);
      return { d, l };
    });
    S.top = el('div', 'abs center', { top: '150px', font: '800 76px/1.04 Inter', letterSpacing: '-0.045em', color: '#fff', zIndex: 35, opacity: 0 }, stage, 'What happens<br>when you ask?');
    S.retH = el('div', 'abs center', { top: '150px', font: '800 72px/1.04 Inter', letterSpacing: '-0.045em', color: '#fff', zIndex: 35, opacity: 0 }, stage);
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 80, color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.08)', style: { fontSize: '22px', zIndex: 36 } });
    S.flash = el('div', 'layer', { background: '#fff', opacity: 0, zIndex: 50 }, stage);
    S.end = el('div', 'layer', { zIndex: 60, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '50px',
      background: 'repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,170,60,0.08) 0deg 4deg, transparent 4deg 12deg), radial-gradient(70% 45% at 50% 46%, #3b1d6e 0%, #1a0f3d 50%, #07051a 100%)' }, stage);
    S.endA = el('div', '', { font: 'italic 500 86px/1.1 Cormorant', color: '#FFF1DA', textAlign: 'center', padding: '0 80px' }, S.end, 'Your question takes the long way,<br>so you don’t have to.');
    S.endW = el('div', '', { font: '700 140px/1 Inter', letterSpacing: '-0.045em', color: '#fff' }, S.end, 'Plutto');
    S.endC = el('div', '', { font: '600 42px/1 Inter', color: '#000', background: '#FFF1DA', borderRadius: '999px', padding: '26px 58px' }, S.end, 'plutto.space');
    S.endS = el('div', '', { font: '500 24px/1 Mono', letterSpacing: '0.24em', color: 'rgba(255,241,218,0.6)', textTransform: 'uppercase' }, S.end, 'Free to start · Android · Web');
  },

  async frame(t) {
    const si = Math.floor((t - J0) / SD), inJ = t >= J0 && t < RET, u = t - J0 - si * SD, lt = freeze(u);
    const st = inJ ? STOPS[si] : null;

    // ── the world: background per stop, whip between stops ──
    S.bgs.forEach((b, i) => { b.style.opacity = inJ && i === si ? 1 : 0; });
    const whipIn = inJ ? 1 - ease.outExpo(prog(u, 0, 0.4)) : 0, dir = si % 2 ? -1 : 1;
    const cam = (e, extra = '') => { e.style.transform = `translateX(${dir * 1100 * whipIn}px) scale(${1.12 - 0.12 * ease.outCubic(prog(lt, 0, 3))}) ${extra}`; e.style.filter = whipIn > 0.02 ? `blur(${whipIn * 18}px)` : 'none'; };

    // canvas: stars (all stops), the orrery (stop 2), memory constellation (stop 4)
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    if (inJ) {
      g.save(); g.translate(dir * 1100 * whipIn, 0);
      for (const p of S.stars) { g.globalAlpha = 0.25 + 0.6 * p.z; g.fillStyle = `rgb(${st.glow})`; const y = (p.y + t * 60 * p.z) % 1920; g.fillRect(p.x, y, 1.5 * p.z + 0.5, 1.5 * p.z + 0.5); }
      g.globalAlpha = 1;
      if (si === 1) {
        const cx = 540, cy = 760, R0 = [0, 110, 170, 235, 300, 370, 430];
        g.strokeStyle = 'rgba(255,190,110,0.35)'; g.lineWidth = 1.5;
        for (let r = 1; r < R0.length; r++) { g.beginPath(); g.ellipse(cx, cy, R0[r], R0[r] * 0.92, 0, 0, 6.283); g.stroke(); }
        // the twelve houses, drawn on
        const spokes = ease.outCubic(prog(lt, 0.6, 1.8));
        g.strokeStyle = 'rgba(255,220,170,0.4)';
        for (let k = 0; k < 12; k++) { const a = k / 12 * 6.283 - 1.57; g.beginPath(); g.moveTo(cx + Math.cos(a) * 470, cy + Math.sin(a) * 470 * 0.92); g.lineTo(cx + Math.cos(a) * (470 + 60 * spokes), cy + Math.sin(a) * (470 + 60 * spokes) * 0.92); g.stroke(); }
        // planets slide along their orbits and lock to the birth minute
        S.planetImgs.forEach((im, k) => {
          const lock = ease.outCubic(prog(lt, 0.4 + k * 0.18, 1.6 + k * 0.18));
          const final = [0, 2.1, 4.4, 0.9, 3.3, 5.6, 1.7][k], a = final + (1 - lock) * (3 + k);
          const r = R0[k], x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r * 0.92, sz = k === 0 ? 230 : 96 + (k % 3) * 24;
          if (im.complete && im.naturalWidth) { g.save(); g.beginPath(); g.arc(x, y, sz * 0.36, 0, 6.283); g.clip(); g.drawImage(im, x - sz / 2, y - sz / 2, sz, sz); g.restore();
            const hal = g.createRadialGradient(x, y, sz * 0.3, x, y, sz * 0.75); hal.addColorStop(0, 'rgba(255,190,110,0.35)'); hal.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = hal; g.beginPath(); g.arc(x, y, sz * 0.75, 0, 6.283); g.fill(); }
          if (k && lock > 0.98) { g.strokeStyle = `rgba(255,220,160,${0.8 * (1 - prog(lt, 1.6 + k * 0.18, 2.4 + k * 0.18))})`; g.beginPath(); g.arc(x, y, 30 + 40 * prog(lt, 1.6 + k * 0.18, 2.4 + k * 0.18), 0, 6.283); g.stroke(); }
        });
      }
      if (si === 3) {
        const R = rng(5), nodes = ['the new job in March', 'your sister', 'moving cities', 'the promotion you turned down', 'sleep', 'your father', 'money', 'last year’s burnout', 'the trip to Lisbon', 'what you said in June'];
        g.font = 'italic 500 34px Cormorant'; g.textAlign = 'center';
        nodes.forEach((n, k) => {
          const a = k / nodes.length * 6.283 + lt * 0.15, r = 300 + R() * 160, x = 540 + Math.cos(a) * r, y = 760 + Math.sin(a) * r * 1.15;
          const on = ease.outCubic(prog(lt, 0.4 + k * 0.12, 1.0 + k * 0.12));
          g.globalAlpha = on; g.strokeStyle = 'rgba(200,170,255,0.5)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(540, 760); g.lineTo(x, y); g.stroke();
          g.fillStyle = 'rgba(200,170,255,1)'; g.beginPath(); g.arc(x, y, 8, 0, 6.283); g.fill();
          g.fillStyle = '#EDE4FF'; g.fillText(n, x, y - 22);
        });
        g.globalAlpha = 1;
      }
      g.restore();
    }

    // stop 1: the words light up one by one under a scanning beam, then the tags
    S.read.style.opacity = inJ && si === 0 ? 1 : 0;
    if (si === 0 && inJ) {
      cam(S.read);
      S.readWords.forEach((w, k) => { const on = prog(lt, 0.2 + k * 0.08, 0.5 + k * 0.08); w.style.color = on > 0.5 ? '#3CF2FF' : '#E8F7FF'; w.style.textShadow = on > 0.5 ? '0 0 24px rgba(60,242,255,0.8)' : 'none'; });
      S.beam.style.opacity = inout(lt, 0.1, 1.1, 0.1, 0.2); S.beam.style.top = `${lerp(380, 760, prog(lt, 0.1, 1.2))}px`;
      S.tags.forEach((e, k) => { const p = spring(prog(lt, 1.0 + k * 0.22, 1.5 + k * 0.22)); e.style.opacity = p > 0 ? 1 : 0; e.style.transform = `scale(${p})`; });
    }
    // stop 3: the cards turn; four are chosen and pulled forward
    S.route.style.opacity = inJ && si === 2 ? 1 : 0;
    if (si === 2 && inJ) {
      cam(S.route);
      S.cards.forEach((c, k) => {
        const pick = S.picked.indexOf(k), pk = pick >= 0 ? ease.outBack(prog(lt, 1.0 + pick * 0.25, 1.5 + pick * 0.25)) : 0;
        const a = c.a + lt * 0.6, r = 380;
        const x = lerp(Math.cos(a) * r, (pick - 1.5) * 230, pk), y = lerp(Math.sin(a) * r, 520, pk);
        c.e.style.transform = `translate(${x}px, ${y}px) rotate(${lerp(a * 57.3 + 90, 0, pk)}deg) scale(${1 + pk * 0.35})`;
        c.e.style.opacity = pick < 0 && lt > 1.0 ? 1 - 0.65 * prog(lt, 1.0, 1.6) : 1;
        c.e.style.boxShadow = pk > 0.5 ? '0 0 0 3px #FF78C8, 0 0 60px rgba(255,120,200,0.9)' : '0 0 0 2px rgba(255,220,160,0.5), 0 14px 30px rgba(0,0,0,0.5)';
        c.e.style.zIndex = pk > 0 ? 3 : 1;
        if (pick >= 0) { const nl = S.pickNames[pick]; nl.style.left = `${(pick - 1.5) * 230}px`; nl.style.top = `${520 + 200}px`; nl.style.opacity = ease.outCubic(prog(lt, 1.4 + pick * 0.25, 1.8 + pick * 0.25)); }
      });
    }
    // stop 5: the council
    S.council.style.opacity = inJ && si === 4 ? 1 : 0;
    if (si === 4 && inJ) {
      cam(S.council);
      S.pillars.forEach((p, k) => {
        const rise = spring(prog(lt, 0.2 + k * 0.1, 0.9 + k * 0.1));
        p.col.style.transform = `scaleY(${rise})`; p.img.style.opacity = rise;
        const m = spring(prog(lt, 1.1 + k * 0.18, 1.5 + k * 0.18)); p.mark.style.opacity = m > 0 ? 1 : 0; p.mark.style.transform = `scale(${m})`;
      });
      // echoes count once: the second pillar folds into the first
      const merge = ease.inOutCubic(prog(lt, 2.0, 2.5));
      [S.pillars[1].col, S.pillars[1].img, S.pillars[1].mark].forEach((e) => { e.style.translate = `${-200 * merge}px 0`; e.style.opacity = String(1 - merge * 0.9); });
      S.meter.style.opacity = S.meterL.style.opacity = ease.outCubic(prog(lt, 2.2, 2.5));
      S.meterFill.style.width = `${78 * ease.outCubic(prog(lt, 2.3, 2.9))}%`;
    }
    // stop 6: the timeline, the pin on a real date
    S.time.style.opacity = inJ && si === 5 ? 1 : 0;
    if (si === 5 && inJ) {
      S.time.style.filter = whipIn > 0.02 ? `blur(${whipIn * 18}px)` : 'none';
      const pan = lerp(0, S.pinX - 540, ease.inOutCubic(prog(lt, 0.0, 1.4)));
      S.track.style.transform = `translateX(${dir * 1100 * whipIn - pan}px)`;
      const drop = spring(prog(lt, 1.3, 1.9));
      S.pin.style.opacity = lt > 1.3 ? 1 : 0; S.pin.style.transform = `translateY(${(1 - drop) * -300 + 160 - 18}px)`;
      S.pinL.style.opacity = ease.outCubic(prog(lt, 1.7, 2.1));
    }
    // stop 7: every script swirls in and condenses into the reply
    S.voice.style.opacity = inJ && si === 6 ? 1 : 0;
    if (si === 6 && inJ) {
      cam(S.voice);
      const cond = ease.inOutCubic(prog(lt, 0.8, 2.2));
      S.glyphs.forEach((gl, k) => {
        const a = gl.a + lt * 1.2, x = lerp(gl.x + Math.cos(a) * 40, 540, cond), y = lerp(gl.y + Math.sin(a) * 40, 700, cond);
        gl.e.style.transform = `translate(${x}px, ${y}px) scale(${1 - cond * 0.8})`; gl.e.style.opacity = 1 - prog(lt, 1.9, 2.3);
      });
      S.voiceLine.style.opacity = ease.outCubic(prog(lt, 2.0, 2.5)); S.voiceLine.style.filter = `blur(${(1 - ease.outCubic(prog(lt, 2.0, 2.6))) * 12}px)`;
    }

    // ── the messenger ──
    let mx = 540, my = 700, ms = 1, mo = 0, mtxt = Q, mglow = '60,220,255';
    const P0 = { x: 0, y: 140, s: 0.9 };
    if (t >= SEND && t < J0 + 0.4) {
      const [sx, sy] = onStage(P0, 300, 1062);
      const p = ease.inOutCubic(prog(t, SEND, J0));
      mx = lerp(sx, 540, p); my = lerp(sy, 300, p) - Math.sin(p * Math.PI) * 200; ms = lerp(0.6, 1, p); mo = 1;
    } else if (inJ) {
      mo = 1; my = si === 1 || si === 3 ? 760 : si === 2 ? 300 : si === 4 ? 260 : si === 5 ? 560 : 330;
      ms = si === 1 || si === 3 ? 0.62 : 0.8; mglow = st.glow;
      mx = 540 + dir * 1100 * whipIn;
      if (si === 6) { mo = 1 - prog(lt, 1.9, 2.3); }
      if (si === 0) { mo = 1 - prog(lt, 0.0, 0.25); ms = lerp(0.8, 1.6, prog(lt, 0, 0.25)); }
    } else if (t >= RET && t < RET + 1.2) {
      const p = ease.inOutCubic(prog(t, RET, RET + 0.9));
      const [ex, ey] = onStage(P0, 300, 170);
      mx = lerp(540, ex, p); my = lerp(560, ey, p); ms = lerp(0.9, 0.45, p); mo = 1 - prog(t, RET + 0.8, RET + 1.1); mtxt = A; mglow = '255,200,120';
    }
    S.msg.style.opacity = mo;
    if (mo > 0) {
      if (S.msg.textContent !== mtxt) S.msg.textContent = mtxt;
      const w = S.msg.offsetWidth, h = S.msg.offsetHeight;
      S.msg.style.transform = `translate(${mx - w / 2}px, ${my - h / 2}px) scale(${ms})`;
      S.msg.style.boxShadow = `0 0 0 2px rgba(${mglow},0.9), 0 0 60px rgba(${mglow},0.7), 0 0 160px rgba(${mglow},0.35)`;
      S.msg.style.background = mtxt === A ? 'rgba(20,16,30,0.95)' : 'rgba(30,30,38,0.92)';
      S.msg.style.font = mtxt === A ? 'italic 500 52px/1.2 Cormorant' : '600 44px/1.25 Inter';
    }

    // ── the phone: before the send, and on the return ──
    const qv = S.qv;
    let ph = null, ft = 0;
    if (t < J0 + 0.2) {
      const drop = ease.inCubic(prog(t, SEND + 0.2, J0 + 0.2));
      ph = { x: 0, y: 140 + drop * 1500, s: 0.9 - drop * 0.2, rx: 3 + drop * 40 };
      ft = t < SEND ? 1.0 + t * ((qv.send_0 - 1.0) / SEND) : qv.send_0;
    } else if (t >= RET) {
      const up = spring(prog(t, RET + 0.2, RET + 1.0));
      ph = { x: 0, y: lerp(1500, 140, up), s: 0.9, rx: lerp(40, 3, up) };
      ft = t < 32.2 ? 7.4 + (t - RET) * 0.75 : t < 33.4 ? qv.tap_chip - 0.5 + (t - 32.2) : t < 33.86 ? 13.5 + (t - 33.4) : qv.tap_throw + (t - 33.86);
    }
    if (ph && t < END) { await S.dev.at(ft); S.dev.pose(t, { x: ph.x, y: ph.y, s: ph.s, rx: ph.rx, o: 1 - ease.inCubic(prog(t, END - 0.3, END)) }); }
    else S.dev.pose(t, { o: 0 });
    const tap = t >= 32.6 && t < 33.4 ? [32.72, 120, 488] : t >= 33.8 ? [33.86, 294, 760] : null;
    if (tap && ph) { const [x, y] = onStage({ x: 0, y: ph.y, s: 0.9 }, tap[1], tap[2]); S.ring(t, tap[0], x, y); } else S.ring(t, -9, 0, 0);

    // ── type ──
    S.top.style.opacity = inout(t, 0.2, SEND - 0.3, 0.5, 0.3);
    const RT = [[RET + 0.8, 32.5, 'The answer,<br>back on your screen.'], [32.6, END - 0.2, 'And the tool<br>that fits opens.']];
    const rt = RT.find(([a, b]) => t >= a && t < b + 0.3);
    if (rt) { if (S.retH.innerHTML !== rt[2]) S.retH.innerHTML = rt[2]; S.retH.style.opacity = inout(t, rt[0], rt[1], 0.4, 0.25); } else S.retH.style.opacity = 0;
    S.honest(t >= RET + 0.8 && t < END ? 1 : 0);

    // the freeze: frame lines snap on, the label card lands, the route map marks the stop
    if (inJ) {
      const fz = u >= 0.5 && u < 1.05;
      S.freezeF.style.opacity = fz ? 1 - prog(u, 0.9, 1.05) : 0;
      S.freezeF.style.borderColor = `rgb(${st.glow})`;
      S.flash.style.opacity = u >= 0.5 && u < 0.6 ? 0.35 * (1 - (u - 0.5) / 0.1) : 0;
      S.card.style.opacity = inout(u, 0.5, SD - 0.3, 0.3, 0.25); S.floor.style.opacity = 1;
      S.card.style.transform = `translateY(${(1 - ease.outExpo(prog(u, 0.5, 0.9))) * 60}px)`;
      S.cardK.textContent = `Stop ${si + 1} · ${st.k}`; S.cardK.style.color = `rgb(${st.glow})`;
      S.cardH.textContent = st.h; S.cardL.textContent = st.l;
    } else { S.freezeF.style.opacity = 0; S.card.style.opacity = 0; S.flash.style.opacity = 0; S.floor.style.opacity = 0; }
    S.map.style.opacity = t >= J0 - 0.3 && t < END ? ease.outCubic(prog(t, J0 - 0.3, J0)) : 0;
    const cur = inJ ? si : t >= RET ? 7 : -1;
    S.dots.forEach(({ d, l }, i) => {
      const done = i < cur, now = i === cur, c = now ? (inJ ? st.glow : '255,200,120') : '255,255,255';
      d.style.background = now || done ? `rgb(${c})` : '#03040a';
      d.style.boxShadow = now ? `0 0 20px rgb(${c})` : 'none';
      d.style.transform = `scale(${now ? 1.4 : 1})`;
      l.style.color = now ? `rgb(${c})` : 'rgba(255,255,255,0.4)';
    });

    // ── the end ──
    const te = t - END;
    S.end.style.opacity = te >= 0 ? ease.outCubic(prog(te, 0, 0.5)) : 0;
    [[S.endA, 0.2], [S.endW, 1.4], [S.endC, 2.0], [S.endS, 2.3]].forEach(([e, a]) => { const p = ease.outCubic(prog(te, a, a + 0.9)); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 30}px)`; e.style.filter = `blur(${(1 - p) * 8}px)`; });
  },
};
