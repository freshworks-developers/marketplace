---
name: freshworks-publish-skill
description: "Upload any Freshworks Platform 3.0 custom app to AMP (US): FDK validate/pack, multipart POST/PATCH to collections/modularApps, then optional move to test. Use when the user wants to push an app to the Marketplace backend for QA (test) or upload-only (dev), AMP upload, Developer Portal JWT, fdk pack, .fdk/app-info.json, or modularApps API. Pair with app-dev for manifest or module fixes. Not for generic non-AMP deploys unless explicitly tied to this flow."
---

# AMP upload (any custom app → test or dev)

**Goal:** Take **any** Platform **3.0** app folder (with `manifest.json`), produce `dist/*.zip`, and upload it to **AMP** using the multipart contract implemented in this repo. **Non-production:** either promote the new version to **test** (default) or leave it in **dev** mode (no second PATCH).

## Multipart contract

**`scripts/amp_upload.py`** is the **source of truth** for field names and sequence (`version[zip_file]` with `type=application/zip`, `app[locales][0][texts][*]`, `app[publisher][support_email]`, `version[modules][]`, `version[platform_version]`, `app[products][]`, tracking fields, etc.). Read and follow **`amp_upload.py`** and **[references/amp-modular-upload.md](./references/amp-modular-upload.md)**—do not invent multipart keys from ad hoc examples.

## One command

```bash
# JWT: export FRESHWORKS_API_KEY=eyJ…  OR  ~/.freshworks/publish-config.json → apiKey
./skills/publish/scripts/publish.sh /absolute/path/to/app-dir \
  --support-email=you@your-domain.freshdesk.com
```

### What `publish.sh` does first (clean AMP path)

These steps are **built in**—no manual curl unless you are debugging.

1. **JWT preflight (default):** `curl` **`GET ${AMP_BASE}/api/v2/apps?per_page=1&page=1&type=custom`** with `Authorization: Bearer …`. **HTTP 200** required before `fdk validate` / pack (fail fast on **401**). Skip with **`--no-preflight`** (e.g. minimal CI).
2. **Stale app id repair:** If **`.fdk/app-info.json`** contains an **`id`** but **`GET …/api/v2/apps/{id}`** returns **404** (e.g. new API key = different developer account), the script **removes `id`** from that file and continues with **POST create** instead of PATCH.
3. **Upload:** **`amp_upload.py`** → multipart modularApps, then optional move-to-test.

**Default `target=test`:** after POST (new app) or PATCH (new version), a follow-up PATCH sets `version[state]=test` so the build is installable for QA in the product.

**`target=dev`:** upload the zip only; **skip** move-to-test (same as `--no-move-to-test`). Use when you only need the package on AMP or want AMP’s default post-upload state.

```bash
./skills/publish/scripts/publish.sh /path/to/app --target=dev
```

Other useful flags: `--pack-only` (no AMP), `--force-pack`, `--skip-validate`, **`--no-preflight`**, `--name=`, `--description=`, `--support-email=` (or `supportEmail` in config).

## Preconditions

| Requirement | Notes |
|-------------|--------|
| `manifest.json` | App root; modules drive `app[products][]` via `amp_upload.py` mapping. |
| `fdk` on PATH | `fdk validate` + `fdk pack --skip-coverage --skip-lint` (script may reuse existing `dist/*.zip`). |
| Developer Portal JWT | `FRESHWORKS_API_KEY` or `apiKey` in `~/.freshworks/publish-config.json`. Never ask users to paste JWT into chat for routine automation. |
| Support email | Required for **create**; updates reuse publisher/locale from AMP + fallbacks. Config key `supportEmail` supported. |
| App identity for updates | `.fdk/app-info.json` with `id` after first successful publish; otherwise first run creates a new AMP app. If `id` is **404** on this account, `publish.sh` clears it automatically. |

## Agent playbook

1. Resolve **`APP_DIR`** (absolute path to folder containing `manifest.json`).
2. Choose **test** vs **dev** from user intent; map to `publish.sh` **`--target`** (default test).
3. Run **`publish.sh`** (preflight + stale-id repair are automatic). Stream or summarize stderr; **do not** paste presigned S3 URLs from AMP JSON into tickets or chat.
4. On **401** (including preflight), rotate the Developer Portal API key in config; on **400**, compare manifest modules to **`MODULE_TO_PRODUCT`** in **`amp_upload.py`** or use **app-dev** skill.
5. Tell the user: **app id**, **version state**, and where to install **custom** apps in their product (**Admin → Apps** / equivalent for their Freshworks product).

## Optional: list apps on the account

```bash
./skills/publish/scripts/list-apps.sh
```

Uses `GET …/api/v2/apps?type=custom` (server-side filter on AMP).

## Deeper reference

Technical detail, endpoints, and troubleshooting: **[references/amp-modular-upload.md](./references/amp-modular-upload.md)**

## Links

- Developer Portal (API key): [developers.freshworks.com/developer/](https://developers.freshworks.com/developer/)
- AMP v2 overview (public): [api.freshworks.com/marketplace/v2](https://api.freshworks.com/marketplace/v2)
