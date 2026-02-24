# FDK Pack Command Reference

Complete reference for the `fdk pack` command used to create marketplace-ready app packages.

## Command Syntax

```bash
fdk pack [options]
```

## Options

### --app-dir (or -d)
Specify the directory containing the app to pack.

```bash
fdk pack --app-dir /path/to/app
fdk pack -d /path/to/app
```

**Default:** Current directory

### --skip-lint (or -l) [DEPRECATED]
Skip lint validation checks.

```bash
fdk pack --skip-lint
```

**Warning:** This option is deprecated and will be removed. Do not use for marketplace submissions.

### --skip-coverage (or -s)
Skip code coverage checks.

```bash
fdk pack --skip-coverage
```

**Warning:** Marketplace requires >= 80% coverage. Using this option will result in rejection. Only use for testing purposes.

## What Pack Does

1. **Validates app code** - Runs `fdk validate` internally
2. **Checks test coverage** - Verifies >= 80% for serverless apps
3. **Verifies Node.js version** - Ensures compatibility with manifest.json
4. **Creates package** - Generates dist/<app-name>-<version>.zip
5. **Reports results** - Shows package location and size

## Package Output

**Location:** `dist/<app-name>-<version>.zip`

**Contents:**
- `app/` - Frontend files (if frontend/hybrid app)
- `server/` - Backend files (if serverless/hybrid app)
- `config/` - Configuration files
- `manifest.json` - App manifest
- `README.md` - Documentation
- `package.json` - Dependencies (if any)

**Excluded:**
- `node_modules/` - Dependencies (reinstalled on deployment)
- `.coverage/` - Test coverage reports
- `.fdk/` - FDK configuration
- `.git/` - Git repository
- `dist/` - Previous builds
- Test files and fixtures
- Development files (.env, .vscode, etc.)

## Prerequisites

### Required
- ✅ Node.js >= 18.0.0
- ✅ FDK >= 9.6.0
- ✅ Valid manifest.json (Platform 3.0)
- ✅ App passes `fdk validate`

### For Frontend Apps
- ✅ `app/styles/images/icon.svg` exists
- ✅ All HTML files include Crayons CDN
- ✅ No plain HTML form elements

### For Serverless Apps
- ✅ Test coverage >= 80%
- ✅ Coverage report in `coverage/` folder
- ✅ Generated via `fdk run` (then Ctrl+C)

## Validation Checks

### Fatal Errors (Must Fix)
- JSON structure errors
- Missing required files
- Manifest structure errors
- Request template errors
- OAuth configuration errors
- Location placement errors

### Lint Errors (Must Fix)
- Async functions without await
- Unused variables or parameters
- Unreachable code
- Function complexity > 7
- Use of eval() or alert()
- Use of var (should be const/let)

### Warnings (Should Fix)
- Code style issues
- Non-critical best practices
- Performance suggestions

## Coverage Requirements

**Minimum thresholds (all must be >= 80%):**
- Statements: 80%
- Branches: 80%
- Functions: 80%
- Lines: 80%

**How to generate coverage:**
```bash
fdk run
# Wait for app to start
# Press Ctrl+C to stop
# Coverage summary displayed
```

**Coverage location:** `coverage/coverage-summary.json`

**Example coverage summary:**
```json
{
  "total": {
    "lines": { "pct": 90.5 },
    "statements": { "pct": 88.2 },
    "functions": { "pct": 85.7 },
    "branches": { "pct": 82.3 }
  }
}
```

## Node.js Version Handling

**If Node.js version mismatch:**

1. FDK displays warning
2. Prompts to continue
3. If continue:
   - Updates `manifest.json` engines.node
   - Deletes `node_modules/` folder
   - Deletes `coverage/` folder
4. Must re-run `fdk run` to regenerate coverage

**Best practice:** Match Node.js version to manifest.json before packing.

## Common Errors

### "Validation failed"
**Cause:** App has validation errors
**Fix:** Run `fdk validate`, fix errors, re-run pack

### "Coverage below 80%"
**Cause:** Test coverage insufficient
**Fix:** Run `fdk run`, add more tests, re-run pack

### "Icon not found"
**Cause:** Missing `app/styles/images/icon.svg`
**Fix:** Create icon.svg, re-run pack

### "Package creation failed"
**Cause:** Various (permissions, disk space, etc.)
**Fix:** Check error message, ensure dist/ folder writable

### "Node.js version mismatch"
**Cause:** Current Node.js version doesn't match manifest
**Fix:** Update manifest or switch Node.js version

## Package Size Guidelines

**Recommended:** < 50 MB

**If package > 50MB:**
- Remove unused dependencies
- Compress images and assets
- Remove development files
- Check .gitignore patterns
- Consider external hosting for large assets

**Typical package sizes:**
- Frontend-only: 100 KB - 5 MB
- Serverless-only: 50 KB - 2 MB
- Hybrid: 200 KB - 10 MB
- With dependencies: 1 MB - 20 MB

## Success Output

```
Validating app...
✓ Validation passed

Checking coverage...
✓ Coverage: 87.5%
  - Statements: 85%
  - Branches: 90%
  - Functions: 85%
  - Lines: 90%

Packing app...
✓ Package created: dist/my-app-1.0.0.zip

Package details:
- Size: 2.3 MB
- Files: 45
- Platform: 3.0

📦 Ready for submission!
```

## Next Steps After Pack

1. **Verify package:** `unzip -l dist/*.zip`
2. **Test package:** Upload to test account
3. **Prepare submission:**
   - Screenshots (min 3, recommended 5)
   - App description (use Freddy AI)
   - Support email
   - Privacy policy URL
   - Terms of service URL
4. **Submit:** Upload to Developer Portal

## References

- FDK CLI Documentation: https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- App Validation: https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- Submission Process: https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
