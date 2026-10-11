/**
 * MANIFESTO · THE METER — guidance was never meant to run on a meter.
 *
 * Restraint throughout: black, one cold red for the meter, one warm amber for
 * the turn, white type. No app is named; the meter is a genre, not a brand.
 *
 * Act 1  The meter: a taxi-meter counter in red, a plain consult chat, a clock
 *        that ticks too fast. Then the sound and picture cut to nothing.
 * Act 2  The turn, in serif, on black.
 * Act 3  The roll: every tradition in the app's atlas rises through a band of
 *        warm light, one at a time, like the credits of humanity.
 * Act 4  The real app, out of the light. The reply is an example (tagged).
 * Act 5  The line.
 */
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

    // ── Act 1: the meter ──
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

    // ── Act 2 ──
    S.w2 = [[A2 + 0.5, 11.0, 'Guidance was never meant<br>to run on a meter.'], [11.3, A3 - 0.3, 'Every culture wrote theirs down,<br><i>so it could be passed on.</i>']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '840px', font: '500 76px/1.14 Cormorant',
      color: WHITE, opacity: 0, zIndex: 30, padding: '0 70px' }, stage, h) }));

    // ── Act 3: the roll ──
    const SCRIPTS = [['Runic', 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ'], ['Ogham', 'ᚁᚂᚃᚄᚅᚆᚇᚈᚉᚊᚋᚌᚍᚎᚏ'], ['InterGreek', 'ΑΒΓΔΘΛΞΠΣΦΨΩ'], ['JP', 'あいうえおかきくけこさしすせそ'],
      ['Deva', 'ॐअकगजञतनमरशह'], ['Hebrew', 'אבגדהוזחטיכלמנסעפצקרשת'], ['Arabic', 'ابجدهوزحطيكلمنسعفصقرشت'], ['CJK', '天地人乾坤震巽坎離艮兌命運福吉星月日']];
    await Promise.all(SCRIPTS.map(([f, cs]) => document.fonts.load(`40px ${f}`, cs)));
    const RC = rng(33); S.cells = [];
    for (let y = -300; y < 2300; y += 62) for (let x = -300; x < 1380; x += 58) {
      const [f, cs] = SCRIPTS[Math.floor(RC() * SCRIPTS.length)], chars = [...cs];
      S.cells.push({ x: x + (Math.floor(y / 62) % 2) * 29, y, f, ch: chars[Math.floor(RC() * chars.length)], sz: 30 + RC() * 16, p: RC() * 6.28, w: RC() });
    }
    S.world = await (await fetch('asked/world.json')).json();
    // the order the lights come on: as the Earth turns them toward us
    S.world.points.forEach((p) => { p.key = ((95 - p.lon) % 360 + 360) % 360 + (p.lat * 0.01); });
    [...S.world.points].sort((a, b) => a.key - b.key).forEach((p, i) => { p.rank = i; });
    S.cv = el('canvas', 'layer', { zIndex: 0 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');
    S.w3 = [[14.2, 16.6, 'Every century of it.'], [17.0, 19.5, 'Every tradition.<br>Every continent.'], [19.9, 22.2, 'Carved. Painted. Memorised.'], [22.5, A4 - 0.4, 'All of it.<br><i>In one place.</i>']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '1560px',
      font: '500 78px/1.08 Cormorant', color: WHITE, opacity: 0, zIndex: 30 }, stage, h) }));

    // ── Act 4 ──
    S.dev = { lib: device(stage, 'feat-library', { skin: 'glass', w: 520 }), ask: device(stage, 'ask-quickfire', { skin: 'glass', w: 520 }) };
    [S.dev.lib, S.dev.ask].forEach((d) => { d.body.style.boxShadow = `0 0 0 1.5px rgba(255,255,255,0.12), 0 0 160px rgba(${AMBER},0.22), 0 60px 120px rgba(0,0,0,0.8)`; });
    S.w4 = [[A4 + 0.4, 28.0, 'Ask it anything.'], [28.3, A5 - 0.2, 'No meter. No wallet.<br>No timer.']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '140px', font: '800 84px/1.04 Inter', letterSpacing: '-0.04em', color: WHITE, opacity: 0, zIndex: 30 }, stage, h) }));
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 90, color: 'rgba(242,238,230,0.6)', bg: 'rgba(255,255,255,0.05)', style: { fontSize: '22px' } });

    // ── Act 5 ──
    S.end = el('div', 'layer', { zIndex: 60, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '56px',
      background: `radial-gradient(50% 32% at 50% 46%, rgba(${AMBER},0.12), transparent 70%), #000` }, stage);
    S.endW = el('div', '', { font: '700 140px/1 Inter', letterSpacing: '-0.045em', color: '#fff' }, S.end, 'Plutto');
    S.endL = el('div', '', { font: 'italic 500 84px/1.1 Cormorant', color: WHITE, textAlign: 'center', padding: '0 80px' }, S.end, 'Wisdom was never meant<br>to be metered.');
    S.endC = el('div', '', { font: '600 42px/1 Inter', color: '#000', background: WHITE, borderRadius: '999px', padding: '26px 58px' }, S.end, 'plutto.space');
    S.endS = el('div', '', { font: '500 24px/1 Mono', letterSpacing: '0.24em', color: 'rgba(242,238,230,0.5)', textTransform: 'uppercase' }, S.end, 'Free to start · Android · Web');
  },

  async frame(t) {
    // ── Act 1 ──
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

    // ── Act 2 ──
    S.w2.forEach(({ a, b, e }) => { const i = inout(t, a, b, 1.0, 0.5); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 1.0))) * 10}px)`; });

    // ── Act 3: the world, lit where each tradition was set down ──
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    if (t >= A3 - 0.3 && t < A5) {
      const fade = ease.outCubic(prog(t, A3 - 0.3, A3 + 0.4)) * (1 - ease.inCubic(prog(t, A5 - 0.4, A5)));
      const CX = 540, CY = 960, R = lerp(380, 450, ease.inOutCubic(prog(t, A3, 22.0)));
      const lon0 = (95 - (t - A3) * 24) * Math.PI / 180, lat0 = 18 * Math.PI / 180;
      const sl = Math.sin(lat0), cl = Math.cos(lat0);
      const proj = (lat, lon) => {
        const la = lat * Math.PI / 180, lo = lon * Math.PI / 180 - lon0;
        const x = Math.cos(la) * Math.sin(lo), y = cl * Math.sin(la) - sl * Math.cos(la) * Math.cos(lo), z = sl * Math.sin(la) + cl * Math.cos(la) * Math.cos(lo);
        return [CX + x * R, CY - y * R, z];
      };
      const conv = ease.inOutCubic(prog(t, 22.2, A4 + 0.2));              // everything gathers into one core
      const dim = 1 - conv;
      // the sphere: a faint body and a rim of light
      const body = g.createRadialGradient(CX - R * 0.3, CY - R * 0.35, R * 0.1, CX, CY, R);
      body.addColorStop(0, `rgba(40,34,30,${0.9 * fade * dim})`); body.addColorStop(1, `rgba(8,7,7,${0.95 * fade * dim})`);
      g.fillStyle = body; g.beginPath(); g.arc(CX, CY, R, 0, 6.283); g.fill();
      const rim = g.createRadialGradient(CX, CY, R * 0.92, CX, CY, R * 1.18);
      rim.addColorStop(0, 'rgba(0,0,0,0)'); rim.addColorStop(0.35, `rgba(${AMBER},${0.22 * fade * dim})`); rim.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = rim; g.fillRect(CX - R * 1.3, CY - R * 1.3, R * 2.6, R * 2.6);
      // graticule, very faint
      g.strokeStyle = `rgba(242,238,230,${0.05 * fade * dim})`; g.lineWidth = 1;
      for (let lo = -180; lo < 180; lo += 30) { g.beginPath(); let pen = false; for (let la = -90; la <= 90; la += 6) { const [x, y, z] = proj(la, lo); if (z > 0) { pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } else pen = false; } g.stroke(); }
      // the coastlines draw themselves on
      const draw = ease.inOutCubic(prog(t, A3 + 0.3, A3 + 3.2));
      g.strokeStyle = `rgba(242,238,230,${0.55 * fade * dim})`; g.lineWidth = 1.4;
      let k = 0, budget = Math.floor(S.world.xy.length / 2 * draw);
      for (const n of S.world.rings) {
        g.beginPath(); let pen = false;
        for (let i = 0; i < n; i++, k++) {
          if (k > budget) break;
          const [x, y, z] = proj(S.world.xy[k * 2 + 1], S.world.xy[k * 2]);
          if (z > 0.02) { pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; } else pen = false;
        }
        g.stroke();
        if (k > budget) break;
        k += 0;
      }
      // the lights: each tradition, at the place it was set down
      const pts = S.world.points;
      const labels = [];
      g.save(); g.globalCompositeOperation = 'lighter';
      pts.forEach((p, i) => {
        const on = A3 + 1.2 + p.rank * 0.085;
        if (t < on) return;
        let [x, y, z] = proj(p.lat, p.lon);
        const front = z > 0;
        const age = t - on, flare = Math.exp(-age * 3);
        // gathering: every light lifts off and flies to the core
        if (conv > 0) { const q = ease.inOutCubic(Math.min(1, conv * (1.2 + (i % 7) * 0.06))); x = lerp(x, CX, q); y = lerp(y, CY, q) - Math.sin(q * Math.PI) * 140; }
        const vis = front || conv > 0.2 ? 1 : 0.18;
        const r = 3 + flare * 10;
        const gl = g.createRadialGradient(x, y, 0, x, y, 22 + flare * 40);
        gl.addColorStop(0, `rgba(255,230,190,${vis * fade})`); gl.addColorStop(0.25, `rgba(${AMBER},${0.55 * vis * fade})`); gl.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gl; g.beginPath(); g.arc(x, y, 22 + flare * 40, 0, 6.283); g.fill();
        g.fillStyle = `rgba(255,245,230,${vis * fade})`; g.beginPath(); g.arc(x, y, r * 0.5, 0, 6.283); g.fill();
        if (front && age < 2.2 && conv === 0 && z > 0.45) labels.push({ p, x, y, a: inout(t, on, on + 1.6, 0.3, 0.5) });
        // a ripple when it lights
        if (age < 1.2 && front) { g.strokeStyle = `rgba(${AMBER},${(1 - age / 1.2) * 0.6 * fade})`; g.lineWidth = 1.5; g.beginPath(); g.arc(x, y, 8 + age * 60, 0, 6.283); g.stroke(); }
      });
      g.restore();
      // a few names, where the eye is: place in mono, tradition in serif
      const placed = [];
      labels.sort((a, b) => b.p.rank - a.p.rank).filter((l) => { if (placed.some((q) => Math.hypot(q.x - l.x, q.y - l.y) < 150)) return false; placed.push(l); return placed.length <= 3; }).forEach(({ p, x, y, a }) => {
        g.globalAlpha = a * fade; g.textAlign = 'left'; g.textBaseline = 'alphabetic';
        g.strokeStyle = `rgba(${AMBER},0.6)`; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 6, y - 6); g.lineTo(x + 46, y - 46); g.lineTo(x + 70, y - 46); g.stroke();
        g.font = '500 20px Mono'; g.fillStyle = 'rgba(242,238,230,0.7)'; g.fillText(p.place.toUpperCase(), x + 78, y - 58);
        g.font = 'italic 500 38px Cormorant'; g.fillStyle = WHITE; g.fillText(p.name.replace(/\s*\(.*\)/, ''), x + 78, y - 22);
      });
      g.globalAlpha = 1;
      // the core
      if (conv > 0) { const cg = g.createRadialGradient(CX, CY, 0, CX, CY, 520 * conv); cg.addColorStop(0, `rgba(255,240,220,${0.9 * conv * fade})`); cg.addColorStop(0.3, `rgba(${AMBER},${0.35 * conv * fade})`); cg.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920); }
      // the floor under the lines
      const fl = g.createLinearGradient(0, 1420, 0, 1920); fl.addColorStop(0, 'rgba(0,0,0,0)'); fl.addColorStop(0.4, `rgba(0,0,0,${0.9 * fade})`);
      g.fillStyle = fl; g.fillRect(0, 1420, 1080, 500);
    }
    S.w3.forEach(({ a, b, e }) => { const i = inout(t, a, b, 0.9, 0.4); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 0.9))) * 8}px)`; });

    // ── Act 4 ──
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

    // ── Act 5 ──
    const te = t - A5;
    S.end.style.opacity = te >= 0 ? ease.outCubic(prog(te, 0, 0.6)) : 0;
    [[S.endW, 0.3], [S.endL, 0.9], [S.endC, 1.8], [S.endS, 2.1]].forEach(([e, a]) => { const p = ease.outCubic(prog(te, a, a + 1.0)); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 30}px)`; e.style.filter = `blur(${(1 - p) * 8}px)`; });
  },
};
