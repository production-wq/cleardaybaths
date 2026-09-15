import Image from 'next/image';
import Link from 'next/link';
import { business } from '@/lib/business';

/**
 * Header mark: the full droplet lockup image alone — no separate live-text
 * wordmark alongside it.
 *
 * That used to be two elements (image + a "Clear Day / Bath Solutions" text
 * span) because the image's own baked-in wordmark goes illegible below
 * ~80px. But the live text span didn't reserve a fixed width, so at header
 * widths tight enough to matter — most of them, once the nav is also
 * competing for space — it wrapped mid-word instead of just shrinking,
 * which read as broken on desktop and cramped on mobile.
 *
 * Sized tall enough (h-20) that the image's own wordmark stays legible now
 * that it's carrying the brand alone. The accessible name lives on the
 * Link's aria-label, so the image itself stays decorative (alt="").
 */
export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center ${className}`} aria-label={`${business.name} — home`}>
      <Image
        src="/img/brand/logo.png"
        alt=""
        width={620}
        height={828}
        priority
        className="h-20 w-auto shrink-0"
      />
    </Link>
  );
}
