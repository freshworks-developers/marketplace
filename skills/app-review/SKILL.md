---
name: app-reviewer
description: Full Freshworks marketplace app review — iparams, frontend, serverless, FDK, security, and structured text report output — in one skill.
---

# App reviewer

This is an automated pipeline. Do not ask questions or interact with the user. Execute silently.

## Workflow

Run these phases in order. Detailed inspection criteria: [rules/**.md]. Give the set of rules that failed validation with fixing messages as specified in [rules/report.md](rules/report.md).

**Pre-requisite**

### FDK CLI availability (Docker / CI / local)

The **Freshworks FDK CLI** (`fdk`) is **not** bundled with this repository and is **not** assumed to exist in generic CI images. Jenkins or Kubernetes **node** images typically include **Node only**, not `fdk`. Verify the fdk is installed using command `fdk-setup-status` in fdk-setup skill.

1. **Structure** — Read `manifest.json` (platform version, product, app type, events, modules).
2. **Installation parameters** — Inspect the review rules under the [iparam-rules.md]. Follow the discovery order there.
3. **Frontend** — `manifest.json`, `app/app.js` or `app/**/*.js`, `src/**/*.js` or `src/**/*.jsx`, `config/requests.json`, `config/oauth_config.json`, `app/**/*.html`, `server/server.js` . Rules in [frontend-files-rules.md].
4. Emit the report as per [rules/report.md](rules/report.md)




## Rules

- Do **not** invent rule IDs or Pass/Fail criteria beyond the **Rule ID summary** in this file and the criteria defined in the linked `rules/*.md` files for those IDs.
- Every rule ID **in the Rule ID summary** below must be evaluated to Pass, Fail, or Not Applicable.
- Emit the **App Review Result** block exactly as specified in [rules/report.md](rules/report.md) (output layout only; which rules exist is defined here, not in report.md).
- For each **Fail**, cite file and line (or identifiable block) where possible.

## Supporting files

- [rules/report.md](rules/report.md) — Output format for the final **App Review Result** block only.
- [rules/iparam-rules.md](rules/iparam-rules.md) — IP-04A, IP-05A, IP-06A (and iparam scope for IP-03A).
- [rules/frontend-files-rules.md](rules/frontend-files-rules.md) — All FF-* rules.

## Rule ID summary (authoritative list of evaluated rule IDs)

| Area | IDs |
|------|-----|
| iparams | IP-03A, IP-04A, IP-05A, IP-06A |
| Frontend | FF-01A, FF-07A, FF-02M, FF-03A, FF-04A, FF-05A, FF-06A |
