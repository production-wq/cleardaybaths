'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { business } from '@/lib/business';
import { serviceSelectOptions } from '@/lib/content';

// Leads go to the admin inboxes only; the submitter is never emailed.
// First address is the primary; the rest are CC'd. LEAD_TO_EMAIL (comma-separated) overrides.
const LEAD_RECIPIENTS = (process.env.LEAD_TO_EMAIL ?? `${business.email.leads},quotes@cleardaybaths.com`)
  .split(',').map((e) => e.trim()).filter(Boolean);

const FAIL_MESSAGE =
  `We could not submit the form just now. Please call us on ${business.phone.display} and we will take your details directly.`;

const Lead = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Enter a valid email address').max(160),
  phone: z.string().trim().regex(/^[\d\s().+-]{10,20}$/, 'Enter a valid phone number'),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP code'),
  service: z.enum(serviceSelectOptions as unknown as [string, ...string[]]),
  message: z.string().trim().max(2000).optional().default(''),
  // Both consent checkboxes are optional; the browser only sends them when ticked.
  consent: z.literal('on').optional(),
  // Optional SMS opt-in; the browser only sends this field when ticked.
  smsConsent: z.literal('on').optional(),
  // Honeypot: a real person never fills a field they cannot see.
  company: z.string().max(0).optional().default(''),
  sourcePath: z.string().max(300).optional().default('/'),
});

export type LeadDelivery = { url: string; fields: Record<string, string> };

export type LeadState = {
  ok: boolean;
  /** Validated payload the browser relays to FormSubmit (it blocks server-side posts). */
  delivery?: LeadDelivery;
  errors?: Record<string, string>;
  message?: string;
};

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const parsed = Lead.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      errors[key] ??= issue.message;
    }
    return { ok: false, errors, message: 'Please check the highlighted fields.' };
  }

  const lead = parsed.data;

  // Silently accept honeypot hits so bots get no signal about what tripped.
  if (lead.company) redirect('/thank-you/');

  // FormSubmit.co answers server-to-server requests with 403, so the browser
  // posts the (already validated) lead itself. No password or API key needed;
  // the submitter is never emailed.
  const delivery: LeadDelivery = {
    url: `https://formsubmit.co/ajax/${LEAD_RECIPIENTS[0]}`,
    fields: {
      _subject: `New quote request — ${lead.firstName} ${lead.lastName} (${lead.zip})`,
      _cc: LEAD_RECIPIENTS.slice(1).join(','),
      _replyto: lead.email,
      _captcha: 'false',
      _template: 'table',
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      zip: lead.zip,
      service: lead.service,
      page: lead.sourcePath,
      message: lead.message || '(no message)',
      call_email_consent: lead.consent ? `YES, ${new Date().toISOString()}` : 'no',
      sms_opt_in: lead.smsConsent ? 'YES' : 'no',
    },
  };
  return { ok: true, delivery };
}
