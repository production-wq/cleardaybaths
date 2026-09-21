import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section, { SectionHead } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { ReviewCard } from '@/components/Testimonials';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { getReviewsData } from '@/lib/googleReviews';
import { meta } from '@/lib/seo';

const path = '/reviews/';

export const metadata: Metadata = meta({
  title: 'Customer Reviews',
  description: 'What Northern Virginia and Maryland homeowners say about their Clear Day Bath Solutions bathroom remodel.',
  path,
});

export default async function Page() {
  const { reviews, aggregate, reviewUrl } = await getReviewsData();
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
        <SectionHead eyebrow="What our clients say" title="Reviews &" accent="testimonials"
                     lead={aggregate.count > 0 ? `${aggregate.count} Google ${aggregate.count === 1 ? 'review' : 'reviews'}` : undefined} />

        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id}>
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="mint">
        <SectionHead title="Worked with us?" accent="Tell us how it went"
                     lead="Reviews are collected and verified directly from customers." />
        {reviewUrl && (
          <div className="mt-8 text-center">
            <a href={reviewUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
              Leave a review
            </a>
          </div>
        )}
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
