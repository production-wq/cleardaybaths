import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import legalPages from '@/data/legal-pages.json';
import { meta } from '@/lib/seo';

const path = '/privacy-policy/';
const page = (legalPages as Record<string, { title: string; body: string[] }>)['privacy-policy'];

export const metadata: Metadata = meta({
  title: 'Privacy Policy',
  description: 'The privacy policy for Clear Day Bath Solutions LLC.',
  path,
});

/** Preserved from the existing site — legal text, not marketing copy to rewrite. */
export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Privacy Policy', href: path }])])} />
      <Hero eyebrow="Legal" title="Privacy Policy" align="center"
            image="/img/gallery/bath-and-shower-remodel82.webp"
            breadcrumb={<Breadcrumbs trail={[{ label: 'Privacy Policy', href: path }]} />} />
      <Section tone="cream">
        <div className="prose-cd mx-auto max-w-prose">
          {page.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </Section>
      <Marquee tone="mint" />
    </>
  );
}
