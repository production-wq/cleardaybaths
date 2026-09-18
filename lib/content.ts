/**
 * Shared marketing content. The Advantage copy is verbatim from the live site —
 * it is the client's own approved wording and appears in both design artifacts.
 */
export const advantages = [
  { key: 'safety', title: 'Safety First',
    body: 'We specialize in high-quality safety showers designed for ultimate security and long-lasting daily comfort.' },
  { key: 'conversions', title: 'Expert Conversions',
    body: 'We seamlessly convert outdated bathtubs into modern, accessible showers built for safety and daily elegance.' },
  { key: 'design', title: 'Custom Design',
    body: 'Our team provides custom wet-area remodeling tailored to your specific style and home layout needs.' },
  { key: 'reliability', title: 'Proven Reliability',
    body: 'We focus on outstanding craftsmanship and dedication to customer satisfaction for every Virginia and Maryland homeowner.' },
] as const;

export const marqueeItems = [
  'Bathroom Renovations', 'Tub-to-Shower Conversions', 'Walk-In Showers',
  'Walk-In Bathtubs', 'Accessible Bathrooms', 'One-Day Bath', 'Shower Enclosures',
  'High Tech Polymer Showers', 'Bath Surrounds', 'Replacement Bathtubs',
] as const;

export const quoteBenefits = [
  'Free in-home measure and written price',
  'No obligation and no pressure to book',
  'Local installers who work in your county',
] as const;

export const serviceSelectOptions = [
  'Tub-to-shower conversion', 'Walk-in bathtub', 'Shower remodel',
  'Accessible / ADA bathroom', 'Full bathroom remodel', 'Bath surrounds or enclosure',
  'Something else',
] as const;
