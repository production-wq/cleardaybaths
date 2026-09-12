import Link from 'next/link';
import Image from 'next/image';
import { business } from '@/lib/business';
import { footerNav, legalNav } from '@/lib/nav';
import { cities } from '@/lib/routes';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from './Icons';

export default function Footer() {
  // Cities that actually have a landing page, so the footer never links to a 404.
  const areas = cities
    .filter((c) => c.existingPages.length || c.pagesToBuild.length)
    .slice(0, 14);

  return (
    <footer className="on-dark bg-forest-900 text-white/70">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <Image src="/img/brand/logo.png" alt={business.name} width={620} height={828} className="h-16 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {business.tagline}. Bathroom remodeling, tub-to-shower conversions and accessible
              bathing solutions across Northern Virginia, Maryland and the DC metro.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={business.social.facebook} target="_blank" rel="noreferrer noopener" aria-label="Facebook"
                 className="rounded-full bg-white/10 p-2 text-white hover:bg-teal"><Facebook width={18} height={18} /></a>
              <a href={business.social.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram"
                 className="rounded-full bg-white/10 p-2 text-white hover:bg-teal"><Instagram width={18} height={18} /></a>
            </div>
          </div>

          {footerNav.map((group) => (
            <nav key={group.label} aria-label={group.label}>
              <h2 className="text-eyebrow uppercase text-sage">{group.label}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {group.children?.map((c) => (
                  <li key={c.href}><Link href={c.href} className="hover:text-white">{c.label}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-[1.4fr_2fr]">
          <address className="not-italic">
            <h2 className="text-eyebrow uppercase text-sage">Contact</h2>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href={business.phone.href} data-analytics="call-click" data-location="footer"
                   className="flex items-center gap-2 font-display text-lg font-bold text-white hover:text-sage">
                  <Phone width={18} height={18} className="text-sage" /> {business.phone.display}
                </a>
              </li>
              <li>
                <a href={business.phoneAlt.href} data-analytics="call-click" data-location="footer-alt"
                   className="flex items-center gap-2 hover:text-white">
                  <Phone width={16} height={16} className="text-sage" /> {business.phoneAlt.display}
                </a>
              </li>
              <li>
                <a href={`mailto:${business.email.public}`} className="flex items-center gap-2 hover:text-white">
                  <Mail width={16} height={16} className="text-sage" /> {business.email.public}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin width={16} height={16} className="text-sage" />
                {business.address.addressLocality}, {business.address.addressRegion}
              </li>
              <li className="flex items-center gap-2">
                <Clock width={16} height={16} className="text-sage" /> {business.hoursDisplay}
              </li>
            </ul>
          </address>

          <nav aria-label="Service areas">
            <h2 className="text-eyebrow uppercase text-sage">Service Areas</h2>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {areas.map((c) => {
                const href = c.existingPages.find((p) => !p.service)?.url
                  ?? c.pagesToBuild.find((u) => u.split('/').filter(Boolean).length === 1)
                  ?? c.existingPages[0]?.url
                  ?? c.pagesToBuild[0];
                return (
                  <li key={c.slug}>
                    <Link href={href} className="hover:text-white">{c.name}, {c.state}</Link>
                  </li>
                );
              })}
              <li><Link href="/service-areas/" className="font-semibold text-sage hover:text-white">View all →</Link></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} {business.legalName}. All rights reserved.</p>
          <nav aria-label="Legal" className="flex gap-4">
            {legalNav.map((l) => <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
