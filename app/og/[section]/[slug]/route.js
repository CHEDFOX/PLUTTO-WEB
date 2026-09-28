/**
 * /og/<section>/<slug> — each guide, reference and tool page's own share card,
 * rendered once at build (static params) from app/lib/cards.js. Same look as
 * the home card: black, the violet eyebrow, the page's words, its body's art.
 */
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { CARDS } from '../../../lib/cards';

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(CARDS).map((k) => { const [section, slug] = k.split('/'); return { section, slug }; });
}

export async function GET(_req, { params }) {
  const { section, slug } = await params;
  const c = CARDS[`${section}/${slug}`];
  if (!c) return new Response('Not found', { status: 404 });
  let planet = null;
  if (c.planet) {
    try {
      const buf = await readFile(path.join(process.cwd(), 'public', 'planets', `${c.planet}.png`));
      planet = `data:image/png;base64,${buf.toString('base64')}`;
    } catch (_) {}
  }
  const long = c.title.length > 34;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#000', color: '#fff', position: 'relative', fontFamily: 'sans-serif' }}>
        {planet ? <img src={planet} width={560} height={720} style={{ position: 'absolute', right: -110, top: -45, opacity: 0.9 }} /> : (
          // No art for this body: an orbit, drawn, rather than the wrong planet.
          <div style={{ position: 'absolute', right: -170, top: 45, width: 540, height: 540, borderRadius: 540, border: '1.5px solid rgba(167,139,250,0.28)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 340, height: 340, borderRadius: 340, border: '1.5px solid rgba(167,139,250,0.2)', display: 'flex' }} />
            <div style={{ position: 'absolute', left: 58, top: 108, width: 18, height: 18, borderRadius: 18, background: '#A78BFA' }} />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 80px', width: 780 }}>
          <div style={{ fontSize: 28, color: '#A78BFA', fontWeight: 600, letterSpacing: 1 }}>{c.eyebrow}</div>
          <div style={{ fontSize: long ? 60 : 78, fontWeight: 700, letterSpacing: -2, marginTop: 18, lineHeight: 1.05 }}>{c.title}</div>
          {c.sub ? <div style={{ fontSize: 27, color: 'rgba(255,255,255,0.62)', marginTop: 26, lineHeight: 1.4 }}>{c.sub}</div> : null}
          <div style={{ fontSize: 26, color: 'rgba(255,255,255,0.85)', marginTop: 44, fontWeight: 600 }}>plutto.space</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
