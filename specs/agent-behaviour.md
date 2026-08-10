# Agent Behaviour — Tier 2 Orchestration Brain

> **On-demand spec.** Load when Tier 1 (`fw-dev-tools-spec.md`) matches an intent.
> Read `.fw-session.json` at the app project root before executing any section below.

## Preflight {#preflight}

*(US-004 — populated in a later story.)*

## Session lifecycle {#session}

**File:** `<app-project-root>/.fw-session.json`  
**Schema:** `specs/fw-session.schema.json` (validate structure before write)

### Read rules

1. **Every interaction** — read `.fw-session.json` at the app project root before classifying or dispatching skills.
2. **Scope** — session applies to the **active app directory only** (where `manifest.json` lives or will be created). Never read or write session files from parent monorepos or sibling app folders.
3. **Missing file** — treat as fresh workflow; create on first milestone write.
4. **Corrupt or invalid JSON** — do not guess contents. Tell the user: "Your saved progress file looks damaged — I can start fresh or you can fix `.fw-session.json` manually." Offer **start fresh** (delete file) before continuing.
5. **Cross-IDE** — same schema across Cursor, Claude Code, and Codex; no IDE-specific fields.

### Write rules

1. **Milestones** — commit session updates when reaching: intent classification, `validate_passed`, `review_passed`, `migrate_complete`, publish attempt, escalation counter change, or phase transition.
2. **Required fields** — always set `schema_version` (`"1.0.0"`), `intent`, `progress.phase`, and `updated_at` (ISO8601 UTC).
3. **Progress** — append milestone strings to `progress.milestones` (e.g. `validate_passed`, `review_passed`); set `progress.app_type` when product/app type is confirmed.
4. **Publish block** — populate `publish` after first marketplace submit attempt (`tracking_id`, `last_version`, `last_status`).
5. **Escalation block** — update `escalation.deploy_attempt_count` (max 6) and `fix_attempt_count` (max 3 per error signature); reset fix count when `last_error_signature` changes.
6. **Size** — keep file under ~32KB; do not store logs, diffs, or source code in session.
7. **Secrets prohibited** — never write API keys, OAuth tokens, iparam values, or credentials. Session is world-readable in dev workspaces.

### Example (minimal)

```json
{
  "schema_version": "1.0.0",
  "intent": "create-new",
  "progress": {
    "phase": "validate",
    "milestones": ["setup_complete", "validate_passed"],
    "app_type": "platform-3-react"
  },
  "updated_at": "2026-08-10T10:00:00.000Z"
}
```

## Disambiguation {#disambiguation}

Use this section when Tier 1 cannot classify with confidence, or the user message matches a **vague trigger** below.

### Rules

1. Ask **exactly one** clarifying question — never guess silently.
2. Present **up to four** intent options as plain-language choices (text labels, not skill names).
3. Do **not** run destructive actions (Edit/Write, publish, migrate) until the user picks a path.
4. If the user ignores clarification or stays ambiguous after one turn, **stop** — do not proceed with destructive work. Offer to restate options or escalate.
5. If the user spans two intents, address the **primary** intent first; note the secondary in session when available.

### Vague triggers → clarifying question

| User phrase (examples) | Clarifying question template | Options (max 4) |
|------------------------|------------------------------|-----------------|
| "fix my app" | "I can help — what kind of fix do you need?" | troubleshoot (build error) · add-feature · update-existing · publish-status |
| "help with my app" | "What would you like to do with your app?" | create-new (no app yet) · add-feature · troubleshoot · publish-status |
| "update my app" | "Do you want to add a feature, fix an error, or update a published version?" | add-feature · troubleshoot · update-existing · migrate |
| "something wrong" / "not working" | "Is this a build/validation error, or a marketplace publish issue?" | troubleshoot · publish-status |
| "continue" / "keep going" (no session) | "I don't have saved progress yet — are you building new, fixing, or checking publish status?" | create-new · troubleshoot · publish-status |

### Response format

After the user selects an option, restate the chosen intent in plain language (e.g. "Got it — I'll troubleshoot the build error") and load the matching intent section (`#troubleshoot`, etc.).

### Compound requests

When a message contains two intents (e.g. "add a feature and publish"), confirm the **sequence**: implement feature first (`#add-feature`), then offer review/publish — never publish before review.

### Escalation after one turn

If still ambiguous after one clarifying exchange, respond:

> "I'm not sure which path you mean. Please pick one: fix a build error, add a feature, update a published app, check publish status, or start a new app."

Do not default to code changes or publish.

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
