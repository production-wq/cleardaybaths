/**
 * The routing registry. This is what makes the zero-traffic-loss guarantee
 * mechanical rather than aspirational.
 *
 * Every root-level dynamic route calls `rootSlugs()` / `nestedParams()` for its
 * `generateStaticParams`, and sets `dynamicParams = false`. The consequence:
 * a URL renders if and only if it is in this registry. Anything else is a real
 * 404 instead of a silently-generated thin page.
 *
 * Data is derived from the WordPress export + GSC by scripts/bootstrap/*.py.
 * Do not hand-edit data/routes.json or data/cities.json — re-run the bootstrap.
 */
import 'server-only';
import citiesData from '@/data/cities.json';
import servicesData from '@/data/services.json';
import routesData from '@/data/routes.json';

export type ServiceSlug =
  | 'accessible-bathroom'
  | 'shower-remodel'
  | 'tub-to-shower-conversions'
  | 'walk-in-bathtubs';

export interface CityPage {
  url: string;
  status: 'preserve' | 'restore';
  service: ServiceSlug | null;
  gscImpressions: number;
  gscPosition: number | null;
}

export interface City {
  slug: string;
  name: string;
  state: 'VA' | 'MD' | 'DC';
  county: string;
  nearby: string[];
  note: string;
  /** nested = /city/service/ · flat = legacy one-off slugs · new = built by us */
  pattern: 'nested' | 'flat' | 'new';
  /** 0 = already exists · 1 = build now · 2 = build after tier 1 */
  tier: 0 | 1 | 2;
  existingPages: CityPage[];
  pagesToBuild: string[];
  queryEvidence?: {
    totalImpressions: number;
    hubImpressions: number;
    topQueries: { query: string; impressions: number; position: number }[];
    byService: Record<string, { impressions: number; topQuery: string; bestPosition: number }>;
  };
}

export interface ServiceChild {
  slug: string; path: string; title: string; seoTitle: string; seoDesc: string;
}
export interface ServiceHub extends ServiceChild { children: ServiceChild[] }

export const cities = citiesData as City[];
export const serviceHubs = servicesData as ServiceHub[];
export const preserved = routesData.preserved as { url: string; kind: string }[];
export const redirects = routesData.redirects as { from: string; to: string }[];

export const cityBySlug = new Map(cities.map((c) => [c.slug, c]));
export const hubBySlug = new Map(serviceHubs.map((h) => [h.slug, h]));

/** Every URL the built site will serve, preserved + newly built. */
export function allUrls(): string[] {
  return [...new Set([...preserved.map((p) => p.url), ...routesData.build])].sort();
}

/* ------------------------------------------------------------------ *
 * Root-level slug resolution — app/[slug]/page.tsx
 *
 * Static folders (about-us, blog, bathrooms, …) are real directories and win
 * over this dynamic segment, so only geo URLs reach here.
 * ------------------------------------------------------------------ */

export type RootRoute =
  | { kind: 'city-hub'; city: City }
  | { kind: 'city-service'; city: City; service: ServiceSlug | null; page: CityPage };

export function resolveRootSlug(slug: string): RootRoute | null {
  const path = `/${slug}/`;

  const hub = cities.find((c) => c.slug === slug);
  if (hub && (hub.pagesToBuild.includes(path) || hub.existingPages.some((p) => p.url === path))) {
    return { kind: 'city-hub', city: hub };
  }

  for (const city of cities) {
    const page = city.existingPages.find((p) => p.url === path);
    // A bare /city/ match is the hub, handled above; this branch is flat slugs only.
    if (page && city.slug !== slug) {
      return { kind: 'city-service', city, service: page.service, page };
    }
  }
  return null;
}

export function rootSlugs(): { slug: string }[] {
  const out = new Set<string>();
  for (const c of cities) {
    for (const p of [...c.existingPages.map((e) => e.url), ...c.pagesToBuild]) {
      const seg = p.split('/').filter(Boolean);
      if (seg.length === 1) out.add(seg[0]);
    }
  }
  return [...out].sort().map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ *
 * Nested city services — app/[slug]/[service]/page.tsx
 * ------------------------------------------------------------------ */

export function resolveNested(slug: string, service: string) {
  const city = cityBySlug.get(slug);
  if (!city) return null;
  const path = `/${slug}/${service}/`;
  const existing = city.existingPages.find((p) => p.url === path);
  if (existing) return { city, service: service as ServiceSlug, page: existing, isNew: false };
  if (city.pagesToBuild.includes(path)) {
    return { city, service: service as ServiceSlug, page: null, isNew: true };
  }
  return null;
}

export function nestedParams(): { slug: string; service: string }[] {
  const out: { slug: string; service: string }[] = [];
  for (const c of cities) {
    for (const p of [...c.existingPages.map((e) => e.url), ...c.pagesToBuild]) {
      const seg = p.split('/').filter(Boolean);
      if (seg.length === 2) out.push({ slug: seg[0], service: seg[1] });
    }
  }
  return out;
}
