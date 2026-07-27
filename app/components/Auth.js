'use client';

/**
 * AUTH — email code, Google, or Apple, against the same Supabase project the
 * mobile app uses, so one account works on both. Signing in is OPTIONAL: the
 * API is stateless and readings work signed-out. An account is what carries a
 * subscription and conversation history across devices.
 */

import { useState } from 'react';
import { auth } from '../lib/supabase';

const field =
  'w-full bg-transparent border-b border-mist focus:border-gold/60 outline-none ' +
  'py-3 text-white placeholder:text-white/25 transition-colors';

export default function Auth({ onDone, onSkip }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const redirectTo =
    typeof window !== 'undefined' ? `${window.location.origin}/app` : undefined;

  const send = async (e) => {
    e.preventDefault();
    if (!email.trim() || busy) return;
    setBusy(true); setError('');
    const { error } = await auth.sendEmailCode(email.trim());
    setBusy(false);
    if (error) setError(error.message || 'Could not send the code.');
    else setSent(true);
  };

  const verify = async (e) => {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true); setError('');
    const { error } = await auth.verifyEmailCode(email.trim(), code.trim());
    setBusy(false);
    if (error) setError(error.message || 'That code did not work.');
    else onDone?.();
  };

  const oauth = async (provider) => {
    setBusy(true); setError('');
    const fn = provider === 'google' ? auth.signInWithGoogle : auth.signInWithApple;
    const { error } = await fn(redirectTo);
    if (error) { setBusy(false); setError(error.message || 'Sign-in failed.'); }
    // On success the browser navigates away to the provider.
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="font-serif text-4xl font-light leading-tight">
        Keep your sky<br />with you.
      </h1>
      <p className="mt-4 text-sm leading-relaxed text-white/45">
        Sign in so your readings, conversations, and subscription follow you
        across the app and the web. Same account as the Plutto app.
      </p>

      {!sent ? (
        <form onSubmit={send} className="mt-10">
          <label className="block text-[10px] uppercase tracking-[0.32em] text-white/40 mb-1">
            Email
          </label>
          <input className={field} type="email" value={email} autoComplete="email"
                 onChange={(e) => setEmail(e.target.value)} placeholder="you@plutto.space" />
          <button type="submit" disabled={!email.trim() || busy}
            className={`mt-8 w-full py-4 rounded-full text-[11px] uppercase tracking-[0.32em] transition-all ${
              email.trim() && !busy ? 'bg-gold text-black hover:brightness-110'
                                    : 'border border-mist text-white/25'
            }`}>
            {busy ? 'Sending…' : 'Email me a code'}
          </button>
        </form>
      ) : (
        <form onSubmit={verify} className="mt-10">
          <label className="block text-[10px] uppercase tracking-[0.32em] text-white/40 mb-1">
            The code we sent to {email}
          </label>
          <input className={field} inputMode="numeric" value={code} autoComplete="one-time-code"
                 onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 8))}
                 placeholder="123456" />
          <button type="submit" disabled={!code.trim() || busy}
            className={`mt-8 w-full py-4 rounded-full text-[11px] uppercase tracking-[0.32em] transition-all ${
              code.trim() && !busy ? 'bg-gold text-black hover:brightness-110'
                                   : 'border border-mist text-white/25'
            }`}>
            {busy ? 'Checking…' : 'Sign in'}
          </button>
          <button type="button" onClick={() => { setSent(false); setCode(''); }}
            className="mt-4 w-full text-[11px] text-white/35 hover:text-white/60 transition-colors">
            Use a different email
          </button>
        </form>
      )}

      <div className="mt-10 flex items-center gap-4 text-[10px] uppercase tracking-[0.28em] text-white/25">
        <span className="flex-1 h-px bg-mist" /> or <span className="flex-1 h-px bg-mist" />
      </div>

      <div className="mt-6 space-y-3">
        <button onClick={() => oauth('google')} disabled={busy}
          className="w-full py-3.5 rounded-full border border-mist text-[11px] uppercase
                     tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white transition-colors">
          Continue with Google
        </button>
        <button onClick={() => oauth('apple')} disabled={busy}
          className="w-full py-3.5 rounded-full border border-mist text-[11px] uppercase
                     tracking-[0.28em] text-white/70 hover:border-white/40 hover:text-white transition-colors">
          Continue with Apple
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-300/80">{error}</p>}

      {onSkip && (
        <button onClick={onSkip}
          className="mt-10 w-full text-[11px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors">
          Continue without an account
        </button>
      )}
    </div>
  );
}
