# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a skill repository for AI coding assistants (Claude Code, Cursor) that provides Freshworks Platform 3.0 marketplace app development guidance. The repository contains two main skills:

- **app-dev**: Core skill for building, debugging, reviewing, and migrating Freshworks Platform 3.0 apps
- **fdk-setup**: Automated FDK (Freshworks Development Kit) installation and version management with Node.js via nvm

## Architecture

### Multi-IDE Skill Structure (IDE-Agnostic)

Each skill follows the Agent Skills Specification with IDE-agnostic core structure:

```
skills/
├── app-dev/
│   ├── SKILL.md                    # Core skill (IDE-agnostic)
│   ├── README.md
│   │
│   ├── .claude-plugin/
│   │   └── plugin.json             # Claude Code plugin config
│   │
│   ├── .cursor-plugin/
│   │   └── plugin.json             # Cursor config WITH rulesDirectory/commandsDirectory
│   │
│   ├── commands/                   # ✅ IDE-agnostic slash commands (single source)
│   │   ├── fdk-fix.md
│   │   ├── fdk-migrate.md
│   │   ├── fdk-refactor.md
│   │   └── fdk-review.md
│   │
│   ├── rules/                      # ✅ IDE-agnostic rules (single source, no .cursor/rules)
│   │   ├── freshworks-platform3.mdc
│   │   ├── validation-workflow.mdc
│   │   ├── async-patterns.mdc
│   │   └── ...
│   │
│   ├── references/                 # Progressive disclosure documentation
│   │   ├── api/
│   │   ├── errors/
│   │   ├── events/
│   │   ├── playbooks/
│   │   └── test-payloads/
│   │
│   └── assets/templates/           # App templates
│
└── fdk-setup/
    ├── SKILL.md
    ├── .claude-plugin/plugin.json
    ├── .cursor-plugin/plugin.json  # WITH rulesDirectory/commandsDirectory
    ├── commands/                   # ✅ IDE-agnostic (single source)
    ├── rules/                      # ✅ IDE-agnostic (single source)
    ├── references/
    └── scripts/
```

**Key Architecture Principles:**

- **Single Source of Truth**: `rules/` and `commands/` exist once per skill at root level (no duplication in `.cursor/` subdirectories)
- **IDE Plugin Configs**: Each skill has both `.claude-plugin/` and `.cursor-plugin/` directories that declare WHERE rules/commands live
- **No Duplication**: IDE-specific plugin configs reference the shared `rules/` and `commands/` directories

### Plugin System

The repository supports multiple IDEs via plugin manifests:

**Skill-Level Plugin Configs:**
- `skills/{skill}/.claude-plugin/plugin.json` - Claude Code skill configuration
- `skills/{skill}/.cursor-plugin/plugin.json` - Cursor skill configuration with `rulesDirectory` and `commandsDirectory` paths

**Root-Level Aggregators:**
- `.claude-plugin/marketplace.json` - Claude Code multi-skill registry
- `.cursor-plugin/marketplace.json` - Cursor multi-skill registry with explicit `rulesPath` and `commandsPath`

**Plugin Config Structure (Cursor):**
```json
{
  "name": "app-dev",
  "rulesDirectory": "./rules",        // ✅ Points to IDE-agnostic rules/
  "commandsDirectory": "./commands",  // ✅ Points to IDE-agnostic commands/
  "commands": [/* command metadata */]
}
```

Skills are self-contained and declarative via `SKILL.md` frontmatter

### Progressive Disclosure

Skills use progressive disclosure to minimize context:
- Core instructions are in `SKILL.md`
- Extended documentation is loaded on-demand from `references/`
- Command files define standalone slash commands
- Rule files (.mdc) provide editor-specific guidance

## Development Workflows

### Validating Skill Structure

Check that a skill has valid frontmatter:
```bash
head -20 skills/app-dev/SKILL.md
```

### Testing Skills Locally

For Cursor:
```bash
cp -r skills/app-dev ~/.cursor/skills/
```

For Claude Code:
```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill app-dev
```

### Skill Evaluation (skill-creator tooling)

The `.agents/skills/skill-creator/` directory contains Python scripts for skill evaluation:

```bash
# Quick validation
python3 .agents/skills/skill-creator/scripts/quick_validate.py

# Package a skill
python3 .agents/skills/skill-creator/scripts/package_skill.py

# Run evaluation loop
python3 .agents/skills/skill-creator/scripts/run_loop.py

# Aggregate benchmarks
python3 .agents/skills/skill-creator/scripts/aggregate_benchmark.py

# Generate reports
python3 .agents/skills/skill-creator/scripts/generate_report.py
```

## Platform 3.0 Enforcement

### Critical Rules

**app-dev** skill enforces Platform 3.0 patterns with zero tolerance:

1. **Platform version**: Must be `"3.0"` (never `"2.3"`, `"2.2"`, `"2.1"`)
2. **Manifest structure**: Use `"modules": {}` (never `"product": {}`)
3. **Request templates**: Use `$request.invokeTemplate()` (never `$request.post/get/put/delete()`)
4. **OAuth**: Must have `integrations` wrapper in `oauth_config.json`
5. **Validation**: Every app must pass `fdk validate` with ZERO errors (platform + lint)
6. **README.md**: Every app MUST have a README.md file before validation
7. **Icon.svg**: Frontend apps MUST have `app/styles/images/icon.svg`

### FDK Version Matrix

**fdk-setup** skill manages FDK versions:

- **FDK 10.x + Node 24.x**: Recommended, required for marketplace publishing (supported until Dec 2027)
- **FDK 9.x + Node 18.x**: Allowed for development only, DEPRECATED (ends March 2026)

New apps MUST start with `"fdk": "10.0.1"` and `"node": "24.11.0"` in `manifest.json` engines.

## Security Guidelines

When documenting examples:
- API keys: use `your-api-key-here` or `<%= iparam.api_key %>` placeholders
- OAuth client IDs/secrets: use `client_id_placeholder`, never real values
- Domain names: use `your-domain.freshdesk.com` or `your-domain.freshservice.com`
- Never include real tokens, passwords, or credentials
- Use `<%= iparam.name %>` and `<%= oauth_iparams.name %>` for config references

## Contributing

When adding or modifying skills:

1. Follow the Agent Skills Specification structure
2. Ensure `SKILL.md` has valid YAML frontmatter with `name`, `description`, `compatibility`
3. Use `.mdc` format for Cursor rule files with matching `name` field and filename
4. Test skills locally before committing
5. Use conventional commit style for PR titles (`feat:`, `fix:`, `docs:`, `refactor:`)
6. Keep lines under 120 characters when possible
7. Mark Platform 3.0 violations with ❌ and correct patterns with ✅

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines.

## Key Commands

### FDK Operations (via fdk-setup skill)

```bash
/fdk-setup-install              # Install FDK 10.x with Node 24 (Confluence /fdk-setup install)
/fdk-setup-install --version 10.1.0  # Pin FDK 10.x.y (CDN v10.1.0.tgz)
/fdk-setup-upgrade              # Upgrade to latest FDK 10 line on Node 24.11
/fdk-setup-upgrade --to 10.1.0  # Pin FDK semver (CDN v10.1.0.tgz)
/fdk-setup-migrate              # FDK 9 + Node 18 → FDK 10 + Node 24.11
/fdk-setup-downgrade            # FDK 9 latest line on Node 18 (deprecated)
/fdk-setup-downgrade 9.6.0      # Pin FDK 9.x.y (CDN v9.6.0.tgz)
/fdk-setup-uninstall            # Remove FDK only (keeps Node/nvm; no --all)
/fdk-setup-status               # FDK / Node / nvm (inline)
/fdk-setup-status --verbose     # PATH, npm prefix, nvm aliases, rc snippets
/fdk-setup-troubleshoot         # Diagnose (inline)
/fdk-setup-troubleshoot --fix   # Shell Task: zshrc-safe nvm + FDK 10 on 24.11
/fdk-setup-use                  # Workspace: nvm use + .nvmrc (10 vs 9 stack); inline
/fdk-setup-use 10 ./my-app     # nvm 24.11 in app dir; optional --write-nvmrc
# Legacy aliases: /fdk-install, /fdk-upgrade, /fdk-downgrade, /fdk-uninstall, /fdk-status
```

### App Development (via app-dev skill)

```bash
/fdk-fix                  # Fix validation errors in existing app
/fdk-migrate              # Migrate Platform 2.x app to 3.0
/fdk-refactor             # Refactor app to best practices
/fdk-review               # Review manifest, requests, OAuth config

# Standard FDK CLI commands (require FDK installed)
fdk validate              # Validate app (platform + lint errors)
fdk run                   # Run app locally
fdk create                # Create new app
fdk pack                  # Package app for submission
```

### Background FDK Operations

```bash
# Run FDK in background (non-blocking)
./skills/fdk-setup/scripts/fdk-run-background.sh

# Stop background FDK processes
./skills/fdk-setup/scripts/stop-fdk-shell-tasks.sh
```

## Reference Documentation

Key reference files in `skills/app-dev/references/`:

- **playbooks/**: End-to-end recipes (Slack webhooks, Microsoft Graph OAuth, etc.)
- **events/**: Serverless event payload contracts and examples
- **api/**: API integration patterns and request template docs
- **errors/**: Error classification and fix guidance
- **test-payloads/**: Golden test data for validation

Always start with `playbooks/README.md` for integration recipes, then load only the specific playbook needed.

## Troubleshooting

### Skills Installation & Usage

See **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for:
- Installation issues (Cursor and Claude Code)
- Skills not recognized
- Commands not working  
- Rules not applying
- IDE-specific issues
- Clean reinstall procedures

### FDK Setup Issues

Key insights:
- **FDK version coexistence**: FDK 10 and FDK 9 CAN coexist (isolated per Node version via nvm)
- **Interactive troubleshooting**: When automated fixes fail, agent guides human step-by-step
- **Shell persistence**: #1 troubleshooting issue (works now, fails in new terminal)
- **nvm alias drift**: Use `nvm alias default 24.11` (not bare `24`)

### Interactive Troubleshooting Mode

When automated fixes fail, `/fdk-setup-troubleshoot` enters interactive mode:
- Guides human step-by-step (ONE command at a time)
- Adapts based on actual output
- No retry loops, no support escalation
- Decision tree based on error patterns

See `skills/fdk-setup/references/interactive-troubleshooting-guide.md` for agent protocol.
