import Image from 'next/image';

/**
 * Photographic ground for dark sections.
 *
 * A flat colour wash over a photo kills the photo — you end up with an
 * expensive-looking rectangle of green. Instead the scrim is a *gradient*:
 * opaque where the copy sits, thinning to nearly clear on the opposite side so
 * the bathroom is actually legible. The stripe texture rides on top of both.
 *
 * `focus` says which side the copy occupies, so the dark end goes there.
 */
export default function PhotoBackdrop({
  src, focus = 'left', priority = false, intensity = 'normal',
}: {
  src: string;
  focus?: 'left' | 'center' | 'bottom';
  priority?: boolean;
  intensity?: 'normal' | 'strong';
}) {
  const scrim = {
    left:
      intensity === 'strong'
        ? 'bg-[linear-gradient(100deg,rgba(13,27,23,.96)_0%,rgba(13,27,23,.9)_38%,rgba(21,42,37,.6)_62%,rgba(21,42,37,.28)_100%)]'
        : 'bg-[linear-gradient(100deg,rgba(13,27,23,.93)_0%,rgba(13,27,23,.78)_40%,rgba(21,42,37,.45)_68%,rgba(21,42,37,.18)_100%)]',
    center:
      'bg-[radial-gradient(120%_100%_at_50%_45%,rgba(13,27,23,.55)_0%,rgba(13,27,23,.86)_55%,rgba(13,27,23,.96)_100%)]',
    bottom:
      'bg-[linear-gradient(to_top,rgba(13,27,23,.96)_0%,rgba(13,27,23,.8)_35%,rgba(21,42,37,.4)_70%,rgba(21,42,37,.15)_100%)]',
  }[focus];

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        priority={priority}
        className="object-cover"
      />
      <div className={`absolute inset-0 ${scrim}`} />
      <div className="absolute inset-0 bg-stripe-dark opacity-60" />
    </div>
  );
}
