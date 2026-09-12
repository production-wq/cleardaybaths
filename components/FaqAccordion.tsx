export interface Faq { q: string; a: string }

/**
 * Native <details> rather than JS state: it is keyboard-operable and
 * findable with in-page search before any JavaScript loads.
 */
export default function FaqAccordion({ faqs, defaultOpen = 0 }: { faqs: Faq[]; defaultOpen?: number }) {
  return (
    <div className="mx-auto mt-12 max-w-3xl divide-y divide-forest-900/10 overflow-hidden rounded-panel bg-white ring-1 ring-forest-900/5">
      {faqs.map((f, i) => (
        <details key={f.q} open={i === defaultOpen} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-display font-semibold text-ink marker:content-none hover:bg-mint/40">
            {f.q}
            <span aria-hidden className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint text-teal transition-transform group-open:rotate-45">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <div className="px-5 pb-5 text-sm leading-relaxed text-ink/75">{f.a}</div>
        </details>
      ))}
    </div>
  );
}
