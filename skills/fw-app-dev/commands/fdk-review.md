---
name: fdk-review
description: Review a Freshworks app using multiple rounds of fdk validate. Performs 3 validation rounds, fixes fatal errors, and provides a comprehensive report of platform errors, lint issues, and warnings.
globs: ["**/manifest.json"]
always: false
---

# FDK Review Command

**Usage:** `/fdk-review`

You are reviewing a Freshworks app using multiple rounds of `fdk validate`. Follow these steps exactly.

## Step 1: Determine app directory

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to review.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

## Step 2: Manifest + toolchain gate

**Mandatory:** **SKILL.md** → *Manifest + toolchain gate before any `fdk validate`*. Order: **`fw-setup`** if CLI is wrong → **`/fdk-migrate`** if not **Platform 3.0** or legacy **`engines`** → only then validation rounds. **Never** downgrade to **FDK 9 / Node 18** instead of migrate/setup.

## Step 3: Run validation rounds

**Toolchain:** **fw-app-dev** does not install **`fdk`** or **Node**. If `fdk` is missing or the stack is not **Node 24.x + FDK 10.x** for Platform 3.0, defer to **fw-setup** or prompt the user to add that skill — see **SKILL.md** (*FDK / Node.js toolchain — not provided by fw-app-dev*).

Run `fdk validate` from the app directory (the folder containing manifest.json). Perform **3 rounds**:

### Round 1
- Run: `cd <app-directory> && fdk validate`
- Capture full output (fatal errors, lint errors, warnings).
- Report: Summary of issues found.

### Round 2
- Attempt to fix **fatal errors only** (ignore lint and warnings for now).
- Apply fixes from `references/errors/` and `rules/validation-workflow.mdc`.
- Run: `fdk validate` again.
- Report: Whether fatal errors were resolved.

### Round 3
- Run: `fdk validate` again to confirm.
- Capture output.
- Report: Any remaining issues.

## Step 4: Final report

After 3 rounds, provide:
- [VALID] **Pass**: App validates successfully.
- [WARNING] **Fatal errors remain**: List them with suggested fixes.
- 📋 **Lint/warnings**: List any remaining (optional to fix).
