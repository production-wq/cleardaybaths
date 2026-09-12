import manifest from '@/data/image-manifest.json';

export interface GalleryImage {
  src: string; category: string; width: number; height: number; source: string;
}
export interface BeforeAfterPair {
  id: string; before: string; after: string;
  width: number; height: number; aspectDrift: number; slider: boolean;
}

export const gallery = manifest.gallery as GalleryImage[];
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
