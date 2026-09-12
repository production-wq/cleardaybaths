'use client';

import { useCallback, useRef, useState } from 'react';
import Image from 'next/image';

export interface Pair {
  id: string; before: string; after: string;
  width: number; height: number; slider: boolean;
}

/**
 * Overlay comparison slider. Keyboard-operable via the arrow keys on a real
 * range input rather than a div with mouse handlers, so it works without a
 * pointer and announces itself correctly.
 *
 * Pairs whose two halves were shot at very different aspect ratios are flagged
 * `slider: false` upstream and render side by side — an overlay of mismatched
 * framings reads as a rendering bug rather than a transformation.
 */
export default function BeforeAfterSlider({ pair, label }: { pair: Pair; label?: string }) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);

  const dragTo = useCallback((clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  if (!pair.slider) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {(['before', 'after'] as const).map((side) => (
          <figure key={side} className="overflow-hidden rounded-panel">
            <Image src={pair[side]} alt={`${label ?? 'Bathroom project'} — ${side}`}
                   width={pair.width} height={pair.height} className="h-full w-full object-cover" />
            <figcaption className="bg-forest-900 py-2 text-center text-xs font-semibold uppercase tracking-wider text-white">
              {side}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={box}
      className="relative select-none overflow-hidden rounded-panel"
      style={{ aspectRatio: `${pair.width} / ${pair.height}` }}
      onPointerMove={(e) => e.buttons === 1 && dragTo(e.clientX)}
      onPointerDown={(e) => dragTo(e.clientX)}
    >
      <Image src={pair.after} alt={`${label ?? 'Bathroom project'} — after`}
             width={pair.width} height={pair.height} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <Image src={pair.before} alt={`${label ?? 'Bathroom project'} — before`}
               width={pair.width} height={pair.height}
               className="h-full w-full object-cover"
               style={{ width: box.current?.offsetWidth ?? '100%', maxWidth: 'none' }} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-forest-950/75 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">Before</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-teal px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">After</span>

      <div className="pointer-events-none absolute inset-y-0 w-1 -translate-x-1/2 bg-white shadow-lg" style={{ left: `${pos}%` }}>
        <span className="absolute top-1/2 left-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-forest-800 shadow-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m9 6-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </span>
      </div>

      <input
        type="range" min={0} max={100} value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Reveal ${label ?? 'the'} before and after comparison`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
