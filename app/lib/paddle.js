/**
 * PADDLE — the web's third checkout, and the one that ships.
 *
 * Three routes can sell Plutto Star in a browser and exactly one runs, decided
 * by the BACKEND so neither client has to be rebuilt to change it:
 *
 *   catalog.subscription.paddle.token set → Paddle          (this file)
 *   …else catalog.subscription.webKey set → RevenueCat Web Billing (revenuecat.js)
 *   …else                                  → Stripe Checkout (backend billing.py)
 *
 * WHY PADDLE AND REVENUECAT TOGETHER. Paddle is the merchant of record — it
 * takes the money, handles the tax and owns the receipt. RevenueCat is still the
 * entitlement brain: Paddle's server notifications flow into it, it grants
 * `PLUTTO STAR` exactly as the App Store and Play do, and the backend keeps
 * asking one question of one authority. Nothing downstream learns that a third
 * store exists.
 *
 * THE APP USER ID IS THE WHOLE TRICK
 * ──────────────────────────────────
 * Mobile calls `Purchases.logIn(supabaseUserId)`. Here the same id goes into the
 * checkout as `customData.app_user_id`, and RevenueCat's Paddle integration is
 * configured to read the App User ID out of that exact key. Get it wrong and the
 * purchase is filed under an anonymous customer: the buyer is charged, the
 * entitlement exists, and it belongs to nobody. There is deliberately no
 * anonymous path — no signed-in user, no checkout.
 *
 * PRICES ARE ASKED FOR, NOT ASSUMED. Paddle localises by country, so the button
 * says what this reader will actually be charged (₹, £, $) rather than a
 * converted guess. If the preview fails the paywall falls back to the catalog's
 * `plansFallback`, which is why those should not be left blank.
 */

const SRC = 'https://cdn.paddle.com/paddle/v2/paddle.js';

let _loading = null;
let _ready = false;

/** The Paddle config the backend is serving, or null when Paddle is not the route. */
export function paddleConfig(catalog) {
  const p = catalog?.subscription?.paddle;
  return p && p.token ? p : null;
}

export function paddleEnabled(catalog) {
  return !!paddleConfig(catalog);
}

/** Load and initialise Paddle.js once. Returns window.Paddle, or null. */
async function paddle(catalog) {
  const cfg = paddleConfig(catalog);
  if (!cfg || typeof window === 'undefined') return null;
  if (_ready && window.Paddle) return window.Paddle;

  if (!_loading) {
    _loading = new Promise((resolve, reject) => {
      const existing = document.querySelector(`script[src="${SRC}"]`);
      if (existing) { existing.addEventListener('load', resolve); existing.addEventListener('error', reject); return; }
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  try {
    await _loading;
  } catch {
    _loading = null;          // a failed load must not poison the next attempt
    return null;
  }
  if (!window.Paddle) return null;

  if (!_ready) {
    // The sandbox is a different set of hosts AND a different token; saying so
    // before Initialize is the only chance to get it right.
    if (cfg.environment === 'sandbox') window.Paddle.Environment.set('sandbox');
    window.Paddle.Initialize({ token: cfg.token });
    _ready = true;
  }
  return window.Paddle;
}

/**
 * The plans, in the reader's own currency, in the shape the paywall renders
 * ({ title, period, price }) with the Paddle price id kept on `priceId`.
 *
 * The catalog decides which plans exist and in what order — `paddle.prices` is
 * a list, so adding a plan or changing an id is a catalog edit.
 */
export async function paddlePlans(catalog) {
  const cfg = paddleConfig(catalog);
  if (!cfg) return [];
  const wanted = (cfg.prices || []).filter((p) => p && p.id);
  if (!wanted.length) return [];

  const rows = wanted.map((p) => ({
    title: p.title || '',
    period: p.period || '',
    price: '',
    priceId: p.id,
  }));

  const P = await paddle(catalog);
  if (!P) return rows;                        // ids are enough to buy with

  try {
    const preview = await P.PricePreview({
      items: wanted.map((p) => ({ priceId: p.id, quantity: 1 })),
    });
    const items = preview?.data?.details?.lineItems || [];
    items.forEach((it) => {
      const id = it?.price?.id;
      const row = rows.find((r) => r.priceId === id);
      if (row) row.price = it?.formattedTotals?.subtotal || '';
    });
  } catch {
    // No price is better than a wrong price: the row keeps the catalog's
    // fallback text and the button still works.
  }
  return rows;
}

/**
 * Open the checkout. Resolves true when Paddle reports the transaction
 * completed, false when the customer closed it — an ordinary outcome, not an
 * error, and the paywall says nothing about it.
 */
export async function paddleCheckout(catalog, userId, priceId, { email } = {}) {
  const cfg = paddleConfig(catalog);
  if (!cfg || !userId || !priceId) return false;
  const P = await paddle(catalog);
  if (!P) throw new Error('paddle unavailable');

  return new Promise((resolve) => {
    let settled = false;
    const done = (v) => { if (!settled) { settled = true; resolve(v); } };

    P.Checkout.open({
      items: [{ priceId, quantity: 1 }],
      ...(email ? { customer: { email } } : {}),
      // READ BY REVENUECAT. The key must match the "metadata field key" set on
      // the Paddle integration in the RevenueCat dashboard — `app_user_id`.
      customData: { app_user_id: userId },
      settings: {
        displayMode: 'overlay',
        theme: 'dark',
        ...(catalog?.language ? { locale: String(catalog.language).slice(0, 2) } : {}),
      },
      eventCallback: (ev) => {
        if (ev?.name === 'checkout.completed') done(true);
        if (ev?.name === 'checkout.closed') done(false);
      },
    });
  });
}
