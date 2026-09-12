'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { business } from '@/lib/business';
import { primaryNav, utilityNav } from '@/lib/nav';
import Logo from './Logo';
import { Phone, ChevronDown, Menu, Close, Facebook, Instagram } from './Icons';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A menu that scrolls the page behind it feels broken on phones.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className="sticky top-0 z-40">
      {/* Utility bar */}
      <div className="on-dark hidden bg-forest-900 text-white/85 lg:block">
        <div className="container-page flex h-10 items-center justify-between text-xs">
          <nav aria-label="Utility" className="flex items-center gap-5">
            {utilityNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={business.phone.href} className="flex items-center gap-1.5 font-semibold text-white hover:text-sage">
              <Phone width={14} height={14} /> {business.phone.display}
            </a>
            <span className="h-3 w-px bg-white/20" />
            <a href={business.social.facebook} target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="hover:text-sage"><Facebook /></a>
            <a href={business.social.instagram} target="_blank" rel="noreferrer noopener" aria-label="Instagram" className="hover:text-sage"><Instagram /></a>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className={`transition-colors duration-200 ${scrolled ? 'bg-white shadow-sm' : 'bg-white lg:bg-white/95 lg:backdrop-blur'}`}>
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((item) => (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-semibold text-ink/80 hover:bg-mint/60 hover:text-ink"
                >
                  {item.label}
                  {item.children && <ChevronDown className="transition-transform group-hover:rotate-180" />}
                </Link>
                {item.children && (
                  <div className="invisible absolute left-0 top-full w-64 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="card overflow-hidden py-2">
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block px-4 py-2 text-sm text-ink/75 hover:bg-mint/50 hover:text-ink">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <a href={business.phone.href} className="hidden items-center gap-1.5 text-sm font-bold text-ink xl:flex">
              <Phone width={16} height={16} className="text-teal" /> {business.phone.display}
            </a>
            <Link href="/get-quote/" className="btn-primary hidden text-xs sm:inline-flex">Get Free Quote</Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="rounded-xl bg-mint p-2.5 text-forest-800 lg:hidden"
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-forest-900/10 bg-white lg:hidden"
      >
        <nav aria-label="Mobile" className="container-page py-4">
          {primaryNav.map((item) => (
            <details key={item.href} className="border-b border-forest-900/8 last:border-0">
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-display font-semibold text-ink marker:content-none">
                <Link href={item.href} onClick={(e) => e.stopPropagation()}>{item.label}</Link>
                {item.children && <ChevronDown />}
              </summary>
              {item.children && (
                <ul className="pb-3 pl-3">
                  {item.children.map((c) => (
                    <li key={c.href}>
                      <Link href={c.href} className="block py-2 text-sm text-ink/70">{c.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </details>
          ))}
          <div className="mt-4 grid gap-2 pb-4">
            <Link href="/get-quote/" className="btn-primary w-full">Get Free Quote</Link>
            <a href={business.phone.href} className="btn-outline w-full">
              <Phone width={16} height={16} /> Call {business.phone.display}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
