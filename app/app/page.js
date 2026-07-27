'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BirthForm from './BirthForm';
import Oracle from './Oracle';
import { generateKundli } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/store';

function Stat({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">{label}</p>
      <p className="mt-1 font-serif text-xl font-light text-white">{value}</p>
    </div>
  );
}

export default function AppPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
  }, []);

  const onSubmit = async (profile) => {
    setBusy(true);
    setError('');
    try {
      const data = await generateKundli(profile);
      const next = { profile, kundli: data, createdAt: Date.now() };
      saveSession(next);
      setSession(next);
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

  const reset = () => {
    clearSession();
    setSession(null);
  };

  // Avoid a flash of the form before localStorage is read.
  if (!ready) {
    return <main className="min-h-screen bg-void" />;
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-void px-6 py-20 md:py-28">
        <BirthForm onSubmit={onSubmit} busy={busy} error={error} />
      </main>
    );
  }

  const k = session.kundli?.kundli || {};
  const name = session.profile?.name || '';
  const dasha = k.current_dasha || {};

  return (
    <main className="min-h-screen bg-void px-6 py-12 md:py-16">
      <div className="mx-auto w-full max-w-5xl">
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
            className="text-[10px] uppercase tracking-[0.28em] text-white/30
                       hover:text-white/60 transition-colors">
            New chart
          </button>
        </header>

        <section className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-mist py-8">
          <Stat label="Ascendant" value={k.ascendant} />
          <Stat label="Sun" value={k.sun_sign} />
          <Stat label="Moon" value={k.moon_sign} />
          <Stat label="Nakshatra" value={k.nakshatra} />
        </section>

        {(dasha.string || dasha.planet) && (
          <section className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              The chapter running now
            </p>
            <p className="mt-2 font-serif text-2xl font-light text-white">
              {dasha.string || `${dasha.planet}${dasha.sub ? ` — ${dasha.sub}` : ''}`}
            </p>
          </section>
        )}

        {k.planets && (
          <section className="mt-12">
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35 mb-4">
              Placements
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
              {Object.entries(k.planets).map(([planet, d]) => (
                <div key={planet}
                  className="flex items-baseline justify-between border-b border-white/5 py-2">
                  <span className="font-serif text-base text-white/85">
                    {planet}{d.retrograde ? <span className="text-gold/70 text-xs align-super"> ℞</span> : null}
                  </span>
                  <span className="text-[12px] text-white/45">
                    {d.rashi}{d.house ? ` · ${d.house}` : ''}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-16 rounded-2xl border border-mist bg-card p-6 md:p-8"
                 style={{ minHeight: '32rem' }}>
          <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
            The Oracle
          </p>
          <div className="mt-4" style={{ height: '26rem' }}>
            <Oracle kundli={session.kundli} name={name} />
          </div>
        </section>

        <p className="mt-12 text-[11px] leading-relaxed text-white/25">
          Plutto explores traditional knowledge systems for insight and reflection.
          Readings are not professional medical, legal, or financial advice.{' '}
          <Link href="/" className="underline hover:text-white/50">Back to plutto.space</Link>
        </p>
      </div>
    </main>
  );
}
