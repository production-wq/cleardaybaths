import { readFile, writeFile, access } from 'node:fs/promises';
import sharp from 'sharp';
const calendar = JSON.parse(await readFile('data/content/calendar.json', 'utf8'));
const registry = JSON.parse(await readFile('data/routes.json', 'utf8'));
const known = new Set([...registry.preserved.map((r: {url:string}) => r.url), ...registry.build]);
const redirects = new Map(registry.redirects.map((r: {from:string;to:string}) => [r.from, r.to]));
const posts = [];
let missingImages = 0;
for (const row of calendar.filter((r: {existing:boolean}) => !r.existing)) {
  const article = JSON.parse(await readFile(`data/content/articles/${row.slug}.json`, 'utf8'));
  const { imagePrompt, imageAlt, seoDesc, excerpt, ...body } = article;
  const image = `/img/blog/${row.slug}.webp`;
  const imageExists = await access(`public${image}`).then(() => true, () => false);
  if (!imageExists && !process.argv.includes('--allow-missing-images')) throw new Error(`Generate the missing image first: ${row.slug}`);
  if (!imageExists) missingImages++;
  const dimensions = imageExists ? await sharp(`public${image}`).metadata() : undefined;
  const links = row.links.map((url: string) => {
    let href = new URL(url).pathname;
    for (let i = 0; i < 5 && redirects.has(href); i++) href = redirects.get(href) as string;
    if (!known.has(href)) throw new Error(`Unknown calendar link: ${href}`);
    return { href, label: href.split('/').filter(Boolean).join(' · ').replaceAll('-', ' ').replace(/\b\w/g, c => c.toUpperCase()) };
  });
  const words = [row.title, body.intro, ...body.sections.flatMap((s: {heading:string;paragraphs:string[];bullets:string[]}) => [s.heading, ...s.paragraphs, ...s.bullets]), body.comparison.caption, ...body.comparison.headers, ...body.comparison.rows.flat(), body.cta, ...body.faqs.flatMap((f: {question:string;answer:string}) => [f.question, f.answer])].join(' ').split(/\s+/).length;
  const reference = /shower/i.test(row.service) && !/tub conversions/i.test(row.service)
    ? { href: 'https://www.epa.gov/watersense/showerheads', label: 'EPA WaterSense guidance on showerheads' }
    : { href: 'https://www.cpsc.gov/s3fs-public/checklist.pdf', label: 'U.S. Consumer Product Safety Commission home safety checklist' };
  posts.push({ slug: row.slug, path: row.path, title: row.title.replaceAll('Capital Heights', 'Capitol Heights'), date: row.date, status: 'future', seoTitle: row.title.replaceAll('Capital Heights', 'Capitol Heights'), seoDesc, excerpt, body: [], words, article: body, links, reference, ...(dimensions ? { image: { src: image, alt: imageAlt, width: dimensions.width, height: dimensions.height } } : {}), notifyOnPublish: true });
}
await writeFile('data/content/generated-posts.json', JSON.stringify(posts, null, 2) + '\n');
console.log(`Assembled ${posts.length} articles with validated internal links. Missing Gemini images: ${missingImages}.`);
