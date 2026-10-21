/**
 * Manifesto, The meter (demo series): a taxi-meter consult chat that runs too fast, a cut to nothing, every tradition in
 * the atlas rising through warm light, then the real app with a tagged example reply. No app is named.
 */
// Acts: 1 the meter · 2 the turn, in serif on black · 3 the roll of traditions · 4 the real app · 5 the line.
import { el, prog, ease, lerp, rng } from '../lib.js';
import { atlas } from '../library.js';
import { device, honest } from '../asked.js';

const DUR = 38;
const CUT = 8.4, A2 = 8.9, A3 = 13.4, A4 = 25.0, A5 = 31.4;
const WHITE = '#F2EEE6', RED = '#FF3B30', AMBER = '255,190,120';
let S = {};
const inout = (t, a, b, d = 0.6, o = 0.4) => ease.outCubic(prog(t, a, a + d)) * (1 - ease.inCubic(prog(t, b, b + o)));

export default {
  duration: DUR,
  poster: 17.2,

  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.025 }];
    // Act 1: a clock that ticks too fast, a drone that rises under it, a low heartbeat.
    for (let t = 0.15, k = 0; t < CUT - 0.05; t += 0.32 - Math.min(0.14, t * 0.018), k++) c.push({ i: 'rim', t, g: 0.1 + Math.min(0.12, t * 0.012), p: k % 2 ? 0.15 : -0.15 });
    c.push({ i: 'pad', t: 0, end: CUT, ns: [38, 45, 50], g: 0.08, bright: 300, verb: 0.3 }, { i: 'riser', t: 3.5, end: CUT, g: 0.14 });
    for (let t = 1.0; t < CUT - 0.2; t += 1.1) c.push({ i: 'heartbeat', t, g: 0.5 });
    [1.9, 3.5, 5.4].forEach((t) => c.push({ i: 'hit', t, g: 0.18 }));
    // The cut: nothing. Then one low piano note in the dark.
    c.push({ i: 'pluck', t: A2 + 0.2, n: 45, g: 0.22, dur: 4 }, { i: 'pluck', t: A2 + 0.2, n: 57, g: 0.12, dur: 4 });
    c.push({ i: 'pad', t: A2 + 0.6, end: A3 + 0.4, ns: [45, 52, 57, 64], g: 0.06, bright: 700, verb: 0.7 });
    c.push({ i: 'pluck', t: 11.3, n: 64, g: 0.12, dur: 3 }, { i: 'pluck', t: 11.3, n: 52, g: 0.1, dur: 3 });
    // Act 3: slow piano under warm strings; a low drum on each line.
    const prog_ = [[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [48, 55, 60, 64, 67], [43, 50, 55, 59, 62]];
    for (let i = 0, t = A3; t < A4 - 0.2; t += 2.9, i++) {
      const ch = prog_[i % 4];
      c.push({ i: 'saw', t, ns: ch.slice(0, 3), dur: 2.6, a: 0.9, rel: 1.6, cut: 700, env: 1.2, g: 0.14, verb: 0.7, spread: 0.5 });
      ch.forEach((n, k) => c.push({ i: 'pluck', t: t + k * 0.29, n: n + 12, g: 0.09, dur: 3 }));
      c.push({ i: 'tom', t, f: 52, g: 0.26, verb: 0.7, d: 1.4 });
    }
    const PEN = [69, 72, 74, 76, 79, 81, 84];
    for (let i = 0; i < 102; i += 2) c.push({ i: 'pluck', t: A3 + 1.2 + i * 0.085, n: PEN[(i * 3) % 7] + 12, g: 0.035, dur: 1.6 });
    c.push({ i: 'riser', t: 22.0, end: A4, g: 0.2 }, { i: 'boom', t: A4, g: 0.5 });
    // Act 4: a quiet pulse, piano on top.
    c.push({ i: 'bell', t: A4, n: 81, g: 0.1 });
    for (let t = A4, k = 0; t < A5 - 0.01; t += 0.5, k++) {
      c.push({ i: 'kick', t, g: 0.32 }, { i: 'hat', t: t + 0.25, g: 0.05 });
      c.push({ i: 'pluck', t: t + 0.25, n: [69, 72, 76, 72][k % 4], g: 0.09, dur: 1.4 });
    }
    // Act 5: one chord, open.
    c.push({ i: 'boom', t: A5, g: 0.45 }, { i: 'saw', t: A5, ns: [57, 64, 69, 73], dur: 3.4, a: 0.3, rel: 2, cut: 1100, env: 1.3, g: 0.2, verb: 0.7, spread: 0.6 });
    [57, 64, 69, 73, 76].forEach((n, k) => c.push({ i: 'pluck', t: A5 + 0.2 + k * 0.22, n: n + 12, g: 0.1, dur: 4 }));
    return c;
  },

  async setup(stage) {
    stage.style.background = '#000';
    await Promise.all(['800 92px Inter', '500 160px Mono', 'italic 500 84px Cormorant', '500 84px Cormorant', '500 26px Mono', '700 150px Inter'].map((f) => document.fonts.load(f)));
    const A = await atlas();
    S.names = A.list.map((x) => x.name.replace(/\s*\(.*\)/, ''));
    // a fixed order that mixes regions, so neighbours differ
    const R0 = rng(21); S.names.sort(() => R0() - 0.5);

    // Act 1: the meter
    S.a1 = el('div', 'layer', {}, stage);
    el('div', 'layer', { background: 'radial-gradient(60% 40% at 50% 58%, rgba(255,59,48,0.10), transparent 70%)' }, S.a1);
    S.meterL = el('div', 'abs center', { top: '330px', font: '500 26px/1 Mono', letterSpacing: '0.3em', color: 'rgba(242,238,230,0.45)' }, S.a1, 'CHARGED · ₹30 / MIN');
    S.meter = el('div', 'abs center', { top: '380px', font: '500 190px/1 Mono', letterSpacing: '-0.02em', color: RED, textShadow: '0 0 30px rgba(255,59,48,0.45)' }, S.a1, '₹0');
    S.clock = el('div', 'abs center', { top: '600px', font: '500 40px/1 Mono', letterSpacing: '0.2em', color: 'rgba(242,238,230,0.55)' }, S.a1, '00:00');
    // a plain consult chat, small and cold
    S.ph = el('div', 'abs', { left: '290px', top: '720px', width: '500px', height: '1000px', borderRadius: '64px', background: '#0d0d0f', padding: '16px', boxSizing: 'border-box', boxShadow: '0 0 0 1.5px rgba(255,255,255,0.10)' }, S.a1);
    const scr = el('div', '', { position: 'relative', width: '100%', height: '100%', borderRadius: '50px', overflow: 'hidden', background: '#16161a', font: '500 22px/1.35 Inter', color: '#ddd' }, S.ph);
    const head = el('div', 'abs', { left: 0, right: 0, top: 0, height: '130px', borderBottom: '1px solid #2a2a30', display: 'flex', alignItems: 'center', gap: '16px', padding: '34px 26px 0', boxSizing: 'border-box' }, scr);
    el('div', '', { width: '62px', height: '62px', borderRadius: '50%', background: '#3a3a42', flex: 'none' }, head);
    const hb = el('div', '', {}, head);
    el('div', '', { font: '600 24px/1.2 Inter', color: '#eee' }, hb, 'Guru ji ✓');
    S.typing = el('div', '', { font: '500 19px/1.3 Inter', color: '#8a8a94' }, hb, 'typing…');
    S.msgs = [['me', 'will my life get better?', 170], ['g', 'I can see some problem, beta…', 260], ['g', 'For the full remedy, extend 10 min', 370], ['g', 'Special puja: ₹2,100', 480]].map(([who, txt, top]) =>
      el('div', 'abs', { [who === 'me' ? 'right' : 'left']: '22px', top: `${top}px`, maxWidth: '330px', padding: '14px 18px', borderRadius: '20px', background: who === 'me' ? '#2c2c34' : '#202026', color: '#ddd', opacity: 0 }, scr, txt));
    S.banner = el('div', 'abs', { left: '20px', right: '20px', bottom: '28px', padding: '22px', borderRadius: '22px', background: '#2a0d0c', border: `1.5px solid ${RED}`, color: RED, textAlign: 'center', font: '600 24px/1.3 Inter', opacity: 0 }, scr,
      'Balance low. Recharge ₹199 to continue.');
    S.w1 = [[0.3, 1.8, 'Right now, someone<br>is paying by the minute'], [1.9, 3.4, 'to hear it will<br>get better.'], [3.5, 5.3, 'The advice is free.'], [5.4, CUT, 'The timer<br>is the product.']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '120px', font: '800 76px/1.04 Inter', letterSpacing: '-0.04em',
      color: WHITE, opacity: 0, zIndex: 5 }, stage, h) }));

    // Act 2
    S.w2 = [[A2 + 0.5, 11.0, 'Guidance was never meant<br>to run on a meter.'], [11.3, A3 - 0.3, 'Every culture wrote theirs down,<br><i>so it could be passed on.</i>']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '840px', font: '500 76px/1.14 Cormorant',
      color: WHITE, opacity: 0, zIndex: 30, padding: '0 70px' }, stage, h) }));

    // Act 3: the roll
    const SCRIPTS = [['Runic', 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'], ['Ogham', 'ᚁᚂᚃᚄᚅᚆᚇᚈᚉᚊᚋᚌᚍᚎᚏ'], ['InterGreek', 'ΑΒΓΔΘΛΞΠΣΦΨΩ'], ['JP', 'あいうえおかきくけこさしすせそ'],
      ['Deva', 'ॐअकगजञतनमरशह'], ['Hebrew', 'אבגדהוזחטיכלמנסעפצקרשת'], ['Arabic', 'ابجدهوزحطيكلمنسعفصقرشت'], ['CJK', '天地人乾坤震巽坎離艮兌命運福吉星月日']];
    await Promise.all(SCRIPTS.map(([f, cs]) => document.fonts.load(`40px ${f}`, cs)));
    const RC = rng(33); S.cells = [];
    for (let y = -300; y < 2300; y += 62) for (let x = -300; x < 1380; x += 58) {
      const [f, cs] = SCRIPTS[Math.floor(RC() * SCRIPTS.length)], chars = [...cs];
      S.cells.push({ x: x + (Math.floor(y / 62) % 2) * 29, y, f, ch: chars[Math.floor(RC() * chars.length)], sz: 30 + RC() * 16, p: RC() * 6.28, w: RC() });
    }
    const LIBP = '../../public/library', PLP = '../../public/planets';
    S.rose = el('div', 'layer', { zIndex: 2, opacity: 0, overflow: 'hidden',
      background: 'radial-gradient(70% 45% at 50% 48%, #3b1d6e 0%, #1a0f3d 45%, #07051a 100%)' }, stage);
    S.rays = el('div', 'abs', { left: '-500px', top: '-500px', width: '2080px', height: '2920px', transformOrigin: '1040px 1440px',
      background: 'repeating-conic-gradient(from 0deg at 1040px 1440px, rgba(255,170,60,0.16) 0deg 4deg, transparent 4deg 12deg, rgba(255,80,140,0.10) 12deg 15deg, transparent 15deg 24deg)' }, S.rose);
    const centre = el('div', 'abs', { left: '540px', top: '940px', width: 0, height: 0, perspective: '1600px' }, S.rose);
    S.wheel = el('img', 'abs', { left: 0, top: 0, width: '520px', height: '520px', borderRadius: '50%', objectFit: 'cover', filter: 'sepia(1) saturate(2.4) hue-rotate(-12deg) brightness(1.05) contrast(1.15)',
      boxShadow: '0 0 0 6px rgba(255,180,80,0.7), 0 0 120px rgba(255,140,40,0.7)', zIndex: 3 }, centre);
    S.wheel.src = 'asked/konark.png';
    const majors = ['the_fool', 'the_magician', 'the_high_priestess', 'the_empress', 'the_emperor', 'the_hierophant', 'the_lovers', 'the_chariot', 'strength', 'the_hermit', 'wheel_of_fortune', 'justice', 'the_hanged_man', 'death', 'temperance', 'the_devil', 'the_tower', 'the_star', 'the_moon', 'the_sun', 'judgement', 'the_world'];
    const pick = (dir, names) => names.map((n) => `${LIBP}/${dir}/${n}.webp`);
    const deckB = [...pick('runes', ['fehu', 'ansuz', 'algiz', 'berkano']), ...pick('ogham', ['beith', 'ailm']), ...pick('iching', ['qian', 'kun', 'li', 'kan']), ...pick('lenormand', ['birds', 'anchor']), ...pick('geomancy', ['albus', 'acquisitio'])];
    const ringA = pick('tarot', majors.slice(0, 12)), ringB = [], ringC = pick('tarot', majors.slice(12));
    deckB.forEach((d, i) => { ringB.push(d); ringB.push(`${LIBP}/tarot/${['cups_ace', 'wands_ace', 'swords_ace', 'pentacles_ace', 'cups_queen', 'wands_king', 'swords_queen', 'pentacles_king', 'cups_knight', 'wands_page', 'swords_knight', 'pentacles_page', 'cups_ten', 'wands_ten'][i]}.webp`); });
    const R3 = rng(51); S.cards = [];
    [[ringA, 330, 150, 0.12, 0.6], [ringB, 560, 120, -0.08, 1.4], [ringC, 790, 140, 0.05, 2.3]].forEach(([srcs, r, w, spin, d0]) => srcs.forEach((src, i) => {
      const e = el('img', 'abs', { left: `${-w / 2}px`, top: `${-w * 0.85}px`, width: `${w}px`, height: `${w * 1.7}px`, objectFit: 'cover', borderRadius: '10px',
        boxShadow: '0 0 0 2px rgba(255,220,150,0.55), 0 18px 40px rgba(0,0,0,0.55)', opacity: 0, zIndex: 4, backfaceVisibility: 'visible' }, centre);
      e.src = src;
      const a = (i / srcs.length) * Math.PI * 2;
      S.cards.push({ e, a, r, spin, delay: d0 + i * 0.07, fx: (R3() - 0.5) * 2400, fy: (R3() - 0.5) * 3000, fr: (R3() - 0.5) * 720 });
    }));
    S.planets = ['sun', 'venus', 'mars', 'mercury', 'Neptune', 'Uranus'].map((n, i) => {
      const e = el('img', 'abs', { left: '-60px', top: '-60px', width: `${[150, 90, 80, 60, 100, 90][i]}px`, height: 'auto', opacity: 0, mixBlendMode: 'screen' }, centre);
      e.src = `${PLP}/${n}.png`;
      return { e, a: i * 1.05, s: 0.25 + i * 0.03, r: 470 + i * 40 };
    });
    el('div', 'abs', { left: 0, right: 0, bottom: 0, height: '560px', zIndex: 8, background: 'linear-gradient(rgba(7,5,26,0), rgba(7,5,26,0.92) 45%, #07051a)' }, S.rose);
    S.flash = el('div', 'layer', { zIndex: 40, opacity: 0, background: 'radial-gradient(circle at 50% 50%, #fff6e8 0%, #ffd9a0 30%, rgba(255,170,80,0.6) 60%, rgba(0,0,0,0) 100%)' }, stage);
    S.world = await (await fetch('asked/world.json')).json();
    // the order the lights come on: as the Earth turns them toward us
    S.world.points.forEach((p) => { p.key = ((95 - p.lon) % 360 + 360) % 360 + (p.lat * 0.01); });
    [...S.world.points].sort((a, b) => a.key - b.key).forEach((p, i) => { p.rank = i; });
    S.cv = el('canvas', 'layer', { zIndex: 0 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');
    S.w3 = [[14.2, 16.6, 'Every deck. Every stone.'], [17.0, 19.5, 'Every sky<br>anyone ever read.'], [19.9, 22.2, 'Carved. Painted. Memorised.'], [22.5, A4 - 0.4, 'All of it.<br><i>In one place.</i>']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '1560px',
      font: 'italic 500 84px/1.06 Cormorant', color: '#FFF1DA', opacity: 0, zIndex: 30, textShadow: '0 0 30px rgba(255,140,60,0.9), 0 4px 30px rgba(0,0,0,0.9)' }, stage, h) }));

    // Act 4
    S.dev = { lib: device(stage, 'feat-library', { skin: 'glass', w: 520 }), ask: device(stage, 'ask-quickfire', { skin: 'glass', w: 520 }) };
    [S.dev.lib, S.dev.ask].forEach((d) => { d.body.style.boxShadow = `0 0 0 1.5px rgba(255,255,255,0.12), 0 0 160px rgba(${AMBER},0.22), 0 60px 120px rgba(0,0,0,0.8)`; });
    S.w4 = [[A4 + 0.4, 28.0, 'Ask it anything.'], [28.3, A5 - 0.2, 'No meter. No wallet.<br>No timer.']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '140px', font: '800 84px/1.04 Inter', letterSpacing: '-0.04em', color: WHITE, opacity: 0, zIndex: 30 }, stage, h) }));
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 90, color: 'rgba(242,238,230,0.6)', bg: 'rgba(255,255,255,0.05)', style: { fontSize: '22px' } });

    // Act 5
    S.end = el('div', 'layer', { zIndex: 60, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '56px',
      background: 'repeating-conic-gradient(from 0deg at 50% 46%, rgba(255,170,60,0.10) 0deg 4deg, transparent 4deg 12deg), radial-gradient(70% 45% at 50% 46%, #3b1d6e 0%, #1a0f3d 50%, #07051a 100%)' }, stage);
    S.endW = el('div', '', { font: '700 140px/1 Inter', letterSpacing: '-0.045em', color: '#fff' }, S.end, 'Plutto');
    S.endL = el('div', '', { font: 'italic 500 84px/1.1 Cormorant', color: WHITE, textAlign: 'center', padding: '0 80px' }, S.end, 'Wisdom was never meant<br>to be metered.');
    S.endC = el('div', '', { font: '600 42px/1 Inter', color: '#000', background: WHITE, borderRadius: '999px', padding: '26px 58px' }, S.end, 'plutto.space');
    S.endS = el('div', '', { font: '500 24px/1 Mono', letterSpacing: '0.24em', color: 'rgba(242,238,230,0.5)', textTransform: 'uppercase' }, S.end, 'Free to start · Android · Web');
  },

  async frame(t) {
    // Act 1
    const on1 = t < CUT;
    S.a1.style.opacity = on1 ? 1 : 0;
    if (on1) {
      const secs = Math.floor(t * (6 + t * 1.4));                 // the clock runs faster as it goes
      S.clock.textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
      S.meter.textContent = `₹${Math.round(secs * 0.5).toLocaleString('en-IN')}`;
      const push = 1 + t * 0.012;                                  // a slow push in
      S.a1.style.transform = `scale(${push})`;
      S.typing.style.opacity = 0.4 + 0.6 * Math.abs(Math.sin(t * 3));
      S.msgs.forEach((m, i) => { const a = [0.7, 2.3, 3.9, 5.3][i]; m.style.opacity = ease.outCubic(prog(t, a, a + 0.3)); m.style.transform = `translateY(${(1 - ease.outCubic(prog(t, a, a + 0.3))) * 14}px)`; });
      S.banner.style.opacity = ease.outCubic(prog(t, 6.6, 6.9)) * (t > 7.2 ? (Math.sin(t * 12) > 0 ? 1 : 0.55) : 1);
    }
    S.w1.forEach(({ a, b, e }) => { e.style.opacity = t < CUT ? inout(t, a, b, 0.35, 0.15) : 0; e.style.transform = `translateY(${(1 - ease.outExpo(prog(t, a, a + 0.5))) * 26}px)`; });

    // Act 2
    S.w2.forEach(({ a, b, e }) => { const i = inout(t, a, b, 1.0, 0.5); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 1.0))) * 10}px)`; });

    // Act 3: the rose window — every deck, stone and sky, turning
    const on3 = t >= A3 - 0.3 && t < A4 + 0.4;
    S.rose.style.opacity = on3 ? ease.outCubic(prog(t, A3 - 0.3, A3 + 0.5)) * (1 - ease.inCubic(prog(t, A4 - 0.1, A4 + 0.4))) : 0;
    if (on3) {
      const u = t - A3, gather = ease.inOutCubic(prog(t, 22.3, A4)), pulse = Math.exp(-Math.pow((t - 19.9) * 3.2, 2));
      S.wheel.style.transform = `translate(-50%, -50%) rotate(${u * 9}deg) scale(${(0.9 + 0.08 * Math.sin(u * 0.9) + pulse * 0.06) * (1 - gather * 0.7)})`;
      S.rays.style.transform = `rotate(${-u * 4}deg) scale(${1 + pulse * 0.1})`;
      S.rays.style.opacity = 0.9 + pulse * 0.1;
      for (const c of S.cards) {
        const arrive = ease.outExpo(prog(u, c.delay, c.delay + 1.3));
        const ang = c.a + u * c.spin;
        const r = c.r * (1 - gather) + pulse * 18;
        const x = Math.cos(ang) * r, y = Math.sin(ang) * r * 0.98;
        const fx = lerp(c.fx, x, arrive), fy = lerp(c.fy, y, arrive);
        const rot = lerp(c.fr, ang * 180 / Math.PI + 90, arrive);
        c.e.style.transform = `translate(${fx}px, ${fy}px) rotate(${rot}deg) rotateY(${(1 - arrive) * 180 + Math.sin(u * 1.4 + c.a * 3) * 10}deg) scale(${lerp(1.6, 1, arrive) * (1 - gather * 0.85)})`;
        c.e.style.opacity = u < c.delay ? 0 : Math.min(1, (u - c.delay) * 4) * (1 - gather * 0.6);
      }
      S.planets.forEach((pl, i) => {
        const ang = pl.a + u * pl.s, r = pl.r * (1 - gather);
        const z = Math.sin(ang);
        pl.e.style.transform = `translate(${Math.cos(ang) * r}px, ${z * r * 0.32}px) scale(${(0.7 + 0.45 * (z + 1) / 2) * (1 - gather)})`;
        pl.e.style.zIndex = z > 0 ? 6 : 1;
        pl.e.style.opacity = ease.outCubic(prog(u, 1.2 + i * 0.25, 2.2 + i * 0.25));
      });
      S.flash.style.opacity = Math.max(0, ease.inCubic(prog(t, A4 - 0.5, A4)) * (1 - ease.outCubic(prog(t, A4, A4 + 0.6))));
    } else S.flash.style.opacity = 0;
    S.w3.forEach(({ a, b, e }) => { const i = inout(t, a, b, 0.9, 0.4); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 0.9))) * 8}px)`; });

    // Act 4
    const lib = t >= A4 - 0.6 && t < 28.2, ask = t >= 28.0 && t < A5;
    if (lib) {
      await S.dev.lib.at(11.4 + (t - A4) * 1.1);
      const r = ease.outCubic(prog(t, A4 - 0.6, A4 + 0.9));
      S.dev.lib.pose(t, { y: lerp(330, 220, r), s: lerp(0.8, 0.9, r), rx: 3, o: r * (1 - prog(t, 28.0, 28.2)) });
    } else S.dev.lib.pose(t, { o: 0 });
    if (ask) {
      await S.dev.ask.at(3.6 + (t - 28.0) * 1.1);
      const r = ease.outCubic(prog(t, 28.0, 28.5)), out = ease.inCubic(prog(t, A5 - 0.4, A5));
      S.dev.ask.pose(t, { y: 220, s: 0.9, rx: 3, o: r * (1 - out) });
    } else S.dev.ask.pose(t, { o: 0 });
    S.w4.forEach(({ a, b, e }) => { e.style.opacity = inout(t, a, b, 0.5, 0.3); e.style.transform = `translateY(${(1 - ease.outExpo(prog(t, a, a + 0.6))) * 24}px)`; });
    S.honest(t >= 29.0 && t < A5 ? 1 : 0);

    // Act 5
    const te = t - A5;
    S.end.style.opacity = te >= 0 ? ease.outCubic(prog(te, 0, 0.6)) : 0;
    [[S.endW, 0.3], [S.endL, 0.9], [S.endC, 1.8], [S.endS, 2.1]].forEach(([e, a]) => { const p = ease.outCubic(prog(te, a, a + 1.0)); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 30}px)`; e.style.filter = `blur(${(1 - p) * 8}px)`; });
  },
};
