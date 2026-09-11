'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Onboarding from './Onboarding';
import Oracle from './Oracle';
import GetTheApp from '../components/GetTheApp';
import Settings from '../components/Settings';
import Auth from '../components/Auth';
import Feature from '../components/Feature';
import Explore from '../components/Explore';
import Paywall from '../components/Paywall';
import { isGated } from '../lib/entitlement';
import { generateKundli, getCatalog, getEntitlement } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/store';
import { loadRemoteSession, saveRemoteSession } from '../lib/profile';
import { preloadMedia } from '../lib/media';
import { supabase, auth as sbAuth } from '../lib/supabase';

const TABS = [
  { key: 'oracle', label: 'Oracle' },
  { key: 'chart', label: 'Your chart' },
  { key: 'explore', label: 'Explore' },
  { key: 'settings', label: 'Settings' },
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
  // A feature opened from a chat recommendation. Gated sections show the paywall
  // instead — the same gate list the app uses, read from the catalog.
  const [section, setSection] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  // The app sends a signed-out user to the auth gate BEFORE onboarding
  // (App.js: `else if (!hasSession) stage = 'auth'`). Web mirrors that, and the
  // gate is REQUIRED here too: an account is what carries the chart, the
  // conversation and the subscription across web and phone.
  const [authed, setAuthed] = useState(null);   // null = still resolving

  useEffect(() => {
    setSession(loadSession());
    setReady(true);
    preloadMedia();
    // Track the signed-in user; readings work signed-out, an account carries the
    // subscription and history across devices.
    supabase.auth.getUser()
      .then(({ data }) => { setUser(data?.user || null); setAuthed(!!data?.user); })
      .catch(() => setAuthed(false));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setUser(s?.user || null);
      if (s?.user) setAuthed(true);
    });
    return () => sub?.subscription?.unsubscribe?.();
  }, []);

  // ENROLLMENT follows the ACCOUNT, exactly as the chart and subscription do.
  // localStorage is per-browser, so treating it as the source of truth meant a
  // user enrolled on their phone — or on this site in another browser — was sent
  // through onboarding again. The server-held profile decides; localStorage is
  // the cache in front of it.
  useEffect(() => {
    if (!user) return;
    let live = true;
    (async () => {
      const remote = await loadRemoteSession(user);
      if (!live || remote === undefined) return;   // query failed → keep what we have
      if (remote) {
        const next = { profile: remote.profile, kundli: remote.kundli, createdAt: Date.now() };
        saveSession(next);                          // seed this browser's cache
        setSession(next);
        return;
      }
      // Enrolled HERE before this synced anywhere: push it up so the phone sees
      // it, rather than stranding a chart in one browser.
      const local = loadSession();
      if (local?.profile) saveRemoteSession(user, local.profile, local.kundli);
    })();
    return () => { live = false; };
  }, [user]);

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
      // And to the account, so this enrollment exists on the phone too. Not
      // awaited: the chart is computed and on screen, and a sync failure is not
      // a reason to hold up or fail an onboarding that succeeded.
      if (user) saveRemoteSession(user, profile, data);
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

  // Open a feature the chat recommended. The paywall check happens HERE, before
  // the reading is ever requested, so a gated section cannot be read for free by
  // arriving through a chat hook instead of the library.
  const openSection = (s) => {
    if (!s) return;
    if (isGated(s, catalog, entitled)) { setSection(s); setShowPaywall(true); return; }
    setShowPaywall(false);
    setSection(s);
  };
  const closeSection = () => { setSection(null); setShowPaywall(false); };

  // Just paid, on this page — RevenueCat's sheet closes in place rather than
  // redirecting, so nothing would otherwise re-check entitlement and the user would
  // be left staring at the paywall they just bought their way past. Unlock at once
  // from RevenueCat's own answer, then reconcile against the backend, which is the
  // real source of truth once its webhook lands a second or two later.
  const onPurchased = async () => {
    setEntitled(true);
    setShowPaywall(false);
    try {
      const e = await getEntitlement();
      // Only ever CORRECT downward on a definite negative — a slow webhook must not
      // re-lock someone who has genuinely paid.
      if (e && e.active === false) {
        setTimeout(() => getEntitlement().then((r) => setEntitled(!!r?.active)).catch(() => {}), 4000);
      }
    } catch {
      /* leave them unlocked; the next load re-checks */
    }
  };

  const name = session?.profile?.name || '';

  if (!ready) return <main className="min-h-screen bg-void" />;

  // Still reading the stored session — black, never a flash of the wrong screen
  // (the app shows black here for the same reason).
  if (authed === null) return <main className="min-h-screen bg-void" />;

  if (!authed) {
    return (
      <main className="min-h-screen bg-void px-6 py-16">
        <Auth onDone={() => setAuthed(true)} />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-void px-6 py-16">
        <Onboarding onComplete={onSubmit} busy={busy} error={error} />
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
                <Oracle
                  kundli={session.kundli}
                  name={name}
                  store={catalog?.store}
                  catalog={catalog}
                  onOpenSection={openSection}
                  onUpgrade={() => { setSection(null); setShowPaywall(true); }}
                />
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

          {/* The app's own feed, composed by the backend — not a card telling
              the reader to go and download the app they are already using. */}
          {tab === 'explore' && (
            <Explore
              catalog={catalog}
              kundli={session.kundli}
              entitled={entitled}
              onOpen={openSection}
            />
          )}

          {tab === 'settings' && (
            <Settings
              catalog={catalog}
              profile={session.profile}
              user={user}
              entitled={entitled}
              onSignIn={() => setShowAuth(true)}
              onSignOut={async () => { await sbAuth.signOut(); setUser(null); }}
              onNewChart={reset}
              onDeleteAccount={async () => { await sbAuth.signOut(); reset(); }}
            />
          )}
        </div>

        <p className="mt-16 text-[11px] leading-relaxed text-white/25">
          Plutto explores traditional knowledge systems for insight and reflection.
          Readings are not professional medical, legal, or financial advice.{' '}
          <Link href="/" className="underline hover:text-white/50">Back to plutto.space</Link>
        </p>
      </div>



      {/* A feature the Oracle recommended, opened in place. Gated ones show the
          paywall instead — never the reading. */}
      {/* No `section &&` here: the chat's free-tier gate opens the paywall with no
          section behind it, and requiring one made the upgrade button dead on the
          one screen where the user had just been told to upgrade. Paywall already
          treats `section` as optional (section?.title). */}
      {showPaywall && (
        <div className="fixed inset-0 z-[60] bg-void overflow-y-auto">
          <Paywall
            catalog={catalog}
            section={section}
            signedIn={!!user}
            userId={user?.id}
            email={user?.email}
            onSignIn={() => { closeSection(); setShowAuth(true); }}
            onClose={closeSection}
            onPurchased={onPurchased}
          />
        </div>
      )}

      {section && !showPaywall && (
        <Feature
          section={section}
          kundli={session.kundli}
          theme={catalog?.theme}
          language={session?.profile?.language || 'en'}
          onClose={closeSection}
        />
      )}

      {showAuth && (
        <div className="fixed inset-0 z-[70] bg-void/95 overflow-y-auto backdrop-blur-sm">
          <div className="px-6 py-14">
            <button onClick={() => setShowAuth(false)}
              className="mb-10 block mx-auto text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white transition-colors">
              ✕ Close
            </button>
            <Auth onDone={() => setShowAuth(false)} />
          </div>
        </div>
      )}
    </main>
  );
}
