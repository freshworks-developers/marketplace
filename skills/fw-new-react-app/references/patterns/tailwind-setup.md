# Tailwind CSS — pattern reference

Use this for Tailwind-based `ticket_sidebar` layouts and any custom React Meta surface where the user explicitly asks for Tailwind utility classes.

The FDK bundler is Vite-based (the `react-starter-template` ships `@vitejs/plugin-react`), and Vite picks up `postcss.config.js` automatically. That means a **standard local Tailwind toolchain** works inside FDK with no FDK-specific tweaks.

## Install

```bash
npm install -D tailwindcss postcss autoprefixer
```

`package.json` (devDependencies excerpt):

```json
{
  "devDependencies": {
    "tailwindcss": "~3.4.0",
    "postcss": "~8.4.0",
    "autoprefixer": "~10.4.0"
  }
}
```

Pin to Tailwind **3.x** for now (FDK's bundler config does not currently include the Tailwind v4 Vite plugin; v3 + PostCSS is the safest path).

## Config files (project root, **not** inside `app/`)

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app/**/*.html',
    './app/**/*.{js,jsx}',
    './config/**/*.{js,jsx,html}'
  ],
  darkMode: 'class',
  theme: {
    extend: {}
  },
  plugins: []
};
```

- `content` globs **must** include every file that uses Tailwind classes; otherwise classes get tree-shaken out at build time and the UI looks unstyled.
- `darkMode: 'class'` enables `dark:` variants whenever the `<html>` (or any ancestor) has the `dark` class. This sidebar example toggles it from React state.

`postcss.config.js`:

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

Use ESM (`export default`) because `package.json` from `react-starter-template` uses ESM-friendly imports throughout. If your project uses CommonJS, switch to `module.exports = { ... }`.

## Tailwind entry CSS

`app/styles/tailwind.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Put any small `@layer components { ... }` overrides in the same file if needed. Do **not** delete the three `@tailwind` directives.

## Import the CSS once per entry

`app/components/TicketSidebarMain.jsx`:

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import TicketSidebarApp from './TicketSidebarApp';
import '../styles/tailwind.css';

const TicketSidebarMain = () => {
  const [child, setChild] = useState(<p className="p-3 text-sm text-gray-500">Loading…</p>);
  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      setChild(<TicketSidebarApp client={client} />);
    });
  }, []);
  return <div>{child}</div>;
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TicketSidebarMain />
  </React.StrictMode>
);
```

If multiple surfaces use Tailwind, each entry imports `../styles/tailwind.css` itself; do not import it from a shared component module — the bundler may not include it then.

## Dark mode toggle

Two patterns:

**A. Local toggle (simplest):** flip a `dark` class on a wrapper `<div>`.

```jsx
import { useState } from 'react';

function Sidebar() {
  const [dark, setDark] = useState(false);
  return (
    <div className={dark ? 'dark' : ''}>
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-3">
        <button
          onClick={() => setDark((v) => !v)}
          className="text-xs underline"
        >
          Toggle dark mode
        </button>
        {/* rest of UI */}
      </div>
    </div>
  );
}
```

**B. System preference:** read `window.matchMedia('(prefers-color-scheme: dark)')` and apply the same `dark` class. Add a `media` listener for live changes.

The Freshworks placeholder iframe has a constrained width (~350px). Use `w-full max-w-[350px]` on the outermost container or rely on the iframe's natural width and stack everything vertically.

---

## Tailwind `ticket_sidebar` skeleton (frontend-only)

`manifest.json`:

```json
{
  "platform-version": "3.0",
  "app": { "tracking_id": "", "start_time": "" },
  "modules": {
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

`app/ticket_sidebar.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ticket sidebar</title>
    <script src="{{{appclient}}}"></script>
    <script type="module" src="./components/TicketSidebarMain.jsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`app/components/TicketSidebarApp.jsx` (Tailwind-only, mock data):

```jsx
import { useState } from 'react';

const STATUS_BADGES = {
  open:     'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  pending:  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  resolved: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  closed:   'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const TICKET = {
  subject: 'Billing portal returns 502 for EU tenants',
  status: 'pending',
  requester: { name: 'Nadia Kim', email: 'nadia@example.com', company: 'Acme EU' },
  activity: [
    { at: '2026-05-05 09:10', text: 'Agent replied' },
    { at: '2026-05-05 08:45', text: 'Status changed to Pending' },
    { at: '2026-05-04 16:22', text: 'Ticket created' },
  ],
};

const TicketSidebarApp = () => {
  const [dark, setDark] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className={dark ? 'dark' : ''}>
      <div className="w-full max-w-[350px] p-3 space-y-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setDark((v) => !v)}
            className="text-xs underline text-gray-500 dark:text-gray-400"
          >
            {dark ? 'Light' : 'Dark'} mode
          </button>
        </div>

        <section className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 space-y-2">
          <h2 className="text-sm font-semibold leading-tight">{TICKET.subject}</h2>
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_BADGES[TICKET.status]}`}>
            {TICKET.status}
          </span>
        </section>

        <section className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Requester</h3>
          <dl className="text-sm space-y-1">
            <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Name</dt><dd>{TICKET.requester.name}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Email</dt><dd className="truncate ml-2">{TICKET.requester.email}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500 dark:text-gray-400">Company</dt><dd>{TICKET.requester.company}</dd></div>
          </dl>
        </section>

        <section className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">Recent Activity</h3>
          <ul className="space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
            {TICKET.activity.map((e) => (
              <li key={e.at} className="text-sm">
                <p>{e.text}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{e.at}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-gray-50 dark:bg-gray-800 p-3 space-y-2">
          <h3 className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Quick Note</h3>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Type a note for the team…"
            className="w-full rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setNote('')}
            className="w-full rounded bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5"
          >
            Save note
          </button>
        </section>

      </div>
    </div>
  );
};

export default TicketSidebarApp;
```

`app/components/TicketSidebarMain.jsx`: see "Import the CSS once per entry" above.

---

## Validation notes

- The native `<button>` and `<textarea>` are **acceptable** when the user explicitly asks for "no Crayons" / "Tailwind only". For Crayons-first flows, use Crayons React wrappers instead — `fdk validate` does not require Crayons, but the user prompt might.
- Tailwind classes that contain arbitrary values (e.g. `max-w-[350px]`) work in v3 and are fine inside FDK.
- If classes don't apply, double-check `tailwind.config.js` `content` globs **and** confirm `tailwind.css` is imported by an entry that the FDK bundler reaches (i.e. an entry referenced by an `app/*.html` file via `type="module"`).

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Classes look unstyled | `content` globs miss the source file | Add the path to `content` in `tailwind.config.js` |
| Dark variants don't apply | Forgot `darkMode: 'class'` or no `dark` class on a wrapper | Add `darkMode: 'class'` and wrap the tree in `<div className={dark ? 'dark' : ''}>` |
| Tailwind directives unprocessed | PostCSS not picked up | Ensure `postcss.config.js` is at project root and uses ESM `export default` to match the template |
| Mixed Crayons + Tailwind in a Tailwind-only sidebar | Spec said "Tailwind only" but Crayons creeps in | Drop Crayons imports for this surface; use plain HTML controls |
