'use client';

/**
 * PAYWALL (web) — the same offer as mobile, rendered from the SAME backend copy
 * (catalog.subscription.paywall), so title, length, what each period includes,
 * the auto-renew note and the legal links stay in one place.
 *
 * Billing differs by platform: mobile buys through StoreKit / Play Billing via
 * RevenueCat's native SDK, which does not exist in a browser. The web has two
 * routes and the BACKEND picks between them with one value:
 *
 *   catalog.subscription.webKey set   → RevenueCat Web Billing (lib/revenuecat.js)
 *   webKey blank                      → Stripe Checkout (backend billing.py)
 *
 * Both end at the same `payments` row, so entitlement, the gates and the daily
 * chat limit read one answer whichever route was taken. Keeping Stripe as the
 * fallback means there is no moment where the paywall cannot sell.
 */

import { useEffect, useState } from 'react';
import { createCheckout } from '../lib/api';
import { rcEnabled, rcPlans, rcPurchase } from '../lib/revenuecat';

export default function Paywall({
  catalog, section, signedIn, onSignIn, onClose, userId, email, onPurchased,
}) {
  const sub = catalog?.subscription || {};
  const pw = sub.paywall || {};
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rcOffer, setRcOffer] = useState(null);   // live RevenueCat packages, once loaded

  const useRc = rcEnabled(catalog);

  // Real prices, in the customer's currency, from RevenueCat. Only when it is the
  // active route AND someone is signed in — the packages are fetched for a specific
  // customer, and there is no anonymous purchase path (see lib/revenuecat.js).
  useEffect(() => {
    let live = true;
    if (!useRc || !signedIn || !userId) return undefined;
    rcPlans(catalog, userId).then((p) => { if (live && p.length) setRcOffer(p); });
    return () => { live = false; };
  }, [useRc, signedIn, userId, catalog]);

  const plans =
    rcOffer ||
    (Array.isArray(pw.plansFallback) && pw.plansFallback.length
      ? pw.plansFallback
      : [{ title: 'Plutto Star', period: '' }]);

  const buy = async (plan) => {
    // A subscription has to attach to an account or it can't follow the user to
    // their phone — so sign in first.
    if (!signedIn) { onSignIn?.(); return; }
    setBusy(true);
    setError('');
    try {
      // RevenueCat route: its hosted sheet opens over this page and returns here,
      // so there is no redirect away and back. `false` means they closed it — an
      // ordinary outcome, so say nothing and leave the paywall as it was.
      if (useRc && plan.rcPackage) {
        const ok = await rcPurchase(catalog, userId, plan.rcPackage, {
          email,
          locale: catalog?.language,
        });
        if (ok) onPurchased?.();
        return;
      }
      const { url } = await createCheckout({
        plan: (plan.title || '').toLowerCase(),
        returnUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      });
      if (url) { window.location.href = url; return; }
      setError('Checkout is not available on the web just yet.');
    } catch {
      // Two different failures, and telling someone checkout does not exist when it
      // does — and just broke — sends a willing buyer to an app store for no reason.
      setError(
        useRc
          ? 'That payment could not be completed. Nothing was charged — please try again.'
          : 'Checkout is not available on the web just yet — Plutto Star is on sale in the iOS and Android apps, and your subscription unlocks everything here too.'
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
