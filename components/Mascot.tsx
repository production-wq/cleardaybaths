import Image from 'next/image';

/**
 * The Clear Day droplet character. Purely decorative — every instance is
 * alt="" so screen readers skip it rather than announcing nine mascots.
 */
export default function Mascot({
  n = 1, className = '', width = 200,
}: { n?: number; className?: string; width?: number }) {
  return (
    <Image
      src={`/img/mascot/mascot-${n}.webp`}
      alt=""
      aria-hidden
      width={width}
      height={width}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}
