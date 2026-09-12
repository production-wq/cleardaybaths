import Link from 'next/link';
import Image from 'next/image';
import { serviceHubs } from '@/lib/services';
import { ArrowRight } from './Icons';

const BLURB: Record<string, string> = {
  bathrooms: 'Full renovations, accessible layouts, replacement tubs and one-day baths — designed around how your household actually uses the room.',
  showers: 'Acrylic and tiled showers, enclosures, surrounds and replacements, sized to your opening instead of forced from a stock kit.',
  'bath-conversions': 'Swap a tub you step over for a shower you walk into, or add a walk-in or therapeutic tub without moving plumbing.',
};

const HERO_IMG: Record<string, string> = {
  bathrooms: '/img/gallery/bathroom-remodeling1.webp',
  showers: '/img/gallery/shower-replacement1.webp',
  'bath-conversions': '/img/gallery/bath-and-shower-remodel1.webp',
};

export default function ServiceCards() {
  return (
    <div className="mt-12 grid gap-6 md:grid-cols-3">
      {serviceHubs.map((hub) => (
        <article key={hub.slug} className="on-dark group relative overflow-hidden rounded-panel bg-forest-900 text-white">
          <Image src={HERO_IMG[hub.slug]} alt="" width={1600} height={1600}
                 className="absolute inset-0 h-full w-full object-cover opacity-30 transition duration-500 group-hover:scale-105 group-hover:opacity-40" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-900/85 to-forest-900/45" />
          <div className="relative flex h-full min-h-[19rem] flex-col justify-end p-7">
            <h3 className="font-display text-2xl font-bold">{hub.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-white/75">{BLURB[hub.slug]}</p>
            <Link href={hub.path} className="btn-primary mt-6 self-start text-xs" aria-label={`Explore ${hub.title}`}>
              Explore <ArrowRight />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
