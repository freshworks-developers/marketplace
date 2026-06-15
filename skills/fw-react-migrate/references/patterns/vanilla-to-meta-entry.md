# Pattern: Vanilla → React Meta entry (`*Main.jsx`)

## When to use

- Any surface still bootstrapped from `app/scripts/*.js` or inline `<script>` in HTML.
- After adding `metaConfig.framework: "react"` to `manifest.json`.
- MG-1 through MG-4: see matching `before-after/` guides.

## Steps

1. **Thin HTML shell** — keep only `{{{appclient}}}`, CSS link, `#root`, and one module entry:

```html
<script src="{{{appclient}}}"></script>
<link rel="stylesheet" href="styles/style.css" />
<script type="module" src="./components/SidebarMain.jsx"></script>
<div id="root"></div>
```

2. **Create `*Main.jsx`** per surface (e.g. `SidebarMain.jsx`, `FullPageMain.jsx`).
3. **Bootstrap sequence** (canonical order):
   - `defineCustomElements()` + Crayons CSS import (if using Crayons)
   - `createRoot` → render wrapper with loading placeholder
   - `useLayoutEffect` → `window.app.initialized()`
   - assign `window.client = client`
   - `client.instance.resize({ height, width? })` — call once immediately
   - `client.events.on('app.activated', resize)` — re-resize when tab refocuses
   - `setChild(<AppComponent client={client} />)`
4. Delete the old `app/scripts/*.js` only after `fdk validate` passes.

## Canonical `*Main.jsx` skeleton

```jsx
import React, { useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import App from './App';

defineCustomElements();

const SIDEBAR_HEIGHT = '560px';

function SidebarMain() {
  const [child, setChild] = useState(<p>Loading…</p>);

  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      const resize = () =>
        client.instance.resize({ height: SIDEBAR_HEIGHT, width: '300px' }).catch(() => {});
      resize();
      client.events.on('app.activated', resize);
      setChild(<App client={client} />);
    });
  }, []);

  return <div className="app-root">{child}</div>;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode><SidebarMain /></React.StrictMode>
);
```

## Full-page variant

- Same init gate; **skip resize** unless the surface needs explicit dimensions.
- MG-2 `FullPageMain.jsx`: init → render dashboard, no `app.activated` resize.

## Pitfalls

| Mistake | Fix |
|---------|-----|
| Missing `{{{appclient}}}` | Add to every HTML shell (including modals, iparams) |
| Calling `client.data.get` before init | Gate all platform calls behind `app.initialized()` |
| `useEffect` for first paint | Prefer `useLayoutEffect` so resize runs before paint |
| Resize without `.catch()` | Sidebar resize can fail silently on some placements |
| Mounting HashRouter in sidebar | Router belongs only in `full_page_app` entry |
| Deleting scripts before validate | Run `fdk validate` first |

## Toolchain additions

```json
// package.json scripts
"fdk-unit-test": "vitest run --coverage"
```

Add `.babelrc`, `package.json` (react + react-dom), `vitest.config.js` when migrating from zero frontend tooling.
