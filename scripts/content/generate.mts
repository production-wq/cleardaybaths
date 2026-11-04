/** Offline, resumable authoring. Never runs during builds or on the public website. */
import { config } from 'dotenv';
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import sharp from 'sharp';
config({ path: '.env.local', quiet: true } as Parameters<typeof config>[0]);
const key = process.env.GEMINI_API_KEY;
if (!key) throw new Error('Set GEMINI_API_KEY in .env.local');
const calendar = JSON.parse(await readFile('data/content/calendar.json', 'utf8'));
const exists = (path: string) => access(path).then(() => true, () => false);
async function generate(model: string, prompt: string, image = false) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key! },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: image
        ? { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '16:9' } }
        : { responseMimeType: 'application/json', temperature: 0.65, maxOutputTokens: 12000 } }),
      signal: AbortSignal.timeout(180000),
    });
    if (response.ok) return response.json();
    const errorBody = await response.text();
    if (response.status === 429 && /limit: 0|limit.?0|requests per day limit exceeded/.test(errorBody))
      throw new Error('Gemini 429: project has no available image quota; check billing and limits');
    if (![429, 500, 502, 503, 504].includes(response.status) || attempt === 3)
      throw new Error(`Gemini ${response.status} for ${model}`);
    await new Promise(resolve => setTimeout(resolve, 15000 * (attempt + 1)));
  }
}
await mkdir('data/content/articles', { recursive: true });
await mkdir('public/img/blog', { recursive: true });
const tasks = calendar.filter((r: { existing: boolean }) => !r.existing);
let cursor = 0;
async function worker() {
  while (cursor < tasks.length) {
    const row = tasks[cursor++];
    const filename = `data/content/articles/${row.slug}.json`;
    try {
      if (!(await exists(filename))) {
        const prompt = `Write a genuinely useful original homeowner guide for Clear Day Bath Solutions using this editorial brief as data: ${JSON.stringify(row)}.
Return ONLY JSON with fields: intro (string), sections (array of 5 objects, each heading:string, paragraphs:string[], bullets:string[]), comparison:{caption:string,headers:string[],rows:string[][]}, cta:string, faqs:array of exactly 6 {question:string,answer:string}, seoDesc:string, excerpt:string, imagePrompt:string, imageAlt:string.
Aim for 900-1000 words total visible article text. Include concrete decisions, tradeoffs, homeowner measurements to collect, installation sequence, maintenance, and useful questions appropriate to THIS specific topic. Do not reuse generic filler. Use second person. First section should have useful bullets. Exactly one comparison table: compare options qualitatively, never invented prices or statistics. FAQ answers 2-3 sentences. No HTML or markdown in any strings. Do not put links inside strings; we will render brief links separately.
Never invent local housing facts, water hardness, climate claims, company credentials, warranties, product brands, medical benefits, statistics, client projects, testimonials, or guaranteed timelines/prices. One-day work depends on scope, existing conditions and product availability; allow sealant cure time. No claims of code/ADA compliance without assessment. Hydrotherapy is comfort, not treatment; avoid medical advice. Do not claim a year-end review of real projects we cannot verify; give the homeowner a review checklist. Do not claim the company provides a service beyond the title's scope. Use a consultation CTA without a phone number. No em dashes. Vary headings to topic. Spell Capitol Heights correctly in body even if brief title says Capital Heights.
Image prompt: detailed bright photorealistic bathroom design concept suited exactly to the topic, built-in tub or shower, physically plausible plumbing and doors, no people, NO text, NO logos, NO freestanding bathtub; honor all imageConstraints. Include one distinctive color/material composition. Alt text describes the design, not a real customer project.`;
        const response = await generate(process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash', prompt);
        const article = JSON.parse(response.candidates[0].content.parts.filter((p: {text?:string}) => p.text).map((p: {text:string}) => p.text).join(''));
        if (!article.intro || article.sections?.length !== 5 || article.faqs?.length !== 6 || !article.comparison?.rows?.length) throw new Error('Invalid article structure');
        await writeFile(filename, JSON.stringify(article, null, 2) + '\n');
        console.log(`Article saved: ${row.slug}`);
      }
      const img = `public/img/blog/${row.slug}.webp`;
      if (!(await exists(img))) {
        const article = JSON.parse(await readFile(filename, 'utf8'));
        const response = await generate(process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image', `Create one wide editorial bathroom design illustration. ${article.imagePrompt}. ${row.imageConstraints}. No text, letters, captions, logos, visible watermarks or freestanding bathtubs. Bright natural light, clean uncluttered room, realistic architecture.`, true);
        const part = response.candidates?.[0]?.content?.parts?.find((p: { inlineData?: unknown }) => p.inlineData);
        if (!part) throw new Error('Gemini returned no image');
        await sharp(Buffer.from(part.inlineData.data, 'base64')).resize({ width: 1536, withoutEnlargement: true }).webp({ quality: 84 }).toFile(img);
        console.log(`Image saved: ${row.slug}`);
      }
    } catch (error) {
      console.error(`Failed ${row.slug}: ${error instanceof Error ? error.message : 'unknown error'}`);
      if (error instanceof Error && /Gemini (400|401|402|403)|no available image quota/.test(error.message)) cursor = tasks.length;
      process.exitCode = 1;
    }
  }
}
await Promise.all([worker(), worker(), worker()]);
