#!/usr/bin/env node
/**
 * SEARCH SYNC — after every production deploy (and once a day), tell Google and
 * Bing about exactly what changed. Run by .github/workflows/search-sync.yml.
 *
 *   1. Read the live sitemap, fetch every page, and fingerprint what a reader
 *      sees (the <main> text, scripts and build ids stripped). Compare with the
 *      fingerprints from the last run (the snapshot file): new pages and pages
 *      whose visible content changed are the ones to announce. A redeploy that
 *      changes nothing announces nothing — IndexNow asks for exactly that.
 *   2. IndexNow: one POST to api.indexnow.org reaches Bing (and so ChatGPT
 *      search and Copilot), Yandex, Seznam and Naver.
 *   3. Google: re-submit the sitemap through the Search Console API, so Google
 *      re-reads it now instead of on its own schedule. (Google retired sitemap
 *      "pings" in 2023, and its Indexing API is only for job posts and live
 *      streams — this is the supported route.) Needs GSC_SERVICE_ACCOUNT.
 *   4. Bing: re-submit the sitemap through the Bing Webmaster API too, if
 *      BING_WEBMASTER_API_KEY is set (IndexNow already covers the pages).
 *
 * Environment (all optional except where noted):
 *   SITE                     canonical origin (default https://plutto.space)
 *   FETCH_FROM               where to read pages from, if not SITE (testing)
 *   SNAPSHOT                 fingerprint file (default .search-sync/snapshot.json)
 *   GSC_SERVICE_ACCOUNT      the service account's JSON key, as one string
 *   GSC_PROPERTY             default sc-domain:<host of SITE>
 *   BING_WEBMASTER_API_KEY   Bing Webmaster → Settings → API access
 *   DRY_RUN=1                compute and print; submit nothing, save nothing
 *   ALL=1                    announce every page, whatever the snapshot says
 */
import { createHash, createSign } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

const SITE = (process.env.SITE || 'https://plutto.space').replace(/\/$/, '');
const FROM = (process.env.FETCH_FROM || SITE).replace(/\/$/, '');
const HOST = new URL(SITE).host;
const KEY = '213d99bd8aa94062106ba102555a5fe8'; // public by design: served at /<key>.txt
const SNAPSHOT = process.env.SNAPSHOT || '.search-sync/snapshot.json';
const DRY = process.env.DRY_RUN === '1';
const log = (...a) => console.log(...a);

const local = (u) => u.replace(SITE, FROM);

async function get(url, tries = 3) {
  for (let i = 1; ; i++) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'plutto-search-sync' } });
      if (r.ok) return await r.text();
      if (i >= tries || r.status < 500) throw new Error(`HTTP ${r.status}`);
    } catch (e) {
      if (i >= tries) throw new Error(`${url}: ${e.message}`);
    }
    await new Promise((s) => setTimeout(s, 1000 * i));
  }
}

/** What a reader sees: the <main> text, with scripts, styles and tags removed. */
export function fingerprint(html) {
  const main = (html.match(/<main[\s\S]*<\/main>/) || [html])[0];
  const text = main
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return createHash('sha256').update(text).digest('hex').slice(0, 16);
}

async function pool(items, n, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

// ── Google: Search Console API with a service account (RS256 JWT, no deps) ──
const b64u = (x) => Buffer.from(x).toString('base64url');
export function serviceJwt(sa, now = Math.floor(Date.now() / 1000)) {
  const head = b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = b64u(JSON.stringify({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/webmasters', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 }));
  const sig = createSign('RSA-SHA256').update(`${head}.${claims}`).sign(sa.private_key).toString('base64url');
  return `${head}.${claims}.${sig}`;
}

async function googleResubmit() {
  const raw = process.env.GSC_SERVICE_ACCOUNT;
  if (!raw) { log('Google: skipped (no GSC_SERVICE_ACCOUNT secret)'); return true; }
  const sa = JSON.parse(raw);
  const tok = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: serviceJwt(sa) }),
  }).then((r) => r.json());
  if (!tok.access_token) { log('Google: could not get a token —', JSON.stringify(tok)); return false; }
  const property = process.env.GSC_PROPERTY || `sc-domain:${HOST.replace(/^www\./, '')}`;
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/sitemaps/${encodeURIComponent(`${SITE}/sitemap.xml`)}`;
  const r = await fetch(url, { method: 'PUT', headers: { Authorization: `Bearer ${tok.access_token}` } });
  if (r.ok) { log(`Google: sitemap re-submitted to ${property} (HTTP ${r.status})`); return true; }
  log(`Google: HTTP ${r.status} — ${await r.text()}`);
  if (r.status === 403) log('  → add the service account’s email as a user (Full) of the property in Search Console → Settings → Users and permissions.');
  return false;
}

async function bingResubmit() {
  const key = process.env.BING_WEBMASTER_API_KEY;
  if (!key) { log('Bing API: skipped (no BING_WEBMASTER_API_KEY; IndexNow covers Bing)'); return true; }
  const r = await fetch(`https://ssl.bing.com/webmaster/api.svc/json/SubmitFeed?apikey=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ siteUrl: SITE, feedUrl: `${SITE}/sitemap.xml` }),
  });
  log(`Bing API: sitemap re-submitted (HTTP ${r.status})`);
  return r.ok;
}

async function indexNow(urlList) {
  const key = (await get(`${FROM}/${KEY}.txt`)).trim();
  if (key !== KEY) throw new Error(`the IndexNow key file ${SITE}/${KEY}.txt is not live`);
  const r = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
  });
  log(`IndexNow: HTTP ${r.status} for ${urlList.length} URL(s)`); // 200 accepted, 202 accepted, key pending
  if (r.status >= 400) throw new Error(await r.text());
}

async function main() {
  const urls = [...(await get(`${FROM}/sitemap.xml`)).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  log(`Sitemap: ${urls.length} URLs`);
  const prints = await pool(urls, 6, async (u) => [u, fingerprint(await get(local(u)))]);
  const now = Object.fromEntries(prints);
  let before = {};
  try { before = JSON.parse(await readFile(SNAPSHOT, 'utf8')); } catch { log('No snapshot yet: every page counts as new.'); }
  const changed = process.env.ALL === '1' ? urls : urls.filter((u) => before[u] !== now[u]);
  const gone = Object.keys(before).filter((u) => !(u in now));
  log(`Changed or new: ${changed.length}${gone.length ? ` · removed from the sitemap: ${gone.length}` : ''}`);
  for (const u of changed.slice(0, 40)) log(`  ${u.replace(SITE, '') || '/'}`);
  if (changed.length > 40) log(`  … and ${changed.length - 40} more`);

  if (DRY) { log('DRY_RUN: nothing submitted, snapshot not saved.'); return; }
  let ok = true;
  if (changed.length || gone.length) {
    // Removed pages are announced too: IndexNow lets the engine see the 404 sooner.
    await indexNow([...changed, ...gone].slice(0, 10000));
    ok = (await googleResubmit()) && ok;
    ok = (await bingResubmit()) && ok;
  } else {
    log('Nothing changed: nothing to announce.');
  }
  await mkdir(dirname(SNAPSHOT), { recursive: true });
  await writeFile(SNAPSHOT, JSON.stringify(now));
  if (!ok) process.exitCode = 1; // the pages were announced; a re-submit failed — show it in the run
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e.message); process.exit(1); });
