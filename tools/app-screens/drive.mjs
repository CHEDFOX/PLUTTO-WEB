import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
const S = process.env.WORK || '/tmp/app-screens';
const OUT = process.env.OUT || `${S}/real`;
fs.mkdirSync(OUT, { recursive: true });
const STATIC = '/home/user/Plutto-Backend/static';
const catalog = fs.readFileSync(`${S}/catalog.json`);
const MODE = process.env.MODE || 'chat';

const FONT_CSS = `
@font-face { font-family: "-apple-system"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }
@font-face { font-family: "BlinkMacSystemFont"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }
*, *:focus, *:focus-visible { outline: none !important; }
textarea { height: 20px !important; min-height: 20px !important; }
@font-face { font-family: "System"; src: url(/fonts/inter.woff2) format("woff2"); font-weight: 100 900; }
`;

const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 393, height: 852 }, deviceScaleFactor: process.env.REC ? 2 : 3, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' });
const p = await ctx.newPage();
p.on('pageerror', (e) => console.log('PAGEERROR', e.message));
p.on('console', (m) => { if (m.type() === 'error' || process.env.ALLLOG) console.log('console.' + m.type(), m.text().slice(0, 300)); });

let release = null;
const gate = () => new Promise((r) => { release = r; });
let gatePromise = null;
const seen = new Set();

await p.route(/^https:\/\/(api|auth)\.plutto\.space\/.*|.*supabase.*|.*revenuecat.*/, async (route) => {
  const u = new URL(route.request().url());
  const key = u.pathname; if (!seen.has(key)) { seen.add(key); console.log('REQ', route.request().method(), u.pathname + u.search.slice(0, 60)); }
  if (u.pathname.startsWith('/api/public/catalog')) return route.fulfill({ status: 200, contentType: 'application/json', body: catalog });
  if (u.pathname.startsWith('/static/')) {
    const f = path.join(STATIC, decodeURIComponent(u.pathname.slice('/static/'.length)));
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return route.fulfill({ status: 200, body: fs.readFileSync(f), headers: { 'access-control-allow-origin': '*' } });
    return route.fulfill({ status: 404, body: '' });
  }
  if (u.pathname === '/api/public/divination/tarot') return route.fulfill({ status: 200, contentType: 'application/json', body: fs.readFileSync(`${S}/div_tarot.json`), headers: { 'access-control-allow-origin': '*' } });
  if (u.pathname === '/api/public/divination/tarot/card') {
    let card = 'the_star';
    try { card = JSON.parse(route.request().postData() || '{}').card || card; } catch (_) {}
    await new Promise((r) => setTimeout(r, 700));
    return route.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' },
      body: JSON.stringify({ title: globalThis.__cardTitle || '', overline: '', body: globalThis.__cardBody || '', media: '' }) });
  }
  if (u.pathname.startsWith('/api/public/chat/stream')) {
    if (gatePromise) await gatePromise;
    const reply = globalThis.__reply || '';
    const words = reply.split(' ');
    let body = '';
    for (let i = 0; i < words.length; i += 3) body += 'data: ' + JSON.stringify({ type: 'delta', text: words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '') }) + '\n\n';
    body += 'data: ' + JSON.stringify({ type: 'done', full_text: reply, hooks: globalThis.__hooks || [] }) + '\n\n';
    return route.fulfill({ status: 200, contentType: 'text/event-stream', body, headers: { 'access-control-allow-origin': '*' } });
  }
  return route.fulfill({ status: 200, contentType: 'application/json', body: '{}', headers: { 'access-control-allow-origin': '*' } });
});

await p.addInitScript((css) => {
  const put = () => { const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); };
  if (document.head) put(); else document.addEventListener('DOMContentLoaded', put);
}, FONT_CSS);

await p.goto(`http://localhost:${MODE === 'orb' ? 3223 : 3222}/#${MODE === 'tarot' ? 'chat' : MODE === 'when' ? 'birth' : MODE}`, { waitUntil: 'load' });
await p.waitForFunction(() => window.__ready || window.__err, null, { timeout: 30000 }).catch(() => {});
console.log('err?', await p.evaluate(() => window.__err));
await p.waitForTimeout(3500);
const REC = process.env.REC;
const frames = [];
let cdpRec = null;
if (REC) {
  cdpRec = await ctx.newCDPSession(p);
  cdpRec.on('Page.screencastFrame', async (f) => { frames.push({ t: f.metadata.timestamp, data: f.data }); try { await cdpRec.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (_) {} });
  await cdpRec.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 786, maxHeight: 1704 });
}
const shot = async (name) => { await p.screenshot({ path: `${OUT}/${name}.png` }); console.log('shot', name); };
if (MODE !== 'tarot') await shot(`${MODE}-0`);

if (MODE === 'chat') {
  globalThis.__reply = process.env.REPLY || 'Yes — but not for the reason you keep giving.';
  globalThis.__hooks = [{ id: 'report', label: 'Report', action: { type: 'open_url', url: 'mailto:support@plutto.space' } }];
  const ta = p.locator('textarea').first();
  await ta.click();
  await ta.pressSequentially(process.env.Q || 'Should I take the job?', { delay: 30 });
  await p.waitForTimeout(600);
  await shot('chat-typing');
  gatePromise = gate();
  await p.mouse.click(349, 711);
  await p.waitForTimeout(900);
  await shot('chat-loading');
  release();
  await p.waitForTimeout(2500);
  await shot('chat-done');
}
if (MODE === 'orb') {
  console.log('ORBDOM', await p.evaluate(() => { const c = [...document.querySelectorAll('canvas')]; return JSON.stringify({ n: c.length, s: c.map((x) => [x.width, x.height, x.getBoundingClientRect().width, x.getBoundingClientRect().top]), ck: !!window.CanvasKit, rdy: window.__orbReady, keys: window.__orbKeys, ready: window.__ready, html: document.body.innerHTML.length, hasOrb: document.body.innerHTML.includes('canvas') }); }));
}
if (MODE === 'tarot') {
  const hook = JSON.parse(fs.readFileSync(`${S}/div_hook.json`));
  await p.evaluate((seed) => { let x = seed; Math.random = () => { x = (x * 16807) % 2147483647; return (x - 1) / 2147483646; }; }, Number(process.env.SEED || 7));
  await p.evaluate((sec) => window.__openFeature(sec), hook.action.section);
  await p.waitForTimeout(3000);
  await shot('tarot-open');
  for (const i of [1, 3, 4]) { await p.mouse.click(26 + 51.24 * i + 18, 680); await p.waitForTimeout(REC ? 1000 : 700); }
  await shot('tarot-placed');
  globalThis.__cardBody = process.env.CARD_BODY || '';
  await p.mouse.click(157.5 + 39, 375); await p.waitForTimeout(2600);
  const txt = await p.evaluate(() => document.body.innerText);
  console.log('MODALTEXT', JSON.stringify(txt.slice(0, 400)));
  await shot('tarot-modal');
  if (REC) { await p.waitForTimeout(2500); await p.mouse.click(344, 172); await p.waitForTimeout(1600); }
}
if (MODE === 'language' && REC) await p.waitForTimeout(12000);
if (MODE === 'when') {
  const inp = p.locator('input, textarea').first();
  await p.mouse.click(196, 305); await p.waitForTimeout(400);
  await p.keyboard.type('Asha', { delay: 40 }); await p.keyboard.press('Enter'); await p.waitForTimeout(600);
  await p.mouse.click(196, 548); await p.waitForTimeout(600);
  await shot('when-identity');
  await p.mouse.click(196, 750); await p.waitForTimeout(1500);
  await p.waitForTimeout(3500);
  if (REC) {
    for (const [x, y, n] of [[120.5, 306, 9], [196.5, 306, 5], [272.5, 306, -5], [151.6, 522, 2], [241.4, 522, 30]]) {
      await p.mouse.move(x, y);
      for (let k = 0; k < Math.abs(n); k += 1) { await p.mouse.wheel(0, 32 * Math.sign(n)); await p.waitForTimeout(Math.max(28, 260 / Math.abs(n))); }
      await p.waitForTimeout(700);
    }
    await p.waitForTimeout(2200);
  }
  await p.waitForTimeout(1200);
  await shot('when-0');
}
if (REC) {
  await cdpRec.send('Page.stopScreencast');
  const dir = `${S}/rec-${REC}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
  let list = '';
  frames.forEach((f, i) => { const n = `f${String(i).padStart(5, '0')}.jpg`; fs.writeFileSync(`${dir}/${n}`, Buffer.from(f.data, 'base64')); list += `file '${n}'\nduration ${(i + 1 < frames.length ? frames[i + 1].t - f.t : 0.05).toFixed(4)}\n`; });
  list += `file 'f${String(frames.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(`${dir}/list.txt`, list);
  console.log('frames', frames.length);
}
await b.close();
