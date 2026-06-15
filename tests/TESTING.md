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
- Gate language (`DO NOT SKIP`, output blocked until .meta.json is written)
- Script-based .meta.json pattern: every skill references `meta-init.sh` and `meta-update.sh`
- "Never mention .meta.json to developer" rule present in every skill
- `skills/shared/.meta.template.json` is valid JSON with all required skill blocks and fields
- `skills/shared/scripts/` — all 4 scripts (`meta-init.sh`, `meta-update.sh`, `meta-delete.sh`, `check-update.sh`) exist and have execute bits set
- fw-app-dev command files (`fdk-fix.md`, `fdk-migrate.md`) use `meta-init.sh` / `meta-update.sh` pattern
- fw-publish uses `meta-delete.sh` for post-publish cleanup and defines all 4 `publish_outcome` values
- fw-review gates result emission behind .meta.json write
- fw-setup excludes read-only commands from .meta.json writes
- Manifest skeleton templates have no tracking fields, use `modules` not `product`, have `engines`
- Line count warning (not a failure) if any SKILL.md exceeds 500 lines
- PR#21 structural checks: fdk-review removal, reference file existence, JSON/JS validity, link integrity, plugin version consistency, script executable bits

**140 tests. Expected output: 140 pass, 0 fail.**

### Installer lifecycle + e2e scenarios

| Area | Layer | Where |
|------|-------|-------|
| Install, status, update, uninstall, migrations | **Installer** | `installer/tests/installer-lifecycle.test.js` |
| Metrics scripts | **Installer** | `installer/tests/scripts.test.js` |
| Build, review, publish guard | **E2E** | `tests/e2e.sh` (`--from-repo`, `--sample-app`, `--workflow`) |
| Skill behavioral gates | **LLM eval** | `tests/skill-eval.test.js` |

**Local run (all four layers):**

```bash
cd tests && npm test                              # Layer 1 static
cd installer && npm test                          # Layer 4 installer + lifecycle
cd tests && npm run eval                          # Layer 2 eval (API key optional)
./tests/e2e.sh --from-repo --sample-app --agent cursor
./tests/e2e.sh --from-repo --sample-app --workflow build-review --agent cursor
./tests/e2e.sh --from-repo --workflow publish-guard --agent cursor
```

## Layer 2 — LLM eval (local only)

```bash
ANTHROPIC_API_KEY=sk-... npm run eval
```

Without an API key, run the content-based inline checker instead:

```bash
npm run eval:inline
```

Uses `run-inline-eval.mjs` to verify each scenario's rules are present in skill files, then writes `eval-report.html`.

Uses `claude-haiku-4-5-20251001` to evaluate whether an LLM actually follows the critical behavioral rules in each skill. Each scenario forces structured JSON output via tool use, then asserts the fields deterministically.

**28 scenarios across all 5 skills:**

| ID | Skill | What it tests |
|----|-------|---------------|
| `fw-app-dev-01` | fw-app-dev | platform-version 2.3 → must run `/fdk-migrate` before `fdk validate` |
| `fw-app-dev-02` | fw-app-dev | validate passed → write .meta.json before reporting, never mention to user |
| `fw-app-dev-03` | fw-app-dev | 1 lint error remaining → cannot mark app complete |
| `fw-app-dev-04` | fw-app-dev | `/fdk-review` invoked → redirect to fw-review, not handled by fw-app-dev |
| `fw-app-dev-05` | fw-app-dev | .meta.json write → must invoke `meta-init.sh` + `meta-update.sh`, not write JSON directly |
| `fw-app-dev-06` | fw-app-dev | metrics: `validate_iterations` = total runs, `validation_error_categories` deduped |
| `fw-setup-01` | fw-setup | `/fw-setup-install` succeeded → write .meta.json before REPORT |
| `fw-setup-02` | fw-setup | `/fw-setup-status` → must NOT write .meta.json (read-only) |
| `fw-setup-03` | fw-setup | "install FDK 9" → deprecation warning must be shown before proceeding |
| `fw-setup-04` | fw-setup | metrics: `setup_node_changed`/`setup_fdk_changed` reflect actual change, not always true |
| `fw-review-01` | fw-review | review failures → .meta.json written before `## App Review Result` emitted |
| `fw-review-02` | fw-review | metrics: `review_failure_categories` populated with actual rule IDs |
| `fw-publish-01` | fw-publish | publish succeeded → delete .meta.json, `publish_outcome = "success"` |
| `fw-publish-02` | fw-publish | validate failed → keep .meta.json, `publish_outcome = "failed_validate"` |
| `fw-publish-03` | fw-publish | publish succeeded → `.meta.json` deleted silently without notifying developer |
| `fw-publish-04` | fw-publish | publish failed → manifest unchanged, `start_time` not cleared |
| `fw-publish-05` | fw-publish | zip upload → must use `upload-app.sh`, not Python/Node/curl |
| `fw-publish-06` | fw-publish | upload failed after 3 retries → `publish_outcome = "failed_upload"`, keep .meta.json |
| `fw-publish-07` | fw-publish | new listing → `supportEmail` collected before `create_app_upload_url`; STOP if missing |
| `fw-publish-08` | fw-publish | feedback step → must ask; skip gracefully; never write null or empty |
| `fw-publish-09` | fw-publish | new vs existing → must ask user; never assume appId from `.fdk/app-info.json` |
| `fw-publish-10` | fw-publish | fw-review prerequisite → cannot publish without running fw-review first |
| `fw-publish-11` | fw-publish | `actions.json` → ask about `worksWith: ai_actions` before submit |
| `fw-publish-12` | fw-publish | update without `actions.json` → downgrade warning and confirm |
| `fw-app-dev-07` | fw-app-dev | `/fw-setup-status` before building a new app |
| `fw-review-03` | fw-review | multi-manifest → only ask which app |
| `fw-ai-actions-01` | fw-ai-actions-app | validate completed → write .meta.json before showing result |
| `spec-01` | (all) | update check → `check-update.sh` on first invocation only, not every message |

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
| `app-with-meta/` | 3.0 app with existing `.meta.json` (fw-app-dev block, `invoked: 1`) |

## Layer 3 — End-to-end test (local only)

```bash
./tests/e2e.sh [options]
```

Installs from GitHub, invokes a real LLM CLI to build an app, then asserts the full chain end-to-end. **Requires the chosen LLM CLI to be installed and authenticated.**

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `--from-repo` | false | Install from this marketplace repo (local dev) |
| `--from-tgz <path>` | _(none)_ | Install from a local `.tgz` pack |
| `--branch <name>` | `main` | Installer branch from GitHub/npm |
| `--agent <name>` | `claude` | LLM CLI: `claude` \| `cursor` \| `codex` |
| Cursor streaming | — | `--agent cursor` uses `--output-format stream-json --stream-partial-output` so logs update live |
| `--sample-app` | false | Serverless ticket-logger prompt + `~/Desktop/demo/e2e-sample-app` |
| `--workflow <name>` | `build` | `build` \| `build-review` \| `publish-guard` |
| `--require-review` | false | Fail if `fw-review.invoked` is 0 after build (`build-review` sets this automatically) |
| `--skip-build` | false | Skip LLM app generation; reuse app in `--output-dir` |
| `--prompt <text>` | Asana sync | Custom app generation prompt |
| `--output-dir <path>` | `~/Desktop/demo/e2e-test-app` | Directory where the app is generated |
| `--auth-token <jwt>` | _(none)_ | JWT for fw-publish; required with `--publish` |
| `--publish` | false | Run the fw-publish phase (requires `--auth-token`) |

**Workflows:**

| `--workflow` | What it does |
|--------------|--------------|
| `build` | Install → LLM build → validate → uninstall |
| `build-review` | Same as `build`, plus mandatory `fw-review` gate (`--require-review`) |
| `publish-guard` | Publish without review must be refused (skips LLM build) |

Legacy aliases (`--local-src`, `--preset`, `--scenario`, `--client`, `--skip-llm`, etc.) still work and print a deprecation notice.

**Examples:**

```bash
# basic run — all defaults (claude, main branch, Freshdesk-Asana app, no publish)
./tests/e2e.sh

# local dev: repo installer + cursor + sample app
./tests/e2e.sh --from-repo --sample-app --agent cursor

# build + mandatory review gate
./tests/e2e.sh --from-repo --sample-app --workflow build-review --agent cursor

# publish without review must be blocked
./tests/e2e.sh --from-repo --workflow publish-guard --agent cursor

# re-validate an existing app (skip LLM build)
./tests/e2e.sh --from-repo --sample-app --skip-build --agent cursor

# test a specific installer branch
./tests/e2e.sh --branch feat/single-installer-cli

# enable the publish phase (requires both flags)
./tests/e2e.sh --publish --auth-token "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# change where the generated app is written
./tests/e2e.sh --output-dir ~/Desktop/demo/my-test-app

# use a custom app generation prompt
./tests/e2e.sh --prompt "Build a Freshservice incident notifier that posts to Slack when a high-priority incident is created"

# full run: feature branch, cursor, custom app, publish enabled
./tests/e2e.sh \
  --branch feat/single-installer-cli \
  --agent cursor \
  --prompt "Build a Freshdesk-Asana sync app" \
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
| .meta.json | File exists; `tracking_id` 20 chars; `fw-app-dev.invoked > 0`; `skill_version` set | `fw-review.invoked = 0` (LLM skipped mandatory review) |
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
