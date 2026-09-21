import data from '@/data/reviews.json';

export interface Review {
  id: string; rating: number; title?: string; author: string; date: string; body: string;
  relativeDate?: string; avatarUrl?: string; profileUrl?: string;
}

export interface ReviewsData {
  reviews: Review[];
  aggregate: { count: number; value: number | null; best: number; worst: number };
  /** True when this came from the live Google Places API rather than the static fallback. */
  live: boolean;
}

const staticReviews = data.reviews as Review[];

function computeAggregate(reviews: Review[]) {
  return {
    count: reviews.length,
    value: reviews.length
      ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : null,
    best: 5,
    worst: 1,
  };
}

const staticFallback: ReviewsData = { reviews: staticReviews, aggregate: computeAggregate(staticReviews), live: false };

interface PlacesApiReview {
  rating?: number;
  text?: { text?: string };
  originalText?: { text?: string };
  authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
  publishTime?: string;
  relativePublishTimeDescription?: string;
}

interface PlacesApiResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesApiReview[];
}

/**
 * Live Google reviews, fetched server-side and cached for an hour via Next's
 * fetch cache — so the number of Server Components that call this (homepage,
 * every service/city page, the reviews page) never turns into that many
 * separate hits against Google's quota; Next dedupes by URL+revalidate.
 *
 * Falls back to the static `data/reviews.json` snapshot whenever the API key
 * isn't configured yet, the Place ID is missing, or the request fails —
 * the site should never break or go blank because Google's API hiccuped.
 */
export async function getReviewsData(): Promise<ReviewsData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return staticFallback;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask':
          'rating,userRatingCount,reviews.rating,reviews.text,reviews.originalText,reviews.publishTime,'
          + 'reviews.relativePublishTimeDescription,reviews.authorAttribution',
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return staticFallback;

    const json = (await res.json()) as PlacesApiResponse;
    // Rating-only reviews (no written text) are kept, not dropped — the live
    // site's widget shows them too ("This user only left a rating."), and
    // silently hiding them would make the review count on the page disagree
    // with the aggregateRating's reviewCount.
    const reviews: Review[] = (json.reviews ?? []).map((r, i) => ({
      id: `g-${i}`,
      rating: r.rating ?? 5,
      author: r.authorAttribution?.displayName ?? 'Google user',
      date: r.publishTime ? r.publishTime.slice(0, 10) : new Date().toISOString().slice(0, 10),
      relativeDate: r.relativePublishTimeDescription,
      avatarUrl: r.authorAttribution?.photoUri,
      profileUrl: r.authorAttribution?.uri,
      body: (r.text?.text ?? r.originalText?.text ?? '').trim(),
    }));

    if (!reviews.length) return staticFallback;

    return {
      reviews,
      aggregate: {
        count: json.userRatingCount ?? reviews.length,
        value: json.rating ?? computeAggregate(reviews).value,
        best: 5,
        worst: 1,
      },
      live: true,
    };
  } catch {
    return staticFallback;
  }
}
