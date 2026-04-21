# Metadata (stub)

AMP create/update derives **products** and **modules** from **`manifest.json`** inside **`../scripts/amp_upload.py`**:

- **Modules:** all keys under `manifest.modules` (including `common`).
- **Products:** mapped via **`MODULE_TO_PRODUCT`** in that script; extend the map if AMP rejects unknown modules.

**Display text:** `publish.sh` passes `--display-name` (from `--name=`, manifest `name`, or directory basename), `--description`, optional `--overview`.

**Existing app id:** read from **`.fdk/app-info.json`** after first publish; `publish.sh` forwards **`--app-id`** to `amp_upload.py` for PATCH updates.
