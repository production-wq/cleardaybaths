/**
 * Geo-page copy generator.
 *
 * The risk with 178 location pages is that they read like one page with the
 * city name swapped — which is what Google calls a doorway page. Three things
 * prevent that here:
 *
 *   1. Every city carries real, hand-researched facts in data/cities.json
 *      (county, neighbouring towns, and a `note` about the actual housing
 *      stock). Those drive the paragraphs rather than decorating them.
 *   2. Sentence frames are chosen by a hash of the city slug, so two adjacent
 *      cities do not land on the same opener.
 *   3. Service pages in the same city each take a different angle on that
 *      city's housing stock.
 *
 * scripts/audit-content.ts fails the build if any two pages still read alike.
 */
import type { City, ServiceSlug } from './routes';
import { business } from './business';

/** Stable per-city index so wording is varied but identical across builds. */
function pick<T>(arr: T[], seed: string, offset = 0): T {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return arr[(h + offset) % arr.length];
}

const SERVICE_LABEL: Record<ServiceSlug, string> = {
  'accessible-bathroom': 'accessible bathroom remodeling',
  'shower-remodel': 'shower remodeling',
  'tub-to-shower-conversions': 'tub-to-shower conversions',
  'walk-in-bathtubs': 'walk-in bathtubs',
};

const SERVICE_H1: Record<ServiceSlug, string> = {
  'accessible-bathroom': 'Accessible Bathroom Remodeling',
  'shower-remodel': 'Shower Remodeling',
  'tub-to-shower-conversions': 'Tub to Shower Conversions',
  'walk-in-bathtubs': 'Walk-In Bathtubs',
};

/** How each service reads against a city's housing stock. */
const SERVICE_ANGLE: Record<ServiceSlug, (c: City) => string> = {
  'accessible-bathroom': (c) =>
    `Most accessibility work we do in ${c.name} is for people who intend to stay in the house they are in. That changes the brief: the bathroom has to be safe without looking like a hospital, and it has to be built so a grab bar can be added later without opening a wall. ${c.note}`,
  'shower-remodel': (c) =>
    `Shower failures in ${c.name} follow the age of the housing. ${c.note} Where a surround was tiled straight onto board with no membrane behind it — standard practice for decades — the grout is the symptom and the substrate is the problem.`,
  'tub-to-shower-conversions': (c) =>
    `Conversions are the job we are asked about most in ${c.name}, usually for a hall bath with a tub nobody has used in years. ${c.note} Because the drain normally stays where it is, most of these are a one or two day job.`,
  'walk-in-bathtubs': (c) =>
    `Walk-in tubs suit ${c.name} households who want to keep bathing rather than switch to showering. ${c.note} Two practical checks come first: whether the floor structure takes the filled weight, and whether the water heater can fill a deeper tub.`,
};

const OPENERS = [
  (c: City, s: string) => `Clear Day Bath Solutions provides ${s} throughout ${c.name}, ${c.state} and the surrounding ${c.county} area.`,
  (c: City, s: string) => `We handle ${s} across ${c.name} and the rest of ${c.county}, working out of our base in ${business.address.addressLocality}, ${business.address.addressRegion}.`,
  (c: City, s: string) => `If you are looking at ${s} in ${c.name}, ${c.state}, we work in ${c.county} every week and can usually see the job quickly.`,
  (c: City, s: string) => `${c.name} homeowners come to us for ${s} — we cover the whole of ${c.county} and the neighbouring communities.`,
];

const LOCAL_FRAMES = [
  (c: City) => `Working in one area consistently means we know what we will find behind the wall. ${c.note}`,
  (c: City) => `${c.note} That shapes what we recommend here, and it is why a quote from a national price book so often misses.`,
  (c: City) => `We measure before quoting for a reason. ${c.note}`,
];

export interface CityCopy {
  h1: string;
  title: string;
  description: string;
  lead: string;
  intro: string[];
  sections: { h: string; p: string[] }[];
  faqs: { q: string; a: string }[];
}

const nearbyLine = (c: City) =>
  c.nearby.length
    ? `We also cover ${c.nearby.slice(0, -1).join(', ')}${c.nearby.length > 1 ? ' and ' : ''}${c.nearby[c.nearby.length - 1]}, so if you are just outside ${c.name} it is worth asking.`
    : `If you are just outside ${c.name}, it is still worth asking — our radius is wider than the city limits.`;

/** City hub page: all services, framed by that city. */
export function cityHubCopy(c: City): CityCopy {
  const label = 'bathroom remodeling';
  return {
    h1: `Bathroom Remodeling in ${c.name}, ${c.state}`,
    title: `Bathroom Remodeling in ${c.name}, ${c.state}`,
    description: `Bathroom remodeling, tub-to-shower conversions, walk-in bathtubs and accessible bathrooms in ${c.name}, ${c.state}. Locally owned, free in-home estimates. Call ${business.phone.display}.`,
    lead: `Tub-to-shower conversions, walk-in bathtubs, accessible bathrooms and full remodels for ${c.name} homeowners.`,
    intro: [
      pick(OPENERS, c.slug)(c, label),
      `${pick(LOCAL_FRAMES, c.slug, 1)(c)} ${nearbyLine(c)}`,
    ],
    sections: [
      {
        h: `What we do in ${c.name}`,
        p: [
          `Our work in ${c.name} splits roughly three ways: conversions that swap an unused tub for a walkable shower, replacements where a surround or pan has failed, and accessibility work for people planning to stay in their homes. All three are contained to the wet area, so the rest of the bathroom generally stays untouched.`,
          `Every job starts with an in-home measure. We look at the opening, the drain position and what the walls are likely to be hiding, and you get a written price from that rather than from a catalogue.`,
        ],
      },
      {
        h: `Permits and local practice in ${c.county}`,
        p: [
          `A like-for-like fixture swap frequently does not need a permit, while moving plumbing or altering framing usually does. ${c.county} has its own way of handling this, and we will tell you which side of the line your project falls on before you commit to anything.`,
          `We are not going to pretend that is the same in every jurisdiction we serve, because it is not.`,
        ],
      },
    ],
    faqs: [
      {
        q: `Do you charge for an estimate in ${c.name}?`,
        a: `No. The in-home measure and the written price are free, and there is no obligation to book. We would rather spend an hour finding out your bathroom is not the job you thought it was than sell you the wrong scope.`,
      },
      {
        q: `How quickly can you start a project in ${c.name}, ${c.state}?`,
        a: `It depends on scope and on what is in the schedule, but ${c.name} is inside our regular working area rather than an occasional trip, so we can normally get out to measure quickly. Call ${business.phone.display} and we will give you a real date rather than a placeholder.`,
      },
    ],
  };
}

/** City + service page. */
export function cityServiceCopy(c: City, service: ServiceSlug): CityCopy {
  const label = SERVICE_LABEL[service];
  const h1 = `${SERVICE_H1[service]} in ${c.name}, ${c.state}`;
  return {
    h1,
    title: h1,
    description: `${SERVICE_H1[service]} in ${c.name}, ${c.state}. Free in-home measure and written pricing from a locally owned team. Call ${business.phone.display}.`,
    lead: `${SERVICE_H1[service]} for homes across ${c.name} and ${c.county}.`,
    intro: [
      pick(OPENERS, c.slug + service)(c, label),
      nearbyLine(c),
    ],
    sections: [
      { h: `${SERVICE_H1[service]} and ${c.name} homes`, p: [SERVICE_ANGLE[service](c)] },
      {
        h: 'How the job runs',
        p: [
          `We measure the opening in person before quoting, because the difference between a unit that fits and one that is shimmed into place is the difference between a bathroom that lasts and one that leaks. You get a written price from that visit.`,
          `On the day, the old wet area comes out, we show you the condition of the substrate before anything is covered up, and the new installation goes in over proper waterproofing. We clear the debris and leave the room usable.`,
        ],
      },
    ],
    faqs: [
      {
        q: `How much does ${label} cost in ${c.name}?`,
        a: `We do not publish a price, because the honest answer depends on your opening, what is behind the wall and what you choose to put in. What we can promise is a written, itemised figure after an in-home measure — not a range designed to get us in the door and revised upward later.`,
      },
      {
        q: `Do you serve all of ${c.county}?`,
        a: `Yes, along with the neighbouring communities. ${nearbyLine(c)} If you are unsure, call ${business.phone.display} and we will tell you straight away rather than booking a visit we cannot honour.`,
      },
    ],
  };
}

/**
 * Legacy flat URLs (/frederick-shower-remodel/) carry a service in the slug but
 * keep their historic address. Content matches the nested equivalent so the
 * page is no thinner for having an older URL shape.
 */
export function flatPageCopy(c: City, service: ServiceSlug | null): CityCopy {
  return service ? cityServiceCopy(c, service) : cityHubCopy(c);
}

export { SERVICE_H1, SERVICE_LABEL };
