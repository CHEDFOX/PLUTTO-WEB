// Records the REAL ChatPanel (web harness) answering, streamed word by word.
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const S = process.env.WORK || '/tmp/app-screens';
const OUT = `${S}/real`; fs.mkdirSync(OUT, { recursive: true });
const VID = `${S}/vid`; fs.rmSync(VID, { recursive: true, force: true }); fs.mkdirSync(VID);
const STATIC = '/home/user/Plutto-Backend/static';
const catalog = fs.readFileSync(`${S}/catalog.json`);
const EX = JSON.parse(fs.readFileSync(`${S}/exchanges.json`, 'utf8'));

const CSS = `
textarea, input { outline: none !important; }
textarea { height: 20px !important; min-height: 20px !important; }
@font-face { font-family: "-apple-system"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "BlinkMacSystemFont"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "System"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: process.env.VIDEO ? 2 : 3, isMobile: true, hasTouch: true });
const T0 = Date.now();
const p = await ctx.newPage();
p.on('pageerror', (e) => { if (!/Billing/.test(e.message)) console.log('PAGEERROR', e.message); });

await p.route(/^https:\/\/(api|auth)\.plutto\.space\/.*|.*supabase.*|.*revenuecat.*/, async (route) => {
  const u = new URL(route.request().url());
  if (u.pathname.startsWith('/api/public/catalog')) return route.fulfill({ status: 200, contentType: 'application/json', body: catalog });
  if (u.pathname.startsWith('/static/')) {
    const f = path.join(STATIC, decodeURIComponent(u.pathname.slice(8)));
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'access-control-allow-origin': '*' } });
    return route.fulfill({ status: 404, body: '' });
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '{}', headers: { 'access-control-allow-origin': '*' } });
});

// The chat stream arrives through XHR progress events in the app, so the fake
// lives in the page: the same `data:` events, a few words at a time.
await p.addInitScript(({ css, ex }) => {
  const put = () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  if (document.head) put(); else document.addEventListener('DOMContentLoaded', put);
  let turn = 0;
  const X = window.XMLHttpRequest;
  window.XMLHttpRequest = function () {
    const real = new X(); let url = '';
    const fake = { readyState: 0, status: 0, responseText: '', onprogress: null, onload: null, onerror: null, onreadystatechange: null,
      open(m, u) { url = u; if (!/chat\/stream/.test(u)) real.open(m, u, true); },
      setRequestHeader(k, v) { if (!/chat\/stream/.test(url)) real.setRequestHeader(k, v); },
      abort() {}, getAllResponseHeaders() { return ''; },
      send(body) {
        if (!/chat\/stream/.test(url)) {
          real.onload = () => { fake.status = real.status; fake.responseText = real.responseText; fake.readyState = 4; fake.onreadystatechange && fake.onreadystatechange(); fake.onload && fake.onload(); };
          real.onerror = (e) => fake.onerror && fake.onerror(e);
          return real.send(body);
        }
        const e = ex[turn++ % ex.length];
        const words = e.a.split(' ');
        let i = 0; fake.status = 200; fake.readyState = 3;
        const tick = () => {
          if (i < words.length) {
            const n = 1 + Math.floor(Math.random() * 2);
            const chunk = words.slice(i, i + n).join(' ') + (i + n < words.length ? ' ' : '');
            i += n;
            fake.responseText += 'data: ' + JSON.stringify({ type: 'delta', text: chunk }) + '\n\n';
            fake.onprogress && fake.onprogress();
            setTimeout(tick, 55);
          } else {
            fake.responseText += 'data: ' + JSON.stringify({ type: 'done', full_text: e.a, hooks: e.hooks }) + '\n\n';
            fake.readyState = 4; fake.onprogress && fake.onprogress(); fake.onreadystatechange && fake.onreadystatechange(); fake.onload && fake.onload();
          }
        };
        setTimeout(tick, e.think || 1700);
      } };
    return fake;
  };
}, { css: CSS, ex: EX });

await p.goto('http://localhost:3222/#chat', { waitUntil: 'load' });
await p.waitForFunction(() => window.__ready, null, { timeout: 30000 });
await p.waitForTimeout(2500);
const shot = (n) => p.screenshot({ path: `${OUT}/${n}.png` });
await shot('chat-empty');
const TS = Date.now();
const frames = [];
let cdp = null;
if (process.env.VIDEO) {
  cdp = await ctx.newCDPSession(p);
  cdp.on('Page.screencastFrame', async (f) => {
    frames.push({ t: f.metadata.timestamp, data: f.data });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (_) {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 786, maxHeight: 1704, everyNthFrame: 1 });
}
for (let k = 0; k < EX.length; k += 1) {
  const ta = p.locator('textarea').first();
  await ta.click();
  await ta.pressSequentially(EX[k].q, { delay: 70 });
  await p.waitForTimeout(500);
  if (k === 0) await shot('chat-typing');
  await p.mouse.click(349, 711);
  await p.waitForTimeout(900);
  if (k === 0) await shot('chat-loading');
  const words = EX[k].a.split(' ').length;
  await p.waitForTimeout(1700 + words * 40 + 900);
  await p.waitForTimeout(EX[k].hold || 2500);
  await shot(`chat-done-${k}`);
}
const TE = Date.now();
if (cdp) {
  await cdp.send('Page.stopScreencast');
  let list = '';
  frames.forEach((f, i) => {
    const name = `f${String(i).padStart(5, '0')}.jpg`;
    fs.writeFileSync(`${VID}/${name}`, Buffer.from(f.data, 'base64'));
    const d = i + 1 < frames.length ? frames[i + 1].t - f.t : 0.5;
    list += `file '${name}'\nduration ${Math.max(0.001, d).toFixed(4)}\n`;
  });
  list += `file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(`${VID}/list.txt`, list);
  console.log('frames', frames.length);
}
fs.writeFileSync(`${S}/vid/times.json`, JSON.stringify({ start: (TS - T0) / 1000, end: (TE - T0) / 1000 }));
await p.close();
await ctx.close();
await b.close();
console.log('video', fs.readdirSync(VID));
