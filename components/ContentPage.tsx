import Link from 'next/link';
import Image from 'next/image';
import Section, { SectionHead } from './Section';
import Hero from './Hero';
import Breadcrumbs, { type Crumb } from './Breadcrumbs';
import SidebarQuoteCard from './SidebarQuoteCard';
import AdvantageGrid from './AdvantageGrid';
import CityChips from './CityChips';
import StatsRow from './StatsRow';
import Testimonials from './Testimonials';
import FaqAccordion, { type Faq } from './FaqAccordion';
import CtaBand from './CtaBand';
import Marquee from './Marquee';
import Mascot from './Mascot';
import { business } from '@/lib/business';
import { Phone, ArrowRight, Check } from './Icons';
import type { GalleryImage } from '@/lib/gallery';

export interface ContentBlock { h: string; p: string[] }
export interface Highlight { title: string; body: string }

/**
 * The service-page layout from the second design artifact, shared by service,
 * city and city+service pages so all 235 pages stay visually consistent.
 */
export default function ContentPage({
  eyebrow, h1, lead, heroImage, crumbs, currentPath,
  intro, sections, highlights = [], faqs, faqTitle = 'Frequently asked', gallery = [],
  children,
}: {
  eyebrow: string; h1: React.ReactNode; lead: string; heroImage: string;
  crumbs: Crumb[]; currentPath: string;
  intro: string[]; sections: ContentBlock[]; highlights?: Highlight[];
  faqs: Faq[]; faqTitle?: string; gallery?: GalleryImage[];
  children?: React.ReactNode;
}) {
  return (
    <>
      <Hero
        eyebrow={eyebrow}
        title={h1}
        lead={lead}
        align="center"
        image={heroImage}
        breadcrumb={<Breadcrumbs trail={crumbs} />}
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="prose-cd">
            {intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-ink/85' : ''}>{p}</p>
            ))}

            {highlights.length > 0 && (
              <ul className="not-prose my-8 space-y-3 list-none pl-0">
                {highlights.map((h) => (
                  <li key={h.title} className="flex items-start gap-3 rounded-card bg-mint/50 p-4">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 basis-6 place-items-center rounded-full bg-teal text-white">
                      <Check width={14} height={14} />
                    </span>
                    <p className="min-w-0 text-sm leading-relaxed text-ink/80">
                      <strong className="font-display text-ink">{h.title}.</strong> {h.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}

            {sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}

            {children}

            <div className="not-prose mt-10 rounded-panel bg-mint p-7">
              <h2 className="font-display text-xl font-bold text-ink">Ready to get started?</h2>
              <p className="mt-2 text-sm text-ink/75">
                Free in-home measure, written price, no obligation to book.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href="/get-quote/" className="btn-primary">Get free quote <ArrowRight /></Link>
                <a href={business.phone.href} data-analytics="call-click" data-location="inline-cta"
                   className="btn-outline bg-white">
                  <Phone width={16} height={16} className="text-teal" /> {business.phone.display}
                </a>
              </div>
            </div>
          </div>

          <SidebarQuoteCard currentPath={currentPath} />
        </div>
      </Section>

      {gallery.length > 0 && (
        <Section tone="white">
          <SectionHead eyebrow="Project gallery" title="Get" accent="inspired" />
          <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {gallery.map((g) => (
              <li key={g.src} className="overflow-hidden rounded-card">
                <Image src={g.src} alt="A Clear Day Bath Solutions project" width={g.width} height={g.height}
                       className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href="/gallery/" className="btn-outline">View all projects <ArrowRight /></Link>
          </div>
        </Section>
      )}

      <Section tone="mint">
        <div className="relative">
          <Mascot n={4} width={124} className="-top-10 right-0 xl:-right-6" />
          <SectionHead align="left" eyebrow="Why Clear Day" title="The Clear Day" accent="advantage" />
        </div>
        <AdvantageGrid />
      </Section>

      <Section tone="dark" image="/img/gallery/bath-and-shower-remodel1.webp" imageFocus="left">
        <SectionHead align="left" eyebrow="Where we work"
                     title="Serving Northern Virginia" accent="& Maryland" />
        <CityChips limit={14} tone="dark" />
      </Section>

      <Section tone="dark">
        <div className="relative">
          <Mascot n={3} width={120} className="-top-12 left-0 xl:-left-8" />
          <SectionHead title="What sets us" accent="apart" />
        </div>
        <StatsRow />
        <div className="mt-20">
          <SectionHead align="left" eyebrow="What our clients say" title="Reviews &" accent="testimonials" />
          <Testimonials />
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section tone="cream">
          <SectionHead eyebrow="Common questions" title={faqTitle} />
          <FaqAccordion faqs={faqs} />
        </Section>
      )}

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
