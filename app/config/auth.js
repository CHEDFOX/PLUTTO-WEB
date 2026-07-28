/**
 * AUTH CONFIG (web).
 *
 * GOOGLE — the web sign-in is a REDIRECT flow through Supabase, not a native
 * token exchange, so the browser needs no client ID of its own: Supabase holds
 * the web client ID + secret (Authentication → Providers → Google) and performs
 * the exchange server-side. The id below is recorded only so the web, iOS and
 * Android all point at one Google Cloud project (PLUTTO), and so a future
 * One-Tap/GIS integration has it to hand.
 *
 * APPLE — same: Supabase holds the Services ID and key. Web Sign in with Apple
 * goes through Supabase's /authorize endpoint like Google.
 *
 * For either to work in a browser, three lists must contain the site origin —
 * see AUTH_SETUP.md. Nothing here can substitute for that.
 */

export const GOOGLE_OAUTH = {
  // Same Google Cloud project as the app (mirrors Plutto-Frontend/src/config/auth.js).
  webClientId: '750110530601-3f3toctgrlte3itflov4o4idoronoahn.apps.googleusercontent.com',
};

/** Where the provider sends the user back. Must be allow-listed in Supabase. */
export function oauthRedirectTo() {
  if (typeof window === 'undefined') return undefined;
  return `${window.location.origin}/app`;
}

/**
 * Providers offered on the web.
 *
 * 'apple' is deliberately absent: Sign in with Apple on the WEB is not the
 * native flow the app uses — it needs its own Services ID, a domain-association
 * file served from plutto.space, and a .p8 client secret that expires every six
 * months. The code path already exists (Auth.js renders whatever is listed
 * here), so add 'apple' back the day that setup is finished — no other change.
 */
export const SOCIAL_PROVIDERS = ['google'];
