import data from '@/data/reviews.json';

export interface Review {
  id: string; rating: number; title: string; author: string; date: string; body: string;
}

export const reviews = data.reviews as Review[];

/**
 * Computed, never hardcoded. If a review is added or removed, the rating shown
 * on the page and the rating in JSON-LD move together — the only way a review
 * snippet stays truthful.
 */
export const aggregate = {
  count: reviews.length,
  value: reviews.length
    ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : null,
  best: 5,
  worst: 1,
};
