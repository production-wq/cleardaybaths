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
  // Children / consent issues
  '/img/gallery/bathroom-remodeling10.webp',       // child in tub, swimsuit
  '/img/gallery/bathroom-remodeling11.webp',       // child in tub, shirtless
  '/img/gallery/bathroom-remodeling17.webp',       // two children, shirtless
  '/img/gallery/bath-and-shower-remodel16.webp',   // two children in tub
  '/img/gallery/bath-and-shower-remodel43.webp',   // child in tub, swimsuit
  '/img/gallery/bath-and-shower-remodel89.webp',   // two children in tub
  // Stock / off-brand photography
  '/img/gallery/bath-and-shower-remodel27.webp',   // adult, bubble-bath glamour shot
  '/img/gallery/bath-and-shower-remodel44.webp',   // adult, bubble-bath glamour shot
  '/img/gallery/shower-replacement7.webp',         // stock model, maroon towel (pose 1)
  '/img/gallery/shower-replacement22.webp',        // stock model, maroon towel (pose 2)
  '/img/gallery/shower-replacement23.webp',        // stock model, maroon towel (pose 3)
  '/img/gallery/shower-replacement19.webp',        // stock: woman + child, no consent docs
  '/img/gallery/shower-replacement6.webp',         // near-duplicate of shower-replacement5
  // About/team photos — not project work
  '/img/gallery/about-us1.webp',
  '/img/gallery/about-us2.webp',
  '/img/gallery/about-us3.webp',
  '/img/gallery/about-us4.webp',
  '/img/gallery/about-us5.webp',
  '/img/gallery/about-us6.webp',
  '/img/gallery/about-us6-1.webp',
  '/img/gallery/about-us7.webp',
  '/img/gallery/about-us8.webp',
  // WordPress hash-suffixed resize variants (duplicate content, lower resolution)
  '/img/gallery/tub-1-rq5d5yh6fx08wy2903471v4jt387k5wext9jus1oy0.webp',
  '/img/gallery/bath-and-shower-remodel14-rl39op6pmgjv8n8w8h1iog829po9v457bu43l5j820.webp',
  '/img/gallery/bath-and-shower-remodel22-rl39naffdemdtpamgv3nxt166wmgbgjp4uvvo7mhe0.webp',
  '/img/gallery/bath-and-shower-remodel24-rl39re036e8eghc9j4w3b9sjgef2vxtk15b40njo94.webp',
  '/img/gallery/bath-and-shower-remodel28-rl39pdmik5hbmi9e9rltha21pqbtf8u8372q2cizk8.webp',
  '/img/gallery/bath-and-shower-remodel39-rl39ra8qf23961hq539l1aqp2uxm15emomp63jp8y0.webp',
  '/img/gallery/bath-and-shower-remodel4-rl39r8d21e0oitkgg2gbwb7rw36vlr760de74zs1ag.webp',
  '/img/gallery/bath-and-shower-remodel48-rl39pvhg605rr3jgdhbqanjt01vshht4hngy6lsia0.webp',
  '/img/gallery/bath-and-shower-remodel6-rl39qi1kq10nhqmopr2ryhuv9aslm8aokr4lp8v24o.webp',
  '/img/gallery/bath-and-shower-remodel60-rl39nwzjxfh9kcdut4uplnc8g5j9g7197yjj6up18o.webp',
  '/img/gallery/bath-and-shower-remodel64-rl39oa5al3za2vuqoajhkk0orjqefyhhxrobwq5itk.webp',
  '/img/gallery/bath-and-shower-remodel65-rl39qu9h6vhdoo4xqecxcwruzb4dean6yflwxucxvs.webp',
  '/img/gallery/bath-and-shower-remodel66-rl39oeuhja5poxnwwukmf0tzqh38ig05mexrb3yjyg.webp',
  '/img/gallery/bath-and-shower-remodel72-rl39qg5wccy2uipf0q9itiby2j1v6u37whtmqoxuh4.webp',
  '/img/gallery/bath-and-shower-remodel85-rl39pgg14nl6lc5atatp6rcfhvxx2c5f3l16i6et1k.webp',
  // Content duplicates — same photo filed under multiple WordPress categories
  '/img/gallery/bath-and-shower-remodel1.webp',    // = shower-replacement27
  '/img/gallery/bath-and-shower-remodel3.webp',    // = bathroom-remodeling18
  '/img/gallery/bath-and-shower-remodel4.webp',    // = bathroom-remodeling23
  '/img/gallery/bath-and-shower-remodel5.webp',    // = bathroom-remodeling8
  '/img/gallery/bath-and-shower-remodel6.webp',    // = bathroom-remodeling6
  '/img/gallery/bath-and-shower-remodel11.webp',   // = shower-replacement6
  '/img/gallery/bath-and-shower-remodel12.webp',   // = shower-replacement25
  '/img/gallery/bath-and-shower-remodel18.webp',   // = shower-replacement18
  '/img/gallery/bath-and-shower-remodel19.webp',   // = shower-replacement23
  '/img/gallery/bath-and-shower-remodel21.webp',   // = shower-replacement7
  '/img/gallery/bath-and-shower-remodel22.webp',   // = shower-replacement1
  '/img/gallery/bath-and-shower-remodel29.webp',   // = shower-replacement11
  '/img/gallery/bath-and-shower-remodel30.webp',   // = shower-replacement12
  '/img/gallery/bath-and-shower-remodel32.webp',   // = bath-and-shower-remodel26
  '/img/gallery/bath-and-shower-remodel33.webp',   // = shower-replacement2
  '/img/gallery/bath-and-shower-remodel34.webp',   // = shower-replacement14
  '/img/gallery/bath-and-shower-remodel36.webp',   // = shower-replacement15
  '/img/gallery/bath-and-shower-remodel37.webp',   // = shower-replacement5
  '/img/gallery/bath-and-shower-remodel38.webp',   // = shower-replacement16
  '/img/gallery/bath-and-shower-remodel39.webp',   // = shower-replacement3
  '/img/gallery/bath-and-shower-remodel40.webp',   // = shower-replacement4
  '/img/gallery/bath-and-shower-remodel41.webp',   // = shower-replacement17
  '/img/gallery/bath-and-shower-remodel46.webp',   // = shower-replacement9
  '/img/gallery/bath-and-shower-remodel48.webp',   // = bathroom-remodeling22
  '/img/gallery/bath-and-shower-remodel49.webp',   // = shower-replacement19
  '/img/gallery/bath-and-shower-remodel50.webp',   // = bath-and-shower-remodel31
  '/img/gallery/bath-and-shower-remodel51.webp',   // = shower-replacement20
  '/img/gallery/bath-and-shower-remodel53.webp',   // = shower-replacement22
  '/img/gallery/bath-and-shower-remodel57.webp',   // = shower-replacement24
  '/img/gallery/bath-and-shower-remodel61.webp',   // = shower-replacement13
  '/img/gallery/bath-and-shower-remodel64.webp',   // = shower-replacement10
  '/img/gallery/bath-and-shower-remodel65.webp',   // = shower-replacement26
  '/img/gallery/bath-and-shower-remodel69.webp',   // = bathroom-remodeling19
  '/img/gallery/bath-and-shower-remodel71.webp',   // = bathroom-remodeling14
  '/img/gallery/bath-and-shower-remodel72.webp',   // = bathroom-remodeling2
  '/img/gallery/bath-and-shower-remodel73.webp',   // = shower-replacement21
  '/img/gallery/bath-and-shower-remodel74.webp',   // = bathroom-remodeling4
  '/img/gallery/bath-and-shower-remodel77.webp',   // = bathroom-remodeling24
  '/img/gallery/bath-and-shower-remodel78.webp',   // = bathroom-remodeling16
  '/img/gallery/bath-and-shower-remodel79.webp',   // = bathroom-remodeling20
  '/img/gallery/bath-and-shower-remodel80.webp',   // = bathroom-remodeling1
  '/img/gallery/bath-and-shower-remodel82.webp',   // = bathroom-remodeling12
  '/img/gallery/bath-and-shower-remodel83.webp',   // = bathroom-remodeling5
  '/img/gallery/bath-and-shower-remodel84.webp',   // = bathroom-remodeling7
  '/img/gallery/bath-and-shower-remodel85.webp',   // = bathroom-remodeling13
  '/img/gallery/bath-and-shower-remodel86.webp',   // = bathroom-remodeling15
  '/img/gallery/bath-and-shower-remodel87.webp',   // = bathroom-remodeling3
  '/img/gallery/bath-and-shower-remodel88.webp',   // = bathroom-remodeling21
  '/img/gallery/bath-and-shower-remodel90.webp',   // = bathroom-remodeling9
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
