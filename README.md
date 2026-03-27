<h1 align="center">Freshworks Marketplace Skills</h1>

<p align="center"><strong>App Development Kit for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Skill-00a67e?style=for-the-badge" alt="Cursor Skill">
  <img src="https://img.shields.io/badge/Crayons-4.x-00a67e?style=for-the-badge" alt="Crayons">
  <img src="https://img.shields.io/badge/FDK-9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/FDK-9.6+-0052cc?style=flat-square" alt="FDK">
  <img src="https://img.shields.io/badge/Plugins-1-764abc?style=flat-square" alt="Plugins">
</p>

<p align="center">Agentic App Development Kit for Freshworks app development.<br>Enforces <strong>Platform 3.0 patterns</strong> with zero tolerance for legacy code.</p>

<p align="center"><code>Platform 3.0</code> · <code>Cursor Plugins</code> · <code>Crayons</code> · <code>Request Templates</code> · <code>OAuth</code> · <code>fdk validate</code></p>

## Installation

### For Cursor:

```bash
npx skills add https://github.com/freshworks-developers/marketplace/skills/app-dev -skill app-dev
```

This installs the **app-dev** skill for building Freshworks Platform 3.0 applications.


## The App Development Skill

**freshworks-app-dev** provides expert-level guidance for building Freshworks Platform 3.0 marketplace applications with zero tolerance for legacy patterns.

**Key Features:**
- ✅ **Platform 3.0 Enforcement** - Zero tolerance for Platform 2.x patterns
- ✅ **Crayons UI Components** - Modern, accessible UI with 25+ components
- ✅ **Request Templates** - Secure HTTP calls with OAuth support
- ✅ **Validation Workflow** - Auto-fix up to 6 iterations
- ✅ **Security Enforcement** - Input validation, XSS prevention, safe logging
- ✅ **App Templates** - Frontend, serverless, hybrid, and OAuth skeletons

**Slash Commands:**
```bash
/migrate    # Migrate Platform 2.x apps to 3.0
/review     # Review app for Platform 3.0 compliance
/fix        # Auto-fix validation errors
/refactor   # Refactor code to Platform 3.0 patterns
```

## Repository Structure

This repository follows a single-skill architecture with comprehensive documentation and tooling:

```
marketplace-main/
├── .claude-plugin/              # Claude Code plugin configuration
│   ├── plugin.json              # Plugin metadata
│   └── marketplace.json         # Marketplace listing
├── .cursor-plugin/              # Cursor IDE plugin configuration
│   ├── plugin.json              # Plugin metadata
│   └── marketplace.json         # Marketplace listing
├── .github/                     # GitHub configuration
│   └── workflows/               # CI/CD workflows
├── skills/                      # Skills directory
│   └── app-dev/                 # Freshworks App Development skill
│       ├── SKILL.md             # Main skill file
│       ├── README.md            # Skill documentation
│       ├── .skillignore         # Files to exclude from skill
│       ├── rules/               # Cursor rules (non-hidden for multi-IDE access)
│       │   ├── security.mdc                      # Security enforcement (zero tolerance)
│       │   ├── freshworks-platform3.mdc          # Platform 3.0 patterns
│       │   ├── validation-workflow.mdc           # Auto-fix workflow
│       │   ├── app-templates.mdc                 # Template selection
│       │   ├── confusion.mdc                     # Disambiguation guide
│       │   ├── async-patterns.mdc                # Async/await patterns
│       │   ├── complexity-reduction.mdc          # Code simplification
│       │   ├── platform3-modules-locations.mdc   # Module & location reference
│       │   └── app-building-blocking-gates.mdc   # Quality gates
│       ├── commands/            # Slash commands
│       │   ├── fdk-migrate.md   # /migrate command
│       │   ├── fdk-review.md    # /review command
│       │   ├── fdk-fix.md       # /fix command
│       │   └── fdk-refactor.md  # /refactor command
│       ├── references/          # Documentation (loaded on demand)
│       │   ├── api/             # API method documentation
│       │   │   ├── request-method-docs.md
│       │   │   ├── interface-method-docs.md
│       │   │   ├── instance-method-docs.md
│       │   │   ├── oauth-docs.md
│       │   │   └── server-method-invocation-docs.md
│       │   ├── architecture/    # Architecture patterns
│       │   │   ├── platform3-manifest-structure.md
│       │   │   ├── request-templates-latest.md
│       │   │   ├── oauth-configuration-latest.md
│       │   │   ├── modular_app_concepts.md
│       │   │   ├── bidirectional-sync-patterns.md
│       │   │   ├── intercept-validation-patterns.md
│       │   │   └── [50+ product-specific docs]
│       │   ├── cli/             # FDK CLI documentation
│       │   │   ├── cli-docs.md
│       │   │   └── fdk_create.md
│       │   ├── errors/          # Error catalog & troubleshooting
│       │   │   ├── error-catalog.md
│       │   │   ├── manifest-errors.md
│       │   │   ├── request-method-errors.md
│       │   │   ├── oauth-errors.md
│       │   │   └── [10+ error guides]
│       │   ├── events/          # Event reference
│       │   │   └── event-reference.md
│       │   ├── manifest/        # Manifest documentation
│       │   │   └── manifest-docs.md
│       │   ├── runtime/         # Runtime features
│       │   │   ├── installation-parameters-docs.md
│       │   │   ├── custom-iparams-docs.md
│       │   │   ├── keyvalue-store-docs.md
│       │   │   ├── object-store-docs.md
│       │   │   └── [10+ runtime docs]
│       │   ├── tests/           # Test patterns
│       │   │   ├── golden.json      # Valid patterns
│       │   │   ├── refusal.json     # Patterns to refuse
│       │   │   └── violations.json  # Security violations
│       │   └── ui/              # Crayons UI documentation
│       │       └── crayons-docs/    # 50+ component docs
│       ├── assets/              # Templates and resources
│       │   ├── logo.svg         # Skill logo
│       │   └── templates/       # App skeletons
│       │       ├── frontend-skeleton/
│       │       ├── serverless-skeleton/
│       │       ├── hybrid-skeleton/
│       │       └── oauth-skeleton/
│       └── scripts/             # Utility scripts
│           └── cleanup_old_rules.sh
├── scripts/                     # Repository scripts
│   └── generate_manifest.py     # Manifest generation & validation
├── manifest.json                # Skill discovery manifest
├── README.md                    # This file
├── CONTRIBUTING.md              # Contribution guidelines
└── CLAUDE.md                    # Claude Code documentation
```

### Key Directories Explained

#### `skills/app-dev/rules/`
**Non-hidden rules directory** (moved from `.cursor/rules/` for multi-IDE access):
- Contains `.mdc` files (Markdown with YAML frontmatter)
- Cursor-specific but visible to all tools/importers
- No install script needed - accessible directly by skill system

#### `skills/app-dev/references/`
**Progressive disclosure documentation** (loaded on demand):
- 200+ Markdown files organized by category
- Loaded by AI only when needed (reduces context usage)
- Covers API methods, architecture, errors, runtime features, UI components

#### `skills/app-dev/assets/templates/`
**App skeletons** for quick starts:
- `frontend-skeleton/` - UI-only apps
- `serverless-skeleton/` - Backend-only apps
- `hybrid-skeleton/` - Full-stack apps
- `oauth-skeleton/` - OAuth-enabled apps

#### `manifest.json`
**Skill discovery manifest**:
- Auto-generated by `scripts/generate_manifest.py`
- Lists all skills with versions, timestamps, and file inventories
- Used by CLI/tooling to discover and install skills
- Must be regenerated after structural changes

#### Plugin Configurations
**Root-level plugin metadata**:
- `.claude-plugin/` - Claude Code configuration
- `.cursor-plugin/` - Cursor IDE configuration
- Consolidated at repository root (not per-skill)


## Usage Examples

### Building a New App

```bash
# Create a new app with the app-dev skill active
fdk create

# The skill will guide you through:
# 1. Template selection (frontend/serverless/hybrid/OAuth)
# 2. Platform 3.0 manifest structure
# 3. Crayons component usage
# 4. Request template configuration
```

### Migrating from Platform 2.x

```bash
# Use the /migrate command
/migrate

# The skill will:
# 1. Analyze your app for Platform 2.x patterns
# 2. Generate migration plan
# 3. Update manifest.json to Platform 3.0
# 4. Convert request templates
# 5. Update OAuth configuration
# 6. Replace deprecated API calls
```

### Validating Your App

```bash
# Run FDK validation
fdk validate

# If errors occur, use /fix command
/fix

# The skill will auto-fix up to 6 iterations:
# - Manifest errors
# - Request template issues
# - OAuth configuration problems
# - Security violations
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:
- Adding new skills or subskills
- Updating documentation
- Manifest management
- Code style and formatting

## Support

- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT
