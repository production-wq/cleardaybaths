import type { ReactNode } from 'react';
import PhotoBackdrop from './PhotoBackdrop';

type Tone = 'cream' | 'white' | 'mint' | 'dark';

const TONE: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  white: 'bg-white text-ink',
  mint: 'bg-mint text-ink',
  dark: 'on-dark bg-forest-950 text-white',
};

export default function Section({
  tone = 'cream', id, className = '', image, imageFocus = 'left', children,
}: {
  tone?: Tone; id?: string; className?: string;
  /** Photo ground. Dark sections only — a scrim over a light section just muddies it. */
  image?: string;
  imageFocus?: 'left' | 'center' | 'bottom';
  children: ReactNode;
}) {
  const photo = tone === 'dark' && image;
  return (
    <section
      id={id}
      className={`section relative isolate ${TONE[tone]} ${tone === 'dark' && !photo ? 'bg-stripe-dark' : ''} ${className}`}
    >
      {photo && <PhotoBackdrop src={image} focus={imageFocus} />}
      <div className="container-page relative z-10">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, align = 'center', accent,
}: { eyebrow?: string; title: ReactNode; lead?: string; align?: 'center' | 'left'; accent?: string }) {
  return (
    // relative + z-10 keeps headings above any decorative mascot sharing the block.
    <header className={`relative z-10 ${align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-display-lg">
        {title}
        {accent && <> <span className="text-teal">{accent}</span></>}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed opacity-75">{lead}</p>}
    </header>
  );
}
