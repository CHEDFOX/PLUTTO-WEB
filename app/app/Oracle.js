'use client';

import { useEffect, useRef, useState } from 'react';
import { streamChat } from '../lib/api';
import { conversationId } from '../lib/store';
import { detectPlatform, storeUrl } from '../lib/appStore';
import { sectionForHook, openableOnWeb } from '../lib/hooks';
import { mediaUrl, resolveMedia } from '../lib/media';
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

/**
 * FREE-TIER GATE CARD — shown in place of a reading once the day's free readings
 * are spent. Every word, the hero and the button label come from the backend
 * (catalog.chat.gate), the same block the mobile card reads, so the offer stays
 * identical on both and a copy change ships to both at once.
 */
function GateCard({ gate, text, onUpgrade }) {
  const g = gate || {};
  const [url, setUrl] = useState(() => mediaUrl(g.media));
  useEffect(() => {
    let live = true;
    if (!url && g.media) resolveMedia(g.media).then((u) => live && setUrl(u));
    return () => { live = false; };
  }, [g.media, url]);

  return (
    <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-black/40">
      {url && (
        <div className="relative h-28 w-full overflow-hidden">
          <img src={url} alt="" className="h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${g.tint != null ? g.tint : 0.45})` }}
          />
        </div>
      )}
      <div className="p-5">
        <p className="font-serif text-[17px] italic leading-snug text-white/90">
          {/* The server's message is the fallback, so a client that has the card and
              a client that does not still say the same thing. */}
          {g.title || text}
        </p>
        {g.subtitle && (
          <p className="mt-2 text-[12px] leading-relaxed text-white/50">{g.subtitle}</p>
        )}
        <button
          onClick={onUpgrade}
          className="mt-5 rounded-full border border-gold/60 px-5 py-2 text-[10px]
                     uppercase tracking-[0.28em] text-gold transition-colors
                     hover:bg-gold hover:text-black"
        >
          {g.button?.label || 'Unlock Plutto'}
        </button>
      </div>
    </div>
  );
}

export default function Oracle({ kundli, name, store, catalog, onOpenSection, onUpgrade }) {
  // A hook the web cannot render falls back to the store, so we still need to
  // know which one this visitor should be sent to.
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
      const { hooks, gate } = await streamChat(
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
      // The free daily allowance is spent: this "reply" is the upgrade message,
      // not a reading. Mark the bubble so it renders as the offer with a way to
      // subscribe — the text alone reads as ordinary Oracle prose and leads
      // nowhere, at exactly the moment the user is most willing to pay.
      if (gate) {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { ...next[next.length - 1], gated: true };
          return next;
        });
        return;
      }
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
                  {!m.gated && m.content}
                  {m.role === 'assistant' && !m.content && busy && (
                    <span className="inline-block w-2 h-2 rounded-full bg-gold/70 animate-pulse" />
                  )}
                </div>

                {m.gated && (
                  <GateCard
                    gate={catalog?.chat?.gate}
                    text={m.content}
                    onUpgrade={() => onUpgrade?.()}
                  />
                )}

                {/* Read-aloud belongs to a reading. The gate message is an offer,
                    and voicing it in the Oracle's voice would sell in her voice. */}
                {m.role === 'assistant' && m.content && !m.gated && (
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
                    {m.hooks.map((h, hi) => {
                      // Open the feature here when the web can render it; send to
                      // the store only when it genuinely needs the app, so the
                      // store link means something rather than being the one
                      // answer to every recommendation.
                      const section = sectionForHook(h, catalog);
                      const open = openableOnWeb(section) && !!onOpenSection;
                      const cls =
                        'inline-flex items-center gap-2 rounded-full border border-white/30 ' +
                        'px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 ' +
                        'hover:bg-white hover:text-black transition-colors';
                      return open ? (
                        <button key={hi} onClick={() => onOpenSection(section)} className={cls}>
                          {h.label} <span aria-hidden>›</span>
                        </button>
                      ) : (
                        <a
                          key={hi}
                          href={storeUrl(platform, store)}
                          target={platform === 'desktop' ? '_blank' : undefined}
                          rel="noreferrer"
                          className={cls}
                        >
                          {h.label} <span aria-hidden>›</span>
                        </a>
                      );
                    })}
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
