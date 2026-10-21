/**
 * Default share card (next/og) for any plutto.space link without a card of its own, drawn in code
 * from the site's own words.
 */
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'Plutto — astrology you can talk to. Vedic, Western, Chinese, KP and numerology, from your real chart.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage() {
  let planet = null;
  try {
    // 896×1152 — drawn at the same 7:9 so the planet stays round.
    const buf = await readFile(path.join(process.cwd(), 'public', 'planets', 'Neptune.png'));
    planet = `data:image/png;base64,${buf.toString('base64')}`;
  } catch (_) {}
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#000', color: '#fff', position: 'relative', fontFamily: 'sans-serif' }}>
        {planet ? <img src={planet} width={560} height={720} style={{ position: 'absolute', right: -90, top: -45, opacity: 0.9 }} /> : null}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', width: 760 }}>
          <div style={{ fontSize: 30, color: '#A78BFA', fontWeight: 600, letterSpacing: 1 }}>plutto.space</div>
          <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: -3, marginTop: 18, lineHeight: 1 }}>Plutto</div>
          <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: -1, marginTop: 22, lineHeight: 1.15 }}>Astrology you can talk to.</div>
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.62)', marginTop: 26, lineHeight: 1.4 }}>
            Vedic · Western · Chinese · KP · Numerology — the world's traditions, read from your real chart, in your own language.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
