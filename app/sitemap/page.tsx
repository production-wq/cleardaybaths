import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { serviceHubs } from '@/lib/services';
import { cities, allUrls } from '@/lib/routes';
import { cityHref } from '@/components/CityChips';
import { allPosts } from '@/lib/blog';
import { footerNav, legalNav, utilityNav } from '@/lib/nav';
import { meta } from '@/lib/seo';

const path = '/sitemap/';

export const metadata: Metadata = meta({
  title: 'Sitemap',
  description: 'Every page on cleardaybaths.com — services, service areas, blog and company information.',
  path,
});

export default function Page() {
  const company = footerNav.find((g) => g.label === 'Company')?.children ?? [];
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Sitemap', href: path }])])} />
      <Hero eyebrow="All pages" title="Sitemap"
            lead={`Every one of the ${allUrls().length} pages on this site.`}
            align="center" image="/img/gallery/bath-and-shower-remodel41.webp"
            breadcrumb={<Breadcrumbs trail={[{ label: 'Sitemap', href: path }]} />} />

      <Section tone="cream">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {serviceHubs.map((hub) => (
            <nav key={hub.slug} aria-label={hub.title}>
              <h2 className="font-display text-base font-bold text-ink">
                <Link href={hub.path} className="hover:text-teal">{hub.title}</Link>
              </h2>
              <ul className="mt-3 space-y-2 text-sm">
                {hub.children.map((c) => (
                  <li key={c.path}><Link href={c.path} className="text-ink/70 hover:text-teal">{c.title}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Company">
            <h2 className="font-display text-base font-bold text-ink">Company</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {[...company, ...utilityNav, ...legalNav].map((l) => (
                <li key={l.href}><Link href={l.href} className="text-ink/70 hover:text-teal">{l.label}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <nav aria-label="Service areas" className="mt-12 border-t border-forest-900/10 pt-10">
          <h2 className="font-display text-base font-bold text-ink">
            <Link href="/service-areas/" className="hover:text-teal">Service areas</Link>
          </h2>
          <ul className="mt-4 grid gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
            {cities.filter((c) => c.existingPages.length || c.pagesToBuild.length).map((c) => (
              <li key={c.slug}>
                <Link href={cityHref(c)} className="text-sm font-semibold text-ink hover:text-teal">
                  {c.name}, {c.state}
                </Link>
                <ul className="mt-1 space-y-1">
                  {[...c.existingPages.map((p) => p.url), ...c.pagesToBuild]
                    .filter((u) => u !== cityHref(c))
                    .map((u) => (
                      <li key={u}>
                        <Link href={u} className="text-xs text-ink/60 hover:text-teal">
                          {u.split('/').filter(Boolean).pop()!.replace(/-/g, ' ')}
                        </Link>
                      </li>
                    ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Blog" className="mt-12 border-t border-forest-900/10 pt-10">
          <h2 className="font-display text-base font-bold text-ink">
            <Link href="/blog/" className="hover:text-teal">Blog</Link>
          </h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {allPosts.map((p) => (
              <li key={p.slug}><Link href={p.path} className="text-sm text-ink/70 hover:text-teal">{p.title}</Link></li>
            ))}
          </ul>
        </nav>
      </Section>
      <Marquee tone="mint" />
    </>
  );
}
