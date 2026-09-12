"""
Narrows pagesToBuild to city x service combinations with real GSC query demand,
so we don't ship 116 near-identical doorway pages. Rewrites data/cities.json.

A city hub is always built (it consolidates the city's authority and is the
redirect target for legacy '<city>-bathroom-remodeling' slugs). A service child
is built only where queries for that city mention that service's intent.

Run: python3 scripts/bootstrap/narrow_geo.py
"""
import json, re
from pathlib import Path

D = Path(__file__).resolve().parents[2] / "data"
cities = json.load(open(D / "cities.json"))
queries = json.load(open(D / "gsc-queries.json"))

INTENT = {
    "accessible-bathroom": ["accessible", "ada", "handicap", "wheelchair", "grab bar",
                            "aging in place", "senior", "roll in", "roll-in", "barrier free"],
    "shower-remodel": ["shower remodel", "shower replacement", "shower enclosure",
                       "shower installation", "replacement shower", "walk in shower",
                       "walk-in shower", "acrylic shower", "shower surround", "shower door",
                       "showers replacement", "custom shower"],
    "tub-to-shower-conversions": ["tub to shower", "tub-to-shower", "bath to shower",
                                  "shower to tub", "bathtub conversion", "conversion"],
    "walk-in-bathtubs": ["walk in tub", "walk-in tub", "walk in bathtub", "walk-in bathtub",
                         "therapeutic tub", "soaking tub", "bathtub replacement",
                         "replacement bathtub", "bathtub installation", "new bathtub"],
}
HUB = ["bathroom remodel", "bathroom renovation", "bathroom remodeling", "bath remodel",
       "bathroom contractor", "bath renovation", "bathroom design", "remodeler"]

# City-name variants that appear in queries.
ALIASES = {
    "washington-dc": ["washington dc", "washington d.c", " dc ", " dc,", "dc bathroom",
                      "dc shower", "district of columbia"],
    "fairfax": ["fairfax", "greenbriar", "fair oaks"],
    "king-george": ["king george"],
    "ellicott-city": ["ellicott city"],
    "silver-spring": ["silver spring"],
    "college-park": ["college park"],
    "prince-georges-county": ["prince george", "prince georges", "prince george's"],
}


def variants(c):
    return ALIASES.get(c["slug"], [c["name"].lower()])


for c in cities:
    if not c["pagesToBuild"]:
        continue
    hits = []
    for q in queries:
        ql = f" {q['query'].lower()} "
        if any(v in ql for v in variants(c)):
            hits.append((q["query"], q["impressions"], q["position"]))
    total = int(sum(h[1] for h in hits))

    keep, evidence = [f"/{c['slug']}/"], {}
    for svc, words in INTENT.items():
        path = f"/{c['slug']}/{svc}/"
        if path not in c["pagesToBuild"]:
            continue
        matched = [h for h in hits if any(w in f" {h[0].lower()} " for w in words)]
        if matched:
            keep.append(path)
            evidence[svc] = {"impressions": int(sum(m[1] for m in matched)),
                             "topQuery": max(matched, key=lambda m: m[1])[0],
                             "bestPosition": round(min(m[2] for m in matched), 1)}

    hubHits = [h for h in hits if any(w in f" {h[0].lower()} " for w in HUB)]
    c["pagesToBuild"] = keep
    c["queryEvidence"] = {
        "totalImpressions": total,
        "topQueries": [{"query": h[0], "impressions": int(h[1]), "position": round(h[2], 1)}
                       for h in sorted(hits, key=lambda x: -x[1])[:4]],
        "hubImpressions": int(sum(h[1] for h in hubHits)),
        "byService": evidence,
    }

(D / "cities.json").write_text(json.dumps(cities, indent=1))

print(f"{'city':<24}{'tier':>5}{'imp':>6}{'build':>7}  services with evidence")
tot = 0
for c in sorted([c for c in cities if c["pagesToBuild"]], key=lambda x: (x["tier"], -x["queryEvidence"]["totalImpressions"])):
    tot += len(c["pagesToBuild"])
    svcs = ", ".join(c["queryEvidence"]["byService"]) or "— hub only"
    print(f"{c['name']+', '+c['state']:<24}{c['tier']:>5}{c['queryEvidence']['totalImpressions']:>6}"
          f"{len(c['pagesToBuild']):>7}  {svcs}")
print(f"\nnew pages: {tot} (was 116)")
