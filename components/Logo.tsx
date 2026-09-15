import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/lib/business';

/**
 * Header lockup: the droplet mark as an image plus the wordmark as live text.
 * The source logo is a stacked lockup whose own wordmark is illegible below
 * ~80px, so at header scale the mark carries the brand and the text is real
 * text — crisper, selectable, and readable to screen readers.
 *
 * Sized to match the live site's header, where the logo is clearly the
 * largest single element in the bar rather than sitting level with the nav.
 */
export default function Logo({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`} aria-label={`${business.name} — home`}>
      <Image
        src="/img/brand/logo.png"
        alt=""
        width={620}
        height={828}
        priority
        className="h-16 w-auto shrink-0"
      />
      <span className="leading-none">
        <span className={`block font-display text-2xl font-bold tracking-tight ${onDark ? 'text-white' : 'text-ink'}`}>
          Clear Day
        </span>
        <span className={`mt-1 block text-xs font-semibold uppercase tracking-[0.2em] ${onDark ? 'text-sage' : 'text-greige'}`}>
          Bath Solutions
        </span>
      </span>
    </Link>
  );
}
