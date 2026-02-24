# Troubleshooting Pack and Publish Issues

Common issues and solutions when packing and publishing Freshworks apps.

## Pack Issues

### Issue 1: "Validation failed"

**Error:**
```
❌ Validation failed with errors
```

**Cause:** App has validation errors that must be fixed before packing.

**Solution:**
```bash
# 1. Run validation to see errors
fdk validate

# 2. Fix errors (or use auto-fix)
fdk validate --fix

# 3. Re-run pack
fdk pack
```

**Common validation errors:**
- Missing icon.svg
- Async without await
- Unused parameters
- JSON structure errors
- Request template errors

**Quick fix:** Use `/fix` command to auto-fix all errors.

### Issue 2: "Coverage below 80%"

**Error:**
```
⚠️  Test coverage: 65% (minimum required: 80%)
```

**Cause:** Serverless app doesn't have sufficient test coverage.

**Solution:**
```bash
# 1. Run app to generate coverage
fdk run
# Wait for app to start, then press Ctrl+C

# 2. Check coverage summary
cat coverage/coverage-summary.json

# 3. If still < 80%, add more tests
# Edit: server/test/*.test.js

# 4. Re-run to regenerate coverage
fdk run
# Press Ctrl+C

# 5. Pack again
fdk pack
```

**Alternative (NOT recommended for marketplace):**
```bash
fdk pack --skip-coverage
```

### Issue 3: "Icon not found"

**Error:**
```
❌ Icon 'app/styles/images/icon.svg' not found in app folder
```

**Cause:** Frontend app missing required icon.svg file.

**Solution:**
```bash
# 1. Create directory
mkdir -p app/styles/images/

# 2. Create icon.svg
# Copy from template or create new SVG

# 3. Pack again
fdk pack
```

**Icon requirements:**
- Format: SVG
- Location: `app/styles/images/icon.svg`
- Size: Recommended 64x64 or larger
- Simple, recognizable design

### Issue 4: "Package creation failed"

**Error:**
```
❌ Failed to create package
```

**Possible causes:**
1. Insufficient disk space
2. Permission issues
3. Corrupted files
4. Invalid manifest.json

**Solution:**
```bash
# 1. Check disk space
df -h

# 2. Check permissions
ls -la dist/
chmod 755 dist/

# 3. Validate manifest
fdk validate

# 4. Try pack again
fdk pack

# 5. If still fails, check detailed logs
NODE_DEBUG=fdk fdk pack
```

### Issue 5: "Node.js version mismatch"

**Error:**
```
⚠️  Node.js version mismatch
   Current: 18.20.8
   Manifest: 18.13.0
```

**Cause:** Current Node.js version doesn't match manifest.json engines.node.

**Solution A: Update manifest**
```bash
# Edit manifest.json
# Change engines.node to current version
"engines": {
  "node": "18.20.8",
  "fdk": "9.7.4"
}
```

**Solution B: Switch Node.js version**
```bash
# Using nvm
nvm use 18.13.0

# Or install specific version
nvm install 18.13.0
```

**Note:** FDK will prompt to update manifest automatically. If you continue, it will:
- Update engines.node in manifest.json
- Delete node_modules/
- Delete coverage/
- Require re-running `fdk run` to regenerate coverage

### Issue 6: "Package size too large"

**Warning:**
```
⚠️  Package size: 52.3 MB (recommended: < 50 MB)
```

**Cause:** Package exceeds recommended size limit.

**Solution:**

**1. Remove unused dependencies:**
```bash
# Check package.json
cat package.json

# Remove unused packages
npm uninstall <unused-package>
```

**2. Optimize assets:**
- Compress images (use tools like ImageOptim, TinyPNG)
- Minify CSS/JS (if not using build tools)
- Remove unused fonts or icons

**3. Check .gitignore:**
```bash
# Ensure these are excluded
echo "node_modules/" >> .gitignore
echo "coverage/" >> .gitignore
echo ".fdk/" >> .gitignore
echo "dist/" >> .gitignore
```

**4. Verify package contents:**
```bash
# List package contents
unzip -l dist/*.zip

# Look for large files
unzip -l dist/*.zip | sort -k4 -n -r | head -20
```

**5. Consider external hosting:**
- Host large assets externally
- Load via CDN
- Reference in app via URL

### Issue 7: "FDK not found"

**Error:**
```
bash: fdk: command not found
```

**Cause:** FDK not installed or not in PATH.

**Solution:**
```bash
# Check if FDK installed
which fdk

# If not found, install
npm install -g @freshworks/fdk

# Or use Homebrew (macOS)
brew tap freshworks-developers/homebrew-tap
brew install fdk

# Verify installation
fdk version
```

**Quick fix:** Use `/fdk-setup install` command.

## Validation Issues

### Issue 8: "Multiple top-level JSON objects"

**Error:**
```
❌ Unexpected token { in JSON at position 123
```

**Cause:** JSON file has multiple top-level objects instead of one.

**Example (WRONG):**
```json
{ "request1": { ... } }
{ "request2": { ... } }
```

**Solution (CORRECT):**
```json
{
  "request1": { ... },
  "request2": { ... }
}
```

**Files to check:**
- `config/requests.json`
- `config/iparams.json`
- `config/oauth_config.json`

### Issue 9: "Request template not declared"

**Error:**
```
❌ Request template 'apiCall' not declared in manifest
```

**Cause:** Request template used in server.js but not declared in manifest.

**Solution:**
```json
// manifest.json
{
  "modules": {
    "common": {
      "requests": {
        "apiCall": {}
      }
    }
  }
}
```

### Issue 10: "Function not declared"

**Error:**
```
❌ Function 'getStatus' not declared in manifest
```

**Cause:** SMI function used in frontend but not declared in manifest.

**Solution:**
```json
// manifest.json
{
  "modules": {
    "common": {
      "functions": {
        "getStatus": {}
      }
    }
  }
}
```

## Coverage Issues

### Issue 11: "No coverage found"

**Error:**
```
⚠️  No coverage report found
```

**Cause:** Coverage not generated yet.

**Solution:**
```bash
# 1. Run app to generate coverage
fdk run

# 2. Wait for app to start (watch terminal)

# 3. Press Ctrl+C to stop

# 4. Coverage summary displayed

# 5. Pack again
fdk pack
```

### Issue 12: "Coverage < 80% for specific metric"

**Example:**
```
⚠️  Coverage below 80%:
   - Statements: 85% ✓
   - Branches: 70% ✗
   - Functions: 90% ✓
   - Lines: 88% ✓
```

**Cause:** Branch coverage is below threshold.

**Solution:**
1. Open HTML coverage report: `open coverage/lcov-report/index.html`
2. Identify uncovered branches (yellow/red highlights)
3. Add tests for missing branches
4. Re-run `fdk run` to regenerate coverage
5. Verify all metrics >= 80%

**Branch coverage tips:**
- Test all if/else paths
- Test all switch cases
- Test ternary operators (both true and false)
- Test short-circuit operators (&&, ||)

## Submission Issues

### Issue 13: "Upload failed"

**Error:**
```
❌ Failed to upload package to Developer Portal
```

**Possible causes:**
1. Network connectivity
2. Package corrupted
3. File size too large
4. Browser issues

**Solution:**
1. Check internet connection
2. Verify package integrity: `unzip -t dist/*.zip`
3. Try different browser
4. Clear browser cache
5. Re-pack and try again

### Issue 14: "App rejected after submission"

**Common rejection reasons:**

**1. Coverage < 80%**
- Fix: Add tests, regenerate coverage, resubmit

**2. Platform 2.x patterns detected**
- Fix: Migrate to Platform 3.0, resubmit

**3. Security vulnerabilities**
- Fix: Remove eval(), hardcoded secrets, insecure APIs

**4. Poor error handling**
- Fix: Add try-catch, validate inputs, handle edge cases

**5. Documentation insufficient**
- Fix: Improve README, add setup guide, document iparams

**6. UI/UX issues**
- Fix: Use Crayons components, improve layout, test responsiveness

### Issue 15: "Cannot access Developer Portal"

**Error:**
```
❌ Cannot access /developer page
```

**Possible causes:**
1. Not logged in to Freshworks product
2. Insufficient permissions
3. Account not activated as developer

**Solution:**
1. Log in to Freshworks product account
2. Navigate to Admin > Apps
3. Click "Build it yourself"
4. If still can't access, contact Freshworks support

## Package Issues

### Issue 16: "Package contents incorrect"

**Problem:** Package missing files or includes wrong files.

**Verify package contents:**
```bash
# List all files in package
unzip -l dist/*.zip

# Check for required files
unzip -l dist/*.zip | grep -E "(manifest.json|server.js|index.html|icon.svg)"
```

**Required files checklist:**
- ✅ manifest.json
- ✅ config/iparams.json
- ✅ app/index.html (frontend)
- ✅ app/styles/images/icon.svg (frontend)
- ✅ server/server.js (serverless)
- ✅ README.md

**Should NOT include:**
- ❌ node_modules/
- ❌ coverage/
- ❌ .fdk/
- ❌ .git/
- ❌ dist/ (previous builds)
- ❌ .env files
- ❌ Test fixtures

### Issue 17: "Package corrupted"

**Error:**
```
❌ Package file is corrupted or invalid
```

**Verify package:**
```bash
# Test package integrity
unzip -t dist/*.zip

# If corrupted, delete and re-pack
rm dist/*.zip
fdk pack
```

## FDK Issues

### Issue 18: "FDK version too old"

**Error:**
```
⚠️  FDK version 9.4.0 detected. Minimum required: 9.6.0
```

**Solution:**
```bash
# Check current version
fdk version

# Upgrade FDK
npm install -g @freshworks/fdk

# Or use Homebrew (macOS)
brew upgrade fdk

# Verify upgrade
fdk version
```

**Quick fix:** Use `/fdk-setup upgrade` command.

### Issue 19: "FDK command hangs"

**Problem:** `fdk pack` or `fdk validate` hangs indefinitely.

**Solution:**
```bash
# 1. Cancel with Ctrl+C

# 2. Check for background processes
ps aux | grep fdk

# 3. Kill if necessary
kill <pid>

# 4. Clear FDK cache
rm -rf .fdk/

# 5. Try again
fdk pack
```

## Manifest Issues

### Issue 20: "Invalid manifest structure"

**Error:**
```
❌ Manifest validation failed: Invalid structure
```

**Common issues:**
- Missing platform-version
- Using "product" instead of "modules"
- Missing engines block
- Invalid module names
- Location in wrong module

**Solution:**
```bash
# Validate manifest structure
fdk validate

# Check against Platform 3.0 template
# Ensure:
# - "platform-version": "3.0"
# - "modules": { ... }
# - "engines": { "node": "...", "fdk": "..." }
```

## Getting Help

### Check Logs

```bash
# Detailed FDK logs
NODE_DEBUG=fdk fdk pack

# Check FDK configuration
fdk config list
```

### Community Support

- **Developer Community:** https://community.freshworks.dev/
- **Search for similar issues:** `fdk search "your error"`
- **Post new question:** Create topic in community

### Official Support

- **Documentation:** https://developers.freshworks.com/
- **Support Email:** developer-support@freshworks.com
- **GitHub Issues:** Report bugs and feature requests

## Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Validation fails | Run `/fix` |
| Coverage < 80% | Run `fdk run`, add tests |
| Icon missing | Create `app/styles/images/icon.svg` |
| Package not created | Check `fdk validate`, fix errors |
| FDK not found | Run `/fdk-setup install` |
| Node.js mismatch | Update manifest or switch version |
| Upload fails | Check network, try different browser |
| App rejected | Review feedback, fix issues, resubmit |

## Prevention Checklist

**Before packing:**
- [ ] Run `fdk validate` and fix all errors
- [ ] Run `fdk run` to generate coverage
- [ ] Verify coverage >= 80%
- [ ] Check all required files exist
- [ ] Test app in target product
- [ ] Review manifest.json structure
- [ ] Verify request templates
- [ ] Test OAuth flows (if applicable)

**Before submission:**
- [ ] Package created successfully
- [ ] Package size reasonable (< 50 MB)
- [ ] Screenshots prepared (min 3)
- [ ] README documentation complete
- [ ] Support email configured
- [ ] Privacy policy ready (if needed)
- [ ] Terms of service ready

## Resources

- **FDK CLI Reference:** https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- **Validation Guidelines:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- **Submission Process:** https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
- **Developer Community:** https://community.freshworks.dev/
