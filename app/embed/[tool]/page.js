/**
 * /embed/<tool>: one calculator alone, for other sites to frame; the only pages that may be framed
 * (next.config.mjs). Noindex with the tool page as canonical, so they never compete with it.
 */
import { notFound } from 'next/navigation';
import MoonWidget from '../../components/tools/MoonWidget';
import GunaWidget from '../../components/tools/GunaWidget';
import { EMBEDS } from '../../lib/content/embeds';

export const dynamicParams = false;
export function generateStaticParams() { return Object.keys(EMBEDS).map((tool) => ({ tool })); }

export async function generateMetadata({ params }) {
  const e = EMBEDS[(await params).tool];
  return e ? { title: { absolute: `${e.title} — Plutto` }, robots: { index: false, follow: true }, alternates: { canonical: e.page } } : {};
}

const WIDGET = { 'moon-sign-nakshatra': MoonWidget, 'kundli-matching': GunaWidget };

export default async function Embed({ params }) {
  const { tool } = await params;
  const e = EMBEDS[tool];
  if (!e) notFound();
  const W = WIDGET[tool];
  return (
    <div data-no-auto-case className="sentence-case font-ui p-5 text-[16px] text-white/80">
      <p className="mb-5 text-[18px] font-semibold text-white">{e.title}</p>
      <W />
      <p className="mt-8 text-[13px] text-white/45">
        Free calculator by <a href={`https://plutto.space${e.page}`} target="_blank" rel="noopener" className="text-white underline decoration-white/30 underline-offset-4">Plutto</a> — computed in your browser; nothing is sent.
      </p>
    </div>
  );
}
