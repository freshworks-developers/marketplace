# Scenario: update-existing (TF4)

**Intent:** `update-existing` · **Precondition:** Published app, session may have `publish` block

## Steps

1. User returns: "Ship version 1.1 with the new feature"
2. Agent loads session publish state; reads codebase
3. Implement changes → validate → **fw-review** (mandatory)
4. Explicit publish confirm → **fw-publish**
5. Session `publish.last_version` updated

## Pass criteria

- No auto-publish on return
- Review before publish
