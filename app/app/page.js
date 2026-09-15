'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Onboarding from './Onboarding';
import Chart from './Chart';
import Oracle from './Oracle';
import Settings from '../components/Settings';
import Auth from '../components/Auth';
import Feature from '../components/Feature';
import Explore from '../components/Explore';
import Home from '../components/Home';
import Paywall from '../components/Paywall';
import { isGated } from '../lib/entitlement';
import { generateKundli, getCatalog, getEntitlement } from '../lib/api';
import { loadSession, saveSession, clearSession } from '../lib/store';
import { loadRemoteSession, saveRemoteSession } from '../lib/profile';
import { preloadMedia } from '../lib/media';
import { supabase, auth as sbAuth } from '../lib/supabase';

// THE TABS ARE THE CATALOG'S, NOT THIS FILE'S.
//
// The app serves three — oracle, home, explore — in catalog.tabs, with the
// landing tab named there too. Web had four of its own invention: Oracle, Your
// chart, Explore, Settings. Two of them do not exist in the product (the chart
// is reached through the profile, settings through the gear), and Home, which
// IS the app's second tab and its whole landing screen, was missing.
//
// Read from the catalog now, so adding or renaming a tab is a backend edit. The
// labels come from catalog.labels where the backend provides them — it
// translates those — and fall back to the key's own English name.
const TAB_FALLBACK = { oracle: 'Oracle', home: 'Home', explore: 'Explore' };

function tabsOf(catalog) {
  const items = catalog?.tabs?.items;
  if (!Array.isArray(items) || !items.length) {
    return Object.keys(TAB_FALLBACK).map((key) => ({ key, label: TAB_FALLBACK[key] }));
  }
  return items.map((t) => ({
    key: t.key,
    screen: t.screen || t.key,
    label: t.label || catalog?.labels?.[`tab.${t.key}`] || TAB_FALLBACK[t.key] || t.key,
  }));
}

export default function AppPage() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState(null);   // resolved from catalog.tabs.landing
  const [catalog, setCatalog] = useState(null);
  const [user, setUser] = useState(null);       // supabase user (optional)
  const [entitled, setEntitled] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  // A feature opened from a chat recommendation. Gated sections show the paywall
  // instead — the same gate list the app uses, read from the catalog.
  const [section, setSection] = useState(null);
  const [showPaywall, setShowPaywall] = useState(false);
  // The gear and the profile, which are how the phone reaches these two — not
  // tabs of their own.
  const [showSettings, setShowSettings] = useState(false);
  const [showChart, setShowChart] = useState(false);
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

  // The tab bar and the landing tab, once the catalog lands.
  const TABS = tabsOf(catalog);
  useEffect(() => {
    if (tab || !TABS.length) return;
    setTab(catalog?.tabs?.landing || TABS[0].key);
  }, [catalog, tab, TABS]);

  // The catalog drives every feature on the page — fetch once the user exists.
  useEffect(() => {
    if (!session) return;
    let live = true;
    // THE READER'S LANGUAGE, NOT ENGLISH. The catalog is built per language —
    // every title, every label, every teaser — and this asked for 'en' on every
    // load, so a reader who chose Hindi at onboarding got an English app on the
    // web and their own language on the phone. It also pins the SYSTEM, which
    // scopes the whole catalog the way it does on the phone.
    getCatalog({ lang: session?.profile?.language || 'en', system: session?.profile?.system })
      .then((c) => live && setCatalog(c))
      .catch(() => {});
    return () => { live = false; };
  }, [session?.profile?.language, session?.profile?.system, session]);


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

  if (!ready) return <main className="app-shell min-h-screen bg-void" />;

  // Still reading the stored session — black, never a flash of the wrong screen
  // (the app shows black here for the same reason).
  if (authed === null) return <main className="app-shell min-h-screen bg-void" />;

  if (!authed) {
    return (
      <main className="app-shell min-h-screen bg-void px-6 py-16">
        <Auth onDone={() => setAuthed(true)} />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="app-shell min-h-screen bg-void px-6 py-16">
        <Onboarding onComplete={onSubmit} busy={busy} error={error} />
      </main>
    );
  }

  return (
    // THE APP'S SHAPE, AT BOTH SIZES.
    //
    // This was a wide web page with a rule of tabs across the top: on a phone
    // the reader's thumb had to reach the top of the screen to change tab, and
    // on a desktop a 1024px column of chat made the Oracle look like a support
    // widget. The app is a column with its tabs under the thumb, and it is the
    // right shape for both — so the column is the app's width and no wider, and
    // the tab bar is pinned to the bottom edge on a phone and floats as a pill
    // over the page on a desktop.
    //
    // `app-shell` is also what switches the type to the phone's own faces
    // (globals.css) — one class, and every existing font- class follows.
    <main className="app-shell min-h-screen bg-void">
      <div className="mx-auto w-full max-w-[860px] px-6 pb-40 pt-8 md:pt-14">
        <header className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              Your sky
            </p>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-light">
              {name || 'Your chart'}
            </h1>
          </div>
          {/* THE TWO CORNERS THE PHONE HAS: the profile ring on one side and the
              settings gear on the other (catalog.profile / catalog.settings).
              Sign-in, sign-out and "new chart" moved inside Settings, where the
              phone keeps them — three text links across the top of a reading app
              is a website's header, not an app's. */}
          <div className="flex items-center gap-3">
            {entitled && (
              <span className="mr-1 text-[10px] uppercase tracking-[0.28em] text-gold">★ Star</span>
            )}
            {catalog?.profile?.enabled !== false && (
              <button onClick={() => setShowChart(true)} aria-label={catalog?.profile?.label || 'Profile'}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-[12px] text-white/70 transition-colors hover:border-gold/50 hover:text-white">
                {(name || 'P').slice(0, 1).toUpperCase()}
              </button>
            )}
            <button onClick={() => setShowSettings(true)} aria-label="Settings"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-mist text-white/60 transition-colors hover:border-gold/50 hover:text-white">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="12" cy="12" r="3.2" />
                <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 8.9 19.3a1.7 1.7 0 0 0-1.88.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.7 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.7 8.9a1.7 1.7 0 0 0-.34-1.88l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6h.08A1.7 1.7 0 0 0 10.65 3V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 16.2 4.7a1.7 1.7 0 0 0 1.88-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 20.4 9v.08a1.7 1.7 0 0 0 1.56 1.57H22a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.35z" />
              </svg>
            </button>
          </div>
        </header>

        <div className="mt-8">
          {/* THE ORACLE IS THE SCREEN, not a panel on it. It sat in a bordered
              card with a heading over it and a fixed 28rem window inside — a chat
              widget embedded in a page. On the phone the conversation IS the tab,
              edge to edge, and the height follows the viewport rather than a
              number. */}
          {tab === 'oracle' && (
            <div style={{ height: 'calc(100dvh - 15rem)', minHeight: '26rem' }}>
              <div className="h-full">
                <Oracle
                  kundli={session.kundli}
                  name={name}
                  store={catalog?.store}
                  catalog={catalog}
                  system={session?.profile?.system}
                  language={session?.profile?.language || 'en'}
                  onOpenSection={openSection}
                  onUpgrade={() => { setSection(null); setShowPaywall(true); }}
                />
              </div>
            </div>
          )}

          {/* HOME — the app's landing screen, and it did not exist here at all.
              It is not a screen this file designs: catalog.home is a list of
              blocks (today the time wheels and a card into Explore) and Home
              renders that list. */}
          {tab === 'home' && (
            <Home
              catalog={catalog}
              kundli={session.kundli}
              language={session?.profile?.language || 'en'}
              onOpen={openSection}
              onTab={setTab}
            />
          )}

          {/* The app's own feed, composed by the backend. */}
          {tab === 'explore' && (
            <Explore
              catalog={catalog}
              kundli={session.kundli}
              entitled={entitled}
              onOpen={openSection}
            />
          )}

          {/* SETTINGS IS NOT A TAB — it is the gear, as it is on the phone, and
              the chart is not a tab either: it is the profile. Both open over
              the app from the header. */}
          {showSettings && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-void">
              <div className="mx-auto w-full max-w-[860px] px-6 py-10">
                <button onClick={() => setShowSettings(false)}
                        className="mb-8 text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white">
                  ← Back
                </button>
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
              </div>
            </div>
          )}

          {showChart && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-void">
              <div className="mx-auto w-full max-w-[860px] px-6 py-10">
                <button onClick={() => setShowChart(false)}
                        className="mb-8 text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white">
                  ← Back
                </button>
                <Chart kundli={session.kundli} />
              </div>
            </div>
          )}
        </div>

        {/* THE TAB BAR, WHERE A THUMB IS. Fixed to the bottom edge on a phone —
            with the home-indicator inset respected, or the last tab sits under
            it — and a floating pill on a desktop, which keeps the app reading as
            an app rather than as a document with a navbar. */}
        <nav
          className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-black/80 backdrop-blur
                     md:inset-x-auto md:bottom-8 md:left-1/2 md:w-auto md:-translate-x-1/2
                     md:rounded-full md:border md:px-2"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="mx-auto flex max-w-[520px] items-stretch justify-around md:gap-1 md:px-1">
            {TABS.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? 'page' : undefined}
                className={`relative flex-1 whitespace-nowrap px-4 py-4 text-[10px] uppercase tracking-[0.28em] transition-colors md:flex-none md:rounded-full md:py-3 ${
                  tab === t.key ? 'text-white' : 'text-white/35 hover:text-white/70'
                }`}>
                {t.label}
                {tab === t.key && (
                  <span className="absolute inset-x-4 top-0 h-px bg-gold md:inset-x-3 md:top-auto md:bottom-1.5" />
                )}
              </button>
            ))}
          </div>
        </nav>

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
