/**
 * DEMO · EVERYTHING INSIDE — sixteen features in thirty-two seconds, then the
 * wall: nine phones, nine features, all playing at once.
 *
 * Every screen is the real app (public/app/screens). Chat replies are written
 * for the film; the tag says so whenever one is on screen. Readings recorded
 * offline show their computed parts (wheels, chapters, planets) as the app
 * draws them.
 */
import { el, prog, ease, lerp } from '../lib.js';
import { device, honest } from '../asked.js';
import { ringEnd } from '../cine.js';

const CREAM = '#F5EEDE', LAV = '#C9B8FF';
const BEAT = 0.5, DUR = 42;
const T0 = 2.0, D = 2.0;                 // features: 2.0 → 34.0
const WALL = 34.0, END = 38.5;

// [footage, from (s), rate, title, *word*, kicker, written reply on screen?]
const F = [
  ['language', 0.6, 1.2, 'Speaks', 'your language.', 'any language', 0],
  ['when', 1.0, 1.6, 'Starts with', 'one minute.', 'your birth', 0],
  ['tour-home', 0.0, 1, 'A line for', 'your day.', 'every morning', 0],
  ['tour-home', 2.2, 0.4, 'The hour not to', 'sign anything.', 'to the minute', 0],
  ['feat-chart', 10.6, 1.3, 'Your sky,', 'drawn live.', 'the minute you arrived', 0],
  ['feat-dashas', 11.2, 1.3, 'Your life in', 'chapters.', 'what era you’re in', 0],
  ['feat-solar', 11.0, 1.3, 'Every planet’s', 'pull.', 'the solar system', 0],
  ['tarot', 5.2, 1.3, 'Draw a', 'card.', 'tarot', 0],
  ['ask-quit', 13.7, 1, 'Throw the', 'shells.', 'Yoruba cowries', 1],
  ['voice', 1.0, 1, 'Say it', 'out loud.', 'voice', 0],
  ['ask-quickfire', 3.2, 1.5, 'Ask', 'anything.', 'the oracle', 1],
  ['ask-shaadi', 12.1, 1, 'Dates,', 'not vibes.', 'what’s coming', 1],
  ['ask-fake', 15.0, 1, 'It keeps', 'score.', 'receipts', 1],
  ['feat-lives', 11.6, 1.3, 'Lives already', 'lived.', 'people like you', 0],
  ['tour-explore', 2.0, 6, 'Explore', 'it all.', 'explore', 0],
  ['feat-library', 11.4, 1.3, 'The whole', 'library.', '102 traditions', 0],
];
// The wall: nine of them again, all at once.
const WALLF = [6, 4, 7, 8, 2, 13, 11, 5, 15];

const SW = 560, BEZ = 17, BH = Math.round(SW * 1280 / 590) + 2 * BEZ;
let S = {};

export default {
  duration: DUR,
  poster: 13.0,

  score() {
    const c = [{ i: 'tempo', bpm: 120 }, { i: 'room', t: 0, end: DUR, g: 0.03 }];
    const CH = [[57, 60, 64], [53, 57, 60], [55, 60, 64], [55, 59, 62]], ROOT = [33, 29, 36, 31];
    const ch = (t) => Math.floor(t / 2) % 4;
    [0, 0.5, 1, 1.5].forEach((t, k) => c.push({ i: 'hit', t, g: 0.4 }, { i: 'saw', t, ns: CH[0].map((n) => n - 12 + (k === 3 ? 12 : 0)), dur: 0.3, cut: 1000 + k * 400, g: 0.38, verb: 0.3 }));
    c.push({ i: 'riser', t: 0.2, end: T0, g: 0.3 }, { i: 'reverse', end: T0, dur: 0.8, g: 0.28 });
    c.push({ i: 'pump', t: T0, end: END, depth: 0.55 });
    for (let t = T0, k = 0; t < END - 0.01; t += BEAT, k++) {
      c.push({ i: 'kick', t, g: 0.6 }, { i: 'hat', t: t + BEAT / 2, g: 0.12, open: true }, { i: 'hat', t: t + BEAT / 4, g: 0.05 }, { i: 'hat', t: t + 3 * BEAT / 4, g: 0.05 });
      if (k % 2) c.push({ i: 'clap', t, g: 0.3 });
      c.push({ i: 'subb', t: t + BEAT / 2, n: ROOT[ch(t)], dur: BEAT * 0.42, g: 0.42 });
    }
    for (let bar = T0; bar < END - 0.01; bar += 2) {
      [...'x..x..x...x..x..'].forEach((x, s) => { if (x === 'x') c.push({ i: 'saw', t: bar + s * BEAT / 4, ns: CH[ch(bar)].map((n) => n + 12), dur: 0.11, cut: 2400, env: 2.6, g: 0.32, verb: 0.2, echo: 0.1 }); });
      if (Math.round(bar / 2) % 2 === 0) [[0, 76, 'a'], [6, 72, 'o'], [10, 76, 'a'], [13, 69, 'e']].forEach(([s, n, v]) => c.push({ i: 'chop', t: bar + s * BEAT / 4, n, dur: 0.2, g: 0.18, vowel: v, echo: 0.35 }));
    }
    F.forEach((_, i) => c.push({ i: 'whoosh', t: T0 + i * D - 0.18, dur: 0.26, g: 0.22, from: i % 2 ? 0.6 : -0.6, to: i % 2 ? -0.6 : 0.6 }, { i: 'blip', t: T0 + i * D, n: 84 + (i % 5) * 2, g: 0.14 }));
    c.push({ i: 'crash', t: T0, g: 0.4 }, { i: 'boom', t: T0, g: 0.6 });
    c.push({ i: 'riser', t: WALL - 1.5, end: WALL, g: 0.3 }, { i: 'crash', t: WALL, g: 0.45 }, { i: 'boom', t: WALL, g: 0.7 });
    c.push({ i: 'boom', t: END, g: 0.8 }, { i: 'sting', t: END + 0.05, g: 0.8 }, { i: 'saw', t: END, ns: [57, 60, 64, 69], dur: 2.4, a: 0.02, rel: 1.2, cut: 1500, env: 1.6, g: 0.34, verb: 0.6 });
    c.push({ i: 'pad', t: END, end: DUR, ns: [57, 64, 69], g: 0.07, bright: 1300 });
    return c;
  },

  async setup(stage) {
    stage.style.background = '#000';
    await Promise.all(['800 92px Inter', '900 300px Inter', 'italic 500 100px Cormorant', '500 26px Mono'].map((f) => document.fonts.load(f)));
    S.glow = el('div', 'abs', { left: '50%', top: '50%', width: '1700px', height: '1900px', marginLeft: '-850px', marginTop: '-850px',
      background: 'radial-gradient(closest-side, rgba(139,120,255,0.32), rgba(90,70,200,0.1) 55%, transparent)' }, stage);
    S.idx = el('div', 'abs', { right: '-40px', top: '1380px', font: '900 520px/1 Inter', letterSpacing: '-0.06em', color: 'transparent', WebkitTextStroke: '2px rgba(245,238,222,0.12)' }, stage);
    // One phone per feature (so each keeps its own clock), nine more for the wall.
    S.dev = F.map(([name]) => device(stage, name, { skin: 'glass', w: SW }));
    S.wall = WALLF.map((k) => device(stage, F[k][0], { skin: 'glass', w: SW, persp: 3000 }));
    const top = el('div', 'layer', { zIndex: 30 }, stage);
    S.kick = el('div', 'abs', { left: '72px', top: '120px', font: '500 25px/1 Mono', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(245,238,222,0.55)' }, top);
    S.count = el('div', 'abs', { right: '72px', top: '120px', font: '500 25px/1 Mono', letterSpacing: '0.2em', color: 'rgba(245,238,222,0.55)' }, top);
    S.h1 = el('div', 'abs', { left: '72px', width: '936px', top: '176px', font: '800 104px/1.0 Inter', letterSpacing: '-0.05em', color: CREAM }, top);
    S.h2 = el('div', 'abs', { left: '72px', width: '936px', top: '284px', font: 'italic 500 124px/1.0 Cormorant', letterSpacing: '-0.01em', color: LAV }, top);
    S.hook = ['Every', 'oracle', 'ever', 'made.'].map((w, i) => el('div', 'abs center', { top: `${470 + i * 230}px`, font: i === 3 ? 'italic 500 280px/1 Cormorant' : '900 180px/1 Inter',
      letterSpacing: i === 3 ? '-0.02em' : '-0.055em', color: i === 3 ? LAV : CREAM, opacity: 0, zIndex: 30 }, stage, w));
    S.wallT = el('div', 'abs center', { top: '150px', font: '800 104px/1.02 Inter', letterSpacing: '-0.05em', color: CREAM, opacity: 0, zIndex: 30 }, stage, 'All of it.<br><span style="font:italic 500 124px Cormorant;color:' + LAV + '">One app.</span>');
    S.honest = honest(stage, { text: 'Real app · example replies', bottom: 90, color: 'rgba(245,238,222,0.7)', bg: 'rgba(255,255,255,0.06)', style: { fontSize: '22px' } });
    S.flash = el('div', 'layer', { background: CREAM, opacity: 0, zIndex: 38 }, stage);
    S.end = ringEnd(stage, { from: { x: 540, y: 1000, d: 90, rgb: '201,184,255' }, line: 'Ask the sky.<br>It answers.', cta: 'Ask yours · plutto.space', sub: 'Free to start · Android · Web' });
  },

  async frame(t) {
    const kick = t >= T0 && t < END ? Math.pow(1 - ((t - T0) % BEAT) / BEAT, 3) : 0;
    S.glow.style.opacity = 0.7 + kick * 0.3;
    S.glow.style.transform = `translateY(${160 + Math.sin(t * 0.7) * 30}px) scale(${1 + kick * 0.04})`;

    // Hook.
    S.hook.forEach((e, i) => {
      const a = i * 0.45, k = ease.outExpo(prog(t, a, a + 0.35)), o = ease.inCubic(prog(t, T0 - 0.1, T0 + 0.2));
      e.style.opacity = t >= a ? 1 - o : 0;
      e.style.transform = `translateY(${-o * 200}px) scale(${lerp(1.3, 1, k)})`;
    });

    // Features: one at a time, whipping in from alternate sides.
    const i = Math.floor((t - T0) / D);
    const live = t >= T0 - 0.05 && t < WALL;
    for (let k = 0; k < F.length; k++) {
      const d = S.dev[k];
      const a = T0 + k * D, b = a + D;
      if (!(live && t >= a - 0.05 && t < b)) { d.pose(t, { o: 0 }); continue; }
      const [, from, rate] = F[k];
      await d.at(from + (t - a) * rate);
      const dir = k % 2 ? -1 : 1;
      const inn = 1 - ease.outExpo(prog(t, a, a + 0.35)), out = ease.inCubic(prog(t, b - 0.12, b));
      const s = 0.86 + 0.05 * prog(t, a, b);
      d.pose(t, { x: dir * 1150 * inn - dir * 1150 * out, y: 200 + Math.sin(t * 1.4) * 6, s, rx: 3, ry: -dir * 8 - dir * 22 * inn + dir * 14 * out });
      d.body.style.filter = inn + out > 0.03 ? `blur(${((inn + out) * 14).toFixed(1)}px)` : 'none';
    }
    const fk = live && i >= 0 && i < F.length ? F[i] : null;
    if (fk) {
      const u = t - T0 - i * D, ii = ease.outExpo(prog(u, 0.02, 0.4)), oo = ease.inCubic(prog(u, D - 0.14, D));
      S.h1.textContent = fk[3]; S.h2.textContent = fk[4]; S.kick.textContent = fk[5];
      S.count.textContent = `${String(i + 1).padStart(2, '0')} / ${F.length}`;
      S.idx.textContent = String(i + 1).padStart(2, '0');
      [S.h1, S.h2].forEach((e, j) => { e.style.opacity = ii * (1 - oo); e.style.transform = `translateY(${(1 - ease.outExpo(prog(u, 0.02 + j * 0.06, 0.45 + j * 0.06))) * 60 - oo * 30}px)`; });
      S.kick.style.opacity = S.count.style.opacity = 1; S.idx.style.opacity = 1;
      S.idx.style.transform = `translateX(${(1 - ii) * 120}px)`;
    } else { [S.h1, S.h2, S.kick, S.count].forEach((e) => { e.style.opacity = 0; }); S.idx.style.opacity = 0; }
    S.honest(fk && fk[6] ? 1 : 0);

    // The wall: nine phones in a 3×3, the camera pulling back.
    const wl = t >= WALL - 0.05 && t < END;
    const pull = ease.inOutCubic(prog(t, WALL, WALL + 2.2));
    for (let k = 0; k < S.wall.length; k++) {
      const d = S.wall[k];
      if (!wl) { d.pose(t, { o: 0 }); continue; }
      const [, from, rate] = F[WALLF[k]];
      await d.at(from + 0.4 + (t - WALL) * rate);
      const cx = (k % 3) - 1, cy = Math.floor(k / 3) - 1;
      const pop = ease.outBack(prog(t, WALL + 0.06 * k, WALL + 0.06 * k + 0.5));
      const s = lerp(0.62, 0.42, pull) * pop;
      const g = ease.inCubic(prog(t, END - 0.35, END));
      d.pose(t, { x: cx * lerp(420, 330, pull), y: 200 + cy * lerp(780, 600, pull), s: s * (1 + g * 0.3), rx: 6, ry: -cx * 10, rz: cx * 1.5, o: 1 - g });
      d.body.style.filter = 'none';
    }
    S.wallT.style.opacity = wl ? ease.outCubic(prog(t, WALL + 0.3, WALL + 0.8)) * (1 - ease.inCubic(prog(t, END - 0.3, END))) : 0;

    const cuts = F.map((_, k) => T0 + k * D).concat([WALL]);
    let fl = 0; for (const c of cuts) if (t >= c && t < c + 0.14) fl = Math.max(fl, 1 - (t - c) / 0.14);
    S.flash.style.opacity = fl * 0.12 + (t < T0 ? [0, 0.45, 0.9, 1.35].reduce((m, a) => (t >= a && t < a + 0.15 ? 0.2 * (1 - (t - a) / 0.15) : m), 0) : 0);
    S.end(t - END);
  },
};
