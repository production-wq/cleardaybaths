import type { Metadata } from 'next';
import { ServicePage, serviceMetadata } from '@/lib/servicePage';

export const dynamicParams = false;

export const metadata: Metadata = serviceMetadata('bathrooms', '/bathrooms/');

export default function Page() {
  return <ServicePage slug="bathrooms" path="/bathrooms/" />;
}
