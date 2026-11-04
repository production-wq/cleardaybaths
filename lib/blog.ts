import posts from '@/data/blog-posts.json';
import generated from '@/data/content/generated-posts.json';

export interface Article {
  intro: string;
  sections: { heading: string; paragraphs: string[]; bullets: string[] }[];
  comparison: { caption: string; headers: string[]; rows: string[][] };
  cta: string;
  faqs: { question: string; answer: string }[];
}

export interface Post {
  slug: string; path: string; title: string; date: string;
  status: 'publish' | 'future';
  seoTitle: string; seoDesc: string; excerpt: string; body: string[]; words: number;
  article?: Article;
  image?: { src: string; alt: string; width: number; height: number };
  links?: { href: string; label: string }[];
  reference?: { href: string; label: string };
  notifyOnPublish?: boolean;
}

/** All authored content. Never use this unfiltered collection in public output. */
export const allPosts = ([...posts, ...generated] as Post[]).sort((a, b) => b.date.localeCompare(a.date));
export const PUBLISH_TIME_ZONE = 'America/New_York';
export function publicationDate(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: PUBLISH_TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export const isPublished = (post: Pick<Post, 'date'>, now = new Date()) => post.date <= publicationDate(now);
export const publishedPosts = (now = new Date()) => allPosts.filter(p => isPublished(p, now));

export const PER_PAGE = 12;
export const pageCount = (now = new Date()) => Math.max(1, Math.ceil(publishedPosts(now).length / PER_PAGE));

export const postsForPage = (n: number, now = new Date()) => publishedPosts(now).slice((n - 1) * PER_PAGE, n * PER_PAGE);
export const postBySlug = (slug: string, now = new Date()) => publishedPosts(now).find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
