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

1. **Structure** — Read `manifest.json` first for platform version, modules, requests, events, and install flow.
2. **Installation parameters** — Review `config/iparams.json` or custom `config/iparams.html` / `config/assets/iparams.js` using [rules/iparam-rules.md](rules/iparam-rules.md). Follow the discovery order in that file.
3. **Deterministic script checks** — For each script-backed rule ID in [rules/script-check-rules.md](rules/script-check-rules.md), run the mapped JS file from `scripts/`.
4. **Frontend logical checks** — Review [rules/frontend-files-rules.md](rules/frontend-files-rules.md) for FF-* rules that do not have a one-to-one script.

## Rules

- Do **not** invent rule IDs or Pass/Fail criteria beyond the **Rule ID summary** in this file and the criteria defined in the linked `rules/*.md` files for those IDs.
- Every rule ID **in the Rule ID summary** below must be evaluated to Pass, Fail, or Not Applicable.
- Emit the **App Review Result** block exactly as specified in [rules/report.md](rules/report.md) (output layout only; which rules exist is defined here, not in report.md).
- Use rule IDs internally for evaluation only. Omit rule IDs from the final user-visible report.
- For each **Fail**, cite file and line (or identifiable block) where possible.

## Supporting files

- [rules/report.md](rules/report.md) — Output format for the final **App Review Result** block only.
- [rules/iparam-rules.md](rules/iparam-rules.md) — IP-04A, IP-05A, IP-06A (and iparam scope for IP-03A).
- [rules/frontend-files-rules.md](rules/frontend-files-rules.md) — All FF-* rules.
- [rules/script-check-rules.md](rules/script-check-rules.md) — Script-backed SC-* rule IDs mapped to `scripts/*.js`.


## Rule ID summary (authoritative list of evaluated rule IDs)

| Area | IDs |
|------|-----|
| iparams | IP-03A, IP-04A, IP-05A, IP-06A |
| Frontend | FF-01A, FF-07A, FF-02M, FF-03A, FF-04A, FF-05A, FF-06A |
| Script checks | SC-01A, SC-02A, SC-03A, SC-04A, SC-05A, SC-06A, SC-07A, SC-08A, SC-09A, SC-10A, SC-11A |
