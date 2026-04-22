# Agent instructions (Freshworks marketplace skills)

This repository is a **multi-IDE skill marketplace** for AI assistants working on **Freshworks Platform 3.0** marketplace apps. **This file** is the agent entry point and routing layer. For human overview, install URLs, and badges, see **`README.md`**. For contribution layout and conventions, see **`CONTRIBUTING.md`**. For FDK/skill install problems, see **`TROUBLESHOOTING.md`**.

## Which skill to follow

| User goal | Open first | Notes |
|-----------|------------|--------|
| Build, fix, review, or migrate a **Platform 3.0 app** (manifest, requests, OAuth, serverless, UI) | `skills/app-dev/SKILL.md` | **Does not** install FDK or Node |
| Install, upgrade, or troubleshoot **FDK** and **Node** (nvm, PATH, versions) | `skills/fdk-setup/SKILL.md` | Use before relying on `fdk validate` when the toolchain is missing or wrong |

If both apply (new machine + new app): **fdk-setup first**, then **app-dev**.

## Non-negotiables (app work)

When generating or editing **Freshworks apps** (not this repo’s markdown), **`skills/app-dev/SKILL.md`** is authoritative. In short:

- **Platform version** `"3.0"`; **`modules`**, not legacy `product`
- **External HTTP** only via **`$request.invokeTemplate` / `client.request.invokeTemplate`** and **`config/requests.json`** templates (no `$request.post|get|put|delete`)
- **OAuth** uses the **`integrations`** wrapper in `oauth_config.json`
- **`fdk validate`**: **zero** platform errors and **zero** lint errors before calling an app complete; **`README.md`** and **`app/styles/images/icon.svg`** (frontend) where the skill requires them
- **New app engines**: **`fdk` `10.0.1`** and **`node` `24.11.0`** unless **app-dev** `SKILL.md` **LAST RESORT** rules apply

## Repository layout (skills)

- **`skills/{app-dev|fdk-setup}/SKILL.md`** — skill entry and frontmatter
- **`skills/*/rules/*.mdc`** — always-on rules (referenced by plugins)
- **`skills/*/commands/*.md`** — slash-command bodies (IDE-agnostic)
- **`skills/*/references/**`** — load **on demand** (API, errors, events, playbooks); index: `skills/app-dev/references/skill-advanced-topics.md`
- **`skills/*/assets/templates/**`** — app skeletons
- **`.claude-plugin/marketplace.json`**, **`.cursor-plugin/marketplace.json`** — multi-skill registries

**Single source of truth:** rules and commands live under each skill’s `rules/` and `commands/`; IDE plugin JSON points there—do not duplicate command/rule trees under `.cursor/` inside skills.

## Editing this repo (maintenance)

- Prefer **small, focused diffs**; match existing markdown and plugin patterns
- **`CONTRIBUTING.md`** — contribution and structure expectations
- **Skill evaluation tooling** (optional): `.agents/skills/skill-creator/scripts/` (for example `quick_validate.py`, `package_skill.py`)

## Human-facing install

See **`README.md`** for `npx skills add` URLs and Cursor copy paths. **`TROUBLESHOOTING.md`** covers IDE and skill load issues.
