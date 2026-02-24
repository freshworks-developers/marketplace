# Freshworks Agent Skills

Skills for AI coding assistants (Claude Code, Cursor, etc.) that provide Freshworks Platform 3.0 guidance.

## Structure

```
skills/
├── app-dev/              # core skill: Platform 3.0 apps, manifest, Crayons, FDK
│   ├── SKILL.md
│   ├── commands/         # /migrate, /review, /fix, /refactor
│   ├── references/
│   └── assets/templates/
├── fdk-setup/            # tooling skill: FDK install, upgrade, downgrade
│   ├── SKILL.md
│   └── references/
└── publish/              # product skill: pack and publish to marketplace
    ├── SKILL.md
    └── references/
```

Hierarchy: `app-dev` (core) → `publish` (product) → `fdk-setup` (tooling)

## Development

### Adding Skills

Create subskills that reference parent:

```markdown
---
name: "freshworks-oauth-github"
parent: app-dev
---

# GitHub OAuth Apps

**FIRST**: Use the parent `app-dev` skill for Platform 3.0 basics.

Then apply these patterns:
- GitHub OAuth config in oauth_config.json
- Scopes: repo, user
- Request templates with <%= access_token %>
```

### Manifest

```bash
python3 scripts/generate_manifest.py           # generate
python3 scripts/generate_manifest.py validate  # check in CI
```

## Security

When documenting examples, obfuscate sensitive info:

- API keys: use `your-api-key-here` or `<%= iparam.api_key %>` placeholders
- OAuth client IDs/secrets: use `client_id_placeholder`, never real values
- Domain names: use `your-domain.freshdesk.com` or `your-domain.freshservice.com`
- Never include real tokens, passwords, or credentials
- Use `<%= iparam.name %>` and `<%= oauth_iparams.name %>` for config references
