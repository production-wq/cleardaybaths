'use client';

import Link from 'next/link';
import { business } from '@/lib/business';
import { Phone, ArrowRight } from './Icons';

/**
 * Persistent mobile call/quote bar. Phone traffic is the majority of this
 * market's leads, so the call action is never more than a thumb away.
 */
export default function StickyCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-forest-900/10 bg-white/95 p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <div className="flex items-center gap-2">
        <a
          href={business.phone.href}
          data-analytics="call-click"
          data-location="sticky-bar"
          className="btn-outline flex-1"
        >
          <Phone width={16} height={16} className="text-teal" /> Call Now
        </a>
        <Link href="/get-quote/" className="btn-primary flex-1">
          Free Quote <ArrowRight />
        </Link>
      </div>
    </div>
  );
}
