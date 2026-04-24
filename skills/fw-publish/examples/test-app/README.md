# Test App for Publish Skill

This is a minimal Freshworks Platform 3.0 app used for testing the publish skill.

## Structure

- `manifest.json` - Platform 3.0 manifest with support_ticket module
- `app/` - Frontend files (index.html, scripts, styles)
- `server/server.js` - Serverless function with onAppInstall handler
- `config/iparams.json` - Installation parameters
- `test/server.test.js` - Basic test for coverage

## Testing the Publish Flow

1. **Run tests to generate .report.json:**
   ```bash
   cd skills/fw-publish/examples/test-app
   fdk test
   ```

2. **Pack the app:**
   ```bash
   fdk pack --skip-coverage
   ```

3. **Publish to marketplace** (from repo root; set `FRESHWORKS_API_KEY` and `FRESHWORKS_SUPPORT_EMAIL` first):
   ```bash
   bash skills/fw-publish/scripts/publish.sh skills/fw-publish/examples/test-app \
     --name="Test Publish App" \
     --description="Testing automated publishing via AMP API" \
     --support-email=your-email@example.com
   ```
   If **`dist/*.zip` already exists**, the script **uploads only** (skips `fdk pack`) unless you pass **`--force-pack`**.
   Before pack/upload, **`publish.sh`** runs a **curl preflight** on AMP (`GET …/apps?type=custom`) and clears **`.fdk/app-info.json` → `id`** if that app is **404** on the current account (e.g. new JWT). Use **`--no-preflight`** only if you must skip the extra request.

## Notes

- The app requires a valid Developer Portal JWT: **`FRESHWORKS_API_KEY`** env var or **`apiKey`** in **`~/.freshworks/publish-config.json`**
- The app will be created in test state and can be installed from Admin > Apps > Custom Apps
- After first publish, the app ID is saved in `.fdk/app-info.json` for subsequent updates
