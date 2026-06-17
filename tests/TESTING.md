# Skill Test Suite

Automated and semi-automated tests for marketplace skills (CI and local layers below).

## Layers at a glance

| Layer | Command | CI? | What it checks |
|-------|---------|-----|----------------|
| **1 — Static** | `cd tests && npm test` | Yes | Skill structure, gates, scripts, manifests, release version lock |
| **2 — Installer** | `cd installer && npm test` | Yes | `npx` install/status/update/uninstall, meta scripts |
| **3 — LLM eval** | `npm run eval` | No | Behavioral scenarios → `eval-report.html` |
| **4 — E2E** | `./tests/e2e.sh` | No | Real agent: install → build → validate (optional review/publish) |

## GitHub Actions (CI)

Runs on **pull requests** and **pushes to `main`**. No LLM or API keys in CI.

| Workflow | What it gates |
|----------|----------------|
| `ci.yml` | `tests/npm test`, `installer/npm test` |
| `dependency-review.yml` | High/critical CVEs on new deps |
| `dependency-audit.yml` | Lockfile audit (installer, tests) |
| `secret-scan.yml` | gitleaks |

**Not in CI:** LLM eval (`npm run eval`), agent eval (“Run the skill evals”), `e2e.sh`.

## Quick start

```bash
cd marketplace/tests && npm install
npm test                                    # Layer 1 static
cd ../installer && npm test                 # Layer 2 installer
cd ../tests && npm run eval                 # Layer 3 (API key optional)
./e2e.sh --from-repo --sample-app --agent cursor   # Layer 4
```

## Layer 1 — Static tests

```bash
cd marketplace/tests && npm test
```

No API calls. Covers skill files, shared scripts, plugin manifests, link integrity, `bump-version.mjs`, and small unit tests for E2E log helpers under `tests/lib/`.

Main file: `skill-static.test.js`. Companion parsers: `*.test.mjs` in this directory.

## Layer 2 — Installer tests

```bash
cd marketplace/installer && npm test
```

Install lifecycle, MCP merge, meta scripts (`installer/tests/`). Claude plugin tests use the real `claude` CLI in an isolated `$HOME` (skipped when `claude` is not on PATH); they assert local marketplace copy under `~/.fw-dev-tools/` and `CLAUDE.md` routing.

## Layer 3 — LLM eval

```bash
ANTHROPIC_API_KEY=sk-... npm run eval     # automated
npm run eval:inline                       # regex doc-regression only (no API)
```

Scenarios live in `skill-eval.test.js` (`SCENARIOS`). Do not duplicate the list here — use `eval-report.html` or the source file.

**Without an API key:** ask **“Run the skill evals”** in an agent session.

**Output:** `eval-results.json`, `eval-report.html`.

## Layer 4 — E2E (`e2e.sh`)

```bash
cd marketplace/tests
./e2e.sh --from-repo --sample-app --workflow build-review --agent cursor
```

Requires an authenticated agent CLI (`claude`, `cursor`, or `codex`).

| Flag | Purpose |
|------|---------|
| `--from-repo` | Install from local marketplace repo |
| `--sample-app` | Serverless ticket-logger prompt |
| `--workflow` | `build` \| `build-review` \| `publish-guard` \| `cold-build` \| `cold-build-review` |
| `--agent` | `claude` \| `cursor` \| `codex` |
| `--strip-fdk` / `cold-*` | FDK removed first; agent must install FDK |
| `--publish --auth-token` | Full publish phase |

**Output:** `e2e-results.json`, `e2e-report.html`. All phases and assertions: `./e2e.sh --help` and `e2e.sh` source.

**Hard-fail (typical):** install, build, `fdk validate` 0/0, `.meta.json` present and well-formed. `fw-review.invoked = 0` is a **warning**, not a failure.

### Batch E2E (`run-all-e2e.sh`)

Runs `e2e.sh` for each **agent** × **workflow** (`build`, `build-review`, `publish-guard`) with `--from-repo --sample-app`.

```bash
cd marketplace/tests
./run-all-e2e.sh
```

**Output:** `e2e-batch-results/summary.tsv` and per-run logs.

## Fixtures

`tests/fixtures/` — minimal apps and sample agent logs for unit tests.

## Adding tests

| Type | Where |
|------|-------|
| Static assertions | `skill-static.test.js` |
| Parser / script unit tests | `*.test.mjs` next to `tests/lib/` |
| Eval scenarios | `SCENARIOS` in `skill-eval.test.js` |
| E2E behavior | `e2e.sh` |

**Cross-platform:** use `grepFiles()` and `join()` for paths; guard `.sh` with `{ skip: process.platform === 'win32' }`.

