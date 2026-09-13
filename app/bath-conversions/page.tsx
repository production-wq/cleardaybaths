import type { Metadata } from 'next';
import { ServicePage, serviceMetadata } from '@/lib/servicePage';

export const dynamicParams = false;

export const metadata: Metadata = serviceMetadata('bath-conversions', '/bath-conversions/');

export default function Page() {
  return <ServicePage slug="bath-conversions" path="/bath-conversions/" />;
}
