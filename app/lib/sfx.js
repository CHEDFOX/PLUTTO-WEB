// Tiny shared Web Audio helper for UI sounds (no asset files needed).
// Browsers block autoplay until a user gesture, so we lazily create the
// AudioContext on first request and also unlock on the first user input.

let ctx = null;
let noiseBuffer = null;
let unlockBound = false;

const getCtx = () => {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
};

const getNoiseBuffer = (c) => {
  if (noiseBuffer && noiseBuffer.sampleRate === c.sampleRate) return noiseBuffer;
  const len = Math.floor(c.sampleRate * 1.2);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    last = last * 0.85 + w * 0.15;
    data[i] = last;
  }
  noiseBuffer = buf;
  return buf;
};

export const unlockAudio = () => {
  if (unlockBound || typeof window === 'undefined') return;
  unlockBound = true;
  const handler = () => {
    getCtx();
    window.removeEventListener('pointerdown', handler);
    window.removeEventListener('keydown', handler);
    window.removeEventListener('touchstart', handler);
  };
  window.addEventListener('pointerdown', handler, { once: true });
  window.addEventListener('keydown', handler, { once: true });
  window.addEventListener('touchstart', handler, { once: true });
};

/**
 * Whoosh / swoosh — band-passed noise sweep, ~700ms.
 * Good for scroll transitions and section reveals.
 */
export const playSwoosh = (opts) => {
  const c = getCtx();
  if (!c) return;
  const duration = opts?.duration ?? 0.85;
  const peak = opts?.gain ?? 0.18;
  const now = c.currentTime;

  const src = c.createBufferSource();
  src.buffer = getNoiseBuffer(c);
  const offset = Math.random() * Math.max(0, src.buffer.duration - duration - 0.05);

  const filter = c.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(280, now);
  filter.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.7);
  filter.frequency.exponentialRampToValueAtTime(900, now + duration);

  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  src.connect(filter).connect(gain).connect(c.destination);
  src.start(now, offset);
  src.stop(now + duration + 0.05);
};
