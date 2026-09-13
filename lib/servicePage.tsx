import type { Metadata } from 'next';
import ContentPage from '@/components/ContentPage';
import { JsonLdScript, graph, serviceNode, breadcrumbNode, faqNode } from './schema';
import { hubBySlug, serviceByPath, type ServiceHub } from './services';
import { getServiceCopy } from './serviceContent';
import { byCategory, pick } from './gallery';
import { meta } from './seo';
import faqData from '@/data/faqs.json';
import { notFound } from 'next/navigation';

const sharedFaqs = faqData.general as { q: string; a: string }[];

export function serviceMetadata(slug: string, path: string): Metadata {
  const copy = getServiceCopy(slug);
  const page = serviceByPath.get(path);
  if (!copy) return {};
  return meta({
    title: page?.seoTitle?.trim() || `${copy.h1} | Northern Virginia & Maryland`,
    description: page?.seoDesc?.trim() || copy.summary,
    path,
  });
}

export function ServicePage({ slug, path, hub }: { slug: string; path: string; hub?: ServiceHub }) {
  const copy = getServiceCopy(slug);
  if (!copy) notFound();

  const isHub = !!hubBySlug.get(slug) && path.split('/').filter(Boolean).length === 1;
  const parent = hub ?? (isHub ? hubBySlug.get(slug) : undefined);
  const crumbs = isHub
    ? [{ label: copy.h1, href: path }]
    : [
        { label: parent?.title ?? 'Services', href: parent?.path ?? '/bathrooms/' },
        { label: copy.h1, href: path },
      ];

  const images = pick(byCategory(copy.imageCategory), 8, slug);
  const faqs = [...copy.faqs, ...sharedFaqs].slice(0, 7);

  return (
    <>
      <JsonLdScript
        data={graph([
          serviceNode({ name: copy.h1, description: copy.summary, path }),
          breadcrumbNode(crumbs.map((c) => ({ label: c.label, href: c.href }))),
          faqNode(faqs),
        ])}
      />
      <ContentPage
        eyebrow={isHub ? 'Our services' : (parent?.title ?? 'Our services')}
        h1={copy.h1}
        lead={copy.summary}
        heroImage={images[0]?.src ?? '/img/gallery/bath-and-shower-remodel1.webp'}
        crumbs={crumbs}
        currentPath={path}
        intro={copy.intro}
        sections={copy.sections}
        highlights={copy.highlights}
        faqs={faqs}
        faqTitle={`${copy.h1} FAQs`}
        gallery={images.slice(0, 8)}
      />
    </>
  );
}
