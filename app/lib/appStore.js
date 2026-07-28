/**
 * SMART STORE LINK — send each visitor to the right store for the device
 * they are actually holding.
 *
 * URLs come from the catalog (`catalog.store`) when the backend supplies them,
 * so the real Apple link can be dropped in the moment the app is approved with
 * no web release. The defaults below are the fallback when the catalog is not
 * loaded yet (the panel must never render a dead button).
 */

const ANDROID_PACKAGE = 'space.plutto.app';

export const DEFAULT_STORE = {
  // Filled in once the App Store id exists: https://apps.apple.com/app/id<ID>.
  // Until then we send iOS visitors to an App Store search for Plutto, which is
  // a real destination — never a 404.
  ios: '',
  android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  fallback: 'https://plutto.space',
};

const IOS_SEARCH = 'https://apps.apple.com/search?term=plutto';

/**
 * Which platform is this? Returns 'ios' | 'android' | 'desktop'.
 *
 * iPadOS is the awkward one: since iPadOS 13 Safari reports a *Macintosh* user
 * agent, so an iPad is only distinguishable from a Mac by the presence of touch
 * points. Without that check every iPad would be sent to the desktop state.
 */
export function detectPlatform(ua, nav) {
  if (typeof window === 'undefined' && !ua) return 'desktop';
  const agent = ua ?? (typeof navigator !== 'undefined' ? navigator.userAgent : '') ?? '';
  const n = nav ?? (typeof navigator !== 'undefined' ? navigator : null);

  if (/android/i.test(agent)) return 'android';
  if (/iPhone|iPod/i.test(agent)) return 'ios';
  if (/iPad/i.test(agent)) return 'ios';
  // iPadOS masquerading as macOS — a Mac has no touch screen.
  if (/Macintosh/i.test(agent) && n && (n.maxTouchPoints || 0) > 1) return 'ios';
  return 'desktop';
}

/** The store URL for a platform, preferring the catalog's values. */
export function storeUrl(platform, store) {
  const s = { ...DEFAULT_STORE, ...(store || {}) };
  if (platform === 'ios') return s.ios || IOS_SEARCH;
  if (platform === 'android') return s.android || DEFAULT_STORE.android;
  return s.fallback || DEFAULT_STORE.fallback;
}

/** Label for the button, given the detected platform. */
export function storeLabel(platform) {
  if (platform === 'ios') return 'Download on the App Store';
  if (platform === 'android') return 'Get it on Google Play';
  return 'Get the app';
}
