/**
 * /api/meta/events: the server copy of each pixel event, forwarded to Meta's Conversions API with the
 * visitor's IP, user agent and _fbp/_fbc cookies. Posted by the /api/meta/pixel loader (after consent where
 * it is asked) with the browser event's ID, so Meta deduplicates the pair.
 */
// Env (Vercel project settings):
//   META_PIXEL_ID          the dataset ID (also turns the loader on)
//   META_CAPI_TOKEN        the Conversions API access token; secret, server only
//   META_TEST_EVENT_CODE   optional: route events to Events Manager, Test events
//   META_GRAPH_VERSION     optional: the Graph API version (default below)
// Accepts only the standard events the site sends, only the fields below, and an email only as a
// SHA-256 hash. Logs nothing but a status.
export const dynamic = 'force-dynamic';

const GRAPH = process.env.META_GRAPH_VERSION || 'v23.0';
const EVENTS = new Set(['PageView', 'ViewContent', 'Lead', 'CompleteRegistration', 'InitiateCheckout', 'StartTrial', 'Subscribe', 'Purchase']);
const MONEY = new Set(['InitiateCheckout', 'StartTrial', 'Subscribe', 'Purchase']);
const HOSTS = /^https:\/\/(www\.)?plutto\.space(\/|$)|^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/;

function text(v, max) {
  return typeof v === 'string' && v.length && v.length <= max ? v : undefined;
}

function customData(name, d) {
  if (!d || typeof d !== 'object') return undefined;
  const out = {};
  const cat = text(d.content_category, 60); if (cat) out.content_category = cat;
  const nm = text(d.content_name, 200); if (nm) out.content_name = nm;
  if (MONEY.has(name)) {
    const value = Number(d.value);
    const currency = String(d.currency || '').toUpperCase();
    if (Number.isFinite(value) && value >= 0 && value <= 100000 && /^[A-Z]{3}$/.test(currency)) {
      out.value = Math.round(value * 100) / 100;
      out.currency = currency;
    }
    const plan = text(d.content_ids?.[0], 80); if (plan) out.content_ids = [plan];
  }
  return Object.keys(out).length ? out : undefined;
}

function cookie(header, name) {
  const m = new RegExp(`(?:^|;\\s*)${name}=([^;]+)`).exec(header || '');
  return m ? decodeURIComponent(m[1]) : undefined;
}

export async function POST(request) {
  const id = String(process.env.META_PIXEL_ID || '').replace(/\D/g, '');
  const token = process.env.META_CAPI_TOKEN;
  if (!id || !token) return new Response(null, { status: 204 });

  // Only this site's own pages may post here.
  const origin = request.headers.get('origin') || '';
  if (origin && !HOSTS.test(origin)) return new Response(null, { status: 403 });

  let b;
  try { b = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const name = b?.name;
  const eventId = text(b?.id, 64);
  const url = text(b?.url, 2000);
  if (!EVENTS.has(name) || !eventId || !url || !HOSTS.test(url)) return new Response(null, { status: 400 });

  const cookies = request.headers.get('cookie');
  let fbc = cookie(cookies, '_fbc');
  if (!fbc) {
    // The visit that arrived from an ad, before the pixel had set its cookie.
    try {
      const click = new URL(url).searchParams.get('fbclid');
      if (click) fbc = `fb.1.${Date.now()}.${click}`;
    } catch {}
  }
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || request.headers.get('x-real-ip') || undefined;
  const user = {
    client_ip_address: ip,
    client_user_agent: text(request.headers.get('user-agent'), 1000),
    fbp: cookie(cookies, '_fbp'),
    fbc,
    em: /^[a-f0-9]{64}$/.test(b?.em || '') ? [b.em] : undefined,
  };

  const payload = {
    data: [{
      event_name: name,
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      event_source_url: url,
      action_source: 'website',
      user_data: user,
      custom_data: customData(name, b?.data),
    }],
    ...(process.env.META_TEST_EVENT_CODE ? { test_event_code: process.env.META_TEST_EVENT_CODE } : {}),
  };

  try {
    const r = await fetch(`https://graph.facebook.com/${GRAPH}/${id}/events?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!r.ok) console.warn(`[meta capi] ${name} → ${r.status}`);
  } catch {
    console.warn(`[meta capi] ${name} → unreachable`);
  }
  return new Response(null, { status: 204 });
}
