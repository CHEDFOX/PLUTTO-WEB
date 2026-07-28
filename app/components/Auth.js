'use client';

/**
 * AUTH — the app's auth gate, composed to match.
 *
 * Mobile (src/screens/AuthGateScreen.js) is a centred stack with no title: one
 * 60px pill carrying an envelope circle, the input, and a white arrow that
 * appears only when the value is valid; a hairline divider at 66% width; then a
 * row of 48px social circles. Verification swaps the pill for a row of circular
 * code boxes. Every measurement below is taken from that file so the two read
 * as the same screen.
 */

import { useEffect, useRef, useState } from 'react';
import { auth } from '../lib/supabase';
import { oauthRedirectTo, SOCIAL_PROVIDERS } from '../config/auth';

const PILL_H = 60;
const PILL_PAD = 7;
const ENV = PILL_H - PILL_PAD * 2;   // 46
const CODE_LEN = 6;

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function EnvelopeGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.2">
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

function ArrowGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.8" strokeLinecap="round">
      <path d="M5 12h13M12 5l7 7-7 7" />
    </svg>
  );
}

function AppleGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff">
      <path d="M16.4 12.8c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.8-3.5.8s-1.8-.8-3-.8c-1.5 0-2.9.9-3.7 2.3-1.6 2.7-.4 6.8 1.1 9 .8 1.1 1.7 2.3 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.2.9-1.3 1.3-2.5 1.3-2.6 0 0-2.5-1-2.5-3.5zM14.2 5.9c.6-.8 1.1-1.9 1-3-.9 0-2.1.6-2.8 1.4-.6.7-1.2 1.8-1 2.9 1 .1 2.1-.5 2.8-1.3z" />
    </svg>
  );
}

function GoogleGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#4285F4" d="M45 24c0-1.6-.1-2.7-.4-3.9H24v7.1h12c-.2 1.8-1.5 4.6-4.4 6.5l6.7 5.2C42.2 35.3 45 30.1 45 24z" />
      <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-6.9-5.4c-1.9 1.3-4.4 2.2-7.6 2.2-5.8 0-10.7-3.8-12.5-9.1l-7.1 5.5C8 40.4 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.5 28.4c-.5-1.4-.8-2.9-.8-4.4s.3-3 .7-4.4l-7.1-5.6C2.8 16.8 2 20.3 2 24s.8 7.2 2.3 10.1l7.2-5.7z" />
      <path fill="#EA4335" d="M24 9.5c4.1 0 6.9 1.8 8.5 3.3l6.2-6C34.9 3.4 29.9 1 24 1 15.4 1 8 6.6 4.3 14.1l7.2 5.6C13.3 14.4 18.2 9.5 24 9.5z" />
    </svg>
  );
}

function ResendGlyph() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="1.3" strokeLinecap="round">
      <path d="M20 11a8 8 0 1 0-2.3 6.1" />
      <path d="M20 5v6h-6" />
    </svg>
  );
}

export default function Auth({ onDone }) {
  const [phase, setPhase] = useState('entry');   // entry | sending | verify | verifying
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState(false);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(null);   // provider mid-redirect
  const codeRef = useRef(null);

  const valid = EMAIL_RX.test(email.trim());

  useEffect(() => {
    if (phase === 'verify') codeRef.current?.focus();
  }, [phase]);

  // Verify as soon as the last digit lands, exactly as the app does — no button.
  useEffect(() => {
    if (phase !== 'verify' || code.length !== CODE_LEN) return;
    (async () => {
      setPhase('verifying');
      const { error } = await auth.verifyEmailCode(email.trim(), code);
      if (error) {
        setCodeError(true);
        setCode('');
        setPhase('verify');
        setError(error.message || 'That code did not work.');
      } else {
        onDone?.();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, phase]);

  const send = async () => {
    if (!valid) return;
    setError('');
    setPhase('sending');
    const { error } = await auth.sendEmailCode(email.trim());
    if (error) {
      setError(error.message || 'Could not send the code.');
      setPhase('entry');
    } else {
      setPhase('verify');
    }
  };

  // Google and Apple are REDIRECT flows through Supabase: the browser leaves the
  // page, so reaching the line after this call at all means the redirect never
  // happened — almost always because the origin is missing from Supabase's
  // redirect allow-list or Google's authorised origins (see AUTH_SETUP.md).
  // Surfacing that beats a button that silently does nothing.
  const oauth = async (provider) => {
    setError('');
    setPending(provider);
    const fn = provider === 'google' ? auth.signInWithGoogle : auth.signInWithApple;
    try {
      const { data, error } = await fn(oauthRedirectTo());
      if (error) {
        setPending(null);
        setError(error.message || `Could not sign in with ${provider}.`);
        return;
      }
      // Supabase returns the URL when it cannot navigate for us.
      if (data?.url) { window.location.assign(data.url); return; }
      setTimeout(() => {
        setPending((p) => {
          if (p === provider) {
            setError(
              `${provider === 'google' ? 'Google' : 'Apple'} sign-in did not open. ` +
              'This site may not be authorised for it yet.'
            );
          }
          return null;
        });
      }, 4000);
    } catch (e) {
      setPending(null);
      setError(e?.message || `Could not sign in with ${provider}.`);
    }
  };

  const circle =
    'flex items-center justify-center rounded-full transition-colors ' +
    'border-[0.5px] border-white/[0.18] bg-white/[0.03] hover:bg-white/[0.07]';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center w-full px-7">
      {phase === 'entry' && (
        <div className="w-full max-w-[420px] flex flex-col items-center">
          {/* the pill */}
          <div
            className="relative w-full bg-white/[0.06] border-[0.5px] border-white/[0.14] backdrop-blur-sm"
            style={{ height: PILL_H, borderRadius: PILL_H / 2 }}
          >
            <div
              className="absolute flex items-center justify-center rounded-full bg-white/[0.10] border-[0.5px] border-white/[0.18]"
              style={{ left: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
            >
              <EnvelopeGlyph />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              className="absolute bg-transparent outline-none text-[15px] font-light text-white
                         placeholder:text-white/[0.32]"
              style={{
                left: PILL_PAD + ENV + 10,
                right: PILL_PAD + ENV + 10,
                top: 0,
                bottom: 0,
                letterSpacing: '0.3px',
              }}
            />

            <button
              onClick={send}
              aria-label="Continue"
              className={`absolute flex items-center justify-center rounded-full bg-white transition-opacity ${
                valid ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              style={{ right: PILL_PAD, top: PILL_PAD, width: ENV, height: ENV }}
            >
              <ArrowGlyph />
            </button>
          </div>

          <div className="h-px bg-white/[0.15] my-12" style={{ width: '66%' }} />

          <div className="flex gap-4">
            {SOCIAL_PROVIDERS.map((prov) => (
              <button
                key={prov}
                onClick={() => oauth(prov)}
                disabled={!!pending}
                className={`${circle} ${pending === prov ? 'animate-pulse' : ''}`}
                style={{ width: 48, height: 48 }}
                aria-label={`Sign in with ${prov === 'apple' ? 'Apple' : 'Google'}`}
              >
                {prov === 'apple' ? <AppleGlyph /> : <GoogleGlyph />}
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === 'sending' && (
        <div className="flex flex-col items-center">
          <div
            className="flex items-center justify-center rounded-full bg-white/[0.10] border-[0.5px] border-white/[0.18] animate-pulse"
            style={{ width: ENV, height: ENV }}
          >
            <EnvelopeGlyph />
          </div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.32em] text-white/40">Sending</p>
        </div>
      )}

      {(phase === 'verify' || phase === 'verifying') && (
        <div className="w-full max-w-[420px] flex flex-col items-center">
          <div className="flex gap-2.5" onClick={() => codeRef.current?.focus()}>
            {Array.from({ length: CODE_LEN }, (_, i) => {
              const digit = code[i];
              return (
                <div
                  key={i}
                  className={`flex items-center justify-center rounded-full border transition-colors ${
                    codeError
                      ? 'border-[rgba(255,90,60,0.85)]'
                      : digit
                      ? 'border-white/[0.85] bg-white/[0.05]'
                      : 'border-white/[0.22] bg-white/[0.02]'
                  }`}
                  style={{ width: 46, height: 46 }}
                >
                  {digit ? <span className="text-[17px] font-light text-white">{digit}</span> : null}
                </div>
              );
            })}
          </div>

          <input
            ref={codeRef}
            value={code}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={CODE_LEN}
            onChange={(e) => {
              setCode(e.target.value.replace(/\D/g, '').slice(0, CODE_LEN));
              if (codeError) setCodeError(false);
            }}
            className="absolute opacity-0 w-px h-px"
            aria-label="Verification code"
          />

          <div className="h-6 mt-6 flex items-center">
            {phase === 'verifying' && (
              <span className="inline-block h-2 w-2 rounded-full bg-gold/70 animate-pulse" />
            )}
          </div>

          <div className="h-px bg-white/[0.15] my-10" style={{ width: '66%' }} />

          <div className="flex gap-4">
            <button
              onClick={() => { setPhase('entry'); setCode(''); setCodeError(false); }}
              className={circle} style={{ width: 48, height: 48 }} aria-label="Back"
            >
              <span className="text-white/70 text-xl leading-none">‹</span>
            </button>
            <button onClick={send} className={circle} style={{ width: 48, height: 48 }} aria-label="Resend code">
              <ResendGlyph />
            </button>
          </div>
        </div>
      )}

      {error && <p className="mt-10 text-[13px] text-red-300/80 text-center">{error}</p>}

    </div>
  );
}
