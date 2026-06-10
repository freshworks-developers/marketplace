# Contributing to Freshworks Marketplace Skills

Thank you for your interest in contributing to the Freshworks Marketplace Skills repository! This project provides AI coding assistant skills for building Freshworks Platform 3.0 marketplace applications.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Changes](#submitting-changes)
- [Development Guidelines](#development-guidelines)
  - [Skill Structure](#skill-structure)
  - [Rule Files (.mdc)](#rule-files-mdc)
  - [Commands](#commands)
  - [References](#references)
- [Testing Your Changes](#testing-your-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.MD). By participating, you are expected to uphold this code. Please report unacceptable behavior to devrels@freshworks.com.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/fw-dev-tools.git
   cd fw-dev-tools
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Repository Structure

```
fw-dev-tools/
├── .mcp.json                 # Bundled MCP: fw-dev-mcp (URL + Authorization)
├── .claude/                  # (gitignored) Local Claude Code project settings if you use them
├── .cursor/                  # (gitignored) Cursor IDE workspace state
│   └── rules/                # User-specific workspace rules (local, not versioned)
├── .claude-plugin/           # Claude Code plugin config
├── .cursor-plugin/           # Cursor plugin config
├── .codex-plugin/            # OpenAI Codex plugin manifest (skills + MCP pointers)
├── .agents/                  # (gitignored) Local IDE workspace state
│   └── plugins/              # Codex repo marketplace catalog (local, not versioned)
├── assets/                   # Dew logo (`fw-logo.svg`) for plugin manifests
├── docs/                     # Engine matrix, network requirements
├── skills/
│   ├── fw-app-dev/           # Core app development skill
│   │   ├── SKILL.md          # Main skill definition
│   │   ├── README.md         # Skill documentation
│   │   ├── commands/         # Slash commands (/fdk-fix, /fdk-migrate, etc.)
│   │   ├── references/       # Documentation loaded on-demand
│   │   └── assets/           # Templates and resources
│   ├── fw-ai-actions-app/    # AI Actions + third-party integrations (skill id: fw-ai-actions-app; actions.json, SMI)
│   ├── fw-review/            # Automated app review (rules + scripts, structured report)
│   ├── fw-setup/             # FDK + Node install / lifecycle (nvm)
│   └── fw-publish/           # Marketplace publish (MCP) guidance
├── scripts/                  # Build and utility scripts
├── AGENTS.md                 # Agent entry point (routing + repo norms)
├── CODE_OF_CONDUCT.MD        # Community guidelines
└── README.md                 # Repository overview
```

## How to Contribute

When you add, remove, or rename files under any skill’s **`rules/`** or **`commands/`**, update the **Rules and slash commands (inventory)** section in **[`AGENTS.md`](AGENTS.md)** so Cursor / Claude **`rulesPath`** / **`commandsPath`** in **`.cursor-plugin/marketplace.json`** and **`.claude-plugin/marketplace.json`** stay aligned with what ships.

**FDK / Node version truth** should match **`docs/engine-matrix.md`** whenever you change toolchain guidance in **`skills/fw-setup/SKILL.md`**.

### Reporting Bugs

Use **[ISSUES.md](ISSUES.md)** at the repo root: the **mandatory issue body template** and checklists there are required for GitHub issues (see that file for details).

Before submitting:
1. Check existing [issues](https://github.com/freshworks-developers/fw-dev-tools/issues) to avoid duplicates
2. Use the latest version of the skills

When reporting bugs, include:
- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (Cursor version, Claude Code / Codex if relevant, FDK version, Node.js version)
- **Error messages** or validation output if applicable
Beyond the mandatory template, a good report still has a **clear title**, **steps to reproduce**, and **expected vs actual** behavior.

### Suggesting Features

Feature requests are welcome! Please include:
- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought about

### Submitting Changes

We accept contributions for:
- Bug fixes
- New commands
- Documentation improvements
- New reference files
- Rule enhancements
- Template additions

## Development Guidelines

### Skill Structure

Each skill follows the Agent Skills Specification. In **this repo**, editor rules live under **`skills/<name>/rules/`** (not nested under **`skills/<name>/.cursor/rules`**). The Cursor skill bundle uses **`skills/<name>/.cursor-plugin/plugin.json`** with **`rulesDirectory`** / **`commandsDirectory`** pointing at **`./rules`** and **`./commands`** beside **`SKILL.md`**.

```
skill-name/
├── SKILL.md                 # Required: Main skill file with YAML frontmatter
├── README.md                # User-facing documentation
├── .cursor-plugin/
│   └── plugin.json          # rulesDirectory ./rules, commandsDirectory ./commands
├── commands/                # Optional: Slash commands (/fdk-fix, /fdk-migrate, …)
│   └── command.md           # One file per command
├── rules/                   # Optional: Cursor rules (.mdc) or fw-review audit rules (.md)
│   └── rule-name.mdc
├── references/              # Optional: On-demand documentation
│   ├── api/
│   ├── errors/
│   └── ...
└── assets/                  # Optional: Templates, icons
    └── templates/
```

### SKILL.md Format

```markdown
---
name: skill-name
description: Brief description of what the skill does and when to use it
compatibility: Platform versions, FDK versions, Node versions
---

# Skill Title

Instructions and content for the AI assistant...
```

### Rule Files (.mdc)

Cursor rules use `.mdc` format with YAML frontmatter:

```markdown
---
name: rule-name              # Must match filename (without .mdc)
description: What this rule covers
globs: ["**/pattern/*.js"]   # Optional: Auto-trigger on file patterns
alwaysApply: true            # true = always loaded, false = on-demand
---

# Rule Content

Detailed instructions, patterns, and examples...
```

**Naming convention**: The `name` field must match the filename:
- File: `my-rule.mdc` → `name: my-rule`

### Commands

Commands are markdown files in `commands/` directory:

```markdown
# Command Name

Brief description of what the command does.

## Step 1: First Step

Instructions...

## Step 2: Second Step

Instructions...
```

**Command naming**:
- Filename becomes the command: `migrate.md` → `/migrate`
- Use lowercase with hyphens for multi-word commands

### References

Reference files provide detailed documentation loaded on-demand:

```
references/
├── api/                    # API documentation
│   ├── request-method-docs.md
│   └── oauth-docs.md
├── errors/                 # Error handling guides
│   ├── manifest-errors.md
│   └── oauth-errors.md
├── architecture/           # Platform architecture docs
└── tests/                  # Test patterns (refusal / violations)
    ├── refusal.json
    └── violations.json
```

## Testing Your Changes

### 0. Docs hygiene (optional, recommended)

```bash
python3 scripts/check-internal-links.py
bash scripts/check-marketplace-versions.sh
```

### 1. Validate Skill Structure

Ensure your skill follows the correct structure:
```bash
# Check that SKILL.md exists and has valid frontmatter
head -20 skills/your-skill/SKILL.md
```

### 2. Test in Cursor

1. Copy the skill to your Cursor skills directory:
   ```bash
   cp -r skills/fw-app-dev ~/.cursor/skills/
   ```
2. Open Cursor and verify the skill loads
3. Test commands and rules work as expected

### 3. Smoke-test Claude Code or OpenAI Codex (optional)

- **Claude Code:** Install or copy skills per **README.md**, then verify **`~/.claude/skills/`** layouts and MCP per **AGENTS.md** when testing **fw-publish**.
- **Codex:** From a clone of your branch at repo root, run `codex plugin marketplace add ./` (per **README.md**). Confirm **`skills/*/SKILL.md`** is visible to the assistant and (**fw-publish**) MCP auth matches **`.mcp.json`** / **AGENTS.md** guidance.

### 4. Validate Rules

For rule files, verify:
- `name` field matches filename
- `alwaysApply` is set correctly
- `globs` patterns are valid (if used)

## Pull Request Process

1. **Ensure your changes are complete** and tested locally
2. **Update documentation** if you're changing behavior (**AGENTS.md** skill inventory if **rules/** or **commands/** changed; **docs/engine-matrix.md** if toolchain pins changed)
3. **Run docs hygiene** (`check-internal-links.py`, **`check-marketplace-versions.sh`**) if you touched umbrella plugin JSON (`.cursor-plugin/`, `.claude-plugin/`, `.codex-plugin/`, `.agents/plugins/`) or docs with many links
4. **Create a pull request** with:
   - Clear title describing the change
   - Description of what and why
   - Link to related issues (if any)
   - Screenshots or examples (if applicable)

5. **Address review feedback** promptly
6. **Squash commits** if requested before merge

### PR Title Format

Use conventional commit style:
- `feat: add new /lint command`
- `fix: correct OAuth template structure`
- `docs: update README with examples`
- `refactor: simplify validation workflow`

## Style Guidelines

### Markdown

- Use ATX-style headers (`#`, `##`, `###`)
- Use fenced code blocks with language tags
- Keep lines under 120 characters when possible
- Use consistent list formatting (either `*` or `-`, not both)

### Code Examples

- Always include language tags in code blocks
- Use Platform 3.0 patterns only (no legacy 2.x code)
- Include comments for complex logic
- Show both correct and incorrect examples where helpful:
  ```javascript
  // ❌ WRONG
  $request.post(url, options);

  // ✅ CORRECT
  $request.invokeTemplate('templateName', { context, body });
  ```

### JSON

- Use 2-space indentation
- No trailing commas
- Keys in logical order (platform-version, modules, engines)

### Rule Content

- Start with clear "When to use" guidance
- Use tables for quick reference
- Include concrete examples
- Mark blocking vs non-blocking issues clearly

## Security

When contributing examples or documentation:
- **Never include real API keys, tokens, or secrets**
- Use placeholders like `<%= iparam.api_key %>` or `your-api-key-here`
- Use generic domains like `your-domain.freshdesk.com`
- Mark sensitive iparams with `"secure": true` in examples

## Submission and discovery surfaces

> **Note:** Marketplace listings for Cursor and Claude Code are currently under review.

| Surface | Purpose |
|---------|---------|
| [**Cursor — Publish to Cursor Marketplace**](https://cursor.com/marketplace/publish) | Vendor submission docs and review expectations. |
| [**cursor.directory**](https://cursor.directory/) | Community directory of Cursor tools (optional third-party listing). |
| [**Claude Code — Plugin marketplaces**](https://docs.anthropic.com/en/plugin-marketplaces) | `claude plugin marketplace add …` and team registries. |
| [**OpenAI Codex — Build plugins**](https://developers.openai.com/codex/plugins/build/) | `codex plugin marketplace add …` and plugin layout. |
| [**claudemarketplaces.com**](https://claudemarketplaces.com/) | Independent community catalog — **not** operated by Anthropic; list only if you accept their terms. |

**GitHub topics** for discoverability: `freshworks`, `fdk`, `platform-3.0`, `marketplace`, `cursor-plugin`, `claude-plugin`, `codex-plugin`, `mcp`.

**MCP (publish only):** server id `fw-dev-mcp`, config template `.mcp.json` — do not paste tokens into listings; see **[AGENTS.md](AGENTS.md)**.

---

## Listing kit (maintainers)

Canonical strings for marketplace submission forms. Source of truth is **`.cursor-plugin/plugin.json`**, **`.claude-plugin/plugin.json`**, and **`.codex-plugin/plugin.json`** — bump the table when you change `version` or copy (see **[`scripts/check-marketplace-versions.sh`](scripts/check-marketplace-versions.sh)**).

| Field | Value |
|-------|--------|
| **Plugin id** | `freshworks-dev-tools` |
| **Display name** | Freshworks Agentic Developer Toolkit |
| **Version** | `1.1.0` |
| **Short tagline** | FDK setup, Platform 3.0 apps, AI Actions, and marketplace publish. |
| **Description (umbrella)** | Freshworks Platform 3.0 app development, AI Actions, publishing, and FDK management skills. For MCP: add **fw-dev-mcp** per **[AGENTS.md](AGENTS.md)** (Developer Portal JWT). |
| **Long blurb (Cursor)** | Cursor plugin root for Freshworks skills: **fw-setup** (FDK/nvm), **fw-app-dev** (Platform 3.0 apps), **fw-ai-actions-app** (AI Actions), **fw-publish** (MCP). Copy **`.mcp.json`** from this repository into project **`.cursor/mcp.json`** and add your Developer Portal JWT. |
| **Long blurb (Claude Code)** | Aggregate plugin for Freshworks marketplace development: install and manage FDK with **fw-setup**, build full apps with **fw-app-dev**, AI Actions integrations with **fw-ai-actions-app**, and publish with **fw-publish** via MCP. MCP template: **`.mcp.json`** at repository root; configure Marketplace API token when prompted. |
| **Long blurb (Codex)** | Uses each skill's **`SKILL.md`** (authoritative workflows). Slash commands from Cursor/Claude marketplaces (`/fw-setup-*`, `/fdk-*`) are conventions for those clients; Codex consumes skills plus optional MCP (`.mcp.json`) for **fw-publish**. Typical chain: **fw-setup** → **fw-app-dev** and/or **fw-ai-actions-app** → **fw-review** → **fw-publish** — see **[AGENTS.md](AGENTS.md)**. |
| **Homepage** | `https://github.com/freshworks-developers/fw-dev-tools` |
| **License** | MIT |
| **Category** | developer-tools |
| **Keywords** | `freshworks`, `platform-3.0`, `marketplace`, `fdk`, `app-development`, `mcp`, `crm` |
| **Logo (repo-relative)** | `assets/fw-logo.svg` |
| **Logo (raw URL for forms)** | `https://raw.githubusercontent.com/freshworks-developers/fw-dev-tools/main/assets/fw-logo.svg` |
| **Author** | Freshworks Developers · `skills@dev-assist.freshservice.com` |

**Per-skill Claude plugin names** (install with `claude plugin install <name>@freshworks-developers`):

| Plugin `name` | Display name | Short description |
|---------------|--------------|-------------------|
| `fw-setup` | Freshworks FDK Setup | FDK and Node.js toolchain install and lifecycle via nvm. |
| `fw-app-dev` | Freshworks App Development | Platform 3.0 apps: manifest, requests, OAuth, serverless, and UI. |
| `fw-ai-actions-app` | Freshworks AI Actions | actions.json, SMI handlers, request templates, and API integrations. |
| `fw-review` | Freshworks App Review | Rules + scripts for structured marketplace app audits. |
| `fw-publish` | Freshworks Marketplace Publish | MCP: validate, pack, app-upload, submit/update. |

---

## Questions?

- Check existing [issues](https://github.com/freshworks-developers/fw-dev-tools/issues) and discussions
- Review the [Freshworks Developer Docs](https://developers.freshworks.com/)
- Contact devrels@freshworks.com for additional support

Thank you for contributing!
