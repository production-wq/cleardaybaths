'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { business } from '@/lib/business';
import { Phone, Close, MapPin } from './Icons';

/** "+15717517598" -> "(571) 751-7598", derived so it can never drift from business.ts. */
function parenPhone(e164: string): string {
  const d = e164.replace(/\D/g, '').slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/**
 * "We don't service your area yet" — shown when a lead form is submitted with a
 * ZIP outside the approved territory.
 *
 * A native <dialog>, opened with showModal(): the browser supplies the focus
 * trap, Esc-to-close, an inert page behind it and correct screen-reader
 * semantics, none of which a hand-built overlay gets for free.
 *
 * Nothing is rendered until a ZIP is set. A closed <dialog> is still in the
 * HTML, so always rendering it would put "We Don't Service Your Area Yet" into
 * the markup of every page that has a form (all of them) for search engines.
 *
 * PORTALED TO <body>, not left where the form is. The form sits inside dark
 * sections (`.on-dark`), and CSS selectors follow the DOM tree, not the browser's
 * top layer — so `.on-dark .btn-outline` (white text) reached the Close button
 * and painted it white-on-white, and the dark focus-ring offset leaked in too.
 * Outside those sections the modal gets none of it. (It also keeps this
 * dialog's buttons out of the <form>, where CallRail looks for its submit button.)
 */
export default function OutOfAreaModal({ zip, onClose }: { zip: string | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (zip && !dialog.open) dialog.showModal();
    else if (!zip && dialog.open) dialog.close();
  }, [zip]);

  const phone = parenPhone(business.phone.e164);

  if (!zip || typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={ref}
      aria-labelledby="out-of-area-title"
      aria-describedby="out-of-area-body"
      onClose={onClose}
      // A click on the backdrop is delivered to the <dialog> element itself;
      // clicks on its content land on a child, so this only fires outside the card.
      onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.close(); }}
      className="out-of-area m-auto w-[calc(100%-2rem)] max-w-md rounded-panel bg-white p-0 text-ink shadow-2xl backdrop:bg-forest-950/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative max-h-[calc(100dvh-2rem)] overflow-y-auto p-6 sm:p-8">
        {/* First in DOM order so it receives initial focus. Focusing "Call us"
            first would make a stray second Enter press dial the phone. */}
        <button
          type="button"
          onClick={() => ref.current?.close()}
          aria-label="Close"
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full text-ink/60 transition-colors hover:bg-mint hover:text-ink"
        >
          <Close width={20} height={20} />
        </button>

        <span className="grid h-12 w-12 place-items-center rounded-full bg-mint text-teal">
          <MapPin width={24} height={24} />
        </span>

        <h2 id="out-of-area-title" className="mt-5 pr-8 font-display text-2xl font-bold leading-tight">
          We Don’t Service Your Area Yet
        </h2>

        <p id="out-of-area-body" className="mt-4 leading-relaxed text-ink/75">
          Thank you for your interest in Clear Day Bath Solutions. Unfortunately, we do not
          currently provide service to ZIP code{' '}
          <strong className="font-semibold text-ink">{zip}</strong>. If you feel this is an error
          or have questions, please give us a call at{' '}
          <a
            href={business.phone.href}
            data-analytics="call-click"
            data-location="out-of-area-modal"
            className="font-semibold text-teal underline underline-offset-2 hover:text-teal-hover"
          >
            {phone}
          </a>
          .
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <a
            href={business.phone.href}
            data-analytics="call-click"
            data-location="out-of-area-modal"
            className="btn-primary flex-1"
          >
            <Phone width={16} height={16} /> Call Us
          </a>
          <button type="button" onClick={() => ref.current?.close()} className="btn-outline flex-1">
            Close
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
