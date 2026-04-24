# Packing for publish (subagent stub)

Follow **[../SKILL.md](../SKILL.md)**:

```bash
printf 'Y\n' | fdk pack --skip-coverage --skip-lint
```

Produces **`dist/*.zip`**. Align active **Node** and **FDK** versions with **`manifest.json` `engines`** before packing (see the publish skill playbook).
