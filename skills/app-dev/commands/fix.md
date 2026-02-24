# Fix Platform and Lint Errors Command

You are fixing all platform validation errors and lint errors in a Freshworks app. Follow these steps exactly.

## Step 1: Determine app directory

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to fix.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

## Step 2: Run fdk validate

Run: `cd <app-directory> && fdk validate`

Capture all output (fatal errors, lint errors, warnings).

## Step 3: Fix iteratively (up to 2 iterations for fatal, then lint)

### Priority 1: Fatal errors (Platform/validation)

Fix these first. Use `references/errors/` and `.cursor/rules/validation-autofix.mdc`:
- JSON structure errors (multiple top-level objects, commas)
- Missing required files (icon.svg, iparams.json)
- Manifest structure (platform-version, modules, declarations)
- Request template errors (FQDN, path, schema)
- OAuth structure (integrations wrapper)

### Priority 2: Lint errors

After fatal errors are resolved, fix lint errors:
- **Async without await**: Add `await` or remove `async`
- **Unused parameters**: Remove or prefix with `_`
- **Unreachable code**: Remove after return statements
- **Helper before exports**: Move helper functions after exports block

### Priority 3: Warnings (optional)

Address non-critical warnings if time permits.

## Step 4: Validate after each fix

After each fix iteration, run `fdk validate` again. Continue until:
- No fatal errors remain, and
- No lint errors remain (or user accepts remaining lint).

## Step 5: Report

Report what was fixed and the final validation status.
