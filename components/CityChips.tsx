import Link from 'next/link';
import { cities, type City } from '@/lib/routes';

/** Resolve a city to its best landing page so a chip never points at a 404. */
export function cityHref(c: City): string {
  return (
    c.existingPages.find((p) => !p.service)?.url ??
    c.pagesToBuild.find((u) => u.split('/').filter(Boolean).length === 1) ??
    c.existingPages[0]?.url ??
    c.pagesToBuild[0]
  );
}

export default function CityChips({ limit = 12, tone = 'light' }: { limit?: number; tone?: 'light' | 'dark' }) {
  const list = cities
    .filter((c) => c.existingPages.length || c.pagesToBuild.length)
    .sort((a, b) => a.tier - b.tier || a.name.localeCompare(b.name))
    .slice(0, limit);

  return (
    <ul className="mt-8 flex flex-wrap gap-2.5">
      {list.map((c) => (
        <li key={c.slug}>
          <Link
            href={cityHref(c)}
            className={`inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tone === 'dark' ? 'bg-white/10 text-white hover:bg-teal'
                              : 'bg-white text-ink ring-1 ring-forest-900/10 hover:bg-mint'}`}
          >
            {c.name}, {c.state}
          </Link>
        </li>
      ))}
      <li>
        <Link href="/service-areas/"
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${tone === 'dark' ? 'text-sage hover:text-white' : 'text-teal hover:text-teal-hover'}`}>
          View all service areas →
        </Link>
      </li>
    </ul>
  );
}
