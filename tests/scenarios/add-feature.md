# Scenario: add-feature (TF2)

**Intent:** `add-feature` · **Precondition:** Valid `manifest.json`, existing app code

## Steps

1. User: "Add a settings page to my app"
2. Agent classifies `add-feature`; reads entire codebase first
3. **fw-app-dev** scoped to settings feature only
4. Validate → **fw-review** → offer publish on pass
5. Session: `intent: add-feature`, milestones updated

## Pass criteria

- Full tree read before Edit/Write
- No full app regeneration
