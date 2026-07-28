'use client';

/**
 * SETTINGS — rendered from catalog.settings, the same block the app reads.
 *
 * Item types come from the backend (`link`, `action`, `notify`), so adding or
 * reordering a setting is a catalog change that reaches web and mobile at once.
 * Actions the browser genuinely cannot perform (push notifications, in-app
 * purchase management) say so rather than pretending.
 */

import { useState } from 'react';

function Row({ children, onClick, danger, href }) {
  const cls =
    'w-full flex items-center justify-between gap-4 py-4 border-b border-white/5 text-left ' +
    'transition-colors ' +
    (danger ? 'text-red-300/70 hover:text-red-300' : 'text-white/80 hover:text-white');
  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noreferrer">
        {children}
        <span className="text-white/25 text-xs">↗</span>
      </a>
    );
  }
  return (
    <button className={cls} onClick={onClick}>
      {children}
      <span className="text-white/25 text-xs">›</span>
    </button>
  );
}

export default function Settings({
  catalog,
  profile,
  user,
  entitled,
  onSignIn,
  onSignOut,
  onNewChart,
  onDeleteAccount,
}) {
  const s = catalog?.settings || {};
  const items = Array.isArray(s.items) ? s.items : [];
  const [note, setNote] = useState('');

  const act = (it) => {
    switch (it.action) {
      case 'logout':
        onSignOut?.();
        break;
      case 'delete_account':
        if (
          window.confirm(
            it.confirmMessage ||
              'This permanently removes your profile, birth details and conversations. Continue?'
          )
        ) {
          onDeleteAccount?.();
        }
        break;
      case 'subscription':
        setNote(
          entitled
            ? 'Plutto Star is active on this account.'
            : 'Plutto Star is managed in the app — open Plutto on your phone to subscribe or change your plan.'
        );
        break;
      case 'notify':
        setNote('Daily notifications are sent to your phone. Turn them on in the Plutto app.');
        break;
      case 'language':
      case 'personality':
        setNote('This is set in the Plutto app, and follows your account here.');
        break;
      default:
        setNote('');
    }
  };

  return (
    <div className="max-w-lg pb-16">
      <h2 className="font-serif text-2xl font-light text-white">{s.title || 'Settings'}</h2>

      {/* who you are */}
      <div className="mt-8 rounded-xl border border-mist bg-card px-5 py-4">
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">Account</p>
        <p className="mt-2 font-serif text-lg text-white">
          {user?.email || profile?.name || 'Not signed in'}
        </p>
        <p className="mt-1 text-[12px] text-white/40">
          {entitled ? '★ Plutto Star — active' : 'Free'}
        </p>
        {!user && (
          <button
            onClick={onSignIn}
            className="mt-4 text-[10px] uppercase tracking-[0.28em] text-gold hover:brightness-125 transition-all"
          >
            Sign in
          </button>
        )}
      </div>

      {/* backend-driven rows */}
      <div className="mt-10">
        {items.map((it) =>
          it.type === 'link' ? (
            <Row key={it.id} href={it.url}>
              {it.label}
            </Row>
          ) : (
            <Row
              key={it.id}
              danger={it.action === 'delete_account'}
              onClick={() => act(it)}
            >
              {it.label}
            </Row>
          )
        )}

        {/* Always available on web, independent of the catalog. */}
        <Row onClick={onNewChart}>Start a new chart</Row>
      </div>

      {note && <p className="mt-6 text-[13px] leading-relaxed text-white/50">{note}</p>}

      <p className="mt-10 text-[11px] leading-relaxed text-white/25">
        Plutto explores traditional knowledge systems for insight and reflection.
        Readings are not professional medical, legal, or financial advice.
      </p>
    </div>
  );
}
