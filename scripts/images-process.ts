/**
 * Turns the raw WordPress uploads into a web-ready image set.
 *
 *   npm run images:process
 *
 * The upload folder is 4,325 files but only ~937 are originals, and a large
 * share of those are internal comms screenshots (GroupMe / Messages / Drive)
 * that must never reach the public site. Selection is therefore allowlist-first:
 * a file ships only if it matches a known-good category.
 *
 * Output: public/img/{brand,mascot,gallery,before-after}/ + data/image-manifest.json
 */
import { mkdir, readdir, writeFile, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const SRC = join(ROOT, 'assets/source/uploads');
const MASCOT = join(ROOT, 'assets/source/mascot');
const OUT = join(ROOT, 'public/img');

/** Internal comms screenshots and phone dumps — never publishable. */
const DENY = /screenshot|groupme|messages|drive|^img_|^photo|whatsapp|^fav/i;
/** Known-good photo categories, mapped to a gallery grouping. */
const CATEGORIES: [RegExp, string][] = [
  [/^bath-and-shower-remodel/i, 'bath-and-shower'],
  [/^shower-replacement/i, 'showers'],
  [/^bathroom-remodeling/i, 'bathrooms'],
  [/^tub/i, 'tubs'],
  [/^terry-rose-after/i, 'projects'],
  [/^blouir/i, 'projects'],
  [/^about-us/i, 'about'],
];

/** Before/after pairs verified to have both halves. `7-Before` has no partner. */
const PAIRS = [
  { id: '1', before: '1-Before.jpg', after: '1-After.jpg' },
  { id: '2', before: '2-Before.jpg', after: '2-After.jpg' },
  { id: '3', before: '3-Before.jpg', after: '3-After.jpg' },
  { id: '4', before: '4-Before.jpg', after: '4-After.png' },
  { id: '5', before: '5-Before.jpg', after: '5-After.jpg' },
  { id: '6', before: '6-Before.jpg', after: '6-After.jpg' },
  { id: 'mamu', before: 'Mamu-Before.jpg', after: 'Mamu-After.jpg' },
];

type Manifest = {
  brand: Record<string, string>;
  mascot: string[];
  beforeAfter: { id: string; before: string; after: string; width: number; height: number;
                 aspectDrift: number; slider: boolean }[];
  gallery: { src: string; category: string; width: number; height: number; source: string }[];
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

/** WordPress size variants (-1024x768) and double extensions (.png.webp) are derivatives. */
const isOriginal = (f: string) =>
  /\.(jpe?g|png|webp)$/i.test(f) && !/-\d{2,4}x\d{2,4}\./.test(f) && !/\.(png|jpe?g)\.webp$/i.test(f);

async function emit(input: string | Buffer, outPath: string, width: number) {
  const img = sharp(input).rotate().resize({ width, withoutEnlargement: true });
  const meta = await img.clone().webp({ quality: 82 }).toFile(`${outPath}.webp`);
  await img.clone().avif({ quality: 62 }).toFile(`${outPath}.avif`);
  return { width: meta.width, height: meta.height };
}

async function main() {
  for (const d of ['brand', 'mascot', 'gallery', 'before-after']) {
    await mkdir(join(OUT, d), { recursive: true });
  }
  const manifest: Manifest = { brand: {}, mascot: [], beforeAfter: [], gallery: [] };
  const files = await walk(SRC);

  // ---- brand ----------------------------------------------------------
  const logo = files.find((f) => f.endsWith('logo-transparent-bg-e1774546127425.png'));
  if (logo) {
    await sharp(logo).resize({ width: 620 }).png({ quality: 90 }).toFile(join(OUT, 'brand/logo.png'));
    await sharp(logo).resize({ width: 320 }).webp({ quality: 90 }).toFile(join(OUT, 'brand/logo.webp'));
    // Square OG/schema variant on the brand mint, so it reads on any background.
    await sharp({ create: { width: 1200, height: 1200, channels: 4, background: '#F4F7F5' } })
      .composite([{ input: await sharp(logo).resize({ height: 960 }).toBuffer(), gravity: 'center' }])
      .png()
      .toFile(join(OUT, 'brand/logo-square.png'));
    manifest.brand = {
      logo: '/img/brand/logo.png',
      logoWebp: '/img/brand/logo.webp',
      square: '/img/brand/logo-square.png',
    };
  }

  // ---- mascot ---------------------------------------------------------
  for (const f of (await readdir(MASCOT)).filter((f) => f.endsWith('.png')).sort()) {
    const name = `mascot-${basename(f, '.png')}`;
    await sharp(join(MASCOT, f)).resize({ width: 420, withoutEnlargement: true })
      .webp({ quality: 88 }).toFile(join(OUT, `mascot/${name}.webp`));
    manifest.mascot.push(`/img/mascot/${name}.webp`);
  }

  // ---- before / after -------------------------------------------------
  // Halves within a pair differ in aspect (4-After is 16:9, Mamu-After is 9:16),
  // so both are cover-cropped to a common 4:3 or the slider handle misaligns.
  for (const p of PAIRS) {
    const b = files.find((f) => f.endsWith('/' + p.before));
    const a = files.find((f) => f.endsWith('/' + p.after));
    if (!b || !a) { console.warn(`  skip pair ${p.id}: missing half`); continue; }

    const [mb, ma] = [await sharp(b).metadata(), await sharp(a).metadata()];
    const ar = (m: sharp.Metadata) => (m.width ?? 1) / (m.height ?? 1);
    // Independent "attention" crops pick different regions of each half, so the
    // two sides of a slider stop lining up. Centre is deterministic and matches.
    const W = 1280, H = 960;
    for (const [side, src] of [['before', b], ['after', a]] as const) {
      await sharp(src).rotate().resize(W, H, { fit: 'cover', position: 'centre' })
        .webp({ quality: 82 }).toFile(join(OUT, `before-after/${p.id}-${side}.webp`));
    }
    // When the halves were shot at very different aspects they are different
    // framings, not a matched pair — the UI shows those side by side instead of
    // as an overlay slider, where the mismatch reads as a mistake.
    const drift = Math.abs(ar(mb) - ar(ma)) / Math.max(ar(mb), ar(ma));
    manifest.beforeAfter.push({
      id: p.id, width: W, height: H,
      before: `/img/before-after/${p.id}-before.webp`,
      after: `/img/before-after/${p.id}-after.webp`,
      aspectDrift: Number(drift.toFixed(2)),
      slider: drift < 0.25,
    });
  }

  // ---- gallery --------------------------------------------------------
  const seen = new Set<string>();
  for (const f of files.sort()) {
    const name = basename(f);
    if (!isOriginal(name) || DENY.test(name)) continue;
    if (/before|after/i.test(name)) continue; // handled above
    const cat = CATEGORIES.find(([re]) => re.test(name))?.[1];
    if (!cat) continue;
    const key = name.toLowerCase().replace(/-(scaled|copy)/g, '').replace(extname(name), '');
    if (seen.has(key)) continue;
    seen.add(key);
    const slug = key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    try {
      const { width, height } = await emit(f, join(OUT, `gallery/${slug}`), 1600);
      manifest.gallery.push({
        src: `/img/gallery/${slug}.webp`, category: cat, width, height,
        source: f.replace(ROOT + '/', ''),
      });
    } catch { console.warn(`  failed: ${name}`); }
  }

  await writeFile(join(ROOT, 'data/image-manifest.json'), JSON.stringify(manifest, null, 1));
  const byCat = manifest.gallery.reduce<Record<string, number>>((a, g) => {
    a[g.category] = (a[g.category] ?? 0) + 1; return a;
  }, {});
  console.log(`brand:        ${Object.keys(manifest.brand).length} files`);
  console.log(`mascot:       ${manifest.mascot.length}`);
  console.log(`before/after: ${manifest.beforeAfter.length} pairs`);
  console.log(`gallery:      ${manifest.gallery.length}`, byCat);
}

main();
