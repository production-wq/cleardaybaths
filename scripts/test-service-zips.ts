/**
 * Service-territory ZIP validation tests.
 *
 *   npm run test:zips
 *
 * Covers the whitelist data, ZIP normalization, and the server action's
 * authoritative check (the layer that still holds when JavaScript is off or a
 * request is forged). The browser-side behaviour — modal, no `submit` event,
 * nothing reaching CallRail/GTM — is verified in a real browser, not here.
 */
import { normalizeZip, isServiceZip, SERVICE_ZIP_COUNT } from '../lib/serviceArea';
import { submitLead } from '../app/actions/submit-lead';
import zipData from '../data/service-area-zips.json';

let failures = 0;
const ok = (cond: boolean, label: string, detail = '') => {
  if (!cond) failures++;
  console.log(`  ${cond ? 'ok  ' : 'FAIL'} ${label}${!cond && detail ? `  -> ${detail}` : ''}`);
};

/* ---------------------------------------------------------------- data */
console.log('whitelist data');
ok(zipData.va.length === 156, 'Virginia has 156 ZIPs', String(zipData.va.length));
ok(zipData.md.length === 159, 'Maryland has 159 ZIPs', String(zipData.md.length));
ok(SERVICE_ZIP_COUNT === 315, '315 unique ZIPs in total', String(SERVICE_ZIP_COUNT));
ok([...zipData.va, ...zipData.md].every((z) => /^\d{5}$/.test(z)), 'every entry is exactly 5 digits');
ok(new Set([...zipData.va, ...zipData.md]).size === 315, 'no duplicates, none shared between states');

const BRIEF_VA = ['22405', '22404', '22402', '22407', '22553', '22508', '22542', '22191', '22192', '22030', '22033', '20112', '20109', '20176'];
const BRIEF_MD = ['20687', '20680', '20684', '20674', '20690', '20744', '20772', '20814', '20852', '21701', '21703', '21157'];
ok(BRIEF_VA.every(isServiceZip), `all ${BRIEF_VA.length} VA sample ZIPs from the brief are accepted`);
ok(BRIEF_MD.every(isServiceZip), `all ${BRIEF_MD.length} MD sample ZIPs from the brief are accepted`);

/* ------------------------------------------------------- normalization */
console.log('\nnormalizeZip');
const N: [unknown, string | null, string][] = [
  ['22405', '22405', 'plain'],
  [' 22405 ', '22405', 'leading/trailing spaces'],
  ['\t22405\n', '22405', 'tab / newline'],
  [' 22405 ', '22405', 'non-breaking spaces'],
  ['​22405​', '22405', 'zero-width spaces from copy/paste'],
  ['22405-1234', '22405', 'ZIP+4 with hyphen'],
  ['22405 1234', '22405', 'ZIP+4 with space'],
  ['22405–1234', '22405', 'ZIP+4 with en dash'],
  ['22405−1234', '22405', 'ZIP+4 with minus sign'],
  ['２２４０５', '22405', 'full-width digits'],
  ['2240', null, 'too short'],
  ['224055', null, 'too long'],
  ['22 405', null, 'space inside the 5 digits'],
  ['22405abc', null, 'trailing letters'],
  ['abcde', null, 'letters'],
  ['22405-12', null, 'incomplete +4'],
  ['', null, 'empty'],
  ['   ', null, 'only whitespace'],
  [null, null, 'null'],
  [undefined, null, 'undefined'],
  [22405, null, 'a number, not a string'],
];
for (const [input, want, label] of N) {
  const got = normalizeZip(input);
  ok(got === want, `${label.padEnd(34)} ${JSON.stringify(input)} -> ${JSON.stringify(got)}`, `wanted ${JSON.stringify(want)}`);
}

/* --------------------------------------------------------- membership */
console.log('\nisServiceZip');
ok(isServiceZip('22405'), '22405 (VA) is serviced');
ok(isServiceZip('20687'), '20687 (MD) is serviced');
ok(!isServiceZip('90210'), '90210 is not serviced');
ok(!isServiceZip('10001'), '10001 is not serviced');
ok(!isServiceZip('00000'), '00000 is not serviced');
ok(!isServiceZip(''), 'empty string is not serviced');
ok(!isServiceZip('22405 '), 'un-normalized input is not silently accepted (callers must normalize first)');

/* ------------------------------------------------- server action layer */
console.log('\nsubmitLead (server action)');
const form = (over: Record<string, string> = {}) => {
  const f = new FormData();
  const base: Record<string, string> = {
    firstName: 'QA', lastName: 'Test', email: 'qa@example.com', phone: '5555550100',
    zip: '22405', service: 'Tub-to-shower conversion', message: '', company: '', sourcePath: '/get-quote/',
  };
  for (const [k, v] of Object.entries({ ...base, ...over })) f.set(k, v);
  return f;
};
type Outcome = { redirected: string | null; state: Awaited<ReturnType<typeof submitLead>> | null };
async function run(over: Record<string, string>): Promise<Outcome> {
  try {
    return { redirected: null, state: await submitLead({ ok: false }, form(over)) };
  } catch (e) {
    // Next's redirect() throws a control-flow error whose digest starts NEXT_REDIRECT.
    const digest = String((e as { digest?: string })?.digest ?? '');
    if (digest.startsWith('NEXT_REDIRECT')) return { redirected: digest.split(';')[2] ?? '?', state: null };
    throw e;
  }
}

async function main() {
  let r = await run({ zip: '22405' });
  ok(r.redirected === '/thank-you/', 'VA 22405 -> redirects to /thank-you/', JSON.stringify(r));
  r = await run({ zip: '20687' });
  ok(r.redirected === '/thank-you/', 'MD 20687 -> redirects to /thank-you/', JSON.stringify(r));
  r = await run({ zip: ' 22405 ' });
  ok(r.redirected === '/thank-you/', 'padded " 22405 " is accepted, not rejected for whitespace', JSON.stringify(r));
  r = await run({ zip: '22405-1234' });
  ok(r.redirected === '/thank-you/', 'ZIP+4 "22405-1234" is accepted', JSON.stringify(r));

  for (const bad of ['90210', '10001']) {
    r = await run({ zip: bad });
    ok(r.redirected === null && r.state?.outOfAreaZip === bad && r.state.ok === false,
       `${bad} -> NO redirect, outOfAreaZip="${bad}"`, JSON.stringify(r));
  }
  r = await run({ zip: ' 90210 ' });
  ok(r.redirected === null && r.state?.outOfAreaZip === '90210', 'padded " 90210 " is reported as the clean "90210"', JSON.stringify(r));
  r = await run({ zip: '90210', lastName: '', email: 'not-an-email' });
  ok(r.redirected === null && r.state?.outOfAreaZip === '90210', 'out-of-area wins even when other fields are also invalid', JSON.stringify(r));
  r = await run({ zip: '2240' });
  ok(r.redirected === null && !r.state?.outOfAreaZip && r.state?.errors?.zip === 'Enter a 5-digit ZIP code',
     'malformed "2240" -> format error (not the out-of-area modal)', JSON.stringify(r));
  r = await run({ zip: '' });
  ok(r.redirected === null && r.state?.errors?.zip === 'Enter a 5-digit ZIP code', 'empty ZIP -> format error', JSON.stringify(r));
  r = await run({ zip: '22405', lastName: '' });
  ok(r.redirected === null && !!r.state?.errors?.lastName && !r.state?.outOfAreaZip,
     'in-area ZIP + other invalid field -> normal field error, no modal', JSON.stringify(r));


  console.log(failures ? `\n${failures} FAILURE(S)` : '\nall checks passed');
  process.exit(failures ? 1 : 0);
}

main();
