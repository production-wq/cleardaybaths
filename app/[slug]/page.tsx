import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';
import { JsonLdScript, graph, serviceNode, breadcrumbNode, faqNode } from '@/lib/schema';
import { resolveRootSlug, rootSlugs } from '@/lib/routes';
import { cityHubCopy, flatPageCopy, SERVICE_H1 } from '@/lib/cityContent';
import { byCategory, pick, cityImage } from '@/lib/gallery';
import { meta } from '@/lib/seo';
import faqData from '@/data/faqs.json';

/**
 * Root-level geo URLs: city hubs (/stafford/) and the legacy flat city+service
 * slugs (/frederick-shower-remodel/). Static folders such as /bathrooms/ and
 * /about-us/ are real directories and take precedence over this segment.
 *
 * dynamicParams = false is what makes the preservation guarantee mechanical —
 * a URL renders only if the registry contains it.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return rootSlugs();
}

function load(slug: string) {
  const route = resolveRootSlug(slug);
  if (!route) notFound();
  const copy = route.kind === 'city-hub'
    ? cityHubCopy(route.city)
    : flatPageCopy(route.city, route.service);
  return { route, copy };
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const route = resolveRootSlug(slug);
  if (!route) return {};
  const copy = route.kind === 'city-hub'
    ? cityHubCopy(route.city)
    : flatPageCopy(route.city, route.service);
  return meta({ title: copy.title, description: copy.description, path: `/${slug}/` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const path = `/${slug}/`;
  const { route, copy } = load(slug);
  const city = route.city;

  const category = route.kind === 'city-service' && route.service === 'walk-in-bathtubs'
    ? 'tubs'
    : route.kind === 'city-service' && route.service === 'shower-remodel'
      ? 'showers'
      : 'bath-and-shower';
  const images = pick(byCategory(category), 8, slug);
  const hero = cityImage(city.slug)?.src ?? images[0]?.src ?? '/img/gallery/bath-and-shower-remodel1.webp';
  const faqs = [...copy.faqs, ...(faqData.general as { q: string; a: string }[])].slice(0, 6);

  const crumbs = [{ label: 'Service Areas', href: '/service-areas/' }, { label: copy.h1, href: path }];

  return (
    <>
      <JsonLdScript
        data={graph([
          serviceNode({
            name: route.kind === 'city-service' && route.service
              ? `${SERVICE_H1[route.service]} in ${city.name}, ${city.state}`
              : `Bathroom Remodeling in ${city.name}, ${city.state}`,
            description: copy.description,
            path,
            areaServed: [city.name, ...city.nearby],
          }),
          breadcrumbNode(crumbs),
          faqNode(faqs),
        ])}
      />
      <ContentPage
        eyebrow={`${city.name}, ${city.state}`}
        h1={copy.h1}
        lead={copy.lead}
        heroImage={hero}
        crumbs={crumbs}
        currentPath={path}
        intro={copy.intro}
        sections={copy.sections}
        faqs={faqs}
        faqTitle={`${city.name} bathroom remodeling FAQs`}
        gallery={images.slice(0, 8)}
      />
    </>
  );
}
