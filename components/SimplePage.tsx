import Hero from './Hero';
import Section from './Section';
import Breadcrumbs from './Breadcrumbs';
import SidebarQuoteCard from './SidebarQuoteCard';
import FaqAccordion from './FaqAccordion';
import CtaBand from './CtaBand';
import Marquee from './Marquee';
import { SectionHead } from './Section';
import type { CompanyPage } from '@/lib/companyContent';

export default function SimplePage({ page, path }: { page: CompanyPage; path: string }) {
  return (
    <>
      <Hero
        eyebrow={page.eyebrow}
        title={page.h1}
        lead={page.lead}
        align="center"
        image={page.heroImage ?? '/img/gallery/bath-and-shower-remodel40.webp'}
        breadcrumb={<Breadcrumbs trail={[{ label: page.h1, href: path }]} />}
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="prose-cd">
            {page.intro.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-ink/85' : ''}>{p}</p>
            ))}
            {page.sections.map((s) => (
              <section key={s.h}>
                <h2>{s.h}</h2>
                {s.p.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
            {page.ctaButton && (
              <div className="mt-8">
                <a
                  href={page.ctaButton.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-teal px-8 py-4 text-base font-semibold text-white shadow-md transition hover:bg-teal-hover"
                >
                  {page.ctaButton.label}
                </a>
              </div>
            )}
          </div>
          <SidebarQuoteCard />
        </div>
      </Section>

      {page.faqs?.length ? (
        <Section tone="mint">
          <SectionHead eyebrow="Common questions" title="Questions we get" />
          <FaqAccordion faqs={page.faqs} />
        </Section>
      ) : null}

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
