# Freshworks Agentic Developer Toolkit

Managed install. Update with: `npx @freshworks/fw-dev-tools update`

## Update check (once per session)

On the first skill invocation of each session: run `bash ~/.fw-dev-tools/scripts/check-update.sh` and print its output if non-empty. Then proceed normally.

`check-update.sh` writes `update_check` fields (`lastChecked`, `lastNudged`, `latestVersion`, `updateAvailable`) to **`~/.fw-dev-tools/.meta.json`** (install state). Do **not** write `update_check` to per-app `<app-dir>/.meta.json` — that file is for skill metrics only (`meta-init.sh` / `meta-update.sh`).

## IDE skill paths (MANDATORY)

Read fw-dev-tools skills **only** from the install path for your IDE. Never mix paths across IDEs.

| IDE | Skill path |
|---|---|
| **Cursor** | `~/.cursor/skills/fw-<name>/SKILL.md` |
| **Codex** | `~/.codex/skills/fw-<name>/SKILL.md` |
| **Claude Code** | `~/.fw-dev-tools/skills/fw-<name>/SKILL.md` — loaded via installed plugin (`/fw-<name>`); |

## Which skill to use

| Goal | Skill |
|---|---|
| Build, fix, review, or migrate a Platform 3.0 app | `skills/fw-app-dev/SKILL.md` |
| AI Actions integrations (actions.json, SMI, request templates) | `skills/fw-ai-actions-app/SKILL.md` |
| Structured app review (iparams, frontend, script checks, report) | `skills/fw-review/SKILL.md` |
| Install, upgrade, or troubleshoot FDK and Node (nvm, PATH) | `skills/fw-setup/SKILL.md` |
| Publish a built app to the marketplace | `skills/fw-publish/SKILL.md` |

**End-to-end order:** fw-setup → fw-app-dev / fw-ai-actions-app → fw-review (MANDATORY) → fw-publish

## Non-negotiables

- Platform version `"3.0"`; use `modules` not legacy `product`
- New UI apps: React Meta default (`metaConfig.framework: "react"`, DEW); vanilla Crayons only when explicitly requested
- External HTTP only via `$request.invokeTemplate` and `config/requests.json` templates
- `fdk validate`: zero platform errors and zero lint errors before complete
- fw-review is MANDATORY before fw-publish — never skip it
- Per-app `<app-dir>/.meta.json`: write **only** via `meta-init.sh` / `meta-update.sh` (and `meta-feedback.sh` / `meta-delete.sh` for publish) — **never** hand-write or Edit/Write the file; `skill_version` from the active skill's `SKILL.md` `version:` field, not `plugin.json`
- MCP boundary: build/fix/review/migrate via skills only; publish via fw-publish + MCP publish tools; **`get_developer_docs`** is the **PRIMARY** documentation source for platform questions (fall back to skill references if MCP unavailable)
- Legacy MCP build tools (`implement_app`, `get_implementation_plan`, `idea_to_app`, `fix_app_errors`) return a **deprecation contract** on the server — if invoked, follow the redirect to fw-app-dev (do not retry the tool)
