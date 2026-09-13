import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Section, { SectionHead } from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { cityHref } from '@/components/CityChips';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { cities } from '@/lib/routes';
import { meta } from '@/lib/seo';
import { business } from '@/lib/business';

const path = '/service-areas/';

export const metadata: Metadata = meta({
  title: 'Service Areas — Northern Virginia, Maryland & DC',
  description: 'Every city and county Clear Day Bath Solutions serves across Northern Virginia, Maryland and the Washington DC metro.',
  path,
});

export default function Page() {
  const live = cities.filter((c) => c.existingPages.length || c.pagesToBuild.length);
  const byState = { VA: live.filter((c) => c.state === 'VA'), MD: live.filter((c) => c.state === 'MD'), DC: live.filter((c) => c.state === 'DC') };
  const STATE_NAME = { VA: 'Virginia', MD: 'Maryland', DC: 'Washington, DC' } as const;

  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Service Areas', href: path }])])} />
      <Hero
        eyebrow="Where we work"
        title="Service areas"
        lead={`Based in ${business.address.addressLocality}, ${business.address.addressRegion} and working across Northern Virginia, Maryland and the DC metro.`}
        align="center"
        image="/img/gallery/bathroom-remodeling21.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Service Areas', href: path }]} />}
      />

      {(['VA', 'MD', 'DC'] as const).map((st, i) =>
        byState[st].length ? (
          <Section key={st} tone={i % 2 === 0 ? 'cream' : 'white'}>
            <SectionHead align="left" eyebrow={STATE_NAME[st]}
                         title={`Bathroom remodeling across`} accent={STATE_NAME[st]} />
            <ul className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
              {byState[st].map((c) => (
                <li key={c.slug} className="border-l-2 border-mint pl-4">
                  <Link href={cityHref(c)} className="font-display text-base font-bold text-ink hover:text-teal">
                    {c.name}, {c.state}
                  </Link>
                  <p className="mt-1 text-xs uppercase tracking-wider text-ink/45">{c.county}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{c.note}</p>
                  {(c.existingPages.length > 1 || c.pagesToBuild.length > 1) && (
                    <ul className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                      {[...c.existingPages.map((p) => p.url), ...c.pagesToBuild]
                        .filter((u) => u !== cityHref(c))
                        .slice(0, 4)
                        .map((u) => (
                          <li key={u}>
                            <Link href={u} className="text-teal hover:underline">
                              {u.split('/').filter(Boolean).pop()!.replace(/-/g, ' ')}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        ) : null,
      )}

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
