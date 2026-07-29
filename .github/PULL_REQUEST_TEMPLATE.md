## Summary

<!-- What does this PR change and why? Link issue if applicable. -->

## Type of change

- [ ] Skill content (`SKILL.md`, command file, rule file)
- [ ] Reference / template file
- [ ] Plugin manifest (`.claude-plugin`, `.cursor-plugin`, `.codex-plugin`, `skills/*/.cursor-plugin`)
- [ ] Installer (`installer/`)
- [ ] Test suite (`tests/`, `installer/tests/`)
- [ ] CI / docs / infra only

---

## Test checklist

### Installer tests (required when `installer/` changed)

```bash
cd installer && npm install && npm test    # installer lifecycle tests
```

- [ ] Installer tests pass locally

### Static + regex evals (required for all PRs)

```bash
cd tests && npm install && npm test        # static + parser + regex evals — runs in CI
```

- [ ] All tests pass locally

### LLM evals (required when `SKILL.md`, a command file, or `.meta.template.json` is modified)

See **When to run which layer** in [`tests/TESTING.md`](tests/TESTING.md). Behavioral scenarios live in `tests/eval/scenarios/*.js` (with matching regex checks in `tests/eval/regex/`). Run via:

```bash
cd tests && npm run eval                   # static + regex + LLM evals + HTML report
# or
bash tests/run-all-tests.sh --llm-eval
```

Requires `claude` or `cursor` on PATH. In an **agent session** (recommended, no API key): *"Run the skill evals"*.

- [ ] Reviewed / updated scenarios in `tests/eval/scenarios/` (and matching `tests/eval/regex/fw-*.regex.test.mjs` for doc-regression checks)
- [ ] Added new scenario(s) for any new behavioral rule or gate
- [ ] LLM eval scenarios pass (or explained in summary why a failure is acceptable)
- [ ] Attached **`tests/all-tests-report.html`** below (or linked in PR description)

### Repo hygiene (when applicable)

- [ ] **`AGENTS.md`** rules/commands inventory updated (if `skills/*/rules/` or `skills/*/commands/` changed)
- [ ] **`tests/TESTING.md`** updated (if eval scenarios added/renamed or layer layout changed)
- [ ] **`docs/engine-matrix.md`** updated (if `fw-setup` toolchain pins changed)
- [ ] **`node scripts/bump-version.mjs`** run after root `package.json` version bump (syncs plugin manifests + `SKILL.md`)

### Security

- [ ] No secrets, tokens, or real credentials in the diff (use placeholders in docs)
- [ ] If dependencies changed: `npm audit --audit-level=high` passes in `installer/` and `tests/`

### Not applicable

- [ ] This PR does not modify skills, commands, or templates — **LLM eval checklist skipped**
- [ ] This PR does not change `installer/` — **installer test checklist skipped**
- [ ] This PR does not add or change dependencies — **audit checklist skipped**

---

## CI (runs on PR automatically)

| Check | What |
|-------|------|
| Static + regex eval tests | `tests/npm test` |
| Installer tests | `installer/npm test` (Node 24) |
| Dependency review | New deps — high/critical CVEs blocked |
| npm audit | `installer/` + `tests/` lockfiles |
| Secret scan | gitleaks (full git history) |
| CodeQL | Org-level (if enabled) |

LLM evals and `tests/e2e/e2e.sh` are **local / agent session only** — not in CI.

---

## Eval report

<!-- Paste or attach tests/all-tests-report.html. Required for skill/command/template gate changes. -->
