import type { Metadata } from 'next';
import { ServicePage, serviceMetadata } from '@/lib/servicePage';

export const dynamicParams = false;

export const metadata: Metadata = serviceMetadata('showers', '/showers/');

export default function Page() {
  return <ServicePage slug="showers" path="/showers/" />;
}
