# React Router + multi-surface — pattern reference

Use this for hybrid React Meta apps (`full_page_app` with router + `ticket_sidebar` without router) and any custom React Meta app that has **two or more surfaces** and needs client-side routing inside one of them.

## Core rules

1. **Routing only in `full_page_app`** (or any other full-iframe surface). Sidebars, top-navs, modals stay single-purpose with no router.
2. Each surface gets its **own** HTML file and its **own** JSX entry. Do **not** import the full-page bundle from a sidebar entry.
3. Use **`HashRouter`** (or `MemoryRouter`) — **not** `BrowserRouter`. Reason: the placeholder iframe URL is owned by the host product (Freshdesk), and `BrowserRouter` tries to push real paths to that URL. `HashRouter` keeps app routes in the fragment (`#/ticket/123`), which never collides with the host.

## Install

```bash
npm install react-router-dom
```

`package.json`:

```json
{
  "dependencies": {
    "react": "~18.2.0",
    "react-dom": "~18.2.0",
    "@freshworks/crayons": "~4.6.0",
    "react-router-dom": "~6.26.0"
  }
}
```

Add `react-router-dom` only when the user actually needs routing. Do **not** add it for single-page dashboard flows where tabs are enough.

## Multi-module manifest (hybrid example)

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
      },
      "requests": {
        "getTickets": {},
        "getTicketById": {},
        "updateTicket": {}
      },
      "functions": {
        "fetchTickets": {},
        "fetchTicket": {},
        "updateTicketStatus": {}
      },
      "events": {
        "onAppInstall":   { "handler": "onAppInstallHandler" },
        "onAppUninstall": { "handler": "onAppUninstallHandler" }
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

Module placement rules used here:

- `full_page_app` → `modules.common.location` (works across products).
- Freshdesk `ticket_sidebar` → `modules.support_ticket.location`.
- `requests`, `functions`, `events` go under `modules.common.*` for hybrid apps.
- Every key in `config/requests.json` has a matching `modules.common.requests.<key>: {}` declaration.
- Every SMI function in `server/server.js` has a matching `modules.common.functions.<key>: {}` declaration.
- Every event handler exported from `server/server.js` has a matching `events.<eventName>.handler: "<exportName>"` entry.

For Freshservice swap `support_ticket` for `service_ticket`. Other product modules: `support_contact`, `support_company`, `service_ticket`, etc. (See [react-meta-quick-reference.md](../react-meta-quick-reference.md) for the full table.)

## File layout (hybrid example)

```
manifest.json
package.json
config/
├── iparams.json
└── requests.json
server/
└── server.js
app/
├── index.html                   # full_page_app surface
├── ticket_sidebar.html          # ticket_sidebar surface
├── styles/
│   └── images/icon.svg
├── components/
│   ├── Main.jsx                 # full_page entry (router lives here)
│   ├── App.jsx                  # router + routes
│   ├── Dashboard.jsx            # route "/"
│   ├── TicketDetail.jsx         # route "/ticket/:id"
│   ├── About.jsx                # route "/about"
│   ├── NavBar.jsx               # FwTabs nav across routes
│   ├── TicketSidebarMain.jsx    # sidebar entry (no router)
│   └── TicketSidebarApp.jsx     # sidebar UI
```

## Full-page entry (`Main.jsx`)

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import App from './App';

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

## Routes (`App.jsx`)

```jsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import Dashboard from './Dashboard';
import TicketDetail from './TicketDetail';
import About from './About';

const App = ({ client }) => (
  <HashRouter>
    <NavBar />
    <Routes>
      <Route path="/" element={<Dashboard client={client} />} />
      <Route path="/ticket/:id" element={<TicketDetail client={client} />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </HashRouter>
);

export default App;
```

## Nav with `FwTabs` synced to the URL (`NavBar.jsx`)

```jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { FwTabs, FwTab } from '@freshworks/crayons/react';

const TABS = [
  { label: 'Dashboard', path: '/' },
  { label: 'About',     path: '/about' },
];

const NavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activeIndex = Math.max(0, TABS.findIndex((t) => t.path === location.pathname));

  function onChange(e) {
    const next = TABS[e.detail.tabIndex];
    if (next) navigate(next.path);
  }

  return (
    <FwTabs activeTabIndex={activeIndex} onFwChange={onChange}>
      {TABS.map((t) => <FwTab key={t.path} tab-header={t.label} />)}
    </FwTabs>
  );
};

export default NavBar;
```

`FwTab` here is used **only** for its header — the route content is rendered by `<Routes>` below the navbar.

## Dashboard (`Dashboard.jsx`)

```jsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FwButton, FwDataTable, FwSpinner } from '@freshworks/crayons/react';

const COLUMNS = [
  { key: 'id', text: 'ID' },
  { key: 'subject', text: 'Subject' },
  { key: 'status', text: 'Status' },
  { key: 'priority', text: 'Priority' },
  { key: 'created_at', text: 'Created' },
];

const Dashboard = ({ client }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const tableRef = useRef(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await client.request.invoke('fetchTickets', {});
      const list = JSON.parse(res.response);
      setTickets(list.map((t) => ({
        id: String(t.id),
        subject: t.subject,
        status: t.status,
        priority: t.priority,
        created_at: t.created_at,
      })));
    } catch (err) {
      setError(err?.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.columns = COLUMNS.map((c) => (
        c.key === 'id'
          ? { ...c, customTemplate: ({ id }) => `<a href="#/ticket/${id}">${id}</a>` }
          : c
      ));
      tableRef.current.rows = tickets;
    }
  }, [tickets]);

  return (
    <section className="dashboard">
      <header>
        <h1>Tickets</h1>
        <FwButton color="primary" onFwClick={load} disabled={loading}>
          {loading ? 'Refreshing…' : 'Refresh'}
        </FwButton>
      </header>
      {error && <p className="error">{error}</p>}
      {loading ? <FwSpinner size="medium" /> : <FwDataTable ref={tableRef} label="Tickets" />}
      {!loading && tickets.length === 0 && <p>No tickets.</p>}
      <ul className="ticket-links">
        {tickets.map((t) => (
          <li key={t.id}><Link to={`/ticket/${t.id}`}>#{t.id} — {t.subject}</Link></li>
        ))}
      </ul>
    </section>
  );
};

export default Dashboard;
```

## Ticket detail (`TicketDetail.jsx`)

```jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FwButton, FwSelect, FwSelectOption, FwSpinner, FwToast } from '@freshworks/crayons/react';
import { useRef } from 'react';

const STATUSES = [
  { value: '2', text: 'Open' },
  { value: '3', text: 'Pending' },
  { value: '4', text: 'Resolved' },
  { value: '5', text: 'Closed' },
];

const TicketDetail = ({ client }) => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toastRef = useRef(null);

  async function load() {
    setLoading(true);
    try {
      const res = await client.request.invoke('fetchTicket', { id });
      const t = JSON.parse(res.response);
      setTicket(t);
      setStatus(String(t.status));
    } catch (err) {
      toastRef.current?.trigger({ type: 'error', content: err?.message || 'Failed to load ticket' });
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    try {
      await client.request.invoke('updateTicketStatus', { id, status: Number(status) });
      toastRef.current?.trigger({ type: 'success', content: 'Status updated' });
    } catch (err) {
      toastRef.current?.trigger({ type: 'error', content: err?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => { load(); }, [id]);

  if (loading) return <FwSpinner size="medium" />;
  if (!ticket) return <p>Ticket not found. <Link to="/">Back to dashboard</Link></p>;

  return (
    <article className="ticket-detail">
      <Link to="/">← Back</Link>
      <h1>#{ticket.id} {ticket.subject}</h1>
      <dl>
        <dt>Requester</dt><dd>{ticket.requester_id}</dd>
        <dt>Priority</dt><dd>{ticket.priority}</dd>
        <dt>Created</dt><dd>{ticket.created_at}</dd>
      </dl>
      <p>{ticket.description_text}</p>

      <FwSelect label="Status" value={status} onFwChange={(e) => setStatus(e.detail.value)}>
        {STATUSES.map((s) => (
          <FwSelectOption key={s.value} value={s.value}>{s.text}</FwSelectOption>
        ))}
      </FwSelect>
      <FwButton color="primary" onFwClick={save} disabled={saving}>
        {saving ? 'Saving…' : 'Save'}
      </FwButton>

      <FwToast ref={toastRef} position="top-center" />
    </article>
  );
};

export default TicketDetail;
```

## About (`About.jsx`)

```jsx
const About = () => (
  <section>
    <h1>About</h1>
    <p>Demo hybrid app: dashboard + ticket sidebar with Freshdesk REST API.</p>
  </section>
);
export default About;
```

## Sidebar entry — **no router** (`TicketSidebarMain.jsx` + `TicketSidebarApp.jsx`)

`TicketSidebarMain.jsx`:

```jsx
import React, { useState, useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { defineCustomElements } from '@freshworks/crayons/loader';
import '@freshworks/crayons/css/crayons-min.css';
import TicketSidebarApp from './TicketSidebarApp';

defineCustomElements();

const TicketSidebarMain = () => {
  const [child, setChild] = useState(<p>Loading…</p>);
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

`TicketSidebarApp.jsx`:

```jsx
import { useEffect, useRef, useState } from 'react';
import { FwButton, FwSelect, FwSelectOption, FwSpinner, FwToast } from '@freshworks/crayons/react';

const STATUSES = [
  { value: '2', text: 'Open' },
  { value: '3', text: 'Pending' },
  { value: '4', text: 'Resolved' },
  { value: '5', text: 'Closed' },
];

const STATUS_TONE = {
  '2': 'badge badge-open',
  '3': 'badge badge-pending',
  '4': 'badge badge-resolved',
  '5': 'badge badge-closed',
};

const TicketSidebarApp = ({ client }) => {
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await client.data.get('ticket');
        const t = data.ticket;
        if (cancelled) return;
        setTicket(t);
        setStatus(String(t.status));
      } catch (err) {
        toastRef.current?.trigger({ type: 'error', content: err?.message || 'Failed to load ticket' });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [client]);

  async function save() {
    if (!ticket) return;
    setSaving(true);
    try {
      await client.request.invoke('updateTicketStatus', { id: ticket.id, status: Number(status) });
      toastRef.current?.trigger({ type: 'success', content: 'Status updated' });
    } catch (err) {
      toastRef.current?.trigger({ type: 'error', content: err?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <FwSpinner size="medium" />;
  if (!ticket) return <p>No ticket context.</p>;

  return (
    <div className="sidebar">
      <h2>{ticket.subject}</h2>
      <p><span className={STATUS_TONE[String(ticket.status)] || 'badge'}>{ticket.status_label || ticket.status}</span></p>
      <p>Priority: {ticket.priority_label || ticket.priority}</p>

      <FwSelect label="Change Status" value={status} onFwChange={(e) => setStatus(e.detail.value)}>
        {STATUSES.map((s) => (
          <FwSelectOption key={s.value} value={s.value}>{s.text}</FwSelectOption>
        ))}
      </FwSelect>
      <FwButton color="primary" onFwClick={save} disabled={saving}>
        {saving ? 'Updating…' : 'Update'}
      </FwButton>

      <FwToast ref={toastRef} position="top-center" />
    </div>
  );
};

export default TicketSidebarApp;
```

The sidebar:

- Reads context with `client.data.get('ticket')`.
- Calls the **same** SMI function `updateTicketStatus` as the full-page detail view.
- Has **no `<HashRouter>`** — single-purpose UI.

## SMI calling pattern recap

Frontend → `client.request.invoke('functionName', payload)`. Server-side functions use `$request.invokeTemplate('templateName', { context, body })`. Wiring details and lint-clean code in [../templates/server-smi-examples.md](../templates/server-smi-examples.md).

## Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Router pushes URL into Freshdesk's address bar | Used `BrowserRouter` | Switch to `HashRouter` (or `MemoryRouter`) |
| `useParams` returns empty | Route placeholder mismatched | Match `<Route path="/ticket/:id">` with `useParams()` key |
| Sidebar reload breaks routing | Tried to add a router to the sidebar | Remove the router; sidebars are single-purpose |
| Tabs jump back to index 0 on route change | `activeTabIndex` not derived from URL | Compute `activeIndex` from `useLocation().pathname` |
| `client.request.invoke` rejects with "function not declared" | SMI fn missing in `modules.common.functions` | Add the key to manifest and re-validate |
| `request template not declared` warning | `requests.json` key missing in `modules.common.requests` | Sync both files and re-run `fdk validate` |
