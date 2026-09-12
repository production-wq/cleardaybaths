/**
 * Service taxonomy — 3 hubs and their 16 children, derived from the WordPress
 * page tree by scripts/bootstrap/extract_wp.py.
 *
 * Deliberately separate from lib/routes.ts: the header nav is a client
 * component, and importing it through routes.ts would pull the whole city
 * registry (36 cities with GSC evidence) into the browser bundle for no reason.
 */
import servicesData from '@/data/services.json';

export interface ServiceChild {
  slug: string; path: string; title: string; seoTitle: string; seoDesc: string;
}
export interface ServiceHub extends ServiceChild { children: ServiceChild[] }

export const serviceHubs = servicesData as ServiceHub[];
export const hubBySlug = new Map(serviceHubs.map((h) => [h.slug, h]));

/** Flat list of every service page, hubs and children together. */
export const allServices: ServiceChild[] = serviceHubs.flatMap((h) => [h, ...h.children]);

export const serviceByPath = new Map(allServices.map((s) => [s.path, s]));
