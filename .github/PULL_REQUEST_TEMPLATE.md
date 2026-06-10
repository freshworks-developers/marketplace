## Summary

<!-- What does this PR change and why? -->

## Type of change

- [ ] Skill content (`SKILL.md`, command file, rule file)
- [ ] Reference / template file
- [ ] Plugin manifest (`.claude-plugin`, `.cursor-plugin`, `.codex-plugin`)
- [ ] Test suite (`tests/`)
- [ ] Docs / infra only

---

## Test checklist

### Static tests (required for all PRs)

- [ ] Ran `cd tests && npm test` locally — all tests pass
- [ ] No new test failures introduced

### LLM evals (required when a `SKILL.md`, command file, or `app.info.template.json` is modified)

- [ ] Reviewed existing eval scenarios in `tests/skill-eval.test.js` — existing ones still cover the changed behavior, **or** I've updated them
- [ ] Added new eval scenario(s) for any new behavioral rule or gate introduced by this PR
- [ ] Ran evals (`ANTHROPIC_API_KEY=sk-... npm run eval` **or** asked Claude Code / Cursor: *"Run the skill evals and write eval-report.md"*)
- [ ] All 13 scenarios pass (or documented why a failure is acceptable)
- [ ] Attached `tests/eval-report.html` (or `eval-report.md`) below

### Security (required when adding or updating dependencies)

- [ ] No secrets, tokens, or credentials added anywhere in the diff
- [ ] `npm audit --audit-level=high` passes in `installer/` and/or `tests/` (CI enforces this, but run locally first)
- [ ] Any new dependency has been reviewed for licence compatibility (MIT repo — avoid GPL/AGPL deps)

### Not applicable

- [ ] This PR does not modify any skill, command, or template — eval checklist skipped
- [ ] This PR does not add or change any dependencies — security checklist skipped

---

## Eval report

<!-- Attach tests/eval-report.html or paste tests/eval-report.md here. Required for skill edits. -->
