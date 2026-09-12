'use client';

import { useState } from 'react';
import Link from 'next/link';
import { reviews, aggregate } from '@/lib/reviews';
import { Star, ArrowRight } from './Icons';

export default function Testimonials() {
  const perView = 2;
  const pages = Math.max(1, Math.ceil(reviews.length / perView));
  const [page, setPage] = useState(0);
  const shown = reviews.slice(page * perView, page * perView + perView);

  if (!reviews.length) return null;

  return (
    <div className="mt-12">
      <div className="grid gap-6 md:grid-cols-2">
        {shown.map((r, i) => (
          <figure key={r.id} className="rounded-panel bg-white/5 p-7 ring-1 ring-white/10">
            <div className="flex items-start justify-between gap-4">
              <span className="font-display text-3xl font-bold text-white/15">
                {String(page * perView + i + 1).padStart(2, '0')}
              </span>
              <div className="flex gap-0.5 text-sage" aria-label={`${r.rating} out of 5 stars`}>
                {Array.from({ length: r.rating }, (_, s) => <Star key={s} width={16} height={16} />)}
              </div>
            </div>
            <blockquote className="mt-4">
              <p className="font-display text-lg font-semibold text-white">&ldquo;{r.title}&rdquo;</p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">{r.body}</p>
            </blockquote>
            <figcaption className="mt-5 border-t border-white/10 pt-4 text-sm">
              <span className="font-semibold text-white">{r.author}</span>
              <time className="ml-2 text-white/50" dateTime={r.date}>
                {new Date(r.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
              </time>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-white/60">
          <span className="font-semibold text-white">{aggregate.value?.toFixed(1)} / 5</span>
          {' '}from {aggregate.count} verified {aggregate.count === 1 ? 'review' : 'reviews'}
        </p>
        <div className="flex items-center gap-3">
          {pages > 1 && (
            <div className="flex gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button key={i} type="button" onClick={() => setPage(i)}
                        aria-label={`Show reviews ${i + 1} of ${pages}`} aria-current={i === page}
                        className={`h-2.5 rounded-full transition-all ${i === page ? 'w-7 bg-teal' : 'w-2.5 bg-white/25 hover:bg-white/40'}`} />
              ))}
            </div>
          )}
          <Link href="/reviews/" className="btn-outline text-xs">Read all reviews <ArrowRight /></Link>
        </div>
      </div>
    </div>
  );
}
