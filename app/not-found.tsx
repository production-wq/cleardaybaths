import Link from 'next/link';
import Section from '@/components/Section';
import Mascot from '@/components/Mascot';
import { business } from '@/lib/business';
import { serviceHubs } from '@/lib/services';
import { Phone } from '@/components/Icons';

export default function NotFound() {
  return (
    <Section tone="cream" className="min-h-[60vh]">
      <div className="relative mx-auto max-w-xl py-10 text-center">
        <Mascot n={9} width={140} className="-top-8 right-0" />
        <p className="eyebrow">404</p>
        <h1 className="mt-3 text-display-lg">We could not find that page</h1>
        <p className="mt-4 leading-relaxed text-ink/75">
          It may have moved, or the link may be wrong. Here is where most people are heading.
        </p>
        <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
          {serviceHubs.map((h) => (
            <li key={h.slug}>
              <Link href={h.path} className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-forest-900/10 hover:bg-mint">
                {h.title}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/service-areas/" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-ink ring-1 ring-forest-900/10 hover:bg-mint">
              Service areas
            </Link>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Back to the homepage</Link>
          <a href={business.phone.href} className="btn-outline bg-white">
            <Phone width={16} height={16} className="text-teal" /> {business.phone.display}
          </a>
        </div>
      </div>
    </Section>
  );
}
