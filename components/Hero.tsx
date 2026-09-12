import Link from 'next/link';
import { business } from '@/lib/business';
import { advantages } from '@/lib/content';
import { Phone, ArrowRight, Check } from './Icons';

export default function Hero({
  eyebrow = 'Welcome to Clear Day', title, lead, align = 'left',
}: { eyebrow?: string; title: React.ReactNode; lead?: string; align?: 'left' | 'center' }) {
  const centred = align === 'center';
  return (
    <>
      <section className="on-dark relative overflow-hidden bg-forest-900 bg-stripe-dark text-white">
        {/* Depth wash so the headline holds contrast over the stripe texture. */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-forest-950/70 via-forest-900/30 to-transparent" />
        <div className={`container-page relative py-20 sm:py-24 lg:py-32 ${centred ? 'text-center' : ''}`}>
          <div className={centred ? 'mx-auto max-w-3xl' : 'max-w-2xl'}>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-4 text-display-xl">{title}</h1>
            {lead && <p className="mt-5 text-lg leading-relaxed text-white/80">{lead}</p>}
            <div className={`mt-9 flex flex-wrap gap-3 ${centred ? 'justify-center' : ''}`}>
              <Link href="/get-quote/" className="btn-primary">Get Free Quote <ArrowRight /></Link>
              <a href={business.phone.href} data-analytics="call-click" data-location="hero" className="btn-outline">
                <Phone width={16} height={16} /> Call {business.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="on-dark border-t border-white/10 bg-forest-800 text-white">
        <ul className="container-page grid gap-x-8 gap-y-3 py-5 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.map((a) => (
            <li key={a.key} className="flex items-center gap-2.5 text-sm font-semibold">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal">
                <Check width={14} height={14} />
              </span>
              {a.title}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
