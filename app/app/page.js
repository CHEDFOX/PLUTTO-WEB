'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import BirthForm from './BirthForm';
import Oracle from './Oracle';
import Chart from './Chart';
import Library from '../components/Library';
import Feature from '../components/Feature';
import Paywall from '../components/Paywall';
import { generateKundli, getCatalog } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/store';
import { preloadMedia } from '../lib/media';
import { isEntitled, isGated } from '../lib/entitlement';

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
  const [open, setOpen] = useState(null);      // section being read
  const [paywall, setPaywall] = useState(null); // section that triggered the paywall

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
    preloadMedia();
  }, []);

  // The catalog drives every feature on the page — fetch once the user exists.
  useEffect(() => {
    if (!session) return;
    let live = true;
    getCatalog({ lang: 'en' })
      .then((c) => live && setCatalog(c))
      .catch(() => {});
    return () => { live = false; };
  }, [session]);

  const entitled = isEntitled(session);
  const locked = useCallback(
    (section) => isGated(section, catalog, entitled),
    [catalog, entitled]
  );

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

  const openSection = (section) => {
    if (locked(section)) { setPaywall(section); return; }
    setOpen(section);
  };

  const reset = () => { clearSession(); setSession(null); setCatalog(null); };

  const theme = catalog?.theme;
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
          <button onClick={reset}
            className="text-[10px] uppercase tracking-[0.28em] text-white/30 hover:text-white/60 transition-colors">
            New chart
          </button>
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

          {tab === 'chart' && <Chart kundli={session.kundli} />}

          {tab === 'explore' && (
            catalog ? (
              <Library catalog={catalog} onOpen={openSection} isLocked={locked} />
            ) : (
              <p className="py-20 text-center text-[11px] uppercase tracking-[0.28em] text-white/30">
                Loading the library…
              </p>
            )
          )}
        </div>

        <p className="mt-16 text-[11px] leading-relaxed text-white/25">
          Plutto explores traditional knowledge systems for insight and reflection.
          Readings are not professional medical, legal, or financial advice.{' '}
          <Link href="/" className="underline hover:text-white/50">Back to plutto.space</Link>
        </p>
      </div>

      {open && (
        <Feature
          section={open}
          kundli={session.kundli}
          theme={theme}
          onClose={() => setOpen(null)}
        />
      )}

      {paywall && (
        <Paywall
          catalog={catalog}
          section={paywall}
          onClose={() => setPaywall(null)}
        />
      )}
    </main>
  );
}
