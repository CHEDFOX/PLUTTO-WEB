import { notFound } from 'next/navigation';
import { SECTIONS } from '../../../lib/content/refpages';
import { RefDetail } from '../../../components/reference/RefDetail';
import { detailMeta } from '../../../components/reference/refMeta';

export const dynamicParams = false;
export function generateStaticParams() { return SECTIONS.signs.items.map((x) => ({ slug: x.slug })); }
export async function generateMetadata({ params }) { const { slug } = await params; return detailMeta('signs', slug); }
export default async function Page({ params }) {
  const { slug } = await params;
  if (!SECTIONS.signs.items.some((x) => x.slug === slug)) notFound();
  return <RefDetail keyName="signs" slug={slug} />;
}
