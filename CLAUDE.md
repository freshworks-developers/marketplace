# Freshworks Agent Skills

Skills for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.

## Current Release

### app-dev (v1.0.0)

**Core skill for building Freshworks Platform 3.0 marketplace applications**

```
skills/app-dev/
├── SKILL.md              # 60KB+ of Platform 3.0 guidance
├── rules/                # Cursor rules (non-hidden for multi-IDE access)
│   ├── security.mdc                      # Security enforcement
│   ├── freshworks-platform3.mdc          # Platform 3.0 patterns
│   ├── validation-workflow.mdc           # Auto-fix workflow
│   └── [6 more .mdc files]
├── commands/             # Slash commands
│   ├── fdk-migrate.md    # /migrate - Platform 2.x → 3.0
│   ├── fdk-review.md     # /review - Compliance check
│   ├── fdk-fix.md        # /fix - Auto-fix errors
│   └── fdk-refactor.md   # /refactor - Code improvements
├── references/           # 200+ documentation files
│   ├── api/              # API methods
│   ├── architecture/     # Architecture patterns
│   ├── errors/           # Error catalog
│   ├── runtime/          # Runtime features
│   └── ui/               # Crayons components (50+ docs)
└── assets/templates/     # App skeletons
    ├── frontend-skeleton/
    ├── serverless-skeleton/
    ├── hybrid-skeleton/
    └── oauth-skeleton/
```

**Key Features:**
- Zero tolerance for Platform 2.x patterns
- Auto-fix workflow (up to 6 iterations)
- Security enforcement (input validation, XSS prevention, safe logging)
- 25+ Crayons UI components
- OAuth and request template support

## Upcoming Releases

### fdk-setup
Automated FDK installation and management with Node.js 18 via nvm using subagents for autonomous multi-step operations.

### publish
Comprehensive guide for packaging and publishing Freshworks apps to the marketplace with validation checklists and submission workflows.

---

## Security

When documenting examples, obfuscate sensitive info:

- API keys: use `your-api-key-here` or `<%= iparam.api_key %>` placeholders
- OAuth client IDs/secrets: use `client_id_placeholder`, never real values
- Domain names: use `your-domain.freshdesk.com` or `your-domain.freshservice.com`
- Never include real tokens, passwords, or credentials
- Use `<%= iparam.name %>` and `<%= oauth_iparams.name %>` for config references
