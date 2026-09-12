/**
 * Navigation trees. Mirrors the live site's header/footer so returning visitors
 * and existing internal links find the same structure.
 */
import { serviceHubs } from './services';

export interface NavLink { label: string; href: string }
export interface NavGroup extends NavLink { children?: NavLink[] }

/** Labels the live site uses differ from page titles in a few places. */
const LABEL_OVERRIDES: Record<string, string> = {
  '/bathrooms/installation/': 'Bath Installation',
  '/bathrooms/accessible-bathroom/': 'Accessible Bathrooms',
  '/bath-conversions/tub-to-shower-conversions/': 'Tub to Shower Conversions',
  '/bath-conversions/walk-in-shower/': 'Walk-In Showers',
};

const label = (path: string, fallback: string) => LABEL_OVERRIDES[path] ?? fallback;

export const primaryNav: NavGroup[] = [
  ...serviceHubs.map((h) => ({
    label: h.title,
    href: h.path,
    children: [
      { label: `All ${h.title}`, href: h.path },
      ...h.children.map((c) => ({ label: label(c.path, c.title), href: c.path })),
    ],
  })),
  { label: 'Financing', href: '/financing/' },
  {
    label: 'About Us',
    href: '/about-us/',
    children: [
      { label: 'About Clear Day', href: '/about-us/' },
      { label: 'Reviews', href: '/reviews/' },
      { label: 'Gallery', href: '/gallery/' },
      { label: 'Service Areas', href: '/service-areas/' },
      { label: 'Pricing', href: '/pricing/' },
      { label: 'Offers', href: '/offers/' },
      { label: 'Warranty', href: '/warranty/' },
      { label: 'Careers', href: '/careers/' },
    ],
  },
];

export const utilityNav: NavLink[] = [
  { label: 'Contact Us', href: '/contact-us/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'Gallery', href: '/gallery/' },
];

export const footerNav: NavGroup[] = [
  {
    label: 'Bathrooms', href: '/bathrooms/',
    children: serviceHubs[0].children.map((c) => ({ label: label(c.path, c.title), href: c.path })),
  },
  {
    label: 'Showers', href: '/showers/',
    children: serviceHubs[1].children.map((c) => ({ label: label(c.path, c.title), href: c.path })),
  },
  {
    label: 'Bath Conversions', href: '/bath-conversions/',
    children: serviceHubs[2].children.map((c) => ({ label: label(c.path, c.title), href: c.path })),
  },
  {
    label: 'Company', href: '/about-us/',
    children: [
      { label: 'About', href: '/about-us/' },
      { label: 'Reviews', href: '/reviews/' },
      { label: 'Gallery', href: '/gallery/' },
      { label: 'Financing', href: '/financing/' },
      { label: 'Service Areas', href: '/service-areas/' },
      { label: 'Careers', href: '/careers/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'Contact', href: '/contact-us/' },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms and Conditions', href: '/terms-and-conditions/' },
  { label: 'Sitemap', href: '/sitemap/' },
];
