/**
 * REVENUECAT (web) — the same billing brain the phone uses, in a browser.
 *
 * Mobile buys through StoreKit / Play Billing via `react-native-purchases`. That
 * package is native-only, so the web uses RevenueCat's own web SDK,
 * `@revenuecat/purchases-js`, against a Web Billing app in the same RevenueCat
 * project. Different SDK, same project, same entitlement.
 *
 * WHY THIS IS SAFE TO ADD BESIDE STRIPE
 * ────────────────────────────────────
 * The web already checks out through Stripe (backend billing.py), and that still
 * works. Which one runs is decided by ONE backend value: catalog.subscription.webKey.
 * Blank → Stripe, as today. Filled → RevenueCat. No web deploy switches it, and
 * there is never a window where neither works.
 *
 * Both routes end in the same place — a row in `payments` keyed by the Supabase
 * user id — because the RevenueCat webhook the phone already uses is store-agnostic
 * and upserts on `app_user_id`. So `/billing/entitlement`, the section gates and the
 * daily chat limit all keep reading ONE answer, and none of them had to learn that
 * a second payment route exists.
 *
 * THE APP USER ID IS THE WHOLE TRICK
 * ──────────────────────────────────
 * Mobile calls `Purchases.logIn(supabaseUserId)`. We configure with the SAME id, so
 * RevenueCat treats a phone and a browser as one customer: buy on the web, open the
 * app, already subscribed — no "Restore". Get this wrong and you have two customers
 * and a support ticket. There is deliberately NO anonymous path: without a signed-in
 * user we do not configure at all, because a purchase made against a generated id
 * belongs to nobody and cannot be recovered.
 */

let _purchases = null;
let _userId = null;

/** Is RevenueCat the configured web billing route? Backend decides, not the client. */
export function rcEnabled(catalog) {
  return !!catalog?.subscription?.webKey;
}

/**
 * Configure (once) for this signed-in user, or re-point an existing instance at a
 * different user after a sign-out/sign-in. Returns null when RevenueCat is not the
 * active route or nobody is signed in — callers fall back to Stripe.
 */
export async function rcInit(catalog, userId) {
  if (!rcEnabled(catalog) || !userId) return null;
  const { Purchases } = await import('@revenuecat/purchases-js');

  if (_purchases && _userId === userId) return _purchases;
  if (_purchases && _userId !== userId) {
    // Same tab, different account. Re-pointing is required: leaving the old id in
    // place would file this person's purchase under the previous user.
    try {
      await _purchases.changeUser(userId);
      _userId = userId;
      return _purchases;
    } catch {
      _purchases = null;   // fall through to a clean configure
    }
  }
  _purchases = Purchases.configure({
    apiKey: catalog.subscription.webKey,
    appUserId: userId,
  });
  _userId = userId;
  return _purchases;
}

/**
 * The purchasable packages of the configured offering, normalised to the shape the
 * paywall already renders for Stripe ({ title, period, price }) with the RevenueCat
 * package kept on `rcPackage` for the purchase call.
 */
export async function rcPlans(catalog, userId) {
  const p = await rcInit(catalog, userId);
  if (!p) return [];
  try {
    const offerings = await p.getOfferings();
    const wanted = catalog?.subscription?.offering;
    const offering =
      (wanted && offerings?.all?.[wanted]) || offerings?.current || null;
    const packages = offering?.availablePackages || [];
    return packages.map((pkg) => {
      const opt = pkg.webBillingProduct || pkg.rcBillingProduct || {};
      return {
        title: opt.title || pkg.identifier,
        period: opt.normalPeriodDuration || '',
        price: opt.currentPrice?.formattedPrice || '',
        rcPackage: pkg,
      };
    });
  } catch {
    return [];
  }
}

/**
 * Run RevenueCat's hosted checkout for one package. Resolves true when the purchase
 * completed, false when the customer closed the sheet — a cancel is an ordinary
 * outcome, not an error, and must not surface as one.
 */
export async function rcPurchase(catalog, userId, rcPackage, { email, locale } = {}) {
  const p = await rcInit(catalog, userId);
  if (!p || !rcPackage) return false;
  try {
    await p.purchase({
      rcPackage,
      ...(email ? { customerEmail: email } : {}),
      ...(locale ? { selectedLocale: locale } : {}),
    });
    return true;
  } catch (e) {
    // The SDK throws on cancellation as well as on real failures, so both arrive
    // here and have to be told apart (ErrorCode: 1 = UserCancelled, 6 = already
    // purchased). Cancel is silent. "Already purchased" is a SUCCESS from the
    // customer's side — they hold the subscription — and reporting it as a failed
    // payment to someone who is already paying is the worst of the three outcomes.
    const code = Number(e?.errorCode ?? e?.code);
    if (code === 6) return true;
    if (code === 1 || String(e?.message || '').toLowerCase().includes('cancel')) return false;
    throw e;
  }
}

/**
 * Whether RevenueCat currently considers this customer entitled.
 *
 * NOT the app's source of truth — `/billing/entitlement` is, because it reads the
 * `payments` table that both webhooks feed. This is for the seconds right after a
 * purchase, before the webhook has landed, so the paywall can close immediately
 * instead of making someone who has just paid sit and look at it.
 */
export async function rcEntitled(catalog, userId) {
  const p = await rcInit(catalog, userId);
  if (!p) return false;
  try {
    const info = await p.getCustomerInfo();
    const ent = catalog?.subscription?.entitlement || 'pro';
    const active = info?.entitlements?.active || {};
    // Match the configured entitlement, but accept ANY active one rather than
    // reporting a paying customer as unpaid over an identifier mismatch.
    return !!active[ent] || Object.keys(active).length > 0;
  } catch {
    return false;
  }
}
