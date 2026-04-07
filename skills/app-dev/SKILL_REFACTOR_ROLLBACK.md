# SKILL refactor rollback log

**Date:** 2026-03-30
**Goal:** Token reduction (items 1–4). Use this file to see what changed and how to restore.

**Approximate size change:** `SKILL.md` reduced from **~1,377 lines → ~572 lines** (remainder split into `references/skill-advanced-topics.md` or deferred to `rules/` + existing `references/`). Exact pre-image: `git show <commit-before-refactor>:skills/app-dev/SKILL.md`.

**Note:** This refactor was done autonomously by the agent without explicit approval for creating new files. The content follows Agent Skills standard (on-demand docs belong in `references/`), but the approach should have been discussed first.

## How to rollback

1. **Full file restore:** From a commit before this refactor:
   `git show <commit>:skills/app-dev/SKILL.md > skills/app-dev/SKILL.md`
2. **Remove new files:** Delete `SKILL-ADVANCED.md` if reverting entirely.
3. **Verbatim removed chunks:** Too large to store here; use `git diff <before> <after> -- skills/app-dev/SKILL.md` for the exact deleted lines.

## New / moved files

| File | Purpose |
|------|---------|
| [`references/skill-advanced-topics.md`](references/skill-advanced-topics.md) | Progressive disclosure: extended 2.x table, OAuth deep dive, reference index, extended validation summary, product module summary, install/test notes. Follows Agent Skills standard (on-demand docs in `references/`). |
| This log | Rollback instructions |

## `SKILL.md` – what changed (summary)

### Item 1 – Fewer redundant code examples

| Location (approx. before edit) | Change |
|--------------------------------|--------|
| §5 Async/Await | Removed extra `exports` block showing only “correct async with await”; kept invalid `async` without `await` + minimal valid sync handler. |
| §6 Unused parameters | Removed duplicate invalid `_args` example; kept one invalid + one valid empty signature. |
| §7 Function complexity | Removed “REFACTORING PATTERN 2: Extract helper functions” code block; kept Set/OR pattern only. **Restore from git diff if needed.** |

### Item 2 – Checklists → tables

| Section | Change |
|---------|--------|
| Critical Validations | `File Structure`, `Manifest Validation`, `Code Quality`, `[SECURITY] Security`, `UI Components` bullet lists converted to markdown tables. |
| App Completion Gates | Gates 1–6 condensed into one table. |
| Documentation Generation Rules | Mandatory vs optional files → table. |
| Step 1 / Step 2 (workflow) | Frontend vs serverless criteria → table; template pick → table. |

### Item 3 – Split core vs advanced

| Removed from `SKILL.md` (content now in `references/skill-advanced-topics.md` or superseded) | Notes |
|-----------------------------------------------------------------------------|--------|
| `### [INVALID] Forbidden Patterns - PLATFORM 2.X` (long bullet list) | Summarized in `SKILL-ADVANCED.md`; canonical rules remain in `rules/freshworks-platform3.mdc`. |
| `### CRITICAL: When to Use OAuth` through **Cleanup Rule** (OAuth + three JSON examples + rules) | Condensed narrative + table in `SKILL-ADVANCED.md`; full JSON examples still in `references/architecture/oauth-configuration-latest.md`. |
| `## Progressive Disclosure: When to Load References` | Moved to `SKILL-ADVANCED.md`. |
| `## Error Handling & Validation Rules` (universal checklist + security 16–20 + error prevention subsections through `IF ANY ITEM FAILS`) | Summarized in `SKILL-ADVANCED.md`; workflow detail in `rules/validation-workflow.mdc`. |
| `## Pre-Finalization Validation & Autofix` + JSON examples | Summarized in `SKILL-ADVANCED.md`; duplicate of Step 3 + `validation-workflow.mdc`. |
| `## Installation` | Pointer only; install commands in `SKILL-ADVANCED.md` + repo README. |
| `## Test-Driven Validation` | Summarized in `SKILL-ADVANCED.md`. |
| `## Product Module Quick Reference` (long module/location lists) | Summarized in `SKILL-ADVANCED.md`; **canonical** detail in `rules/platform3-modules-locations.mdc`. |

### Item 4 – Deduplication

| Topic | `SKILL.md` now | Canonical / extended |
|-------|----------------|----------------------|
| FQDN / host rules | One-line pointer | `rules/freshworks-platform3.mdc`, `validation-workflow.mdc` |
| Platform 2.x rejection (long form) | Pointer + `references/skill-advanced-topics.md` summary | `rules/freshworks-platform3.mdc` |
| Product modules / locations | Short pointer | `rules/platform3-modules-locations.mdc`, `references/skill-advanced-topics.md` |

## `README.md` / `CLAUDE.md`

If the Features list used `[VALID]` instead of checkmarks, restore with:
`git checkout HEAD -- skills/app-dev/README.md` (from pre-change commit) or replace `[VALID]` with ✅ in the Features section only.
