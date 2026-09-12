/** Inline icons — no icon library, no extra network request. */
type P = React.SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
  stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
});

export const Phone = (p: P) => (
  <svg {...base(p)}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" /></svg>
);
export const Check = (p: P) => (
  <svg {...base(p)}><path d="m20 6-11 11-5-5" /></svg>
);
export const ChevronDown = (p: P) => (
  <svg {...base(p)} width={p.width ?? 16} height={p.height ?? 16}><path d="m6 9 6 6 6-6" /></svg>
);
export const ArrowRight = (p: P) => (
  <svg {...base(p)} width={p.width ?? 16} height={p.height ?? 16}><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
);
export const Menu = (p: P) => (
  <svg {...base(p)} width={p.width ?? 24} height={p.height ?? 24}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const Close = (p: P) => (
  <svg {...base(p)} width={p.width ?? 24} height={p.height ?? 24}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const MapPin = (p: P) => (
  <svg {...base(p)}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
);
export const Clock = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const Mail = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const Star = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="m12 2 2.9 6.3 6.6.8-4.9 4.6 1.3 6.6L12 17l-5.9 3.3 1.3-6.6L2.5 9.1l6.6-.8Z" /></svg>
);
export const Facebook = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none" width={p.width ?? 16} height={p.height ?? 16}><path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1Z" /></svg>
);
export const Instagram = (p: P) => (
  <svg {...base(p)} width={p.width ?? 16} height={p.height ?? 16}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" /></svg>
);
