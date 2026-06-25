# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This repo is the **Freshworks Agentic Developer Toolkit** (npm package `@freshworks/fw-dev-tools`). It ships five AI coding skills (Markdown `SKILL.md` packages) plus an installer CLI that deploys them into Cursor, Claude Code, and OpenAI Codex. The skills themselves have **no build step** — they are content. The Node-based installer, version-bump script, and test suite are the only executable code.

Authoritative contributor docs: `AGENTS.md` (routing + repo norms, inventory of rules/commands), `CONTRIBUTING.md` (skill structure, PR process), `tests/TESTING.md` (test layers). Read those before non-trivial edits; this file is the orientation layer.

## Commands

Two separate npm workspaces — `tests/` (skill content checks) and `installer/` (CLI lifecycle). Run from within each directory.

```bash
# Static + regex tests for skill content (CI, no LLM, no API key) — run before any PR
cd tests && npm install && npm test

# Installer lifecycle tests (CI, Node 24)
cd installer && npm install && npm test

# LLM behavioral evals — required for SKILL.md / command / .meta.template.json edits (local only)
cd tests && ANTHROPIC_API_KEY=sk-... npm run eval        # writes all-tests-report.html
cd tests && npm run eval:cursor                          # eval against Cursor CLI
# In Claude Code/Cursor you can instead ask: "Run the skill evals" (no API key needed)

# Docs hygiene (recommended when touching plugin JSON or link-heavy docs)
python3 scripts/check-internal-links.py
bash scripts/check-marketplace-versions.sh

# Smoke-test the installer against your branch
npx @freshworks/fw-dev-tools install
```

Version bumps go through `npm version` at the repo root, which runs `scripts/bump-version.mjs` (the `version` script in root `package.json`). That single script propagates the root version into `installer/package.json`, every skill's `SKILL.md` frontmatter `version:`, and all plugin manifests. **Never hand-edit version numbers** in those files.

## Architecture

### Skill catalog (`skills/`)

Five skill packages, used in this end-to-end order:

**fw-setup → fw-app-dev / fw-ai-actions-app → fw-review (MANDATORY) → fw-publish**

| Skill | Purpose | Commands |
|-------|---------|----------|
| `fw-setup` | Install/manage FDK 10.x + Node 24.x via nvm; PATH/shell troubleshooting | `/fw-setup-install`, `-upgrade`, `-downgrade`, `-uninstall`, `-status`, `-troubleshoot`, `-use` |
| `fw-app-dev` | Build/debug/review/migrate Platform 3.0 apps (UI, serverless, OAuth) | `/fdk-fix`, `/fdk-migrate`, `/fdk-refactor` |
| `fw-ai-actions-app` | AI Actions + third-party integrations (`actions.json`, SMI, request templates) | none (orchestrated in `SKILL.md`; prompts under `agents/`) |
| `fw-review` | Marketplace pre-submission review; deterministic checks via `scripts/*.js`, structured report | none (pipeline in `SKILL.md`) |
| `fw-publish` | `fdk validate → pack → upload → submit` via MCP | none (playbooks in `SKILL.md` + `references/`) |

`skills/shared/` holds the cross-skill `.meta.template.json` metrics contract and its writer scripts (`meta-init.sh`, `meta-update.sh`, `meta-feedback.sh`, `meta-delete.sh`) plus `check-update.sh`.

### Skill package layout

Each skill follows the Agent Skills Spec:

```
skills/<name>/
├── SKILL.md          # required — YAML frontmatter (name, version, description, compatibility) + body
├── README.md
├── .cursor-plugin/plugin.json   # rulesDirectory ./rules, commandsDirectory ./commands
├── commands/         # one .md per slash command (filename = command name)
├── rules/            # .mdc (Cursor, with name/description/globs/alwaysApply frontmatter) or .md (fw-review audit rules)
├── references/       # on-demand docs
├── agents/ / assets/ # optional
```

Single source of truth: rules and commands live under each skill's `rules/`/`commands/`; the plugin JSON points there — do not duplicate trees under a nested `.cursor/` inside skills. The full per-skill inventory of rules and commands lives in `AGENTS.md` and **must be kept aligned** when files are added/renamed.

### Install pipeline (`installer/`)

`npx @freshworks/fw-dev-tools install` (CLI entry `installer/bin/cli.js`, commander) auto-detects IDEs and copies skills to per-IDE paths, writes the routing spec `installer/src/specs/fw-dev-tools-spec.md` to always-loaded locations, and merges MCP config. Commands: `install` (`--tools cursor,claude,codex`, `--yes`), `update`, `status`, `uninstall`. Per-IDE client logic lives in `installer/src/clients/{cursor,codex,claude}.js`.

Per-IDE skill install paths (defined by the routing spec — never mix across IDEs):

| IDE | Skill path |
|-----|------------|
| Cursor | `~/.cursor/skills/fw-<name>/SKILL.md` |
| Codex | `~/.codex/skills/fw-<name>/SKILL.md` |
| Claude Code | `~/.fw-dev-tools/skills/fw-<name>/SKILL.md` (loaded via installed plugin, `/fw-<name>`) |

Install state (tooling, not per-app) lives at `~/.fw-dev-tools/.meta.json`; `check-update.sh` updates its `update_check` fields.

### MCP (publish)

`.mcp.json` at the repo root is the canonical config for the `fw-dev-mcp` server: `https://mcp.freshworks.dev/mcp` with `Authorization: Bearer ${user_config.mcp_auth_token}` (a one-time Developer Portal JWT). `fw-publish` drives publish through this server's MCP tools (documented in `skills/fw-publish/references/openai-server-mcp-tools.md`). Deprecated MCP tools — do **not** use: `implement_app`, `get_implementation_plan`, `idea_to_app`, `fix_app_errors` (use `fw-app-dev` instead).

## Conventions

- **Editing a skill:** match existing markdown/plugin patterns; keep diffs small and focused. After changing `rules/` or `commands/`, update the inventory in `AGENTS.md` and the `rulesPath`/`commandsPath` in `.cursor-plugin/marketplace.json` and `.claude-plugin/marketplace.json`. Rule `.mdc` `name:` must match its filename.
- **Behavioral edits** to any `SKILL.md`, command file, or `.meta.template.json` require running the LLM evals and attaching `tests/all-tests-report.html` (eval report) to the PR.
- **Toolchain pins:** if you change FDK/Node guidance in `skills/fw-setup`, also update `docs/engine-matrix.md`.
- **`.meta.json`** writes go only through the `skills/shared/scripts/meta-*.sh` scripts — never hand-write the JSON; each skill touches only its own block; `skill_version` comes from the active `SKILL.md` `version:` field, not `plugin.json`. Never mention `.meta.json` to end developers.
- **PR titles** use conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`). `tests/` static tests must pass locally before opening a PR.
- **Examples in skills** must use Platform 3.0 patterns only (`"platform-version": "3.0"`, `modules` not `product`, external HTTP via `$request.invokeTemplate` + `config/requests.json`), never real secrets — use placeholders like `<%= iparam.api_key %>`.
- **New static tests** must be cross-platform: use the `grepFiles()` Node helper (not shell `grep`), guard `.sh` invocations with `{ skip: process.platform === 'win32' }`, and build paths with `join()`.
