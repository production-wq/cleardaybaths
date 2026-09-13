import Link from 'next/link';
import Image from 'next/image';
import { business } from '@/lib/business';
import { footerNav, legalNav } from '@/lib/nav';
import { cities } from '@/lib/routes';
import { cityHref } from './CityChips';
import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from './Icons';

/**
 * One row, one grid — nothing wraps onto a mismatched second line.
 *
 * The previous version filled the first row exactly (brand spans 2 columns +
 * 4 nav columns = 6), which pushed Contact — the next grid item — onto a new
 * row at column 1, directly under the brand block. That put Logo+Contact in
 * a left-hand vertical strip next to a separate right-hand block of nav
 * columns: two visually unrelated halves instead of one footer. Contact now
 * lives inside the brand column itself, so the whole thing is five tracks
 * wide and fits in a single row with nothing left to wrap.
 */
export default function Footer() {
  const featured = cities
    .filter((c) => c.tier === 0 && (c.existingPages.length || c.pagesToBuild.length))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, 8);

  return (
    <footer className="on-dark bg-forest-950 text-white/70">
      <div className="container-page py-14">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image src="/img/brand/logo.png" alt={business.name} width={620} height={828} className="h-14 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {business.tagline}. Serving Northern Virginia, Maryland and the DC metro.
            </p>
            <div className="mt-5 flex gap-3">
              <a href={business.social.facebook} target="_blank" rel="noreferrer noopener" aria-label="Facebook"
                 className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-teal"><Facebook width={18} height={18} /></a>
              <a href={business.social.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram"
                 className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-teal"><Instagram width={18} height={18} /></a>
            </div>

            <address className="not-italic">
              <ul className="mt-6 space-y-3 text-sm">
                <li>
                  <a href={business.phone.href} data-analytics="call-click" data-location="footer"
                     className="flex items-center gap-2 font-display text-base font-bold text-white hover:text-sage">
                    <Phone width={16} height={16} className="shrink-0 text-sage" /> {business.phone.display}
                  </a>
                </li>
                <li>
                  <a href={business.phoneAlt.href} data-analytics="call-click" data-location="footer-alt"
                     className="flex items-center gap-2 hover:text-white">
                    <Phone width={16} height={16} className="shrink-0 text-sage" /> {business.phoneAlt.display}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${business.email.public}`} className="flex items-center gap-2 hover:text-white">
                    <Mail width={16} height={16} className="shrink-0 text-sage" /> {business.email.public}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin width={16} height={16} className="shrink-0 text-sage" />
                  {business.address.addressLocality}, {business.address.addressRegion}
                </li>
                <li className="flex items-start gap-2">
                  <Clock width={16} height={16} className="mt-0.5 shrink-0 text-sage" /> {business.hoursDisplay}
                </li>
              </ul>
            </address>
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

        <div className="mt-12 border-t border-white/10 pt-8">
          <h2 className="text-eyebrow uppercase text-sage">Service areas</h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {featured.map((c) => (
              <Link key={c.slug} href={cityHref(c)} className="hover:text-white">
                {c.name}, {c.state}
              </Link>
            ))}
            <Link href="/service-areas/" className="font-semibold text-sage hover:text-white">
              View all areas →
            </Link>
          </div>
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
