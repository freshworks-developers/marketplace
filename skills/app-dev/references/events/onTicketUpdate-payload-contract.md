# Serverless `onTicketUpdate` payload — Freshdesk & Freshservice

Use this note with:

- `references/architecture/freshdesk_support_ticket.md` (Support Ticket / Freshdesk)
- `references/architecture/freshservice_service_tickets.md` (Service Ticket / Freshservice)
- Golden samples: `references/test-payloads/server/test_data/support_ticket/onTicketUpdate.json` and `.../service_ticket/onTicketUpdate.json`

## 1. Stable envelope (all product serverless events)

Handlers receive the usual top-level object (names may all be present; values vary by product):

| Key | Role |
|-----|------|
| `currentHost` | Subscribed modules, product endpoint URLs |
| `data` | Product-specific payload (see below) |
| `event` | e.g. `"onTicketUpdate"` |
| `iparams` | Installation parameters |
| `region` | Region string |
| `timestamp` | Event time |
| `version` | May appear on some payloads (e.g. `"2.0"`) — do not rely on it for ticket logic |

## 2. What you can rely on in `data` (ticket modules)

For **Support Ticket (Freshdesk)** and **Service Ticket (Freshservice)** samples in this repo, documentation consistently shows:

- `data.actor` — actor metadata when the product supplies it  
- `data.requester` — requester object when supplied  
- `data.ticket` — **ticket snapshot as seen by the event** (subset of API fields is normal)

Treat **`data.ticket` as the post-update snapshot** for fields the product included, **not** as a guaranteed minimal diff.

## 3. Field-level deltas (`changes`, `model_changes`, etc.)

**Gap explicitly closed here (normative for this skill):**

- This skill **does not** define a stable, product-blessed contract that `onTicketUpdate` for **Freshdesk `support_ticket`** or **Freshservice `service_ticket`** will always include `changes`, `model_changes`, `misc_changes`, or `system_changes`, nor which ticket keys appear inside them.
- Other modules in this corpus show a **recurring Freshworks pattern** when change metadata exists: nested `changes` with `model_changes` whose entries are often **attribute name → `[previousValue, newValue]`** (see `references/architecture/freshworks_crm_sales_activities.md` — **CRM / different module**, illustrative only) or an **empty** `model_changes` object (see `references/architecture/freshcaller_caller_agent.md` — **Freshcaller**, not tickets).

**Do not** infer: “because I see keys X/Y under `model_changes`, status or priority changed” **unless** you have captured a real payload from **Simulate** or production for **that** product and confirmed the keys.

### Refusal / uncertainty (mandatory)

If your implementation **requires** knowing which field changed (e.g. only sync on priority change) and:

- `changes` / `model_changes` is **absent**, **empty**, or **not documented** for your product path, then:

1. **Do not guess** from `data.ticket` alone which single field triggered the event (many fields may change together; snapshot may not include previous values).  
2. Respond or implement with **Insufficient platform certainty** unless you add an explicit strategy:  
   - **Snapshot diff:** store last seen ticket (or hash) per id; on `onTicketUpdate`, `GET` ticket via API and diff (REST links in the same architecture docs), or  
   - **Broad handling:** run your logic on every update and document volume/cost, or  
   - **Skip:** no-op when delta metadata is missing if that is acceptable.

## 4. Freshdesk vs Freshservice field naming

| Concern | Freshdesk (`support_ticket`) | Freshservice (`service_ticket`) |
|--------|------------------------------|----------------------------------|
| Naming | Align with **Freshdesk** Tickets API (`GET /api/v2/tickets/[id]`) — e.g. `priority`, `status` in API docs | Align with **Freshservice** Tickets API (`GET /api/v2/tickets/[id]`) — ITSM often uses **urgency** (and may expose `priority` depending on configuration) |
| Rule | Do **not** assume Freshservice **urgency** maps 1:1 to Freshdesk **priority** semantics | Read the live ticket object and **Freshservice** API field definitions for the workspace |

Event `data.ticket` may expose **only a subset** of API fields; use the REST resource as the source of truth when in doubt.

## 5. Golden payloads and FDK Simulate

- Checked-in **skill** samples (for copy-paste / tests): `references/test-payloads/server/test_data/` (see `references/test-payloads/README.md`).  
- **Authoritative for your app:** use the developer portal **Simulate** flow — payload is written under `<app_root>/server/test_data/` (see `references/architecture/app_setup_events_doc.md` / `fdk_test.md`).

When golden JSON in the repo disagrees with a payload you captured from **Simulate** or production, **trust the captured payload** and update your app’s `server/test_data` accordingly.
