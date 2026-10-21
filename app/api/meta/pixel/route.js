/**
 * /api/meta/pixel: the Meta pixel and its consent bar as one script, loaded by every marketing page
 * ((site)/layout.js) and by the web app at /app (Plutto-Frontend scripts/build-web.mjs), so both report
 * into one dataset. Until META_PIXEL_ID is set it serves a stub (OFF), so every call site can stay.
 */
// The script defines window.plutto_meta:
//   track(name, data?, { email? })   a standard Meta event
//   open()                           the consent bar (the footer's "Cookie choices")
//   enabled                          false in the stub
// Each event goes to the browser pixel and, with the same event ID, to /api/meta/events for the
// Conversions API, the copy that survives ad blockers and Safari; Meta deduplicates the pair.
// Sent: page views, the reading page opened, a calculator used, a sign-up, a checkout opened, a
// subscription bought (plan price and currency); an email only with a sign-up, SHA-256 hashed in the
// browser. Never a question, a reading, a chat or a birth detail.
import { ASK_FIRST_COUNTRIES } from '../../../lib/analytics/consent';

export const dynamic = 'force-dynamic';

// Consent comes first in the EU, the rest of the EEA, the UK and Switzerland (app/lib/analytics/consent.js,
// the list Google Tag Manager's consent defaults use) and wherever the country is unknown: nothing loads
// or is sent until the visitor accepts, queued events are dropped on refusal. Elsewhere it runs until
// "Cookie choices" turns it off. The answer is kept in localStorage (plutto_ads).
// META_CONSENT_COUNTRIES (comma-separated ISO codes) replaces the list, e.g. to add IN.
const ASK_FIRST = (process.env.META_CONSENT_COUNTRIES || ASK_FIRST_COUNTRIES.join(','))
  .split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);

const OFF = 'window.plutto_meta=window.plutto_meta||{enabled:false,track:function(){},open:function(){},consent:function(){return null}};';

// Plain ES5 in a string: it runs as-is in every browser the site supports, and
// nothing in it is touched by the server's compiler.
const LOADER = String.raw`(function (w, d) {
  if (w.plutto_meta && w.plutto_meta.enabled) return;
  var ID = "__ID__", ASK = __ASK__, KEY = "plutto_ads", API = "/api/meta/events";
  var state = null, queue = [], loaded = false, bar = null, last = null;
  try { state = w.localStorage.getItem(KEY); } catch (e) {}
  if (state !== "granted" && state !== "denied") state = ASK ? null : "granted";

  function uid() {
    try { if (w.crypto && w.crypto.randomUUID) return w.crypto.randomUUID(); } catch (e) {}
    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  }
  function load() {
    if (loaded) return;
    loaded = true;
    var n = w.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
    if (!w._fbq) w._fbq = n;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    var s = d.createElement("script");
    s.async = true; s.src = "https://connect.facebook.net/en_US/fbevents.js";
    (d.head || d.documentElement).appendChild(s);
    w.fbq("init", ID);
  }
  function sha256(text) {
    try {
      var bytes = new TextEncoder().encode(String(text).trim().toLowerCase());
      return w.crypto.subtle.digest("SHA-256", bytes).then(function (buf) {
        return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ("0" + b.toString(16)).slice(-2); }).join("");
      }, function () { return null; });
    } catch (e) { return { then: function (f) { f(null); } }; }
  }
  function send(name, data, email) {
    var id = uid();
    load();
    w.fbq("track", name, data || {}, { eventID: id });
    function post(em) {
      try {
        w.fetch(API, {
          method: "POST", keepalive: true, credentials: "same-origin",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name, id: id, url: w.location.href, data: data || {}, em: em || undefined })
        })["catch"](function () {});
      } catch (e) {}
    }
    if (email) sha256(email).then(post); else post(null);
  }
  function track(name, data, opts) {
    if (state === "denied" || !name) return;
    var email = opts && opts.email;
    if (state === "granted") send(name, data, email); else queue.push([name, data, email]);
  }
  function decide(v) {
    state = v;
    try { w.localStorage.setItem(KEY, v); } catch (e) {}
    hide();
    // Google Tag Manager keeps to the same answer (app/lib/gtm.js set its defaults).
    if (w.gtag) w.gtag("consent", "update", { ad_storage: v, ad_user_data: v, ad_personalization: v, analytics_storage: v });
    if (v === "granted") {
      if (loaded) w.fbq("consent", "grant");
      var q = queue; queue = [];
      for (var i = 0; i < q.length; i++) send(q[i][0], q[i][1], q[i][2]);
    } else {
      queue = [];
      if (loaded) w.fbq("consent", "revoke");
    }
  }

  // THE CONSENT BAR — ink on paper, like the site; above everything, the web app included.
  function hide() { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); bar = null; }
  function button(label, solid) {
    var b = d.createElement("button");
    b.type = "button"; b.textContent = label;
    b.style.cssText = "font:12px/1 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.16em;text-transform:uppercase;padding:12px 16px;border:1.5px solid #111;border-radius:0;cursor:pointer;"
      + (solid ? "background:#111;color:#F2EFE8" : "background:transparent;color:#111");
    return b;
  }
  function open() {
    if (bar) return;
    function mount() {
      bar = d.createElement("div");
      bar.setAttribute("role", "dialog");
      bar.setAttribute("aria-label", "Ad measurement");
      bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:#F2EFE8;color:#111;border-top:2px solid #111;"
        + "padding:14px 16px calc(14px + env(safe-area-inset-bottom, 0px));display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:center;"
        + "font:14px/1.5 'Source Serif 4',Georgia,serif;box-shadow:0 -8px 24px rgba(17,17,17,.08)";
      var p = d.createElement("p");
      p.style.cssText = "margin:0;max-width:620px";
      p.appendChild(d.createTextNode("May Plutto measure its ads with Meta and Google? Only visits, sign-ups and purchases are counted. What you ask and your birth details are never shared. "));
      var a = d.createElement("a");
      a.href = "https://api.plutto.space/privacy#ads"; a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Privacy"; a.style.cssText = "color:#111;text-decoration:underline";
      p.appendChild(a);
      var no = button("No thanks", false), yes = button("Allow", true);
      no.onclick = function () { decide("denied"); };
      yes.onclick = function () { decide("granted"); };
      var row = d.createElement("div");
      row.style.cssText = "display:flex;gap:8px";
      row.appendChild(no); row.appendChild(yes);
      bar.appendChild(p); bar.appendChild(row);
      d.body.appendChild(bar);
    }
    if (d.body) mount(); else d.addEventListener("DOMContentLoaded", mount);
  }

  // PAGE VIEWS, for full loads and for the site's in-page navigation alike.
  var READING = /^\/(magazine|guides|tools|nakshatras|zodiac-signs|grahas|chinese-zodiac|traditions|panchang|sky-calendar|eclipses|transits|mercury-retrograde)(\/|$)/;
  function page() {
    var path = w.location.pathname;
    if (path === last) return;
    last = path;
    track("PageView");
    var m = READING.exec(path);
    if (m) track("ViewContent", { content_category: m[1], content_name: path });
  }
  try {
    var push = w.history.pushState;
    w.history.pushState = function () { var r = push.apply(this, arguments); setTimeout(page, 0); return r; };
    w.addEventListener("popstate", function () { setTimeout(page, 0); });
  } catch (e) {}

  w.plutto_meta = { enabled: true, track: track, open: open, consent: function () { return state; } };
  if (state === null) open();
  page();
})(window, document);
`;

export function GET(request) {
  const id = String(process.env.META_PIXEL_ID || '').replace(/\D/g, '');
  const country = String(request.headers.get('x-vercel-ip-country') || '').toUpperCase();
  const ask = !country || ASK_FIRST.includes(country);
  const body = id ? LOADER.replace('__ID__', id).replace('__ASK__', ask ? 'true' : 'false') : OFF;
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      // Per visitor (it depends on their country), never shared by a cache.
      'Cache-Control': 'private, max-age=600',
    },
  });
}
