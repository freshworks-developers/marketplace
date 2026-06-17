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

### Static tests (required for all PRs)

```bash
cd tests && npm install && npm test        # 140 static tests — runs in CI
```

- [ ] All **140** static tests pass locally

**If `installer/` changed:**

```bash
cd installer && npm install && npm test    # installer lifecycle tests — CI uses Node 24
```

- [ ] Installer tests pass locally

### LLM evals (required when `SKILL.md`, a command file, or `.meta.template.json` is modified)

67 behavioral scenarios in `tests/skill-eval.test.js`. Run in an **agent session** (recommended, no API key):

> "Run the skill evals"

Or with API key: `cd tests && ANTHROPIC_API_KEY=sk-... npm run eval`

- [ ] Reviewed / updated scenarios in `tests/skill-eval.test.js` (and `tests/run-inline-eval.mjs` if adding doc-regression checks)
- [ ] Added new scenario(s) for any new behavioral rule or gate
- [ ] **67/67** scenarios pass (or explained in summary why a failure is acceptable)
- [ ] Attached **`tests/eval-report.html`** below (or linked in PR description)

`npm run eval:inline` is optional doc-regression only — **not** a substitute for agent/API eval.

### Repo hygiene (when applicable)

- [ ] **`AGENTS.md`** rules/commands inventory updated (if `skills/*/rules/` or `skills/*/commands/` changed)
- [ ] **`tests/TESTING.md`** scenario table updated (if eval scenarios added/renamed)
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
| Static skill tests | `tests/npm test` |
| Installer tests | `installer/npm test` (Node 24) |
| Dependency review | New deps — high/critical CVEs blocked |
| npm audit | `installer/` + `tests/` lockfiles |
| Secret scan | gitleaks (full git history) |
| CodeQL | Org-level (if enabled) |

LLM evals and `tests/e2e.sh` are **local / agent session only** — not in CI.

---

## Eval report

<!-- Paste or attach tests/eval-report.html. Required for skill/command/template gate changes. -->
