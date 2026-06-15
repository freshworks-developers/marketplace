# Pattern: Multi-surface conversion

## When to use

- `manifest.json` lists **2+** `location.url` values (different HTML files).
- MG-2: `fullpage.html` + `index.html` (dual-surface OAuth).
- MG-3: same `index.html` shared by `support_ticket` + `service_ticket` (multi-product).
- MG-5: 15+ surfaces (multi-surface placeholder app).

## Rule

**One thin HTML + one `*Main.jsx` per unique `url` in manifest.** Do not share a single JSX entry across unrelated surfaces unless manifest URLs are intentionally identical.

## Steps

1. **Inventory** — list every `modules.*.location.*.url` and `icon` from manifest.
2. **Map 1:1**:

| Manifest url | HTML shell | JSX entry | App component |
|--------------|------------|-----------|---------------|
| `sidebar.html` | `app/sidebar.html` | `SidebarMain.jsx` | `SidebarApp.jsx` |
| `fullpage.html` | `app/fullpage.html` | `FullPageMain.jsx` | `DashboardApp.jsx` |
| `index.html` (×2 products) | `app/index.html` | `SidebarMain.jsx` | `ExternalRecordSidebar.jsx` |

3. **Per-surface HTML** — each file gets its own CSS and module entry:

```html
<!-- app/fullpage.html -->
<script src="{{{appclient}}}"></script>
<link rel="stylesheet" href="styles/dashboard.css" />
<script type="module" src="./components/FullPageMain.jsx"></script>
<div id="root"></div>
```

```html
<!-- app/index.html (sidebar) -->
<script src="{{{appclient}}}"></script>
<link rel="stylesheet" href="styles/sidebar.css" />
<script type="module" src="./components/SidebarMain.jsx"></script>
<div id="root"></div>
```

4. **Shared URL, multiple products** — one HTML + one Main serves both `support_ticket` and `service_ticket`. Component reads ticket context via `client.data.get('ticket')`; no product-specific branching in manifest.
5. **Placeholder apps** — use `app/components/placeholders/<surface>.jsx` + `PlaceholderWrapper` for lifecycle (`app.activated` / `app.deactivated`).
6. **Full page only** — mount HashRouter / Redux in `index.html` entry only (`components/index.jsx`).

## Resize per surface type

| Placement | Resize? | Typical size |
|-----------|---------|--------------|
| `ticket_sidebar` | Yes + `app.activated` | height 420–720px |
| `full_page_app` | Usually no | — |
| `cti_global_sidebar` | Yes | height ~600px |
| `ticket_background` | Minimal UI | small or none |

## Pitfalls

- Reusing one `app.js` for all surfaces — split entries; legacy IIFE cannot serve 7 placements.
- Wrong CSS per surface — full-page dashboard CSS on sidebar causes layout bleed.
- Duplicate manifest URLs pointing to different scripts — consolidate or give each a unique url.
- Adding Router to every placeholder — only `full_page_app` gets client-side routing.
- Forgetting icon paths — each `icon` must exist on disk (`app/icon.svg` or `app/styles/images/icon.svg`).

## Validate checklist

```
fdk validate                    # 0 errors
?dev=true on EACH surface       # smoke test
system_settings subscription    # for local dev
```
