'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BirthForm from './BirthForm';
import Oracle from './Oracle';
import GetTheApp from '../components/GetTheApp';
import Auth from '../components/Auth';
import { generateKundli, getCatalog, getEntitlement } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/store';
import { preloadMedia } from '../lib/media';
import { supabase, auth as sbAuth } from '../lib/supabase';

const TABS = [
  { key: 'oracle', label: 'Oracle' },
  { key: 'chart', label: 'Your chart' },
  { key: 'explore', label: 'Explore' },
];

export default function AppPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('oracle');
  const [catalog, setCatalog] = useState(null);
  const [user, setUser] = useState(null);       // supabase user (optional)
  const [entitled, setEntitled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
    preloadMedia();
    // Track the signed-in user; readings work signed-out, an account carries the
    // subscription and history across devices.
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null)).catch(() => {});
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user || null));
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // Entitlement follows the ACCOUNT, so a subscription bought on the phone
  // unlocks the web too. Re-checked whenever the user changes or a checkout
  // returns to this page.
  useEffect(() => {
    if (!user) { setEntitled(false); return; }
    let live = true;
    getEntitlement().then((e) => live && setEntitled(!!e?.active)).catch(() => {});
    return () => { live = false; };
  }, [user]);

  // The catalog drives every feature on the page — fetch once the user exists.
  useEffect(() => {
    if (!session) return;
    let live = true;
    getCatalog({ lang: 'en' })
      .then((c) => live && setCatalog(c))
      .catch(() => {});
    return () => { live = false; };
  }, [session]);


  const onSubmit = async (profile) => {
    setBusy(true);
    setError('');
    try {
      const data = await generateKundli(profile);
      const next = { profile, kundli: data, createdAt: Date.now() };
      saveSession(next);
      setSession(next);
      setTab('chart');
    } catch (e) {
      setError(
        e?.message?.includes('Failed to fetch')
          ? 'Could not reach the oracle. Check your connection and try again.'
          : 'Something went wrong computing your chart. Please check your details.'
      );
    } finally {
      setBusy(false);
    }
  };


  const reset = () => { clearSession(); setSession(null); setCatalog(null); };

  const name = session?.profile?.name || '';

  if (!ready) return <main className="min-h-screen bg-void" />;

  if (!session) {
    return (
      <main className="min-h-screen bg-void px-6 py-20 md:py-28">
        <BirthForm onSubmit={onSubmit} busy={busy} error={error} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-void">
      <div className="mx-auto w-full max-w-5xl px-6 py-10 md:py-14">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              Your sky
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-light">
              {name || 'Your chart'}
            </h1>
          </div>
          <div className="flex items-center gap-5">
            {entitled && (
              <span className="text-[10px] uppercase tracking-[0.28em] text-gold">★ Star</span>
            )}
            {user ? (
              <button onClick={async () => { await sbAuth.signOut(); setUser(null); }}
                className="text-[10px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors">
                Sign out
              </button>
            ) : (
              <button onClick={() => setShowAuth(true)}
                className="text-[10px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors">
                Sign in
              </button>
            )}
            <button onClick={reset}
              className="text-[10px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors">
              New chart
            </button>
          </div>
        </header>

        <nav className="mt-10 flex gap-8 border-b border-mist">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`relative pb-3 text-[10px] uppercase tracking-[0.32em] transition-colors ${
                tab === t.key ? 'text-white' : 'text-white/35 hover:text-white/70'
              }`}>
              {t.label}
              {tab === t.key && (
                <span className="absolute -bottom-px left-0 right-0 h-px bg-gold" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-10">
          {tab === 'oracle' && (
            <div className="rounded-2xl border border-mist bg-card p-6 md:p-8" style={{ minHeight: '34rem' }}>
              <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">The Oracle</p>
              <div className="mt-4" style={{ height: '28rem' }}>
                <Oracle kundli={session.kundli} name={name} />
              </div>
            </div>
          )}

          {/* The web carries the Oracle. The chart and the library are the app's —
              these tabs make that trade plainly and hand the visitor to the right
              store for their device. */}
          {tab === 'chart' && (
            <GetTheApp
              store={catalog?.store}
              title={
                <>
                  Your whole chart
                  <br />
                  <em className="italic text-white/85">lives in the app.</em>
                </>
              }
              body="Every placement, the wheels of time, and the chapters running through your life right now — read the way they were meant to be read."
              points={[
                'Your full chart, house by house',
                'The periods and transits moving through you',
                'Daily readings, in your language',
              ]}
            />
          )}

          {tab === 'explore' && (
            <GetTheApp
              store={catalog?.store}
              points={[
                'Every tradition — Jyotish, Hermetica, BaZi, KP, numerology',
                'Compatibility, places, timing, past life',
                'Tarot, I Ching and the number oracle',
                'The Oracle in live voice, in your language',
              ]}
            />
          )}
        </div>

        <p className="mt-16 text-[11px] leading-relaxed text-white/25">
          Plutto explores traditional knowledge systems for insight and reflection.
          Readings are not professional medical, legal, or financial advice.{' '}
          <Link href="/" className="underline hover:text-white/50">Back to plutto.space</Link>
        </p>
      </div>



      {showAuth && (
        <div className="fixed inset-0 z-[70] bg-void/95 overflow-y-auto backdrop-blur-sm">
          <div className="px-6 py-14">
            <button onClick={() => setShowAuth(false)}
              className="mb-10 block mx-auto text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white transition-colors">
              ✕ Close
            </button>
            <Auth onDone={() => setShowAuth(false)} onSkip={() => setShowAuth(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
