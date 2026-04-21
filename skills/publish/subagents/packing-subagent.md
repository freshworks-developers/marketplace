# Packing (stub)

**Default:** **`../scripts/publish.sh`** runs **`fdk pack --skip-coverage --skip-lint`** when no suitable **`dist/*.zip`** exists, or when **`--force-pack`**.

**Pack only:** `publish.sh <APP_DIR> --pack-only` (no JWT).

**Common fixes**

- Missing **`.report.json`** — run **`fdk test`** once, or rely on script’s skip-coverage path.
- Pack prompts — script pipes `Y` for engines confirmation when shown.

Output artifact: **`dist/*.zip`** (newest used).
