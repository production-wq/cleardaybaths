import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section, { SectionHead } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { reviews, aggregate } from '@/lib/reviews';
import { meta } from '@/lib/seo';
import { Star } from '@/components/Icons';

const path = '/reviews/';

export const metadata: Metadata = meta({
  title: 'Customer Reviews',
  description: 'What Northern Virginia and Maryland homeowners say about their Clear Day Bath Solutions bathroom remodel.',
  path,
});

export default function Page() {
  return (
    <>
      {/* No Review schema here — the root entity in the layout already carries
          the reviews and aggregateRating. Repeating them would double-count. */}
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Reviews', href: path }])])} />
      <Hero
        eyebrow="Reviews & testimonials"
        title="What your neighbours say"
        lead="Feedback from homeowners across Northern Virginia and Maryland."
        align="center"
        image="/img/gallery/bathroom-remodeling16.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Reviews', href: path }]} />}
      />

      <Section tone="cream">
        {aggregate.value !== null && (
          <div className="mx-auto max-w-md text-center">
            <p className="font-display text-display-lg text-ink">
              {aggregate.value.toFixed(1)}<span className="text-teal">/5</span>
            </p>
            <div className="mt-2 flex justify-center gap-1 text-teal" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => <Star key={i} width={20} height={20} />)}
            </div>
            <p className="mt-2 text-sm text-ink/60">
              Based on {aggregate.count} verified {aggregate.count === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        )}

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id}>
              <figure className="card h-full p-7">
                <div className="flex gap-0.5 text-teal" aria-label={`${r.rating} out of 5 stars`}>
                  {Array.from({ length: r.rating }, (_, i) => <Star key={i} width={16} height={16} />)}
                </div>
                <blockquote className="mt-4">
                  <p className="font-display text-lg font-bold text-ink">{r.title}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{r.body}</p>
                </blockquote>
                <figcaption className="mt-5 border-t border-forest-900/8 pt-4 text-sm">
                  <span className="font-semibold text-ink">{r.author}</span>
                  <time className="ml-2 text-ink/50" dateTime={r.date}>
                    {new Date(`${r.date}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
                  </time>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mint">
        <SectionHead title="Worked with us?" accent="Tell us how it went"
                     lead="Reviews are collected and verified directly from customers." />
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
