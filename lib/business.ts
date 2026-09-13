/**
 * Single source of truth for NAP, hours and brand facts.
 *
 * Every value here is verified against the live site or the WordPress export
 * (data/_source/). Nothing is invented. If a field is unknown it is `null` and
 * the consuming component omits it rather than guessing — a wrong phone number
 * or a fabricated address is worse than an absent one.
 */

const FALLBACK_SITE_URL = 'https://cleardaybaths.com';

/**
 * Resolve the canonical origin.
 *
 * `??` only falls back on undefined, so an env var that EXISTS but is EMPTY —
 * which is exactly how Vercel stores a variable added with a blank value —
 * slipped through as '' and made `new URL('')` throw at build time:
 *
 *     TypeError: Invalid URL ... input: ''
 *     Failed to collect page data for /_not-found
 *
 * So: trim, treat blank as absent, add a scheme if someone entered a bare
 * hostname ("cleardaybaths.com"), and verify it actually parses before
 * returning it. Anything unusable falls back rather than failing the build.
 */
function resolveSiteUrl(): string {
  const candidates = [
    process.env.NEXT_PUBLIC_SITE_URL,
    // Vercel sets these without a scheme.
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_URL,
  ];

  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    const withScheme = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    try {
      const url = new URL(withScheme);
      if (!url.hostname) continue;
      return url.origin;
    } catch {
      // Malformed value — try the next candidate rather than crashing the build.
    }
  }
  return FALLBACK_SITE_URL;
}

export const SITE_URL = resolveSiteUrl();

/** Absolute URL for canonicals, OG tags and JSON-LD @id values. */
export const abs = (path: string) => `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

function tel(display: string) {
  return { display, e164: `+1${display.replace(/\D/g, '')}`, href: `tel:+1${display.replace(/\D/g, '')}` };
}

export const business = {
  name: 'Clear Day Bath Solutions',
  legalName: 'Clear Day Bath Solutions LLC',
  shortName: 'Clear Day',
  tagline: 'Locally owned and dedicated to quality',

  /**
   * Primary number, confirmed on the live site header/footer 2026-09-13.
   * The 804-840-0467 in the WordPress export and both design artifacts is STALE.
   */
  phone: tel('571-751-7598'),
  /** Secondary — live site shows this in the footer only. */
  phoneAlt: tel('202-951-8814'),

  email: {
    leads: 'leads@cleardaybaths.com',
    sales: 'sales@cleardaybaths.com',
    public: 'contactus@cleardaybaths.com',
  },

  /**
   * Service-area business: no street address is published anywhere on the live
   * site or in the export — only "Woodbridge, VA United States". Schema therefore
   * uses areaServed + an address without streetAddress. See plan open item #2.
   */
  address: {
    streetAddress: null as string | null,
    addressLocality: 'Woodbridge',
    addressRegion: 'VA',
    postalCode: null as string | null,
    addressCountry: 'US',
  },
  geo: { latitude: 38.6582, longitude: -77.2497 }, // Woodbridge, VA town centre

  /** "Mon-Fri 8am-8pm; Sat-Sun 9am-4pm" — live site + export. */
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '20:00' },
    { days: ['Saturday', 'Sunday'], opens: '09:00', closes: '16:00' },
  ],
  hoursDisplay: 'Mon–Fri 8am–8pm · Sat–Sun 9am–4pm',

  social: {
    facebook: 'https://www.facebook.com/profile.php?id=61587267088319',
    instagram: 'https://www.instagram.com/cleardaybaths/',
  },

  /**
   * UNKNOWN — needs client confirmation (plan open item #1).
   * The live site's stat counters render 0%/0+/0/5, and the pricing page says
   * "Serving Northern Virginia Since 2026", which contradicts the "10+ years"
   * in the homepage design. Left null until confirmed; StatsRow omits any null.
   */
  foundedYear: null as number | null,
  licenseNumber: null as string | null,

  regions: ['Northern Virginia', 'Maryland', 'Greater DC Metro'],
} as const;

export type Business = typeof business;
