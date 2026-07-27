/**
 * Local session — the web app keeps the user's profile and computed chart in
 * localStorage. The API is stateless, so this is all the "account" the web app
 * needs to feel continuous. (When web auth lands, this becomes the cache in
 * front of the server-held profile rather than the source of truth.)
 */

const KEY = 'plutto.session.v1';

export function loadSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    return s && s.kundli ? s : null;
  } catch {
    return null;
  }
}

export function saveSession(session) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    /* private mode / quota — the app still works for this visit */
  }
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

/** Stable id so the oracle can dedupe its recommendations across a conversation. */
export function conversationId() {
  if (typeof window === 'undefined') return 'web';
  try {
    let id = window.sessionStorage.getItem('plutto.convo');
    if (!id) {
      id = 'web-' + Math.random().toString(36).slice(2, 10);
      window.sessionStorage.setItem('plutto.convo', id);
    }
    return id;
  } catch {
    return 'web';
  }
}
