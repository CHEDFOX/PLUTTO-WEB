'use client';

import { useEffect, useRef, useState } from 'react';
import { streamChat } from '../lib/api';
import { conversationId } from '../lib/store';
import { detectPlatform, storeUrl } from '../lib/appStore';
import VoiceMode from './VoiceMode';
import {
  speak, stopSpeaking, startDictation, micSupported, realtimeSupported,
} from '../lib/voice';

const OPENERS = [
  'What is this year really asking of me?',
  'Where should I be living?',
  'When does the pressure ease?',
  'What do I keep repeating?',
];

export default function Oracle({ kundli, name, store }) {
  // Feature hooks open the app on web, so we need to know which store.
  const [platform, setPlatform] = useState('desktop');
  useEffect(() => setPlatform(detectPlatform()), []);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scroller = useRef(null);
  const abort = useRef(null);

  // voice: live mode, read-aloud, and mic dictation
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [speakingIdx, setSpeakingIdx] = useState(null);
  const [recording, setRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const dictation = useRef(null);
  const canMic = micSupported();
  const canVoice = realtimeSupported();

  useEffect(() => () => { stopSpeaking(); dictation.current?.cancel(); }, []);

  // Read one reply aloud in the Oracle's voice; tapping again stops it.
  const readAloud = async (i, text) => {
    if (speakingIdx === i) { stopSpeaking(); setSpeakingIdx(null); return; }
    stopSpeaking();
    setSpeakingIdx(i);
    try {
      await speak(text);
    } catch {
      setVoiceNote('Could not read that aloud just now.');
    } finally {
      setSpeakingIdx((c) => (c === i ? null : c));
    }
  };

  // Hold-free dictation: tap to start, tap to stop and send the transcript.
  const toggleMic = async () => {
    setVoiceNote('');
    if (recording) {
      const d = dictation.current;
      dictation.current = null;
      setRecording(false);
      try {
        const text = await d?.stop();
        if (text) ask(text);
        else setVoiceNote('I did not catch that.');
      } catch {
        setVoiceNote('Could not transcribe that.');
      }
      return;
    }
    try {
      dictation.current = await startDictation({});
      setRecording(true);
    } catch (e) {
      setVoiceNote(
        e?.message === 'mic-unavailable'
          ? 'Your browser will not give this page a microphone (it needs a secure connection).'
          : 'Microphone permission is needed to speak.'
      );
    }
  };

  useEffect(() => () => abort.current?.abort(), []);

  useEffect(() => {
    // Keep the newest text in view as it streams in.
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const ask = async (text) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setError('');
    setInput('');
    const history = messages;
    setMessages((m) => [...m, { role: 'user', content: q }, { role: 'assistant', content: '' }]);
    setBusy(true);

    abort.current = new AbortController();
    try {
      const { hooks } = await streamChat(
        {
          message: q,
          kundli,
          history,
          conversationId: conversationId(),
        },
        (delta) => {
          setMessages((m) => {
            const next = [...m];
            next[next.length - 1] = {
              role: 'assistant',
              content: next[next.length - 1].content + delta,
            };
            return next;
          });
        },
        { signal: abort.current.signal }
      );
      // The oracle often ends by offering a feature ("Your timing ›"). The app
      // opens it inline; on the web that feature lives in the app, so the hook
      // becomes the invitation to go there — dropping it silently would waste
      // the one moment the user is most curious.
      if (hooks?.length) {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { ...next[next.length - 1], hooks };
          return next;
        });
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        setError('The oracle went quiet. Try again in a moment.');
        // drop the empty assistant bubble
        setMessages((m) => (m[m.length - 1]?.content ? m : m.slice(0, -1)));
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scroller} className="flex-1 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="pt-4">
            <p className="text-sm leading-relaxed text-white/45">
              {name ? `${name}, ask` : 'Ask'} anything — it answers from your
              chart, not from a horoscope.
            </p>
            <div className="mt-6 space-y-2">
              {OPENERS.map((o) => (
                <button key={o} onClick={() => ask(o)}
                  className="block w-full text-left px-4 py-3 rounded-lg border border-mist
                             text-sm text-white/60 hover:text-white hover:border-gold/40
                             transition-colors">
                  {o}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            {messages.map((m, i) => (
              <div key={i}>
                {m.role === 'user' ? (
                  <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70 mb-2">
                    You
                  </p>
                ) : (
                  <p className="text-[10px] uppercase tracking-[0.32em] text-white/30 mb-2">
                    Plutto
                  </p>
                )}
                <div
                  className={
                    m.role === 'user'
                      ? 'text-sm leading-relaxed text-white/80'
                      : 'font-serif text-[17px] leading-[1.7] text-white/90 whitespace-pre-wrap'
                  }
                >
                  {m.content}
                  {m.role === 'assistant' && !m.content && busy && (
                    <span className="inline-block w-2 h-2 rounded-full bg-gold/70 animate-pulse" />
                  )}
                </div>

                {m.role === 'assistant' && m.content && (
                  <button
                    onClick={() => readAloud(i, m.content)}
                    className="mt-3 text-[10px] uppercase tracking-[0.28em] text-white/30
                               hover:text-gold transition-colors"
                  >
                    {speakingIdx === i ? '■ Stop' : '▶ Read aloud'}
                  </button>
                )}

                {m.hooks?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {m.hooks.map((h, hi) => (
                      <a
                        key={hi}
                        href={storeUrl(platform, store)}
                        target={platform === 'desktop' ? '_blank' : undefined}
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-white/30
                                   px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80
                                   hover:bg-white hover:text-black transition-colors"
                      >
                        {h.label} <span aria-hidden>›</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {error && <p className="py-3 text-sm text-red-300/80">{error}</p>}
        {voiceNote && <p className="py-2 text-[12px] leading-relaxed text-white/40">{voiceNote}</p>}
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); ask(); }}
        className="mt-4 flex items-center gap-3 border-t border-mist pt-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the oracle…"
          className="flex-1 bg-transparent outline-none py-2 text-sm text-white
                     placeholder:text-white/25"
        />
        {canMic && (
          <button
            type="button"
            onClick={toggleMic}
            title={recording ? 'Stop and send' : 'Speak your question'}
            className={`shrink-0 h-9 w-9 rounded-full border transition-colors ${
              recording
                ? 'border-gold bg-gold/20 text-gold animate-pulse'
                : 'border-mist text-white/45 hover:text-white hover:border-white/40'
            }`}
          >
            ●
          </button>
        )}

        {canVoice && (
          <button
            type="button"
            onClick={() => setVoiceOpen(true)}
            title="Talk to the Oracle live"
            className="shrink-0 rounded-full border border-white/25 px-4 py-2 text-[10px]
                       uppercase tracking-[0.22em] text-white/70 hover:border-white/50
                       hover:text-white transition-colors"
          >
            Voice
          </button>
        )}

        <button
          type="submit"
          disabled={!input.trim() || busy}
          className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.28em] transition-all ${
            input.trim() && !busy
              ? 'bg-white text-black hover:brightness-110'
              : 'border border-mist text-white/25'
          }`}
        >
          {busy ? '…' : 'Ask'}
        </button>
      </form>

      {voiceOpen && (
        <VoiceMode kundli={kundli} onClose={() => setVoiceOpen(false)} />
      )}
    </div>
  );
}
