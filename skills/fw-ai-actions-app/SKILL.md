---
name: fw-ai-actions-app
description: Expert-level skill for AI Actions and integrations on Freshworks Platform 3.0. Use when (1) Creating actions.json and SMI functions (flat request, nested response), (2) Request templates and third-party API integration, (3) Pre-build validation (pricing, paywalls, account prerequisites), (4) Failure-case validation and test data guardrails, (5) Debugging broken endpoints, (6) Integration implementation checklist (auth, base URL, request body, trigger-friendly schema), (7) Scoping and planning new integrations (and comparing only when user asks).
version: "1.0.0"
compatibility: Freshworks Platform 3.0, FDK 10.x, Node.js 24.x
---

# AI Actions Skill for Freshworks Platform 3.0

You are an AI Actions specialist for Freshworks Platform 3.0. **This file is the orchestrator:** keep it short; load detail from **`rules/`** and **`references/`** below instead of restating long guides here.

## Core Rules

- **NEVER assume API endpoints** — confirm third-party API documentation before request templates (`rules/ai-actions-api-docs.mdc`).
- **Request parameters MUST stay flat** — no nested objects; **arrays of primitives** allowed when needed; **no arrays of objects** (`references/ai-actions-core.md`).
- **Response schemas CAN be nested** — include only essential fields.
- **Function names MUST match exactly** — case-sensitive between `actions.json` and `server.js`.
- **Construct nested structures in `server.js`** — not in request schemas.
- **Use request templates** — `$request.invokeTemplate` for external HTTP (`rules/ai-actions-requests.mdc`).
- **Credentials** — never hardcode secrets; iparams (`secure: true`) or OAuth only (`rules/ai-actions-api-docs.mdc`).
- **Validate before finalizing** — `fdk validate` and FDK test server (`rules/ai-actions-validation.mdc`).
- **Toolchain before validate** — same gate as **`../fw-app-dev/SKILL.md`** (*Manifest + toolchain gate*): **`fw-setup`** when **Node 24.x + FDK 10.x** is missing; **`/fdk-migrate`** (or manual **2.x → 3.0**) before validate on legacy apps; align **`manifest.json`** engines upward on mismatch; **never** downgrade to **FDK 9 / Node 18** instead of setup/migrate (except **LAST RESORT** in **fw-app-dev** `SKILL.md`).

---

## App directory (Q1)

Before reading files or running **`fdk validate`**, determine the app directory the same way as **fw-app-dev** **`/fdk-fix` Step 1** — [`../fw-app-dev/commands/fdk-fix.md`](../fw-app-dev/commands/fdk-fix.md) (*Determine app directory*):

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to use.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

All paths below (`actions.json`, `manifest.json`, `server/server.js`, `config/*`, etc.) and **`fdk validate`** / FDK server commands run from **`<app-directory>`** (same as `cd <app-directory> && fdk validate` in fw-app-dev), not the IDE workspace root unless they coincide.

---

## App Architecture

**AI actions apps do not need the app folder.** Use only:

```
fw-ai-actions-app/
├── actions.json
├── server/server.js
├── server/test_data/actionName.json
├── config/requests.json
├── config/iparams.json
└── manifest.json
```

**Manifest:** Declare **common** (`requests`, **functions**) plus supported product modules as empty objects (e.g. `"support_ticket": {}`). Do not strip module keys. **Engines:** `"node": "24.11.0"`, `"fdk": "10.0.0"` unless the project specifies otherwise (`rules/ai-actions-platform.mdc`).

---

## Modules / supported-modules source (when provided by the project)

The project may supply a CSV/spec listing **Modules Supported** per app. Use it when scoping, building, or validating: declare exactly those modules in `manifest.json` (no `location` / `url` / `icon` for AI-only apps). If missing, infer from product category (ITSM/ESM) and confirm with the user.

---

## Instructions

1. **Docs first** — Search and fetch official API documentation before implementing (`rules/ai-actions-api-docs.mdc`).
2. **Schemas** — Flat `parameters`, pragmatic `response` (`rules/ai-actions-schemas.mdc`, `references/ai-actions-quick-reference.md`).
3. **Server** — `renderData`, `$request.invokeTemplate`, map flat args to API payloads in code (`rules/ai-actions-server.mdc`).
4. **Config** — `requests.json`, `iparams.json`, manifest (`rules/ai-actions-requests.mdc`, `rules/ai-actions-platform.mdc`).
5. **Test data** — Realistic payloads under `server/test_data/`; no secrets (`rules/ai-actions-test-data.mdc`).
6. **Checklists & debugging** — Failure cases, broken endpoints, integration and scoping flows (`references/ai-actions-guide.md`).
7. **Concepts** — Short primer (`references/ai-actions-core.md`).

---

## Output Format

Deliverables follow this layout:

```
app-root/
├── actions.json
├── manifest.json
├── server/server.js
├── server/test_data/<functionName>.json
├── config/requests.json
├── config/iparams.json
└── README.md   (when documenting the app — `rules/ai-actions-readme.mdc`)
```

**Flat request excerpt:**

```json
"properties": {
  "ticket_subject": { "type": "string", "description": "Subject line" },
  "priority_id": { "type": "integer", "description": "Vendor priority id" }
}
```

**Handler contract:** `exports` keys match `actions.json` keys; success `renderData(null, data)`; errors `renderData({ status, message }, null)`; sanitize user-visible errors when APIs return noisy payloads (`rules/ai-actions-server.mdc`).

---

## Example

**Prompt:** “Add `escalateTicket` for our ITSM API with `ticket_id` and `team_id`.”

**Flow:** Obtain API docs → flat `ticket_id`, `team_id` in `parameters` → implement handler and request template → test data → `fdk validate`. Do not nest request parameters to mimic vendor JSON.

---

## Skeleton templates

- **`scripts/ai-actions-skeleton/`** — minimal starter (actions, config, server stub).
- **`assets/templates/ai-actions-skeleton/`** — fuller example (e.g. manifest, sample actions).

---

## When to use / not use

**Use** for AI Actions, SMI, templates, integrations, validation, and scoping.

**Do not use** for general Freshworks app UI-only work — use the **`fw-app-dev`** skill (`skills/fw-app-dev/` in this repo).

---

## References

| Location | Role |
|----------|------|
| `rules/ai-actions-*.mdc` | Scoped rules (platform, schemas, server, requests, validation, test data, README, API docs) |
| `references/ai-actions-guide.md` | Long-form guide, mistakes, debugging |
| `references/ai-actions-quick-reference.md` | One-page patterns |
| `references/ai-actions-core.md` | Core constraints (also glob-scoped) |

---

## Summary

Flat requests; nested responses where needed; matching names; templates for HTTP; iparams/OAuth for secrets; validate and test before handoff.
