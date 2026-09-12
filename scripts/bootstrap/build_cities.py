"""
City registry: merges the URL registry (what exists / must be preserved) with
real-world locality metadata (what makes each geo page non-boilerplate).

Emits data/cities.json.

`tier` semantics:
  0  existing page — preserve or restore, URL is fixed by history
  1  build now — 70-314 GSC impressions of proven demand
  2  build after tier 1 — 8-43 impressions
Run: python3 scripts/bootstrap/build_cities.py
"""
import csv, json
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "data"

# Nested-pattern service vocabulary, taken from the 5 existing VA cities.
NESTED_SERVICES = ["accessible-bathroom", "shower-remodel",
                   "tub-to-shower-conversions", "walk-in-bathtubs"]

# county/nearby/note are real-world facts used to keep geo copy distinct.
META = {
  "woodbridge":       ("Woodbridge", "VA", "Prince William County", ["Lake Ridge", "Dale City", "Occoquan", "Montclair"], "Company home base. 1970s-90s split-levels and townhomes around Lake Ridge with original builder-grade tub/shower units."),
  "alexandria":       ("Alexandria", "VA", "City of Alexandria", ["Del Ray", "Old Town", "Kingstowne", "Huntington"], "Old Town rowhouses under historic-district review; mid-century condos in Huntington with tight bathroom footprints."),
  "fredericksburg":   ("Fredericksburg", "VA", "City of Fredericksburg", ["Spotsylvania", "Falmouth", "Stafford"], "Historic-district homes plus fast-growing Spotsylvania subdivisions; long commuter hours make one-day installs valuable."),
  "manassas":         ("Manassas", "VA", "City of Manassas", ["Manassas Park", "Bristow", "Gainesville", "Sudley"], "Post-war ramblers near Old Town Manassas and 2000s colonials in Bristow/Gainesville."),
  "stafford":         ("Stafford", "VA", "Stafford County", ["Aquia Harbour", "Garrisonville", "Falmouth"], "Large military population at Quantico; frequent PCS moves drive quick-turnaround remodels."),
  "warrenton":        ("Warrenton", "VA", "Fauquier County", ["New Baltimore", "Bealeton", "Marshall"], "Rural Fauquier properties, many on well and septic, which affects fixture and drain planning."),
  "frederick":        ("Frederick", "MD", "Frederick County", ["Urbana", "Walkersville", "Ballenger Creek"], "Historic downtown rowhomes with narrow second-floor baths; newer Urbana construction."),
  "hagerstown":       ("Hagerstown", "MD", "Washington County", ["Williamsport", "Smithsburg", "Halfway"], "Older housing stock with cast-iron tubs and plaster walls; groutless surrounds are a common request."),
  "annapolis":        ("Annapolis", "MD", "Anne Arundel County", ["Parole", "Cape Saint Claire", "Severna Park"], "Waterfront and historic-district homes; humidity and salt air make moisture-proof surrounds a priority."),
  "college-park":     ("College Park", "MD", "Prince George's County", ["Greenbelt", "Riverdale Park", "Hyattsville"], "University-adjacent rentals and mid-century capes; landlord-driven durable-finish demand."),
  "waldorf":          ("Waldorf", "MD", "Charles County", ["St. Charles", "Bryans Road", "La Plata"], "Fast-growing commuter subdivisions; young families favour one-day bath conversions."),
  "davidsonville":    ("Davidsonville", "MD", "Anne Arundel County", ["Edgewater", "Crofton", "Riva"], "Large lots and custom homes between Annapolis and Bowie; higher-end custom tile and enclosure work."),
  "capitol-heights":  ("Capitol Heights", "MD", "Prince George's County", ["District Heights", "Seat Pleasant", "Landover"], "Compact post-war homes inside the Beltway; space-saving layouts matter."),
  "columbia":         ("Columbia", "MD", "Howard County", ["Ellicott City", "Elkridge", "Clarksville"], "Planned-community villages from the late 60s/70s, now at the age where original baths need full replacement."),
  "prince-georges-county": ("Prince George's County", "MD", "Prince George's County", ["Bowie", "Largo", "Upper Marlboro"], "County-wide accessibility work; strong aging-in-place demand."),
  # --- Tier 1: proven GSC demand, no page today ---
  "washington-dc":    ("Washington", "DC", "District of Columbia", ["Capitol Hill", "Petworth", "Brookland"], "Rowhouses with stacked plumbing and narrow stairs; permit and HOA/historic review common."),
  "woodlawn":         ("Woodlawn", "MD", "Baltimore County", ["Catonsville", "Randallstown", "Arbutus"], "Mid-century ramblers and split-levels west of Baltimore with original 1950s-60s tub alcoves."),
  "ashburn":          ("Ashburn", "VA", "Loudoun County", ["Brambleton", "Broadlands", "Sterling"], "Newer 2000s-2010s construction; owners upgrading builder-grade fibreglass to custom tile and glass."),
  "king-george":      ("King George", "VA", "King George County", ["Dahlgren", "Colonial Beach"], "Rural county served off Route 3; Navy-base households at Dahlgren."),
  "dahlgren":         ("Dahlgren", "VA", "King George County", ["King George", "Colonial Beach"], "Naval Support Facility community; frequent relocations and rental-property turnovers."),
  "fairfax":          ("Fairfax", "VA", "Fairfax County", ["Greenbriar", "Chantilly", "Oakton", "Fair Oaks"], "Greenbriar and Fair Oaks colonials from the 60s-80s; the site already ranks ~2nd for 'bathroom remodeling in greenbriar'."),
  "bethesda":         ("Bethesda", "MD", "Montgomery County", ["Chevy Chase", "North Bethesda", "Potomac"], "High-end renovations; frequent requests for curbless showers and heated floors."),
  # --- Tier 2 ---
  "ellicott-city":    ("Ellicott City", "MD", "Howard County", ["Columbia", "Catonsville", "Elkridge"], "Historic Main Street properties plus 80s-90s colonials on the west side."),
  "gaithersburg":     ("Gaithersburg", "MD", "Montgomery County", ["Rockville", "Germantown", "Montgomery Village"], "Montgomery Village townhomes with small second baths."),
  "arlington":        ("Arlington", "VA", "Arlington County", ["Ballston", "Clarendon", "Shirlington"], "Pre-war bungalows and mid-rise condos; strict condo association rules on wet-area work."),
  "leesburg":         ("Leesburg", "VA", "Loudoun County", ["Ashburn", "Purcellville", "Lansdowne"], "Historic district plus large newer subdivisions east of town."),
  "vienna":           ("Vienna", "VA", "Fairfax County", ["Oakton", "Tysons", "Dunn Loring"], "Mature neighbourhoods with 60s-70s ranchers being expanded or fully renovated."),
  "silver-spring":    ("Silver Spring", "MD", "Montgomery County", ["Wheaton", "Takoma Park", "Colesville"], "Dense inside-the-Beltway housing with compact original baths."),
  "chantilly":        ("Chantilly", "VA", "Fairfax County", ["Greenbriar", "Centreville", "South Riding"], "80s-90s colonials; hall baths and primary suites upgraded together."),
  "mclean":           ("McLean", "VA", "Fairfax County", ["Tysons", "Great Falls", "Pimmit Hills"], "Premium market; frameless glass enclosures and large-format tile."),
  "culpeper":         ("Culpeper", "VA", "Culpeper County", ["Brandy Station", "Rixeyville"], "Rural and small-town properties; accessibility work for aging-in-place."),
  "oakton":           ("Oakton", "VA", "Fairfax County", ["Vienna", "Fairfax", "Fair Oaks"], "Wooded lots with 70s-80s custom homes."),
  "tysons":           ("Tysons", "VA", "Fairfax County", ["McLean", "Vienna", "Merrifield"], "High-rise condos; building rules and stack access shape the scope."),
  "laurel":           ("Laurel", "MD", "Prince George's County", ["South Laurel", "North Laurel", "Savage"], "Mix of older town centre homes and newer corridor developments."),
  "towson":           ("Towson", "MD", "Baltimore County", ["Lutherville", "Rodgers Forge", "Parkville"], "Rodgers Forge and Stoneleigh rowhomes with original 1940s tile."),
  "germantown":       ("Germantown", "MD", "Montgomery County", ["Clarksburg", "Boyds", "Gaithersburg"], "90s-2000s townhome communities upgrading builder-grade units."),
}

TIER1 = ["washington-dc", "woodlawn", "ashburn", "king-george", "fairfax", "dahlgren", "bethesda"]
TIER2 = ["ellicott-city", "gaithersburg", "arlington", "leesburg", "vienna", "silver-spring",
         "chantilly", "mclean", "culpeper", "oakton", "tysons", "laurel", "towson", "germantown"]
def flat_slug(city_slug, state, service, existing_slugs):
    """Build a new flat slug in the pattern that city already uses.

    The legacy flat slugs are internally inconsistent — 'frederick-shower-remodel'
    is city-first, 'shower-remodel-college-park-md' is service-first. New pages
    follow whichever shape that particular city already uses, so each city stays
    self-consistent even though the site as a whole is not.
    """
    city_first = sum(1 for sl in existing_slugs if sl.startswith(city_slug))
    other = len(existing_slugs) - city_first
    if city_first >= other:
        return f"/{city_slug}-{service}/"
    return f"/{service}-{city_slug}-{state.lower()}/"

NESTED_EXISTING = {"alexandria", "fredericksburg", "manassas", "stafford", "woodbridge"}

preserved = list(csv.DictReader(open(D / "preserved-urls.csv")))
urlmap = list(csv.DictReader(open(D / "url-map.csv")))
gsc = {g["url"]: g for g in json.load(open(D / "gsc-pages.json"))}

existing = defaultdict(list)
for r in preserved:
    if r["kind"] not in ("city-hub", "city-service-nested", "city-service-flat"):
        continue
    seg = [s for s in r["url"].split("/") if s]
    if seg[0] in NESTED_EXISTING:
        existing[seg[0]].append(r["url"])
    else:
        for key in META:
            tokens = [key] + ([key.replace("-", "")] if "-" in key else [])
            if any(seg[0].startswith(t + "-") or seg[0].endswith("-" + t)
                   or seg[0].endswith("-" + t + "-md") or f"-{t}-" in seg[0] for t in tokens):
                existing[key].append(r["url"]); break

restored = {r["old_url"] for r in urlmap if r["disposition"] == "restore"}

SVC_RULES = [("accessible-bathroom", ("accessible-bathroom", "ada-")),
             ("walk-in-bathtubs", ("walk-in-bathtubs", "walk-in-tubs", "walk-in-bathtub")),
             ("tub-to-shower-conversions", ("tub-to-shower-conversions", "tub-shower-conversions")),
             ("shower-remodel", ("shower-remodel",)),
             (None, ("bathroom-remodeling", "bath-remodeling"))]


def service_of(url, city_slug):
    """Which nested-vocabulary service a URL represents; None = city hub/general."""
    seg = [x for x in url.split("/") if x]
    if len(seg) == 2:
        return seg[1]
    if seg[0] == city_slug:
        return None
    for name, pats in SVC_RULES:
        if any(p in seg[0] for p in pats):
            return name
    return None
cities = []
for key, (name, state, county, nearby, note) in META.items():
    urls = sorted(set(existing.get(key, [])))
    pattern = "nested" if key in NESTED_EXISTING else ("flat" if urls else "new")
    tier = 0 if urls else (1 if key in TIER1 else 2)
    pages = [{"url": u, "service": service_of(u, key),
              "status": "restore" if u in restored else "preserve",
              "gscImpressions": int(float(gsc[u]["impressions"])) if u in gsc else 0,
              "gscPosition": round(float(gsc[u]["position"]), 1) if u in gsc else None}
             for u in urls]
    build = []
    if tier in (1, 2):
        # New city: full nested set — hub plus every service.
        build = [f"/{key}/"] + [f"/{key}/{s}/" for s in NESTED_SERVICES]
    elif pattern == "flat":
        # Existing flat city: add the services it does not already cover, using
        # that city's own slug shape. No hub — its '-bathroom-remodeling' page
        # already plays that role, and a bare /city/ would cannibalise it.
        have = {p["service"] for p in pages if p.get("service")}
        slugs = [u.strip("/") for u in urls]
        for svc in NESTED_SERVICES:
            if svc not in have:
                cand = flat_slug(key, state, svc, slugs)
                if cand not in urls:
                    build.append(cand)

    cities.append({"slug": key, "name": name, "state": state, "county": county,
                   "nearby": nearby, "note": note, "pattern": pattern, "tier": tier,
                   "existingPages": pages, "pagesToBuild": build})

cities.sort(key=lambda c: (c["tier"], c["state"], c["name"]))
(D / "cities.json").write_text(json.dumps(cities, indent=1))

print(f"{len(cities)} cities\n")
print(f"{'city':<26}{'tier':>5}{'pattern':>9}{'have':>6}{'build':>7}  county")
for c in cities:
    print(f"{c['name']+', '+c['state']:<26}{c['tier']:>5}{c['pattern']:>9}"
          f"{len(c['existingPages']):>6}{len(c['pagesToBuild']):>7}  {c['county']}")
have = sum(len(c["existingPages"]) for c in cities)
print(f"\nexisting geo URLs matched: {have}  |  new pages queued: {sum(len(c['pagesToBuild']) for c in cities)}")
