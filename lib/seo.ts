import type { Metadata } from 'next';
import { business, abs, SITE_URL } from './business';

export function meta({
  title, description, path, image = '/img/brand/logo-square.png', noindex = false, type = 'website',
}: {
  title: string; description: string; path: string;
  image?: string; noindex?: boolean; type?: 'website' | 'article';
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      type, title: `${title} | ${business.name}`, description,
      url: abs(path), siteName: business.name, locale: 'en_US',
      images: [{ url: abs(image), width: 1200, height: 1200, alt: business.name }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [abs(image)] },
  };
}

export { SITE_URL, abs };
