# Serverless product events — reference index

## Ticket lifecycle (Freshdesk & Freshservice)

| Topic | Location |
|--------|-----------|
| Freshdesk Support Ticket — events, REST, examples | `references/architecture/freshdesk_support_ticket.md` |
| Freshservice Service Ticket — events, REST, examples | `references/architecture/freshservice_service_tickets.md` |
| **`onTicketUpdate` envelope, delta uncertainty, FD vs FS fields** | **`references/events/onTicketUpdate-payload-contract.md`** |
| Copy-paste / mock JSON (skill-maintained samples) | `references/test-payloads/README.md` |

## App lifecycle & schedules

- `onAppInstall` / `onAppUninstall` / `afterAppUpdate`: manifest + `server/server.js` patterns in **SKILL.md** and `rules/freshworks-platform3.mdc`.
- Scheduled work: `$schedule.create()` only (not manifest-scheduled events) — see **SKILL.md** serverless section and `references/architecture/scheduled_events_doc.md`.

## Simulation & test data

- FDK **Simulate** writes payloads to `<app>/server/test_data/` — `references/architecture/app_setup_events_doc.md`, `references/architecture/fdk_test.md`.
- Skill-maintained copy-paste samples: `references/test-payloads/README.md`.

## Integration playbooks

- `references/playbooks/README.md` — Slack Incoming Webhook (hybrid) and Microsoft Graph (account OAuth) end-to-end.
