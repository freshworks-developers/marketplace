# Security Policy

## Supported Versions

Security fixes are provided for the latest release on the default branch and the current npm version of `@freshworks/fw-dev-tools`.

| Version | Supported |
| ------- | --------- |
| 1.1.x   | Yes       |
| < 1.1   | No        |

## Reporting a Vulnerability

**Please do not open a public GitHub issue for security vulnerabilities.**

Email: **devrels@freshworks.com**  
Subject: `[fw-dev-tools security]`

Include:

- Description and impact
- Steps to reproduce
- Affected version (npm `@freshworks/fw-dev-tools` version or git commit)

We aim to acknowledge reports within **5 business days**. We will work with you on fix timing and coordinated disclosure when appropriate.

## Scope

**In scope:** `@freshworks/fw-dev-tools` installer, bundled skills, scripts under `skills/shared/scripts/`, and repository MCP configuration (`.mcp.json`).

**Out of scope:** vulnerabilities in third-party services, the Freshworks Platform or FDK itself, or custom apps built using these skills.

## Telemetry in marketplace publish zip

When a developer publishes an app using the **fw-publish** skill, a file named **`.meta.json`** is included at the **root of the uploaded app zip** by design. The Freshworks platform ingests it server-side for skill-quality metrics. This is separate from install state at `~/.fw-dev-tools/.meta.json`.

**What is included** (schema: `skills/shared/.meta.template.json`):

| Field | Purpose |
| ----- | ------- |
| `tracking_id` | Anonymous session identifier for the app build |
| `source` | Always `"ai_skills"` for apps built with this toolkit |
| `ide_client` | IDE used (cursor, claude, codex) |
| `start_time` | When metrics collection started for this app |
| `fw-setup`, `fw-app-dev`, `fw-ai-actions-app`, `fw-review`, `fw-publish` | Per-skill invocation counts, versions, and outcome categories |
| `developer_feedback` (optional) | Post-build liked/disliked rating and comment if the developer opted in at publish time |

**Lifecycle:**

1. Skills write metrics to `<app-directory>/.meta.json` via `~/.fw-dev-tools/scripts/meta-*.sh` during build/review/publish.
2. **fw-publish** requires `.meta.json` in the zip before upload (`fdk pack` or explicit repack).
3. After **successful** marketplace submit, **fw-publish** deletes the local `<app-directory>/.meta.json` via `meta-delete.sh`.

**Agent vs contributor disclosure:** IDE agents are instructed not to surface `.meta.json` to end developers during chat (to avoid distracting from the app workflow). This document and **[CONTRIBUTING.md](CONTRIBUTING.md)** disclose the behavior for contributors, security reviewers, and platform teams.

Questions about platform retention or customer visibility: **devrels@freshworks.com**.
