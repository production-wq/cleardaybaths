import posts from '@/data/blog-posts.json';

export interface Post {
  slug: string; path: string; title: string; date: string;
  status: 'publish' | 'future';
  seoTitle: string; seoDesc: string; excerpt: string; body: string[]; words: number;
}

/** Scheduled posts are included — they were authored and are queued to publish. */
export const allPosts = (posts as Post[]).slice().sort((a, b) => b.date.localeCompare(a.date));

export const PER_PAGE = 12;
export const pageCount = Math.max(1, Math.ceil(allPosts.length / PER_PAGE));

export const postsForPage = (n: number) => allPosts.slice((n - 1) * PER_PAGE, n * PER_PAGE);
export const postBySlug = (slug: string) => allPosts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC',
  });
