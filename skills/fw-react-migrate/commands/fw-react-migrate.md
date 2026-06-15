---
name: fw-react-migrate
description: Migrate a Platform 3.0 vanilla or pre-meta frontend to React Meta.
globs: ["**/manifest.json", "**/app/**/*.js", "**/app/**/*.html"]
always: false
---

# /fw-react-migrate

## Step 1 — Determine app directory

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1.

## Step 2 — Toolchain + platform gate

- Node **24.x** + FDK **10.x** → else **`fw-setup`**.
- `platform-version` ≠ **`3.0`** → stop; **`/fdk-migrate`** first.

## Step 3 — Classify before state

| Signal | Path |
|--------|------|
| JSX/components, no `metaConfig` | Light → [../references/before-after/pre-meta-light-path.md](../references/before-after/pre-meta-light-path.md) |
| OAuth sidebar + invokeTemplate | [../references/before-after/oauth-sidebar-migrate.md](../references/before-after/oauth-sidebar-migrate.md) |
| Nested `product-samples/` or other nested app folder | [../references/patterns/folder-flattening.md](../references/patterns/folder-flattening.md) then full migrate |
| `app/scripts/*.js` or crayons CDN in HTML | Full migrate |

## Step 4 — Execute checklist

Open **SKILL.md** and **rules/fw-react-migrate.mdc**. In order:

backup → toolchain → `metaConfig` → icons → per-surface HTML + `*Main.jsx` ([vanilla-to-meta-entry.md](../references/patterns/vanilla-to-meta-entry.md)) → utils + tests → iparams if needed → cleanup → validate.

**Do not delete** `app/scripts/*` until **`fdk validate`** is 0/0.

Server/OAuth/request fixes → **fw-app-dev**.

## Step 5 — Report

```
[MIGRATED] <path>/
Validation: 0 platform, 0 lint
Path: full | light
Deleted: app/scripts/... (list)
Preserved: server/, oauth_config.json, requests.json
Run: fdk run → ?dev=true
Subscribe: http://localhost:10001/system_settings
```

Smoke-test **each** surface.
