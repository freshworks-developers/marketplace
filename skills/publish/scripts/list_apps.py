#!/usr/bin/env python3
"""
List Marketplace apps for the developer JWT (same auth as publish):
  GET https://marketplace-us.freshworks.com/api/v2/apps?page=&per_page=

Default: AMP server-side filter only custom apps via query param type=custom
(not client-side filtering). Use --type all to omit type= from the URL.
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import urllib.parse
from typing import Any


def load_api_key() -> str:
    if os.environ.get("FRESHWORKS_API_KEY"):
        return os.environ["FRESHWORKS_API_KEY"]
    p = os.path.expanduser("~/.freshworks/publish-config.json")
    with open(p, encoding="utf-8") as f:
        d = json.load(f)
    for k in ("apiKey", "api_key", "token", "jwt"):
        v = d.get(k)
        if isinstance(v, str) and v.startswith("eyJ"):
            return v
    sys.exit("Set FRESHWORKS_API_KEY or apiKey in ~/.freshworks/publish-config.json")


def fetch_page(
    base: str, api_key: str, page: int, per: int, amp_type: str | None
) -> dict[str, Any]:
    params: dict[str, str | int] = {"page": page, "per_page": per}
    if amp_type:
        params["type"] = amp_type
    q = urllib.parse.urlencode(params)
    url = f"{base}/api/v2/apps?{q}"
    cmd = [
        "/usr/bin/curl",
        "-sS",
        url,
        "-H",
        f"Authorization: Bearer {api_key}",
        "-H",
        "accept: application/json",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(r.stderr or "curl failed")
    return json.loads(r.stdout)


def main() -> None:
    ap = argparse.ArgumentParser(description="List Marketplace apps (Developer Portal JWT)")
    ap.add_argument(
        "--type",
        default="custom",
        help='AMP query type= (default: custom). Use "all" to list every type.',
    )
    ap.add_argument("--per-page", type=int, default=50, dest="per_page")
    args = ap.parse_args()

    base = os.environ.get("AMP_BASE", "https://marketplace-us.freshworks.com")
    key = load_api_key()
    want = (args.type or "").strip().lower()
    if want == "all":
        want = ""
    amp_q_type = want or None

    rows: list[tuple[str, ...]] = []
    page = 1
    while page <= 50:
        data = fetch_page(base, key, page, args.per_page, amp_q_type)
        apps = data.get("apps") or []
        if not apps:
            break
        for a in apps:
            t = str(a.get("type") or "")
            if want and t.lower() != want:
                continue
            lv = a.get("latest_version") or {}
            st = a.get("state")
            if isinstance(st, list):
                st = ",".join(str(x) for x in st)
            rows.append(
                (
                    str(a.get("id", "")),
                    str(a.get("name", ""))[:40],
                    t,
                    str(st)[:32],
                    str(lv.get("version_number", "")),
                    str(lv.get("platform_version", "")),
                    str(lv.get("state", "")),
                )
            )
        links = data.get("links") or {}
        if not (links.get("next_page") or {}).get("href"):
            break
        page += 1

    label = want or "all types"
    qnote = f"AMP ?type={want}" if want else "AMP (no type filter)"
    print(
        f"Apps ({label}) — {qnote} — "
        "Bearer JWT from publish-config / FRESHWORKS_API_KEY"
    )
    print()
    print(f"{'id':>8}  {'name':<40}  {'type':<12}  {'app_state':<34}  {'ver':<6}  {'pv':<5}  ver_state")
    print("-" * 125)
    for t in rows:
        print(f"{t[0]:>8}  {t[1]:<40}  {t[2]:<12}  {t[3]:<34}  {t[4]:<6}  {t[5]:<5}  {t[6]}")
    print("-" * 125)
    print(f"Total matching: {len(rows)}")


if __name__ == "__main__":
    main()
