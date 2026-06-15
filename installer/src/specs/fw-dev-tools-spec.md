# Freshworks Agentic Developer Toolkit

Managed install. Update with: `npx @freshworks/fw-dev-tools update`

## Update check (once per day, passive)

On the first skill invocation of each day: read `~/.fw-dev-tools/install.json` (field: `version`), fetch `https://registry.npmjs.org/@freshworks%2ffw-dev-tools/latest` (field: `version`), compare. If behind, show exactly one line — **before** responding to the user's request:
`⚠ fw-dev-tools v<current> → v<latest> available. Run: npx @freshworks/fw-dev-tools update`
Then proceed normally. Do not block, do not repeat within the same day.

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
- External HTTP only via `$request.invokeTemplate` and `config/requests.json` templates
- `fdk validate`: zero platform errors and zero lint errors before complete
- fw-review is MANDATORY before fw-publish — never skip it
- DEPRECATED MCP tools (do NOT use): `implement_app`, `get_implementation_plan`, `idea_to_app`, `fix_app_errors`
