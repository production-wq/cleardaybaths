'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { serviceSelectOptions } from '@/lib/content';
import {
  normalizeZip, isServiceZip, outOfAreaFieldMessage, ZIP_FORMAT_MESSAGE,
} from '@/lib/serviceArea';

const Lead = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(80),
  lastName: z.string().trim().min(1, 'Last name is required').max(80),
  email: z.string().trim().email('Enter a valid email address').max(160),
  phone: z.string().trim().regex(/^[\d\s().+-]{10,20}$/, 'Enter a valid phone number'),
  // Already reduced to 5 digits by normalizeZip() before parsing; the pattern
  // stays as a backstop so a value that failed to normalize still errors.
  zip: z.string().trim().regex(/^\d{5}$/, ZIP_FORMAT_MESSAGE),
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
  /**
   * Set when the ZIP is well-formed but outside the service territory. The form
   * opens the "we don't service your area" modal from this. No redirect happens
   * in that case, so /thank-you/ (and the conversion it fires) is never reached.
   */
  outOfAreaZip?: string;
};

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // The browser stops an out-of-area submission before it exists, but this is
  // the authoritative check: JavaScript can be off, and a request can be forged.
  // It runs first because "we don't serve this ZIP" is true whatever else is
  // wrong with the form.
  const rawZip = formData.get('zip');
  const zip = normalizeZip(rawZip);
  if (zip && !isServiceZip(zip)) {
    return { ok: false, outOfAreaZip: zip, errors: { zip: outOfAreaFieldMessage(zip) } };
  }

  const parsed = Lead.safeParse({
    ...Object.fromEntries(formData),
    // Pass the cleaned ZIP; if it could not be cleaned, pass the raw text so
    // the usual "Enter a 5-digit ZIP code" error is produced.
    zip: zip ?? String(rawZip ?? ''),
  });

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
