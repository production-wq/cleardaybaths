"""
Derives the routing registry from data/wp-pages.json + data/gsc-pages.json.

Emits:
  data/url-map.csv        every legacy URL and its disposition (preserve/restore/redirect)
  data/preserved-urls.csv the URLs that MUST return 200 — input to test:preservation

Disposition rules:
  preserve  published in WP  -> same URL, byte-for-byte
  restore   trashed in WP but still ranking in GSC, no live replacement (Columbia MD)
  redirect  trashed/duplicate -> 301 to the live or newly-built equivalent

Run: python3 scripts/bootstrap/build_url_map.py
"""
import csv, json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
D = ROOT / "data"

pages = json.loads((D / "wp-pages.json").read_text())
gsc = {g["url"]: g for g in json.loads((D / "gsc-pages.json").read_text())}

# WP front page: /home/ renders at / and is not separately indexed.
FRONT_PAGE_SLUG = "/home/"

# Trashed slugs that have a live published equivalent.
REDIRECT_TO_LIVE = {
    "/annapolis-bathroom-remodeling/": "/bathroom-remodeling-annapolis-md/",
    "/annapolis-shower-remodel/": "/shower-remodel-annapolis-md/",
    "/college-park-shower-remodel/": "/shower-remodel-college-park-md/",
    "/davidsonville-md-walk-in-bathtubs/": "/walk-in-bathtubs-davidsonville-md/",
    "/waldorf-tub-to-shower-conversions/": "/tub-shower-conversions-waldorf-md/",
}

# Trashed slugs with no live equivalent -> the nested page built in Phase 3.
# A bare city hub is the target where the old slug was a general "bathroom remodeling" page,
# since the nested service vocabulary has no 'bathroom-remodeling' child.
REDIRECT_TO_NEW = {
    "/annapolis-tub-to-shower-conversions/": "/annapolis/tub-to-shower-conversions/",
    "/annapolis-walk-in-bathtubs/": "/annapolis/walk-in-bathtubs/",
    "/college-park-bathroom-remodeling/": "/college-park/",
    "/college-park-md-walk-in-bathtubs/": "/college-park/walk-in-bathtubs/",
    "/college-park-tub-to-shower-conversions/": "/college-park/tub-to-shower-conversions/",
    "/davidsonville-bathroom-remodeling/": "/davidsonville/",
    "/davidsonville-md-shower-remodel/": "/davidsonville/shower-remodel/",
    "/davidsonville-tub-to-shower-conversions/": "/davidsonville/tub-to-shower-conversions/",
    "/waldorf-md-bathroom-remodeling/": "/waldorf/",
    "/waldorf-md-shower-remodel/": "/shower-remodel-waldorf-md/",
    "/waldorf-walk-in-bathtubs/": "/waldorf/walk-in-bathtubs/",
}

# Trashed but still ranking, no replacement anywhere -> rebuild at the original slug.
RESTORE = [
    "/columbia-bathroom-remodeling/",
    "/columbia-shower-remodel/",
    "/columbia-md-tub-to-shower-conversions/",
    "/columbia-md-walk-in-bathtubs/",
]

# Indexed pagination that is not a WP page record.
EXTRA_PRESERVE = [("/blog/page/2/", "blog-pagination", "GSC-indexed blog pagination")]

rows, preserved = [], []


def imp(u):
    g = gsc.get(u)
    return int(g["impressions"]) if g else 0


def pos(u):
    g = gsc.get(u)
    return round(g["position"], 1) if g else ""


SERVICE_HUBS = {"bathrooms", "showers", "bath-conversions"}
# Cities that use the nested /city/service/ pattern.
NESTED_CITIES = {"alexandria", "fredericksburg", "manassas", "stafford", "woodbridge"}


def kind_of(p):
    """Classify a URL by template. Exact set membership only — substring matching
    silently mis-files /fredericksburg/ as a Frederick, MD flat page."""
    path = p["clean_path"]
    if path == "/" or path == FRONT_PAGE_SLUG:
        return "home"
    if p["type"] == "post":
        return "blog-post"
    seg = [s for s in path.split("/") if s]
    if seg[0] in SERVICE_HUBS:
        return "service-hub" if len(seg) == 1 else "service-detail"
    if seg[0] in NESTED_CITIES:
        return "city-hub" if len(seg) == 1 else "city-service-nested"
    if len(seg) == 1 and any(seg[0].startswith(c) or seg[0].endswith(c) for c in FLAT_CITY_TOKENS):
        return "city-service-flat"
    return "company"


# Tokens that appear at the head or tail of a legacy flat geo slug, e.g.
# "frederick-shower-remodel" / "shower-remodel-annapolis-md".
FLAT_CITY_TOKENS = (
    "frederick", "hagerstown", "warrenton", "annapolis-md", "annapolis",
    "college-park-md", "college-park", "capitol-heights-md", "waldorf-md", "waldorf",
    "davidsonville-md", "davidsonville", "columbia", "prince-georges-county-md",
)


for p in sorted(pages, key=lambda x: x["clean_path"]):
    path, st = p["clean_path"], p["status"]

    if st == "publish":
        if path == FRONT_PAGE_SLUG:
            rows.append([path, "redirect", "/", "301", "WP front page renders at root", imp(path), pos(path)])
            preserved.append(["/", "home", p["title"]])
            continue
        rows.append([path, "preserve", path, "200", "published in WordPress", imp(path), pos(path)])
        preserved.append([path, kind_of(p), p["title"]])

    elif st == "trash":
        if path in REDIRECT_TO_LIVE:
            rows.append([path, "redirect", REDIRECT_TO_LIVE[path], "301",
                         "trashed; live equivalent exists", imp(path), pos(path)])
        elif path in REDIRECT_TO_NEW:
            rows.append([path, "redirect", REDIRECT_TO_NEW[path], "301",
                         "trashed; target built in Phase 3 geo expansion", imp(path), pos(path)])
        elif path in RESTORE:
            rows.append([path, "restore", path, "200",
                         f"trashed but still ranking (pos {pos(path)}); no replacement anywhere",
                         imp(path), pos(path)])
            preserved.append([path, "city-service-flat", p["title"].replace("&amp;", "&")])

    elif st == "future":
        rows.append([path, "publish", path, "200",
                     "scheduled in WordPress; publish on launch", imp(path), pos(path)])
        preserved.append([path, kind_of(p), p["title"]])

for path, kind, why in EXTRA_PRESERVE:
    rows.append([path, "preserve", path, "200", why, imp(path), pos(path)])
    preserved.append([path, kind, "Blog — page 2"])

rows.sort(key=lambda r: (r[1], r[0]))
preserved.sort(key=lambda r: r[0])

with open(D / "url-map.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["old_url", "disposition", "new_url", "status", "reason",
                "gsc_impressions", "gsc_position"])
    w.writerows(rows)

with open(D / "preserved-urls.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["url", "kind", "source_title"])
    w.writerows(preserved)

from collections import Counter
c = Counter(r[1] for r in rows)
print("url-map.csv      ", dict(c), f"= {len(rows)} legacy URLs")
print("preserved-urls.csv", len(preserved), "URLs that must return 200")
print("  by kind:", dict(Counter(p[1] for p in preserved)))

# Every GSC-indexed URL must be accounted for — this is the zero-traffic-loss check.
handled = {r[0] for r in rows} | {r[2] for r in rows} | {p[0] for p in preserved}
missing = [u for u in gsc if u not in handled]
print(f"\nGSC-indexed URLs unaccounted for: {len(missing)}")
for u in missing:
    print(f"   !! {u}  ({int(gsc[u]['impressions'])} imp, pos {gsc[u]['position']:.1f})")
