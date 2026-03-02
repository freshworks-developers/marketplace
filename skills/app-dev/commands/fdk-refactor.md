---
description: Reduce function complexity in a Freshworks app to meet cyclomatic complexity ≤ 7 per function. Extracts helper functions, simplifies conditionals, and preserves behavior while improving code quality.
globs: ["**/server.js", "**/app/scripts/*.js"]
---

# FDK Refactor Command

**Usage:** `/fdk-refactor`

You are reducing function complexity in a Freshworks app. Target: cyclomatic complexity ≤ 7 per function. Follow these steps exactly.

## Step 1: Determine app directory

1. Search the workspace for `manifest.json` files.
2. If **multiple folders** contain manifest.json: Ask the user which app to refactor.
3. If **one folder**: Use that directory.
4. If **none**: Inform the user and stop.

## Step 2: Identify high-complexity functions

Scan `server/server.js` and `app/scripts/*.js` for functions with:
- Deep nesting (multiple `if`/`for`/`while` levels)
- Many conditional branches
- Long functions (> 50 lines)

Reference: `references/tests/violations.json` - violation_003 (complexity > 7).

## Step 3: Refactoring techniques

Apply these patterns:

1. **Extract helper functions**: Move nested logic into separate, well-named functions.
2. **Early returns**: Replace nested ifs with guard clauses.
3. **Extract loops**: Move loop bodies into separate functions.
4. **Simplify conditionals**: Use lookup tables or strategy pattern instead of long if-else chains.

## Step 4: Preserve behavior

- Do NOT change app behavior or logic.
- Keep helper functions **after** the exports block (FDK parser requirement).
- Ensure all exports still work correctly.

## Step 5: Validate

Run: `cd <app-directory> && fdk validate`

Ensure no new errors were introduced. Report the refactored functions and validation status.
