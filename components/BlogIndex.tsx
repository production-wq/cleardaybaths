import Link from 'next/link';
import Image from 'next/image';
import Hero from './Hero';
import Section from './Section';
import CtaBand from './CtaBand';
import Marquee from './Marquee';
import Breadcrumbs from './Breadcrumbs';
import { postsForPage, pageCount, formatDate } from '@/lib/blog';
import { byCategory, pick } from '@/lib/gallery';
import { ArrowRight } from './Icons';

export default function BlogIndex({ page }: { page: number }) {
  const posts = postsForPage(page);
  const thumbs = byCategory('bath-and-shower');

  return (
    <>
      <Hero
        eyebrow="Advice & guides"
        title="Bathroom Remodeling Blog"
        lead="Practical guidance on conversions, accessible bathrooms and getting a remodel right the first time."
        align="center"
        image="/img/gallery/bathroom-remodeling20.webp"
        breadcrumb={<Breadcrumbs trail={[{ label: 'Blog', href: '/blog/' }]} />}
      />

      <Section tone="cream">
        <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const img = pick(thumbs, 1, p.slug)[0];
            return (
              <li key={p.slug} className="card overflow-hidden">
                <Link href={p.path} className="group block">
                  {img && (
                    <Image src={img.src} alt="" width={img.width} height={img.height}
                           className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                  <div className="p-6">
                    <time className="text-xs font-semibold uppercase tracking-wider text-teal" dateTime={p.date}>
                      {formatDate(p.date)}
                    </time>
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug text-ink group-hover:text-teal">
                      {p.title}
                    </h2>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/70">{p.excerpt}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {pageCount > 1 && (
          <nav aria-label="Blog pagination" className="mt-12 flex justify-center gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link key={n} href={n === 1 ? '/blog/' : `/blog/page/${n}/`}
                    aria-current={n === page ? 'page' : undefined}
                    className={`grid h-10 min-w-10 place-items-center rounded-full px-3 text-sm font-semibold ${
                      n === page ? 'bg-teal text-white' : 'bg-white text-ink ring-1 ring-forest-900/10 hover:bg-mint'}`}>
                {n}
              </Link>
            ))}
          </nav>
        )}
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
