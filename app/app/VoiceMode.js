'use client';

/**
 * VOICE MODE — a live conversation with the Oracle, over WebRTC.
 *
 * Same shape as the app's realtime mode: the server mints a short-lived token
 * (the real key never reaches the browser), we open a peer connection with the
 * mic attached and a data channel for events, exchange SDP with OpenAI, and
 * play the returned audio track. Server-side VAD does turn-taking and barge-in,
 * so the user can simply interrupt.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { realtimeSession, realtimeSupported, OAI_CALLS_URL } from '../lib/voice';

const ST = {
  CONNECTING: 'connecting',
  LISTENING: 'listening',
  SPEAKING: 'speaking',
  ERROR: 'error',
};

const COPY = {
  [ST.CONNECTING]: 'Opening the line…',
  [ST.LISTENING]: 'Listening — just talk',
  [ST.SPEAKING]: 'Speaking',
  [ST.ERROR]: 'The stars are quiet. Try again.',
};

export default function VoiceMode({ kundli, language = 'en', onClose }) {
  const [state, setState] = useState(ST.CONNECTING);
  const [level, setLevel] = useState(0);
  const pcRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);
  const liveRef = useRef(true);

  // Idempotent: React's effect cleanup and the End button can both fire. Every
  // handle is nulled after release, and AudioContext.close() is a PROMISE — a
  // try/catch never sees its rejection, so it needs .catch().
  const teardown = useCallback(() => {
    liveRef.current = false;
    cancelAnimationFrame(rafRef.current);
    const ctx = ctxRef.current;
    ctxRef.current = null;
    if (ctx && ctx.state !== 'closed') { try { ctx.close()?.catch?.(() => {}); } catch {} }
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    try { pcRef.current?.close(); } catch {}
    pcRef.current = null;
    streamRef.current = null;
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  useEffect(() => {
    liveRef.current = true;
    (async () => {
      if (!realtimeSupported()) { setState(ST.ERROR); return; }
      try {
        // 1. token from our server
        const sj = await realtimeSession({ kundli, language });
        if (!liveRef.current) return;

        // 2. peer connection + mic
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        const remote = new MediaStream();
        pc.ontrack = (e) => {
          e.streams[0]?.getAudioTracks().forEach((t) => remote.addTrack(t));
          if (audioRef.current) {
            audioRef.current.srcObject = remote;
            audioRef.current.play().catch(() => {});
          }
        };

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!liveRef.current) { stream.getTracks().forEach((t) => t.stop()); return; }
        streamRef.current = stream;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        // A simple level meter, so the user can see they are being heard.
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          ctxRef.current = ctx;
          const src = ctx.createMediaStreamSource(stream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 512;
          src.connect(analyser);
          const buf = new Uint8Array(analyser.frequencyBinCount);
          const tick = () => {
            analyser.getByteTimeDomainData(buf);
            let peak = 0;
            for (const v of buf) peak = Math.max(peak, Math.abs(v - 128));
            setLevel(Math.min(1, peak / 40));
            rafRef.current = requestAnimationFrame(tick);
          };
          tick();
        } catch { /* meter is decorative — never block the call for it */ }

        // 3. events channel. Ask for the first response so the Oracle opens,
        //    which also covers the connect latency.
        const dc = pc.createDataChannel('oai-events');
        dc.addEventListener('open', () => {
          try { dc.send(JSON.stringify({ type: 'response.create' })); } catch {}
        });
        dc.addEventListener('message', (e) => {
          let evt;
          try { evt = JSON.parse(e.data); } catch { return; }
          const t = evt?.type || '';
          if (t.startsWith('response.audio.delta') || t === 'response.created') setState(ST.SPEAKING);
          else if (t === 'response.done' || t === 'input_audio_buffer.speech_started') setState(ST.LISTENING);
        });

        // 4. SDP offer → OpenAI → answer
        const offer = await pc.createOffer({});
        await pc.setLocalDescription(offer);
        const ans = await fetch(`${OAI_CALLS_URL}?model=${encodeURIComponent(sj.model)}`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${sj.token}`, 'Content-Type': 'application/sdp' },
          body: offer.sdp,
        });
        const answerSdp = await ans.text();
        if (!ans.ok) throw new Error(`sdp ${ans.status}`);
        if (!liveRef.current) return;
        await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
        setState(ST.LISTENING);
      } catch {
        if (liveRef.current) setState(ST.ERROR);
      }
    })();
    return () => teardown();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const close = () => { teardown(); onClose?.(); };

  const ring = 1 + (state === ST.LISTENING ? level * 0.35 : state === ST.SPEAKING ? 0.18 : 0);

  return (
    <div className="fixed inset-0 z-[80] bg-void/97 backdrop-blur-sm flex flex-col items-center justify-center px-6">
      {/* the remote voice */}
      <audio ref={audioRef} autoPlay />

      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
        <span
          className="absolute rounded-full border border-gold/40 transition-transform duration-100"
          style={{ width: 200, height: 200, transform: `scale(${ring})` }}
        />
        <span
          className={`absolute rounded-full bg-gold/10 ${
            state === ST.SPEAKING ? 'animate-pulse' : ''
          }`}
          style={{ width: 132, height: 132 }}
        />
        <span className="font-serif text-2xl font-light text-white">Plutto</span>
      </div>

      <p className="mt-12 text-[10px] uppercase tracking-[0.32em] text-white/45">
        {COPY[state]}
      </p>

      {state === ST.ERROR && (
        <p className="mt-4 max-w-sm text-center text-[12px] leading-relaxed text-white/35">
          Voice needs microphone permission and a secure connection. Check that
          Plutto is allowed to use your mic, then try again.
        </p>
      )}

      <button
        onClick={close}
        className="mt-14 rounded-full border border-mist px-10 py-3.5 text-[10px]
                   uppercase tracking-[0.32em] text-white/70 hover:border-white/40
                   hover:text-white transition-colors"
      >
        End
      </button>
    </div>
  );
}
