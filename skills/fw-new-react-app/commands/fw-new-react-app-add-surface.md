---
name: fw-new-react-app-add-surface
description: Add a new placeholder surface (full_page_app, ticket_sidebar, etc.) to an existing React Meta app, with its own HTML shell and dedicated JSX entry.
globs: ["**/manifest.json", "**/app/*.html"]
always: false
---

# /fw-new-react-app-add-surface

Add a **new** UI surface to an existing Platform 3.0 React Meta app. Each surface gets its **own** HTML file and dedicated JSX entry. **Never** load the full-page bundle inside a sidebar.

## 0. Determine app directory

Follow **`../fw-app-dev/commands/fdk-fix.md`** Step 1.

## 0b. Toolchain gate

- Node **24.x** + FDK **10.x** → else **`fw-setup`**.
- App must be **`platform-version": "3.0"`** → else **`/fdk-migrate`** first.

## 1. Pre-flight

Confirm in `manifest.json`:

- `"platform-version": "3.0"`
- `"metaConfig": { "framework": "react" }`

If `metaConfig` is missing, this is the wrong workflow — direct the user to **`fw-react-migrate`** (`/fw-react-migrate`).

## 2. Determine placement

Ask the user (or infer from the prompt) the **product** and **surface**:

| Surface | Module key |
|---------|------------|
| `full_page_app` | `modules.common.location` |
| `cti_global_sidebar` | `modules.common.location` |
| `ticket_sidebar` (Freshdesk) | `modules.support_ticket.location` |
| `ticket_top_navigation`, `ticket_background` | `modules.support_ticket.location` |
| `contact_sidebar` | `modules.support_contact.location` |
| `company_background` | `modules.support_company.location` |
| `ticket_sidebar` (Freshservice) | `modules.service_ticket.location` |

If unsure, ask product (Freshdesk vs Freshservice) and the surface name.

## 3. Update `manifest.json`

Add the new location entry under the correct module. Multi-module example (full_page_app in `common` + ticket_sidebar in `support_ticket`):

```json
{
  "platform-version": "3.0",
  "app": { "tracking_id": "", "start_time": "" },
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  },
  "metaConfig": { "framework": "react" },
  "scripts": { "fdk-unit-test": "vitest run --coverage" },
  "engines": { "node": "24.11.0", "fdk": "10.0.0" }
}
```

Rules:

- `url` is the HTML filename **inside `app/`** (no `app/` prefix in the value).
- `icon` is **inside `app/`** as well; the file at `app/<icon>` must exist on disk before validation.
- Do not duplicate the `location` key inside the same module — collect all surfaces under one `location` object per module.

## 4. Create the HTML shell

`app/<surface>.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Surface title</title>
    <script src="{{{appclient}}}"></script>
    <script type="module" src="./components/<EntryFile>.jsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

- **Triple-brace `{{{appclient}}}` is required.** Without it, `window.app` is undefined in the iframe and every API call fails.
- `<EntryFile>` is a **per-surface** entry: `Main.jsx` for `index.html`, `TicketSidebarMain.jsx` for `ticket_sidebar.html`, etc.

## 5. Create the JSX entry

`app/components/<EntryFile>.jsx`:

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import <SurfaceApp> from './<SurfaceApp>';
// Crayons (only if this surface uses Crayons):
// import { defineCustomElements } from '@freshworks/crayons/loader';
// import '@freshworks/crayons/css/crayons-min.css';
// defineCustomElements();

const Main = () => {
  const [child, setChild] = useState(<p>Loading…</p>);
  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      setChild(<<SurfaceApp> client={client} />);
    });
  }, []);
  return <div>{child}</div>;
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
```

Then create `app/components/<SurfaceApp>.jsx` for the surface-specific UI (load context with `client.data.get('ticket' | 'contact' | 'loggedInUser' | …)` based on the surface).

## 6. Routing rule

- **Routing (React Router) only inside `full_page_app`.**
- Sidebars, top-navs, modals, and other compact placeholders are **single-purpose** — no `<HashRouter>`, no `<Routes>`. If the user asks for "tabs in the sidebar", use `<FwTabs>` for switching local views, not the router.

## 7. Validate

```bash
fdk validate
```

If errors remain, apply [fw-new-react-app-validate.md](fw-new-react-app-validate.md) autofix table. Loop until **0 platform + 0 lint**.

## 8. Report

Confirm:

- Surface added at `app/<surface>.html` + `app/components/<EntryFile>.jsx`.
- Manifest updated under the correct module.
- Validation passes.
- Run via `fdk run`; visit the matching placeholder in the product (e.g. open a ticket for `ticket_sidebar`).
