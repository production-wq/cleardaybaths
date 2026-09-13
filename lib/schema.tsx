/**
 * Hand-authored JSON-LD. No plugin, no client injection.
 *
 * ONE root entity (#business), referenced everywhere by @id — a full
 * LocalBusiness block repeated on 235 pages tells Google there are 235
 * businesses. aggregateRating is computed from data/reviews.json so the rich
 * result can never claim a rating the reviews do not support.
 */
import { business, abs, SITE_URL } from './business';
import { reviews, aggregate } from './reviews';
import type { City } from './routes';

export interface JsonLd { [k: string]: unknown }

const ID = {
  business: `${SITE_URL}/#business`,
  website: `${SITE_URL}/#website`,
  logo: `${SITE_URL}/#logo`,
};

export const graph = (nodes: (JsonLd | false | null | undefined)[]): JsonLd => ({
  '@context': 'https://schema.org',
  '@graph': nodes.filter(Boolean) as JsonLd[],
});

/** Root entity. Injected once, in the root layout. */
export function businessNode(areaServed: City[]): JsonLd {
  const a = business.address;
  return {
    '@type': ['HomeAndConstructionBusiness', 'GeneralContractor'],
    '@id': ID.business,
    name: business.name,
    legalName: business.legalName,
    slogan: business.tagline,
    url: abs('/'),
    telephone: business.phone.e164,
    email: business.email.public,
    priceRange: '$$',
    currenciesAccepted: 'USD',
    image: abs('/img/brand/logo-square.png'),
    logo: { '@type': 'ImageObject', '@id': ID.logo, url: abs('/img/brand/logo-square.png'), width: 1200, height: 1200 },
    // Service-area business: no street address is published anywhere, so none is
    // invented here. addressLocality + areaServed is the honest shape.
    address: {
      '@type': 'PostalAddress',
      addressLocality: a.addressLocality,
      addressRegion: a.addressRegion,
      addressCountry: a.addressCountry,
      ...(a.streetAddress ? { streetAddress: a.streetAddress } : {}),
      ...(a.postalCode ? { postalCode: a.postalCode } : {}),
    },
    geo: { '@type': 'GeoCoordinates', latitude: business.geo.latitude, longitude: business.geo.longitude },
    openingHoursSpecification: business.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days.map((d) => `https://schema.org/${d}`),
      opens: h.opens, closes: h.closes,
    })),
    areaServed: areaServed.map((c) => ({
      '@type': 'City', name: c.name,
      address: { '@type': 'PostalAddress', addressLocality: c.name, addressRegion: c.state, addressCountry: 'US' },
    })),
    sameAs: [business.social.facebook, business.social.instagram],
    ...(aggregate.value !== null && aggregate.count > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregate.value,
            reviewCount: aggregate.count,
            bestRating: aggregate.best,
            worstRating: aggregate.worst,
          },
          review: reviews.map((r) => ({
            '@type': 'Review',
            name: r.title,
            datePublished: r.date,
            reviewBody: r.body,
            author: { '@type': 'Person', name: r.author },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
          })),
        }
      : {}),
  };
}

export function websiteNode(): JsonLd {
  return {
    '@type': 'WebSite', '@id': ID.website, url: abs('/'),
    name: business.name, publisher: { '@id': ID.business },
    inLanguage: 'en-US',
  };
}

export function serviceNode({
  name, description, path, areaServed,
}: { name: string; description: string; path: string; areaServed?: string[] }): JsonLd {
  return {
    '@type': 'Service',
    '@id': `${abs(path)}#service`,
    name,
    description,
    serviceType: name,
    url: abs(path),
    provider: { '@id': ID.business },
    ...(areaServed?.length
      ? { areaServed: areaServed.map((n) => ({ '@type': 'City', name: n })) }
      : { areaServed: business.regions.map((n) => ({ '@type': 'AdministrativeArea', name: n })) }),
  };
}

export function breadcrumbNode(trail: { label: string; href: string }[]): JsonLd {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ label: 'Home', href: '/' }, ...trail].map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.label, item: abs(c.href),
    })),
  };
}

export function faqNode(faqs: { q: string; a: string }[]): JsonLd | null {
  if (!faqs.length) return null;
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function articleNode({
  headline, description, path, datePublished, dateModified, image,
}: {
  headline: string; description: string; path: string;
  datePublished: string; dateModified?: string; image?: string;
}): JsonLd {
  return {
    '@type': 'Article',
    '@id': `${abs(path)}#article`,
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    mainEntityOfPage: { '@type': 'WebPage', '@id': abs(path) },
    author: { '@id': ID.business },
    publisher: { '@id': ID.business },
    ...(image ? { image: abs(image) } : {}),
  };
}

/** Server-rendered <script>. Never injected client-side. */
export function JsonLdScript({ data }: { data: JsonLd }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
