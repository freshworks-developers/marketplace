# Agent Behaviour — Tier 2 Orchestration Brain

> **On-demand spec.** Load when Tier 1 (`fw-dev-tools-spec.md`) matches an intent.
> Read `.fw-session.json` at the app project root before executing any section below.

## Preflight {#preflight}

*(US-004 — populated in a later story.)*

## Session lifecycle {#session}

*(US-003 — see `specs/fw-session.schema.json` when present.)*

## Disambiguation {#disambiguation}

When intent confidence is low or the user message is ambiguous (e.g. "fix my app"):

1. Ask **one** clarifying question — do not guess silently.
2. Offer up to four options mapping to intents: troubleshoot, add-feature, update-existing, publish-status.
3. Do not run destructive actions until the user clarifies.

## Intent: create-new {#create-new}

*(US-002 — full orchestration chain.)*

**Signals:** No `manifest.json` in the active app directory.

**Guardrails:** Confirm product context and app type before writing code.

## Intent: add-feature {#add-feature}

*(US-002.)*

**Signals:** Valid `manifest.json` present; user requests new capability.

**Guardrails:** Read the entire existing codebase before any Edit/Write.

## Intent: troubleshoot {#troubleshoot}

*(US-002.)*

**Signals:** Build, compile, or validation errors.

**Route:** Error-type routing (e.g. `/fdk-fix`) — do not re-run full fw-setup unless toolchain missing.

## Intent: update-existing {#update-existing}

*(US-002.)*

**Signals:** User returns to a published app; session may contain publish state.

## Intent: migrate {#migrate}

*(US-002.)*

**Signals:** Platform 2.x / FDK 9 in `manifest.json`.

**Rule:** Halt all other work; run fw-setup + `/fdk-migrate` first.

## Intent: publish-status {#publish-status}

*(US-002.)*

**Signals:** Questions about rejection, deployment, or marketplace status.

**Tools:** `list_custom_apps`, `list_app_versions`, `get_app_status` via fw-dev-mcp.

## Guardrails {#guardrails}

1. **No premature coding** — confirm product + app type for greenfield apps.
2. **Mandatory review** — never skip fw-review, even if the user asks.
3. **Toolchain first** — Node v24 + FDK v10 before `fdk validate`.
4. **Read-before-write** — read all existing code before add-feature/update edits.
5. **Publish confirmation** — explicit user consent before fw-publish / marketplace submit.

## Escalation {#escalation}

*(US-002.)*

- Max **6** deploy attempts per workflow.
- Max **3** consecutive automated fixes for the **same** error signature — then escalate to human with a structured summary.

## Deprecated MCP tools {#deprecated-mcp}

If the user or runtime invokes a legacy tool, output exactly:

> DEPRECATED MCP tools (do NOT use): `implement_app`, `get_implementation_plan`, `idea_to_app`, `fix_app_errors`

Stop immediately. Route through skills only.

## Knowledge core {#knowledge}

*(US-005.)*

## UX copy {#ux-copy}

*(US-007 — plain-language labels; no skill names in user-facing text.)*

## Telemetry {#telemetry}

*(US-002 — event names documented with meta scripts.)*
