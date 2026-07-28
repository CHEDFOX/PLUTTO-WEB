/**
 * VOICE — read-aloud (TTS), microphone dictation (Whisper), and the realtime
 * session token, all against the same endpoints the mobile app uses.
 *
 * Browser realities this file exists to absorb:
 *  • getUserMedia needs a secure context (https, or localhost) — otherwise the
 *    mic simply doesn't exist and we must say so rather than hang.
 *  • MediaRecorder's container differs by browser (Chrome/Firefox → webm/opus,
 *    Safari → mp4/aac). Whisper sniffs the content, but the FILENAME extension
 *    has to match or the upload is rejected, so we derive it from the mime type.
 *  • Audio playback must be started from a user gesture; every entry point here
 *    is behind a click.
 */

import { API_BASE } from './api';

const api = (p) => `${API_BASE}/api/public${p}`;

/* ─────────────────────────── capability ─────────────────────────── */

export function micSupported() {
  if (typeof window === 'undefined') return false;
  const secure = window.isSecureContext || location.hostname === 'localhost';
  return !!(secure && navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
}

export function realtimeSupported() {
  return typeof window !== 'undefined' && !!window.RTCPeerConnection && micSupported();
}

/* ─────────────────────────── read aloud ─────────────────────────── */

let _current = null;

/** Stop whatever is currently being read aloud. */
export function stopSpeaking() {
  if (_current) {
    try { _current.pause(); } catch {}
    _current = null;
  }
}

/**
 * Read `text` aloud in the Oracle's voice. Resolves when playback ends (or is
 * stopped). Only one thing speaks at a time — starting a new one cuts the old.
 */
export async function speak(text, { system = 'plutto', signal } = {}) {
  stopSpeaking();
  const r = await fetch(api('/tts'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: String(text).slice(0, 5000), system }),
    signal,
  });
  if (!r.ok) throw new Error(`tts ${r.status}`);
  const { audio, format } = await r.json();
  if (!audio) throw new Error('no audio');

  const el = new Audio(`data:audio/${format || 'mp3'};base64,${audio}`);
  _current = el;
  await new Promise((resolve, reject) => {
    el.onended = resolve;
    el.onerror = () => reject(new Error('playback failed'));
    el.play().catch(reject);
  }).finally(() => { if (_current === el) _current = null; });
}

/* ─────────────────────────── dictation ─────────────────────────── */

const MIME_EXT = [
  ['audio/webm;codecs=opus', 'webm'],
  ['audio/webm', 'webm'],
  ['audio/mp4', 'mp4'],
  ['audio/ogg;codecs=opus', 'ogg'],
];

function pickMime() {
  if (typeof MediaRecorder === 'undefined') return ['', 'webm'];
  for (const [mime, ext] of MIME_EXT) {
    if (MediaRecorder.isTypeSupported?.(mime)) return [mime, ext];
  }
  return ['', 'webm'];
}

/**
 * Start recording the microphone. Returns a handle:
 *   stop()   → the transcribed text ('' if nothing was said)
 *   cancel() → discard, release the mic
 *   stream   → the live MediaStream, for a level meter
 */
export async function startDictation({ language = 'en' } = {}) {
  if (!micSupported()) throw new Error('mic-unavailable');
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const [mime, ext] = pickMime();
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks = [];
  rec.ondataavailable = (e) => { if (e.data?.size) chunks.push(e.data); };
  rec.start();

  const release = () => stream.getTracks().forEach((t) => t.stop());

  return {
    stream,
    cancel() {
      try { if (rec.state !== 'inactive') rec.stop(); } catch {}
      release();
    },
    async stop() {
      await new Promise((res) => {
        rec.onstop = res;
        try { rec.state !== 'inactive' ? rec.stop() : res(); } catch { res(); }
      });
      release();
      if (!chunks.length) return '';
      const blob = new Blob(chunks, { type: mime || 'audio/webm' });
      const fd = new FormData();
      fd.append('file', blob, `speech.${ext}`);
      if (language) fd.append('language', language);
      const r = await fetch(api('/whisper/transcribe'), { method: 'POST', body: fd });
      if (!r.ok) throw new Error(`transcribe ${r.status}`);
      const d = await r.json();
      return (d?.text || d?.transcript || '').trim();
    },
  };
}

/* ─────────────────────────── realtime session ─────────────────────────── */

/** Mint a short-lived realtime token. The real API key never reaches the browser. */
export async function realtimeSession({ kundli, system = 'plutto', language = 'en' }) {
  const r = await fetch(api('/realtime/session'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kundli_data: kundli,
      birth_data: kundli?.raw?.birth_details,
      system,
      language,
    }),
  });
  if (!r.ok) throw new Error(`session ${r.status}`);
  const d = await r.json();
  if (!d?.token) throw new Error(d?.detail || 'no token');
  return d;
}

export const OAI_CALLS_URL = 'https://api.openai.com/v1/realtime/calls';
