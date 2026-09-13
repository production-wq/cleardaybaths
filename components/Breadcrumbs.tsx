import Link from 'next/link';

export interface Crumb { label: string; href?: string }

export default function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-forest-900/8 bg-white">
      <ol className="container-page flex flex-wrap items-center gap-x-2 gap-y-1 py-3 text-xs text-ink/60">
        <li><Link href="/" className="hover:text-teal">Home</Link></li>
        {trail.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            <span aria-hidden className="text-ink/25">/</span>
            {c.href && i < trail.length - 1
              ? <Link href={c.href} className="hover:text-teal">{c.label}</Link>
              : <span className="font-semibold text-ink/80" aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
