import { connection } from 'next/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import BlogIndex from '@/components/BlogIndex';
import { pageCount } from '@/lib/blog';
import { meta } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  await connection();
  const { n } = await params;
  const page = Number(n);
  if (String(page) !== n || !Number.isInteger(page) || page < 2 || page > pageCount()) notFound();
  return meta({
    title: `Bathroom Remodeling Blog — Page ${n}`,
    description: 'More advice on bathroom remodeling, conversions and accessible bathing across Northern Virginia and Maryland.',
    path: `/blog/page/${n}/`,
  });
}

export default async function Page({ params }: { params: Promise<{ n: string }> }) {
  await connection();
  const { n } = await params;
  const page = Number(n);
  if (String(page) !== n || !Number.isInteger(page) || page < 2 || page > pageCount()) notFound();
  return <BlogIndex page={page} />;
}
