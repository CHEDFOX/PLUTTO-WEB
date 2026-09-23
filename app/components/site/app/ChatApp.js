'use client';

/**
 * THE ORACLE TAB — src/render/ChatPanel.js, as it renders with the live catalog.
 *
 * Every measurement is the app's, in points on a 393 × 852 screen:
 *   screen        bg #000 (THEME_DEFAULTS.bg), chat.background 'starfield'
 *   menu          Settings header: 40 pt button at left 18, bottom of a 92 pt bar;
 *                 Icon 'menu' 22 pt, white 70 %
 *   list          paddingTop 92 (theme.space.header) + 8, gutters 24,
 *                 messages 8 pt apart vertically, max 86 % wide
 *   user bubble   system face 15/22 Light, white 85 % on white 6 %, 14×10, r 16
 *   oracle        theme.serif ('Plutto' = Baloo 2) 17/27, white 80 %
 *   after reply   Icon 'sound' 15 pt white 32 % (mt 6, ml 2), then the hook chips:
 *                 13 pt, white 90 %, bg white 6 %, 0.5 pt white 16 %, r 16, 13×8, gap 8
 *   box           14 pt from the edges, 82 + 34 pt from the bottom; bg #000,
 *                 r 22, 0.5 pt white 12 %, padding 11/14/8; input 14 pt Light
 *                 white 92 %, placeholder "Speak Freely …" at white 32 %;
 *                 toolbar mt 9 gap 7: model pill "Plutt0.8" (12 pt white, chevronUp
 *                 14 pt white 45 %, 0.5 pt white 16 %, r 16, 12×6), then mic and
 *                 voice (Icon 'soundWave', theme.voice.icon) in 34 pt circles, or
 *                 the send button in the model's red while there is text
 *   tab bar       70 + 34 pt, paddingBottom 18 + 34; oracle · home · vinylWave at
 *                 24 pt, active white 95 %, inactive white 30 %
 *   reply         the orbit loader until the first token, collapsing in 300 ms,
 *                 then the text fading up in 220 ms and streaming
 *
 * Every reply ends in the "Report" chip (chat.py _with_report), and a reply that
 * invites a draw carries the Oracle's own 1–3 word chip before it.
 *
 * The words are written in the Oracle's voice as its prompt defines it (plain,
 * second person, no terms of art, an answer in the first sentence). They are a
 * demonstration: no request is made.
 */

import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
import Starfield from './Starfield';
import { Orbit, SendButton } from './Bits';
import { SYSTEM_FONT } from './Device';

const W = (a) => `rgba(255,255,255,${a})`;
const SERIF = 'var(--font-app), "Baloo 2", sans-serif';

export const EXCHANGES = [
  {
    q: 'Should I take the job?',
    a: 'Yes — but not for the reason you keep giving. It isn’t the money. It’s the room to be good at something without asking anyone’s permission, and this one gives you that by spring. Take it, and bargain over the start date, not the salary.',
    hooks: ['Report'],
  },
  {
    q: 'Why do I keep going back to him?',
    a: 'Because leaving would mean admitting the man you miss was mostly your own idea of him. You’re not returning to a person — you’re returning to an unfinished sentence. Finish it on paper tonight. The pull loosens once it has an ending.',
    hooks: ['Report'],
  },
  {
    q: 'Pull a card for my week',
    a: 'A week for finishing, not starting. Something you put down in the spring wants picking up again — lay the cards and see which thread it is.',
    hooks: ['Draw your week', 'Report'],
  },
];

const TYPE_MS = 48, THINK_MS = 1600, COLLAPSE_MS = 300, WORD_MS = 55, HOLD_MS = 3200, RESET_MS = 5200;

function Hooks({ labels }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10, marginLeft: 2 }}>
      {labels.map((l) => (
        <span key={l} style={{
          padding: '8px 13px', borderRadius: 16, background: 'rgba(255,255,255,0.06)',
          border: `0.5px solid ${W(0.16)}`, fontSize: 13, color: W(0.9), lineHeight: '16px',
        }}>{l}</span>
      ))}
    </div>
  );
}

function OracleMsg({ text, phase }) {
  // phase: 'loading' | 'collapse' | 'text' | 'done'
  return (
    <div>
      {phase === 'loading' || phase === 'collapse' ? (
        <div style={{ margin: '4px 0 4px 2px' }}><Orbit collapsing={phase === 'collapse'} /></div>
      ) : (
        <p className="app-fade-in" style={{ fontFamily: SERIF, fontSize: 17, lineHeight: '27px', color: W(0.8), margin: 0 }}>{text}</p>
      )}
    </div>
  );
}

export default function ChatApp({ live = true, still = 0 }) {
  // msgs: [{ q, a, words, phase, done }]
  const [msgs, setMsgs] = useState(() => (live ? [] : [{ ...EXCHANGES[still], words: 1e9, phase: 'done' }]));
  const [typed, setTyped] = useState('');
  const [go, setGo] = useState(false);
  const box = useRef(null);
  const list = useRef(null);

  useEffect(() => {
    if (!live) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setMsgs([{ ...EXCHANGES[0], words: 1e9, phase: 'done' }]);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setGo(e.isIntersecting), { threshold: 0.25 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, [live]);

  useEffect(() => {
    if (!go) return undefined;
    let dead = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));
    const patchLast = (p) => setMsgs((m) => { const c = [...m]; c[c.length - 1] = { ...c[c.length - 1], ...p }; return c; });

    (async () => {
      setMsgs([]); setTyped('');
      await wait(900);
      for (let n = 0; !dead; n += 1) {
        const ex = EXCHANGES[n % EXCHANGES.length];
        if (n > 0 && n % EXCHANGES.length === 0) {
          await wait(RESET_MS - HOLD_MS);
          if (dead) return;
          setMsgs([]);
          await wait(900);
        }
        for (let i = 1; i <= ex.q.length && !dead; i += 1) { setTyped(ex.q.slice(0, i)); await wait(TYPE_MS); }
        await wait(380);
        if (dead) return;
        setTyped('');
        setMsgs((m) => [...m, { ...ex, words: 0, phase: 'loading' }]);
        await wait(THINK_MS);
        patchLast({ phase: 'collapse' });
        await wait(COLLAPSE_MS);
        patchLast({ phase: 'text', words: 2 });
        const total = ex.a.split(' ').length;
        for (let w = 3; w <= total && !dead; w += 1) { patchLast({ words: w }); await wait(WORD_MS); }
        patchLast({ phase: 'done' });
        await wait(HOLD_MS);
      }
    })();
    return () => { dead = true; timers.forEach(clearTimeout); };
  }, [go]);

  // The list scrolls to its end as the reply grows (ChatPanel's scrollToEnd).
  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [msgs]);

  return (
    <div ref={box} className="absolute inset-0" style={{ background: '#000', fontFamily: SYSTEM_FONT }}>
      <Starfield />

      {/* settings menu */}
      <div style={{ position: 'absolute', left: 18, top: 52, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20 }}>
        <Icon name="menu" size={22} color={W(0.7)} />
      </div>

      {/* messages */}
      <div ref={list} className="no-scrollbar" style={{ position: 'absolute', top: 92, left: 0, right: 0, bottom: 116 + 83, overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 24px 16px' }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: 'contents' }}>
              <div style={{ alignSelf: 'flex-end', maxWidth: '86%', margin: '8px 0' }}>
                <p style={{ fontSize: 15, lineHeight: '22px', fontWeight: 300, color: W(0.85), background: W(0.06), padding: '10px 14px', borderRadius: 16, margin: 0 }}>{m.q}</p>
              </div>
              <div style={{ alignSelf: 'flex-start', maxWidth: '86%', margin: '8px 0' }}>
                <OracleMsg text={m.a.split(' ').slice(0, m.words).join(' ')} phase={m.phase} />
                {m.phase === 'done' ? (
                  <div className="app-fade-in">
                    <div style={{ marginTop: 6, marginLeft: 2, padding: '2px 0' }}><Icon name="sound" size={15} color={W(0.32)} /></div>
                    <Hooks labels={m.hooks} />
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* chat box */}
      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 116 }}>
        <div style={{ background: '#000', borderRadius: 22, border: `0.5px solid ${W(0.12)}`, padding: '11px 14px 8px' }}>
          <div style={{ minHeight: 20, padding: '2px 0', fontSize: 14, lineHeight: '17px', fontWeight: 300, color: typed ? W(0.92) : W(0.32) }}>
            {typed || 'Speak Freely …'}
            {typed ? <span className="app-caret" style={{ display: 'inline-block', width: 2, height: 17, marginLeft: 1, verticalAlign: 'top', background: '#D4AF37' }} /> : null}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 9, height: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, border: `0.5px solid ${W(0.16)}`, borderRadius: 16, padding: '6px 12px' }}>
              <span style={{ fontSize: 12, lineHeight: '15px', color: '#FFFFFF' }}>Plutt0.8</span>
              <Icon name="chevronUp" size={14} color={W(0.45)} />
            </div>
            <div style={{ flex: 1 }} />
            {typed ? <SendButton color="#EF4444" /> : (
              <>
                <div style={{ width: 34, height: 34, borderRadius: 17, border: `0.5px solid ${W(0.16)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="mic" size={18} color={W(0.7)} />
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 17, border: `0.5px solid ${W(0.16)}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="soundWave" size={18} color={W(0.7)} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <TabBar active="oracle" />
    </div>
  );
}

export function TabBar({ active = 'oracle' }) {
  const items = [['oracle', 'oracle'], ['home', 'home'], ['explore', 'vinylWave']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 104, paddingBottom: 52, display: 'flex', zIndex: 30 }}>
      {items.map(([k, icon]) => (
        <div key={k} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={24} color={k === active ? W(0.95) : W(0.3)} />
        </div>
      ))}
    </div>
  );
}
