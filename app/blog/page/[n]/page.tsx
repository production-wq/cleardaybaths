import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogIndex from '@/components/BlogIndex';
import { pageCount } from '@/lib/blog';
import { meta } from '@/lib/seo';

export const dynamicParams = false;

/** Page 1 lives at /blog/, so pagination starts at 2. /blog/page/2/ is indexed. */
export function generateStaticParams() {
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  return meta({
    title: `Bathroom Remodeling Blog — Page ${n}`,
    description: 'More advice on bathroom remodeling, conversions and accessible bathing across Northern Virginia and Maryland.',
    path: `/blog/page/${n}/`,
  });
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const page = Number(n);
  if (!Number.isInteger(page) || page < 2 || page > pageCount) notFound();
  return <BlogIndex page={page} />;
}
