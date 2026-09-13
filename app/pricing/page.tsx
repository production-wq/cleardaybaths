import type { Metadata } from 'next';
import SimplePage from '@/components/SimplePage';
import { JsonLdScript, graph, breadcrumbNode, faqNode } from '@/lib/schema';
import { companyPages } from '@/lib/companyContent';
import { meta } from '@/lib/seo';

const page = companyPages['pricing'];
const path = '/pricing/';

export const metadata: Metadata = meta({
  title: page.title, description: page.description, path,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([
        breadcrumbNode([{ label: page.h1, href: path }]),
        faqNode(page.faqs ?? []),
      ])} />
      <SimplePage page={page} path={path} />
    </>
  );
}
