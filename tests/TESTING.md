# Skill Test Suite

Automated and semi-automated tests for marketplace skills.

## Layers at a glance

| # | Layer | Command | CI? | What it checks |
|---|-------|---------|-----|----------------|
| 1 | **Installer** | `cd installer && npm test` | Yes | Install/update/uninstall lifecycle, MCP merge, meta scripts |
| 2 | **Static** | `cd tests && npm test` | Yes | Skill structure, gates, scripts, manifests, E2E log parsers |
| 3 | **Regex Evals** | `cd tests && npm test` | Yes | Scenario outcomes via regex on skill content (no LLM) |
| 4 | **LLM Evals** | `bash tests/run-all-tests.sh --llm-eval` | No | Behavioral scenarios via claude/cursor CLI (~25 min, Sonnet 4.6) |
| 5 | **E2E** | `bash tests/run-all-tests.sh --e2e` | No | Real agent: install → build → validate → (optional publish) |

Run all layers at once:

```bash
bash tests/run-all-tests.sh                    # layers 1–3 (~2 min)
bash tests/run-all-tests.sh --llm-eval         # + layer 4 (~15 min extra, needs claude CLI)
bash tests/run-all-tests.sh --e2e              # + layer 5 (~30-60 min extra)
bash tests/run-all-tests.sh --llm-eval --e2e   # all layers
```

Generates `tests/all-tests-report.html` — tabbed report with results for all layers.

**Scenario counts:** 123+ installer · 215+ static/parser · 145+ regex · 200+ LLM active (includes six orchestration scenarios ported from `tests/scenarios/*.md`).

## What runs where

### GitHub Actions (automatic on every PR and push to `main`)

No LLM or API keys required.

| Workflow | Runs | What it gates |
|----------|------|---------------|
| `ci.yml` | Layers 1 + 2 + 3 (PR/push); layers 2–4 optional (manual) | installer tests, static tests, regex evals; on-demand eval report when **Run skill evals** is checked |
| `dependency-review.yml` | — | High/critical CVEs on new deps |
| `dependency-audit.yml` | — | Lockfile audit (installer, tests) |
| `secret-scan.yml` | — | gitleaks secret scan |

### When to run which layer

| Change type | Required before merge |
|-------------|----------------------|
| **Any PR** | Layers **1–3** — automatic via `ci.yml` (installer + static + regex) |
| **`SKILL.md`, command, rule, `.meta.template.json`** | Layer **4** locally (or manual workflow) + attach **`tests/all-tests-report.html`** to the PR |
| **`installer/` changes** | Layer **1** in CI + optional **`bash tests/e2e/e2e.sh --from-repo`** locally |
| **Release / major refactor** | **`bash tests/run-all-tests.sh --llm-eval --e2e`** — all layers |

Layer 4 is **not** in PR CI (no agent CLI or API key on default runners). PR authors run evals locally or a maintainer triggers **[CI](https://github.com/freshworks-developers/fw-dev-tools/actions/workflows/ci.yml)** with **Run skill evals** checked (`workflow_dispatch`). Without `claude`/`cursor` on the runner, Layer 4 scenarios are skipped and the uploaded report reflects layers 2–3 only.

### Local only (run before submitting a PR)

Requires a live agent CLI (`claude` or `cursor`). CI cannot run these.

| When | What to run |
|------|------------|
| Changing skill behavior or prompts | `bash tests/run-all-tests.sh --llm-eval` — LLM behavioral scenarios |
| Changing installer or setup flow | `bash tests/run-all-tests.sh --e2e --from-repo` — full install + agent build |
| Major refactor / release | `bash tests/run-all-tests.sh --llm-eval --e2e` — all layers, check `all-tests-report.html` |

Layers 1–3 are also worth running locally before pushing — they finish in ~2 min and catch structural issues immediately.

`cd tests && npm test` is the CI parity command for layers 2 + 3. The unified runner splits them for reporting but runs the same files.

## Directory layout

```
tests/
  static/                         # Layer 2 — static tests
    skill-static.test.js
    bump-version.test.mjs
    repack-app-zip.test.mjs
  eval/                           # Layers 3 + 4 — evals
    skill-eval-scenarios.js       # SCENARIOS array (LLM layer source of truth)
    scenarios/                    # Per-skill LLM scenario definitions
      fw-setup.js
      fw-app-dev.js
      fw-review.js
      fw-publish.js
      fw-ai-actions.js
      orchestration.js            # Six intent/session orchestration scenarios
    regex/                        # Layer 3: per-skill regex checks (CI, ~80ms)
      fw-app-dev.regex.test.mjs
      fw-setup.regex.test.mjs
      fw-review.regex.test.mjs
      fw-publish.regex.test.mjs
      fw-ai-actions.regex.test.mjs
      spec.regex.test.mjs
    skill-eval-cli.js             # Layer 4: LLM runner via claude --print / cursor (local only)
    eval-regex-results.json       # generated, gitignored
    eval-cli-results.json         # generated, gitignored
  e2e/                            # Layer 5 — E2E
    e2e.sh
    run-all-e2e.sh
    e2e-report.js
    lib/                          # Python log parsers
    fixtures/                     # minimal apps and sample agent logs
    e2e-publish-guard-parser.test.mjs   # parser unit tests (also in Layer 2 / npm test)
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
cd installer && npm test
```

Covers install lifecycle, MCP merge, fenced-block parsing, meta scripts, version checks, IDE-specific installers (Claude, Codex), integration, and status updates. Claude plugin tests use the real `claude` CLI in an isolated `$HOME` — skipped when `claude` is not on PATH.

## Layer 2 — Static tests

```bash
cd tests && npm test
```

No API calls. Covers skill file structure, plugin manifests, shared scripts, link integrity, `bump-version.mjs`, repack helpers, and unit tests for E2E log parsers (`e2e/*-parser.test.mjs`).

The unified runner (`run-all-tests.sh`) runs the same static and parser files as `npm test`, excluding regex evals (layer 3).

## Layer 3 — Regex evals

```bash
cd tests && npm test
```

Runs as part of `npm test` — no separate command needed. Reads each SKILL.md (and command files) and checks that required content, rules, and keywords are present. **141 scenarios** (138 active, 3 skipped), ~80ms. No LLM calls.

Regex scenarios live in `eval/regex/fw-*.regex.test.mjs` — one file per skill plus `spec.regex.test.mjs`. LLM scenarios are defined separately in `eval/scenarios/*.js` and aggregated via `eval/skill-eval-scenarios.js`.

**Output:** `eval/eval-regex-results.json`.

## Layer 4 — LLM evals

```bash
cd tests
npm run eval           # static + regex + LLM evals + HTML report (claude CLI)
npm run eval:cursor    # LLM evals only via cursor CLI
```

Or via the unified runner:

```bash
bash tests/run-all-tests.sh --llm-eval
```

Requires `claude` or `cursor` on PATH with an active subscription. No `ANTHROPIC_API_KEY` needed. Passes `--model claude-sonnet-4-6` to the claude CLI. Runs up to 6 scenarios concurrently.

Each scenario retries up to 3 times and passes if ≥ 2 attempts pass. Takes ~25 min for all **200 active** scenarios.

**Output:** `eval/eval-cli-results.json` (machine-readable), `all-tests-report.html` (Evals tab).

## Layer 5 — E2E

```bash
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

Layer 1 reads the test file list from `installer/package.json` (same files `npm test` runs). Layers 2 and 3 mirror `cd tests && npm test` but are reported separately.

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
| E2E log parser unit tests | `e2e/*-parser.test.mjs` |
| Regex eval scenarios | `eval/regex/fw-<skill>.regex.test.mjs` |
| LLM eval scenarios | `eval/scenarios/fw-<skill>.js` (re-exported via `eval/skill-eval-scenarios.js`) |
| E2E behavior | `e2e/e2e.sh` |

**Cross-platform:** use `join()` for paths; guard `.sh` tests with `{ skip: process.platform === 'win32' }`.
