# Multi-product sidebar (Freshdesk + Freshservice)

Use when the **same sidebar UI** must install on both Freshdesk (`support_ticket`) and Freshservice (`service_ticket`) — one React bundle, one `index.html`.

## When to use

- Marketplace app targets **both** Freshdesk and Freshservice ticket sidebars.
- UI and logic are identical (or product differences are handled at runtime via `client.data.get('ticket')`).
- You want one codebase instead of duplicate HTML/JSX entries.

**Alternative:** If Freshdesk needs rich UI but Freshservice only needs a stub for install compliance, use **separate HTML files** (multi-surface placeholder pattern) — see pitfall table.

## Steps

1. **Single entry point** — one `app/index.html` bootstrapping `SidebarMain.jsx`.
2. **Manifest both modules** — point `support_ticket.ticket_sidebar` and `service_ticket.ticket_sidebar` to the **same** `index.html`.
3. **Shared requests/functions** — declare under `modules.common`.
4. **Runtime context** — use `client.data.get('ticket')` + `client.data.get('contact')`; ticket shape is similar across products.
5. **Optional product branching** — only if APIs differ; prefer shared logic.

## Manifest (shared URL pattern)

```json
{
  "modules": {
    "common": {
      "requests": {
        "createGithubIssue": {},
        "getGithubIssue": {}
      }
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": { "url": "index.html", "icon": "logo.png" }
      }
    },
    "service_ticket": {
      "location": {
        "ticket_sidebar": { "url": "index.html", "icon": "logo.png" }
      }
    }
  },
  "metaConfig": { "framework": "react" }
}
```

## Single HTML + entry

```html
<!-- app/index.html -->
<body>
  <div id="root"></div>
  <script src="{{{appclient}}}"></script>
  <script type="module" src="./components/SidebarMain.jsx"></script>
</body>
```

```jsx
// app/components/SidebarMain.jsx
useLayoutEffect(() => {
  window.app.initialized().then((client) => {
    window.client = client;
    client.instance.resize({ height: '560px', width: '300px' }).catch(() => {});
    setChild(<ExternalRecordSidebar client={client} />);
  });
}, []);
```

## Load ticket context (works on both products)

```jsx
async function loadTicketContext(client) {
  const { ticket } = await client.data.get('ticket');
  const { contact } = await client.data.get('contact').catch(() => ({}));
  const iparams = await client.iparams.get().catch(() => ({}));
  return { ticket, contact, iparams };
}
```

## Separate HTML variant (multi-surface placeholder apps)

When products need different bundles:

```json
"support_ticket": { "location": { "ticket_sidebar": { "url": "ticketSidebar.html" } } },
"service_ticket": { "location": { "ticket_sidebar": { "url": "ticketSidebarService.html" } } }
```

Freshdesk gets full demo; Freshservice gets minimal placeholder so marketplace validation passes.

## Pitfalls

| Symptom | Fix |
|---------|-----|
| Freshservice install rejected | Add `service_ticket` module with at least one location |
| Freshdesk-only APIs fail on FS | Gate calls behind product check or use shared REST templates |
| Wrong assignee field | FS uses `responder`, FD may use `assignee` — normalize in helper |
| Duplicate bundles in zip | Same `index.html` is fine; FDK bundles once per referenced file |
| Assumed separate modules = separate UI | Same URL is intentional for shared sidebar apps |
| `invokeTemplate` product mismatch | Use `common.requests` + iparams for the target product's domain |
