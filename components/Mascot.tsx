import Image from 'next/image';

/**
 * The Clear Day droplet character.
 *
 * Decorative only (alt="", aria-hidden) and behind the content: z-0 with
 * pointer-events-none. Section headings carry z-10, so a mascot can sit near a
 * heading without ever landing on top of the words.
 *
 * Hidden below `lg` — at tablet and phone widths there is no margin for it to
 * live in, and it lands on the copy.
 */
export default function Mascot({
  n = 1, className = '', width = 180,
}: { n?: number; className?: string; width?: number }) {
  return (
    <Image
      src={`/img/mascot/mascot-${n}.webp`}
      alt=""
      aria-hidden
      width={width}
      height={width}
      className={`pointer-events-none absolute z-0 hidden select-none opacity-90 lg:block ${className}`}
    />
  );
}
