/**
 * PLUTTO API — the browser client for api.plutto.space.
 *
 * The backend is stateless: every call carries the user's birth data, so the web
 * app needs no session to produce real readings. We keep the same request shapes
 * the mobile app uses (app/api/backend.js in Plutto-Frontend) so both clients
 * stay in lockstep with the API.
 */

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || 'https://api.plutto.space';

const api = (path) => `${API_BASE}/api/public${path}`;

/**
 * Signed-in calls carry the Supabase bearer token, exactly as mobile does, so
 * the server can attribute conversations and entitlement. Signed-out calls still
 * work — the API is stateless and readings need no account.
 */
async function authHeaders() {
  if (typeof window === 'undefined') return {};
  try {
    const { accessToken } = await import('./supabase');
    const t = await accessToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
  } catch {
    return {};
  }
}

async function postJSON(path, body, { signal } = {}) {
  const r = await fetch(api(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify(body),
    signal,
  });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json();
}

/* ─────────────────────────── chart ─────────────────────────── */

/**
 * Compute the full chart. `profile` is { name, gender, language, date:{day,month,year},
 * time:{hour,minute}, place:{name,lat,lng} }.
 *
 * Returns the backend payload as-is. The important part for every later call is
 * `raw.birth_details` — that is what the feature and chat endpoints read.
 */
export async function generateKundli(profile) {
  const data = await postJSON('/kundli/generate', {
    name: profile.name || 'Friend',
    gender: profile.gender || 'other',
    language: profile.language || 'en',
    date: {
      day: Number(profile.date?.day) || 1,
      month: Number(profile.date?.month) || 1,
      year: Number(profile.date?.year) || 2000,
    },
    time: {
      hour: Number(profile.time?.hour) || 12,
      minute: Number(profile.time?.minute) || 0,
    },
    place: {
      name: profile.place?.name || 'New Delhi',
      lat: Number(profile.place?.lat ?? 28.6139),
      lng: Number(profile.place?.lng ?? 77.209),
    },
  });
  if (!data?.success) throw new Error(data?.detail || 'Could not compute the chart.');
  return data;
}

/* ─────────────────────────── places ─────────────────────────── */

export async function searchPlaces(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const d = await postJSON('/places/autocomplete', { input: query.trim() });
    return d?.predictions || d?.data?.predictions || [];
  } catch {
    return [];
  }
}

export async function placeDetails(placeId) {
  try {
    const d = await postJSON('/places/details', { place_id: placeId });
    const r = d?.result || d?.data?.result || d;
    const loc = r?.geometry?.location || r?.location || {};
    return {
      name: r?.name || r?.formatted_address || '',
      lat: loc.lat ?? r?.lat,
      lng: loc.lng ?? r?.lng,
    };
  } catch {
    return null;
  }
}

/* ─────────────────────────── catalog ─────────────────────────── */

export async function getCatalog({ lang = 'en', system } = {}) {
  const qs = new URLSearchParams({ lang, ...(system ? { system } : {}) });
  const r = await fetch(`${api('/catalog')}?${qs}`);
  if (!r.ok) throw new Error(`catalog ${r.status}`);
  return r.json();
}

/* ─────────────────────────── features ─────────────────────────── */

/** Run any catalog feature endpoint (e.g. '/core-chart', '/today-deep'). */
export async function runFeature(endpoint, kundli, { language = 'en', extra } = {}) {
  const path = endpoint.replace(/^\/api\/public/, '');
  return postJSON(path, {
    kundli_data: kundli,
    birth_data: kundli?.raw?.birth_details,
    language,
    tz_offset_min: -new Date().getTimezoneOffset(),
    ...(extra || {}),
  });
}

/* ─────────────────────────── billing (web) ─────────────────────────── */

/**
 * Start a web checkout. StoreKit/RevenueCat is mobile-only, so the browser pays
 * through Stripe. Returns { url } to redirect to; throws if web billing isn't
 * configured on the server yet (the paywall then explains the app is the place
 * to subscribe).
 */
export async function createCheckout({ plan, returnUrl }) {
  return postJSON('/billing/checkout', { plan, return_url: returnUrl });
}

/** Current entitlement for the signed-in user (or an anonymous checkout id). */
export async function getEntitlement(params = {}) {
  try {
    return await postJSON('/billing/entitlement', params);
  } catch {
    return { active: false };
  }
}

/* ─────────────────────────── oracle chat ─────────────────────────── */

/**
 * Stream a reply from the Oracle. Calls `onDelta(text)` as tokens arrive and
 * resolves with { text, hooks } when done.
 *
 * The backend emits Server-Sent Events: `data: {json}\n\n` with
 * type = start | delta | ping | done | error.
 */
export async function streamChat(
  { message, kundli, history = [], language = 'en', system = 'plutto', conversationId },
  onDelta,
  { signal } = {}
) {
  const r = await fetch(api('/chat/stream'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    signal,
    body: JSON.stringify({
      message,
      kundli_data: kundli,
      birth_data: kundli?.raw?.birth_details,
      history: history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      language,
      system,
      conversation_id: conversationId,
    }),
  });

  if (!r.ok || !r.body) {
    // Streaming unavailable (proxy buffering, older browser) — fall back to the
    // non-streaming endpoint so the user still gets an answer.
    const d = await postJSON('/chat', {
      message,
      kundli_data: kundli,
      birth_data: kundli?.raw?.birth_details,
      history: history.slice(-8).map((m) => ({ role: m.role, content: m.content })),
      language,
      system,
      conversation_id: conversationId,
    });
    const text = d?.reply || d?.response || '';
    if (text) onDelta?.(text);
    return { text, hooks: d?.hooks || [] };
  }

  const reader = r.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  let text = '';
  let hooks = [];

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    // SSE frames are separated by a blank line.
    const frames = buf.split('\n\n');
    buf = frames.pop() || '';
    for (const frame of frames) {
      const line = frame.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      let evt;
      try {
        evt = JSON.parse(line.slice(6));
      } catch {
        continue;
      }
      if (evt.type === 'delta' && evt.text) {
        text += evt.text;
        onDelta?.(evt.text);
      } else if (evt.type === 'done') {
        if (evt.full_text) text = evt.full_text;
        hooks = evt.hooks || [];
      } else if (evt.type === 'error') {
        throw new Error(evt.error || 'The oracle went quiet.');
      }
    }
  }
  return { text, hooks };
}
