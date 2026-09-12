import type { ReactNode } from 'react';

type Tone = 'cream' | 'white' | 'mint' | 'dark';

const TONE: Record<Tone, string> = {
  cream: 'bg-cream text-ink',
  white: 'bg-white text-ink',
  mint: 'bg-mint text-ink',
  dark: 'on-dark bg-forest-900 text-white bg-stripe-dark',
};

export default function Section({
  tone = 'cream', id, className = '', children,
}: { tone?: Tone; id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={`section ${TONE[tone]} ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow, title, lead, align = 'center', accent,
}: { eyebrow?: string; title: ReactNode; lead?: string; align?: 'center' | 'left'; accent?: string }) {
  return (
    <header className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-display-lg">
        {title}
        {accent && <> <span className="text-teal">{accent}</span></>}
      </h2>
      {lead && <p className="mt-4 text-base leading-relaxed opacity-75">{lead}</p>}
    </header>
  );
}
