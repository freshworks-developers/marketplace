# Scenario: create-new (TF1)

**Intent:** `create-new` · **Precondition:** Empty app directory, no `manifest.json`

## Steps

1. User: "Build a Freshdesk app with a ticket sidebar"
2. Agent classifies `create-new`; confirms product + app type (no writes yet)
3. User confirms Freshdesk / standard platform app
4. Chain: **fw-setup** → **fw-app-dev** → **fw-review**
5. Session milestones: `setup_complete` → `validate_passed` → `review_passed`
6. Agent offers publish; user says yes → **fw-publish**
7. Session: `publish` block populated, `progress.phase: done`

## Pass criteria

- No code before product confirm
- fw-review ran before publish offer
- `.fw-session.json` has intent + milestones
