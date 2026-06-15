# Agent: Post-migration React Meta review (optional)

Invoke after **`/fw-react-migrate`** when the diff spans many files or surfaces.

## Checklist

1. **`fdk validate`**: target **0 platform + 0 lint** (delegate fixes to **fw-app-dev**).
2. **Manifest**: `metaConfig.framework` `react`; each `location.url` exists; `icon` paths exist.
3. **No orphaned** `app/scripts/*.js` referenced from HTML.
4. **Preserved**: `server/`, `oauth_config.json`, `requests.json` unless server-trim documented.
5. **Smoke test**: `fdk run`, `?dev=true`, `system_settings`, each surface.

## Escalation

- `platform-version` ≠ `3.0` → **fw-app-dev** `/fdk-migrate` first.
- Greenfield app → **fw-new-react-app**.
