import type { Metadata } from 'next';
import Link from 'next/link';
import Section from '@/components/Section';
import Marquee from '@/components/Marquee';
import Mascot from '@/components/Mascot';
import { business } from '@/lib/business';
import { meta } from '@/lib/seo';
import { Phone, Check } from '@/components/Icons';

/** Conversion confirmation — noindex so it never competes in search. */
export const metadata: Metadata = meta({
  title: 'Thank You',
  description: 'Thanks for getting in touch with Clear Day Bath Solutions.',
  path: '/thank-you/',
  noindex: true,
});

export default function Page() {
  return (
    <>
      <Section tone="cream" className="min-h-[60vh]">
        <div className="relative mx-auto max-w-xl py-10 text-center">
          <Mascot n={7} width={140} className="-top-6 right-0" />
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-teal text-white">
            <Check width={32} height={32} />
          </span>
          <h1 className="mt-6 text-display-lg">Thanks — we have your details</h1>
          <p className="mt-4 leading-relaxed text-ink/75">
            Someone from the team will be in touch to arrange your free in-home measure. If you
            would rather not wait, call us directly and we will take it from there.
          </p>
          <a href={business.phone.href} data-analytics="call-click" data-location="thank-you"
             className="btn-primary mt-8">
            <Phone width={18} height={18} /> {business.phone.display}
          </a>
          <p className="mt-8 text-sm text-ink/60">
            In the meantime, have a look at{' '}
            <Link href="/gallery/" className="font-semibold text-teal hover:underline">recent projects</Link> or{' '}
            <Link href="/blog/" className="font-semibold text-teal hover:underline">the blog</Link>.
          </p>
        </div>
      </Section>
      <Marquee tone="mint" />
    </>
  );
}
