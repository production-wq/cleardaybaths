import { aggregate } from '@/lib/reviews';
import statsData from '@/data/stats.json';

/**
 * Only renders figures we can stand behind.
 *
 * The live site's counters read 0%/0+/0/5 and the two design artifacts disagree
 * with each other (96%/10+/5 vs 64%/7+/3), so those numbers are invented. Any
 * stat whose value is null is dropped rather than filled with a guess; the
 * rating and review count are computed from data/reviews.json.
 */
export default function StatsRow() {
  const configured = (statsData.stats as { key: string; label: string; value: unknown; suffix: string }[])
    .filter((s) => s.value !== null)
    .map((s) => ({ label: s.label, value: String(s.value), suffix: s.suffix }));

  const stats = [
    ...configured,
    ...(aggregate.value !== null
      ? [{ label: 'Rated services', value: aggregate.value.toFixed(1), suffix: '/5' }] : []),
    ...(aggregate.count
      ? [{ label: aggregate.count === 1 ? 'Verified review' : 'Verified reviews', value: String(aggregate.count), suffix: '' }] : []),
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
          </dd>
        </div>
      ))}
    </dl>
  );
}
