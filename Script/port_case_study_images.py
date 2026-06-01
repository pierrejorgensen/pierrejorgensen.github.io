#!/usr/bin/env python3
"""Download case study images at highest Blogger resolution and update HTML."""

import html as html_module
import re
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGES = [
    "work-information-architecture",
    "work-one-product-detail-feature",
    "work-machine-learningai-project",
    "work-fitness-tracking-application",
]


def size_key(url: str) -> int:
    m = re.search(r"/s(\d+)(?:/|$)", url)
    return int(m.group(1)) if m else 0


def best_url(img_src, link_href=None):
    candidates = [u for u in (img_src, link_href) if u]
    return max(candidates, key=size_key)


def filename_from_url(url: str) -> str:
    path = urllib.parse.urlparse(url).path
    name = urllib.parse.unquote(path.split("/")[-1])
    name = re.sub(r"[^\w.\-]+", "-", name).strip("-")
    return name or "image.png"


def strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s)
    s = html_module.unescape(re.sub(r"\s+", " ", s)).strip()
    return s


def extract_main(html: str) -> str:
    m = re.search(r"<main>(.*)</main>", html, re.DOTALL | re.I)
    return m.group(1) if m else html


def collect_images(main):
    images = []
    for img_m in re.finditer(r"<img([^>]+)>", main):
        attrs = img_m.group(1)
        src_m = re.search(r'src="([^"]+)"', attrs)
        if not src_m:
            continue
        img_src = src_m.group(1)
        alt_m = re.search(r'alt="([^"]*)"', attrs)
        existing_alt = html_module.unescape(alt_m.group(1)).strip() if alt_m else ""

        before = main[max(0, img_m.start() - 800) : img_m.start()]
        link_matches = list(re.finditer(r'<a\s+href="([^"]+)"', before))
        link_href = link_matches[-1].group(1) if link_matches else None
        if link_href and "googleusercontent.com" not in link_href:
            link_href = None

        after = main[img_m.end() : img_m.end() + 1200]
        cap_m = re.search(
            r'<span class="image-caption"[^>]*>(.*?)</span>', after, re.DOTALL | re.I
        )
        caption = strip_tags(cap_m.group(1)) if cap_m else ""

        before_h = list(re.finditer(r"<h3[^>]*>(.*?)</h3>", before, re.DOTALL | re.I))
        section = strip_tags(before_h[-1].group(1)) if before_h else ""

        download_url = best_url(img_src, link_href)
        images.append(
            {
                "img_src": img_src,
                "link_href": link_href,
                "download_url": download_url,
                "existing_alt": existing_alt,
                "caption": caption,
                "section": section,
                "full_match": img_m.group(0),
            }
        )
    return images


def build_alt(info):
    if info["existing_alt"]:
        return info["existing_alt"]
    if info["caption"]:
        cap = info["caption"]
        if len(cap) > 200:
            cap = cap.split(".")[0].strip() + "."
        return cap
    if info["section"]:
        name = filename_from_url(info["download_url"]).rsplit(".", 1)[0].replace("-", " ")
        return f"{info['section']}: {name}"
    name = filename_from_url(info["download_url"]).rsplit(".", 1)[0].replace("-", " ")
    return f"Screenshot: {name}"


def download(url, dest):
    dest.parent.mkdir(parents=True, exist_ok=True)
    if dest.exists() and dest.stat().st_size > 0:
        return
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as resp:
        dest.write_bytes(resp.read())


def process_page(slug):
    page_path = ROOT / "p" / f"{slug}.html"
    html = page_path.read_text(encoding="utf-8")
    main = extract_main(html)
    images = collect_images(main)

    url_to_local = {}
    for info in images:
        url = info["download_url"]
        if url not in url_to_local:
            fname = filename_from_url(url)
            dest = ROOT / "Assets" / slug / fname
            print(f"  download {fname} (s{size_key(url)})")
            download(url, dest)
            url_to_local[url] = f"/Assets/{slug}/{fname}"

    for info in images:
        alt = build_alt(info)
        alt_attr = html_module.escape(alt, quote=True)
        local = url_to_local[info["download_url"]]

        old_img_src = info["img_src"]
        new_img_tag = re.sub(
            r'src="[^"]*"',
            f'src="{local}"',
            info["full_match"],
        )
        if re.search(r'alt="', new_img_tag):
            new_img_tag = re.sub(r'alt="[^"]*"', f'alt="{alt_attr}"', new_img_tag)
        else:
            new_img_tag = new_img_tag.replace("<img", f'<img alt="{alt_attr}"', 1)

        html = html.replace(info["full_match"], new_img_tag, 1)

        if info["link_href"]:
            html = html.replace(
                f'href="{info["link_href"]}"',
                f'href="{local}"',
                1,
            )
        if old_img_src != info["download_url"] and old_img_src in html:
            html = html.replace(old_img_src, local)

    page_path.write_text(html, encoding="utf-8")
    print(f"updated {page_path.name} ({len(images)} images)")


def main():
    for slug in PAGES:
        print(f"\n=== {slug} ===")
        process_page(slug)


if __name__ == "__main__":
    main()
