# Before/After: dual-surface OAuth (MG-2)

**Migration type:** Dual-surface OAuth + server events (server kept).

## Before

```
app/
  sidebar.js                  # ticket sidebar UI
  fullpage.js                 # dashboard UI
  index.html, fullpage.html   # separate script tags
config/oauth_config.json      # OAuth provider config
server/server.js              # sync handlers, event handlers
```

- Two vanilla JS entry files for two surfaces.
- OAuth via `oauth_config.json` + server-side sync.
- Ticket `onTicketCreate` / `onTicketUpdate` → server handlers.

## After

```
app/
  index.html          → SidebarMain.jsx    → SidebarApp.jsx
  fullpage.html       → FullPageMain.jsx   → DashboardApp.jsx
  utils/sheets.js     # label mappers, stats, row transforms
  styles/sidebar.css, dashboard.css
config/oauth_config.json    # UNCHANGED
server/server.js            # TRIMMED but KEPT (sync handlers)
tests/sheets.test.js
```

## Agent actions (ordered)

1. Add `metaConfig`, toolchain (`package.json`, vitest).
2. Create **two** HTML shells with **two** `*Main.jsx` entries.
3. Sidebar: resize + `app.activated` (e.g. 460×280px).
4. Full page: init only, no resize.
5. Extract sheet/formatting logic → `app/utils/sheets.js` + tests.
6. Delete `app/sidebar.js`, `app/fullpage.js`.
7. **Do not delete server** — OAuth sync and ticket events remain.

## Preserved

| Asset | Why |
|-------|-----|
| `config/oauth_config.json` | OAuth iparams + scopes |
| `server/server.js` handlers | sync + ticket event handlers |
| `modules.common.functions` | Server method declarations |
| `modules.support_ticket.events` | Ticket create/update triggers |
| `config/requests.json` | OAuth-backed request templates |

## Surface map

| Placement | Module | url | Entry |
|-----------|--------|-----|-------|
| `full_page_app` | common | `fullpage.html` | `FullPageMain.jsx` |
| `ticket_sidebar` | support_ticket | `index.html` | `SidebarMain.jsx` |

## Pitfalls

- One Main.jsx for both surfaces — different CSS and layout needs.
- Touching OAuth scopes or token_type — breaks installed accounts.
- Removing server functions while events still reference them.
- Sidebar without resize — dashboard cards clip in narrow iframe.

## Validate

```bash
fdk validate
npm run fdk-unit-test
# Test BOTH full_page_app and ticket_sidebar ?dev=true
```
