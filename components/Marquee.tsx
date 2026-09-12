import { marqueeItems } from '@/lib/content';

/**
 * Scrolling keyword band. The track is duplicated and translated -50%, so the
 * loop has no visible seam. Decorative only — hidden from assistive tech, and
 * the animation stops under prefers-reduced-motion.
 */
export default function Marquee({ tone = 'dark' }: { tone?: 'dark' | 'mint' }) {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div
      aria-hidden
      className={`overflow-hidden py-4 ${tone === 'dark' ? 'bg-forest-800 text-white' : 'bg-mint text-forest-800'}`}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-6 px-6 font-display text-sm font-semibold uppercase tracking-wide sm:text-base">
            {item}
            <span className={tone === 'dark' ? 'text-sage' : 'text-teal'}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
