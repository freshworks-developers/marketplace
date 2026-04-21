# AMP modular upload (technical)

Single flow: **`POST`** or **`PATCH`** `https://marketplace-us.freshworks.com/api/v2/collections/modularApps` with **multipart/form-data** and `Authorization: Bearer <JWT>`.

Override host with env **`AMP_BASE`** (default US marketplace host).

## `publish.sh` before `amp_upload.py`

The shell wrapper performs **read-only `curl`** checks so agents and humans do not need a separate manual step:

| Step | Request | On success | On failure |
|------|---------|------------|------------|
| Preflight (default) | `GET …/api/v2/apps?per_page=1&page=1&type=custom` | Continue to `fdk validate` / pack | **401** → exit with message to rotate JWT; other codes → exit |
| Stale `app[id]` | If `.fdk/app-info.json` has `id`: `GET …/api/v2/apps/{id}` | **200** → PATCH path | **404** → remove `id` from JSON file, **POST create**; **401** → exit |

Disable preflight only when needed: **`publish.sh --no-preflight`**.

## Implementation reference

**`skills/publish/scripts/amp_upload.py`** in this repository defines the multipart field names and request order. Prefer reading the script (and this page) over third-party snippets when debugging AMP rejections.

## Operations (what `amp_upload.py` does)

| Step | Method | Body | Purpose |
|------|--------|------|---------|
| Create app + first version | `POST` | multipart + `version[zip_file]` | New custom app on the developer account. |
| New version / metadata refresh | `PATCH` | multipart + zip | Uses `app[id]` from prior `GET /api/v2/apps/{id}`. |
| Move version to test | `PATCH` | form fields only, no file | `version[state]=test` (+ `app[id]`, `version[id]`, `app[products][]`). Skipped when **`--no-move-to-test`** / **`publish.sh --target=dev`**. |

**Fetch before update:** `GET {AMP_BASE}/api/v2/apps/{app_id}` to read `locale.texts`, `products`, and `latest_version.id` for PATCH.

## Create (`POST`) field checklist

- `app[publisher][support_email]`, `app[publisher][alternate_email]`
- `app[locales][0][code]=en`
- `app[locales][0][texts][display_name|description|overview]`
- `app[type]=custom`, `app[subscription_type]=free`
- `version[auto_updatable]=false`, `version[platform_version]` from manifest
- `app[products][i]` from manifest modules (see `MODULE_TO_PRODUCT` in script)
- `version[modules][i]` = each key under `manifest.modules`
- `app[built_with]`, `app[developed_with][0]` (tracking)
- File: **`version[zip_file]`** — curl must send **`;type=application/zip`** or AMP may reject with 400.

## Update (`PATCH`) with zip

- `app[id]`, `version[platform_version]`, locale texts (prefer existing AMP locale), `app[products][]`, `version[modules][]`, `app[developed_with][0]`, `version[zip_file]`.

## Test vs dev (non-production)

| Mode | Script flag | AMP |
|------|-------------|-----|
| **Test** | `--target=test` (default) | After successful upload response, second PATCH sets **`version[state]=test`**. Suitable for installing in a sandbox account. |
| **Dev** | `--target=dev` or `--no-move-to-test` | No second PATCH; version state is whatever AMP returns after the zip upload (often not yet “test”). |

This skill is **not** marketplace public listing or production customer distribution.

## Persistence

On success, **`amp_upload.py`** writes **`.fdk/app-info.json`** under the app dir (`id`, `version`, `lastPublished`) so the next run uses **`--app-id`** (via `publish.sh` reading that file).

## Common failures

- **401** — Expired or wrong JWT; rotate in Developer Portal.
- **400** on zip — Missing `Content-Type: application/zip` on the file part; fixed in `curl_form`.
- **422 / validation** — Products vs modules mismatch; extend **`MODULE_TO_PRODUCT`** or fix `manifest.json` modules.
- **Missing `.report.json`** — `fdk pack` may need `fdk test` first, or use pack flags as in `publish.sh`.

## Security

- Do not log full AMP JSON if it contains presigned URLs.
- Obfuscate secrets in examples; use `your-api-key-here` in docs.
