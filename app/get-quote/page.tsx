import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { business } from '@/lib/business';
import { meta } from '@/lib/seo';

const path = '/get-quote/';

export const metadata: Metadata = meta({
  title: 'Get a Free Bathroom Remodeling Quote',
  description: `Free in-home measure and written pricing for bathroom remodeling across Northern Virginia and Maryland. No obligation. Call ${business.phone.display}.`,
  path,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Get a Quote', href: path }])])} />
      <Hero
        eyebrow="Free estimate"
        title="Get your free quote"
        lead="An in-home measure, a written itemised price, and no obligation to book."
        align="center"
        image="/img/gallery/bath-and-shower-remodel60.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Get a Quote', href: path }]} />}
      />
      <CtaBand id="quote" />
      <Marquee tone="mint" />
    </>
  );
}
