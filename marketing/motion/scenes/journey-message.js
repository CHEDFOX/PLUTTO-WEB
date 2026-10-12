/**
 * JOURNEY · ONE MESSAGE — what happens after you press send.
 *
 * Minimal on purpose: black, white letters, one warm accent, one line of words
 * per step. The message is sent in the real app (public/app/screens/ask-quit),
 * holds in the chat, then its letters peel off the screen as a wave, and the
 * wave's SHAPE tells the story — the real steps of the server's path
 * (app/services/oracle/pipeline.py):
 *   read (a line of light) · your sky (an orbit) · traditions (strands, each in
 *   its own script) · memory (older waves join) · council (they converge into
 *   one) · timing (flat, one pulse: a date) · your voice (the reply forms).
 * Then the wave flows back into the phone as the answer, and holds.
 * The reply is an example written for the film; the tag says so.
 */
import { el, prog, ease, lerp, rng } from '../lib.js';
import { device, honest, events } from '../asked.js';

const DUR = 40;
const SENT = 4.0, PEEL = 5.4, J0 = 7.0, SD = 3.0, VOICE = 25.0, BACK = 28.6, HOLD = 31.0, END = 35.0;
const Q = 'should i quit my job without a plan?';
const REPLY = ['Quit with a date,', 'not a mood.'];
const WARM = '255,196,128';
const STEPS = [
  ['Read', 'It reads your words, your language, your tone.'],
  ['Your sky', 'It computes your sky, to the minute you were born.'],
  ['Traditions', 'It sends your question through every tradition that fits.'],
  ['Memory', 'It remembers what you have told it before.'],
  ['Council', 'Each weighs it alone. Then they agree.'],
  ['Timing', 'It finds a real date.'],
  ['Your voice', 'It answers in your words.'],
];
// the phone (asked.device geometry at w 520)
const SW = 520, BEZ = 16, K = SW / 590, BW = SW + 2 * BEZ, BH = Math.round(SW * 1280 / 590) + 2 * BEZ;
const onStage = (P, sx, sy) => [540 + P.x + (BEZ + sx * K - BW / 2) * P.s, 960 + P.y + (BEZ + sy * K - BH / 2) * P.s];
const N = { x: 0, y: 140, s: 0.9 };
const ZOOM = { x: -120, y: 640, s: 1.5 };   // close on the sent bubble
const SCRIPTS = [null, 'अकगजतनमरशहवलयपबदधसच', 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗ', '天地人命運福星月日乾坤震巽坎離艮兌吉'];
const SFONT = ['Inter', 'Deva', 'Runic', 'CJK'];
let S = {};

const sm = (t, a, b) => ease.inOutCubic(prog(t, a, b));
const inout = (t, a, b, d = 0.5, o = 0.4) => ease.outCubic(prog(t, a, a + d)) * (1 - ease.inCubic(prog(t, b, b + o)));

export default {
  duration: DUR,
  poster: 14.5,

  score() {
    const c = [{ i: 'room', t: 0, end: DUR, g: 0.02 }];
    const R = rng(3);
    for (let t = 0.5; t < SENT - 0.2; t += 0.08 + R() * 0.06) c.push({ i: 'key', t, g: 0.1 });
    c.push({ i: 'blip', t: SENT, n: 81, g: 0.16 });
    // the hold: one low note, a breath
    c.push({ i: 'pluck', t: SENT + 0.3, n: 45, g: 0.18, dur: 3 }, { i: 'pad', t: SENT, end: DUR - 1, ns: [45, 52, 57], g: 0.05, bright: 500, verb: 0.7 });
    // the peel: a long rising swell, like a wave lifting
    c.push({ i: 'riser', t: PEEL - 0.6, end: J0, g: 0.18 }, { i: 'whoosh', t: PEEL, dur: 1.8, g: 0.22, from: -0.6, to: 0.6 }, { i: 'subb', t: J0, n: 33, dur: 1.2, g: 0.4 });
    // the journey: a slow heartbeat of sub, piano on each step, a soft swell between
    const CH = [[57, 64, 69, 72], [53, 60, 65, 69], [55, 62, 67, 71], [52, 59, 64, 67]];
    for (let k = 0; k < STEPS.length; k++) {
      const a = J0 + k * SD, ch = CH[k % 4];
      c.push({ i: 'subb', t: a, n: [33, 29, 31, 28][k % 4], dur: 0.9, g: 0.32 });
      ch.forEach((n, j) => c.push({ i: 'pluck', t: a + j * 0.18, n, g: 0.07, dur: 2.6 }));
      c.push({ i: 'whoosh', t: a + SD - 0.9, dur: 1.0, g: 0.08, from: k % 2 ? 0.5 : -0.5, to: k % 2 ? -0.5 : 0.5 });
    }
    c.push({ i: 'saw', t: J0, ns: [45, 52, 57], dur: VOICE - J0, a: 2, rel: 2, cut: 600, env: 1.1, g: 0.07, verb: 0.7, spread: 0.4 });
    c.push({ i: 'bell', t: J0 + 5 * SD + 1.2, n: 81, g: 0.12 });                         // the date
    c.push({ i: 'choir', t: VOICE, end: BACK + 0.8, ns: [57, 64, 69], g: 0.08, vowel: 'a' });
    // back into the phone, and the hold on the answer
    c.push({ i: 'whoosh', t: BACK, dur: 1.6, g: 0.2, from: 0.6, to: -0.6 }, { i: 'pluck', t: HOLD, n: 69, g: 0.14, dur: 4 }, { i: 'pluck', t: HOLD, n: 57, g: 0.12, dur: 4 }, { i: 'subb', t: HOLD, n: 33, dur: 1, g: 0.3 });
    c.push({ i: 'pluck', t: END, n: 64, g: 0.12, dur: 4 }, { i: 'pluck', t: END + 0.25, n: 69, g: 0.12, dur: 4 }, { i: 'pluck', t: END + 0.5, n: 76, g: 0.12, dur: 4 });
    return c;
  },

  async setup(stage) {
    stage.style.background = '#000';
    await Promise.all(['600 34px Inter', '600 56px Inter', '500 22px Mono', 'italic 500 96px Cormorant', '34px Deva', '34px Runic', '34px CJK', '700 130px Inter'].map((f) => document.fonts.load(f)));
    S.qv = await events('ask-quit');
    S.cv = el('canvas', 'layer', { zIndex: 5 }, stage); S.cv.width = 1080; S.cv.height = 1920; S.g = S.cv.getContext('2d');

    // the stream: the question, four times over, as one long wave
    const line = (Q + '    ').repeat(4);
    S.chars = [...line].map((ch, i, all) => {
      const s = i / all.length, j = i % 4, R = rng(i * 7 + 1);
      const sc = SCRIPTS[j];
      return { ch, s, j, alt: sc ? [...sc][Math.floor(R() * [...sc].length)] : ch, first: i < Q.length, k: i };
    });
    // where each letter of the sent bubble sits on the recording (590 × 1280 px)
    S.bub = (i) => [185 + (i / Q.length) * 350, 110];
    // the reply, laid out for the voice step
    const g = S.g;
    g.font = 'italic 500 96px Cormorant';
    S.replyPos = [];
    REPLY.forEach((ln, li) => {
      const w = g.measureText(ln).width; let x = 540 - w / 2;
      [...ln].forEach((ch) => { const cw = g.measureText(ch).width; S.replyPos.push({ ch, x: x + cw / 2, y: 900 + li * 110 }); x += cw; });
    });
    S.ghosts = ['the new job in March', 'moving cities', 'your sister', 'what you said in June'];

    S.dev = device(stage, 'ask-quit', { skin: 'glass', w: SW });
    S.dev.el.style.zIndex = 10;
    // covers the sent bubble on the screen while its letters are away
    S.cover = el('div', 'abs', { left: `${170 * K}px`, top: `${80 * K}px`, width: `${400 * K}px`, height: `${64 * K}px`, background: '#000', opacity: 0 }, S.dev.screen);

    S.title = el('div', 'abs center', { top: '210px', font: '600 64px/1.08 Inter', letterSpacing: '-0.035em', color: '#fff', zIndex: 20, opacity: 0 }, stage, 'What happens<br>after you press send.');
    S.label = el('div', 'abs', { left: '90px', right: '90px', top: '1560px', zIndex: 20, opacity: 0 }, stage);
    S.labelK = el('div', '', { font: '500 22px/1 Mono', letterSpacing: '0.28em', textTransform: 'uppercase', color: `rgb(${WARM})` }, S.label);
    S.labelL = el('div', '', { font: '600 52px/1.12 Inter', letterSpacing: '-0.03em', color: '#fff', marginTop: '18px' }, S.label);
    S.date = el('div', 'abs center', { top: '760px', zIndex: 20, opacity: 0 }, stage,
      `<div style="font:500 22px Mono;letter-spacing:.28em;color:rgb(${WARM})">THE DATE IT FOUND</div><div style="font:600 96px/1.1 Inter;letter-spacing:-0.04em;color:#fff;margin-top:14px">4 November</div>`);
    S.ans = el('div', 'abs center', { top: '210px', font: '600 64px/1.08 Inter', letterSpacing: '-0.035em', color: '#fff', zIndex: 20, opacity: 0 }, stage, 'The answer.');
    S.honest = honest(stage, { text: 'Real app · example reply', bottom: 80, color: 'rgba(255,255,255,0.6)', bg: 'rgba(255,255,255,0.06)', style: { fontSize: '22px', zIndex: 21 } });
    S.end = el('div', 'layer', { zIndex: 60, opacity: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '48px', background: '#000' }, stage);
    S.endA = el('div', '', { font: 'italic 500 84px/1.1 Cormorant', color: '#fff', textAlign: 'center', padding: '0 80px' }, S.end, 'Every question takes the long way.');
    S.endW = el('div', '', { font: '700 130px/1 Inter', letterSpacing: '-0.045em', color: '#fff' }, S.end, 'Plutto');
    S.endC = el('div', '', { font: '500 30px/1 Mono', letterSpacing: '0.24em', color: `rgb(${WARM})` }, S.end, 'PLUTTO.SPACE');
  },

  async frame(t) {
    const qv = S.qv, g = S.g;
    g.clearRect(0, 0, 1080, 1920);

    // ── the phone ──
    let P = N, ph = 1, ft;
    if (t < SENT) { ft = 1.0 + t * ((qv.send_0 - 1.0) / SENT); }
    else if (t < BACK) {
      ft = Math.min(qv.send_0 + 1.1, qv.send_0 + 0.6 + (t - SENT) * 0.3);
      P = { x: lerp(N.x, ZOOM.x, sm(t, SENT + 0.2, PEEL)), y: lerp(N.y, ZOOM.y, sm(t, SENT + 0.2, PEEL)), s: lerp(N.s, ZOOM.s, sm(t, SENT + 0.2, PEEL)) };
      ph = 1 - sm(t, PEEL + 0.6, J0 + 0.2);
    } else {
      ft = qv.answered_0 + 0.25;
      const up = sm(t, BACK, BACK + 1.2);
      P = { x: 0, y: lerp(900, N.y, up), s: N.s };
      ph = up * (1 - ease.inCubic(prog(t, END - 0.4, END)));
    }
    if (ph > 0.001) { await S.dev.at(ft); S.dev.pose(t, { x: P.x, y: P.y, s: P.s, rx: 0, o: ph }); } else S.dev.pose(t, { o: 0 });
    S.cover.style.opacity = t >= PEEL && t < BACK ? 1 : 0;

    // ── the wave ──
    const live = t >= PEEL && t < HOLD + 0.2;
    if (live) {
      const flow = (t - PEEL) * 150;
      const w = (s, amp, ph2) => Math.sin(6.283 * (1.4 * s - (t - PEEL) * 0.22) + ph2) * amp;
      const B = (a, b) => sm(t, a, b);
      const st = (k) => J0 + k * SD;
      // blends between shapes
      const toRing = B(st(1) - 0.4, st(1) + 0.6) * (1 - B(st(2) - 0.4, st(2) + 0.6));
      const split = B(st(2) - 0.4, st(2) + 0.6) * (1 - B(st(4) + 0.2, st(4) + 1.6));
      const flat = B(st(5) - 0.3, st(5) + 0.8);
      const voice = B(VOICE + 0.2, VOICE + 1.8);
      const back = B(BACK, HOLD);
      const ampMain = lerp(110, 10, flat) * (1 + B(st(4), st(4) + 1.2) * 0.4 * (1 - flat));
      const scanX = 540;
      const [ex, ey] = onStage(ZOOM, 360, 110);

      // the scanner (read): one vertical line of light
      const scan = inout(t, st(0), st(1) - 0.5, 0.6, 0.5);
      if (scan > 0) { const lg = g.createLinearGradient(scanX - 40, 0, scanX + 40, 0); lg.addColorStop(0, 'rgba(255,255,255,0)'); lg.addColorStop(0.5, `rgba(${WARM},${0.55 * scan})`); lg.addColorStop(1, 'rgba(255,255,255,0)');
        g.fillStyle = lg; g.fillRect(scanX - 40, 0, 80, 1920); g.fillStyle = `rgba(255,255,255,${0.9 * scan})`; g.fillRect(scanX - 1, 0, 2, 1920); }
      // the sky: thin orbits and seven lights
      if (toRing > 0.01) {
        g.strokeStyle = `rgba(255,255,255,${0.12 * toRing})`; g.lineWidth = 1;
        [120, 200, 280].forEach((r) => { g.beginPath(); g.arc(540, 900, r, 0, 6.283); g.stroke(); });
        for (let k = 0; k < 7; k++) { const on = prog(t, st(1) + 0.3 + k * 0.15, st(1) + 0.6 + k * 0.15); const a = k * 0.9 + 0.4, r = [120, 200, 280][k % 3];
          g.fillStyle = `rgba(${WARM},${on * toRing})`; g.beginPath(); g.arc(540 + Math.cos(a) * r, 900 + Math.sin(a) * r, k === 0 ? 10 : 6, 0, 6.283); g.fill(); }
      }
      // memory: older waves drift in and join
      const mem = inout(t, st(3) - 0.2, st(4) + 0.8, 0.8, 0.8);
      if (mem > 0.01) {
        g.font = 'italic 500 34px Cormorant'; g.textAlign = 'center'; g.textBaseline = 'middle';
        S.ghosts.forEach((txt, k) => {
          const join = sm(t, st(3) + 0.4 + k * 0.2, st(4) + 0.6);
          const chars = [...txt];
          chars.forEach((ch, i) => {
            const s = (i / chars.length) * 0.5 + k * 0.12;
            const x = ((s * 1400 + flow * 0.8) % 1600) - 260, side = k % 2 ? 1 : -1;
            const y = lerp(960 + side * (520 + k * 60), 960 + (k - 1.5) * 180, join) + w(s, 40, k);
            g.fillStyle = `rgba(200,190,255,${0.5 * mem})`; g.fillText(ch, x, y);
          });
        });
      }

      // the letters
      g.textAlign = 'center'; g.textBaseline = 'middle';
      const n = S.chars.length;
      for (const c of S.chars) {
        const s = c.s;
        // the main wave: flowing right to left across the frame
        let x = ((s * 1600 - flow) % 1600 + 1600) % 1600 - 260;
        let y = 960 + w(s, ampMain, 0);
        // the orbit
        if (toRing > 0) { const a = 6.283 * s + (t - st(1)) * 0.6, r = 280 + w(s, 20, 1); x = lerp(x, 540 + Math.cos(a) * r, toRing); y = lerp(y, 900 + Math.sin(a) * r, toRing); }
        // four strands, each in its own script
        if (split > 0) y = lerp(y, 960 + (c.j - 1.5) * 190 + w(s, 60, c.j * 1.3), split);
        // the peel: letters lift off the sent bubble and unroll into the wave
        const peel = Math.min(1, Math.max(0, (t - PEEL) * 1.1 - s * 1.6));
        if (peel < 1) {
          const bi = c.k % Q.length;
          const [bx, by] = onStage(ZOOM, ...S.bub(bi));
          const e2 = ease.inOutCubic(peel);
          x = lerp(bx, x, e2); y = lerp(by, y, e2) - Math.sin(e2 * Math.PI) * 160;
          if (!c.first && peel <= 0) continue;
        }
        // the voice: letters gather into the reply
        let ch = split > 0.5 && c.j > 0 ? c.alt : c.ch, font = `${split > 0.5 && c.j > 0 ? 36 : 34}px ${split > 0.5 ? SFONT[c.j] : 'Inter'}`;
        let a = 1, col = '255,255,255';
        if (scan > 0 && x < scanX) col = WARM;
        if (flat > 0.5 && t < VOICE + 0.4) col = WARM;
        if (voice > 0) {
          const tgt = S.replyPos[c.k];
          if (tgt) { x = lerp(x, tgt.x, voice); y = lerp(y, tgt.y, voice); if (voice > 0.55) { ch = tgt.ch; font = `italic 500 ${lerp(34, 96, ease.outCubic(prog(voice, 0.55, 1)))}px Cormorant`; } col = '255,255,255'; }
          else a = 1 - voice;
        }
        // back into the phone, landing on the reply's first line
        if (back > 0 && S.replyPos[c.k]) { const [tx, ty] = onStage(N, 60 + (c.k / S.replyPos.length) * 420, 190); x = lerp(x, tx, back); y = lerp(y, ty, back); a *= 1 - prog(back, 0.75, 1); font = font.replace(/[\d.]+px/, `${lerp(96, 22, back)}px`); }
        if (a <= 0.01) continue;
        g.globalAlpha = a; g.fillStyle = `rgb(${col})`; g.font = (font.startsWith('italic') ? '' : '600 ') + font;
        if (col === WARM) { g.shadowColor = `rgba(${WARM},0.8)`; g.shadowBlur = 14; } else g.shadowBlur = 0;
        g.fillText(ch, x, y);
      }
      g.globalAlpha = 1; g.shadowBlur = 0;
      // timing: one pulse on the flat line
      const pulse = inout(t, st(5) + 0.9, VOICE, 0.3, 0.4);
      if (pulse > 0) { const pr = (t - st(5) - 0.9) % 1.0; g.strokeStyle = `rgba(${WARM},${(1 - pr) * pulse})`; g.lineWidth = 2; g.beginPath(); g.arc(540, 960, 12 + pr * 90, 0, 6.283); g.stroke();
        g.fillStyle = `rgba(${WARM},${pulse})`; g.beginPath(); g.arc(540, 960, 9, 0, 6.283); g.fill(); }
    }

    // ── words on screen ──
    S.title.style.opacity = inout(t, 0.3, SENT + 0.4, 0.6, 0.5);
    const k = Math.floor((t - J0) / SD), ki = Math.min(k, STEPS.length - 1);
    const inJ = t >= J0 && t < BACK;
    if (inJ) {
      const a = J0 + ki * SD, b = ki === STEPS.length - 1 ? BACK - 0.3 : a + SD - 0.3;
      S.labelK.textContent = `${String(ki + 1).padStart(2, '0')} — ${STEPS[ki][0]}`; S.labelL.textContent = STEPS[ki][1];
      S.label.style.opacity = inout(t, a + 0.2, b, 0.5, 0.3);
      S.label.style.transform = `translateY(${(1 - ease.outCubic(prog(t, a + 0.2, a + 0.8))) * 20}px)`;
    } else S.label.style.opacity = 0;
    S.date.style.opacity = inout(t, J0 + 5 * SD + 1.2, VOICE - 0.2, 0.5, 0.3);
    S.ans.style.opacity = inout(t, HOLD - 0.2, END - 0.4, 0.6, 0.4);
    S.honest(t >= HOLD - 0.2 && t < END ? ease.outCubic(prog(t, HOLD - 0.2, HOLD + 0.3)) : 0);

    // ── the end ──
    const te = t - END;
    S.end.style.opacity = te >= 0 ? ease.outCubic(prog(te, 0, 0.5)) : 0;
    [[S.endA, 0.2], [S.endW, 1.1], [S.endC, 1.7]].forEach(([e, a]) => { const p = ease.outCubic(prog(te, a, a + 0.9)); e.style.opacity = p; e.style.transform = `translateY(${(1 - p) * 24}px)`; e.style.filter = `blur(${(1 - p) * 8}px)`; });
  },
};
