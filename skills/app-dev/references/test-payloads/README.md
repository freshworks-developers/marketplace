# Serverless event test payloads (skill corpus)

These JSON files mirror the **FDK convention** (`server/test_data/<module>/...`) so you can **copy** them into a generated app:

```text
<your-app>/
  server/
    test_data/
      support_ticket/    # Freshdesk module name in manifest
      service_ticket/    # Freshservice module name in manifest
```

## Files

| File | Use |
|------|-----|
| `server/test_data/support_ticket/onTicketUpdate.json` | Freshdesk **support_ticket** `onTicketUpdate` — **sample only** |
| `server/test_data/service_ticket/onTicketUpdate.json` | Freshservice **service_ticket** `onTicketUpdate` — **sample only** |

## Important

- Samples are for **structure tests and local mocks**. They are **not** a guarantee of every field the product sends.
- **Authoritative** shapes for your account: capture from **Simulate** or production, per `references/events/onTicketUpdate-payload-contract.md`.

## Reliable vs best-effort (ticket `onTicketUpdate` samples)

| Area | Treat as |
|------|-----------|
| Top-level keys (`currentHost`, `data`, `event`, `iparams`, `region`, `timestamp`) | **Reliable** pattern for serverless envelope |
| `data.actor`, `data.requester`, `data.ticket` when present | **Reliable** that the product included those objects; **best-effort** which subfields appear (subset of API ticket is normal) |
| `data.ticket` alone for “what changed” | **Best-effort only** — snapshot, not a diff |
| `changes` / `model_changes` | **Not represented** in these JSON files; presence or shape is **not** guaranteed — see `references/events/onTicketUpdate-payload-contract.md` |
