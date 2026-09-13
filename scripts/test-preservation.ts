/**
 * The migration's safety net.
 *
 *   npx next build && npx next start -p <port>
 *   npm run test:preservation -- --port <port>
 *
 * Asserts that every URL in data/preserved-urls.csv returns 200 with a
 * self-referencing canonical, and that every redirect in data/url-map.csv
 * returns 301 to its exact target. Anything else is traffic loss.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const portArg = process.argv.indexOf('--port');
const PORT = portArg > -1 ? process.argv[portArg + 1] : process.env.PORT || '3177';
const BASE = `http://localhost:${PORT}`;

const rows = (file: string) =>
  readFileSync(join(ROOT, 'data', file), 'utf8')
    .trim().split('\n').slice(1)
    .map((line) => {
      const out: string[] = []; let cur = '', q = false;
      for (const ch of line) {
        if (ch === '"') q = !q;
        else if (ch === ',' && !q) { out.push(cur); cur = ''; }
        else cur += ch;
      }
      out.push(cur); return out;
    });

interface Fail { url: string; problem: string }

async function main() {
  const preserved = rows('preserved-urls.csv').map((r) => r[0]);
  const redirects = rows('url-map.csv')
    .filter((r) => r[1] === 'redirect')
    .map((r) => ({ from: r[0], to: r[2] }));

  const fails: Fail[] = [];
  let ok = 0;

  for (const url of preserved) {
    try {
      const res = await fetch(BASE + url, { redirect: 'manual' });
      if (res.status !== 200) { fails.push({ url, problem: `expected 200, got ${res.status}` }); continue; }
      const html = await res.text();
      const canon = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
      if (canon && !canon.endsWith(url)) {
        fails.push({ url, problem: `canonical points to ${canon}` }); continue;
      }
      ok++;
    } catch (e) {
      fails.push({ url, problem: `request failed: ${(e as Error).message}` });
    }
  }

  let rok = 0;
  for (const { from, to } of redirects) {
    try {
      const res = await fetch(BASE + from, { redirect: 'manual' });
      if (res.status !== 301 && res.status !== 308) {
        fails.push({ url: from, problem: `expected 301, got ${res.status}` }); continue;
      }
      const loc = res.headers.get('location') ?? '';
      if (!loc.endsWith(to)) { fails.push({ url: from, problem: `redirects to ${loc}, expected ${to}` }); continue; }
      rok++;
    } catch (e) {
      fails.push({ url: from, problem: `request failed: ${(e as Error).message}` });
    }
  }

  console.log(`preserved URLs returning 200 : ${ok}/${preserved.length}`);
  console.log(`redirects hitting target     : ${rok}/${redirects.length}`);

  if (fails.length) {
    console.error(`\n${fails.length} FAILURE(S) — this is traffic loss:`);
    for (const f of fails) console.error(`   ${f.url}\n      ${f.problem}`);
    process.exit(1);
  }
  console.log('\nevery preserved URL resolves and every redirect lands correctly');
}

main();
