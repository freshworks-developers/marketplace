# AI Actions skill

Cursor / Claude skill for building **AI Actions** on Freshworks **Platform 3.0** (`actions.json`, SMI in `server/server.js`, request templates, manifest, validation).

## Features

- Platform 3.0 manifest, `requests.json`, `iparams.json`, OAuth where needed
- `actions.json` patterns (flat request parameters, nested response where appropriate)
- `server.js` SMI patterns (`renderData`, `$request.invokeTemplate`, safe errors)
- Request templates and external API integration guardrails
- `fdk validate` workflow and test data conventions
- Optional **agents/** prompts for integration scoping, implementation, and validation (same layout idea as **fw-app-dev** `agents/`)

## Typical app layout

```
app-root/
├── actions.json
├── manifest.json
├── server/
│   ├── server.js
│   └── test_data/
│       └── actionName.json
├── config/
│   ├── requests.json
│   ├── iparams.json
│   └── oauth_config.json   # optional
└── README.md
```

## Installation

```bash
npx skills add https://github.com/freshworks-developers/fw-dev-tools --skill fw-ai-actions-app
```

Or copy this folder into `.cursor/skills/fw-ai-actions-app/` (or your tool’s skills directory).

## Contents

- **SKILL.md** — Orchestrator; points to rules and references
- **agents/** — Integration scoper, scope implementer, AI action integration validator
- **rules/** — Scoped `.mdc` rules (platform, schemas, server, requests, validation, test data, README, API docs)
- **references/** — `ai-actions-guide.md`, quick reference, core constraints
- **scripts/ai-actions-skeleton/** — Minimal starter files
- **assets/templates/ai-actions-skeleton/** — Fuller template (manifest, sample actions)

## Requirements

- Node.js **24.x** and **FDK 10.x** (see **fw-setup** and **fw-app-dev** skills in this repo for toolchain and general app guidance)

## Support

- [AI Actions — Freshworks Developer Docs](https://developers.freshworks.com/docs/app-sdk/v3.0/common/actions/)
- [Issues — marketplace](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT (same as this repository).
