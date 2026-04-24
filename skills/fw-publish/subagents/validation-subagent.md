# Validation before publish (subagent stub)

Follow **[../SKILL.md](../SKILL.md)**: run **`fdk validate`** in the app root with **zero** platform errors and **zero** lint errors before **`fdk pack`**.

If validation fails repeatedly, use the **fw-app-dev** skill to fix manifest, `requests.json`, modules, or lint issues.
