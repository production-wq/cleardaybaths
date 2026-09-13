/**
 * Guards the Vercel build failure this fixes: an env var that exists but is
 * empty made `new URL('')` throw during page-data collection.
 * Every case must yield a value that `new URL()` accepts.
 */
import { execFileSync } from 'node:child_process';

const CASES: [string, Record<string, string>][] = [
  ['unset',             {}],
  ['empty string',      { NEXT_PUBLIC_SITE_URL: '' }],
  ['whitespace only',   { NEXT_PUBLIC_SITE_URL: '   ' }],
  ['bare hostname',     { NEXT_PUBLIC_SITE_URL: 'cleardaybaths.com' }],
  ['trailing slash',    { NEXT_PUBLIC_SITE_URL: 'https://cleardaybaths.com/' }],
  ['http scheme',       { NEXT_PUBLIC_SITE_URL: 'http://staging.cleardaybaths.com' }],
  ['malformed',         { NEXT_PUBLIC_SITE_URL: ':::not a url:::' }],
  ['VERCEL_URL only',   { VERCEL_URL: 'cleardaybaths-abc123.vercel.app' }],
];

let failed = 0;
for (const [label, env] of CASES) {
  const out = execFileSync(
    process.execPath,
    ['--import', 'tsx', 'scripts/_probe/site-url.ts'],
    { env: { ...process.env, NEXT_PUBLIC_SITE_URL: '', VERCEL_URL: '', VERCEL_PROJECT_PRODUCTION_URL: '', ...env }, encoding: 'utf8' },
  ).trim();
  const ok = /^https?:\/\/[^/]+$/.test(out);
  if (!ok) failed++;
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(18)} -> ${out}`);
}
if (failed) { console.error(`\n${failed} case(s) produced an unusable origin`); process.exit(1); }
console.log('\nevery env case yields a valid absolute origin');
