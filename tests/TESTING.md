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
| `fw-publish-03` | fw-publish | publish succeeded → `app.info` deleted silently without notifying developer |
| `fw-publish-04` | fw-publish | publish failed → manifest unchanged, `start_time` not cleared |
| `fw-ai-actions-01` | fw-ai-actions-app | validate completed → write app.info before showing result |

Each failing scenario retries up to 3 times; passes if 2/3 succeed (handles non-determinism).

### Output

After `npm run eval`, two files are written:

- `tests/eval-results.json` — raw results (pass/fail per scenario, model, timestamp)
- `tests/eval-report.html` — HTML report with results table and failure details (open in browser)

### Running in Claude Code, Cursor, or Codex (no API key needed)

Instead of `npm run eval`, open this repo in Claude Code, Cursor, or Codex and ask:

> "Run the skill evals"

The model reads all skill files and evaluates the 13 scenarios inline, then writes the report. Same result, no API key required.

This is also the fallback message shown when `npm run eval` is run without `ANTHROPIC_API_KEY`.

## Fixtures

`tests/fixtures/` contains minimal app directories used by eval scenarios:

| Fixture | Purpose |
|---------|---------|
| `platform3-valid/` | Clean Platform 3.0 app with `"app": {}` and correct engines |
| `platform2-legacy/` | Legacy 2.3 app with `product` block — triggers migrate-first gate |
| `app-with-appinfo/` | 3.0 app with existing `app.info` (fw-app-dev block, `invoked: 1`) |

## Layer 3 — End-to-end test (local only)

```bash
./tests/e2e.sh [options]
```

Installs from GitHub, invokes a real LLM CLI to build an app, then asserts the full chain end-to-end. **Requires the chosen LLM CLI to be installed and authenticated.**

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `--branch <name>` | `main` | Installer branch to test (e.g. `feat/single-installer-cli`) |
| `--client <name>` | `claude` | LLM client: `claude` \| `cursor` \| `codex` |
| `--auth-token <jwt>` | _(none)_ | JWT for fw-publish; required with `--publish` |
| `--output-dir <path>` | `~/Desktop/demo/e2e-test-app` | Directory where the app is generated |
| `--app-prompt <text>` | Freshdesk-Asana sync | App generation prompt |
| `--publish` | false | Run the fw-publish phase (requires `--auth-token`) |

**Examples:**

```bash
# basic run — all defaults (claude, main branch, Freshdesk-Asana app, no publish)
./tests/e2e.sh

# test a specific installer branch
./tests/e2e.sh --branch feat/single-installer-cli

# use cursor instead of claude
./tests/e2e.sh --client cursor

# use codex
./tests/e2e.sh --client codex

# enable the publish phase (requires both flags)
./tests/e2e.sh --publish --auth-token "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# change where the generated app is written
./tests/e2e.sh --output-dir ~/Desktop/demo/my-test-app

# use a custom app generation prompt
./tests/e2e.sh --app-prompt "Build a Freshservice incident notifier that posts to Slack when a high-priority incident is created"

# full run: feature branch, cursor, custom app, publish enabled
./tests/e2e.sh \
  --branch feat/single-installer-cli \
  --client cursor \
  --app-prompt "Build a Freshdesk-Asana sync app" \
  --output-dir ~/Desktop/demo/asana-sync \
  --publish \
  --auth-token "Bearer eyJ..."
```

**Phases and what each checks:**

After the run, two files are written:

- `tests/e2e-results.json` — raw results (status per check, branch, client, timestamp)
- `tests/e2e-report.html` — self-contained HTML report grouped by phase (open in browser)

The reporter (`tests/e2e-report.js`) can also be run manually after a run:

```bash
node tests/e2e-report.js
```

**Phases and what each checks:**

| Phase | Hard fail | Warning |
|-------|-----------|---------|
| Install | Installer exits 0; install paths exist | — |
| Build | LLM CLI invocation completes | — |
| Structure | `manifest.json`, `platform-version: 3.0`, `README.md`, `icon.svg` | `iparams.json` missing (may use `iparams.html`) |
| fdk validate | Exit 0; 0 platform errors; 0 lint errors | — |
| app.info | File exists; `tracking_id` 20 chars; `fw-app-dev.invoked > 0`; `skill_version` set | `fw-review.invoked = 0` (LLM skipped mandatory review) |
| Publish | _(skipped if no token)_ | Publish outcome not confirmed |
| Uninstall | Exits 0; install paths removed | — |

`fw-review.invoked` is a **warning not a failure** — the check surfaces when the LLM skipped the mandatory review step without blocking the run, so you can investigate the skill gate separately.

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
