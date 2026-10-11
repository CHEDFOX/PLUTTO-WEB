/**
 * MANIFESTO · THE METER — guidance was never meant to run on a meter.
 *
 * Act 1: a per-minute "consult" screen (a parody of a genre, no app named):
 *        a ticking charge, "typing…", a recharge banner. It cracks.
 * Act 2: black. The turn, in serif.
 * Act 3: the monument: every tradition in the app's atlas (102, app/lib/atlas.json)
 *        as lit names on a helix the camera rises through.
 * Act 4: the real app rises out of its core. Chat reply is an example (tagged).
 * Act 5: the line, the address.
 */
import { el, prog, ease, lerp, rng } from '../lib.js';
import { atlas } from '../library.js';
import { device, honest } from '../asked.js';

const DUR = 38;
const A2 = 8.6, A3 = 13.0, A4 = 24.0, A5 = 31.0;
const CREAM = '#F3EAD7', AMBER = '255,186,108';
let S = {};

const pop = (p) => (p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -9 * p) * Math.cos(p * Math.PI * 2.8));
const inout = (t, a, b, d = 0.4) => ease.outCubic(prog(t, a, a + d)) * (1 - ease.inCubic(prog(t, b, b + 0.3)));

export default {
  duration: DUR,
  poster: 18.5,

  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.03 }, { i: 'tempo', bpm: 120 }];
    // Act 1: the meter. A cheap tick every quarter second, a till on every charge, a tinny loop.
    for (let t = 0.2; t < A2 - 0.4; t += 0.25) c.push({ i: 'rim', t, g: 0.12 });
    for (let t = 0.5, k = 0; t < A2 - 0.6; t += 0.5, k++) c.push({ i: 'blip', t, n: 96 + (k % 2) * 3, g: 0.12, dur: 0.06 }, { i: 'synth', t, n: [72, 76, 79, 76][k % 4], dur: 0.12, g: 0.1, cut: 2200 });
    [1.8, 5.3, 6.8].forEach((t) => c.push({ i: 'hit', t, g: 0.3 }, { i: 'blip', t, n: 100, g: 0.2 }));
    c.push({ i: 'buzz', t: 6.8, g: 0.35 }, { i: 'buzz', t: 7.3, g: 0.35 });
    // The crack: everything stops.
    c.push({ i: 'crash', t: A2 - 0.4, g: 0.5 }, { i: 'boom', t: A2 - 0.4, g: 0.7 }, { i: 'reverse', end: A2 - 0.4, dur: 0.8, g: 0.3 });
    // Act 2: a held breath, one low note.
    c.push({ i: 'pad', t: A2, end: A3 + 0.5, ns: [45, 52, 57], g: 0.09, bright: 500, verb: 0.7 }, { i: 'bell', t: A2 + 0.6, n: 69, g: 0.12 }, { i: 'bell', t: 11.2, n: 72, g: 0.1 });
    // Act 3: the monument. Choir and slow saws swell; taiko on the half bar.
    c.push({ i: 'riser', t: A3 - 1.2, end: A3, g: 0.25 }, { i: 'boom', t: A3, g: 0.8 }, { i: 'crash', t: A3, g: 0.35 });
    c.push({ i: 'choir', t: A3, end: A4 + 0.5, ns: [57, 64, 69, 72], g: 0.16, vowel: 'a' });
    [[A3, [45, 52, 57, 60, 64]], [16, [41, 48, 53, 57, 60]], [18.5, [48, 55, 60, 64, 67]], [21, [43, 50, 55, 59, 62]]].forEach(([t, ns]) =>
      c.push({ i: 'saw', t, ns, dur: 2.4, a: 0.6, rel: 1.2, cut: 900, env: 1.4, g: 0.26, verb: 0.6 }));
    for (let t = A3; t < A4 - 0.1; t += 1.0) c.push({ i: 'tom', t, f: 58, g: 0.4, verb: 0.6, d: 1.1 });
    [13.5, 16.0, 18.5, 21.5].forEach((t) => c.push({ i: 'bell', t, n: 81, g: 0.1 }));
    // Act 4: the app. The groove, finally.
    c.push({ i: 'boom', t: A4, g: 0.7 }, { i: 'pump', t: A4, end: A5, depth: 0.5 });
    for (let t = A4, k = 0; t < A5 - 0.01; t += 0.5, k++) {
      c.push({ i: 'kick', t, g: 0.6 }, { i: 'hat', t: t + 0.25, g: 0.12, open: true }, { i: 'subb', t: t + 0.25, n: [33, 29, 36, 31][Math.floor((t - A4) / 2) % 4], dur: 0.2, g: 0.4 });
      if (k % 2) c.push({ i: 'clap', t, g: 0.28 });
      c.push({ i: 'saw', t: t + 0.25, ns: [[69, 72, 76], [65, 69, 72], [67, 72, 76], [67, 71, 74]][Math.floor((t - A4) / 2) % 4], dur: 0.1, cut: 2600, g: 0.26, echo: 0.1 });
    }
    // Act 5: the line.
    c.push({ i: 'boom', t: A5, g: 0.8 }, { i: 'sting', t: A5 + 0.05, g: 0.8 }, { i: 'saw', t: A5, ns: [57, 64, 69, 73], dur: 3, a: 0.02, rel: 1.6, cut: 1500, env: 1.6, g: 0.34, verb: 0.6 });
    c.push({ i: 'choir', t: A5, end: DUR, ns: [57, 64, 69], g: 0.1, vowel: 'o' });
    return c;
  },

  async setup(stage) {
    stage.style.background = '#000';
    await Promise.all(['900 120px Inter', '800 90px Inter', 'italic 500 84px Cormorant', '500 84px Cormorant', '500 26px Mono'].map((f) => document.fonts.load(f)));
    const A = await atlas();
    S.names = A.list.map((x) => x.name.replace(/\s*\(.*\)/, ''));

    // ── Act 1: the meter ──
    S.a1 = el('div', 'layer', { background: 'linear-gradient(160deg, #FF7A00, #FFB800 55%, #FF3D71)' }, stage);
    el('div', 'layer', { backgroundImage: 'radial-gradient(rgba(255,255,255,0.25) 2px, transparent 2.5px)', backgroundSize: '30px 30px' }, S.a1);
    // the consult screen: generic, a parody of a genre
    S.ph = el('div', 'abs', { left: '200px', top: '560px', width: '680px', height: '1240px', borderRadius: '80px', background: '#111', padding: '22px', boxSizing: 'border-box', boxShadow: '0 50px 120px rgba(0,0,0,0.45)' }, S.a1);
    const scr = el('div', '', { position: 'relative', width: '100%', height: '100%', borderRadius: '60px', overflow: 'hidden', background: '#FFF8EC', font: '600 30px/1.3 Inter', color: '#222' }, S.ph);
    const head = el('div', 'abs', { left: 0, right: 0, top: 0, height: '190px', background: '#FF8A00', display: 'flex', alignItems: 'center', gap: '22px', padding: '50px 34px 0', boxSizing: 'border-box', color: '#fff' }, scr);
    el('div', '', { width: '96px', height: '96px', borderRadius: '50%', background: 'radial-gradient(circle at 40% 35%, #ffe3b0, #c97a2b)', border: '4px solid #fff', flex: 'none' }, head);
    const hb = el('div', '', {}, head);
    el('div', '', { font: '800 34px/1.1 Inter' }, hb, 'Guru ji ✦ Verified');
    S.typing = el('div', '', { font: '500 26px/1.3 Inter', opacity: 0.9 }, hb, 'typing…');
    S.timer = el('div', 'abs', { right: '30px', top: '210px', font: '800 40px/1 Mono', color: '#E5002B', background: '#FFE3E3', padding: '10px 18px', borderRadius: '14px' }, scr, '00:00');
    el('div', 'abs', { left: '30px', top: '214px', font: '700 28px/1.2 Inter', color: '#666' }, scr, 'Charged');
    S.charge = el('div', 'abs', { left: '30px', top: '250px', font: '900 76px/1 Inter', color: '#111', letterSpacing: '-0.03em' }, scr, '₹0');
    el('div', 'abs', { left: '30px', top: '340px', font: '600 26px/1 Inter', color: '#E5002B' }, scr, '₹30 / min');
    S.msgs = [['You', 'will my life get better?', 420], ['Guru ji', 'Beta, I can see some problem…', 520], ['Guru ji', 'For full remedy, extend 10 min ⏳', 640], ['Guru ji', 'Special puja available: ₹2,100 🙏', 760]].map(([who, txt, top], i) =>
      el('div', 'abs', { [who === 'You' ? 'right' : 'left']: '30px', top: `${top}px`, maxWidth: '470px', padding: '18px 24px', borderRadius: '26px', background: who === 'You' ? '#FF8A00' : '#fff', color: who === 'You' ? '#fff' : '#222',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)', opacity: 0 }, scr, txt));
    S.banner = el('div', 'abs', { left: '24px', right: '24px', bottom: '40px', padding: '28px', borderRadius: '30px', background: '#E5002B', color: '#fff', textAlign: 'center', font: '900 40px/1.15 Inter', opacity: 0 }, scr,
      'LOW BALANCE ⚠<br><span style="font:700 30px Inter">Recharge ₹199 to continue</span>');
    // the words over it
    S.w1 = [[0.2, 1.7, 'Right now, someone<br>is paying'], [1.8, 3.2, '₹30 a minute'], [3.3, 5.1, 'to hear<br>“it will get better.”'], [5.3, 6.7, 'The timer<br>is the product.']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '150px', font: '900 104px/1 Inter', letterSpacing: '-0.05em',
      color: '#111', opacity: 0 }, S.a1, h) }));
    // the crack: the screen breaks into shards
    S.shards = [];
    const R = rng(4);
    for (let i = 0; i < 14; i++) {
      const x0 = R() * 100, y0 = R() * 100;
      const poly = Array.from({ length: 4 }, (_, k) => { const a = k / 4 * 6.283 + R() * 0.8, r = 18 + R() * 22; return `${Math.max(0, Math.min(100, x0 + Math.cos(a) * r))}% ${Math.max(0, Math.min(100, y0 + Math.sin(a) * r))}%`; }).join(',');
      S.shards.push({ e: el('div', 'layer', { background: 'linear-gradient(160deg, #FF7A00, #FFB800 55%, #FF3D71)', clipPath: `polygon(${poly})`, opacity: 0, zIndex: 20 }, stage), vx: (R() - 0.5) * 1600, vy: -600 - R() * 900, r: (R() - 0.5) * 120 });
    }
    S.cracks = el('div', 'layer', { zIndex: 21, opacity: 0, background: 'repeating-linear-gradient(120deg, transparent 0 140px, rgba(255,255,255,0.9) 140px 143px, transparent 143px 300px), repeating-linear-gradient(35deg, transparent 0 210px, rgba(255,255,255,0.8) 210px 212px, transparent 212px 420px)' }, stage);

    // ── Act 2: the turn ──
    S.w2 = [[A2 + 0.4, 10.9, 'Guidance was never meant<br>to run on a meter.'], [11.1, A3 - 0.2, 'Every culture wrote theirs down,<br><i>so it could be passed on.</i>']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '820px', font: '500 80px/1.12 Cormorant',
      color: CREAM, opacity: 0, zIndex: 30, padding: '0 60px' }, stage, h) }));

    // ── Act 3: the monument ──
    S.cv = el('canvas', 'layer', { zIndex: 0 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');
    S.dust = Array.from({ length: 160 }, () => { const r = rng(S.dust ? 0 : 1); return null; });
    const D = rng(9); S.dust = Array.from({ length: 180 }, () => ({ x: D() * 1080, y: D() * 1920, z: 0.2 + D() * 0.8, p: D() * 6.28 }));
    S.w3 = [[13.5, 15.7, 'Every century of it.', ''], [16.0, 18.3, 'Every tradition.<br>Every continent.', ''],
      [18.5, 21.3, 'Vedic. Yoruba cowries.<br>Norse runes. Hafez.<br>The Maya. Kabbalah.', 'small'], [21.5, 23.8, 'All of it.<br><i>In one place.</i>', '']].map(([a, b, h, k]) => ({ a, b, e: el('div', 'abs center', { top: k ? '1450px' : '1480px',
      font: k ? '500 66px/1.12 Cormorant' : '500 104px/1.02 Cormorant', color: CREAM, opacity: 0, zIndex: 30, textShadow: `0 0 40px rgba(${AMBER},0.6), 0 2px 30px rgba(0,0,0,0.8)` }, stage, h) }));

    // ── Act 4: the app ──
    S.dev = { lib: device(stage, 'feat-library', { skin: 'glass', w: 520 }), ask: device(stage, 'ask-quickfire', { skin: 'glass', w: 520 }) };
    S.dev.lib.body.style.boxShadow = S.dev.ask.body.style.boxShadow = `0 0 0 2px rgba(255,255,255,0.12), 0 0 120px rgba(${AMBER},0.45), 0 60px 120px rgba(0,0,0,0.7)`;
    S.w4 = [[24.4, 27.2, 'Ask it anything.'], [27.5, 30.8, 'No meter. No wallet.<br>No timer.']].map(([a, b, h]) => ({ a, b, e: el('div', 'abs center', { top: '150px', font: '800 96px/1.02 Inter', letterSpacing: '-0.045em', color: CREAM, opacity: 0, zIndex: 30 }, stage, h) }));
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 90, color: 'rgba(243,234,215,0.7)', bg: 'rgba(255,255,255,0.06)', style: { fontSize: '22px' } });

    // ── Act 5: the line ──
    S.end = el('div', 'layer', { zIndex: 60, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '60px',
      background: `radial-gradient(60% 40% at 50% 45%, rgba(${AMBER},0.18), transparent 70%), #000` }, stage);
    S.endW = el('div', '', { font: '700 150px/1 Inter', letterSpacing: '-0.04em', color: '#fff' }, S.end, 'Plutto');
    S.endL = el('div', '', { font: 'italic 500 88px/1.1 Cormorant', color: CREAM, textAlign: 'center', padding: '0 80px' }, S.end, 'Wisdom was never meant<br>to be metered.');
    S.endC = el('div', '', { font: '600 44px/1 Inter', color: '#000', background: CREAM, borderRadius: '999px', padding: '28px 60px' }, S.end, 'plutto.space');
    S.endS = el('div', '', { font: '500 26px/1 Mono', letterSpacing: '0.2em', color: 'rgba(243,234,215,0.6)', textTransform: 'uppercase' }, S.end, 'Free to start · Android · Web');
  },

  async frame(t) {
    // ── Act 1 ──
    const a1 = t < A2;
    S.a1.style.opacity = a1 ? 1 : 0;
    if (a1) {
      const secs = Math.floor(t * 11.5);    // the clock runs fast: a minute every five seconds
      S.timer.textContent = `${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
      S.charge.textContent = `₹${Math.floor(secs / 60 * 30 + (secs % 60) / 2).toLocaleString('en-IN')}`;
      S.typing.style.opacity = 0.5 + 0.5 * Math.sin(t * 9);
      S.msgs.forEach((m, i) => { const a = [0.6, 2.0, 3.6, 5.0][i]; m.style.opacity = t >= a ? 1 : 0; m.style.transform = `scale(${pop(prog(t, a, a + 0.4))})`; });
      const bn = pop(prog(t, 6.8, 7.2));
      S.banner.style.opacity = t >= 6.8 ? 1 : 0; S.banner.style.transform = `scale(${bn}) translateX(${t >= 6.8 ? Math.sin(t * 60) * 6 : 0}px)`;
      const shake = t > 7.6 ? Math.sin(t * 90) * 10 * prog(t, 7.6, A2 - 0.4) : 0;
      S.ph.style.transform = `translate(${shake}px, ${Math.sin(t * 1.3) * 8}px) rotate(${-2 + Math.sin(t * 0.8)}deg)`;
      S.w1.forEach(({ a, b, e }) => { const p = pop(prog(t, a, a + 0.4)); e.style.opacity = t >= a && t < b ? 1 : 0; e.style.transform = `scale(${p}) rotate(-2deg)`; });
    }
    // the crack and the shatter
    S.cracks.style.opacity = t >= A2 - 0.9 && t < A2 - 0.4 ? prog(t, A2 - 0.9, A2 - 0.6) : 0;
    S.shards.forEach((s) => {
      const u = t - (A2 - 0.4);
      if (u < 0 || u > 1.4) { s.e.style.opacity = 0; return; }
      s.e.style.opacity = 1 - prog(u, 0.6, 1.4);
      s.e.style.transform = `translate(${s.vx * u}px, ${s.vy * u + 2400 * u * u}px) rotate(${s.r * u}deg)`;
    });

    // ── Act 2 ──
    S.w2.forEach(({ a, b, e }) => { const i = inout(t, a, b, 0.8); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 0.8))) * 12}px)`; });

    // ── Act 3: the helix of names ──
    const g = S.g; g.clearRect(0, 0, 1080, 1920);
    const m3 = t >= A3 - 0.3 && t < A5;
    if (m3) {
      const fade = ease.outCubic(prog(t, A3 - 0.3, A3 + 0.8)) * (1 - 0.85 * ease.inCubic(prog(t, A4 - 0.6, A4 + 0.4))) * (1 - ease.inCubic(prog(t, A5 - 0.4, A5)));
      const rise = (t - A3) * 140;                      // the camera climbs
      const spin = t * 0.35;
      const sh = g.createRadialGradient(540, 760, 0, 540, 760, 1100);
      sh.addColorStop(0, `rgba(${AMBER},${0.22 * fade})`); sh.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = sh; g.fillRect(0, 0, 1080, 1920);
      // light shafts
      g.save(); g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 5; k++) { const x = 540 + Math.sin(t * 0.2 + k * 1.3) * 380; const gr = g.createLinearGradient(x, 0, x + 120, 1920); gr.addColorStop(0, `rgba(${AMBER},${0.06 * fade})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
        g.fillStyle = gr; g.beginPath(); g.moveTo(x - 40, 0); g.lineTo(x + 40, 0); g.lineTo(x + 260, 1920); g.lineTo(x - 260, 1920); g.fill(); }
      g.restore();
      // the names: three turns of the tower visible, repeating as we climb
      const N = S.names.length, items = [];
      for (let rep = -1; rep < 3; rep++) for (let i = 0; i < N; i++) {
        const k = i + rep * N, ang = k * 0.55 + spin, y = 1500 - k * 26 + rise;
        if (y < -120 || y > 2040) continue;
        const z = Math.sin(ang);
        items.push({ n: S.names[i], x: 540 + Math.cos(ang) * 360, y, z });
      }
      items.sort((a, b) => a.z - b.z);
      g.textAlign = 'center'; g.textBaseline = 'middle';
      for (const it of items) {
        const front = (it.z + 1) / 2, sz = 22 + front * 26;
        g.globalAlpha = fade * (0.12 + 0.88 * front * front);
        g.font = `${front > 0.75 ? 'italic ' : ''}500 ${sz.toFixed(0)}px Cormorant`;
        g.fillStyle = front > 0.8 ? `rgb(${AMBER})` : CREAM;
        g.shadowColor = `rgba(${AMBER},0.8)`; g.shadowBlur = front > 0.8 ? 18 : 0;
        g.fillText(it.n, it.x, it.y);
      }
      g.shadowBlur = 0;
      // the core: a column of light the phone will rise out of
      const core = ease.inOutCubic(prog(t, 21.5, A4));
      if (core > 0) { const cg = g.createRadialGradient(540, 960, 0, 540, 960, 600 * core); cg.addColorStop(0, `rgba(255,240,220,${0.9 * core * fade})`); cg.addColorStop(0.3, `rgba(${AMBER},${0.4 * core * fade})`); cg.addColorStop(1, 'rgba(0,0,0,0)');
        g.globalAlpha = 1; g.fillStyle = cg; g.fillRect(0, 0, 1080, 1920); }
      // dust
      g.globalAlpha = fade;
      for (const d of S.dust) { const y = (d.y - (t - A3) * 40 * d.z + 1920 * 4) % 1920; g.fillStyle = `rgba(${AMBER},${0.25 + 0.5 * d.z * (0.5 + 0.5 * Math.sin(t * 2 + d.p))})`; g.beginPath(); g.arc(d.x, y, 0.8 + d.z * 1.8, 0, 6.283); g.fill(); }
      g.globalAlpha = 1;
    }
    S.w3.forEach(({ a, b, e }) => { const i = inout(t, a, b, 0.7); e.style.opacity = i; e.style.filter = `blur(${(1 - ease.outCubic(prog(t, a, a + 0.7))) * 10}px)`;
      e.style.letterSpacing = `${(1 - ease.outCubic(prog(t, a, a + 1.4))) * 0.08}em`; });

    // ── Act 4: the app, out of the core ──
    const lib = t >= A4 - 0.6 && t < 27.4, ask = t >= 27.2 && t < A5;
    if (lib) {
      await S.dev.lib.at(11.4 + (t - A4) * 1.2);
      const r = ease.outExpo(prog(t, A4 - 0.6, A4 + 0.6));
      S.dev.lib.pose(t, { y: lerp(400, 200, r) + Math.sin(t * 1.2) * 6, s: lerp(0.3, 0.9, r), rx: 4, ry: Math.sin(t * 0.5) * 6, o: r * (1 - prog(t, 27.2, 27.4)) });
    } else S.dev.lib.pose(t, { o: 0 });
    if (ask) {
      await S.dev.ask.at(0.9 + (t - 27.2) * 1.6);
      const r = ease.outExpo(prog(t, 27.2, 27.7)), out = ease.inCubic(prog(t, A5 - 0.3, A5));
      S.dev.ask.pose(t, { y: 200 + Math.sin(t * 1.2) * 6, s: 0.9 * (1 + out * 0.3), rx: 4, ry: lerp(-20, 0, r) + Math.sin(t * 0.5) * 6, x: lerp(900, 0, r), o: 1 - out });
    } else S.dev.ask.pose(t, { o: 0 });
    S.w4.forEach(({ a, b, e }) => { const i = inout(t, a, b, 0.5); e.style.opacity = i; e.style.transform = `translateY(${(1 - ease.outExpo(prog(t, a, a + 0.5))) * 40}px)`; });
    S.honest(t >= 28.4 && t < A5 ? 1 : 0);

    // ── Act 5 ──
    const te = t - A5;
    S.end.style.opacity = te >= 0 ? ease.outCubic(prog(te, 0, 0.4)) : 0;
    [[S.endW, 0.2], [S.endL, 0.7], [S.endC, 1.5], [S.endS, 1.8]].forEach(([e, a]) => { const p = ease.outCubic(prog(te, a, a + 0.8)); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 40}px)`; e.style.filter = `blur(${(1 - p) * 10}px)`; });
  },
};
