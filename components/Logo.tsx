import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/lib/business';

/**
 * Header lockup: the droplet mark as an image plus the wordmark as live text.
 * The source logo is a stacked lockup whose own wordmark is illegible below
 * ~80px, so at header scale the mark carries the brand and the text is real
 * text — crisper, selectable, and readable to screen readers.
 */
export default function Logo({ onDark = false, className = '' }: { onDark?: boolean; className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`} aria-label={`${business.name} — home`}>
      <Image
        src="/img/brand/logo.png"
        alt=""
        width={620}
        height={828}
        priority
        className="h-11 w-auto shrink-0"
      />
      <span className="leading-none">
        <span className={`block font-display text-lg font-bold tracking-tight ${onDark ? 'text-white' : 'text-ink'}`}>
          Clear Day
        </span>
        <span className={`mt-1 block text-[0.58rem] font-semibold uppercase tracking-[0.2em] ${onDark ? 'text-sage' : 'text-greige'}`}>
          Bath Solutions
        </span>
      </span>
    </Link>
  );
}
