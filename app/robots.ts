import type { MetadataRoute } from 'next';
import { abs } from '@/lib/business';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/thank-you/'] }],
    sitemap: abs('/sitemap.xml'),
    host: abs('/'),
  };
}
