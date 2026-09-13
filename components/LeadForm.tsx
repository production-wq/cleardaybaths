'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { usePathname } from 'next/navigation';
import { submitLead, type LeadState } from '@/app/actions/submit-lead';
import { serviceSelectOptions } from '@/lib/content';
import { business } from '@/lib/business';
import legal from '@/data/legal.json';
import { Check } from './Icons';

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

export default function LeadForm({ heading = 'Request your free quote' }: { heading?: string }) {
  const [state, action] = useActionState<LeadState, FormData>(submitLead, { ok: false });
  const pathname = usePathname();
  const err = state.errors ?? {};

  if (state.ok) {
    return (
      <div className="rounded-panel bg-forest-800 p-8 text-center ring-1 ring-white/10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal">
          <Check width={28} height={28} />
        </span>
        <h2 className="mt-5 font-display text-2xl font-bold text-white">Thanks — we have your details</h2>
        <p className="mt-3 text-sm text-white/80">
          Someone from the team will call you to arrange your free in-home measure. If you would
          rather not wait, call us on{' '}
          <a href={business.phone.href} className="font-semibold text-sage underline underline-offset-2">
            {business.phone.display}
          </a>.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-panel bg-forest-800 p-6 ring-1 ring-white/10 sm:p-8">
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
        <Field name="zip" label="ZIP code" autoComplete="postal-code" inputMode="numeric" error={err.zip} />
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
        <input id="lead-consent" name="consent" type="checkbox" required
               aria-describedby="lead-consent-text"
               className="mt-1 h-4 w-4 shrink-0 accent-teal" />
        <label id="lead-consent-text" htmlFor="lead-consent" className="text-[0.7rem] leading-relaxed text-white/70">
          {legal.esignConsent}
        </label>
      </p>
      {err.consent && <span className="mt-1 block text-xs text-red-300">{err.consent}</span>}

      <Submit />

      {state.message && (
        <p role="alert" className="mt-3 rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">
          {state.message}
        </p>
      )}
    </form>
  );
}
