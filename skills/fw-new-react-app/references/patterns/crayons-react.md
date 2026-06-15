# Crayons React wrappers — pattern reference

Use this for Crayons-first React Meta apps (full-page dashboards, stateful sidebars, hybrid apps) and any custom React Meta app where the user wants real React components for Crayons (`<FwButton>`, `<FwDataTable>`, etc.) instead of raw web components (`<fw-button>`).

## Install

```bash
npm install @freshworks/crayons
```

`package.json`:

```json
{
  "dependencies": {
    "react": "~18.2.0",
    "react-dom": "~18.2.0",
    "@freshworks/crayons": "~4.6.0"
  }
}
```

Use the latest 4.x line unless the user pins a version.

## One-time setup (every entry that renders Crayons)

Add to the **topmost JSX entry** for each surface (e.g. `Main.jsx`, `TicketSidebarMain.jsx`), **before** `createRoot`:

```jsx
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';

defineCustomElements();
```

Rules:

- Call `defineCustomElements()` **exactly once** per entry. It is idempotent across surfaces but must run before any Crayons component mounts.
- Import the CSS **exactly once** per entry. Do not import per-component.
- **Never** mix `<fw-button>` raw elements with `<FwButton>` wrappers in the same render tree — pick one and stick with it (this skill picks wrappers).

## Importing components

```jsx
import {
  FwButton,
  FwInput,
  FwSelect,
  FwSelectOption,
  FwTextarea,
  FwTabs,
  FwTab,
  FwToast,
  FwDataTable,
  FwSpinner,
  FwToggle,
  FwIcon,
  FwModal,
  FwForm,
} from '@freshworks/crayons/react';
```

Naming: PascalCase, prefixed with `Fw`. Custom-element attribute names become camelCase props (e.g. `is-selectable` → `isSelectable`).

## Event handlers

Crayons fires `fw*` custom events. In React wrappers they become `on{EventName}` handlers. Common ones:

| Component | Custom event | React prop |
|-----------|--------------|------------|
| `FwButton` | `fwClick` | `onFwClick` |
| `FwInput` | `fwInput`, `fwChange`, `fwBlur` | `onFwInput`, `onFwChange`, `onFwBlur` |
| `FwSelect` | `fwChange` | `onFwChange` |
| `FwTextarea` | `fwInput`, `fwChange` | `onFwInput`, `onFwChange` |
| `FwTabs` | `fwChange` | `onFwChange` |
| `FwToggle` | `fwChange` | `onFwChange` |
| `FwDataTable` | `fwSelectionChange` | `onFwSelectionChange` |

Event detail is on `event.detail` (typically `{ value }`):

```jsx
<FwInput onFwInput={(e) => setName(e.detail.value)} />
```

## FwButton

```jsx
<FwButton color="primary" onFwClick={handleCreate}>
  Create Ticket
</FwButton>
```

Colors: `primary`, `secondary`, `danger`, `link`. Sizes: `normal`, `mini`, `small`, `icon`. Use `disabled`, `loading` as boolean props.

## FwInput / FwTextarea

```jsx
<FwInput
  label="Search"
  value={query}
  onFwInput={(e) => setQuery(e.detail.value)}
  placeholder="Search tickets…"
/>

<FwTextarea
  label="Quick Note"
  value={note}
  onFwInput={(e) => setNote(e.detail.value)}
  rows={3}
/>
```

## FwSelect

```jsx
<FwSelect
  label="Status"
  value={status}
  onFwChange={(e) => setStatus(e.detail.value)}
>
  <FwSelectOption value="2">Open</FwSelectOption>
  <FwSelectOption value="3">Pending</FwSelectOption>
  <FwSelectOption value="4">Resolved</FwSelectOption>
  <FwSelectOption value="5">Closed</FwSelectOption>
</FwSelect>
```

For dynamic option lists, set the `options` prop instead of children:

```jsx
<FwSelect
  options={statusOptions}
  value={status}
  onFwChange={(e) => setStatus(e.detail.value)}
/>
```

`statusOptions` is an array of `{ value, text }`.

## FwTabs (dashboard and hybrid patterns)

```jsx
<FwTabs activeTabIndex={tabIndex} onFwChange={(e) => setTabIndex(e.detail.tabIndex)}>
  <FwTab tab-header="Overview">
    <OverviewView />
  </FwTab>
  <FwTab tab-header="My Tickets">
    <MyTicketsView />
  </FwTab>
</FwTabs>
```

`tab-header` stays kebab-case as a JSX attribute string.

## FwDataTable (dashboard and hybrid patterns)

```jsx
import { useEffect, useRef } from 'react';

const columns = [
  { key: 'id', text: 'Ticket ID' },
  { key: 'subject', text: 'Subject' },
  { key: 'requester', text: 'Requester' },
  { key: 'status', text: 'Status' },
  { key: 'priority', text: 'Priority' },
  { key: 'agent', text: 'Assigned Agent' },
];

const rows = [
  { id: '12840', subject: 'Billing 502', requester: 'nadia@example.com', status: 'Open', priority: 'High', agent: 'Alex' },
  // ...
];

function TicketsTable() {
  const tableRef = useRef(null);
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.columns = columns;
      tableRef.current.rows = rows;
    }
  }, []);
  return <FwDataTable ref={tableRef} label="Recent tickets" />;
}
```

`FwDataTable` reads `columns` and `rows` as **properties on the element**, not React JSX props. Use a ref + `useEffect` to assign them. Each row needs a unique `id` field. Add `is-selectable="true"` for checkbox selection.

## FwToast / FwToastMessage

`FwToast` is the toast container; render it once, then call `.trigger()` on its ref to show messages.

```jsx
import { useRef } from 'react';

function ActionsBar() {
  const toastRef = useRef(null);

  function showSuccess(message) {
    toastRef.current?.trigger({
      type: 'success',
      content: message,
    });
  }

  return (
    <>
      <FwButton onFwClick={() => showSuccess('Data refreshed')}>Refresh</FwButton>
      <FwToast ref={toastRef} position="top-center" />
    </>
  );
}
```

Toast types: `success`, `error`, `warning`, `inprogress`. `position`: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`.

## FwSpinner (sidebar loading flows)

```jsx
{loading ? <FwSpinner size="medium" /> : <ResultView data={data} />}
```

Sizes: `nano`, `small`, `medium`, `large`.

## FwToggle (pin/unpin flows)

```jsx
<FwToggle
  checked={note.pinned}
  onFwChange={(e) => dispatch(togglePin({ id: note.id, pinned: e.detail.checked }))}
/>
```

`event.detail.checked` is the new boolean value.

---

## Crayons full_page_app dashboard skeleton

`app/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Agent Productivity Dashboard</title>
    <script src="{{{appclient}}}"></script>
    <script type="module" src="./components/Main.jsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

`app/components/Main.jsx`:

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import App from './App';
import '../styles/style.css';

defineCustomElements();

const Main = () => {
  const [child, setChild] = useState(<p>Loading…</p>);
  useLayoutEffect(() => {
    window.app.initialized().then((client) => {
      window.client = client;
      setChild(<App client={client} />);
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

`app/components/App.jsx` (Crayons-only, mock data):

```jsx
import { useState, useRef, useEffect } from 'react';
import {
  FwButton,
  FwTabs,
  FwTab,
  FwToast,
  FwDataTable,
} from '@freshworks/crayons/react';
import { STATS, RECENT_TICKETS } from '../lib/mockData';

const COLUMNS = [
  { key: 'id', text: 'Ticket ID' },
  { key: 'subject', text: 'Subject' },
  { key: 'requester', text: 'Requester' },
  { key: 'status', text: 'Status' },
  { key: 'priority', text: 'Priority' },
  { key: 'agent', text: 'Assigned Agent' },
];

function StatCard({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

const App = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const tableRef = useRef(null);
  const toastRef = useRef(null);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.columns = COLUMNS;
      tableRef.current.rows = RECENT_TICKETS;
    }
  }, []);

  function notify(type, content) {
    toastRef.current?.trigger({ type, content });
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Agent Productivity Dashboard</h1>
      </header>

      <section className="stats-row">
        {STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </section>

      <section className="quick-actions">
        <FwButton color="primary" onFwClick={() => notify('success', 'Ticket draft opened')}>
          Create Ticket
        </FwButton>
        <FwButton color="secondary" onFwClick={() => notify('inprogress', 'Refreshing…')}>
          Refresh Data
        </FwButton>
        <FwButton color="link" onFwClick={() => notify('success', 'Report exported')}>
          Export Report
        </FwButton>
      </section>

      <FwTabs activeTabIndex={tabIndex} onFwChange={(e) => setTabIndex(e.detail.tabIndex)}>
        <FwTab tab-header="Overview">
          <FwDataTable ref={tableRef} label="Recent tickets" />
        </FwTab>
        <FwTab tab-header="My Tickets">
          <p>Filter view of tickets assigned to the current agent.</p>
        </FwTab>
      </FwTabs>

      <FwToast ref={toastRef} position="top-center" />
    </div>
  );
};

export default App;
```

`app/lib/mockData.js`:

```js
export const STATS = [
  { label: 'Open Tickets', value: 42 },
  { label: 'Pending Tickets', value: 17 },
  { label: 'Avg Response Time', value: '2h 14m' },
  { label: 'SLA Breached', value: 3 },
];

export const RECENT_TICKETS = [
  { id: '12840', subject: 'Billing portal returns 502', requester: 'nadia@example.com', status: 'Open', priority: 'High', agent: 'Alex' },
  { id: '12841', subject: 'Export Q1 audit log', requester: 'ops@example.com', status: 'Pending', priority: 'Medium', agent: 'Pat' },
  { id: '12842', subject: 'Push notifications delayed', requester: 'mobile@example.com', status: 'Open', priority: 'Urgent', agent: 'Sam' },
];
```

---

## Crayons inside a Redux sidebar skeleton

See [redux-toolkit.md](redux-toolkit.md) for the store wiring. Crayons usage inside the note list:

```jsx
import { FwButton, FwTextarea, FwToggle } from '@freshworks/crayons/react';
import { useSelector, useDispatch } from 'react-redux';
import { addNote, removeNote, togglePin } from '../store/notesSlice';

function NoteRow({ note }) {
  const dispatch = useDispatch();
  return (
    <div className="note-row">
      <div className="note-body">
        <p>{note.text}</p>
        <small>{note.author} · {new Date(note.timestamp).toLocaleString()}</small>
      </div>
      <div className="note-actions">
        <FwToggle
          checked={note.pinned}
          onFwChange={(e) => dispatch(togglePin({ id: note.id, pinned: e.detail.checked }))}
        />
        <FwButton color="danger" size="small" onFwClick={() => dispatch(removeNote(note.id))}>
          Delete
        </FwButton>
      </div>
    </div>
  );
}
```

---

## Common pitfalls and fixes

| Symptom | Cause | Fix |
|---------|-------|-----|
| `defineCustomElements is not a function` | Wrong path | Import from `@freshworks/crayons/loader`, **not** `@freshworks/crayons` |
| Crayons components render as empty boxes | `defineCustomElements()` not called, or called after render | Call once in entry, **before** `createRoot` |
| Default Crayons styles missing | CSS not imported | `import '@freshworks/crayons/css/crayons-min.css'` once per entry |
| `FwDataTable` is empty | Tried to pass `columns`/`rows` as JSX props | Use a ref + `useEffect` to set them on the element |
| Toast does nothing | No `<FwToast>` rendered, or wrong ref | Render `<FwToast ref={ref}>` once, call `ref.current.trigger({ type, content })` |
| `onClick` not firing | Used DOM `onClick` instead of `onFwClick` | Crayons fires `fwClick`; React prop is `onFwClick` |
| Tabs don't switch | Used `index` instead of `activeTabIndex` | Prop is `activeTabIndex`; event detail is `e.detail.tabIndex` |
