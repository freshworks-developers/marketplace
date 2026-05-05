# Packing for publish (subagent stub)

Follow **[../SKILL.md](../SKILL.md)**:

```bash
printf 'Y\n' | fdk pack --skip-coverage --skip-lint
```

Produces **`dist/*.zip`**. Align active **Node** and **FDK** versions with **`manifest.json` `engines`** before packing (see the publish skill playbook).

After pack, run the **Zip layout gate** in **[../SKILL.md](../SKILL.md)** (end of step 5): **`unzip -l`** must show **`manifest.json`** at archive root — not only **`./manifest.json`** — before **`create_app_upload_url`**. Upload the zip with **step 8 `curl`** only (not Python); if the agent gets **403**, hand **curl** to the developer locally.
