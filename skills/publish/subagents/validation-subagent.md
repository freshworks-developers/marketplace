# Validation (stub)

Prefer the unified script: **`../scripts/publish.sh`** runs **`fdk validate`** unless **`--skip-validate`**.

**Common fixes**

- Wrong Node / FDK version for the app’s `platform-version` — see **fdk-setup** skill.
- Missing dependencies — `npm install` in app root before pack.

For manifest and Platform 3.0 rules, use the **app-dev** (or **freshworks-platform3**) skill.
