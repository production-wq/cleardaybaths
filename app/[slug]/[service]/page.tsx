import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ContentPage from '@/components/ContentPage';
import { JsonLdScript, graph, serviceNode, breadcrumbNode, faqNode } from '@/lib/schema';
import { resolveNested, nestedParams } from '@/lib/routes';
import { cityServiceCopy, SERVICE_H1 } from '@/lib/cityContent';
import { byCategory, pick, cityImage } from '@/lib/gallery';
import { meta } from '@/lib/seo';
import faqData from '@/data/faqs.json';

/** Nested city services: /alexandria/walk-in-bathtubs/. */
export const dynamicParams = false;

export function generateStaticParams() {
  return nestedParams();
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string; service: string }> },
): Promise<Metadata> {
  const { slug, service } = await params;
  const hit = resolveNested(slug, service);
  if (!hit) return {};
  const copy = cityServiceCopy(hit.city, hit.service);
  return meta({ title: copy.title, description: copy.description, path: `/${slug}/${service}/` });
}

export default async function Page(
  { params }: { params: Promise<{ slug: string; service: string }> },
) {
  const { slug, service } = await params;
  const hit = resolveNested(slug, service);
  if (!hit) notFound();

  const { city } = hit;
  const path = `/${slug}/${service}/`;
  const copy = cityServiceCopy(city, hit.service);

  const category = hit.service === 'walk-in-bathtubs' ? 'tubs'
    : hit.service === 'shower-remodel' ? 'showers'
    : hit.service === 'accessible-bathroom' ? 'bathrooms'
    : 'bath-and-shower';
  const images = pick(byCategory(category), 8, slug + service);
  const hero = cityImage(city.slug)?.src ?? images[0]?.src ?? '/img/gallery/bath-and-shower-remodel1.webp';
  const faqs = [...copy.faqs, ...(faqData.general as { q: string; a: string }[])].slice(0, 6);

  const crumbs = [
    { label: `${city.name}, ${city.state}`, href: `/${slug}/` },
    { label: SERVICE_H1[hit.service], href: path },
  ];

  return (
    <>
      <JsonLdScript
        data={graph([
          serviceNode({
            name: `${SERVICE_H1[hit.service]} in ${city.name}, ${city.state}`,
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
        faqTitle={`${SERVICE_H1[hit.service]} in ${city.name} — FAQs`}
        gallery={images.slice(0, 8)}
      />
    </>
  );
}
