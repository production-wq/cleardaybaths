import Link from 'next/link';
import { business } from '@/lib/business';
import { serviceHubs } from '@/lib/services';
import Mascot from './Mascot';
import { Phone, Clock, MapPin } from './Icons';

/**
 * The sticky right rail from the service-page design: quote prompt, the full
 * service index, and a contact card. Sticks below the 4.5rem header.
 */
export default function SidebarQuoteCard({ currentPath }: { currentPath?: string }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-24">
      {/* Mascot lives OUTSIDE the card so it peeks over the top edge as in the
          design. Inside, the card's overflow-hidden clipped it and it landed
          on the heading. */}
      <div className="relative pt-[4.5rem]">
        <Mascot n={5} width={88} className="top-0 right-3 opacity-90" />
        <div className="on-dark relative isolate overflow-hidden rounded-panel bg-forest-900 bg-stripe-dark p-6 text-white">
        <h2 className="relative z-10 font-display text-xl font-bold">Get a free estimate</h2>
        <p className="relative z-10 mt-2 text-sm text-white/70">
          No obligation, no pressure — just a written price after an in-home measure.
        </p>
        <Link href="/get-quote/" className="btn-primary relative z-10 mt-5 w-full">Request my quote</Link>
        <a href={business.phone.href} data-analytics="call-click" data-location="sidebar"
           className="relative z-10 mt-4 flex items-center justify-center gap-2 font-display text-lg font-bold text-white hover:text-sage">
          <Phone width={18} height={18} className="text-sage" /> {business.phone.display}
        </a>
        </div>
      </div>

      <nav aria-label="All services" className="card p-6">
        <h2 className="text-eyebrow uppercase text-teal">Our services</h2>
        {serviceHubs.map((hub) => (
          <div key={hub.slug} className="mt-4 first:mt-3">
            <Link href={hub.path}
                  className={`block font-display text-sm font-bold ${currentPath === hub.path ? 'text-teal' : 'text-ink hover:text-teal'}`}>
              {hub.title}
            </Link>
            <ul className="mt-1.5 space-y-1.5 border-l border-mint pl-3">
              {hub.children.map((c) => (
                <li key={c.path}>
                  <Link href={c.path}
                        aria-current={currentPath === c.path ? 'page' : undefined}
                        className={`block text-sm ${currentPath === c.path ? 'font-semibold text-teal' : 'text-ink/70 hover:text-teal'}`}>
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="card space-y-3 p-6 text-sm">
        <h2 className="text-eyebrow uppercase text-teal">Talk to us</h2>
        <p className="flex items-center gap-2 text-ink/75">
          <MapPin width={16} height={16} className="shrink-0 text-teal" />
          {business.address.addressLocality}, {business.address.addressRegion}
        </p>
        <p className="flex items-center gap-2 text-ink/75">
          <Clock width={16} height={16} className="shrink-0 text-teal" /> {business.hoursDisplay}
        </p>
      </div>
    </aside>
  );
}
