import Link from 'next/link';
import { business } from '@/lib/business';
import { advantages } from '@/lib/content';
import Image from 'next/image';
import PhotoBackdrop from './PhotoBackdrop';
import { Phone, ArrowRight, Check } from './Icons';

export default function Hero({
  eyebrow = 'Welcome to Clear Day',
  title,
  lead,
  align = 'left',
  image = '/img/gallery/bath-and-shower-remodel1.webp',
  breadcrumb,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  align?: 'left' | 'center';
  image?: string;
  breadcrumb?: React.ReactNode;
}) {
  const centred = align === 'center';
  return (
    <>
      <section className="on-dark relative isolate overflow-hidden bg-forest-950 text-white">
        <PhotoBackdrop src={image} focus={centred ? 'center' : 'left'} priority />

        {/*
         * The mascot, seamlessly placed at the very top of every page —
         * directly under the header, in the first section a visitor sees.
         * Waving, so it reads as a greeting rather than a random sticker.
         * Right-aligned and desktop-only: at `align="left"` there is real
         * open space to its right above the photo; at `align="center"` it
         * sits in the same top-right corner, clear of the centred text
         * column below it. z-10 keeps it above the photo's gradient scrim
         * so it doesn't wash out against the darkest part of the overlay.
         */}
        <Image
          src="/img/mascot/mascot-4.webp"
          alt=""
          aria-hidden
          width={420}
          height={420}
          className="pointer-events-none absolute -top-4 right-6 z-10 hidden w-40 select-none drop-shadow-2xl md:block lg:w-52 xl:right-10"
        />

        <div className={`container-page relative z-10 py-20 sm:py-24 lg:py-32 ${centred ? 'text-center' : ''}`}>
          <div className={centred ? 'mx-auto max-w-3xl' : 'max-w-2xl'}>
            <p className="eyebrow drop-shadow">{eyebrow}</p>
            <h1 className="mt-4 text-display-xl [text-shadow:0_2px_24px_rgba(13,27,23,.5)]">{title}</h1>
            {lead && <p className="mt-5 text-lg leading-relaxed text-white/85">{lead}</p>}
            <div className={`mt-9 flex flex-wrap gap-3 ${centred ? 'justify-center' : ''}`}>
              <Link href="/get-quote/" className="btn-primary shadow-lg shadow-forest-950/30">
                Get Free Quote <ArrowRight />
              </Link>
              <a href={business.phone.href} data-analytics="call-click" data-location="hero"
                 className="btn-outline bg-white/5 backdrop-blur-sm">
                <Phone width={16} height={16} /> Call {business.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {breadcrumb}

      {/* Trust strip */}
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
