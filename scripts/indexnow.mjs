#!/usr/bin/env node
/**
 * IndexNow — tell Bing (and through it Copilot and ChatGPT search), Yandex,
 * Seznam and Naver that pages changed, instead of waiting to be recrawled.
 * One POST reaches every participating engine.
 *
 *   node scripts/indexnow.mjs                 # every URL in the live sitemap
 *   node scripts/indexnow.mjs /tools /faq     # just these paths
 *
 * Run it AFTER a deploy is live: the engines fetch the key file from the site
 * to prove the request came from its owner. The key is public by design — it
 * lives at /<key>.txt — so it is not a secret and is safe in git.
 */
const SITE = 'https://plutto.space';
const KEY = '213d99bd8aa94062106ba102555a5fe8';

async function sitemapUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap: HTTP ${res.status}`);
  return [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const args = process.argv.slice(2);
const urlList = args.length ? args.map((p) => (p.startsWith('http') ? p : `${SITE}${p.startsWith('/') ? p : `/${p}`}`)) : await sitemapUrls();

const key = await fetch(`${SITE}/${KEY}.txt`).then((r) => (r.ok ? r.text() : ''));
if (key.trim() !== KEY) {
  console.error(`The key file ${SITE}/${KEY}.txt is not live yet — deploy first.`);
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: 'plutto.space', key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
// 200 = accepted, 202 = accepted and the key is still being verified.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URLs`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
