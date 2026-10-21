/** Where "Get the app" sends a visitor: the store for their device, the web app on Apple handhelds, or the download band. */

const ANDROID_PACKAGE = 'space.plutto.app';

/**
 * The Play listing is public. Flip IOS_LIVE (and put the id in DEFAULT_STORE.ios) when the App Store listing is
 * live: the badge becomes a link and "Get the app" on an iPhone goes to it. Until then an iPhone gets the download band.
 */
export const ANDROID_LIVE = true;
export const IOS_LIVE = false;

/**
 * On an iPhone or iPad "get the app" opens the web app with ?install=1, which shows its Add to Home Screen steps at
 * once, on the sign-in screen too, so the Home Screen copy is the one signed in to. False sends them to the App Store
 * (once IOS_LIVE).
 */
export const IOS_WEB_APP = true;
export const WEB_APP_INSTALL = '/app?install=1';
export const PLAY_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const DEFAULT_STORE = {
  // https://apps.apple.com/app/id<ID> once the App Store id exists; while empty, iOS gets an App Store search for
  // Plutto (IOS_SEARCH), never a 404.
  ios: '',
  android: `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`,
  fallback: 'https://plutto.space',
};

const IOS_SEARCH = 'https://apps.apple.com/search?term=plutto';

/**
 * 'ios' | 'android' | 'desktop'. Since iPadOS 13 Safari reports a Macintosh user agent: an iPad is told from a Mac
 * only by its touch points, and without that check every iPad would get the desktop state.
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

/** The store URL for a platform. */
export function storeUrl(platform) {
  const s = DEFAULT_STORE;
  if (platform === 'ios') return s.ios || IOS_SEARCH;
  if (platform === 'android') return s.android || DEFAULT_STORE.android;
  return s.fallback || DEFAULT_STORE.fallback;
}

/**
 * Where "Get the app" goes for this visitor: the store that is live for the
 * device in their hand, else the download band on the page.
 */
export function getAppHref(platform) {
  if (platform === 'ios' && IOS_WEB_APP) return WEB_APP_INSTALL;
  if (platform === 'android' && ANDROID_LIVE) return storeUrl('android');
  if (platform === 'ios' && IOS_LIVE) return storeUrl('ios');
  return '/#download';
}
