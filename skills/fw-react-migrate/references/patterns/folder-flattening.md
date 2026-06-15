# Pattern: Nested product-samples → root flattening

## When to use

- Repo contains a nested app folder (e.g. `nested-app-folder/`) with its own `manifest.json`, `app/`, `config/`.
- MG-6: flatten nested product folder → repo root before React Meta migration.
- Common in marketplace samples that bundled multiple demos in one git repo.

## Steps

1. **Identify the canonical app** — the nested folder with a valid `manifest.json` and `platform-version: "3.0"`.
2. **Move to FDK root layout**:

```
BEFORE                          AFTER
repo/                           repo/
  nested-app-folder/             app/
    app/                          config/
    config/                       manifest.json
    manifest.json                 package.json
  README.md                       README.md
```

3. **Move assets** — `app/`, `config/`, `manifest.json`, `server/` (if any) to repo root.
4. **Merge or replace** root `README.md` — document the single app, remove nested-folder install steps.
5. **Update paths** — manifest `icon` paths, `requests.json` template paths, README screenshots.
6. **Delete nested folder** — remove `nested-app-folder/` entirely after validate.
7. **Then migrate** — run vanilla → React Meta on the flattened layout (do not migrate inside nested folder).

## What to preserve vs delete

| Preserve | Delete after flatten |
|----------|---------------------|
| `config/iparams.json`, `oauth_config.json` | Nested `manifest.json` duplicate |
| `config/requests.json` (merge if root also has one) | Nested `package.json` / `node_modules` |
| Business logic in `app/scripts/` (until JSX replaces it) | Nested `.gitignore` conflicts |
| `server/` if events/SMI exist | Stale nested README |

## Pitfalls

- **Two manifests** — FDK reads root `manifest.json` only; nested copy causes confusion.
- **Relative path breaks** — `icon: "styles/images/icon.svg"` must resolve from new `app/` root.
- **Git history** — use `git mv` when possible to preserve blame.
- **Flattening after React migration** — do flatten first; JSX paths assume standard layout.
- **Leaving orphan scripts** — delete nested `app/scripts/` only after root entries work.

## Quick audit

```bash
# Should return exactly one manifest
find . -name manifest.json -not -path './node_modules/*'

# Should show app/ at repo root
ls app/ config/ manifest.json
```

## Reference layout change

Typical flatten: move `{nested-app/config => config}`, `nested-app/manifest.json => manifest.json`, add React components at `app/components/`, remove entire nested folder tree.
