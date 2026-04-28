#!/usr/bin/env python3
"""
Verify relative markdown links to repo files (no network).
Fails with non-zero exit if a target is missing.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK_PATTERN = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
CODE_FENCE = re.compile(r"^```[^\n]*$.*?^```$", re.MULTILINE | re.DOTALL)


def is_plausible_file_target(path_part: str) -> bool:
    if not path_part:
        return False
    if path_part.startswith(("#", "/", "http://", "https://", "mailto:")):
        return False
    # Skip regex-like artifacts that use ]( in documentation
    if any(c in path_part for c in "*?${}[]^|"):
        return False
    return True


def main() -> int:
    missing: list[tuple[Path, str, Path]] = []
    scanned = 0
    for md in sorted(ROOT.rglob("*.md")):
        if "/.git/" in str(md) or "node_modules" in md.parts:
            continue
        try:
            md.relative_to(ROOT)
        except ValueError:
            continue
        text = md.read_text(encoding="utf-8", errors="replace")
        text = CODE_FENCE.sub("", text)
        for m in LINK_PATTERN.finditer(text):
            raw = m.group(1).strip()
            if raw.startswith(("#", "http://", "https://", "mailto:")):
                continue
            path_part = raw.split("#", 1)[0].split("?", 1)[0]
            # Skip inline artifacts (e.g. regex shrapnel) mistaken for relative links
            if "/" not in path_part and "." not in path_part:
                continue
            if not path_part or path_part.startswith("/"):
                continue
            if not is_plausible_file_target(path_part):
                continue
            target = (md.parent / path_part).resolve()
            try:
                target.relative_to(ROOT)
            except ValueError:
                continue
            scanned += 1
            if not target.exists():
                missing.append((md, path_part, target))

    if missing:
        print("Broken internal markdown links:", file=sys.stderr)
        for src, fragment, tgt in missing:
            print(f"  {src.relative_to(ROOT)} → {fragment} (expected {tgt.relative_to(ROOT)})", file=sys.stderr)
        return 1
    print(f"Internal link check passed ({scanned} relative file links examined).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
