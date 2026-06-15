# Before/after: OAuth sidebar migrate (MG variant)

**Migration type:** Full migrate — single OAuth sidebar.

## When to use

Single `ticket_sidebar` with **OAuth** (e.g. Asana), `invokeTemplate` from frontend, iparams — vanilla `app/scripts/app.js` before migration.

## Before

- `app/index.html` + `app/scripts/app.js`
- OAuth provider config in `config/oauth_config.json`
- No `metaConfig`, no `package.json`

## After

- `app/sidebar.html` + `app/components/OAuthMain.jsx` + `OAuthApp.jsx`
- `metaConfig.framework: react`
- `config/oauth_config.json` + `config/iparams.json` **unchanged in semantics**
- `app/utils/oauth-api.js` wraps `invokeTemplate`
- Vitest for API helpers

## Steps

1. Add `metaConfig`, `package.json`, Vitest toolchain.
2. Create `OAuthMain.jsx`: init → resize → `app.activated` (see [../patterns/vanilla-to-meta-entry.md](../patterns/vanilla-to-meta-entry.md)).
3. Move task-fetch UI to React; keep `client.request.invokeTemplate` in utils.
4. Delete `app/scripts/app.js` after validate 0/0.

## Pitfalls

- Do not rewrite OAuth config or account linking — **fw-app-dev** owns OAuth depth.
- Preserve `options.account` on OAuth template calls if used.

## Acceptance

- OAuth flow still works after migrate.
- Sidebar resizes on activate.
- `fdk validate` 0/0.
