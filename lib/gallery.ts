import manifest from '@/data/image-manifest.json';

export interface GalleryImage {
  src: string; category: string; width: number; height: number; source: string;
}
export interface BeforeAfterPair {
  id: string; before: string; after: string;
  width: number; height: number; aspectDrift: number; slider: boolean;
}

/**
 * Filenames excluded from every automated selection — pick(), cityImage(),
 * and the raw gallery export that feeds the /gallery/ grid.
 *
 * The WordPress export bundles manufacturer stock photography alongside real
 * project photos, and a handful of those show identifiable children (in a
 * tub, in swimwear). There is no consent documentation for any model in this
 * export, so images featuring a minor are excluded outright rather than
 * risk-assessed per page. Two "bubble bath" glamour-style adult stock photos
 * are excluded too — they read as generic spa marketing, not demonstrated
 * work, and are a tonal mismatch for a contractor site.
 *
 * This filters the pool once, at the source, so a fix here can't be
 * bypassed by a future call site that forgets to check it.
 */
const EXCLUDE_FROM_SITE = new Set([
  '/img/gallery/bathroom-remodeling10.webp',       // child in tub, swimsuit
  '/img/gallery/bathroom-remodeling11.webp',       // child in tub, shirtless
  '/img/gallery/bathroom-remodeling17.webp',       // two children, shirtless
  '/img/gallery/bath-and-shower-remodel16.webp',   // two children in tub
  '/img/gallery/bath-and-shower-remodel43.webp',   // child in tub, swimsuit
  '/img/gallery/bath-and-shower-remodel89.webp',   // two children in tub
  '/img/gallery/bath-and-shower-remodel27.webp',   // adult, bubble-bath glamour shot
  '/img/gallery/bath-and-shower-remodel44.webp',   // adult, bubble-bath glamour shot
]);

export const gallery = (manifest.gallery as GalleryImage[]).filter(
  (g) => !EXCLUDE_FROM_SITE.has(g.src) && !g.source.includes('elementor/thumbs'),
);
export const beforeAfter = manifest.beforeAfter as BeforeAfterPair[];
export const mascots = manifest.mascot as string[];
export const brand = manifest.brand as Record<string, string>;

export const byCategory = (cat: string) => gallery.filter((g) => g.category === cat);

/**
 * Deterministic pick so a given page always shows the same images across
 * builds — a hash-free rotation keyed on the caller's seed. Random selection
 * would make every deploy a visual diff and break image caching.
 */
export function pick(images: GalleryImage[], count: number, seed: string): GalleryImage[] {
  if (!images.length) return [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const start = h % images.length;
  return Array.from({ length: Math.min(count, images.length) },
    (_, i) => images[(start + i) % images.length]);
}

/** Images whose filename names a city, used as that city's hero where one exists. */
export function cityImage(citySlug: string): GalleryImage | undefined {
  return gallery.find((g) => g.src.includes(`-${citySlug}-`) || g.src.includes(`-in-${citySlug}-`));
}

/** Pairs safe to show in the overlay slider (matched framing). */
export const sliderPairs = beforeAfter.filter((p) => p.slider);
