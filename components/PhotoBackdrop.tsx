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
        ? 'bg-[linear-gradient(100deg,rgba(0,0,0,.9)_0%,rgba(0,0,0,.82)_38%,rgba(13,13,13,.5)_62%,rgba(13,13,13,.2)_100%)]'
        : 'bg-[linear-gradient(100deg,rgba(0,0,0,.85)_0%,rgba(0,0,0,.65)_40%,rgba(13,13,13,.35)_68%,rgba(13,13,13,.12)_100%)]',
    center:
      'bg-[radial-gradient(120%_100%_at_50%_45%,rgba(0,0,0,.45)_0%,rgba(0,0,0,.78)_55%,rgba(0,0,0,.9)_100%)]',
    bottom:
      'bg-[linear-gradient(to_top,rgba(0,0,0,.9)_0%,rgba(0,0,0,.7)_35%,rgba(13,13,13,.3)_70%,rgba(13,13,13,.1)_100%)]',
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
    </div>
  );
}
