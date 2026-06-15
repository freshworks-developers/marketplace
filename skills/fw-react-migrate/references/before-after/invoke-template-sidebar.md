# Before/After: invokeTemplate sidebar (MG-1)

**Migration type:** Full vanilla → React Meta, single sidebar with frontend `invokeTemplate`.

## Before

```
nested-app-folder/              # optional non-standard layout
  app/scripts/app.js          # IIFE, DOM + invokeTemplate
  app/index.html              # crayons CDN, inline script
  config/requests.json
  manifest.json
```

- Crayons loaded via CDN in HTML.
- Third-party API calls inline in `app.js`.
- Nested product folder (non-standard layout) in some repos.
- No `package.json`, no tests, no `metaConfig`.

## After

```
app/
  sidebar.html                # thin shell → SidebarMain.jsx
  components/
    SidebarMain.jsx           # init + resize + app.activated
    SidebarApp.jsx            # UI + state
    CustomerPanel.jsx, OrdersPanel.jsx, ...
  utils/
    api-client.js             # invokeTemplate helpers
    validation.js
config/requests.json          # UNCHANGED semantics
manifest.json                 # metaConfig + ticket_sidebar → sidebar.html
package.json, vitest.config.js
tests/api-client.test.js
```

## Agent actions (ordered)

1. Flatten nested app folder to repo root if present (see `folder-flattening.md`).
2. Add `metaConfig.framework: "react"`, `package.json`, `.babelrc`.
3. Create `sidebar.html` + `SidebarMain.jsx` bootstrap.
4. Extract API/formatting → `app/utils/api-client.js`.
5. Add Vitest tests with mocked `client.request.invokeTemplate`.
6. Delete `app/scripts/app.js` after `fdk validate`.

## Preserved (do not rewrite)

- `config/requests.json` template keys and `<%= %>` syntax.
- `config/iparams.json` secure credential fields.
- All `modules.common.requests` keys in manifest.

## Pitfalls

- Renaming request template keys — breaks `invokeTemplate` calls.
- Removing resize on sidebar — tall UI clips below fold (use ~720px height).
- Migrating inside nested folder — flatten first.

## Validate

```bash
fdk validate
npm run fdk-unit-test
# Freshdesk ticket sidebar ?dev=true
```

## Reference surfaces

| Placement | url | Entry |
|-----------|-----|-------|
| `ticket_sidebar` | `sidebar.html` | `SidebarMain.jsx` |
