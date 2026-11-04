import { connection } from 'next/server';
import type { MetadataRoute } from 'next';
import { allUrls } from '@/lib/routes';
import { publishedPosts } from '@/lib/blog';
import { abs } from '@/lib/business';

/** Every live URL. /thank-you/ is noindex, so it is excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const postDates = new Map(publishedPosts().map((p) => [p.path, p.date]));
  const EXCLUDE = new Set(['/thank-you/']);

  return allUrls()
    .filter((url) => !EXCLUDE.has(url))
    .map((url) => ({
      url: abs(url),
      lastModified: postDates.get(url) ?? new Date(),
      changeFrequency: url === '/' ? 'weekly' : 'monthly',
      priority: url === '/' ? 1 : url.split('/').filter(Boolean).length === 1 ? 0.8 : 0.6,
    }));
}
