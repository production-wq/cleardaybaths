import assert from 'node:assert/strict';
import { submitLead } from '../app/actions/submit-lead';

async function main() {
  // Legacy email configuration must have no effect on CallRail-only forms.
  process.env.LEAD_TO_EMAIL = 'leads@cleardaybaths.com,quotes@cleardaybaths.com';
  delete process.env.RESEND_API_KEY;
  const data = new FormData();
  for (const [key, value] of Object.entries({ firstName: 'Test', lastName: 'Verification', email: 'test@example.com', phone: '2025550100', zip: '22191', service: 'Tub-to-shower conversion', sourcePath: '/get-quote/', message: 'Local validation test' })) data.set(key, value);
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw Error('No separate delivery request is allowed'); };
  try {
    const invalid = await submitLead({ ok: false }, new FormData());
    assert.equal(invalid.ok, false);
    assert(invalid.errors?.email);
    // Optional marketing consent must not block a valid quote request.
    await assert.rejects(submitLead({ ok: false }, data), (error: any) => error.digest?.includes('NEXT_REDIRECT') && error.digest.includes('/thank-you/'));
    data.set('email', 'invalid');
    assert.equal((await submitLead({ ok: false }, data)).ok, false);
    assert.equal(requests, 0);
    console.log('Passed: required-field validation, invalid email, optional consent, thank-you redirect without email credentials, and no separate delivery requests.');
  } finally { globalThis.fetch = originalFetch; }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
