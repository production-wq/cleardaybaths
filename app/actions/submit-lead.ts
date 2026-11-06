'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { serviceSelectOptions } from '@/lib/content';

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

  // CallRail's existing browser script captures the form submission and
  // handles lead delivery. This action only validates and navigates; do not
  // send a second email or make success depend on another email provider.
  redirect('/thank-you/');
}
