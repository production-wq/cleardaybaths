import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import Breadcrumbs from '@/components/Breadcrumbs';
import SidebarQuoteCard from '@/components/SidebarQuoteCard';
import CtaBand from '@/components/CtaBand';
import Marquee from '@/components/Marquee';
import { JsonLdScript, graph, articleNode, breadcrumbNode } from '@/lib/schema';
import { allPosts, postBySlug, formatDate } from '@/lib/blog';
import { byCategory, pick } from '@/lib/gallery';
import { meta } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};
  return meta({
    title: post.seoTitle?.trim() || post.title,
    description: post.seoDesc?.trim() || post.excerpt.slice(0, 155),
    path: post.path,
    type: 'article',
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const hero = pick(byCategory('bath-and-shower'), 1, slug)[0];
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const crumbs = [{ label: 'Blog', href: '/blog/' }, { label: post.title, href: post.path }];

  return (
    <>
      <JsonLdScript
        data={graph([
          articleNode({
            headline: post.title,
            description: post.excerpt.slice(0, 200),
            path: post.path,
            datePublished: post.date,
            image: hero?.src,
          }),
          breadcrumbNode(crumbs),
        ])}
      />

      <Hero
        eyebrow="From the blog"
        title={post.title}
        lead={formatDate(post.date)}
        align="center"
        image={hero?.src ?? '/img/gallery/bath-and-shower-remodel1.webp'}
        breadcrumb={<Breadcrumbs trail={crumbs} />}
      />

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <article className="prose-cd">
            {post.body.map((p, i) => (
              <p key={i} className={i === 0 ? 'text-lg leading-relaxed text-ink/85' : ''}>{p}</p>
            ))}

            {related.length > 0 && (
              <aside className="not-prose mt-12 border-t border-forest-900/10 pt-8">
                <h2 className="font-display text-lg font-bold text-ink">Keep reading</h2>
                <ul className="mt-4 space-y-3">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={r.path} className="font-semibold text-teal hover:text-teal-hover">{r.title}</Link>
                      <span className="ml-2 text-xs text-ink/50">{formatDate(r.date)}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            )}
          </article>
          <SidebarQuoteCard />
        </div>
      </Section>

      <CtaBand />
      <Marquee tone="mint" />
    </>
  );
}
