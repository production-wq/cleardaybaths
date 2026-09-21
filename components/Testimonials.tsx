'use client';

import { useRef, useState } from 'react';
import type { ReviewsData, Review } from '@/lib/googleReviews';
import { Star } from './Icons';

const GoogleG = () => (
  <svg viewBox="0 0 48 48" width={16} height={16} aria-hidden>
    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.6H24v8.8h11.8c-.5 2.8-2.1 5.1-4.4 6.7v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4Z" />
    <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.6-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46Z" />
    <path fill="#FBBC05" d="M11.6 28.1a13.6 13.6 0 0 1 0-8.2v-5.7H4.3a22 22 0 0 0 0 19.6l7.3-5.7Z" />
    <path fill="#EA4335" d="M24 10.7c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C34.9 4.2 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.3 5.7c1.8-5.2 6.6-9.2 12.4-9.2Z" />
  </svg>
);

const Verified = () => (
  <svg viewBox="0 0 24 24" width={14} height={14} fill="#1D9BF0" aria-hidden>
    <path d="M12 1.5 14.8 4l3.6-.6 1 3.6 3.2 2-1.6 3.4 1.6 3.4-3.2 2-1 3.6-3.6-.6L12 22.5 9.2 20l-3.6.6-1-3.6-3.2-2 1.6-3.4L1.4 8.2l3.2-2 1-3.6 3.6.6L12 1.5Z" />
      <path d="m9.2 12.3 2 2 4.2-4.6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

function Avatar({ review }: { review: Review }) {
  const initial = review.author.trim().charAt(0).toUpperCase() || '?';
  return (
    <div className="relative h-12 w-12 shrink-0">
      {review.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- external per-reviewer Google photo, not worth a remotePatterns entry
        <img
          src={review.avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      ) : (
        <div className="grid h-12 w-12 place-items-center rounded-full bg-teal/20 font-display text-lg font-bold text-teal">
          {initial}
        </div>
      )}
      <span className="absolute -bottom-0.5 -right-0.5 grid h-5 w-5 place-items-center rounded-full bg-white shadow">
        <GoogleG />
      </span>
    </div>
  );
}

export function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const hasBody = review.body.trim().length > 0;
  const long = review.body.length > 180;
  const shown = expanded || !long ? review.body : `${review.body.slice(0, 180).trimEnd()}…`;

  return (
    <figure className="snap-start shrink-0 basis-[85%] rounded-panel bg-white p-6 shadow-sm ring-1 ring-forest-900/5 sm:basis-[46%] lg:basis-[31%]">
      <div className="flex items-center gap-3">
        <Avatar review={review} />
        <div className="min-w-0">
          <figcaption className="truncate font-semibold text-ink">{review.author}</figcaption>
          {review.relativeDate && <p className="text-xs text-ink/45">{review.relativeDate}</p>}
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5">
        <div className="flex gap-0.5 text-amber-400" aria-label={`${review.rating} out of 5 stars`}>
          {Array.from({ length: review.rating }, (_, s) => <Star key={s} width={15} height={15} />)}
        </div>
        <Verified />
      </div>
      <blockquote className="mt-3 text-sm leading-relaxed text-ink/75">
        {hasBody ? (
          <>
            {shown}
            {long && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="ml-1 font-semibold text-teal hover:text-teal-hover"
              >
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </>
        ) : (
          <span className="italic text-ink/45">This user only left a rating.</span>
        )}
      </blockquote>
    </figure>
  );
}

export default function Testimonials({ reviews, aggregate, reviewUrl }: ReviewsData) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: 'smooth' });
  };

  if (!reviews.length) return null;

  return (
    <div className="mt-12">
      {aggregate.count > 0 && (
        <p className="text-sm font-semibold text-ink/60">
          {aggregate.count} Google {aggregate.count === 1 ? 'review' : 'reviews'}
        </p>
      )}

      <div className="relative mt-6">
        <div
          ref={track}
          className="scrollbar-none flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2"
        >
          {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          {reviewUrl && (
            <a
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline border-teal/30 text-teal hover:bg-teal/10"
            >
              Leave a review
            </a>
          )}
          <div className="ml-auto flex gap-2">
            <button
              type="button"
              onClick={() => scroll(-1)}
              aria-label="Previous reviews"
              className="grid h-11 w-11 place-items-center rounded-full bg-teal/15 text-ink transition hover:bg-teal/25"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              aria-label="Next reviews"
              className="grid h-11 w-11 place-items-center rounded-full bg-teal/15 text-ink transition hover:bg-teal/25"
            >
              <svg viewBox="0 0 24 24" width={18} height={18} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
