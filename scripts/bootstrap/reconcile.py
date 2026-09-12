"""
Closes the loop between the redirect map and the pages that will actually exist.

A 301 pointing at a URL nobody builds is a 404 wearing a disguise — and it is
easy to create, because narrowing the geo footprint (narrow_geo.py) removes
pages that the redirect map was written against.

Rules:
  - redirect target exists (preserved, restored, or queued to build)  -> keep
  - target is /city/service/ that won't be built                      -> retarget to /city/
  - target still unresolvable                                         -> FAIL loudly

Emits data/routes.json — the single registry lib/routes.ts imports.
Run: python3 scripts/bootstrap/reconcile.py
"""
import csv, json, sys
from pathlib import Path

D = Path(__file__).resolve().parents[2] / "data"
urlmap = list(csv.DictReader(open(D / "url-map.csv")))
preserved = list(csv.DictReader(open(D / "preserved-urls.csv")))
cities = json.load(open(D / "cities.json"))

will_exist = {r["url"] for r in preserved}
for c in cities:
    will_exist.update(c["pagesToBuild"])

fixed, broken = [], []
for r in urlmap:
    if r["disposition"] != "redirect":
        continue
    t = r["new_url"]
    if t in will_exist:
        continue
    seg = [s for s in t.split("/") if s]
    hub = f"/{seg[0]}/"
    if len(seg) == 2 and hub in will_exist:
        fixed.append((r["old_url"], t, hub))
        r["new_url"] = hub
        r["reason"] = f"{r['reason']}; retargeted to city hub (no query demand for {seg[1]})"
    else:
        broken.append((r["old_url"], t))

if fixed:
    print(f"retargeted {len(fixed)} redirect(s) to a city hub:")
    for old, was, now in fixed:
        print(f"   {old}\n      {was}  ->  {now}")
if broken:
    print(f"\nFAIL: {len(broken)} redirect target(s) resolve to nothing:")
    for old, t in broken:
        print(f"   {old} -> {t}")
    sys.exit(1)

with open(D / "url-map.csv", "w", newline="") as f:
    w = csv.writer(f)
    w.writerow(["old_url", "disposition", "new_url", "status", "reason",
                "gsc_impressions", "gsc_position"])
    w.writerows([[r[k] for k in ("old_url", "disposition", "new_url", "status",
                                 "reason", "gsc_impressions", "gsc_position")] for r in urlmap])

routes = {
    "preserved": [{"url": r["url"], "kind": r["kind"]} for r in preserved],
    "redirects": [{"from": r["old_url"], "to": r["new_url"]}
                  for r in urlmap if r["disposition"] == "redirect"],
    "build": sorted({u for c in cities for u in c["pagesToBuild"]}),
}
(D / "routes.json").write_text(json.dumps(routes, indent=1))

print(f"\nroutes.json: {len(routes['preserved'])} preserved · "
      f"{len(routes['redirects'])} redirects · {len(routes['build'])} new")
print("every redirect target resolves to a page that will exist")
