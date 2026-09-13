import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePage, serviceMetadata } from '@/lib/servicePage';
import { hubBySlug } from '@/lib/services';

/** Only the children in the registry render; anything else is a real 404. */
export const dynamicParams = false;

const hub = hubBySlug.get('showers')!;

export function generateStaticParams() {
  return hub.children.map((c) => ({ service: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ service: string }> },
): Promise<Metadata> {
  const { service } = await params;
  return serviceMetadata(service, `/showers/${service}/`);
}

export default async function Page({ params }: { params: Promise<{ service: string }> }) {
  const { service } = await params;
  if (!hub.children.some((c) => c.slug === service)) notFound();
  return <ServicePage slug={service} path={`/showers/${service}/`} hub={hub} />;
}
