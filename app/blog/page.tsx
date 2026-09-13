import type { Metadata } from 'next';
import BlogIndex from '@/components/BlogIndex';
import { meta } from '@/lib/seo';

export const metadata: Metadata = meta({
  title: 'Bathroom Remodeling Blog',
  description: 'Practical advice on tub-to-shower conversions, accessible bathrooms, walk-in tubs and bathroom renovation across Northern Virginia and Maryland.',
  path: '/blog/',
});

export default function Page() {
  return <BlogIndex page={1} />;
}
