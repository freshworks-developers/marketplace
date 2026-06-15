# Migrate to React Meta — quick reference

## Decision tree

| Before state | Path | Reference |
|--------------|------|-----------|
| PF 2.x | Stop → **fw-app-dev** `/fdk-migrate` | — |
| JSX, no `metaConfig` | Light | [before-after/pre-meta-light-path.md](before-after/pre-meta-light-path.md) |
| Nested product folder | Flatten first | [patterns/folder-flattening.md](patterns/folder-flattening.md) |
| `app/scripts/*.js` | Full migrate | [patterns/vanilla-to-meta-entry.md](patterns/vanilla-to-meta-entry.md) |

## Surface placement (same as fw-new-react-app)

| Surface | Module |
|--------|--------|
| `full_page_app`, `cti_global_sidebar` | `modules.common.location` |
| Freshdesk ticket placements | `modules.support_ticket.location` |
| Freshservice ticket sidebar | `modules.service_ticket.location` |
| Contact / company | `modules.support_contact.location`, `modules.support_company.location` |

## File mapping

| Before | After |
|--------|--------|
| `app/scripts/app.js` | `app/components/*Main.jsx` + thin `app/*.html` |
| `sidebar.js` / `fullpage.js` | `SidebarMain.jsx` + `FullPageMain.jsx` |
| Inline crayons CDN + DOM | `defineCustomElements()` + React components |
| Logic in scripts | `app/utils/*.js` + Vitest |

## Preserve (do not rewrite unless asked)

- `server/server.js` exports and manifest `functions`/`events`
- `config/oauth_config.json`, `config/requests.json`
- Request template keys ↔ `modules.common.requests`

## Pattern index

| Pattern | File |
|---------|------|
| Entry bootstrap | [patterns/vanilla-to-meta-entry.md](patterns/vanilla-to-meta-entry.md) |
| Multi-surface | [patterns/multi-surface-conversion.md](patterns/multi-surface-conversion.md) |
| Flatten nested layout | [patterns/folder-flattening.md](patterns/folder-flattening.md) |
| Server removal | [patterns/server-trim.md](patterns/server-trim.md) |
| Utils + tests | [patterns/utils-extraction-and-tests.md](patterns/utils-extraction-and-tests.md) |
| OAuth sidebar | [before-after/oauth-sidebar-migrate.md](before-after/oauth-sidebar-migrate.md) |

## Custom iparams window API

- **`window.getConfigs(configs)`** — hydrate UI
- **`window.validate()`** — strict boolean; `false` blocks save
- **`window.postConfigs()`** — serializable config object

## Validate

- **`fdk validate`**: 0 platform + 0 lint
- **`?dev=true`** + **`system_settings`** module subscription per surface
