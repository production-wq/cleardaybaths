/**
 * Service-territory ZIP validation — the single source of truth.
 *
 * Imported by BOTH the lead form (browser, to stop an out-of-area submission
 * before it exists) and the server action (authoritative, for anything that
 * bypasses the browser). Sharing one module means the two can never disagree
 * about what counts as "in area" or how a ZIP is cleaned up.
 *
 * Deliberately NOT `server-only`: the browser needs it. The list is public
 * information (the client's own service area), ~3 KB.
 */
import zips from '@/data/service-area-zips.json';

/** All approved ZIPs, Virginia and Maryland. Built once at module load. */
const SERVICE_ZIPS: ReadonlySet<string> = new Set([...zips.va, ...zips.md]);

export const SERVICE_ZIP_COUNT = SERVICE_ZIPS.size;

/**
 * Hyphen-likes seen in pasted / autofilled ZIP+4 values: hyphen-minus, the
 * U+2010..2015 dash block (incl. en and em dash) and the true minus sign.
 */
const ZIP_PATTERN = /^(\d{5})(?:[\s\-‐-―−]\d{4})?$/;

/** Zero-width characters that ride along on copy/paste and defeat a plain trim(). */
const INVISIBLES = /[​-‍⁠﻿]/g;

/**
 * Reduce whatever was typed, pasted or autofilled to a bare 5-digit ZIP.
 * Returns `null` when it isn't a ZIP at all.
 *
 *   " 22405 "      -> "22405"      (whitespace, incl. non-breaking spaces)
 *   "22405-1234"   -> "22405"      (ZIP+4, any dash flavour or a space)
 *   "２２４０５"     -> "22405"      (full-width digits, via NFKC)
 *   "2240" / "abc" -> null
 */
export function normalizeZip(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const cleaned = raw.normalize('NFKC').replace(INVISIBLES, '').trim();
  const match = ZIP_PATTERN.exec(cleaned);
  return match ? match[1] : null;
}

/** True only for a well-formed 5-digit ZIP that is on the approved list. */
export function isServiceZip(zip: string): boolean {
  return SERVICE_ZIPS.has(zip);
}

/** Inline field message. Shared so the browser and the server word it identically. */
export function outOfAreaFieldMessage(zip: string): string {
  return `We don’t currently service ZIP code ${zip}.`;
}

export const ZIP_FORMAT_MESSAGE = 'Enter a 5-digit ZIP code';
