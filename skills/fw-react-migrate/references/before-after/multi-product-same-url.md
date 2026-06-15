# Before/After: multi-product same URL (MG-3)

**Migration type:** Multi-product, single HTML URL, OAuth + `client.db`.

## Before

```
app/
  scripts/app.js              # vanilla sidebar
  index.html                  # crayons CDN + script tag
config/oauth_config.json      # OAuth provider
server/                       # minimal or none for UI
```

- `support_ticket.ticket_sidebar` and `service_ticket.ticket_sidebar` both → `index.html`.
- External record linking via `client.db` + `invokeTemplate`.
- Crayons via CDN.

## After

```
app/
  index.html                  # thin shell → SidebarMain.jsx
  components/
    SidebarMain.jsx           # shared entry for FD + FS
    ExternalRecordSidebar.jsx # create/link UI
  utils/external-api.js       # payload builders, db keys, label maps
config/oauth_config.json      # UNCHANGED
config/requests.json          # create/get external record templates
tests/external-api.test.js
```

## Agent actions (ordered)

1. Add `metaConfig`, `package.json`, vitest.
2. One `index.html` + `SidebarMain.jsx` serves **both** products.
3. Sidebar component uses `client.data.get('ticket')` — works on FD and FS.
4. Extract payload builders, db keys, status mappers → `app/utils/external-api.js`.
5. Remove `app/scripts/app.js`, old modal HTML.
6. Keep OAuth config and request templates intact.

## Multi-product manifest (unchanged pattern)

```json
"support_ticket": {
  "location": { "ticket_sidebar": { "url": "index.html", "icon": "logo.png" } }
},
"service_ticket": {
  "location": { "ticket_sidebar": { "url": "index.html", "icon": "logo.png" } }
}
```

No duplicate HTML files — one entry, product-agnostic component.

## Preserved

- `config/oauth_config.json` (OAuth client credentials).
- `client.db` keys for ticket ↔ external record linking.
- `invokeTemplate` call signatures for create/get templates.

## Pitfalls

- Product-specific `index.html` files — unnecessary; shared URL is intentional.
- Hardcoding Freshdesk-only field names — FS tickets differ; use defensive reads.
- Deleting `client.db` logic during React rewrite — breaks record linking.
- Resize omitted — use ~560×300px + `app.activated`.

## Validate

```bash
fdk validate
npm run fdk-unit-test
# ticket_sidebar on Freshdesk AND Freshservice ?dev=true
```
