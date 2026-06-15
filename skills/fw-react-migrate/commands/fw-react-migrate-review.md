---
name: fw-react-migrate-review
description: Post-migration review — fdk validate rounds and smoke-test checklist for React Meta apps.
globs: ["**/manifest.json"]
always: false
---

# /fw-react-migrate-review

## Step 1 — Determine app directory

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1.

## Step 2 — Confirm React Meta

- `"platform-version": "3.0"`
- `"metaConfig": { "framework": "react" }`

If missing `metaConfig`, stop — run **`/fw-react-migrate`** first.

## Step 3 — Validate (≥2 rounds)

Run logic from **`../fw-new-react-app/commands/fw-new-react-app-validate.md`**:

```bash
cd <app-directory>
fdk validate
```

Fix and re-run until **0 platform + 0 lint** (up to 6 iterations per round; at least 2 clean rounds after last fix).

## Step 4 — Migration checklist

- [ ] Every manifest `location.url` HTML has `{{{appclient}}}` and `#root`
- [ ] One JSX module entry per surface; no full-page router in sidebars
- [ ] No orphan `app/scripts/*.js` (deleted only after validate passed)
- [ ] `server/`, `oauth_config.json`, `requests.json` preserved unless server-trim documented
- [ ] Custom iparams: `window.getConfigs`, `window.validate`, `window.postConfigs` if used
- [ ] Sidebar entries: `instance.resize` + `app.activated` where applicable

## Step 5 — Report

```
[MIGRATION REVIEW] <path>/
Validation: 0 / 0 (rounds: N)
Path: full | light
Surfaces tested: ...
Risks: ...
Run: fdk run ?dev=true
```

Smoke-test each surface; subscribe modules at `http://localhost:10001/system_settings`.
