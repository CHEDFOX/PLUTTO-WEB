'use client';

import { useEffect, useRef, useState } from 'react';
import { streamChat } from '../lib/api';
import { conversationId } from '../lib/store';

const OPENERS = [
  'What is this year really asking of me?',
  'Where should I be living?',
  'When does the pressure ease?',
  'What do I keep repeating?',
];

export default function Oracle({ kundli, name }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const scroller = useRef(null);
  const abort = useRef(null);

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
      await streamChat(
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
              </div>
            ))}
          </div>
        )}
        {error && <p className="py-3 text-sm text-red-300/80">{error}</p>}
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
        <button
          type="submit"
          disabled={!input.trim() || busy}
          className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.28em] transition-all ${
            input.trim() && !busy
              ? 'bg-gold text-black hover:brightness-110'
              : 'border border-mist text-white/25'
          }`}
        >
          {busy ? '…' : 'Ask'}
        </button>
      </form>
    </div>
  );
}
