#!/usr/bin/env python3
"""Assemble static HTML pages from source files and _includes partials."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / "_site"
INCLUDES = ROOT / "_includes"
INCLUDE_PATTERN = re.compile(r"\{%\s*include\s+([^%]+?)\s*%\}")
FRONT_MATTER_PATTERN = re.compile(r"\A---\r?\n.*?\r?\n---\r?\n", re.DOTALL)
COPY_DIRS = ("Assets", "CSS")
HTML_SOURCES = [ROOT / "index.html", *(ROOT / "p").glob("*.html")]


def strip_front_matter(text: str) -> str:
    return FRONT_MATTER_PATTERN.sub("", text, count=1)


def render_includes(text: str) -> str:
    def replace(match: re.Match[str]) -> str:
        include_name = match.group(1).strip()
        include_path = INCLUDES / include_name
        if not include_path.is_file():
            raise FileNotFoundError(f"Missing include: {include_path}")
        return include_path.read_text(encoding="utf-8")

    return INCLUDE_PATTERN.sub(replace, text)


def render_page(source: Path) -> str:
    return render_includes(strip_front_matter(source.read_text(encoding="utf-8")))


def build() -> None:
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir()

    for directory in COPY_DIRS:
        shutil.copytree(ROOT / directory, SITE / directory)

    for source in HTML_SOURCES:
        destination = SITE / source.relative_to(ROOT)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(render_page(source), encoding="utf-8")

    (SITE / ".nojekyll").touch()


if __name__ == "__main__":
    build()
