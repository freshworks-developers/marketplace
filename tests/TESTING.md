# Skill Test Suite

Two-layer test suite for the marketplace skills. **Layer 1** runs in CI (no LLM). **Layer 2** runs locally and produces a report to attach to your PR.

## Quick start

```bash
cd tests
npm install
```

## Layer 1 — Static tests (CI, no LLM)

```bash
npm test
```

Checks structural correctness of all skill files without any API calls:

- Frontmatter fields (`name`, `version`, `description`) and valid semver
- Gate language (`DO NOT SKIP`, output blocked until app.info is written)
- app.info template-copy pattern present in every skill
- "Never mention app.info to developer" rule present in every skill
- `skills/shared/app.info.template.json` is valid JSON with all required skill blocks and fields
- Manifest skeleton templates have no tracking fields, use `modules` not `product`, have `engines`
- fw-app-dev command files have MANDATORY app.info write steps
- fw-publish defines all 4 `publish_outcome` values and delete/keep logic
- fw-review gates result emission behind app.info write
- fw-setup excludes read-only commands from app.info writes
- Line count warning (not a failure) if any SKILL.md exceeds 500 lines
- PR#21 structural checks: fdk-review removal, reference file existence, JSON/JS validity, link integrity, plugin version consistency, script executable bits

**122 tests. Expected output: 122 pass, 0 fail.**

## Layer 2 — LLM eval (local only)

```bash
ANTHROPIC_API_KEY=sk-... npm run eval
```

Uses `claude-haiku-4-5-20251001` to evaluate whether an LLM actually follows the critical behavioral rules in each skill. Each scenario forces structured JSON output via tool use, then asserts the fields deterministically.

**13 scenarios across all 5 skills:**

| ID | Skill | What it tests |
|----|-------|---------------|
| `fw-app-dev-01` | fw-app-dev | platform-version 2.3 → must run `/fdk-migrate` before `fdk validate` |
| `fw-app-dev-02` | fw-app-dev | validate passed → write app.info before reporting, never mention to user |
| `fw-app-dev-03` | fw-app-dev | 1 lint error remaining → cannot mark app complete |
| `fw-app-dev-04` | fw-app-dev | `/fdk-review` invoked → redirect to fw-review, not handled by fw-app-dev |
| `fw-setup-01` | fw-setup | `/fw-setup-install` succeeded → write app.info before REPORT |
| `fw-setup-02` | fw-setup | `/fw-setup-status` → must NOT write app.info (read-only) |
| `fw-setup-03` | fw-setup | "install FDK 9" → deprecation warning must be shown before proceeding |
| `fw-review-01` | fw-review | review failures → app.info written before `## App Review Result` emitted |
| `fw-publish-01` | fw-publish | publish succeeded → delete app.info, `publish_outcome = "success"` |
| `fw-publish-02` | fw-publish | validate failed → keep app.info, `publish_outcome = "failed_validate"` |
| `fw-publish-03` | fw-publish | publish succeeded → `start_time` cleared to null, `tracking_id` preserved, silent |
| `fw-publish-04` | fw-publish | publish failed → manifest unchanged, `start_time` not cleared |
| `fw-ai-actions-01` | fw-ai-actions-app | validate completed → write app.info before showing result |

Each failing scenario retries up to 3 times; passes if 2/3 succeed (handles non-determinism).

### Output

After `npm run eval`, two files are written:

- `tests/eval-results.json` — raw results (pass/fail per scenario, model, timestamp)
- `tests/eval-report.md` — formatted markdown table + failure details → **attach to your PR**
- `tests/eval-report.html` — same report as a self-contained HTML page (open in browser)

### Running in Claude Code or Cursor (no API key needed)

Instead of `npm run eval`, open this repo in Claude Code or Cursor and ask:

> "Run the skill evals and write eval-report.md"

The model reads all skill files and evaluates the 13 scenarios inline, then writes the report. Same result, no API key required.

## Fixtures

`tests/fixtures/` contains minimal app directories used by eval scenarios:

| Fixture | Purpose |
|---------|---------|
| `platform3-valid/` | Clean Platform 3.0 app with `"app": {}` and correct engines |
| `platform2-legacy/` | Legacy 2.3 app with `product` block — triggers migrate-first gate |
| `app-with-appinfo/` | 3.0 app with existing `app.info` (fw-app-dev block, `invoked: 1`) |

## Adding tests

**Static:** add assertions to `skill-static.test.js` using `node:test` + `assert/strict`.

**Eval scenarios:** add an entry to the `SCENARIOS` array in `skill-eval.test.js` following the existing pattern — `loadContent`, `prompt`, `schema`, `assert`.

**Fixtures:** add app directories under `tests/fixtures/` as needed.

### Cross-platform rules for static tests

The static test suite must run on macOS, Linux, and Windows. Follow these rules when adding new tests:

- **No shell `grep`** — use the `grepFiles(dir, needle, { skipDirs })` helper already in `skill-static.test.js`. It walks the file tree with `readdir` and works everywhere.
- **No bash/sh scripts** — if a test invokes a `.sh` script, guard it with `{ skip: process.platform === 'win32' }` so it is skipped rather than erroring on Windows.
- **No Unix-only flags** — `grep --exclude-dir`, `find -exec`, `chmod` etc. are not available on Windows. Use Node `fs` APIs instead.
- **`node --check`** for JS syntax validation is cross-platform and fine to use as-is.
- **Paths** — always build paths with `join()`, never string concatenation with `/`.
