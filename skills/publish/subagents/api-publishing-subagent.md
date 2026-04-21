# AMP API upload (subagent stub)

**Use the host skill instead:** [../SKILL.md](../SKILL.md) and **`../scripts/publish.sh`** → **`../scripts/amp_upload.py`**.

`publish.sh` already runs **curl preflight** (`GET …/apps?type=custom`) and **repairs stale `.fdk/app-info.json` ids** (`GET …/apps/{id}` → 404 clears `id`) before calling Python.

**Authority:** Multipart field names and `POST`/`PATCH` sequence are defined only in **`amp_upload.py`** (see **[../references/amp-modular-upload.md](../references/amp-modular-upload.md)**).

**Inputs:** `APP_DIR`, JWT from env/config, support email (create path), optional `--target=dev` to skip move-to-test.

**Output:** HTTP 2xx JSON with app id/version; `.fdk/app-info.json` updated by script.

**Do not** rebuild multipart from memory or from old `app[name]` / `file` field examples—those are wrong for modular apps.
