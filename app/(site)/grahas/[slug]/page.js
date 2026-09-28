import { notFound } from 'next/navigation';
import { SECTIONS } from '../../../lib/refpages';
import { RefDetail, detailMeta } from '../../../components/site/Ref';

export const dynamicParams = false;
export function generateStaticParams() { return SECTIONS.grahas.items.map((x) => ({ slug: x.slug })); }
export async function generateMetadata({ params }) { const { slug } = await params; return detailMeta('grahas', slug); }
export default async function Page({ params }) {
  const { slug } = await params;
  if (!SECTIONS.grahas.items.some((x) => x.slug === slug)) notFound();
  return <RefDetail keyName="grahas" slug={slug} />;
}
