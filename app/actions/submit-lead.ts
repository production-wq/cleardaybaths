'use server';

import { z } from 'zod';
import { business } from '@/lib/business';
import { serviceSelectOptions } from '@/lib/content';

const Lead = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Enter a valid email address').max(160),
  phone: z.string().trim().regex(/^[\d\s().+-]{10,20}$/, 'Enter a valid phone number'),
  zip: z.string().trim().regex(/^\d{5}(-\d{4})?$/, 'Enter a 5-digit ZIP code'),
  service: z.enum(serviceSelectOptions as unknown as [string, ...string[]]),
  message: z.string().trim().max(2000).optional().default(''),
  consent: z.literal('on', { errorMap: () => ({ message: 'Please accept the consent notice to continue' }) }),
  // Honeypot: a real person never fills a field they cannot see.
  company: z.string().max(0).optional().default(''),
  sourcePath: z.string().max(300).optional().default('/'),
});

export type LeadState = {
  ok: boolean;
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
  if (lead.company) return { ok: true };

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // Never drop a lead silently — a failed send must be loud in the logs.
    console.error('[lead] RESEND_API_KEY is not set; lead NOT delivered', {
      email: lead.email, zip: lead.zip, service: lead.service,
    });
    return {
      ok: false,
      message: `We could not submit the form just now. Please call us on ${business.phone.display} and we will take your details directly.`,
    };
  }

  const body = [
    `Name:    ${lead.firstName} ${lead.lastName}`,
    `Phone:   ${lead.phone}`,
    `Email:   ${lead.email}`,
    `ZIP:     ${lead.zip}`,
    `Service: ${lead.service}`,
    `Page:    ${lead.sourcePath}`,
    '',
    lead.message || '(no message)',
    '',
    `E-SIGN consent accepted at ${new Date().toISOString()}`,
  ].join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.LEAD_FROM_EMAIL ?? 'website@cleardaybaths.com',
        to: [process.env.LEAD_TO_EMAIL ?? business.email.leads],
        reply_to: lead.email,
        subject: `New quote request — ${lead.firstName} ${lead.lastName} (${lead.zip})`,
        text: body,
      }),
    });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  } catch (err) {
    console.error('[lead] delivery failed', err);
    return {
      ok: false,
      message: `We could not submit the form just now. Please call us on ${business.phone.display} and we will take your details directly.`,
    };
  }

  return { ok: true };
}
