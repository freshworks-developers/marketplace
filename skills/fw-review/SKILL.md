---
name: fw-review
description: Full Freshworks marketplace app review — iparams, frontend, serverless, FDK, security, and structured text report output — in one skill.
version: "1.0.0"
compatibility: "Freshworks Platform 3.0; optional FDK on PATH for validate-oriented phases (use fw-setup when missing)"
---

# fw-review

This is an automated pipeline. Do not ask questions or interact with the user. Execute silently.

## Workflow

Run these phases in order. Detailed inspection criteria: [rules/**.md]. Give the set of rules that failed validation using the aligned Issue / Location / Fix format specified in [rules/report.md](rules/report.md).

**Pre-requisite**

### FDK CLI availability (Docker / CI / local)

The **Freshworks FDK CLI** (`fdk`) is **not** bundled with this repository and is **not** assumed to exist in generic CI images. Jenkins or Kubernetes **node** images typically include **Node only**, not `fdk`. Verify FDK is installed (for example `/fw-setup-status` from the **fw-setup** skill, or `fdk --version` when the CLI is on `PATH`).

1. **Structure** — Read `manifest.json` first for platform version, modules, requests, events, and install flow.
2. **Installation parameters** — Review `config/iparams.json` or custom `config/iparams.html` / `config/assets/iparams.js` using [rules/iparam-rules.md](rules/iparam-rules.md). Follow the discovery order in that file.
3. **Deterministic script checks** — For each script-backed rule ID in [rules/script-check-rules.md](rules/script-check-rules.md), run the mapped JS file from `scripts/`. Treat any returned internal metadata such as `internal.rule_id` as internal only.
4. **Frontend logical checks** — Review [rules/frontend-files-rules.md](rules/frontend-files-rules.md) for FF-* rules that do not have a one-to-one script.

## Rules

- Do **not** invent rule IDs or Pass/Fail criteria beyond the **Rule ID summary** in this file and the criteria defined in the linked `rules/*.md` files for those IDs.
- Every rule ID **in the Rule ID summary** below must be evaluated to Pass, Fail, or Not Applicable.
- Emit the **App Review Result** block exactly as specified in [rules/report.md](rules/report.md): aligned numbered failure blocks with Issue, Location, and Fix.
- Use rule IDs internally for evaluation only. Omit rule IDs, including any script JSON metadata such as `internal.rule_id`, from the final user-visible report.
- If a script execution itself fails, do **not** stop the overall review. Ignore that rule inspection for the current run, continue evaluating the remaining rules, and report only the actual rule failures you were able to determine.
- For each **Fail**, cite file and line (or identifiable block) where possible.

## Supporting files

- [rules/report.md](rules/report.md) — Output format for the final **App Review Result** block only.
- [rules/iparam-rules.md](rules/iparam-rules.md) — IP-04A, IP-05A, IP-06A.
- [rules/frontend-files-rules.md](rules/frontend-files-rules.md) — All FF-* rules.
- [rules/script-check-rules.md](rules/script-check-rules.md) — Script-backed rule IDs mapped to `scripts/*.js`.

## Rule ID summary (authoritative list of evaluated rule IDs)

| Area | IDs |
|------|-----|
| iparams | IP-04A, IP-05A, IP-06A |
| File and folder structure | FFS-02L, FFS-04L, FFS-05L |
| Frontend | FF-01L, FF-07L, FF-02M, FF-03A, FF-04A, FF-05A, FF-06A |
| Code readability | CR-05L |
| Miscellaneous | GN-02L, GN-08L, GN-12L |
