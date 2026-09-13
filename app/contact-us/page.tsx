import type { Metadata } from 'next';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import LeadForm from '@/components/LeadForm';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, breadcrumbNode } from '@/lib/schema';
import { business } from '@/lib/business';
import { meta } from '@/lib/seo';
import { Phone, Mail, MapPin, Clock } from '@/components/Icons';

const path = '/contact-us/';

export const metadata: Metadata = meta({
  title: 'Contact Clear Day Bath Solutions',
  description: `Call ${business.phone.display} or send a message for a free in-home bathroom remodeling estimate across Northern Virginia, Maryland and the DC metro.`,
  path,
});

export default function Page() {
  return (
    <>
      <JsonLdScript data={graph([breadcrumbNode([{ label: 'Contact Us', href: path }])])} />
      <Hero
        eyebrow="Get in touch"
        title="Contact Clear Day"
        lead="Free in-home measure, written pricing, no obligation to book."
        align="center"
        image="/img/gallery/bath-and-shower-remodel56.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Contact Us', href: path }]} />}
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-display-md">Talk to a person, not a call centre</h2>
            <p className="mt-4 leading-relaxed text-ink/75">
              We are locally owned and based in {business.address.addressLocality},{' '}
              {business.address.addressRegion}. Whoever picks up can answer a question about your
              bathroom — and if we are not the right people for the job, we will tell you that too.
            </p>

            <ul className="mt-8 space-y-5">
              <li>
                <a href={business.phone.href} data-analytics="call-click" data-location="contact-page"
                   className="flex items-center gap-3 font-display text-2xl font-bold text-ink hover:text-teal">
                  <Phone width={24} height={24} className="text-teal" /> {business.phone.display}
                </a>
                <p className="ml-9 mt-1 text-sm text-ink/55">Sales and new estimates</p>
              </li>
              <li>
                <a href={business.phoneAlt.href} data-analytics="call-click" data-location="contact-page-alt"
                   className="flex items-center gap-3 font-display text-lg font-semibold text-ink hover:text-teal">
                  <Phone width={20} height={20} className="text-teal" /> {business.phoneAlt.display}
                </a>
              </li>
              <li className="flex items-center gap-3 text-ink/75">
                <Mail width={20} height={20} className="text-teal" />
                <a href={`mailto:${business.email.public}`} className="hover:text-teal">{business.email.public}</a>
              </li>
              <li className="flex items-center gap-3 text-ink/75">
                <MapPin width={20} height={20} className="text-teal" />
                {business.address.addressLocality}, {business.address.addressRegion} — serving
                Northern Virginia, Maryland &amp; the DC metro
              </li>
              <li className="flex items-center gap-3 text-ink/75">
                <Clock width={20} height={20} className="text-teal" /> {business.hoursDisplay}
              </li>
            </ul>
          </div>

          <div className="on-dark rounded-panel bg-forest-900 bg-stripe-dark p-6 sm:p-8">
            <LeadForm heading="Send us a message" />
          </div>
        </div>
      </Section>

      <Marquee tone="mint" />
    </>
  );
}
