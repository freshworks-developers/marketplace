/**
 * Content written to always-loaded locations per client.
 * Derived from AGENTS.md routing table — kept in sync with that file.
 */

export const CURSOR_MDC = `---
name: fw-dev-tools
description: Freshworks Agentic Developer Toolkit — routing and skill orchestration
alwaysApply: true
---

# Freshworks Agentic Developer Toolkit

Managed install. Update with: \`npx fw-dev-tools update\`

## Which skill to use

| Goal | Skill |
|---|---|
| Build, fix, review, or migrate a Platform 3.0 app | \`skills/fw-app-dev/SKILL.md\` |
| AI Actions integrations (actions.json, SMI, request templates) | \`skills/fw-ai-actions-app/SKILL.md\` |
| Structured app review (iparams, frontend, script checks, report) | \`skills/fw-review/SKILL.md\` |
| Install, upgrade, or troubleshoot FDK and Node (nvm, PATH) | \`skills/fw-setup/SKILL.md\` |
| Publish a built app to the marketplace | \`skills/fw-publish/SKILL.md\` |

**End-to-end order:** fw-setup → fw-app-dev / fw-ai-actions-app → fw-review (MANDATORY) → fw-publish

## Non-negotiables

- Platform version \`"3.0"\`; use \`modules\` not legacy \`product\`
- External HTTP only via \`$request.invokeTemplate\` and \`config/requests.json\` templates
- \`fdk validate\`: zero platform errors and zero lint errors before complete
- fw-review is MANDATORY before fw-publish — never skip it
- DEPRECATED MCP tools (do NOT use): \`implement_app\`, \`get_implementation_plan\`, \`idea_to_app\`, \`fix_app_errors\`
`;

export const CLAUDE_MD_BLOCK = `
<!-- fw-dev-tools start -->
## Freshworks Agentic Developer Toolkit

Managed install. Update with: \`npx fw-dev-tools update\`

### Which skill to use

| Goal | Skill |
|---|---|
| Build, fix, review, or migrate a Platform 3.0 app | \`~/.claude/skills/fw-app-dev/SKILL.md\` |
| AI Actions integrations (actions.json, SMI, request templates) | \`~/.claude/skills/fw-ai-actions-app/SKILL.md\` |
| Structured app review | \`~/.claude/skills/fw-review/SKILL.md\` |
| Install, upgrade, or troubleshoot FDK and Node | \`~/.claude/skills/fw-setup/SKILL.md\` |
| Publish a built app to the marketplace | \`~/.claude/skills/fw-publish/SKILL.md\` |

**End-to-end order:** fw-setup → fw-app-dev / fw-ai-actions-app → fw-review (MANDATORY) → fw-publish

**Non-negotiables:** Platform \`"3.0"\`, \`modules\` not \`product\`, external HTTP via \`$request.invokeTemplate\` only, zero \`fdk validate\` errors, fw-review before fw-publish.

**DEPRECATED MCP tools (never use):** \`implement_app\`, \`get_implementation_plan\`, \`idea_to_app\`, \`fix_app_errors\`
<!-- fw-dev-tools end -->
`;

export const AGENTS_MD_BLOCK = `
<!-- fw-dev-tools start -->
## Freshworks Agentic Developer Toolkit

Managed install. Update with: \`npx fw-dev-tools update\`

### Skill routing

| Goal | Skill |
|---|---|
| Build, fix, review, or migrate a Platform 3.0 app | \`skills/fw-app-dev/SKILL.md\` |
| AI Actions integrations | \`skills/fw-ai-actions-app/SKILL.md\` |
| Structured app review | \`skills/fw-review/SKILL.md\` |
| Install/troubleshoot FDK and Node | \`skills/fw-setup/SKILL.md\` |
| Publish to marketplace | \`skills/fw-publish/SKILL.md\` |

**Pipeline:** fw-setup → fw-app-dev / fw-ai-actions-app → fw-review (MANDATORY) → fw-publish

**DEPRECATED MCP tools (never use):** \`implement_app\`, \`get_implementation_plan\`, \`idea_to_app\`, \`fix_app_errors\`
<!-- fw-dev-tools end -->
`;

/** The fw-dev-mcp server entry merged into Cursor's mcp.json */
export const CURSOR_MCP_ENTRY = {
  url: 'https://mcp.freshworks.dev/mcp',
  headers: {
    Authorization: 'Bearer <your-api-token>',
  },
};
