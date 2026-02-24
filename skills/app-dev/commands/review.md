# FDK Validate Review Command

You are reviewing a Freshworks app using multiple rounds of `fdk validate`. Follow these steps exactly.

## Step 1: Determine app directory

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to review.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

## Step 2: Run validation rounds

Run `fdk validate` from the app directory (the folder containing manifest.json). Perform **3 rounds**:

### Round 1
- Run: `cd <app-directory> && fdk validate`
- Capture full output (fatal errors, lint errors, warnings).
- Report: Summary of issues found.

### Round 2
- Attempt to fix **fatal errors only** (ignore lint and warnings for now).
- Apply fixes from `references/errors/` and `.cursor/rules/validation-autofix.mdc`.
- Run: `fdk validate` again.
- Report: Whether fatal errors were resolved.

### Round 3
- Run: `fdk validate` again to confirm.
- Capture output.
- Report: Any remaining issues.

## Step 3: Final report

After 3 rounds, provide:
- ✅ **Pass**: App validates successfully.
- ⚠️ **Fatal errors remain**: List them with suggested fixes.
- 📋 **Lint/warnings**: List any remaining (optional to fix).
