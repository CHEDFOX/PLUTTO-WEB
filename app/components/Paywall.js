'use client';

/**
 * PAYWALL (web) — the same offer as mobile, rendered from the SAME backend copy
 * (catalog.subscription.paywall), so title, length, what each period includes,
 * the auto-renew note and the legal links stay in one place.
 *
 * Billing differs by platform: mobile buys through StoreKit/RevenueCat, which
 * does not exist in a browser, so web checkout goes through Stripe.
 */

import { useState } from 'react';
import { createCheckout } from '../lib/api';

export default function Paywall({ catalog, section, onClose }) {
  const sub = catalog?.subscription || {};
  const pw = sub.paywall || {};
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const plans =
    (Array.isArray(pw.plansFallback) && pw.plansFallback.length
      ? pw.plansFallback
      : [{ title: 'Plutto Star', period: '' }]);

  const buy = async (plan) => {
    setBusy(true);
    setError('');
    try {
      const { url } = await createCheckout({
        plan: (plan.title || '').toLowerCase(),
        returnUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      });
      if (url) { window.location.href = url; return; }
      setError('Checkout is not available on the web just yet.');
    } catch {
      setError(
        'Checkout is not available on the web just yet — Plutto Star is on sale in the iOS and Android apps, and your subscription unlocks everything here too.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-void/95 overflow-y-auto backdrop-blur-sm">
      <div className="mx-auto w-full max-w-lg px-6 py-14">
        <button onClick={onClose}
          className="mb-10 text-[10px] uppercase tracking-[0.32em] text-white/40 hover:text-white transition-colors">
          ✕ Close
        </button>

        <p className="text-[10px] uppercase tracking-[0.32em] text-gold">
          {pw.title || 'Plutto Star'}
        </p>
        <h2 className="mt-3 font-serif text-3xl md:text-4xl font-light leading-tight">
          {pw.subtitle || 'Every reading. Every system.'}
        </h2>

        {section?.title && (
          <p className="mt-4 text-sm text-white/45">
            {section.title} is part of Plutto Star.
          </p>
        )}

        <div className="mt-10 space-y-3">
          {plans.map((p, i) => (
            <button key={i} disabled={busy} onClick={() => buy(p)}
              className="w-full flex items-baseline justify-between rounded-xl border border-mist
                         px-5 py-4 hover:border-gold/60 transition-colors disabled:opacity-50">
              <span className="font-serif text-lg text-white">{p.title}</span>
              <span className="text-gold text-sm">
                {p.price || ''}
                {p.period ? (
                  <span className="text-white/45">
                    {p.price ? ` / ${p.period}` : `per ${p.period}`}
                  </span>
                ) : null}
              </span>
            </button>
          ))}
        </div>

        {pw.priceNote && (
          <p className="mt-4 text-[11px] leading-relaxed text-white/35">{pw.priceNote}</p>
        )}
        {pw.length && (
          <p className="mt-4 text-[11px] leading-relaxed text-white/45">{pw.length}</p>
        )}
        {pw.note && (
          <p className="mt-3 text-[11px] leading-relaxed text-white/35">{pw.note}</p>
        )}

        {error && <p className="mt-6 text-sm leading-relaxed text-white/70">{error}</p>}

        <div className="mt-10 flex gap-6 text-[10px] uppercase tracking-[0.28em] text-white/35">
          {pw.terms && (
            <a href={pw.terms} target="_blank" rel="noreferrer" className="hover:text-white">
              {pw.termsLabel || 'Terms'}
            </a>
          )}
          {pw.privacy && (
            <a href={pw.privacy} target="_blank" rel="noreferrer" className="hover:text-white">
              {pw.privacyLabel || 'Privacy'}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
