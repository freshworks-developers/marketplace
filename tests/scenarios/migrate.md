# Scenario: migrate (TF5)

**Intent:** `migrate` · **Precondition:** Platform 2.x / FDK 9 in `manifest.json`

## Steps

1. User asks for feature on legacy app
2. Agent detects legacy framework → `migrate` intent; halts other work
3. **fw-setup** → **/fdk-migrate**
4. Validate post-migration; milestone `migrate_complete`
5. Then allow add-feature or other intents

## Pass criteria

- No feature work before migrate_complete milestone
