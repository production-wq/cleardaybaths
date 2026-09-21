import Link from 'next/link';
import statsData from '@/data/stats.json';
import type { ReviewsData } from '@/lib/googleReviews';

/**
 * Matches the live site's "What Sets Us Apart" bar — each stat carries its
 * own CTA rather than sitting as an inert number. Only renders figures we can
 * stand behind: satisfaction/experience are dropped if ever unset again
 * (data/stats.json), and the rating comes from the live Google feed so it can
 * never claim a score the reviews don't support.
 */
export default function StatsRow({ aggregate }: { aggregate: ReviewsData['aggregate'] }) {
  const configured = (statsData.stats as { key: string; label: string; value: number | null; suffix: string }[])
    .filter((s): s is { key: string; label: string; value: number; suffix: string } => s.value !== null);

  const ctaByKey: Record<string, { label: string; href: string }> = {
    satisfaction: { label: 'About Us', href: '/about-us/' },
    experience: { label: 'Contact Us', href: '/contact-us/' },
  };

  const stats = [
    ...configured.map((s) => ({ label: s.label, value: String(s.value), suffix: s.suffix, cta: ctaByKey[s.key] })),
    ...(aggregate.value !== null
      ? [{
          label: 'Rated services', value: aggregate.value % 1 === 0 ? String(aggregate.value) : aggregate.value.toFixed(1),
          suffix: '/5', cta: { label: 'Reviews', href: '/reviews/' },
        }]
      : []),
  ];

  if (!stats.length) return null;

  return (
    <dl className={`mt-12 grid gap-8 text-center ${stats.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span className="block font-display text-display-lg text-white">
              {s.value}<span className="text-sage">{s.suffix}</span>
            </span>
            <span className="mt-2 block text-eyebrow uppercase text-white/60">{s.label}</span>
            {s.cta && (
              <Link href={s.cta.href} className="btn-outline mt-4 border-white/40 bg-white/15 backdrop-blur-md">
                {s.cta.label}
              </Link>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
