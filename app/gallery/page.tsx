import type { Metadata } from 'next';
import Image from 'next/image';
import Hero from '@/components/Hero';
import Section, { SectionHead } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import BeforeAfterSlider from '@/components/BeforeAfterSlider';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { gallery, beforeAfter } from '@/lib/gallery';
import { meta } from '@/lib/seo';

const path = '/gallery/';

export const metadata: Metadata = meta({
  title: 'Project Gallery',
  description: 'Real bathroom remodels, tub-to-shower conversions and accessible bathrooms completed across Northern Virginia and Maryland.',
  path,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Gallery', href: path }])])} />
      <Hero
        eyebrow="Our work"
        title="Project gallery"
        lead="Real Clear Day installations across Northern Virginia, Maryland and the DC metro."
        align="center"
        image="/img/gallery/bath-and-shower-remodel76.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Gallery', href: path }]} />}
      />

      {beforeAfter.length > 0 && (
        <Section tone="white">
          <SectionHead eyebrow="Before & after" title="From outdated to" accent="outstanding"
                       lead="Drag the handle to reveal the same bathroom before and after." />
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            {beforeAfter.map((pair) => (
              <BeforeAfterSlider key={pair.id} pair={pair} label={`Clear Day project ${pair.id}`} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="cream">
        <SectionHead eyebrow="Completed work" title="Bathrooms, showers" accent="& conversions" />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {gallery.slice(0, 60).map((g) => (
            <li key={g.src} className="overflow-hidden rounded-card">
              <Image src={g.src} alt="A completed Clear Day Bath Solutions installation"
                     width={g.width} height={g.height} loading="lazy"
                     className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
