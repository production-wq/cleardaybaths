/**
 * Hand-authored copy for every service page.
 *
 * Grounded in what this company verifiably does (from the WordPress export and
 * live site) plus general trade knowledge. Nothing here claims a warranty term,
 * a price, a certification or a completion time the business has not published.
 */
export interface ServiceCopy {
  /** <h1> and metadata title stem. */
  h1: string;
  /** ~25-word summary used for meta description and hero lead. */
  summary: string;
  /** Opening two paragraphs. */
  intro: string[];
  /** Body sections, each a heading plus paragraphs. */
  sections: { h: string; p: string[] }[];
  /** Bulleted highlights with a bold lead-in, as in the service design. */
  highlights: { title: string; body: string }[];
  /** Page-specific FAQs, appended to the shared set. */
  faqs: { q: string; a: string }[];
  /** Gallery category to pull imagery from. */
  imageCategory: 'bathrooms' | 'showers' | 'bath-and-shower' | 'tubs';
}

const S = (o: ServiceCopy) => o;

export const serviceCopy: Record<string, ServiceCopy> = {
  /* ---------------------------------------------------------- hubs ---- */
  bathrooms: S({
    h1: 'Bathroom Remodeling',
    summary: 'Full bathroom renovations across Northern Virginia and Maryland — accessible layouts, replacement tubs, surrounds and one-day baths.',
    intro: [
      'A bathroom is the smallest room in the house and the one that punishes bad decisions hardest. Every surface is wet, every fixture is plumbed, and the space you have is the space you have. That is why we measure before we quote rather than pricing from a catalogue.',
      'We work across Northern Virginia and Maryland on everything from a single tub swap to a room taken back to the studs, and we will tell you when the smaller scope gets you what you actually want.',
    ],
    sections: [
      { h: 'What a full bathroom remodel involves', p: [
        'The wet area comes out first — tub or shower base, surround walls, valve and trim. That is where most of the cost and all of the risk sits, because it is the only part of the room that fails invisibly. Once the walls are open we can see the condition of the studs, the blocking and the drain, and we tell you what we find before we close it up.',
        'From there the work is predictable: waterproofing, new base and surround, fixtures, then the dry side — vanity, flooring, lighting and paint. Most of our customers keep the room usable throughout, which matters a great deal in a single-bathroom house.',
      ] },
      { h: 'Designing around how you actually use the room', p: [
        'A hall bath used by three people before 8am wants different things from a primary suite. Storage where you reach for it, a niche instead of a shelf that collects water, a door that does not swing into the vanity. These are small decisions that decide whether you like the room in five years.',
        'We also plan for the house you will live in later. Blocking behind the tile costs almost nothing during a remodel and means a grab bar can be added any time without opening a wall again.',
      ] },
    ],
    highlights: [
      { title: 'Measured, not estimated', body: 'We take the real dimensions of your opening before quoting, so the base and surround fit rather than being shimmed into place.' },
      { title: 'One trade, one point of contact', body: 'The person who quotes the job is accountable for it, and you can reach us after the work is done.' },
      { title: 'Built for later', body: 'Blocking behind the walls means grab bars and seats can be added years from now without a second demolition.' },
    ],
    faqs: [
      { q: 'How long does a full bathroom remodel take?', a: 'It depends entirely on scope. A tub-to-shower conversion with a stock-size opening is often a one or two day job. A room taken back to the studs with new flooring, vanity and lighting runs longer. We give you a real window at quote time rather than a vague estimate, and we tell you which days the room will be out of use.' },
      { q: 'Do I need a permit for a bathroom remodel?', a: 'It varies by jurisdiction and by scope. A like-for-like fixture swap frequently does not require one, while moving plumbing or altering framing usually does. We work in these counties every week, so we can tell you which side of the line your project falls on before you commit.' },
    ],
    imageCategory: 'bathrooms',
  }),

  showers: S({
    h1: 'Shower Remodeling & Installation',
    summary: 'Acrylic and tiled showers, enclosures, surrounds and replacements, sized to your opening rather than forced from a stock kit.',
    intro: [
      'Most shower problems are not cosmetic. Grout that will not come clean, a pan that holds water, a door that leaks at the jamb — these are symptoms of how the shower was built, not how it has been maintained.',
      'We replace showers across Northern Virginia and Maryland, and we size the base and surround to your actual opening. A unit that almost fits is the reason the last one failed.',
    ],
    sections: [
      { h: 'Acrylic or tile?', p: [
        'Acrylic is a single moulded surface with no grout lines, which is why it cleans in minutes and stays looking new. It is the right answer for most hall baths and for anyone who does not want a weekend job keeping grout white.',
        'Tile earns its place when the space is irregular, when you want a curbless entry, or when the look matters more than the maintenance. We are happy to do either and we will tell you honestly which one suits your room and your patience.',
      ] },
      { h: 'The part nobody sees', p: [
        'Waterproofing behind the surround decides whether the shower lasts five years or twenty-five. It is also the part that is impossible to inspect once the job is done, which is exactly why it gets skipped by the cheapest bidders.',
        'We photograph the substrate before closing it up, so you can see what you paid for.',
      ] },
    ],
    highlights: [
      { title: 'Custom acrylic showers', body: 'Moulded surfaces with no grout lines, cut to your opening. Easy to clean and hard to damage.' },
      { title: 'Frameless and framed enclosures', body: 'Glass specified for the opening, with hardware that stays aligned instead of drifting out of square.' },
      { title: 'Low and zero threshold entries', body: 'Remove the step without rebuilding the room, where the floor structure allows it.' },
    ],
    faqs: [
      { q: 'Can you replace a shower without retiling the whole bathroom?', a: 'Yes, and most of our shower work is exactly that. The wet area is self-contained, so a surround and base can be replaced while the floor tile and vanity stay put. We protect the surfaces that are staying and match the transition at the threshold.' },
      { q: 'Why does my grout keep going black no matter what I clean it with?', a: 'Usually because water is getting behind it. Grout is not waterproof — the membrane behind the tile is, and when that fails the grout stays permanently damp and grows mould from the back. Cleaning treats the symptom. Replacing the surround treats the cause.' },
    ],
    imageCategory: 'showers',
  }),

  'bath-conversions': S({
    h1: 'Bath & Shower Conversions',
    summary: 'Tub-to-shower and shower-to-tub conversions, walk-in bathtubs and therapeutic tubs — usually without moving plumbing.',
    intro: [
      'A conversion changes what the wet area does without rebuilding the room around it. Most are finished in a day or two because the drain and supply stay where they are.',
      'The most common request we get is removing a tub nobody uses. The second most common is adding a tub somebody needs.',
    ],
    sections: [
      { h: 'Tub out, shower in', p: [
        'Stepping over a 15-inch tub wall onto a wet surface is the single most common way people are injured in a bathroom. Replacing that tub with a low-threshold shower removes the obstacle entirely, and the footprint usually stays identical so the drain does not move.',
        'It is also the conversion that most changes how a house feels to live in, particularly for anyone with a knee, a hip or a balance problem.',
      ] },
      { h: 'When a tub is the right answer', p: [
        'Not every conversion runs in that direction. Households with small children, and homes where the only tub has already been removed, often want one back — a resale consideration as much as a practical one.',
        'Walk-in and therapeutic tubs sit between the two: a tub you can use safely, with a door instead of a wall to climb over.',
      ] },
    ],
    highlights: [
      { title: 'Plumbing usually stays put', body: 'Matching the existing drain location is what keeps a conversion to a day or two instead of a week.' },
      { title: 'Safety built in, not added on', body: 'Grab bars anchored into real blocking, slip-resistant floors and seating specified at the same time as the base.' },
      { title: 'Same-footprint swaps', body: 'Most conversions fit the existing alcove, so the surrounding tile, vanity and flooring stay untouched.' },
    ],
    faqs: [
      { q: 'Will removing my only bathtub hurt resale value?', a: 'It can, if it leaves the house with no tub at all — buyers with young children do filter on that. If you have a second bathroom with a tub, converting the other one is generally a gain rather than a loss. We will give you a straight answer for your specific house rather than pushing the bigger job.' },
      { q: 'Does a tub-to-shower conversion need new plumbing?', a: 'Usually not. Tub and shower drains sit in the same place in a standard alcove, so the existing rough-in is normally reused. Moving the drain is only necessary if you are changing the footprint or the layout, and we can tell you which applies after a measure.' },
    ],
    imageCategory: 'bath-and-shower',
  }),

  /* ----------------------------------------------------- bathrooms ---- */
  'accessible-bathroom': S({
    h1: 'Accessible & ADA Bathroom Remodeling',
    summary: 'Barrier-free showers, grab bars anchored into real blocking, comfort-height fixtures and layouts that work with a walker or chair.',
    intro: [
      'Accessible does not have to mean institutional. Most of what makes a bathroom safe — a level entry, something solid to hold, a floor that grips when wet — looks like ordinary good design once it is installed.',
      'We build these bathrooms across Northern Virginia and Maryland for people planning to stay in their homes, and for families adapting a house after a change in circumstances.',
    ],
    sections: [
      { h: 'Getting in and out', p: [
        'The threshold is the whole problem. A zero or low-threshold shower removes the step, and where the floor structure allows it we can recess the pan so there is no lip at all. Where it does not, a half-inch bevelled threshold is still a dramatic improvement on a tub wall.',
        'Door width and swing matter just as much. A 24-inch door that opens inward makes a compliant shower unusable with a walker.',
      ] },
      { h: 'Grab bars that actually hold', p: [
        'A grab bar screwed into tile and drywall will come out of the wall under load, and it will do it at the worst possible moment. Real blocking behind the surround is the difference between a safety feature and a hazard.',
        'We install blocking during the remodel whether or not bars are going in on day one, because adding it later means opening the wall again.',
      ] },
      { h: 'Fixtures and controls', p: [
        'Comfort-height toilets, lever handles instead of knobs, and a valve positioned so it can be reached from outside the spray before stepping in. Hand-held shower heads on a slide bar serve seated and standing use from the same fitting.',
      ] },
    ],
    highlights: [
      { title: 'Zero and low-threshold entries', body: 'Remove the step-over entirely where the floor structure allows, or bevel it down where it does not.' },
      { title: 'Blocking behind every bar', body: 'Bars anchored into framing, not into tile — specified at the same time as the surround.' },
      { title: 'Seating and reachable controls', body: 'Fold-down or built-in seats with the valve placed so it can be reached before you step into the water.' },
    ],
    faqs: [
      { q: 'Does an accessible bathroom have to meet full ADA specification?', a: 'Only if it is a public or commercial facility. Private homes are not bound by the ADA, so we build to what works for the person using the room — which is often more useful than the letter of the standard. Where you want true ADA dimensions, we will tell you honestly whether your footprint can take them.' },
      { q: 'Can you make my existing bathroom accessible without gutting it?', a: 'Frequently, yes. Converting the tub to a low-threshold shower, adding properly blocked grab bars and changing the fixtures addresses most of the risk without touching the layout. A full rebuild only becomes necessary when the door width or the turning space is the limiting factor.' },
    ],
    imageCategory: 'bathrooms',
  }),

  'bath-surrounds': S({
    h1: 'Bath Surrounds',
    summary: 'Seamless acrylic and tiled bath surrounds that replace failing tile and stop water getting behind the wall.',
    intro: [
      'The surround is the wall the water hits. When it fails, it fails behind the surface, and by the time you can see the problem the substrate has usually been wet for a long time.',
      'We replace surrounds as a standalone job across Northern Virginia and Maryland, often in a day, without disturbing the rest of the bathroom.',
    ],
    sections: [
      { h: 'Why tile surrounds fail', p: [
        'Grout is porous and the membrane behind it is what actually keeps water out. Older bathrooms frequently have no membrane at all — just tile on drywall, which works right up until it does not.',
        'Once water reaches the substrate the tile starts sounding hollow, the grout stays dark, and the studs behind begin to go. Regrouting at that stage seals the damage in rather than fixing it.',
      ] },
      { h: 'Seamless panels', p: [
        'Acrylic surround panels have no joints for water to travel through and nothing to scrub. They go over a properly prepared substrate and are cut to the opening rather than pieced together.',
      ] },
    ],
    highlights: [
      { title: 'No grout lines', body: 'Seamless panels remove the maintenance problem entirely rather than postponing it.' },
      { title: 'Substrate inspected first', body: 'We look at what is behind the old surround before installing over it, and show you what we find.' },
      { title: 'Often a single day', body: 'A standalone surround replacement rarely disturbs the flooring, vanity or fixtures.' },
    ],
    faqs: [
      { q: 'Can you install a new surround over my existing tile?', a: 'Sometimes, but we will not do it blind. If the tile is sound and flat, an overlay can be appropriate. If there is any sign that water has been getting behind it, covering the problem is the worst option available — we take it out and deal with the substrate.' },
    ],
    imageCategory: 'bathrooms',
  }),

  'bathroom-renovations': S({
    h1: 'Bathroom Renovations',
    summary: 'Complete bathroom renovations — layout, wet area, fixtures, flooring and lighting — across Northern Virginia and Maryland.',
    intro: [
      'A renovation is the job where everything is on the table: layout, plumbing, storage, light. It is also the job where the decisions made in the first week decide how the room feels for the next twenty years.',
      'We take bathrooms back to the studs when that is genuinely what the room needs, and we say so when it is not.',
    ],
    sections: [
      { h: 'Sequence and disruption', p: [
        'Demolition, rough-in, inspection where required, waterproofing, surfaces, then fixtures and finishes. The order is not negotiable and skipping steps is how jobs go wrong.',
        'What is negotiable is how long you are without the room. In a one-bathroom house we plan the sequence around keeping the toilet usable as long as possible, and we tell you up front which days it will not be.',
      ] },
      { h: 'Where the money goes', p: [
        'The wet area and anything that moves plumbing are the expensive parts. Vanities, mirrors, lighting and paint are comparatively cheap and easy to change later.',
        'If the budget is tight, spend it behind the walls. That is the part you cannot redo without starting again.',
      ] },
    ],
    highlights: [
      { title: 'Layout before finishes', body: 'We settle how the room works before choosing what it looks like — the reverse order is how bathrooms end up awkward.' },
      { title: 'Honest scope', body: 'If a conversion and new surfaces get you what you want, we will tell you that instead of selling a full renovation.' },
      { title: 'One accountable contact', body: 'No call centre and no commissioned closer working from a price book.' },
    ],
    faqs: [
      { q: 'Should I move the toilet or the shower to improve the layout?', a: 'Only if the current layout genuinely does not work, because moving a drain is the single most expensive change you can make in a bathroom. Often the same problem can be solved by changing the door swing, the vanity size or the shower entry. We will price both so you can see what the move actually costs.' },
    ],
    imageCategory: 'bathrooms',
  }),

  installation: S({
    h1: 'Bath Installation',
    summary: 'Professional installation of bathtubs, showers, surrounds and enclosures, with the waterproofing done properly behind them.',
    intro: [
      'Installation is where a good product becomes a good bathroom or an expensive problem. The unit matters far less than what is behind it and how it was set.',
      'We install across Northern Virginia and Maryland, including work on units supplied by others where the substrate is sound.',
    ],
    sections: [
      { h: 'Setting the base', p: [
        'A tub or shower base that is not fully supported will flex, and a base that flexes will eventually break its seal at the drain. Setting the pan in a proper mortar bed, level and fully bedded, is unglamorous and it is the part that decides longevity.',
      ] },
      { h: 'Waterproofing and inspection', p: [
        'We photograph the substrate and the membrane before the surround goes on. It is the only chance anyone gets to see that part of the job, and you should not have to take it on trust.',
      ] },
    ],
    highlights: [
      { title: 'Fully bedded bases', body: 'Set level in mortar and fully supported, so the pan cannot flex and break its drain seal.' },
      { title: 'Documented waterproofing', body: 'Photographed before it is covered, because afterwards nobody can verify it.' },
      { title: 'Clean handover', body: 'Debris removed, surfaces cleaned, and the room left usable when we leave.' },
    ],
    faqs: [
      { q: 'Will you install a tub or shower I bought myself?', a: 'In most cases yes, provided it is a complete unit and the substrate behind it is sound. We will look at what you have before committing, because installing a new unit over a failing wall is not something we are willing to put our name to.' },
    ],
    imageCategory: 'bathrooms',
  }),

  'one-day-bath': S({
    h1: 'One-Day Bath Remodel',
    summary: 'Same-footprint tub and shower replacements completed in a single day, without moving plumbing or retiling the room.',
    intro: [
      'A one-day bath is a same-footprint replacement: the old wet area comes out, a new base and surround go in, and the plumbing stays where it is. That constraint is exactly what makes the timeline possible.',
      'It suits households that cannot lose a bathroom for a week — which, in a single-bathroom house, is most of them.',
    ],
    sections: [
      { h: 'What makes a single day realistic', p: [
        'Matching the existing drain and supply locations removes the rough-in, the inspection wait and the drying time. What is left is demolition, substrate preparation, the new unit and the trim.',
        'We are straight about when a project does not qualify. If the studs behind the surround have gone, or the layout is changing, it is not a one-day job and pretending otherwise helps nobody.',
      ] },
      { h: 'What you get, and what you do not', p: [
        'You get a new wet area, properly waterproofed, finished and usable. You do not get a new layout, relocated plumbing or new flooring — those are renovation scope and they take longer.',
      ] },
    ],
    highlights: [
      { title: 'Same footprint, same drain', body: 'Reusing the existing rough-in is what compresses the timeline, so the tub or shower stays where it is.' },
      { title: 'Usable that evening', body: 'Cure times are planned so the room comes back into service as quickly as the materials allow.' },
      { title: 'We tell you if it does not qualify', body: 'Hidden damage or a layout change means it is not a one-day job, and we say so before booking.' },
    ],
    faqs: [
      { q: 'Is a one-day bath lower quality than a full remodel?', a: 'No — it is narrower in scope, not lower in standard. The waterproofing, the base bedding and the materials are the same. What you are giving up is the ability to change the layout or the plumbing, which is what the extra days in a full remodel actually buy.' },
      { q: 'Can I really use the shower the same evening?', a: 'Usually, though it depends on the products used and the conditions in the room. We tell you the actual cure window before we start rather than promising a number that suits the marketing.' },
    ],
    imageCategory: 'bath-and-shower',
  }),

  'replacement-bathtubs': S({
    h1: 'Replacement Bathtubs',
    summary: 'New bathtubs fitted to the existing alcove — acrylic, soaking and standard sizes — usually without disturbing the surrounding room.',
    intro: [
      'Most tub replacements are alcove swaps: the old tub out, a new one in the same opening, new surround, done. Because the drain does not move, the job stays short and the rest of the bathroom stays intact.',
      'Old cast iron is the main complication, and it is a solvable one.',
    ],
    sections: [
      { h: 'Alcove swaps', p: [
        'Standard alcove tubs are a consistent size, which means a replacement usually drops into the existing opening with the drain in the right place. The surround comes off with the old tub and goes back new.',
      ] },
      { h: 'Removing cast iron', p: [
        'A cast iron tub can weigh 300 pounds or more and will not come out of a second-floor bathroom in one piece. We cut them down in place and carry them out in sections, with the room protected.',
      ] },
    ],
    highlights: [
      { title: 'Drain stays put', body: 'Standard alcove sizing means the existing rough-in is normally reused.' },
      { title: 'Cast iron handled properly', body: 'Cut down and removed in sections, with floors and stairs protected on the way out.' },
      { title: 'Surround replaced together', body: 'Fitting a new tub to an old surround is how leaks start, so the two are replaced as one job.' },
    ],
    faqs: [
      { q: 'Can I keep my existing tile surround and just replace the tub?', a: 'We strongly advise against it. The joint between a new tub and old tile is exactly where water gets in, and the tile almost never survives removal of the old tub cleanly anyway. Replacing both together is what makes the result watertight.' },
    ],
    imageCategory: 'tubs',
  }),

  /* -------------------------------------------------------- showers ---- */
  'acrylic-showers': S({
    h1: 'Acrylic Showers',
    summary: 'Seamless acrylic showers with no grout lines — cut to your opening, easy to clean and hard to stain.',
    intro: [
      'Acrylic is the practical answer for most bathrooms. It is a single moulded surface, so there is no grout to seal, scrub or watch go black.',
      'We cut acrylic surrounds to the actual opening rather than piecing stock panels together, which is what keeps the joints out of the wet zone.',
    ],
    sections: [
      { h: 'Why acrylic outlasts tile in a family bathroom', p: [
        'Tile fails at the grout, and grout fails wherever water sits. In a bathroom used several times a day the surfaces never fully dry, which is precisely the condition grout handles worst.',
        'Acrylic has no such weak point. It wipes down, it does not absorb, and it looks the same in year ten as in year one.',
      ] },
      { h: 'Niches, seats and bars', p: [
        'Built-in niches and seats are moulded rather than framed and tiled, so there are no horizontal grout joints to hold water. Grab bars are specified at the same time, with blocking behind.',
      ] },
    ],
    highlights: [
      { title: 'No grout, anywhere', body: 'A single moulded surface means nothing to seal and nothing to scrub.' },
      { title: 'Cut to your opening', body: 'Sized to the real dimensions rather than shimmed in from a stock kit.' },
      { title: 'Moulded niches and seats', body: 'Built into the surface, so there are no horizontal joints sitting in the spray.' },
    ],
    faqs: [
      { q: 'Does acrylic look cheap compared with tile?', a: 'Modern acrylic is a long way from the yellowing plastic units people remember from the 1980s. Current finishes include convincing stone and subway-tile textures. That said, if the look is your priority rather than the maintenance, tile is still the more expressive material and we will build it.' },
      { q: 'How do I clean an acrylic shower?', a: 'Warm water and a non-abrasive cleaner on a soft cloth. Avoid abrasive pads and anything containing acetone — those are what damage the surface. That is genuinely the whole routine.' },
    ],
    imageCategory: 'showers',
  }),

  'replacement-showers': S({
    h1: 'Replacement Showers',
    summary: 'Direct shower replacements that reuse the existing footprint and drain, with the waterproofing rebuilt from the substrate out.',
    intro: [
      'Replacing a shower is mostly about what you find when the old one comes out. The visible failure is rarely the whole story.',
      'We replace showers across Northern Virginia and Maryland, reusing the existing footprint wherever the structure allows.',
    ],
    sections: [
      { h: 'Assessing what is behind it', p: [
        'A pan that holds water, tile that sounds hollow, or a persistent smell all point at the substrate rather than the surface. Once the old unit is out we can see the studs, the subfloor and the drain connection, and we show you before we rebuild.',
      ] },
      { h: 'Rebuilding properly', p: [
        'New pan set level and fully bedded, membrane applied and inspected, surround fitted and sealed at the joints that matter. Then the glass and the trim.',
      ] },
    ],
    highlights: [
      { title: 'Footprint reused', body: 'Keeping the drain where it is avoids rough-in work and keeps the job short.' },
      { title: 'Substrate shown to you', body: 'Photographed once the old unit is out, so the hidden condition is not a matter of trust.' },
      { title: 'Glass fitted to the finished opening', body: 'Measured after installation rather than ordered in advance, so the door sits square.' },
    ],
    faqs: [
      { q: 'My shower pan holds a puddle. Is that a real problem?', a: 'Yes. Standing water means the pan is not draining to the outlet, usually because it was not set level or the bedding underneath has failed. It will not correct itself, and it keeps the surface permanently wet, which accelerates everything else going wrong.' },
    ],
    imageCategory: 'showers',
  }),

  'shower-enclosures': S({
    h1: 'Shower Enclosures',
    summary: 'Framed, semi-frameless and frameless glass enclosures, measured after installation so the door sits square and stays aligned.',
    intro: [
      'Glass is the part of the shower people touch every day, so hardware quality shows up quickly. A door that drags or drifts out of square was usually ordered before the opening was finished.',
      'We measure enclosures against the installed surround, not the framing, which is why ours close properly a year later.',
    ],
    sections: [
      { h: 'Framed, semi-frameless, frameless', p: [
        'Framed enclosures are the most forgiving of an out-of-square opening and the least expensive. Frameless is the cleanest look and demands the most accurate opening — which is exactly why it should be measured last.',
        'Semi-frameless sits between the two and is often the sensible choice in an older house where nothing is quite plumb.',
      ] },
      { h: 'Coatings and maintenance', p: [
        'A factory-applied protective coating substantially reduces mineral spotting in hard-water areas, which covers much of our Maryland service area. It is not permanent, and we will tell you roughly how long to expect it to perform rather than implying it is forever.',
      ] },
    ],
    highlights: [
      { title: 'Measured after the surround is in', body: 'Ordering glass from framing dimensions is why so many doors never sit right.' },
      { title: 'Hardware that stays aligned', body: 'Adjustable hinges and proper anchoring, so the door closes the same way in year three.' },
      { title: 'Hard-water coatings', body: 'Worth having across much of our Maryland area, with honest expectations about lifespan.' },
    ],
    faqs: [
      { q: 'Is frameless glass less stable than framed?', a: 'No, but it is less tolerant. Frameless relies on the opening being genuinely square and the hardware being anchored into solid material. In a well-prepared opening it is every bit as durable; in a sloppy one it is the option that shows the problem first.' },
    ],
    imageCategory: 'showers',
  }),

  'shower-remodel': S({
    h1: 'Shower Remodel',
    summary: 'Shower remodels that fix the cause rather than the symptom — new substrate, waterproofing, surround, glass and fixtures.',
    intro: [
      'Most people call about a shower remodel because of something cosmetic: grout that will not clean, a door that leaks, a pan that has gone dull. Underneath, it is almost always a waterproofing question.',
      'We remodel showers across Northern Virginia and Maryland, and we start by finding out why the last one failed.',
    ],
    sections: [
      { h: 'Diagnosing before demolishing', p: [
        'Where the water is going tells you what has to change. A leak at the door jamb is a glass and threshold problem. A soft spot in the adjacent room is a pan or membrane problem, and that one is not optional.',
      ] },
      { h: 'Scope that matches the fault', p: [
        'If the substrate is sound, a surround and glass replacement solves it. If it is not, covering it over just buys a couple of years and costs the same money twice.',
      ] },
    ],
    highlights: [
      { title: 'Cause first', body: 'We work out why the last shower failed before specifying the next one.' },
      { title: 'Scope matched to the fault', body: 'No upselling a full rebuild where a surround and glass will genuinely fix it.' },
      { title: 'Documented before closing up', body: 'Substrate and membrane photographed so you can see the part you are paying for.' },
    ],
    faqs: [
      { q: 'How do I know whether I need a new shower or just regrouting?', a: 'Press the tile. If any of it flexes or sounds hollow, water is already behind it and regrouting will seal the damage in rather than stop it. If the tile is solid everywhere and the grout is simply stained, regrouting is a reasonable thing to try first — and we will say so.' },
    ],
    imageCategory: 'showers',
  }),

  'shower-surrounds': S({
    h1: 'Shower Surrounds',
    summary: 'Seamless shower surrounds that replace failing tile and stop water reaching the substrate behind it.',
    intro: [
      'The surround takes the direct spray, so it is the first thing to fail and the thing that does the most damage when it does.',
      'We replace shower surrounds as a standalone job, often without touching the floor, vanity or fixtures.',
    ],
    sections: [
      { h: 'Panels versus tile', p: [
        'A seamless panel surround removes every joint from the wet zone. Tile puts a porous grout line every few inches, in the one part of the house that never fully dries.',
        'Where tile is the right aesthetic choice we build it properly, with a real membrane behind it — which is what most failing tile surrounds never had.',
      ] },
      { h: 'Working around what stays', p: [
        'Because a surround replacement is contained to the wet walls, the rest of the bathroom usually stays exactly as it is. We protect the finishes that are staying and match the transition at the edges.',
      ] },
    ],
    highlights: [
      { title: 'Seamless in the wet zone', body: 'No grout lines where the spray actually lands.' },
      { title: 'Real membrane behind tile', body: 'When tile is the choice, it goes over waterproofing rather than straight onto board.' },
      { title: 'Contained to the wet walls', body: 'Flooring, vanity and fixtures normally stay untouched.' },
    ],
    faqs: [
      { q: 'Can a surround be replaced without replacing the shower pan?', a: 'Often yes, if the pan is sound and draining properly. We check it with the surround off, because a new surround fitted above a failing pan will look finished and keep leaking.' },
    ],
    imageCategory: 'showers',
  }),

  /* ------------------------------------------------ bath conversions ---- */
  'shower-to-tub-conversions': S({
    h1: 'Shower to Tub Conversions',
    summary: 'Adding a bathtub where a shower stands — for young families, and for houses left with no tub at all.',
    intro: [
      'Most conversions go the other way, which is exactly why houses end up with no usable tub. For families with small children, and for anyone thinking about resale, that is a real problem.',
      'A shower-to-tub conversion puts one back, usually in the same alcove and on the same drain.',
    ],
    sections: [
      { h: 'When it makes sense', p: [
        'A house with two bathrooms and no tub at all is harder to sell to buyers with young children. If one of those bathrooms is rarely used, converting it back costs far less than the resale difference.',
        'Bathing small children in a walk-in shower is the other reason people call, and it is a good one.',
      ] },
      { h: 'What the work involves', p: [
        'The shower base comes out, the alcove is prepared, and a tub is set and bedded on the existing drain where the rough-in allows. Surround and valve are replaced at the same time.',
        'The main variable is the drain position — shower drains are centred, tub drains are at one end. We check that before quoting rather than discovering it mid-job.',
      ] },
    ],
    highlights: [
      { title: 'Resale-aware advice', body: 'We will tell you whether your particular house actually benefits, rather than assuming it does.' },
      { title: 'Drain checked before quoting', body: 'Shower and tub drains sit differently, and that is the variable that decides the price.' },
      { title: 'Family-practical fittings', body: 'Hand-held shower on a slide bar, and a valve that is reachable from outside the tub.' },
    ],
    faqs: [
      { q: 'Is it harder to put a tub back than to take one out?', a: 'Slightly, because the drain usually has to move — shower drains are centred and tub drains sit at one end. It is routine work, but it is the reason a shower-to-tub conversion generally takes a little longer than the reverse.' },
    ],
    imageCategory: 'tubs',
  }),

  'therapeutic-tubs': S({
    h1: 'Therapeutic Tubs',
    summary: 'Soaking and hydrotherapy tubs with low-entry access, for arthritis, circulation and everyday pain management.',
    intro: [
      'A therapeutic tub is a tub designed to be used often and got into safely — deeper water, a door or low threshold, and controls that can be reached while seated.',
      'We install them across Northern Virginia and Maryland, generally for people managing arthritis, circulation problems or chronic pain.',
    ],
    sections: [
      { h: 'What the features actually do', p: [
        'Deeper water covers the shoulders while seated, which is the point for joint pain. Air jets are gentler than water jets and easier to keep clean. Heated surfaces keep a long soak comfortable rather than going tepid.',
        'We will not make medical claims for any of it. What we will say is which configuration suits the way you intend to use it.',
      ] },
      { h: 'Practical considerations', p: [
        'A filled therapeutic tub is heavy, so floor structure is checked before installation. Fill and drain times matter more than people expect, and a larger drain is worth specifying if you will use it daily.',
      ] },
    ],
    highlights: [
      { title: 'Low and door-entry options', body: 'Get in without climbing over a wall, with seating at a usable height.' },
      { title: 'Seated-reach controls', body: 'Valves and jet controls placed where they can be operated from inside the tub.' },
      { title: 'Structure checked first', body: 'A filled tub is heavy; we confirm the floor can take it before installing.' },
    ],
    faqs: [
      { q: 'Will a therapeutic tub help my arthritis?', a: 'Many people find warm-water immersion helpful for joint stiffness, but we are a bathroom contractor and not a clinician — that is a question for your doctor. What we can tell you is which tub configuration will be comfortable and safe for you to get in and out of daily.' },
      { q: 'How long does a walk-in or therapeutic tub take to fill and drain?', a: 'Longer than a standard tub, because they hold more water and you are sitting in them while it fills. A fast-fill valve and a larger drain make a real difference, and we recommend both if the tub will be used every day.' },
    ],
    imageCategory: 'tubs',
  }),

  'tub-to-shower-conversions': S({
    h1: 'Tub to Shower Conversions',
    summary: 'Replace a tub you step over with a shower you walk into — same footprint, existing drain, usually one or two days.',
    intro: [
      'This is the job we do most. A tub that nobody has taken a bath in for years becomes a shower that is easier and safer to use every day.',
      'Because the footprint and drain stay put, most conversions are finished in a day or two without touching the rest of the bathroom.',
    ],
    sections: [
      { h: 'Why people convert', p: [
        'Stepping over a 15-inch tub wall onto a wet surface is how most bathroom injuries happen. Remove the wall and you remove the risk, which is why this is the first thing we are asked about by anyone planning to stay in their home.',
        'The second reason is simpler: an unused tub is wasted floor area in the smallest room in the house.',
      ] },
      { h: 'Low threshold or barrier-free', p: [
        'A low-threshold base keeps a small lip to contain water and suits most bathrooms. A barrier-free entry removes it entirely and needs the floor structure to allow the pan to be recessed — we check that before promising it.',
      ] },
      { h: 'Safety specified at the same time', p: [
        'Grab bars into real blocking, a slip-resistant base, a fold-down or moulded seat and a hand-held shower on a slide bar. Specifying these with the base costs far less than retrofitting them later.',
      ] },
    ],
    highlights: [
      { title: 'Custom acrylic bases', body: 'Sized to your alcove and set fully bedded, so the pan cannot flex.' },
      { title: 'Grab bars into blocking', body: 'Anchored into framing, not tile — a bar that pulls out of the wall is worse than no bar.' },
      { title: 'One or two days, typically', body: 'Reusing the existing drain is what keeps the timeline short and the room intact.' },
    ],
    faqs: [
      { q: 'Do I lose value by removing my bathtub?', a: 'Only if it leaves the house without a tub anywhere. If there is a tub in another bathroom, converting this one is generally neutral to positive — and strongly positive if it makes the home usable for someone who is currently avoiding that bathroom.' },
      { q: 'Can the shower be made fully barrier-free?', a: 'Sometimes. A truly zero-threshold entry needs the pan recessed into the floor structure, which depends on what is under it — joist direction and depth decide it. We check before quoting, and if it is not possible we can usually get down to a low bevelled threshold instead.' },
    ],
    imageCategory: 'bath-and-shower',
  }),

  'walk-in-bathtubs': S({
    h1: 'Walk-In Bathtubs',
    summary: 'Walk-in tubs with a sealed door, built-in seating and reachable controls — a bath you step into rather than climb over.',
    intro: [
      'A walk-in tub is for people who want to keep bathing rather than switch to showering. You open a door, sit down, and fill the tub around you.',
      'They are a significant purchase and they are not right for everyone, so we would rather talk you through the trade-offs than sell you one that sits unused.',
    ],
    sections: [
      { h: 'How they work in practice', p: [
        'You get in, close the door, and the tub fills with you in it. At the end you drain it before opening the door. That means the fill and drain times are part of every bath, not a detail — which is why a fast-fill valve and a large drain are worth specifying.',
        'Most people find the first bath strange and the tenth completely normal.',
      ] },
      { h: 'The honest trade-offs', p: [
        'You sit and wait while it fills and drains. The door seal is a maintenance item. And the unit occupies a specific footprint that may not suit a small hall bath.',
        'Against that: it is a real bath, taken safely, in a home somebody wants to stay in. For the right person there is no substitute.',
      ] },
      { h: 'Installation considerations', p: [
        'Floor structure is checked for the filled weight. Water heater capacity matters too, because a deeper tub can outrun a small tank — we check the tank size before recommending a model.',
      ] },
    ],
    highlights: [
      { title: 'Sealed door entry', body: 'Step in over a low threshold instead of climbing a tub wall.' },
      { title: 'Seating at usable height', body: 'Built-in seat with controls placed to be reached while seated.' },
      { title: 'Water heater checked', body: 'A deep tub can outrun a small tank; we confirm capacity before recommending a model.' },
    ],
    faqs: [
      { q: 'Do I have to sit in the tub while it fills?', a: 'Yes — the door has to be closed and sealed before the water goes in, so you are in the tub for the fill and again for the drain. A fast-fill valve and an oversized drain shorten both considerably, and we fit them as standard for daily users.' },
      { q: 'What happens if the power goes out mid-bath?', a: 'Filling and draining are plumbing functions, not electrical, so they keep working. Only powered extras such as air jets and heated surfaces stop. You are never trapped by a power cut.' },
    ],
    imageCategory: 'tubs',
  }),

  'walk-in-shower': S({
    h1: 'Walk-In Showers',
    summary: 'Open, low-threshold walk-in showers that make a bathroom feel larger and are far easier to get into.',
    intro: [
      'A walk-in shower trades the tub and the door for open access and a much larger sense of space. In a small bathroom the difference is dramatic.',
      'We build them across Northern Virginia and Maryland, from low-threshold bases to fully recessed barrier-free entries.',
    ],
    sections: [
      { h: 'Containing the water', p: [
        'Open entries work when the floor falls correctly and the opening is positioned away from the spray. Get either wrong and you have a wet bathroom floor every morning.',
        'That is a design problem rather than a product problem, and it is solved at the measure, not afterwards with a bath mat.',
      ] },
      { h: 'Glass, or none at all', p: [
        'A single fixed panel is enough in many layouts and keeps the open feel. Where the room is tight, a door contains the spray better. We will tell you which your room can carry.',
      ] },
    ],
    highlights: [
      { title: 'Low and zero thresholds', body: 'Step in at or near floor level, subject to what the floor structure allows.' },
      { title: 'Fall designed, not improvised', body: 'The base is set so water goes to the drain rather than out of the opening.' },
      { title: 'Panel or door', body: 'A single fixed panel keeps it open; a door contains spray in a tight room. We advise honestly.' },
    ],
    faqs: [
      { q: 'Will water escape from an open walk-in shower?', a: 'Not if it is designed properly. The base has to fall to the drain, the opening has to sit away from the spray, and the shower has to be long enough that water loses energy before it reaches the entry. In a very small bathroom those conditions can be hard to meet, and then a door is the honest answer.' },
    ],
    imageCategory: 'showers',
  }),
};

export const getServiceCopy = (slug: string): ServiceCopy | undefined => serviceCopy[slug];
