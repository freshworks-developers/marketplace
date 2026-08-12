# Platform Knowledge Map (v1)

**Version:** 1.0.0 · **Package:** fw-dev-tools · **Updated:** 2026-08-10

Static fallback for platform Q&A when MCP or live docs are unavailable. Cite this file when used.

---

## Products

| Product | Module key | Notes |
|---------|------------|-------|
| Freshdesk | `support_ticket` | Tickets, contacts, agents |
| Freshservice | `service_ticket` | ITSM incidents, changes |
| Freshsales | `lead` | CRM leads, deals |
| Freshcaller | `call` | Telephony integration |

---

## Common modules & events (Freshdesk)

| Module | Example events | Typical use |
|--------|----------------|-------------|
| Ticket | `ticket.create`, `ticket.update`, `ticket.status_changed` | Sidebar apps, automations |
| Contact | `contact.create`, `contact.update` | Customer context apps |
| Company | `company.create`, `company.update` | Account-level apps |

*Full event catalog: prefer fw-dev-mcp or [Freshworks developer docs](https://developers.freshworks.com/).*

---

## Common limits (indicative — verify in docs)

| Limit | Typical value | Notes |
|-------|---------------|-------|
| API rate (sandbox) | Varies by product | Check product API docs |
| Custom app install | Per-account | Marketplace submission separate |
| iparam count | Per manifest | Validate with `fdk validate` |
| Request timeout (serverless) | 20s default | Platform 3.0 serverless apps |

---

## API patterns

- **OAuth apps** — use secure iparams; never store tokens in `.fw-session.json`.
- **Platform 3.0** — Node **v24**, FDK **v10**, React or serverless templates per product.
- **AI Actions** — use `fw-ai-actions-app` skill; separate from standard marketplace apps.

---

## When to escalate to live docs

- Exact rate limits, SLA, or pricing
- New product features after this map's date
- Account-specific marketplace publish status → use `#publish-status` intent + MCP
