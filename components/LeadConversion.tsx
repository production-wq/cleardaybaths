'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag_report_conversion?: (url?: string) => boolean;
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Fires the Google Ads "Submit lead form" conversion (defined in the root
 * layout) once per browser session, so a refresh of /thank-you/ does not
 * double-count. Also pushes a dataLayer event for Tag Manager.
 */
export default function LeadConversion() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem('lead-conversion-sent')) return;
      sessionStorage.setItem('lead-conversion-sent', '1');
    } catch {
      // Storage blocked — fall through and fire anyway.
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: 'lead_form_submit' });
    window.gtag_report_conversion?.();
  }, []);
  return null;
}
