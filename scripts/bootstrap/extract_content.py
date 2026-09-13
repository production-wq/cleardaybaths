"""
Pulls readable content out of the WordPress export.

Elementor stores layout as JSON in postmeta and leaves content:encoded full of
shortcodes and builder markup, so this strips to clean prose. Legal pages are
preserved closely (they are legal text); everything else is reference material
for rewriting, per the migration brief.

Emits data/blog-posts.json and data/legal-pages.json.
"""
import html, json, re
from pathlib import Path

D = Path(__file__).resolve().parents[2] / "data"
pages = json.loads((D / "wp-pages.json").read_text())

BLOCK = re.compile(r"</(p|div|h[1-6]|li|tr|section|article)>", re.I)
TAG = re.compile(r"<[^>]+>")
SHORTCODE = re.compile(r"\[/?[a-z0-9_-]+[^\]]*\]", re.I)


def clean(raw: str) -> list[str]:
    s = SHORTCODE.sub(" ", raw or "")
    s = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", s, flags=re.S | re.I)
    s = BLOCK.sub("\n\n", s)
    s = re.sub(r"<br\s*/?>", "\n", s, flags=re.I)
    s = TAG.sub(" ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t\xa0]+", " ", s)
    paras = [p.strip() for p in s.split("\n\n")]
    # Drop builder residue and nav crumbs.
    out = []
    for p in paras:
        p = re.sub(r"\s+", " ", p).strip()
        if len(p) < 40:
            continue
        if re.search(r"^(CALL TODAY|GET A FREE|Home »|Skip to)", p, re.I):
            continue
        if p.count("{") > 2 or p.count('":') > 2:
            continue
        if p not in out:
            out.append(p)
    return out


posts = []
for p in pages:
    if p["type"] != "post" or p["status"] not in ("publish", "future"):
        continue
    body = clean(p["content"])
    posts.append({
        "slug": p["path"].strip("/").split("/")[-1],
        "path": p["path"],
        "title": html.unescape(p["title"]),
        "date": p["date"],
        "status": p["status"],
        "seoTitle": html.unescape(p["seo"].get("title", "")),
        "seoDesc": html.unescape(p["seo"].get("metadesc", "")),
        "excerpt": (body[0][:300] if body else ""),
        "body": body,
        "words": sum(len(b.split()) for b in body),
    })
posts.sort(key=lambda x: x["date"], reverse=True)
(D / "blog-posts.json").write_text(json.dumps(posts, indent=1))

legal = {}
for slug in ("privacy-policy", "terms-and-conditions"):
    hit = next((p for p in pages if p["clean_path"] == f"/{slug}/" and p["status"] == "publish"), None)
    if hit:
        legal[slug] = {"title": html.unescape(hit["title"]), "body": clean(hit["content"])}
(D / "legal-pages.json").write_text(json.dumps(legal, indent=1))

print(f"blog-posts.json   {len(posts)} posts, {sum(p['words'] for p in posts):,} words total")
thin = [p['slug'] for p in posts if p['words'] < 120]
print(f"  thin (<120 words): {len(thin)}")
for s in thin[:6]:
    print(f"     {s}")
print(f"legal-pages.json  {list(legal)} "
      f"({', '.join(str(sum(len(b.split()) for b in v['body'])) + ' words' for v in legal.values())})")
