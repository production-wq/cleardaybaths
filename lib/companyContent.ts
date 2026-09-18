/**
 * Copy for the standing company pages.
 *
 * Written from what the business has actually published. Where a fact is not
 * verifiable — warranty length, financing APR, years in business, crew size —
 * the page says how to find out rather than inventing a number.
 */
export interface CompanyPage {
  h1: string; eyebrow: string; title: string; description: string; lead: string;
  intro: string[];
  sections: { h: string; p: string[] }[];
  faqs?: { q: string; a: string }[];
  heroImage?: string;
  ctaButton?: { label: string; href: string };
}

export const companyPages: Record<string, CompanyPage> = {
  'about-us': {
    h1: 'About Clear Day Bath Solutions',
    eyebrow: 'Who we are',
    title: 'About Clear Day Bath Solutions',
    description: 'Locally owned bathroom remodelers serving Northern Virginia, Maryland and the DC metro from Woodbridge, VA.',
    lead: 'Locally owned, working in the counties we live in, and accountable for every job we quote.',
    heroImage: '/img/gallery/about-us1.webp',
    intro: [
      'Clear Day Bath Solutions is a bathroom remodeling company based in Woodbridge, Virginia, working across Northern Virginia, Maryland and the greater DC metro.',
      'We are not a franchise. There is no call centre between you and the person who quotes your bathroom, and no commissioned closer working from a national price book. That structure is the whole reason we can tell you when a smaller job will get you what you want.',
    ],
    sections: [
      { h: 'How we quote', p: [
        'Every estimate starts with an in-home measure. We look at the opening, the drain position, the condition of what surrounds it, and what the wall is likely to be hiding. You get a written, itemised price from that visit — not a range designed to get us in the door and revised upward once the tile is off.',
        'If we find something behind the wall that changes the job, we show you before we cover it up. That is the moment when trust in a contractor is either earned or lost.',
      ] },
      { h: 'What we specialise in', p: [
        'Wet-area work: tub-to-shower conversions, shower and surround replacement, walk-in and therapeutic tubs, and accessible bathrooms for people who intend to stay in their homes.',
        'That focus is deliberate. The wet area is where the money, the risk and the craft all sit, and it is the part of a bathroom that fails invisibly when it is done badly.',
      ] },
      { h: 'Where we work', p: [
        'Prince William, Fairfax, Stafford, Fauquier, Loudoun and King George counties in Virginia. Frederick, Washington, Howard, Anne Arundel, Montgomery, Prince George’s and Charles counties in Maryland. Plus the District.',
        'Working the same area consistently means we know which jurisdictions pull a permit for a like-for-like swap and which do not, and what we are likely to find behind the wall in a given decade of housing.',
      ] },
    ],
  },

  careers: {
    h1: 'Careers at Clear Day',
    eyebrow: 'Join us',
    title: 'Careers',
    description: 'Installer and estimator roles with a locally owned bathroom remodeling company serving Northern Virginia and Maryland.',
    lead: 'We hire people who would rather do the job properly than quickly.',
    intro: [
      'We are a small, locally owned company and we hire accordingly. If you take the view that waterproofing is the job and tile is the decoration, we would like to hear from you.',
      'Roles come up for installers, lead carpenters and in-home estimators across our Virginia and Maryland service area.',
    ],
    sections: [
      { h: 'What we look for', p: [
        'Craft, obviously. But mostly the habit of doing the hidden parts right when nobody would know the difference — bedding a pan fully, blocking a wall for a grab bar that has not been ordered yet, photographing a membrane before covering it.',
        'Customer-facing roles need people who can tell a homeowner the honest answer, including when the honest answer is a smaller job than they came for.',
      ] },
      { h: 'How to apply', p: [
        'Send us a note about what you have worked on and where you are based. We read everything that comes in, and we will tell you either way.',
      ] },
    ],
  },

  financing: {
    h1: 'Financing Your Bathroom Remodel',
    eyebrow: 'Payment options',
    title: 'Financing',
    description: 'Financing options for bathroom remodels, tub-to-shower conversions and walk-in tubs across Northern Virginia and Maryland.',
    lead: 'Options to spread the cost, explained honestly before you commit to anything.',
    intro: [
      'A bathroom remodel is a significant purchase, and for most households it is not one that comes out of current income. Financing exists to spread that, and it is worth understanding before you choose a scope.',
      'We will walk you through what is available for your project at the estimate, including the parts people usually only discover later.',
    ],
    sections: [
      { h: 'What to ask about any offer', p: [
        'The three questions that matter are the interest rate, the term, and what happens at the end of any promotional period. A deferred-interest offer that becomes retroactive if not cleared in time is a very different product from a fixed-rate loan, and the monthly figure alone will not tell you which you have.',
        'We are a bathroom contractor, not a lender or a financial adviser. We can tell you what a project costs and what options are on the table; the decision about borrowing is yours, and it is worth a conversation with someone independent if you are unsure.',
      ] },
      { h: 'Scope is a lever too', p: [
        'Before financing a larger job, it is worth asking whether a smaller one solves the actual problem. A conversion and a new surround often deliver most of what someone wanted from a full renovation, at a fraction of the figure. We will tell you when that applies.',
      ] },
    ],
    faqs: [
      { q: 'What financing terms do you offer?', a: 'Terms depend on the provider, the amount and your circumstances, so we do not publish a rate that would be wrong for most people who read it. Your estimator will go through the current options and the actual numbers for your project at the in-home visit.' },
    ],
    ctaButton: { label: 'Apply for Financing', href: 'https://offers.purefinancegroup.com/cleardayas' },
  },

  pricing: {
    h1: 'Bathroom Remodeling Pricing',
    eyebrow: 'What it costs',
    title: 'Pricing',
    description: 'How bathroom remodeling and tub-to-shower conversion pricing works, and what actually drives the cost.',
    lead: 'What drives the number, and why we quote after measuring rather than before.',
    intro: [
      'We do not publish a price list, and we would rather explain why than pretend it is a secret.',
      'Two bathrooms that look identical can differ by thousands once the tile is off. The size of the opening, the state of the substrate, whether the drain has to move, and what is behind the wall all move the figure — and none of them can be assessed over the phone.',
    ],
    sections: [
      { h: 'What actually drives the cost', p: [
        'Scope first: a same-footprint conversion is a fundamentally different job from a room taken back to the studs. Then the condition of what we find, which is the single biggest source of variance. Then materials, which people assume dominates and usually does not.',
        'Moving plumbing is the most expensive individual decision available in a bathroom. If the budget is tight, that is the first thing to leave alone.',
      ] },
      { h: 'What you get from us', p: [
        'A free in-home measure and a written, itemised price. Not a range, not a figure that moves once work starts, and no obligation to book.',
        'If we find something during the work that genuinely changes the scope, you see it and approve it before we proceed.',
      ] },
    ],
    faqs: [
      { q: 'Can you give me a ballpark over the phone?', a: 'We can tell you what generally drives the cost, and we are happy to talk it through. What we will not do is give you a number before seeing the bathroom, because that number would be a guess — and guesses in this trade always get revised in one direction.' },
    ],
  },

  warranty: {
    h1: 'Our Warranty',
    eyebrow: 'After the job',
    title: 'Warranty',
    description: 'How warranty coverage works on Clear Day Bath Solutions installations across Northern Virginia and Maryland.',
    lead: 'Who to call when something is not right, and how coverage works.',
    intro: [
      'Two different things are usually called "the warranty": the manufacturer’s cover on the product, and the installer’s cover on the workmanship. They are separate, they run for different periods, and knowing which applies saves a lot of time when something goes wrong.',
      'Your specific terms are confirmed in writing with your estimate rather than stated generally here, because they depend on the products used on your job.',
    ],
    sections: [
      { h: 'Product versus workmanship', p: [
        'A manufacturer covers defects in the product itself — a base that cracks, a finish that fails. Workmanship cover is about how it was installed: seals, bedding, waterproofing, alignment.',
        'Most real problems are workmanship problems, which is why the installer’s cover is the one worth reading carefully on any quote you receive, from us or from anyone else.',
      ] },
      { h: 'If something is wrong', p: [
        'Call us. We would much rather look at a small problem early than a large one later, and the fact that we are local rather than a franchise means there is somebody to call.',
      ] },
    ],
  },

  offers: {
    h1: 'Current Offers',
    eyebrow: 'Save on your project',
    title: 'Offers & Promotions',
    description: 'Current promotions on bathroom remodeling, tub-to-shower conversions and walk-in tubs in Northern Virginia and Maryland.',
    lead: 'What is currently available, and how to find out if it applies to your project.',
    intro: [
      'Promotions change through the year and depend on scope, product and season. Rather than publishing an offer here that may have ended by the time you read it, we confirm what is live when you book your estimate.',
      'Call us or send the quote form and we will tell you what currently applies to the job you are describing.',
    ],
    sections: [
      { h: 'A word on remodeling promotions generally', p: [
        'A discount is only meaningful against an honest starting price. A large percentage off an inflated figure is not a saving, and that pattern is common in this trade.',
        'We would rather quote a real number in the first place. If there is a promotion that genuinely applies to your project, you will see it as a line on the estimate.',
      ] },
    ],
  },
};

export const companySlugs = Object.keys(companyPages);
