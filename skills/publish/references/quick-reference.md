# Quick Reference: Pack and Publish

Fast reference for packing and publishing Freshworks apps.

## Commands

```bash
# Validate app
fdk validate

# Validate and auto-fix
fdk validate --fix

# Pack app
fdk pack

# Pack specific directory
fdk pack --app-dir /path/to/app

# Skip coverage (NOT recommended)
fdk pack --skip-coverage

# Run app and generate coverage
fdk run
# Press Ctrl+C after app starts

# Run tests
fdk test

# Check FDK version
fdk version
```

## Pre-Pack Checklist

**Quick checks before packing:**

```bash
# 1. Validate
fdk validate

# 2. Check coverage (if serverless)
cat coverage/coverage-summary.json | grep "pct"

# 3. Check icon exists (if frontend)
ls app/styles/images/icon.svg

# 4. Pack
fdk pack

# 5. Verify package
ls -lh dist/*.zip
```

## Coverage Quick Check

```bash
# Generate coverage
fdk run
# Press Ctrl+C

# Check percentages
cat coverage/coverage-summary.json | grep '"pct"'

# All must be >= 80%
```

## Package Verification

```bash
# List package contents
unzip -l dist/*.zip

# Check package size
du -h dist/*.zip

# Test package integrity
unzip -t dist/*.zip
```

## App Types

| Type | Review | Timeline | Best For |
|------|--------|----------|----------|
| Freshworks | Yes | 5-10 days | Public marketplace |
| Custom | No | Immediate | Private, customer-specific |
| External | Yes | 5-10 days | Third-party integration |

## Developer Portal Access

**Option 1:**
```
Product → Admin → Apps → Build it yourself
```

**Option 2:**
```
Neo Admin Center → My Accounts → /developer
```

## Submission Steps

1. **Upload** - dist/*.zip
2. **Details** - Name, description, categories
3. **Assets** - Screenshots (min 3)
4. **Legal** - Support email, privacy policy, terms
5. **Pricing** - Free or paid (if Freshworks app)
6. **Submit** - Review or publish

## Common Errors

| Error | Quick Fix |
|-------|-----------|
| Validation fails | `fdk validate --fix` |
| Coverage < 80% | `fdk run`, add tests |
| Icon missing | Create `app/styles/images/icon.svg` |
| Package fails | Fix validation errors first |
| Upload fails | Check network, try different browser |

## Required Files

**All apps:**
- manifest.json
- config/iparams.json
- README.md

**Frontend:**
- app/index.html
- app/scripts/app.js
- app/styles/style.css
- app/styles/images/icon.svg ← **CRITICAL**

**Serverless:**
- server/server.js
- server/test/*.test.js

## Validation Requirements

- ✅ Platform 3.0
- ✅ No fatal errors
- ✅ No lint errors
- ✅ Coverage >= 80% (serverless)
- ✅ All files present

## Package Requirements

- ✅ Size < 50 MB (recommended)
- ✅ Valid ZIP format
- ✅ Correct structure
- ✅ No node_modules/
- ✅ No coverage/ or .fdk/

## Documentation Requirements

- ✅ README with setup instructions
- ✅ All iparams documented
- ✅ OAuth guide (if applicable)
- ✅ Screenshots (min 3)
- ✅ Support email

## Timeline

| Stage | Duration |
|-------|----------|
| Pack | 5 min |
| Upload | 5 min |
| Fill details | 30 min |
| Review (Freshworks) | 5-10 days |
| Review (Custom) | Immediate |
| Feedback response | 7 days |
| Re-review | 2-3 days |

## Resources

- **Developer Portal:** https://developers.freshworks.com/
- **CLI Reference:** https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- **Validation:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- **Submission:** https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
- **Community:** https://community.freshworks.dev/
