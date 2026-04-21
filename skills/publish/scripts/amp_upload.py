#!/usr/bin/env python3
"""
AMP modularApps upload: POST/PATCH …/api/v2/collections/modularApps
with multipart/form-data (field names and order defined in this module).

Uses curl for multipart (stable boundary handling).
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

AMP_BASE_DEFAULT = "https://marketplace-us.freshworks.com"

MODULE_TO_PRODUCT = {
    "support_ticket": "freshdesk",
    "support_contact": "freshdesk",
    "support_account": "freshdesk",
    "crm_contact": "freshsales",
    "crm_account": "freshsales",
    "crm_deal": "freshsales",
    "itsm_ticket": "freshservice",
    "itsm_change": "freshservice",
    "itsm_release": "freshservice",
    "itsm_problem": "freshservice",
    "itsm_asset": "freshservice",
    "messaging_conversation": "freshchat",
}


def load_json(path: Path) -> dict[str, Any]:
    with path.open(encoding="utf-8") as f:
        return json.load(f)


def manifest_modules(manifest: dict[str, Any]) -> list[str]:
    mods = manifest.get("modules") or {}
    if not isinstance(mods, dict):
        return []
    # Match AmpHelper.getAppModules: all keys including "common"
    return list(mods.keys())


def infer_products(modules: list[str]) -> list[str]:
    seen: set[str] = set()
    out: list[str] = []
    for k in modules:
        p = MODULE_TO_PRODUCT.get(k)
        if p and p not in seen:
            seen.add(p)
            out.append(p)
    return out


def curl_form(
    method: str,
    url: str,
    api_key: str,
    fields: list[tuple[str, str]],
    file_fields: list[tuple[str, str]],
) -> tuple[int, str]:
    """Run curl multipart. Returns (http_code, response_body)."""
    with tempfile.NamedTemporaryFile(
        mode="w+", suffix=".body", delete=False, encoding="utf-8"
    ) as tmp:
        out_path = tmp.name
    try:
        cmd: list[str] = [
            "curl",
            "-sS",
            "-X",
            method,
            url,
            "-H",
            f"Authorization: Bearer {api_key}",
            "-o",
            out_path,
            "-w",
            "%{http_code}",
        ]
        for k, v in fields:
            # --form-string avoids @ / & surprises in text fields (curl manual).
            cmd.extend(["--form-string", f"{k}={v}"])
        for k, path in file_fields:
            # AMP schema validates zip part mimetype (curl default can be application/octet-stream).
            cmd.extend(["-F", f"{k}=@{path};type=application/zip"])
        r = subprocess.run(cmd, capture_output=True)
        if r.returncode != 0:
            err = (r.stderr or r.stdout or b"").decode("utf-8", errors="replace")
            raise SystemExit(f"curl failed ({r.returncode}): {err}")
        code_s = (r.stdout or b"").decode("utf-8", errors="replace").strip()
        code = int(code_s) if code_s.isdigit() else 0
        body = Path(out_path).read_text(encoding="utf-8", errors="replace")
        return code, body
    finally:
        try:
            os.unlink(out_path)
        except OSError:
            pass


def get_app(amp_base: str, api_key: str, app_id: str) -> dict[str, Any]:
    url = f"{amp_base}/api/v2/apps/{app_id}"
    cmd = [
        "curl",
        "-sS",
        url,
        "-H",
        f"Authorization: Bearer {api_key}",
        "-H",
        "accept: application/json",
    ]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode != 0:
        raise SystemExit(
            (r.stderr or b"").decode("utf-8", errors="replace") or "GET app curl failed"
        )
    out = r.stdout.decode("utf-8", errors="replace")
    try:
        data = json.loads(out)
    except json.JSONDecodeError as e:
        raise SystemExit(
            f"GET app {app_id}: expected JSON (check API key / app id). Body starts: {out[:200]!r}"
        ) from e
    if not isinstance(data, dict) or not data.get("id"):
        raise SystemExit(f"GET app failed or invalid JSON for id={app_id}")
    return data


def post_create(
    amp_base: str,
    api_key: str,
    zip_path: Path,
    manifest: dict[str, Any],
    display_name: str,
    description: str,
    overview: str,
    support_email: str,
    alternate_email: str,
) -> tuple[int, str]:
    modules = manifest_modules(manifest)
    products = infer_products(modules)
    if not products:
        raise SystemExit(
            "No marketplace products inferred from manifest modules. "
            "Add a product module (e.g. support_ticket) or extend MODULE_TO_PRODUCT in amp_upload.py."
        )
    pv = str(manifest.get("platform-version") or "3.0")

    fields: list[tuple[str, str]] = [
        ("app[publisher][support_email]", support_email),
        ("app[publisher][alternate_email]", alternate_email),
        ("app[locales][0][code]", "en"),
        ("app[locales][0][texts][display_name]", display_name),
        ("app[locales][0][texts][description]", description),
        ("app[locales][0][texts][overview]", overview),
        ("app[type]", "custom"),
        ("app[subscription_type]", "free"),
        ("version[auto_updatable]", "false"),
        ("version[platform_version]", pv),
        ("app[built_with]", "developer_copilot"),
        ("app[developed_with][0]", "developer_copilot"),
    ]
    for i, p in enumerate(products):
        fields.append((f"app[products][{i}]", p))
    for i, mod in enumerate(modules):
        fields.append((f"version[modules][{i}]", mod))

    url = f"{amp_base}/api/v2/collections/modularApps"
    file_fields = [("version[zip_file]", str(zip_path))]
    return curl_form("POST", url, api_key, fields, file_fields)


def patch_update(
    amp_base: str,
    api_key: str,
    zip_path: Path,
    manifest: dict[str, Any],
    current: dict[str, Any],
    fallback_display: str,
    fallback_description: str,
    fallback_overview: str,
) -> tuple[int, str]:
    """generateUpdateAppRequestData (Platform 3.x path)."""
    modules = manifest_modules(manifest)
    products = infer_products(modules)
    if not products:
        raise SystemExit("No products for update; check manifest modules.")
    pv = str(manifest.get("platform-version") or "3.0")
    loc = current.get("locale") or {}
    texts = (loc.get("texts") if isinstance(loc, dict) else {}) or {}
    display_name = str(
        texts.get("display_name") or current.get("name") or fallback_display or "App"
    )
    description = str(texts.get("description") or fallback_description or "")
    overview = str(texts.get("overview") or fallback_overview or description)

    prods = current.get("products")
    if isinstance(prods, list) and prods:
        products = [str(x) for x in prods]

    fields: list[tuple[str, str]] = [
        ("app[id]", str(current["id"])),
        ("version[platform_version]", pv),
        ("app[locales][0][code]", "en"),
        ("app[locales][0][texts][display_name]", display_name),
        ("app[locales][0][texts][description]", description),
        ("app[locales][0][texts][overview]", overview),
        ("app[developed_with][0]", "developer_copilot"),
    ]
    for i, p in enumerate(products):
        fields.append((f"app[products][{i}]", p))
    for i, mod in enumerate(modules):
        fields.append((f"version[modules][{i}]", mod))

    url = f"{amp_base}/api/v2/collections/modularApps"
    file_fields = [("version[zip_file]", str(zip_path))]
    return curl_form("PATCH", url, api_key, fields, file_fields)


def patch_move_to_test(
    amp_base: str,
    api_key: str,
    app_data: dict[str, Any],
    manifest: dict[str, Any],
) -> tuple[int, str]:
    """generateVersionUpdateRequestData (Platform 3.x)."""
    app_id = str(app_data.get("id") or "")
    lv = app_data.get("latest_version") or {}
    vid = str(lv.get("id") or "")
    if not app_id or not vid:
        print(
            "Skipping move-to-test: response missing id or latest_version.id",
            file=sys.stderr,
        )
        return 200, "{}"
    products = app_data.get("products") or []
    if not isinstance(products, list):
        products = []
    products = [str(x) for x in products if x]
    if not products:
        products = infer_products(manifest_modules(manifest))
    fields: list[tuple[str, str]] = [
        ("app[id]", app_id),
        ("version[id]", vid),
        ("version[state]", "test"),
    ]
    for i, p in enumerate(products):
        fields.append((f"app[products][{i}]", str(p)))
    url = f"{amp_base}/api/v2/collections/modularApps"
    return curl_form("PATCH", url, api_key, fields, [])


def write_app_info(app_dir: Path, body: str) -> None:
    try:
        d = json.loads(body)
    except json.JSONDecodeError:
        return
    aid = d.get("id")
    if aid is None:
        return
    ver = d.get("version")
    if isinstance(ver, dict):
        ver = ver.get("version") or ver.get("id")
    p = app_dir / ".fdk" / "app-info.json"
    p.parent.mkdir(parents=True, mode=0o700, exist_ok=True)
    from datetime import datetime, timezone

    payload = {
        "id": aid,
        "version": ver,
        "lastPublished": datetime.now(timezone.utc)
        .isoformat()
        .replace("+00:00", "Z"),
    }
    p.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {p}", file=sys.stderr)


def main() -> None:
    ap = argparse.ArgumentParser(description="AMP modularApps multipart upload")
    ap.add_argument("app_dir", type=Path, help="App root with manifest.json")
    ap.add_argument("zip_path", type=Path)
    ap.add_argument("--api-key", required=True)
    ap.add_argument("--support-email", required=True)
    ap.add_argument("--alternate-email", default="")
    ap.add_argument("--display-name", required=True)
    ap.add_argument("--description", required=True)
    ap.add_argument("--overview", default="")
    ap.add_argument("--app-id", default="", help="If set, PATCH update instead of POST create")
    ap.add_argument(
        "--no-move-to-test",
        action="store_true",
        help="Skip second PATCH to move version to test state",
    )
    args = ap.parse_args()
    overview = args.overview or args.description
    alt = args.alternate_email or args.support_email

    manifest = load_json(args.app_dir / "manifest.json")
    amp_base = os.environ.get("AMP_BASE", AMP_BASE_DEFAULT)

    if args.app_id:
        current = get_app(amp_base, args.api_key, args.app_id)
        code, body = patch_update(
            amp_base,
            args.api_key,
            args.zip_path,
            manifest,
            current,
            args.display_name,
            args.description,
            overview,
        )
    else:
        code, body = post_create(
            amp_base,
            args.api_key,
            args.zip_path,
            manifest,
            args.display_name,
            args.description,
            overview,
            args.support_email,
            alt,
        )

    print(body)
    if not str(code).startswith("2"):
        raise SystemExit(f"AMP HTTP {code}")

    try:
        resp = json.loads(body)
    except json.JSONDecodeError:
        resp = {}

    if not args.no_move_to_test and isinstance(resp, dict) and resp.get("id"):
        c2, b2 = patch_move_to_test(amp_base, args.api_key, resp, manifest)
        print(b2, file=sys.stderr)
        if not str(c2).startswith("2"):
            raise SystemExit(f"move-to-test AMP HTTP {c2}")

    write_app_info(args.app_dir, body)


if __name__ == "__main__":
    main()
