# Freshworks App Publish Skill - Overview

Complete overview of the publish skill structure, features, and usage.

## Skill Summary

**Name:** publish  
**Purpose:** Automated workflow for packing and publishing Freshworks Platform 3.0 apps to the marketplace  
**Execution Mode:** AUTONOMOUS (executes immediately without asking permission)

## What This Skill Does

1. **Validates** apps before packing (runs `fdk validate`)
2. **Checks coverage** for serverless apps (>= 80% required)
3. **Packs** apps into distributable packages (`fdk pack`)
4. **Verifies** package creation and size
5. **Guides** submission to Freshworks Marketplace

## File Structure

```
skills/publish/
├── SKILL.md (781 lines)
│   Main skill file with autonomous execution logic
│   - Pack workflow
│   - Submit workflow
│   - Full publish workflow
│   - Error handling
│   - Coverage validation
│
├── README.md (234 lines)
│   User-facing documentation
│   - Installation instructions
│   - Usage examples
│   - Feature list
│   - Integration with other skills
│
├── .skillignore
│   Files to exclude from skill package
│
├── .cursor/commands/
│   Slash commands for Cursor IDE
│   ├── publish.md - Full workflow command
│   ├── pack.md - Pack only command
│   └── submit.md - Submission guidance command
│
└── references/
    Detailed documentation (progressive disclosure)
    ├── pack-command.md - FDK pack reference
    ├── submission-process.md - Marketplace submission guide
    ├── coverage-requirements.md - Test coverage guide
    ├── marketplace-requirements.md - Complete requirements
    ├── troubleshooting.md - Common issues and fixes
    ├── quick-reference.md - Fast lookup guide
    ├── checklist-template.md - Pre-submission checklist
    └── workflow-diagram.md - Visual workflow diagrams
```

## Commands

### Slash Commands (Cursor IDE)

```bash
/publish          # Full workflow: validate → pack → submit guidance
/publish pack     # Validate and pack app only
/publish submit   # Generate submission checklist and guidance
```

### Skill Invocation

**Auto-invoked when user says:**
- "pack my app"
- "publish to marketplace"
- "submit my app"
- "create app package"
- "how do I publish?"
- "prepare app for submission"

**Manual invocation:**
```
@publish "pack my app"
```

## Key Features

### 1. Automated Validation
- Runs `fdk validate` before packing
- Checks for fatal errors, lint errors, warnings
- Suggests `/fix` command for auto-fixing
- Stops pack if validation fails

### 2. Coverage Verification
- Checks test coverage for serverless apps
- Verifies all metrics >= 80%
- Warns if coverage insufficient
- Suggests running `fdk run` to regenerate

### 3. Package Creation
- Runs `fdk pack` to create distributable
- Creates `dist/<app-name>-<version>.zip`
- Verifies package created successfully
- Checks package size (warns if > 50MB)

### 4. Submission Guidance
- Generates personalized checklist
- Extracts app metadata from manifest
- Provides step-by-step portal instructions
- Lists required information and assets
- Explains app type selection

### 5. Error Handling
- Detects and classifies errors
- Provides specific fix suggestions
- Links to relevant documentation
- Suggests related commands

## Workflows

### Pack Workflow

```
Input: App directory (auto-detected or specified)
  ↓
Find manifest.json
  ↓
Run fdk validate
  ↓
Check coverage (if serverless)
  ↓
Run fdk pack
  ↓
Verify package
  ↓
Output: dist/*.zip + success message
```

### Submit Workflow

```
Input: App directory
  ↓
Check for existing package
  ↓
If no package: Run pack workflow
  ↓
Extract app metadata
  ↓
Generate submission checklist
  ↓
Provide portal access instructions
  ↓
Output: Complete submission guide
```

### Full Workflow

```
Input: App directory
  ↓
Pack workflow (validate → coverage → pack)
  ↓
Submit workflow (checklist → guidance)
  ↓
Output: Package + submission guide
```

## Integration with Other Skills

### Works With

**fdk-setup:**
- Ensures FDK is installed
- Checks FDK version
- Upgrades if needed

**app-dev:**
- Creates apps
- Fixes validation errors
- Ensures Platform 3.0 compliance

**fix:**
- Auto-fixes validation errors
- Fixes lint errors
- Prepares app for packing

### Typical Multi-Skill Workflow

```
1. @fdk-setup install
   → Install FDK

2. @app-dev "Create Freshdesk ticket sidebar app"
   → Generate app

3. /fix
   → Fix any validation errors

4. /publish
   → Pack and get submission guidance
```

## Reference Documentation

### Progressive Disclosure

**Load references as needed:**

1. **pack-command.md** - When user asks about pack command details
2. **submission-process.md** - When user asks about submission steps
3. **coverage-requirements.md** - When coverage issues arise
4. **marketplace-requirements.md** - When user asks about requirements
5. **troubleshooting.md** - When errors occur
6. **quick-reference.md** - For fast lookups
7. **checklist-template.md** - For pre-submission verification
8. **workflow-diagram.md** - For visual explanations

### Reference Topics

**pack-command.md:**
- FDK pack syntax and options
- Package output structure
- Prerequisites and requirements
- Node.js version handling
- Common pack errors

**submission-process.md:**
- App types (Freshworks, Custom, External)
- Developer Portal access
- Submission workflow
- Review process
- Post-submission monitoring
- Updating published apps

**coverage-requirements.md:**
- Coverage metrics explained
- Generating coverage
- Writing tests
- Improving coverage
- Coverage analysis
- Testing best practices

**marketplace-requirements.md:**
- Technical requirements
- File requirements
- Manifest requirements
- Code quality standards
- UI/UX requirements
- Documentation requirements
- Legal requirements
- Compliance requirements

**troubleshooting.md:**
- Common pack issues
- Validation issues
- Coverage issues
- Submission issues
- Package issues
- FDK issues
- Quick fixes

**quick-reference.md:**
- Command cheat sheet
- Pre-pack checklist
- Coverage quick check
- Package verification
- Common errors table
- Timeline estimates

**checklist-template.md:**
- Pre-pack validation checklist
- Code quality checklist
- Test coverage checklist
- Manifest validation checklist
- UI/UX checklist
- Documentation checklist
- Asset checklist
- Legal checklist
- Submission checklist

**workflow-diagram.md:**
- Complete workflow diagram
- Pack workflow (detailed)
- Submit workflow (detailed)
- Decision trees
- Error resolution flow
- Coverage improvement flow
- Timeline visualization

## Execution Patterns

### Autonomous Execution

**The skill executes immediately:**
- No confirmation prompts
- No manual instruction steps
- Direct command execution
- Automatic error handling

**Example:**
```
User: "pack my app"

Agent:
1. Searches for manifest.json (no prompt)
2. Runs fdk validate (no prompt)
3. Checks coverage (no prompt)
4. Runs fdk pack (no prompt)
5. Reports results
```

### Parallel Operations

**When possible, run in parallel:**
```bash
# During validation phase
fdk validate &
node --version &
fdk version &
wait
```

### Sequential Operations

**When dependencies exist:**
```bash
# Must be sequential
fdk validate && fdk pack
# (pack depends on validation passing)
```

## Error Handling Strategy

### Fatal Errors (STOP)
- Missing required files
- Validation failures
- JSON structure errors
- Manifest errors

**Action:** Show error, suggest fix, STOP

### Lint Errors (STOP)
- Async without await
- Unused parameters
- Unreachable code

**Action:** Show error, suggest `/fix`, STOP

### Warnings (CONTINUE)
- Code style issues
- Non-critical suggestions

**Action:** Warn, continue with pack

### Coverage < 80% (WARN)
- Insufficient test coverage

**Action:** Warn, suggest `fdk run`, continue (will be rejected by marketplace)

## Output Formats

### Success Output

```
✓ App directory: /path/to/my-app
✓ Platform version: 3.0
✓ Validation: PASSED
✓ Test coverage: 87.5%
  - Statements: 85%
  - Branches: 90%
  - Functions: 85%
  - Lines: 90%
✓ Package created: dist/my-app-1.0.0.zip (2.3 MB)

📦 Package ready for submission!

🚀 Next Steps:
[Submission guidance...]
```

### Error Output

```
❌ Validation failed with 3 errors:

1. Missing required file: app/styles/images/icon.svg
   Fix: Create icon.svg in app/styles/images/

2. Async function without await (server/server.js:45)
   Fix: Add await expression or remove async keyword

3. Unused parameter 'args' (server/server.js:23)
   Fix: Remove parameter or prefix with _

Run: /fix to auto-fix all errors
```

### Warning Output

```
⚠️  Test coverage below 80%:
   - Statements: 65%
   - Branches: 70%
   - Functions: 60%
   - Lines: 68%

Marketplace requires >= 80% coverage.

Fix:
1. Run: fdk run (generates coverage)
2. Add tests in server/test/
3. Re-run: /publish pack

Or pack anyway: fdk pack --skip-coverage (NOT recommended)
```

## Usage Examples

### Example 1: Pack App

```
User: "pack my app for marketplace"

Agent:
1. Searches workspace for manifest.json
2. Finds app at /Users/dev/my-app
3. Runs fdk validate → PASSED
4. Checks coverage → 87.5% ✓
5. Runs fdk pack → SUCCESS
6. Reports: Package created at dist/my-app-1.0.0.zip (2.3 MB)
```

### Example 2: Multiple Apps

```
User: "pack my app"

Agent:
1. Searches workspace
2. Finds 3 apps with manifest.json
3. Asks: "Which app do you want to pack?"
   - /Users/dev/app1
   - /Users/dev/app2
   - /Users/dev/app3
4. User selects app1
5. Continues with pack workflow
```

### Example 3: Validation Fails

```
User: "publish my app"

Agent:
1. Finds app
2. Runs fdk validate → FAILED (3 errors)
3. Shows errors with specific fixes
4. Suggests: Run /fix to auto-fix
5. STOPS (does not pack)
```

### Example 4: Coverage Low

```
User: "pack my serverless app"

Agent:
1. Finds app
2. Runs fdk validate → PASSED
3. Checks coverage → 65% (< 80%)
4. Warns about low coverage
5. Suggests: Run fdk run to regenerate
6. Asks: Continue anyway? (will be rejected by marketplace)
```

## Best Practices

### Before Using This Skill

1. **Complete development** - App should be feature-complete
2. **Test thoroughly** - All features tested in target product
3. **Fix all errors** - Use `/fix` to resolve validation issues
4. **Generate coverage** - Run `fdk run` for serverless apps
5. **Prepare assets** - Screenshots, documentation ready

### During Pack

1. **Let it run** - Don't interrupt the process
2. **Review output** - Check for warnings or issues
3. **Verify package** - Confirm dist/*.zip created
4. **Check size** - Ensure < 50 MB

### Before Submission

1. **Review checklist** - Use generated checklist
2. **Prepare screenshots** - Min 3, recommended 5
3. **Write description** - Use Freddy AI for optimization
4. **Configure support** - Valid email, monitored regularly
5. **Legal docs ready** - Privacy policy, terms of service

### After Submission

1. **Monitor email** - Watch for review updates
2. **Respond quickly** - Within 7 days for feedback
3. **Test published app** - Verify it works in production
4. **Provide support** - Help users with issues

## Performance Characteristics

**Typical execution times:**
- Find app: < 1 second
- Validate: 1-2 minutes
- Check coverage: < 1 second
- Pack: 1-2 minutes
- Generate checklist: < 1 second
- **Total: 3-5 minutes**

**Optimization:**
- Parallel operations where possible
- Cached validation results
- Efficient file searching
- Minimal user interaction

## Skill Metadata

**Version:** 1.0.0  
**Platform:** Freshworks Platform 3.0  
**FDK:** >= 9.6.0  
**Node.js:** >= 18.0.0  
**Lines of Code:** 781 (SKILL.md) + 234 (README.md) = 1,015 lines  
**Reference Docs:** 8 files  
**Commands:** 3 files  
**Total Files:** 14 files

## Installation

**From GitHub:**
```bash
npx skills add https://github.com/freshworks-developers/marketplace --skill publish
```

**From local:**
```bash
npx skills add /path/to/marketplace/skills/publish
```

**Verify installation:**
- Check Cursor Settings → Features → Cursor Skills
- Skill should appear as "publish"

## Dependencies

**Required:**
- Cursor IDE
- Node.js >= 18.0.0
- FDK >= 9.6.0
- Completed Freshworks app

**Optional:**
- app-dev skill (for creating apps)
- fdk-setup skill (for FDK management)
- fix command (for auto-fixing errors)

## Compatibility

**Works with:**
- Platform 3.0 apps
- Frontend apps
- Serverless apps
- Hybrid apps
- OAuth apps

**Does NOT work with:**
- Platform 2.x apps (must migrate first)
- Non-Freshworks projects
- Apps without manifest.json

## Success Metrics

**Skill succeeds when:**
- ✅ Package created in dist/ folder
- ✅ Package size reasonable
- ✅ Validation passes
- ✅ Coverage >= 80% (if serverless)
- ✅ User has submission guidance

**Skill fails when:**
- ❌ No manifest.json found
- ❌ Validation fails (fatal errors)
- ❌ Pack command fails
- ❌ FDK not installed

## Comparison with Manual Process

### Manual Process (Without Skill)

```
1. cd to app directory (manual)
2. Run fdk validate (manual)
3. Check output for errors (manual)
4. Fix errors one by one (manual)
5. Run fdk run (manual)
6. Wait for app to start (manual)
7. Press Ctrl+C (manual)
8. Check coverage summary (manual)
9. Run fdk pack (manual)
10. Check if package created (manual)
11. Look up submission instructions (manual)
12. Navigate to Developer Portal (manual)
13. Figure out which fields to fill (manual)

Time: 30-60 minutes
Error-prone: Yes
```

### With Publish Skill

```
1. Type: /publish

Time: 3-5 minutes
Error-prone: No (automated checks)
```

**Time saved:** 25-55 minutes per publish  
**Error reduction:** ~90% (automated validation)

## Advanced Usage

### Pack Specific Directory

```bash
/publish pack /path/to/my-app
```

### Pack Multiple Apps

```bash
# Skill will detect multiple apps and ask which to pack
/publish pack
```

### Skip Coverage (Testing Only)

```bash
# Manual override (not via skill)
cd app-directory
fdk pack --skip-coverage
```

## Troubleshooting

**If skill doesn't activate:**
1. Check skill is installed: Cursor Settings → Features → Cursor Skills
2. Try manual invocation: `@publish "pack my app"`
3. Verify FDK installed: `fdk version`

**If pack fails:**
1. Run `/fix` to auto-fix validation errors
2. Run `fdk run` to regenerate coverage
3. Check FDK version: `fdk version`
4. Check Node.js version: `node --version`

**If coverage insufficient:**
1. Run `fdk run` to generate coverage
2. Add tests in `server/test/`
3. Re-run `fdk run` to regenerate
4. Verify all metrics >= 80%

## Future Enhancements

**Planned features:**
- Automatic screenshot generation
- Description optimization with AI
- Category suggestions
- Pricing recommendations
- Performance analysis
- Security scanning
- Automated testing
- Version bump suggestions

## Contributing

**To improve this skill:**
1. Fork repository
2. Make changes
3. Test thoroughly
4. Submit pull request

**Areas for contribution:**
- Additional error handling
- More troubleshooting scenarios
- Better submission guidance
- Performance optimizations
- Documentation improvements

## Resources

**Official Documentation:**
- Developer Portal: https://developers.freshworks.com/
- CLI Reference: https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- Validation: https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- Submission: https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/

**Community:**
- Developer Community: https://community.freshworks.dev/
- GitHub Issues: https://github.com/freshworks-developers/marketplace/issues
- Support Email: developer-support@freshworks.com

## License

MIT

## Changelog

### Version 1.0.0 (2026-02-23)
- Initial release
- Pack workflow
- Submit workflow
- Full publish workflow
- Coverage validation
- Error handling
- Submission guidance
- 8 reference documents
- 3 slash commands
