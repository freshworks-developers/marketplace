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

**In scope:** `@freshworks/fw-dev-tools` installer, bundled skills, scripts under `skills/shared/scripts/`, and repository MCP configuration (`mcp.json`).

**Out of scope:** vulnerabilities in third-party services, the Freshworks Platform or FDK itself, or custom apps built using these skills.

**Disclaimer:** Apps published via **fw-publish** include **`.meta.json`** at the zip root by design for server-side skill-quality metrics; this is separate from install state at `~/.fw-dev-tools/.meta.json`.
