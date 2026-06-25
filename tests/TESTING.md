# Skill Test Suite

Automated and semi-automated tests for marketplace skills.

## Layers at a glance

| # | Layer | Command | CI? | What it checks |
|---|-------|---------|-----|----------------|
| 1 | **Installer** | `cd installer && npm test` | Yes | Install/update/uninstall lifecycle, MCP merge, meta scripts |
| 2 | **Static** | `cd tests && npm test` | Yes | Skill structure, gates, scripts, manifests, version lock |
| 3 | **Regex Evals** | `cd tests && npm test` | Yes | Scenario outcomes via regex on skill content (no LLM) |
| 4 | **LLM Evals** | `bash tests/run-all-tests.sh --llm-eval` | No | Behavioral scenarios via claude/cursor CLI (~15 min) |
| 5 | **E2E** | `bash tests/run-all-tests.sh --e2e` | No | Real agent: install → build → validate → (optional publish) |

Run all layers at once:

```bash
bash tests/run-all-tests.sh                    # layers 1–3 (~2 min)
bash tests/run-all-tests.sh --llm-eval         # + layer 4 (~15 min extra, needs claude CLI)
bash tests/run-all-tests.sh --e2e              # + layer 5 (~30-60 min extra)
bash tests/run-all-tests.sh --llm-eval --e2e   # all layers
```

Generates `tests/all-tests-report.html` — tabbed report with results for all layers.

## What runs where

### GitHub Actions (automatic on every PR and push to `main`)

No LLM or API keys required.

| Workflow | Runs | What it gates |
|----------|------|---------------|
| `ci.yml` | Layers 1 + 2 + 3 | installer tests, static tests, regex evals |
| `dependency-review.yml` | — | High/critical CVEs on new deps |
| `dependency-audit.yml` | — | Lockfile audit (installer, tests) |
| `secret-scan.yml` | — | gitleaks secret scan |

### Local only (run before submitting a PR)

Requires a live agent CLI (`claude` or `cursor`). CI cannot run these.

| When | What to run |
|------|------------|
| Changing skill behavior or prompts | `bash tests/run-all-tests.sh --llm-eval` — LLM behavioral scenarios |
| Changing installer or setup flow | `bash tests/run-all-tests.sh --e2e --from-repo` — full install + agent build |
| Major refactor / release | `bash tests/run-all-tests.sh --llm-eval --e2e` — all layers, check `all-tests-report.html` |

Layers 1–3 are also worth running locally before pushing — they finish in ~2 min and catch structural issues immediately.

## Directory layout

```
tests/
  static/                         # Layer 2 — static tests
    skill-static.test.js
    bump-version.test.mjs
    repack-app-zip.test.mjs
  eval/                           # Layers 3 + 4 — evals
    skill-eval-scenarios.js       # SCENARIOS array (shared source of truth)
    skill-eval-regex.test.mjs     # Layer 3: regex checks on skill content (CI, ~80ms)
    skill-eval-cli.js             # Layer 4: LLM runner via claude --print / cursor (local only)
    eval-regex-results.json       # generated, gitignored
    eval-cli-results.json         # generated, gitignored
  e2e/                            # Layer 5 — E2E
    e2e.sh
    run-all-e2e.sh
    e2e-report.js
    lib/                          # Python log parsers
    fixtures/                     # minimal apps and sample agent logs
    e2e-publish-guard-parser.test.mjs
    e2e-publish-metrics-parser.test.mjs
    e2e-skill-paths-parser.test.mjs
    e2e-meta-scripts-parser.test.mjs
  run-all-tests.sh                # unified runner (all layers)
  all-tests-report.js             # HTML report generator
  all-tests-report.html           # generated, gitignored
  all-tests-results.json          # generated, gitignored
  package.json
  TESTING.md
```

## Layer 1 — Installer tests

```bash
cd marketplace/installer && npm test
```

Covers install lifecycle, MCP merge, fenced-block parsing, meta scripts, version checks, IDE-specific installers (Claude, Codex), integration, and status updates. Claude plugin tests use the real `claude` CLI in an isolated `$HOME` — skipped when `claude` is not on PATH.

## Layer 2 — Static tests

```bash
cd marketplace/tests && npm test
```

No API calls. Covers skill file structure, plugin manifests, shared scripts, link integrity, `bump-version.mjs`, repack helpers, and unit tests for E2E log parsers (`e2e/*.test.mjs`).

## Layer 3 — Regex evals

```bash
cd marketplace/tests && npm test
```

Runs as part of `npm test` — no separate command needed. Reads each SKILL.md and checks that required content, rules, and keywords are present. 131 scenarios, ~80ms. No LLM calls.

Scenarios are defined in `eval/skill-eval-scenarios.js` (shared with Layer 4). The regex runner checks the skill file directly instead of asking an LLM to reason about it.

**Output:** `eval/eval-regex-results.json`.

## Layer 4 — LLM evals

```bash
cd marketplace/tests
npm run eval           # uses claude CLI
npm run eval:cursor    # uses cursor CLI
```

Or via the unified runner:

```bash
bash tests/run-all-tests.sh --llm-eval
```

Requires `claude` or `cursor` on PATH with an active subscription. No `ANTHROPIC_API_KEY` needed. Uses `claude-haiku-4-5-20251001` for speed. Runs up to 6 scenarios concurrently.

Each scenario retries up to 3 times and passes if ≥ 2 attempts pass. Takes ~15 min for all 131 scenarios.

**Output:** `eval/eval-cli-results.json` (machine-readable), `all-tests-report.html` (Evals tab).

## Layer 5 — E2E

```bash
cd marketplace
bash tests/e2e/e2e.sh --from-repo --workflow build --agent claude
```

Requires an authenticated agent CLI (`claude`, `cursor`, or `codex`) and a working FDK install.

| Flag | Purpose |
|------|---------|
| `--from-repo` | Install fw-dev-tools from local source |
| `--workflow` | `build` \| `build-review` \| `publish-guard` \| `cold-build` \| `cold-build-review` |
| `--agent` | `claude` \| `cursor` \| `codex` |
| `--strip-fdk` | Remove FDK first; agent must install it |
| `--publish --auth-token` | Include publish phase |

**Output:** `e2e/e2e-results.json`, visible in `all-tests-report.html` (E2E tab).

Hard-fail checks: install exit 0, build compiles, `fdk validate` 0/0, `.meta.json` present and well-formed. `fw-review.invoked = 0` is a warning, not a failure.

### Batch E2E

Runs `e2e.sh` for each agent × workflow combination with `--from-repo`:

```bash
bash tests/e2e/run-all-e2e.sh
```

Output: `e2e/e2e-batch-results/summary.tsv` and per-run logs.

## Unified runner

```bash
bash tests/run-all-tests.sh [options]
```

Runs layers in sequence, prints a terminal summary, writes `all-tests-results.json`, and generates `all-tests-report.html`.

| Flag | Purpose |
|------|---------|
| `--llm-eval` | Include layer 4 LLM evals (default: skip) |
| `--e2e` | Include layer 5 E2E (default: skip) |
| `--workflow <name>` | E2E workflow to run (default: `build`) |
| `--agent <name>` | E2E agent to use |
| `--from-repo` | E2E: install from local source |
| `--from-tgz <path>` | E2E: install from a packed `.tgz` |
| `--auth-token <token>` | E2E: publish auth token |

## Adding tests

| Type | Where |
|------|-------|
| Static assertions | `static/skill-static.test.js` |
| Script / helper unit tests | `static/*.test.mjs` |
| E2E log parser unit tests | `e2e/*.test.mjs` |
| Eval scenarios (regex + LLM) | `SCENARIOS` in `eval/skill-eval-scenarios.js` |
| E2E behavior | `e2e/e2e.sh` |

**Cross-platform:** use `join()` for paths; guard `.sh` tests with `{ skip: process.platform === 'win32' }`.
