'use client';

import { useActionState, useRef, useState, type SyntheticEvent } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { submitLead, type LeadState } from '@/app/actions/submit-lead';
import { serviceSelectOptions } from '@/lib/content';
import legal from '@/data/legal.json';
import {
  normalizeZip, isServiceZip, outOfAreaFieldMessage, ZIP_FORMAT_MESSAGE,
} from '@/lib/serviceArea';
import OutOfAreaModal from './OutOfAreaModal';

/**
 * What the ZIP field currently holds, judged the same way the server judges it.
 * `zip` is the cleaned 5-digit value whenever the input is well-formed.
 */
type ZipCheck =
  | { status: 'ok'; zip: string }
  | { status: 'invalid' }
  | { status: 'out-of-area'; zip: string };

function checkZip(form: HTMLFormElement): ZipCheck & { input: HTMLInputElement | null } {
  const input = form.elements.namedItem('zip') as HTMLInputElement | null;
  const zip = normalizeZip(input?.value);
  if (!zip) return { status: 'invalid', input };
  return isServiceZip(zip) ? { status: 'ok', zip, input } : { status: 'out-of-area', zip, input };
}

function Field({
  name, label, type = 'text', required = true, error, ...rest
}: { name: string; label: string; type?: string; required?: boolean; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `lead-${name}`;
  return (
    <p className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-white/85">
        {label}{required && <span className="text-sage"> *</span>}
      </label>
      <input
        id={id} name={name} type={type} required={required}
        aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined}
        className={`rounded-xl border bg-white/95 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35
                    focus:bg-white ${error ? 'border-red-400' : 'border-transparent'}`}
        {...rest}
      />
      {error && <span id={`${id}-err`} className="text-xs text-red-300">{error}</span>}
    </p>
  );
}

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-primary mt-1 w-full">
      {pending ? 'Sending…' : 'Start my project'}
    </button>
  );
}

export default function LeadForm({ heading = 'Request your free quote', id }: { heading?: string; id?: string }) {
  const pathname = usePathname();
  const [state, action] = useActionState<LeadState, FormData>(submitLead, { ok: false });
  const err = state.errors ?? {};

  const formRef = useRef<HTMLFormElement>(null);
  // Message under the ZIP field that comes from the browser-side check.
  const [zipError, setZipError] = useState('');
  // The ZIP currently shown in the "we don't service your area" modal, if any.
  const [modalZip, setModalZip] = useState<string | null>(null);

  // The server is the authoritative check. If it ever rejects a ZIP (JS bypassed
  // the guards below, or a forged request), open the same modal from its answer.
  // This is React's "adjust state while rendering" pattern: compare with the
  // previously seen state instead of reaching for an effect.
  const [seenState, setSeenState] = useState(state);
  if (state !== seenState) {
    setSeenState(state);
    if (state.outOfAreaZip) setModalZip(state.outOfAreaZip);
  }

  /**
   * Hold back a submission whose ZIP is missing, malformed or out of area.
   * Returns true when it held the event back.
   *
   * WHY THIS RUNS IN THE CAPTURE PHASE (the `...Capture` props on <form>):
   * lead capture is not done by this app. CallRail's form tracker attaches
   * three independent listeners that each POST the form to CallRail the moment
   * they fire — a `click` on the submit button, an Enter `keyup` on the form,
   * and `submit` — none of which wait for validation. GTM's Form Submit
   * Listener, which fires the Google Ads "Submit lead form" conversion, listens
   * for `submit` at the document. Capture-phase handlers on an ancestor run
   * before every one of those target/bubble-phase listeners, so cancelling the
   * click here means the browser never dispatches `submit` at all and CallRail
   * never sees a click. (stopPropagation matters as much as preventDefault:
   * preventDefault alone would still let CallRail's click listener run.)
   *
   * When the ZIP IS fine nothing is cancelled, so CallRail and GTM behave
   * exactly as they do today.
   */
  function holdBackIfZipNotServiceable(e: SyntheticEvent, form: HTMLFormElement): boolean {
    const check = checkZip(form);
    if (check.status === 'ok') {
      // Tidy " 22405 " / "22405-1234" to "22405" BEFORE CallRail reads the form
      // from its own click handler, so the CRM receives the clean value.
      if (check.input && check.input.value !== check.zip) check.input.value = check.zip;
      setZipError('');
      return false;
    }
    e.preventDefault();
    e.stopPropagation();
    if (check.status === 'out-of-area') {
      if (check.input && check.input.value !== check.zip) check.input.value = check.zip;
      setZipError(outOfAreaFieldMessage(check.zip));
      setModalZip(check.zip);
    } else {
      setZipError(ZIP_FORMAT_MESSAGE);
      check.input?.focus();
    }
    return true;
  }

  return (
    <>
    <form
      ref={formRef}
      id={id}
      action={action}
      noValidate
      // Clicking the button, tapping it, or pressing Enter in any field (the
      // browser turns that into a click on the default button) all arrive here.
      onClickCapture={(e) => {
        if ((e.target as HTMLElement).closest('button[type="submit"]')) {
          holdBackIfZipNotServiceable(e, e.currentTarget);
        }
      }}
      // CallRail also treats an Enter keyup anywhere in the form (except
      // textarea/select) as a submission, so stop that one too — without
      // reopening the modal; the click above already did.
      onKeyUpCapture={(e) => {
        const tag = (e.target as HTMLElement).tagName;
        if (e.key !== 'Enter' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        if (checkZip(e.currentTarget).status !== 'ok') e.stopPropagation();
      }}
      // Backstop for a programmatic submit (requestSubmit, an extension).
      onSubmitCapture={(e) => { holdBackIfZipNotServiceable(e, e.currentTarget); }}
      className="scroll-mt-24 lg:scroll-mt-32 rounded-panel bg-forest-800 p-6 ring-1 ring-white/10 sm:p-8">
      <h2 className="font-display text-xl font-bold text-white">{heading}</h2>
      <input type="hidden" name="sourcePath" value={pathname} />
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <p className="absolute -left-[9999px]" aria-hidden>
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" tabIndex={-1} autoComplete="off" />
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label="First name" autoComplete="given-name" error={err.firstName} />
        <Field name="lastName" label="Last name" autoComplete="family-name" error={err.lastName} />
        <Field name="email" label="Email" type="email" autoComplete="email" error={err.email} />
        <Field name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" error={err.phone} />
        <Field
          name="zip" label="ZIP code" autoComplete="postal-code" inputMode="numeric"
          error={zipError || err.zip}
          onChange={() => { if (zipError) setZipError(''); }}
          // Auto-format on leaving the field: trims whitespace and drops a +4, and
          // warns early (inline, no modal — a modal mid-form would steal focus).
          onBlur={(e) => {
            const raw = e.currentTarget.value;
            if (!raw.trim()) { setZipError(''); return; }
            const zip = normalizeZip(raw);
            if (!zip) { setZipError(ZIP_FORMAT_MESSAGE); return; }
            e.currentTarget.value = zip;
            setZipError(isServiceZip(zip) ? '' : outOfAreaFieldMessage(zip));
          }}
        />
        <p className="flex flex-col gap-1.5">
          <label htmlFor="lead-service" className="text-xs font-semibold text-white/85">
            What do you need?<span className="text-sage"> *</span>
          </label>
          <select id="lead-service" name="service" required defaultValue={serviceSelectOptions[0]}
                  className="rounded-xl border border-transparent bg-white/95 px-3.5 py-2.5 text-sm text-ink focus:bg-white">
            {serviceSelectOptions.map((o) => <option key={o}>{o}</option>)}
          </select>
        </p>
      </div>

      <p className="mt-4 flex flex-col gap-1.5">
        <label htmlFor="lead-message" className="text-xs font-semibold text-white/85">
          Tell us about the bathroom <span className="font-normal text-white/45">(optional)</span>
        </label>
        <textarea id="lead-message" name="message" rows={3}
                  placeholder="Age of the home, what you have now, anything that matters to you…"
                  className="rounded-xl border border-transparent bg-white/95 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:bg-white" />
      </p>

      {/* Verbatim TCPA / E-SIGN disclosure — see data/legal.json. Do not reword. */}
      <p className="mt-4 flex gap-3">
        <input id="lead-consent" name="consent" type="checkbox"
               aria-describedby="lead-consent-text"
               className="mt-1 h-4 w-4 shrink-0 accent-teal" />
        <label id="lead-consent-text" htmlFor="lead-consent" className="text-[0.7rem] leading-relaxed text-white/70">
          {legal.esignConsent}
        </label>
      </p>
      {err.consent && <span className="mt-1 block text-xs text-red-300">{err.consent}</span>}

      {/* Separate, optional SMS opt-in. Not required to submit the form. */}
      <p className="mt-4 flex gap-3">
        <input id="lead-sms-consent" name="smsConsent" type="checkbox"
               aria-describedby="lead-sms-consent-text"
               className="mt-1 h-4 w-4 shrink-0 accent-teal" />
        <label id="lead-sms-consent-text" htmlFor="lead-sms-consent" className="text-[0.7rem] leading-relaxed text-white/70">
          By providing your phone number, you agree to receive SMS account, customer care and
          marketing notifications from Clear Day Bath Solutions. Message frequency may vary.
          Standard Message and Data Rates may apply. Reply STOP to opt out. Reply HELP for help.
          Please see{' '}
          <Link href="/terms-and-conditions/" className="underline underline-offset-2 hover:text-white">Terms</Link>{' '}
          and{' '}
          <Link href="/privacy-policy/" className="underline underline-offset-2 hover:text-white">Privacy Policy</Link>
        </label>
      </p>

      <Submit />

      {(!state.ok && state.message) && (
        <p role="alert" className="mt-3 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}
    </form>

    <OutOfAreaModal
      zip={modalZip}
      onClose={() => {
        setModalZip(null);
        // Hand focus back to the field they most likely need to correct.
        (formRef.current?.elements.namedItem('zip') as HTMLInputElement | null)?.focus();
      }}
    />
    </>
  );
}
