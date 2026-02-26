<h1 align="center">Freshworks App Publishing</h1>

<p align="center"><strong>Automated workflow for packing and publishing Freshworks apps to the marketplace</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-3.0-blue?style=for-the-badge" alt="Platform 3.0">
  <img src="https://img.shields.io/badge/Cursor-Plugin-00a67e?style=for-the-badge" alt="Cursor Plugin">
  <img src="https://img.shields.io/badge/FDK-9.x-0052cc?style=for-the-badge" alt="FDK">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Coverage-80%25+-brightgreen?style=flat-square" alt="Coverage">
  <img src="https://img.shields.io/badge/Validation-Automated-764abc?style=flat-square" alt="Validation">
</p>

<p align="center">Complete automation for validating, packing, and submitting Freshworks apps.<br>Handles <strong>validation</strong>, <strong>coverage checks</strong>, and <strong>package creation</strong> with guided submission.</p>

<p align="center"><code>Validate</code> · <code>Pack</code> · <code>Coverage</code> · <code>Submit</code> · <code>Marketplace</code></p>

## Features

- ✅ Automated validation before packing
- ✅ Test coverage verification (>= 80% required)
- ✅ Package creation with `fdk pack`
- ✅ Package size and content verification
- ✅ Submission checklist generation
- ✅ App type guidance (Freshworks/Custom/External)
- ✅ Error detection and fix suggestions

## Install

### Install via CLI:

```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill freshworks-publish
```

### Install as Claude Plugin

**Step1**

```bash
claude plugin marketplace add freshworks-developers/marketplace
```

**Step2**

```bash
claude plugin install <publish>@freshworks-developers
```

## Verify Installation

The plugin should appear in Cursor Settings → Plugins → Installed Plugins.

## Usage

**Auto-invoked by Cursor:**
- Ask: "pack my app", "publish to marketplace", "how do I submit my app?"
- Cursor automatically loads the skill when detecting publish-related questions

**Slash Commands:**
```bash
/publish                 # Full workflow: validate → pack → submit guidance
/publish pack            # Validate and pack app
/publish submit          # Generate submission checklist
```

## What's Included

**Skills:**
- `freshworks-publish` - Automated app publishing workflow

**Commands:**
- `/publish` - Full workflow: validate → pack → submit guidance
- `/publish pack` - Validate and pack app
- `/publish submit` - Generate submission checklist

## Workflow

### 1. Pack App

```bash
/publish pack
```

**What it does:**
1. Finds app directory (searches for manifest.json)
2. Runs `fdk validate` to check for errors
3. Checks test coverage (>= 80% for serverless apps)
4. Runs `fdk pack` to create package
5. Verifies package created in `dist/` folder
6. Reports package size and location

**Output:**
```
✓ App directory: /Users/dev/my-app
✓ Validation: PASSED
✓ Test coverage: 87.5%
✓ Package created: dist/my-app-1.0.0.zip (2.3 MB)

📦 Ready for submission!
```

### 2. Submit Guidance

```bash
/publish submit
```

**What it does:**
1. Ensures app is packed (runs pack if needed)
2. Extracts app metadata from manifest.json
3. Generates personalized submission checklist
4. Provides step-by-step upload instructions
5. Lists required documentation and screenshots

**Output:**
- Pre-submission checklist
- Package details
- Developer Portal access instructions
- App type selection guidance
- Required information list
- Post-submission monitoring tips

### 3. Full Workflow

```bash
/publish
```

**What it does:**
- Combines pack + submit workflows
- Complete end-to-end automation
- Validation → Coverage → Pack → Submission guidance

## Requirements

- Cursor IDE
- Node.js >= 18.0.0
- FDK >= 9.6.0
- Completed Freshworks app with passing validation

## Pre-Pack Checklist

Before packing, ensure:

### Mandatory Files
- [ ] `manifest.json` - Platform 3.0 structure
- [ ] `config/iparams.json` - Even if empty `{}`
- [ ] `app/styles/images/icon.svg` - Required for frontend apps
- [ ] `README.md` - App documentation

### Validation
- [ ] `fdk validate` passes with no fatal errors
- [ ] No lint errors (async without await, unused vars, etc.)
- [ ] Platform version is 3.0
- [ ] All modules properly declared

### Coverage (Serverless Apps)
- [ ] Test coverage >= 80% for all metrics
- [ ] Coverage report generated via `fdk run`

### Documentation
- [ ] README with setup instructions
- [ ] All iparams documented
- [ ] OAuth setup guide (if applicable)
- [ ] Screenshots prepared (min 3, recommended 5)

## Marketplace Submission Types

### Freshworks App
- **Public** marketplace listing
- **Review required** (5-10 business days)
- **Revenue-generating** (optional)
- **Best for:** Apps with broad appeal

### Custom App
- **Private** to specific customer
- **No review** required
- **Immediate** publish
- **Best for:** Customer-specific solutions

### External App
- **Listed** in marketplace
- **Installed** from external URL
- **Review required**
- **Best for:** Third-party integrations

## Common Issues

### "Validation failed"
**Solution:** Run `/fix` to auto-fix errors, then re-run `/publish pack`

### "Coverage below 80%"
**Solution:** Run `fdk run`, wait for app to start, press Ctrl+C, then re-run `/publish pack`

### "Package not created"
**Solution:** Check `fdk validate` output, fix all errors, ensure dist/ folder has write permissions

### "Node.js version mismatch"
**Solution:** Update manifest.json engines.node to match your Node.js version, or switch Node.js version

## Integration with Other Skills

**Works seamlessly with:**
- **app-dev** - Generate apps before publishing
- **fdk-setup** - Install/upgrade FDK
- **fix** - Auto-fix validation errors

**Typical workflow:**
```bash
# 1. Create app
@app-dev "Create Freshdesk ticket sidebar app"

# 2. Fix any errors
/fix

# 3. Pack and publish
/publish
```

## Support

For issues or questions:
- 📖 [Freshworks Developer Docs](https://developers.freshworks.com/)
- 📋 [Submission Guidelines](https://developers.freshworks.com/docs/guides/submission-guidelines/)
- 🐛 [Report Issues](https://github.com/freshworks-developers/marketplace/issues)

## License

MIT
