/**
 * THE SCORE — a trailer soundtrack synthesised in the browser's own audio
 * engine (OfflineAudioContext) from a list of cues each film writes beside
 * its pictures, off the same clock, so every hit lands on the frame it
 * belongs to. No samples and no licences: kick, 808, snare, clap, hats, toms,
 * impacts, braams, risers, whooshes, pads, rain, an engine and the three-note
 * sting every film ends on — all oscillators and noise.
 *
 *   cues: [{ i: 'boom', t: 9 }, { i: 'groove', t: 9, bars: 2 }, …]
 *
 * Rendering is deterministic: the noise is seeded, so a film always gets the
 * same track.
 */
import { rng } from './lib.js';

export const SR = 48000;
export const BPM = 100;
/** MIDI note → Hz. */
export const hz = (n) => 440 * Math.pow(2, (n - 69) / 12);

export async function render(cues, duration) {
  const ctx = new OfflineAudioContext({ numberOfChannels: 2, length: Math.ceil(duration * SR), sampleRate: SR });
  const kit = new Kit(ctx);
  for (const c of cues) {
    if (!kit[c.i]) throw new Error(`score: no instrument "${c.i}"`);
    kit[c.i](c);
  }
  return ctx.startRendering();
}

/** 16-bit stereo WAV, peak-normalised to -1 dBFS, as base64 (for the renderer). */
export function wavBase64(buf) {
  const n = buf.length, L = buf.getChannelData(0), R = buf.getChannelData(1);
  let peak = 1e-9;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const k = 0.891 / peak;
  const out = new DataView(new ArrayBuffer(44 + n * 4));
  const str = (o, s) => [...s].forEach((c, i) => out.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); out.setUint32(4, 36 + n * 4, true); str(8, 'WAVE'); str(12, 'fmt ');
  out.setUint32(16, 16, true); out.setUint16(20, 1, true); out.setUint16(22, 2, true); out.setUint32(24, SR, true);
  out.setUint32(28, SR * 4, true); out.setUint16(32, 4, true); out.setUint16(34, 16, true); str(36, 'data'); out.setUint32(40, n * 4, true);
  for (let i = 0, o = 44; i < n; i++, o += 4) {
    out.setInt16(o, Math.max(-32767, Math.min(32767, L[i] * k * 32767)), true);
    out.setInt16(o + 2, Math.max(-32767, Math.min(32767, R[i] * k * 32767)), true);
  }
  const bytes = new Uint8Array(out.buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

// ── building blocks ────────────────────────────────────────────────────────
function curve(drive) {
  const c = new Float32Array(4096), d = Math.tanh(drive);
  for (let i = 0; i < c.length; i++) { const x = (i / (c.length - 1)) * 2 - 1; c[i] = Math.tanh(drive * x) / d; }
  return c;
}

class Kit {
  constructor(ctx) {
    this.ctx = ctx;
    this.R = rng(4242);
    const R = rng(7);
    this.noiseBuf = ctx.createBuffer(1, SR * 3, SR);
    const nd = this.noiseBuf.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = R() * 2 - 1;

    // Master: glue compression, then a soft clip that is the limiter.
    this.out = this.gain(0.72);
    this.out.connect(this.comp({ threshold: -16, ratio: 3, attack: 0.012, release: 0.25, knee: 10 })).connect(this.shaper(1.4)).connect(ctx.destination);
    // Drums: driven, then squashed — the chunk.
    this.drums = this.gain(0.85);
    this.drums.connect(this.shaper(2.4)).connect(this.comp({ threshold: -22, ratio: 6, attack: 0.006, release: 0.1, knee: 4 })).connect(this.gain(1.25)).connect(this.out);
    // Sub: 808s and booms, saturated so a phone speaker can hear them too.
    this.sub = this.gain(0.9);
    this.sub.connect(this.shaper(3)).connect(this.filt('lowpass', 4200, 0.7)).connect(this.out);
    // A big dark room.
    this.verb = ctx.createConvolver();
    this.verb.buffer = this.ir(2.8);
    this.verb.connect(this.filt('lowpass', 5200, 0.5)).connect(this.gain(0.42)).connect(this.out);
  }

  // nodes
  gain(v = 1) { const g = this.ctx.createGain(); g.gain.value = v; return g; }
  filt(type, f, q = 0.7) { const b = this.ctx.createBiquadFilter(); b.type = type; b.frequency.value = f; b.Q.value = q; return b; }
  shaper(drive) { const s = this.ctx.createWaveShaper(); s.curve = curve(drive); s.oversample = '4x'; return s; }
  comp(o) { const c = this.ctx.createDynamicsCompressor(); for (const k in o) c[k].value = o[k]; return c; }
  pan(p) { const s = this.ctx.createStereoPanner(); s.pan.value = p; return s; }
  osc(type, f, t, end) { const o = this.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t); o.start(t); o.stop(end); return o; }
  noise(t, end) { const s = this.ctx.createBufferSource(); s.buffer = this.noiseBuf; s.loop = true; s.start(t, this.R() * 2.5); s.stop(end); return s; }
  /** An envelope: 0 → peak in a, hold, exponential decay over d. */
  env(t, { a = 0.002, peak = 1, hold = 0, d = 0.3 } = {}) {
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + a);
    if (hold) g.gain.setValueAtTime(peak, t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + d);
    return g;
  }
  send(node, amt) { node.connect(this.gain(amt)).connect(this.verb); }
  ir(sec) {
    const b = this.ctx.createBuffer(2, Math.floor(sec * SR), SR), R = rng(31);
    for (let ch = 0; ch < 2; ch++) {
      const d = b.getChannelData(ch);
      let lp = 0;
      for (let i = 0; i < d.length; i++) {
        const x = i / SR;
        lp += ((R() * 2 - 1) - lp) * (0.9 - 0.6 * (x / sec));   // darker as it decays
        d[i] = lp * Math.pow(1 - x / sec, 2.2) * (x < 0.012 ? x / 0.012 : 1);
      }
    }
    return b;
  }

  /** Dead air: the whole mix drops out from t to end — the breath before a drop. */
  silence({ t, end }) {
    const g = this.out.gain, v = g.value;
    g.setValueAtTime(v, t); g.linearRampToValueAtTime(0, t + 0.025);
    g.setValueAtTime(0, end - 0.01); g.linearRampToValueAtTime(v, end);
  }

  // ── drums ────────────────────────────────────────────────────────────────
  kick({ t, g = 1 }) {
    const o = this.osc('sine', 190, t, t + 0.7);
    o.frequency.exponentialRampToValueAtTime(52, t + 0.06);
    o.frequency.exponentialRampToValueAtTime(41, t + 0.4);
    o.connect(this.env(t, { peak: g, d: 0.55 })).connect(this.drums);
    this.noise(t, t + 0.03).connect(this.filt('highpass', 2800)).connect(this.env(t, { peak: 0.4 * g, d: 0.018 })).connect(this.drums);
  }
  snare({ t, g = 1, verb = 0.28 }) {
    const body = this.noise(t, t + 0.4).connect(this.filt('bandpass', 1800, 0.9)).connect(this.env(t, { peak: g, d: 0.22 }));
    body.connect(this.drums); this.send(body, verb);
    this.noise(t, t + 0.2).connect(this.filt('highpass', 6000)).connect(this.env(t, { peak: 0.5 * g, d: 0.1 })).connect(this.drums);
    const o = this.osc('triangle', 230, t, t + 0.2); o.frequency.exponentialRampToValueAtTime(165, t + 0.08);
    o.connect(this.env(t, { peak: 0.7 * g, d: 0.1 })).connect(this.drums);
  }
  clap({ t, g = 1 }) {
    const e = this.ctx.createGain();
    e.gain.setValueAtTime(0, t);
    for (const k of [0, 0.011, 0.023]) { e.gain.setValueAtTime(g, t + k); e.gain.exponentialRampToValueAtTime(0.06 * g, t + k + 0.01); }
    e.gain.setValueAtTime(0.8 * g, t + 0.035); e.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
    const c = this.noise(t, t + 0.35).connect(this.filt('bandpass', 1250, 1.3)).connect(e);
    c.connect(this.drums); this.send(c, 0.3);
  }
  hat({ t, g = 0.3, open = false, p = 0 }) {
    this.noise(t, t + 0.4).connect(this.filt('highpass', 7800)).connect(this.env(t, { peak: g, d: open ? 0.26 : 0.042 })).connect(this.pan(p)).connect(this.drums);
  }
  /** A big low drum — taiko when f is low and the room is big. */
  tom({ t, f = 80, g = 1, verb = 0.45, d = 0.9 }) {
    const o = this.osc('sine', f * 1.9, t, t + d + 0.2); o.frequency.exponentialRampToValueAtTime(f, t + 0.07);
    const b = o.connect(this.env(t, { peak: g, d })); b.connect(this.drums); this.send(b, verb);
    const s = this.noise(t, t + 0.15).connect(this.filt('bandpass', f * 5, 1)).connect(this.env(t, { peak: 0.45 * g, d: 0.07 })); s.connect(this.drums); this.send(s, verb);
  }
  heartbeat({ t, g = 0.9 }) {
    [[0, 1], [0.23, 0.7]].forEach(([k, v]) => {
      const o = this.osc('sine', 62, t + k, t + k + 0.4); o.frequency.exponentialRampToValueAtTime(42, t + k + 0.12);
      o.connect(this.env(t + k, { a: 0.006, peak: g * v, d: 0.22 })).connect(this.sub);
    });
  }
  /** An 808: a short pitch drop into a long, saturated sine. */
  bass({ t, n = 38, dur = 0.8, g = 1 }) {
    const f = hz(n), end = t + dur + 0.1;
    const o = this.osc('sine', f * 2.4, t, end); o.frequency.exponentialRampToValueAtTime(f, t + 0.045);
    o.connect(this.env(t, { a: 0.003, peak: g, hold: dur * 0.35, d: dur * 0.65 })).connect(this.sub);
    const h = this.osc('triangle', f * 2, t, end);
    h.connect(this.env(t, { a: 0.003, peak: 0.12 * g, hold: dur * 0.2, d: dur * 0.6 })).connect(this.sub);
  }

  /**
   * A groove: half-time trap-trailer at BPM, `bars` long from t.
   * style: 'full' (kick, 808, snare+clap, hats with rolls), 'half' (no hats),
   * 'sparse' (a downbeat and the snare).
   */
  groove({ t, bars = 2, bpm = BPM, n = 38, g = 1, style = 'full', line = [0, 0, 3, -2] }) {
    const st = 60 / bpm / 4;
    const K = ['x......x..x.....', 'x.....x...x..x..'];
    const S = ['........x.......', '........x.....o.'];
    const Hh = ['x.x.x.x.x.x.x.x.', 'x.x.x.x.x.x.rrrr'];
    for (let b = 0; b < bars; b++) {
      const t0 = t + b * 16 * st, k = K[b % 2], s = S[b % 2], hh = Hh[b % 2];
      const kicks = [...k].map((c, i) => (c === 'x' ? i : -1)).filter((i) => i >= 0);
      kicks.forEach((i, j) => {
        if (style === 'sparse' && i !== 0) return;
        const next = style === 'sparse' ? 16 : (kicks[j + 1] ?? 16);
        this.kick({ t: t0 + i * st, g });
        this.bass({ t: t0 + i * st, n: n + line[(b * 3 + j) % line.length], dur: Math.min(1.6, (next - i) * st * 0.95), g: 0.95 * g });
      });
      [...s].forEach((c, i) => {
        if (c === 'x') { this.snare({ t: t0 + i * st, g: 0.95 * g }); this.clap({ t: t0 + i * st, g: 0.75 * g }); }
        if (c === 'o' && style === 'full') this.snare({ t: t0 + i * st, g: 0.35 * g, verb: 0.1 });
      });
      if (style !== 'full') continue;
      [...hh].forEach((c, i) => {
        if (c === 'x') this.hat({ t: t0 + i * st, g: (i % 4 === 0 ? 0.3 : 0.2) * g, p: i % 8 ? 0.25 : -0.25 });
        if (c === 'r') for (let r = 0; r < 2; r++) this.hat({ t: t0 + i * st + (r * st) / 2, g: (0.14 + 0.03 * (i - 12)) * g, p: 0.3 });
      });
    }
  }
  /** An accelerating snare roll, t → end. */
  roll({ t, end, g = 0.7, from = 4, to = 26 }) {
    for (let x = t; x < end - 0.01;) {
      const p = (x - t) / (end - t);
      this.snare({ t: x, g: g * (0.25 + 0.75 * p * p), verb: 0.15 });
      x += 1 / (from + (to - from) * p * p);
    }
  }

  // ── cinema ───────────────────────────────────────────────────────────────
  /** The trailer impact: a falling sub, a dark body, a crack and a metal ring. */
  boom({ t, g = 1 }) {
    const o = this.osc('sine', 95, t, t + 3.6); o.frequency.exponentialRampToValueAtTime(27, t + 2.2);
    o.connect(this.env(t, { a: 0.004, peak: g, d: 3.2 })).connect(this.sub);
    const b = this.noise(t, t + 2).connect(this.filt('lowpass', 420, 0.8)).connect(this.env(t, { a: 0.003, peak: 0.95 * g, d: 1.3 }));
    b.connect(this.out); this.send(b, 0.7);
    this.noise(t, t + 0.4).connect(this.filt('bandpass', 2300, 0.6)).connect(this.env(t, { peak: 0.5 * g, d: 0.22 })).connect(this.out);
    [1, 1.52, 2.11, 2.73, 3.41].forEach((r, i) => {
      const m = this.osc('sine', 104 * r, t, t + 2.4).connect(this.env(t, { a: 0.003, peak: (0.07 * g) / (1 + i * 0.5), d: 2 }));
      m.connect(this.out); this.send(m, 0.8);
    });
  }
  /** A shorter hit for the beats between booms. */
  hit({ t, g = 0.8 }) {
    this.tom({ t, f: 62, g: g, verb: 0.6, d: 1.1 });
    this.kick({ t, g: 0.8 * g });
    this.noise(t, t + 0.3).connect(this.filt('bandpass', 1500, 0.7)).connect(this.env(t, { peak: 0.35 * g, d: 0.16 })).connect(this.out);
  }
  /** The braam: a wall of detuned low saws, a filter that opens and closes. */
  braam({ t, n = 38, dur = 2, g = 0.7 }) {
    const end = t + dur + 1;
    const lp = this.filt('lowpass', 90, 5);
    lp.frequency.setValueAtTime(90, t); lp.frequency.exponentialRampToValueAtTime(1700, t + 0.14); lp.frequency.exponentialRampToValueAtTime(260, t + dur);
    const e = this.ctx.createGain();
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.03); e.gain.setValueAtTime(g * 0.8, t + dur); e.gain.exponentialRampToValueAtTime(0.0001, end);
    [[-17, -0.7, 0], [-7, -0.3, 0], [0, 0, 0], [6, 0.3, 0], [16, 0.7, 0], [-5, -0.5, -12], [5, 0.5, -12]].forEach(([d, p, o]) => {
      const s = this.osc('sawtooth', hz(n + o), t, end); s.detune.value = d; s.connect(this.pan(p)).connect(lp);
    });
    const w = lp.connect(this.shaper(2.6)).connect(e);
    w.connect(this.out); this.send(w, 0.45);
  }
  /** Noise and a climbing saw, t → end, cut dead at end (the silence before a drop). */
  riser({ t, end, g = 0.55 }) {
    const gate = (peak) => { const e = this.ctx.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(peak, end); e.gain.setValueAtTime(0, end + 0.004); return e; };
    const bp = this.filt('bandpass', 300, 2.5); bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(9000, end);
    const nz = this.noise(t, end + 0.05).connect(bp).connect(gate(g)); nz.connect(this.out); this.send(nz, 0.25);
    const s = this.osc('sawtooth', 160, t, end + 0.05); s.frequency.exponentialRampToValueAtTime(1300, end);
    s.connect(this.filt('lowpass', 2400)).connect(gate(0.22 * g)).connect(this.out);
    const w = this.osc('sine', 110, t, end + 0.05); w.frequency.exponentialRampToValueAtTime(440, end);
    w.connect(gate(0.3 * g)).connect(this.out);
  }
  /** A reversed cymbal swelling into `end`. */
  reverse({ end, dur = 1.2, g = 0.45 }) {
    const e = this.ctx.createGain(); e.gain.setValueAtTime(0.0001, end - dur); e.gain.exponentialRampToValueAtTime(g, end); e.gain.setValueAtTime(0, end + 0.004);
    const n = this.noise(end - dur, end + 0.05).connect(this.filt('highpass', 3200)).connect(e); n.connect(this.out); this.send(n, 0.3);
  }
  whoosh({ t, dur = 0.8, g = 0.45, from = -0.8, to = 0.8 }) {
    const bp = this.filt('bandpass', 300, 1.3);
    bp.frequency.setValueAtTime(300, t); bp.frequency.exponentialRampToValueAtTime(2800, t + dur * 0.5); bp.frequency.exponentialRampToValueAtTime(500, t + dur);
    const e = this.ctx.createGain(); e.gain.setValueAtTime(0.0001, t); e.gain.exponentialRampToValueAtTime(g, t + dur * 0.5); e.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const p = this.ctx.createStereoPanner(); p.pan.setValueAtTime(from, t); p.pan.linearRampToValueAtTime(to, t + dur);
    this.noise(t, t + dur + 0.05).connect(bp).connect(e).connect(p).connect(this.out);
  }
  /** A dark pad: detuned saws and a sub, under a slow filter. ns: MIDI notes. */
  pad({ t, end, ns = [50, 57, 62], g = 0.2, bright = 520, verb = 0.5 }) {
    const lp = this.filt('lowpass', bright, 0.9);
    const lfo = this.osc('sine', 0.13, t, end + 2); lfo.connect(this.gain(bright * 0.35)).connect(lp.frequency);
    const e = this.ctx.createGain(), a = Math.min(2, (end - t) / 3);
    e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + a); e.gain.setValueAtTime(g, end); e.gain.linearRampToValueAtTime(0, end + 1.6);
    ns.forEach((n, i) => [-8, 8].forEach((d, j) => { const s = this.osc('sawtooth', hz(n), t, end + 1.8); s.detune.value = d; s.connect(this.pan((j ? 0.6 : -0.6) * (i ? 1 : 0.4))).connect(lp); }));
    this.osc('sine', hz(ns[0] - 12), t, end + 1.8).connect(this.gain(0.5)).connect(lp);
    const w = lp.connect(e); w.connect(this.out); this.send(w, verb);
  }
  /** A sixteenth-note ostinato that opens up — the tension engine. */
  pulse({ t, end, n = 50, bpm = BPM, g = 0.22, open = [350, 2600] }) {
    const st = 60 / bpm / 4;
    const lp = this.filt('lowpass', open[0], 7); lp.frequency.setValueAtTime(open[0], t); lp.frequency.exponentialRampToValueAtTime(open[1], end);
    const e = this.ctx.createGain(); e.gain.setValueAtTime(0, t);
    for (let x = t, k = 0; x < end - 0.01; x += st, k++) { e.gain.setValueAtTime(0, x); e.gain.linearRampToValueAtTime(g * (k % 4 === 0 ? 1 : 0.62), x + 0.004); e.gain.setTargetAtTime(0, x + 0.006, 0.035); }
    [-6, 6].forEach((d) => { const s = this.osc('sawtooth', hz(n), t, end + 0.3); s.detune.value = d; s.connect(lp); });
    this.osc('square', hz(n - 12), t, end + 0.3).connect(this.gain(0.4)).connect(lp);
    const w = lp.connect(e); w.connect(this.out); this.send(w, 0.18);
  }
  /** A bell: inharmonic partials, long tail, lots of room. */
  bell({ t, n = 74, g = 0.28, dur = 3.2, verb = 0.55 }) {
    [[1, 1], [2, 0.5], [3.01, 0.28], [4.17, 0.18], [5.43, 0.1], [6.8, 0.06]].forEach(([r, v], i) => {
      const b = this.osc('sine', hz(n) * r, t, t + dur + 0.1).connect(this.env(t, { a: 0.002, peak: g * v, d: dur / (1 + i * 0.7) }));
      b.connect(this.out); this.send(b, verb);
    });
  }
  /** A felt-piano note. */
  pluck({ t, n = 62, g = 0.25, dur = 2.2 }) {
    const lp = this.filt('lowpass', 2600, 0.5); lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(500, t + dur);
    this.osc('triangle', hz(n), t, t + dur + 0.1).connect(lp);
    this.osc('sine', hz(n + 12), t, t + dur + 0.1).connect(this.gain(0.3)).connect(lp);
    const w = lp.connect(this.env(t, { a: 0.004, peak: g, d: dur })); w.connect(this.out); this.send(w, 0.6);
  }
  /** Plutto's sting: three bells over a soft low hit. The last sound of every film. */
  sting({ t, g = 0.9 }) {
    this.tom({ t, f: 55, g: 0.7 * g, verb: 0.7, d: 1.6 });
    [[0, 74], [0.16, 81], [0.34, 86]].forEach(([k, n], i) => this.bell({ t: t + k, n, g: (i === 2 ? 0.3 : 0.22) * g, dur: i === 2 ? 4.5 : 2.4 }));
  }

  // ── places ───────────────────────────────────────────────────────────────
  room({ t, end, g = 0.05 }) {
    const e = this.ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.8); e.gain.setValueAtTime(g, end); e.gain.linearRampToValueAtTime(0, end + 0.8);
    this.noise(t, end + 1).connect(this.filt('lowpass', 260)).connect(e).connect(this.out);
  }
  rain({ t, end, g = 0.22, drips = 10 }) {
    [-0.5, 0.5].forEach((p) => {
      const e = this.ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 0.8); e.gain.setValueAtTime(g, end); e.gain.linearRampToValueAtTime(0, end + 0.8);
      this.noise(t, end + 1).connect(this.filt('highpass', 650)).connect(this.filt('lowpass', 6200)).connect(e).connect(this.pan(p)).connect(this.out);
    });
    for (let k = 0, n = Math.floor((end - t) * drips); k < n; k++) {
      const x = t + this.R() * (end - t), f = 1500 + this.R() * 2600;
      const o = this.osc('sine', f, x, x + 0.08); o.frequency.exponentialRampToValueAtTime(f * 0.55, x + 0.035);
      o.connect(this.env(x, { a: 0.001, peak: g * 0.35 * (0.3 + this.R() * 0.7), d: 0.035 })).connect(this.pan(this.R() * 1.6 - 0.8)).connect(this.out);
    }
  }
  engine({ t, end, g = 0.3 }) {
    const e = this.ctx.createGain(); e.gain.setValueAtTime(0, t); e.gain.linearRampToValueAtTime(g, t + 1); e.gain.setValueAtTime(g, end); e.gain.linearRampToValueAtTime(0, end + 1);
    const lp = this.filt('lowpass', 150, 1.5);
    [36, 36.7].forEach((f) => this.osc('sawtooth', f, t, end + 1.1).connect(lp));
    lp.connect(e).connect(this.sub);
    this.noise(t, end + 1.1).connect(this.filt('lowpass', 480)).connect(this.gain(0.5)).connect(e);
  }
  /** A typed key; `del` for a backspace. */
  key({ t, g = 0.22, del = false }) {
    this.noise(t, t + 0.05).connect(this.filt('bandpass', del ? 1900 : 2600 + this.R() * 1600, 3)).connect(this.env(t, { a: 0.001, peak: g, d: 0.025 })).connect(this.out);
    this.osc('sine', del ? 120 : 160, t, t + 0.06).connect(this.env(t, { a: 0.001, peak: g * 0.35, d: 0.03 })).connect(this.out);
  }
}
