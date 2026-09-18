import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import legalPages from '@/data/legal-pages.json';
import { meta } from '@/lib/seo';

const path = '/terms-and-conditions/';
const page = (legalPages as Record<string, { title: string; body: string[] }>)['terms-and-conditions'];

export const metadata: Metadata = meta({
  title: 'Terms and Conditions',
  description: 'The terms and conditions for Clear Day Bath Solutions LLC.',
  path,
});

/** Preserved from the existing site — legal text, not marketing copy to rewrite. */
export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Terms and Conditions', href: path }])])} />
      <Hero eyebrow="Legal" title="Terms and Conditions" align="center"
            image="/img/gallery/shower-replacement9.webp"
            breadcrumb={<Breadcrumbs trail={[{ label: 'Terms and Conditions', href: path }]} />} />
      <Section tone="cream">
        <div className="prose-cd mx-auto max-w-prose">
          {page.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>
      <Marquee tone="mint" />
    </>
  );
}
