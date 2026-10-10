/**
 * DEMO · PLUTTO — the product film. Thirty-two seconds, 120 BPM, one cut per
 * idea: the line for your day, the dead hour, what is coming; ask anything, the
 * answer opens the right tool, it speaks your language, it keeps score, and a
 * whole sky to explore. Then the ring and the address.
 *
 * Studio look: black stage, a slow violet glow behind a glass phone in 3D, an
 * outlined marquee word per chapter, heavy tight Inter headlines that turn on
 * one Cormorant italic word, small mono chapter marks, whip cuts on the beat.
 *
 * Every screen is the REAL app (its web build, recorded: public/app/screens/
 * tour-*.webm and ask-*.webm). The chat replies are written for the film, so
 * the honesty tag rides along while a reply or the room it opened is on screen.
 */
import { el, prog, ease, lerp, footage, rng } from '../lib.js';
import { events, remap, device, honest, tapRing } from '../asked.js';
import { ringEnd } from '../cine.js';

const CREAM = '#F5EEDE', LAV = '#C9B8FF';
const DUR = 32;
const BEAT = 0.5;

// Chapters: when each phone is on, its marquee word, its chapter mark.
const CUT = { home: 2.0, ask: 7.0, tool: 12.0, lang: 16.5, score: 20.5, sky: 23.5, fan: 26.0, end: 28.0 };
const TAP = { chip: 14.3, throw: 15.3, hinglish: 18.94, happened: 22.0 };

// The phone: a 560 px screen in a 17 px bezel.
const SW = 560, BEZ = 17, K = SW / 590, BW = SW + 2 * BEZ, BH = Math.round(SW * 1280 / 590) + 2 * BEZ;
const N = { x: 0, y: 150, s: 0.94, rx: 3, ry: 0, rz: 0 };

let S = {};

// ── helpers ────────────────────────────────────────────────────────────────
const mix = (a, b, k) => Object.fromEntries(Object.keys(a).map((key) => [key, lerp(a[key], b[key] ?? a[key], k)]));
/** The pose that puts the recording's point (sx, sy) at stage (tx, ty), at scale s. */
const focus = (sx, sy, s, ty = 1000, tx = 540) => ({ x: tx - 540 - (BEZ + sx * K - BW / 2) * s, y: ty - 960 - (BEZ + sy * K - BH / 2) * s, s, rx: 0, ry: 0, rz: 0 });
/** A point on the recording → the stage, for pose P (rotation about z only). */
function onStage(P, sx, sy) {
  const lx = (BEZ + sx * K - BW / 2) * P.s, ly = (BEZ + sy * K - BH / 2) * P.s, a = ((P.rz || 0) * Math.PI) / 180;
  return [540 + P.x + lx * Math.cos(a) - ly * Math.sin(a), 960 + P.y + lx * Math.sin(a) + ly * Math.cos(a)];
}
const spring = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 2.6));
/** Decay of the latest hit in `hits` at t. */
const impulse = (t, hits, d = 0.35) => { let v = 0; for (const h of hits) if (t >= h && t < h + d) v = Math.max(v, Math.pow(1 - (t - h) / d, 2)); return v; };

/**
 * A headline: heavy Inter, `*word*` set in Cormorant italic, ` / ` breaks a line.
 * Words rise out of their masks one after another and leave upward together.
 */
function headline(parent, text, { top = 168, size = 92 } = {}) {
  const root = el('div', 'abs', { left: '70px', width: '940px', top: `${top}px`, textAlign: 'center', fontFamily: 'Inter', fontWeight: 800, fontSize: `${size}px`,
    lineHeight: 1.04, letterSpacing: '-0.045em', color: CREAM, opacity: 0, textShadow: '0 4px 40px rgba(0,0,0,0.6)' }, parent);
  const spans = [];
  text.split(' / ').forEach((line, li) => {
    if (li) root.appendChild(el('br'));
    line.split(' ').forEach((w, i, all) => {
      const em = /^\*.*\*[.,!?]?$/.test(w);
      const mask = el('span', 'w', {}, root);
      const inner = el('span', '', em ? { fontFamily: 'Cormorant', fontStyle: 'italic', fontWeight: 500, fontSize: '1.16em', letterSpacing: '-0.01em', color: LAV } : {}, mask, w.replace(/\*/g, ''));
      spans.push(inner);
      if (i < all.length - 1) root.appendChild(document.createTextNode(' '));
    });
  });
  return { root, spans };
}
function showHead(h, t, a, b) {
  const on = t >= a - 0.02 && t < b + 0.25;
  h.root.style.opacity = on ? 1 : 0;
  if (!on) return;
  h.spans.forEach((sp, i) => {
    const k = ease.outExpo(prog(t, a + i * 0.055, a + i * 0.055 + 0.55));
    const o = ease.inCubic(prog(t, b + i * 0.02, b + i * 0.02 + 0.2));
    sp.style.transform = `translateY(${(1 - k) * 110 - o * 110}%)`;
  });
}

// ── the film ───────────────────────────────────────────────────────────────
export default {
  duration: DUR,
  poster: 9.95,

  score() {
    const c = [{ i: 'tempo', bpm: 120 }, { i: 'room', t: 0, end: DUR, g: 0.03 }];
    const st = BEAT / 4;
    const CH = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]];   // Am F C G
    const ROOT = [33, 29, 36, 31];
    const chordAt = (t) => Math.floor(t / 2) % 4;
    // Where the groove breathes: the reply held up close, the turn into the fan.
    const BREAKS = [[9.5, 11.0], [25.5, 26.0]];
    const inBreak = (t) => BREAKS.some(([a, b]) => t >= a - 0.01 && t < b - 0.01);

    // Cold open: four slams, a riser into the drop.
    [0, 0.5, 1, 1.5].forEach((t, k) => {
      c.push({ i: 'boom', t, g: 0.42 + k * 0.06 }, { i: 'hit', t, g: 0.42 });
      c.push({ i: 'saw', t, ns: CH[0].map((n) => n - 12 + (k === 3 ? 12 : 0)), dur: 0.32, cut: 900 + k * 500, env: 2, g: 0.42, verb: 0.35 });
      c.push({ i: 'subb', t, n: 33, dur: 0.4, g: 0.5 });
    });
    c.push({ i: 'riser', t: 0.2, end: CUT.home, g: 0.32 }, { i: 'reverse', end: CUT.home, dur: 0.9, g: 0.3 });

    // The groove: four on the floor, claps on two and four, open hats on the off-beat,
    // a pumping sub, chord stabs, a vocal chop every other bar.
    c.push({ i: 'pump', t: CUT.home, end: CUT.end, depth: 0.55 });
    for (let t = CUT.home, k = 0; t < CUT.end - 0.01; t += BEAT, k++) {
      if (inBreak(t)) continue;
      c.push({ i: 'kick', t, g: 0.62 }, { i: 'hat', t: t + BEAT / 2, g: 0.12, open: true }, { i: 'hat', t: t + BEAT / 4, g: 0.05 }, { i: 'hat', t: t + 3 * BEAT / 4, g: 0.05 });
      if (k % 2) c.push({ i: 'clap', t, g: 0.3 });
      c.push({ i: 'subb', t: t + BEAT / 2, n: ROOT[chordAt(t)], dur: BEAT * 0.42, g: 0.42 });
    }
    for (let bar = CUT.home; bar < CUT.end - 0.01; bar += 2) {
      const ch = CH[chordAt(bar)];
      [...'x..x..x...x..x..'].forEach((x, s) => {
        const t = bar + s * st;
        if (x === 'x' && !inBreak(t)) c.push({ i: 'saw', t, ns: ch.map((n) => n + 12), dur: 0.11, cut: 2400, env: 2.6, g: 0.34, verb: 0.2, echo: 0.1 });
      });
      if (Math.round(bar / 2) % 2 === 0 && !inBreak(bar)) {
        [[0, ch[2] + 12, 'a'], [6, ch[1] + 12, 'o'], [10, ch[2] + 12, 'a'], [13, ch[0] + 12, 'e']].forEach(([s, n, v]) =>
          c.push({ i: 'chop', t: bar + s * st, n, dur: 0.2, g: 0.2, vowel: v, echo: 0.35 }));
      }
    }
    c.push({ i: 'crash', t: CUT.home, g: 0.4 }, { i: 'boom', t: CUT.home, g: 0.7 });

    // The breaks: a held chord and a riser; back in with a hit.
    c.push({ i: 'pad', t: 9.5, end: 11.1, ns: [57, 60, 64, 69], g: 0.12, bright: 1100 }, { i: 'riser', t: 9.9, end: 11.0, g: 0.26 }, { i: 'reverse', end: 11.0, dur: 0.7, g: 0.25 });
    c.push({ i: 'crash', t: 11.0, g: 0.32 }, { i: 'boom', t: 11.0, g: 0.5 });
    c.push({ i: 'riser', t: 24.9, end: CUT.fan, g: 0.3 }, { i: 'crash', t: CUT.fan, g: 0.4 }, { i: 'boom', t: CUT.fan, g: 0.6 });

    // Cuts, taps, the callout, typing.
    [CUT.ask, CUT.tool, CUT.lang, CUT.score, CUT.sky].forEach((t) => c.push({ i: 'whoosh', t: t - 0.2, dur: 0.3, g: 0.3, from: 0.6, to: -0.6 }, { i: 'hit', t, g: 0.3 }));
    Object.values(TAP).forEach((t) => c.push({ i: 'blip', t, n: 88, g: 0.22 }, { i: 'rim', t, g: 0.22 }));
    c.push({ i: 'blip', t: 4.4, n: 84, g: 0.2, slide: 5 }, { i: 'whoosh', t: 4.3, dur: 0.25, g: 0.18 });
    c.push({ i: 'whoosh', t: 9.35, dur: 0.3, g: 0.22, from: -0.4, to: 0.4 }, { i: 'blip', t: 22.2, n: 91, g: 0.2 });
    const R = rng(11);
    for (let t = 7.05; t < 7.95; t += 0.035 + R() * 0.03) c.push({ i: 'key', t, g: 0.12 });
    for (let t = 11.05; t < 11.4; t += 0.03 + R() * 0.02) c.push({ i: 'key', t, g: 0.1 });

    // The end: one big chord, the sting, a pad under the card.
    c.push({ i: 'boom', t: CUT.end, g: 0.8 }, { i: 'crash', t: CUT.end, g: 0.4 }, { i: 'sting', t: CUT.end + 0.05, g: 0.8 });
    c.push({ i: 'saw', t: CUT.end, ns: [57, 60, 64, 69], dur: 2.6, a: 0.02, rel: 1.4, cut: 1500, env: 1.6, g: 0.36, verb: 0.6 });
    c.push({ i: 'subb', t: CUT.end, n: 33, dur: 1.4, g: 0.4 }, { i: 'chop', t: CUT.end + 0.5, n: 76, dur: 0.5, g: 0.24, vowel: 'o', echo: 0.5 });
    c.push({ i: 'pad', t: CUT.end, end: DUR, ns: [57, 64, 69], g: 0.07, bright: 1300 });
    c.push({ i: 'bell', t: CUT.end + 1.7, n: 81, g: 0.12 });
    return c;
  },

  async setup(stage) {
    stage.style.background = '#000';
    await Promise.all(['800 92px Inter', '900 300px Inter', 'italic 500 100px Cormorant', '500 26px Mono'].map((f) => document.fonts.load(f)));
    const ev = Object.fromEntries(await Promise.all(['tour-home', 'tour-explore', 'ask-quickfire', 'ask-quit', 'ask-shaadi', 'ask-fake'].map(async (n) => [n, await events(n)])));

    // Film time → footage time, per recording (see the chapter notes in frame()).
    const q = ev['ask-quit'], sh = ev['ask-shaadi'], fk = ev['ask-fake'];
    S.clock = {
      home: remap([[0, 0.3, 0], [CUT.home, 0.3, 1], [4.4, 2.75, 0], [5.6, 3.3, 1.35], [CUT.ask, 5.15, 0]]),
      quick: remap([[0, 0.9, 0], [CUT.ask, 0.9, 2.3], [7.98, 3.15, 1.8], [9.5, 5.85, 0.3], [11.0, 7.75, 4.6]]),
      quit: remap([[0, 7.6, 0], [CUT.tool, 7.6, 1.2], [13.6, 9.52, (q.tap_chip - 9.52) / (TAP.chip - 13.6)], [TAP.chip, q.tap_chip, 1],
        [14.9, q.tap_chip + 0.6, (q.tap_throw - q.tap_chip - 0.6) / (TAP.throw - 14.9)], [TAP.throw, q.tap_throw, 1]]),
      lang: remap([[0, 7.4, 0], [CUT.lang, 7.4, 1.1], [18.2, 9.3, 0.4], [18.8, sh.tap_chip - 0.14, 1]]),
      fake: remap([[0, fk.tap_happened - 1.5, 0], [CUT.score, fk.tap_happened - 1.5, 1], [CUT.sky, fk.tap_happened + 1.5, 0]]),
      sky: remap([[0, 1.5, 0], [CUT.sky, 1.5, 7], [CUT.fan, 19, 3]]),
    };

    // Atmosphere: the glow behind the phone, the marquee word.
    S.glow = el('div', 'abs', { left: '50%', top: '50%', width: '1700px', height: '1900px', marginLeft: '-850px', marginTop: '-850px',
      background: 'radial-gradient(closest-side, rgba(139,120,255,0.34), rgba(90,70,200,0.12) 55%, transparent)' }, stage);
    S.marq = el('div', 'abs', { left: 0, top: '780px', whiteSpace: 'nowrap', fontFamily: 'Inter', fontWeight: 900, fontSize: '400px', lineHeight: 1, letterSpacing: '-0.05em',
      color: 'transparent', WebkitTextStroke: '2px rgba(245,238,222,0.13)' }, stage);

    // The phones, one per recording. Later ones stack on top (the Explore phone leads the fan).
    S.dev = {};
    for (const [k, name] of [['home', 'tour-home'], ['quick', 'ask-quickfire'], ['quit', 'ask-quit'], ['lang', 'ask-shaadi'], ['fake', 'ask-fake'], ['sky', 'tour-explore']]) {
      S.dev[k] = device(stage, name, { skin: 'glass', w: SW, persp: 2400 });
    }

    // The callout: the dead-hour tile, lifted out of the screen.
    S.card = el('div', 'abs', { left: '64px', top: '1130px', width: '720px', height: '392px', borderRadius: '30px', overflow: 'hidden', background: '#000', zIndex: 20,
      boxShadow: '0 0 0 1.5px rgba(245,238,222,0.22), 0 40px 90px rgba(0,0,0,0.75)', opacity: 0, transformOrigin: '30% 40%' }, stage);
    S.cardF = footage(S.card, 'tour-home', { crop: [30, 540, 395, 215], w: 720, h: 392, style: { left: 0, top: 0 } });

    // Type.
    const top = el('div', 'layer', { zIndex: 30 }, stage);
    S.slams = ['YOUR', 'CHART', 'TALKS', 'BACK.'].map((w, i) => el('div', 'abs', { left: 0, right: 0, top: `${300 + i * 300}px`, textAlign: 'center', fontFamily: i === 3 ? 'Cormorant' : 'Inter',
      fontStyle: i === 3 ? 'italic' : 'normal', fontWeight: i === 3 ? 500 : 900, fontSize: i === 3 ? '330px' : '290px', lineHeight: 1, letterSpacing: i === 3 ? '-0.02em' : '-0.055em',
      color: i === 3 ? LAV : CREAM, opacity: 0 }, top, w));
    S.heads = [
      [2.15, 4.3, 'One line / for your *day.*'],
      [4.4, 5.55, 'Your dead hour. / To the *minute.*'],
      [5.65, 6.88, 'What’s coming, / *dated.*'],
      [7.12, 9.35, 'Ask what you’d / never ask a *friend.*'],
      [9.5, 10.85, 'It answers. / *Straight.*'],
      [11.0, 11.88, '*Anything.*'],
      [12.12, 14.25, 'Every answer / opens a *tool.*'],
      [14.45, 16.38, 'Throw the *shells.*'],
      [16.62, 18.15, 'Talks your / *language.*'],
      [18.2, 19.15, 'Even *Hinglish.*'],
      [19.2, 20.38, 'Dates, not *vibes.*'],
      [20.62, 23.38, 'It keeps *score.* / Out loud.'],
      [23.62, 25.9, 'And a whole sky / to *explore.*'],
      [26.1, 27.7, 'One app. / Your whole *sky.*'],
    ].map(([a, b, text]) => ({ a, b, h: headline(top, text) }));
    S.chap = el('div', 'abs', { left: '72px', top: '92px', fontFamily: 'Mono', fontWeight: 500, fontSize: '25px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,222,0.5)', zIndex: 30 }, stage);
    S.chapR = el('div', 'abs', { right: '72px', top: '92px', fontFamily: 'Mono', fontWeight: 500, fontSize: '25px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,222,0.5)', zIndex: 30 }, stage, 'Plutto · the app');
    S.honest = honest(stage, { text: 'Real app · example replies', bottom: 120, color: 'rgba(245,238,222,0.7)', bg: 'rgba(255,255,255,0.06)', style: { fontSize: '23px', border: '1px solid rgba(245,238,222,0.16)' } });
    S.ring = tapRing(stage, { color: CREAM, size: 120 });
    S.flash = el('div', 'layer', { background: CREAM, opacity: 0, zIndex: 38, pointerEvents: 'none' }, stage);
    S.end = ringEnd(stage, { from: { x: 540, y: 1000, d: 90, rgb: '201,184,255' }, line: 'Your chart.<br>Talks back.', cta: 'Ask yours · plutto.space', sub: 'Free to start · Android · Web' });
  },

  async frame(t) {
    const cuts = [CUT.home, CUT.ask, CUT.tool, CUT.lang, CUT.score, CUT.sky];
    const kick = t >= CUT.home && t < CUT.end && !(t >= 9.5 && t < 11) && !(t >= 25.5 && t < 26) ? Math.pow(1 - ((t - CUT.home) % BEAT) / BEAT, 3) : 0;

    // ── atmosphere ──
    S.glow.style.opacity = t < CUT.home ? 0.5 * prog(t, 1.4, 2.0) : 0.75 + kick * 0.25;
    S.glow.style.transform = `translateY(${110 + Math.sin(t * 0.7) * 30}px) scale(${1 + kick * 0.04})`;
    const MW = [[CUT.home, 'TODAY'], [CUT.ask, 'ASK'], [CUT.tool, 'OPEN'], [CUT.lang, 'HAAN'], [CUT.score, 'SCORE'], [CUT.sky, 'EXPLORE'], [CUT.fan, 'PLUTTO']];
    let mw = null;
    for (const m of MW) if (t >= m[0]) mw = m;
    if (mw && t < CUT.end) {
      const word = `${mw[1]} · `.repeat(6);
      if (S.marq.dataset.w !== word) { S.marq.textContent = word; S.marq.dataset.w = word; }
      S.marq.style.opacity = 1;
      S.marq.style.transform = `translateX(${-((t - mw[0]) * 160 + 120) % 2000 - 200}px)`;
    } else S.marq.style.opacity = 0;

    // ── chapter marks ──
    const CH = [[CUT.home, '01 · Today'], [CUT.ask, '02 · Ask'], [CUT.tool, '03 · Tools'], [CUT.lang, '04 · Your language'], [CUT.score, '05 · Receipts'], [CUT.sky, '06 · Explore'], [CUT.fan, '']];
    let ch = '';
    for (const c of CH) if (t >= c[0]) ch = c[1];
    S.chap.textContent = ch;
    const chOn = t >= CUT.home && t < CUT.end ? 1 : 0;
    S.chap.style.opacity = chOn; S.chapR.style.opacity = chOn;

    // ── the cold open: four slams ──
    S.slams.forEach((e, i) => {
      const a = i * 0.5;
      if (t < a || t >= CUT.home + 0.35) { e.style.opacity = 0; return; }
      const k = ease.outExpo(prog(t, a, a + 0.35)), out = ease.inCubic(prog(t, CUT.home - 0.05, CUT.home + 0.3));
      e.style.opacity = 1 - out;
      e.style.transform = `translateY(${-out * 260}px) scale(${lerp(1.35, 1, k)})`;
      e.style.filter = k < 1 ? `blur(${(1 - k) * 8}px)` : 'none';
    });

    // ── the phones ──
    const P = {};
    const idle = (p, ry = 0) => ({ ...p, y: p.y + Math.sin(t * 1.4) * 7, ry: p.ry + ry + Math.sin(t * 0.6) * 3 });
    // Whip: the new phone flies in from `dir`, the old one leaves the other way.
    const whip = (p, a, b, dir) => {
      const i = 1 - ease.outExpo(prog(t, a, a + 0.38)), o = ease.inCubic(prog(t, b - 0.14, b));
      return { ...p, x: p.x + dir * 1150 * i - dir * 1150 * o, ry: p.ry - dir * 25 * i + dir * 18 * o, blur: (i + o) * 16 };
    };

    // 01 Today — rises out of the slams.
    if (t >= 1.6 && t < CUT.ask) {
      const r = spring(prog(t, 1.6, 2.5));
      let p = idle({ ...N, y: lerp(1500, N.y, r), rx: lerp(34, N.rx, r) }, -8);
      if (t >= 4.3 && t < 5.65) p.x += 90 * ease.inOutCubic(prog(t, 4.3, 4.6)) * (1 - ease.inOutCubic(prog(t, 5.4, 5.65)));
      P.home = whip(p, -1, CUT.ask, 1);
    }
    // 02 Ask — the typed question, then the reply up close.
    if (t >= CUT.ask - 0.05 && t < CUT.tool) {
      // The camera follows the words: down at the box while it is typed, up to the reply when it is sent, closer to read it.
      const TYPE = focus(295, 1062, 1.6, 1120), REP = focus(300, 215, 1.25, 1000), READ = focus(300, 225, 1.45, 1010);
      let p = mix(TYPE, REP, ease.inOutCubic(prog(t, 7.9, 8.3)));
      p = mix(p, READ, ease.inOutCubic(prog(t, 9.35, 9.75)));
      p = mix(p, idle(N, 8), ease.inOutCubic(prog(t, 10.75, 11.1)));
      P.quick = whip(p, CUT.ask, CUT.tool, 1);
    }
    // 03 Tools — the reply and its chip, then the shells.
    if (t >= CUT.tool - 0.05 && t < CUT.lang) {
      const F = focus(250, 400, 1.28, 1010);
      const z = 1 - spring(prog(t, TAP.chip + 0.12, TAP.chip + 0.8));
      P.quit = whip(mix(idle(N, -6), F, z), CUT.tool, CUT.lang, -1);
    }
    // 04 Your language — the Hinglish reply, then what is coming.
    if (t >= CUT.lang - 0.05 && t < CUT.score) {
      const F = focus(290, 300, 1.34, 1000);
      const z = 1 - spring(prog(t, TAP.hinglish + 0.25, TAP.hinglish + 0.9));
      P.lang = whip(mix(idle(N, 6), F, z), CUT.lang, CUT.score, 1);
    }
    // 05 Receipts — "It happened", and the score turns over.
    if (t >= CUT.score - 0.05 && t < CUT.sky) {
      const F = focus(150, 285, 1.6, 860);
      const z = ease.inOutCubic(prog(t, TAP.happened + 0.18, TAP.happened + 0.55));
      P.fake = whip(mix(idle(N, -6), F, z), CUT.score, CUT.sky, -1);
    }
    // 06 Explore, then the fan: three phones, the whole app.
    if (t >= CUT.sky - 0.05 && t < CUT.end) {
      const f = ease.inOutCubic(prog(t, CUT.fan, CUT.fan + 0.6));
      const C = { x: 0, y: 80, s: 0.66, rx: 2, ry: 0, rz: 0 };
      P.sky = whip(mix(idle(N, -8), C, f), CUT.sky, 99, 1);
      if (t >= CUT.fan) {
        const sp = spring(prog(t, CUT.fan + 0.05, CUT.fan + 0.8));
        P.home = { x: lerp(-1200, -330, sp), y: 150 + Math.sin(t * 1.3) * 6, s: 0.54, rx: 2, ry: 30, rz: -5 };
        P.fake = { x: lerp(1200, 330, sp), y: 150 + Math.sin(t * 1.3 + 1) * 6, s: 0.54, rx: 2, ry: -30, rz: 5 };
      }
      // all three rush into the ring
      const g = ease.inCubic(prog(t, CUT.end - 0.3, CUT.end));
      for (const k of ['sky', 'home', 'fake']) if (P[k]) { P[k].s *= 1 + g * 0.35; P[k].o = 1 - g; }
    }
    for (const [k, d] of Object.entries(S.dev)) {
      const p = P[k];
      if (!p) { d.pose(t, { o: 0 }); continue; }
      const ft = t >= CUT.fan && (k === 'home' || k === 'fake') ? (k === 'home' ? 5.15 : S.clock.fake(23.4)) : S.clock[k](t);
      await d.at(ft);
      d.pose(t, { x: p.x, y: p.y, s: p.s, rx: p.rx, ry: p.ry, rz: p.rz, o: p.o ?? 1 });
      d.body.style.filter = p.blur > 0.3 ? `blur(${p.blur.toFixed(1)}px)` : 'none';
    }

    // ── the callout: the dead hour, lifted out ──
    const cIn = spring(prog(t, 4.42, 4.95)), cOut = ease.inCubic(prog(t, 5.45, 5.65));
    if (t >= 4.42 && t < 5.65) {
      await S.cardF.at(S.clock.home(t));
      S.card.style.opacity = 1 - cOut;
      S.card.style.transform = `translate(${-40 * (1 - cIn)}px, ${60 * (1 - cIn) - cOut * 40}px) rotate(${lerp(-9, -3, cIn)}deg) scale(${lerp(0.6, 1, cIn) * (1 - cOut * 0.1)})`;
    } else S.card.style.opacity = 0;

    // ── taps ──
    const taps = [[TAP.chip, 'quit', 120, 488], [TAP.throw, 'quit', 294, 760], [TAP.hinglish, 'lang', 144, 488], [TAP.happened, 'fake', 124, 768]];
    let tp = taps.filter(([a]) => t >= a - 0.02).pop();
    if (tp && P[tp[1]]) { const [x, y] = onStage(P[tp[1]], tp[2], tp[3]); S.ring(t, tp[0], x, y); } else S.ring(t, -9, 0, 0);

    // ── headlines ──
    S.heads.forEach(({ a, b, h }) => showHead(h, t, a, b));

    // ── honesty: whenever a written reply, or the room it opened, is on screen ──
    S.honest(inOutTag(t));

    // ── flash on the cuts and the slams ──
    S.flash.style.opacity = Math.min(0.5, impulse(t, [0, 0.5, 1, 1.5], 0.18) * 0.22 + impulse(t, cuts, 0.16) * 0.16 + impulse(t, [CUT.fan], 0.25) * 0.2);

    // ── the end ──
    S.end(t - CUT.end);
  },
};

function inOutTag(t) {
  const a = CUT.ask + 0.3, b = CUT.score - 0.05;
  return ease.outCubic(prog(t, a, a + 0.3)) * (1 - ease.inCubic(prog(t, b, b + 0.2)));
}
