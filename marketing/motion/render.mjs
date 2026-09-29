#!/usr/bin/env node
/**
 * RENDER — every film, frame by frame, to an MP4 ready for Reels, Shorts and
 * TikTok (1080×1920, 30 fps, H.264 High, yuv420p, faststart).
 *
 *   FFMPEG=/path/to/ffmpeg node marketing/motion/render.mjs            # all films
 *   node marketing/motion/render.mjs talks-back mercury-retrograde     # some
 *   STILLS=1.5,6,12 node marketing/motion/render.mjs talks-back        # stills only, for review
 *
 * Needs Playwright's Chromium and an ffmpeg (FFMPEG, or `ffmpeg` on PATH).
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { chromium } = (() => { try { return require('playwright'); } catch { return require('/opt/node22/lib/node_modules/playwright'); } })();
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../..');
const OUT = process.env.OUT || path.join(HERE, 'out');
const FFMPEG = process.env.FFMPEG || 'ffmpeg';
const PORT = 4100 + Math.floor(Math.random() * 500);
export const FILMS = ['talks-back', 'ask-out-loud', 'vedic-sign', 'mercury-retrograde', 'eclipse-2027', 'saturn-aries', 'nakshatras', 'gunas', 'tarot', 'traditions'];
// The vivid series: the same ten stories, scenes/pop-*.js. `node render.mjs pop` renders all of them.
export const POP_FILMS = FILMS.map((f) => `pop-${f}`);

const server = spawn('python3', ['-m', 'http.server', String(PORT), '--bind', '127.0.0.1', '--directory', ROOT], { stdio: 'ignore' });
const stop = () => server.kill();
process.on('exit', stop);

async function waitServer() {
  for (let i = 0; i < 50; i++) {
    try { await fetch(`http://127.0.0.1:${PORT}/marketing/motion/index.html`); return; } catch { await new Promise((r) => setTimeout(r, 100)); }
  }
  throw new Error('static server did not start');
}

async function renderFilm(browser, id) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', (e) => console.error(`  [${id}] ${e.message}`));
  await page.goto(`http://127.0.0.1:${PORT}/marketing/motion/index.html?scene=${id}`);
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
  const { duration, fps } = await page.evaluate(() => ({ duration: window.__duration, fps: window.__fps }));
  const shot = () => page.screenshot({ type: 'jpeg', quality: 95 });

  if (process.env.STILLS) {
    for (const t of process.env.STILLS.split(',').map(Number)) {
      await page.evaluate((x) => window.__frame(x), t);
      await writeFile(path.join(OUT, `${id}@${t}s.jpg`), await shot());
    }
    console.log(`  ${id}: stills ${process.env.STILLS}`);
    return page.close();
  }

  const file = path.join(OUT, `plutto-${id}.mp4`);
  const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-level', '4.2', '-pix_fmt', 'yuv420p',
    '-r', String(fps), '-movflags', '+faststart', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited ${c}`)))));
  const n = Math.round(duration * fps);
  const t0 = Date.now();
  for (let f = 0; f < n; f++) {
    await page.evaluate((x) => window.__frame(x), f / fps);
    const buf = await shot();
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
  // A poster: the film's most characteristic frame, for the upload screen.
  const posterAt = await page.evaluate(() => window.__poster ?? window.__duration * 0.5);
  await page.evaluate((x) => window.__frame(x), posterAt);
  await writeFile(path.join(OUT, `plutto-${id}-cover.jpg`), await shot());
  console.log(`  ${id}: ${n} frames, ${duration}s → ${path.relative(ROOT, file)} (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  await page.close();
}

/**
 * Decode each app recording into frames/<name>/NNNN.jpg (30 fps) once, and
 * write frames/index.json with the counts. Skipped when already done.
 */
async function prepareFootage() {
  const { readdir, access } = await import('node:fs/promises');
  const src = path.join(ROOT, 'public/app/screens');
  const dir = path.join(HERE, 'frames');
  await mkdir(dir, { recursive: true });
  const index = {};
  for (const f of (await readdir(src)).filter((x) => x.endsWith('.webm'))) {
    const name = f.replace('.webm', '');
    const out = path.join(dir, name);
    try { await access(path.join(out, '0001.jpg')); } catch {
      await mkdir(out, { recursive: true });
      await new Promise((res, rej) => spawn(FFMPEG, ['-v', 'error', '-y', '-i', path.join(src, f), '-vf', 'fps=30', '-q:v', '2', path.join(out, '%04d.jpg')], { stdio: 'inherit' })
        .on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg could not decode ${f}`)))));
    }
    index[name] = (await readdir(out)).filter((x) => x.endsWith('.jpg')).length;
  }
  await writeFile(path.join(dir, 'index.json'), JSON.stringify(index));
}

(async () => {
  await mkdir(OUT, { recursive: true });
  await prepareFootage();
  await waitServer();
  const browser = await chromium.launch();
  const args = process.argv.slice(2);
  const ids = !args.length ? [...FILMS, ...POP_FILMS] : args.flatMap((a) => (a === 'pop' ? POP_FILMS : a === 'noir' ? FILMS : [a]));
  try {
    for (const id of ids) await renderFilm(browser, id);
  } finally {
    await browser.close();
    stop();
  }
})().catch((e) => { console.error(e); stop(); process.exit(1); });
