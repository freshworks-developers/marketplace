# Skill Test Suite

Automated and semi-automated tests for marketplace skills. **For manual QA**, use [docs/test-plan/](../../docs/test-plan/TEST-PLANS.md) — not this file.

## Layers at a glance

| Layer | Command | CI? | What it checks |
|-------|---------|-----|----------------|
| **1 — Static** | `cd tests && npm test` | Yes | Skill file structure, gates, scripts, templates (~140 tests) |
| **2 — Installer** | `cd installer && npm test` | Yes | `npx` install/status/update/uninstall, meta scripts |
| **3 — LLM eval** | `npm run eval` | No | 67 behavioral scenarios → `eval-report.html` |
| **4 — E2E** | `./tests/e2e.sh` | No | Real agent builds app; install → build → validate chain |

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

Checks skill files without any API calls: frontmatter, gate language, `.meta.json` script patterns, shared scripts, manifest skeletons, plugin consistency, link integrity, and related structural rules.

**Expected:** 140 pass, 0 fail. Implementation: `skill-static.test.js`.

## Layer 2 — Installer tests

```bash
cd marketplace/installer && npm test
```

Install, status, update, uninstall, legacy migrations, and meta script behavior. Implementation: `installer/tests/`.

## Layer 3 — LLM eval

```bash
ANTHROPIC_API_KEY=sk-... npm run eval     # automated
npm run eval:inline                       # regex doc-regression only (no API)
```

**67 scenarios** across all 5 skills + orchestration spec. Source of truth: `skill-eval.test.js` (`SCENARIOS` array). Do not duplicate the scenario list in this doc — open the report or source file for IDs and assertions.

**Without an API key:** in Cursor, Claude Code, or Codex, ask **“Run the skill evals”**. Same scenarios; writes `eval-report.html`.

**Output:** `eval-results.json`, `eval-report.html`. Retries: 2/3 pass per scenario (non-determinism).

## Layer 4 — E2E (`e2e.sh`)

```bash
cd marketplace/tests
./e2e.sh --from-repo --sample-app --workflow build-review --agent cursor
```

Installs toolkit, invokes a real agent CLI, asserts install → build → validate (and optional review/publish). Requires authenticated agent CLI.

| Flag | Purpose |
|------|---------|
| `--from-repo` | Install from local marketplace repo |
| `--sample-app` | Serverless ticket-logger prompt |
| `--workflow` | `build` \| `build-review` \| `publish-guard` \| `cold-build` \| `cold-build-review` |
| `--agent` | `claude` \| `cursor` \| `codex` |
| `--strip-fdk` / `cold-*` | FDK removed first; agent must install FDK |
| `--publish --auth-token` | Full publish phase (optional) |

**Output:** `e2e-results.json`, `e2e-report.html`. More flags: `./e2e.sh --help`.

**Hard-fail phases:** install, build, `fdk validate` 0/0, `.meta.json` structure. `fw-review.invoked = 0` is a **warning**, not a failure.

## Fixtures

`tests/fixtures/` — minimal apps for eval/e2e:

| Fixture | Purpose |
|---------|---------|
| `platform3-valid/` | Clean Platform 3.0 app |
| `platform2-legacy/` | 2.3 `product` block — migrate-first gate |
| `app-with-meta/` | 3.0 app with existing `.meta.json` |

## Adding tests

| Type | Where |
|------|-------|
| Static assertions | `skill-static.test.js` |
| Eval scenarios | `SCENARIOS` in `skill-eval.test.js` |
| Fixtures | `tests/fixtures/` |

**Cross-platform:** use `grepFiles()` helper and `join()` for paths; guard `.sh` invocations with `{ skip: process.platform === 'win32' }`. See existing tests in `skill-static.test.js`.

## Manual regression

Human/agent prompt-by-prompt testing lives in **[docs/test-plan/](../../docs/test-plan/TEST-PLANS.md)** (installer + skill regression). Eval scenarios overlap in *intent* but test skill-doc compliance, not full agent runs.
