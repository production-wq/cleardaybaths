"""
One-time derivation of the routing registry from the authoritative exports.

Sources (data/_source/):
  - cleardaybathsolutions.WordPress.2026-09-12.xml  — page/post hierarchy, the URL truth
  - gsc-performance.xlsx                            — what Google actually has indexed

Emits:
  - data/wp-pages.json       every page/post with resolved path, status, raw content
  - data/gsc-pages.json      indexed URLs with clicks/impressions/position
  - data/gsc-queries.json    505 queries with metrics

Run: python3 scripts/bootstrap/extract_wp.py
"""
import json, re, zipfile, xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "data" / "_source"
OUT = ROOT / "data"
WP = {"wp": "http://wordpress.org/export/1.2/",
      "content": "http://purl.org/rss/1.0/modules/content/",
      "excerpt": "http://wordpress.org/export/1.2/excerpt/"}
XL = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"


def wp_pages():
    tree = ET.parse(SRC / "cleardaybathsolutions.WordPress.2026-09-12.xml")
    items = tree.getroot().find("channel").findall("item")
    recs = {}
    for it in items:
        pt = it.findtext("wp:post_type", None, WP)
        if pt not in ("page", "post"):
            continue
        pid = int(it.findtext("wp:post_id", "0", WP))
        meta = {}
        for m in it.findall("wp:postmeta", WP):
            k = m.findtext("wp:meta_key", "", WP)
            if k.startswith("_yoast_wpseo_"):
                meta[k.replace("_yoast_wpseo_", "")] = m.findtext("wp:meta_value", "", WP)
        recs[pid] = {
            "id": pid, "type": pt,
            "title": (it.findtext("title") or "").strip(),
            "slug": it.findtext("wp:post_name", "", WP) or "",
            "parent": int(it.findtext("wp:post_parent", "0", WP)),
            "status": it.findtext("wp:status", "", WP),
            "link": it.findtext("link") or "",
            "date": (it.findtext("wp:post_date", "", WP) or "")[:10],
            "seo": meta,
            "content": it.findtext("content:encoded", "", WP) or "",
            "excerpt": it.findtext("excerpt:encoded", "", WP) or "",
        }

    def path_of(r):
        parts, p, guard = [r["slug"]], r["parent"], 0
        while p and p in recs and guard < 6:
            parts.append(recs[p]["slug"]); p = recs[p]["parent"]; guard += 1
        return "/" + "/".join(reversed([x for x in parts if x])) + "/"

    for r in recs.values():
        # Published posts carry their real permalink in <link> (they live under /blog/).
        # Scheduled/draft posts have no pretty permalink yet — <link> is "/?p=1713" —
        # so fall back to the /blog/<slug>/ shape those posts will take once published.
        if r["type"] == "post":
            m = re.match(r"https://cleardaybaths\.com(/[^?]+/)$", r["link"])
            r["path"] = m.group(1) if m else f"/blog/{r['slug']}/"
        else:
            r["path"] = path_of(r)
        r["clean_path"] = r["path"].replace("__trashed/", "/")
    return sorted(recs.values(), key=lambda r: r["path"])


def xlsx_sheet(fn, sheet):
    z = zipfile.ZipFile(SRC / fn)
    wb = ET.fromstring(z.read("xl/workbook.xml"))
    names = [s.get("name") for s in wb.iter(XL + "sheet")]
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        ss = ET.fromstring(z.read("xl/sharedStrings.xml"))
        shared = ["".join(t.text or "" for t in si.iter(XL + "t")) for si in ss.iter(XL + "si")]
    sh = ET.fromstring(z.read(f"xl/worksheets/sheet{names.index(sheet) + 1}.xml"))
    rows = []
    for row in sh.iter(XL + "row"):
        vals = []
        for c in row.iter(XL + "c"):
            v, t = c.find(XL + "v"), c.get("t")
            vals.append("" if v is None else (shared[int(v.text)] if t == "s" else v.text))
        rows.append(vals)
    return rows


def num(x):
    try: return float(x)
    except (TypeError, ValueError): return 0.0


def main():
    pages = wp_pages()
    (OUT / "wp-pages.json").write_text(json.dumps(pages, indent=1))

    gsc = []
    for r in xlsx_sheet("gsc-performance.xlsx", "Pages")[1:]:
        if r and r[0].startswith("http"):
            gsc.append({"url": r[0].replace("https://cleardaybaths.com", ""),
                        "clicks": num(r[1]), "impressions": num(r[2]), "position": num(r[4])})
    gsc.sort(key=lambda x: -x["impressions"])
    (OUT / "gsc-pages.json").write_text(json.dumps(gsc, indent=1))

    q = []
    for r in xlsx_sheet("gsc-performance.xlsx", "Queries")[1:]:
        if r and r[0]:
            q.append({"query": r[0], "clicks": num(r[1]),
                      "impressions": num(r[2]), "position": num(r[4])})
    q.sort(key=lambda x: -x["impressions"])
    (OUT / "gsc-queries.json").write_text(json.dumps(q, indent=1))

    pub = [p for p in pages if p["status"] == "publish"]
    print(f"wp-pages.json   {len(pages)} records "
          f"({len([p for p in pub if p['type']=='page'])} published pages, "
          f"{len([p for p in pub if p['type']=='post'])} published posts, "
          f"{len([p for p in pages if p['status']=='trash'])} trashed, "
          f"{len([p for p in pages if p['status']=='future'])} scheduled)")
    print(f"gsc-pages.json  {len(gsc)} indexed URLs")
    print(f"gsc-queries.json {len(q)} queries")


if __name__ == "__main__":
    main()
