import type { MetadataRoute } from 'next';
import { allUrls } from '@/lib/routes';
import { allPosts } from '@/lib/blog';
import { abs } from '@/lib/business';

/** Every live URL. /thank-you/ is noindex, so it is excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const postDates = new Map(allPosts.map((p) => [p.path, p.date]));
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
