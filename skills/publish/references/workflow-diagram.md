# Publish Workflow Diagram

Visual guide to the Freshworks app publishing workflow.

## Complete Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Freshworks App Publishing                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│  1. DEVELOP     │
│  - Create app   │
│  - Write code   │
│  - Test locally │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  2. VALIDATE    │
│  fdk validate   │
│  - Fix errors   │
│  - Check lint   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  3. COVERAGE    │
│  fdk run        │
│  - Run tests    │
│  - Check >= 80% │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  4. PACK        │
│  fdk pack       │
│  - Create .zip  │
│  - Verify size  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  5. SUBMIT      │
│  - Upload .zip  │
│  - Fill details │
│  - Add assets   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  6. REVIEW      │
│  - 5-10 days    │
│  - Code review  │
│  - Testing      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  7. PUBLISH     │
│  - Approved     │
│  - Live in      │
│    marketplace  │
└─────────────────┘
```

## Pack Workflow (Detailed)

```
/publish pack
     │
     ▼
┌─────────────────────────────────────┐
│  Find App Directory                 │
│  - Search for manifest.json         │
│  - If multiple: Ask user to choose  │
│  - If none: Error                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Pre-Pack Validation                │
│  - fdk validate                     │
│  - Check Node.js version            │
│  - Check FDK version                │
└──────────────┬──────────────────────┘
               │
               ├─── Validation fails ──→ Show errors, suggest /fix, STOP
               │
               ▼
┌─────────────────────────────────────┐
│  Check Coverage (if serverless)     │
│  - Look for coverage/ folder        │
│  - Parse coverage-summary.json      │
│  - Check all metrics >= 80%         │
└──────────────┬──────────────────────┘
               │
               ├─── Coverage < 80% ──→ Warn, suggest fdk run, continue
               │
               ▼
┌─────────────────────────────────────┐
│  Pack App                           │
│  - fdk pack                         │
│  - Wait for completion              │
└──────────────┬──────────────────────┘
               │
               ├─── Pack fails ──→ Show error, STOP
               │
               ▼
┌─────────────────────────────────────┐
│  Verify Package                     │
│  - Check dist/*.zip exists          │
│  - Check package size               │
│  - List package contents            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Report Success                     │
│  - Package location                 │
│  - Package size                     │
│  - Next steps                       │
└─────────────────────────────────────┘
```

## Submit Workflow (Detailed)

```
/publish submit
     │
     ▼
┌─────────────────────────────────────┐
│  Check Package Exists               │
│  - Look for dist/*.zip              │
│  - If not found: Run pack           │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Extract App Metadata               │
│  - Read manifest.json               │
│  - Get app name, version            │
│  - Get platform version             │
│  - Get modules/products             │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Generate Submission Checklist      │
│  - Pre-submission checks            │
│  - Package information              │
│  - Submission steps                 │
│  - Required information             │
│  - Post-submission monitoring       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Provide Guidance                   │
│  - Developer Portal access          │
│  - App type selection               │
│  - Upload instructions              │
│  - Required fields                  │
│  - Timeline expectations            │
└─────────────────────────────────────┘
```

## Full Workflow (Combined)

```
/publish
     │
     ▼
┌─────────────────────────────────────┐
│  Find App Directory                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Validate App                       │
│  fdk validate                       │
└──────────────┬──────────────────────┘
               │
               ├─── Fails ──→ Show errors, suggest /fix, STOP
               │
               ▼
┌─────────────────────────────────────┐
│  Check Coverage                     │
└──────────────┬──────────────────────┘
               │
               ├─── < 80% ──→ Warn, suggest tests
               │
               ▼
┌─────────────────────────────────────┐
│  Pack App                           │
│  fdk pack                           │
└──────────────┬──────────────────────┘
               │
               ├─── Fails ──→ Show error, STOP
               │
               ▼
┌─────────────────────────────────────┐
│  Verify Package                     │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Extract Metadata                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Generate Submission Checklist      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Report Complete                    │
│  - Package ready                    │
│  - Submission guidance              │
└─────────────────────────────────────┘
```

## Decision Trees

### App Type Selection

```
What type of app?
     │
     ├─── Public marketplace? ──→ Freshworks App
     │         │                  - Review: 5-10 days
     │         │                  - Revenue: Optional
     │         │                  - Reach: All customers
     │
     ├─── Private/Customer-specific? ──→ Custom App
     │         │                        - Review: None
     │         │                        - Publish: Immediate
     │         │                        - Reach: One customer
     │
     └─── External hosting? ──→ External App
               │                - Review: 5-10 days
               │                - Install: From external URL
               │                - Reach: All customers
```

### Coverage Check Decision

```
Is app serverless?
     │
     ├─── YES ──→ Check coverage
     │              │
     │              ├─── >= 80% ──→ Continue to pack
     │              │
     │              └─── < 80% ──→ Warn user
     │                              │
     │                              ├─── User fixes ──→ Re-check
     │                              │
     │                              └─── User skips ──→ Warn (will be rejected)
     │
     └─── NO ──→ Skip coverage check, continue to pack
```

### Validation Error Handling

```
fdk validate
     │
     ├─── PASS ──→ Continue to coverage check
     │
     └─── FAIL ──→ Show errors
                    │
                    ├─── Fatal errors ──→ STOP, must fix
                    │
                    ├─── Lint errors ──→ Suggest /fix, STOP
                    │
                    └─── Warnings only ──→ Warn, continue
```

## File Structure Flow

```
App Files
     │
     ▼
┌─────────────────────────────────────┐
│  Validation                         │
│  - Check structure                  │
│  - Check syntax                     │
│  - Check compliance                 │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Testing (if serverless)            │
│  - Run tests                        │
│  - Generate coverage                │
│  - Verify >= 80%                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Packaging                          │
│  - Bundle files                     │
│  - Exclude dev files                │
│  - Create .zip                      │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Package Output                     │
│  dist/<app-name>-<version>.zip      │
└─────────────────────────────────────┘
```

## Coverage Generation Flow

```
fdk run
     │
     ▼
┌─────────────────────────────────────┐
│  Start Local Server                 │
│  - Deploy app                       │
│  - Run test suite                   │
│  - Collect coverage data            │
└──────────────┬──────────────────────┘
               │
               ▼ (User presses Ctrl+C)
┌─────────────────────────────────────┐
│  Stop Server                        │
│  - Display coverage summary         │
│  - Save to coverage/                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Coverage Files Created             │
│  - coverage-summary.json            │
│  - lcov-report/index.html           │
│  - lcov.info                        │
└─────────────────────────────────────┘
```

## Submission Portal Flow

```
Developer Portal
     │
     ▼
┌─────────────────────────────────────┐
│  Access Portal                      │
│  - Admin > Apps > Build it yourself │
│  - Or: Neo Admin Center > /developer│
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Create New App                     │
│  - Select app type                  │
│  - Upload package                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Fill Details                       │
│  - Name, description                │
│  - Categories                       │
│  - Screenshots                      │
│  - Legal info                       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Configure Pricing (if paid)        │
│  - Free or paid                     │
│  - Pricing tiers                    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Submit                             │
│  - Review all info                  │
│  - Click Submit/Publish             │
└──────────────┬──────────────────────┘
               │
               ├─── Freshworks App ──→ Review (5-10 days)
               │                        │
               │                        ├─── Approved ──→ Published
               │                        │
               │                        └─── Changes Requested ──→ Fix & Resubmit
               │
               ├─── Custom App ──→ Published Immediately
               │
               └─── External App ──→ Review (5-10 days)
```

## Error Resolution Flow

```
Error Detected
     │
     ▼
┌─────────────────────────────────────┐
│  Classify Error                     │
│  - Fatal (must fix)                 │
│  - Lint (should fix)                │
│  - Warning (optional)               │
└──────────────┬──────────────────────┘
               │
               ├─── Fatal ──→ STOP, fix required
               │                │
               │                ├─── Missing icon ──→ Create icon.svg
               │                │
               │                ├─── JSON error ──→ Fix structure
               │                │
               │                └─── Manifest error ──→ Fix manifest
               │
               ├─── Lint ──→ Suggest /fix
               │                │
               │                ├─── Async without await ──→ Add await or remove async
               │                │
               │                ├─── Unused parameter ──→ Remove or prefix with _
               │                │
               │                └─── Unreachable code ──→ Remove dead code
               │
               └─── Warning ──→ Warn, continue
```

## Coverage Improvement Flow

```
Coverage < 80%
     │
     ▼
┌─────────────────────────────────────┐
│  Identify Gaps                      │
│  - Open HTML report                 │
│  - Find uncovered lines             │
│  - Check branch coverage            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Write Tests                        │
│  - Test success cases               │
│  - Test error cases                 │
│  - Test edge cases                  │
│  - Test all branches                │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  Regenerate Coverage                │
│  - fdk run                          │
│  - Press Ctrl+C                     │
│  - Check new percentages            │
└──────────────┬──────────────────────┘
               │
               ├─── Still < 80% ──→ Repeat (write more tests)
               │
               └─── >= 80% ──→ Continue to pack
```

## Parallel Operations

**During validation phase, run in parallel:**

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  fdk validate   │   │  node --version │   │  fdk version    │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                      │
         └─────────────────────┴──────────────────────┘
                               │
                               ▼
                    All checks complete
```

## Sequential Operations

**Pack workflow must be sequential:**

```
Validate ──→ Check Coverage ──→ Pack ──→ Verify ──→ Report

(Each step depends on previous step's success)
```

## App Type Comparison

```
┌─────────────────────────────────────────────────────────────────┐
│                        App Type Comparison                       │
├─────────────────┬───────────────┬───────────────┬───────────────┤
│                 │ Freshworks    │ Custom        │ External      │
├─────────────────┼───────────────┼───────────────┼───────────────┤
│ Listing         │ Public        │ Private       │ Public        │
│ Review          │ Yes (5-10d)   │ No            │ Yes (5-10d)   │
│ Publish Time    │ After review  │ Immediate     │ After review  │
│ Revenue         │ Yes (optional)│ No            │ No            │
│ Installation    │ Marketplace   │ Marketplace   │ External URL  │
│ Reach           │ All customers │ One customer  │ All customers │
│ Use Case        │ General       │ Specific      │ Integration   │
└─────────────────┴───────────────┴───────────────┴───────────────┘
```

## Coverage Metrics Explained

```
┌─────────────────────────────────────────────────────────────────┐
│                      Coverage Metrics                            │
├─────────────────┬───────────────────────────────────────────────┤
│ Statements      │ Individual executable statements              │
│                 │ Example: let x = 5; (1 statement)            │
├─────────────────┼───────────────────────────────────────────────┤
│ Branches        │ Conditional paths (if/else, switch, ternary)  │
│                 │ Example: if (x) {...} else {...} (2 branches)│
├─────────────────┼───────────────────────────────────────────────┤
│ Functions       │ Function definitions and calls                │
│                 │ Example: function foo() {} (1 function)      │
├─────────────────┼───────────────────────────────────────────────┤
│ Lines           │ Physical lines of code                        │
│                 │ Example: 100 lines in file (lines metric)    │
└─────────────────┴───────────────────────────────────────────────┘

All 4 metrics must be >= 80%
```

## Package Contents

```
dist/<app-name>-<version>.zip
│
├── app/ (if frontend)
│   ├── index.html
│   ├── scripts/
│   │   └── app.js
│   └── styles/
│       ├── style.css
│       └── images/
│           └── icon.svg ← REQUIRED
│
├── server/ (if serverless)
│   └── server.js
│
├── config/
│   ├── iparams.json ← REQUIRED
│   ├── requests.json (if hybrid)
│   └── oauth_config.json (if OAuth)
│
├── manifest.json ← REQUIRED
├── README.md ← REQUIRED
└── package.json (if dependencies)

EXCLUDED:
✗ node_modules/
✗ coverage/
✗ .fdk/
✗ .git/
✗ dist/ (previous builds)
✗ Test files
```

## Timeline Visualization

```
Day 0: Pack & Submit
     │
     ▼
Day 0-3: Initial Review
     │    - Automated checks
     │    - Code scanning
     │
     ▼
Day 3-5: Manual Review
     │    - Functionality testing
     │    - UI/UX review
     │    - Documentation review
     │
     ▼
Day 5-10: Final Review
     │     - Security audit
     │     - Performance testing
     │     - Compliance check
     │
     ├─── Approved ──→ Published (Day 5-10)
     │
     └─── Changes Requested ──→ Developer fixes (7 days)
                                     │
                                     ▼
                                Re-review (Day 2-3)
                                     │
                                     ├─── Approved ──→ Published
                                     │
                                     └─── Rejected ──→ Major rework needed
```

## Skill Integration

```
┌─────────────────────────────────────────────────────────────────┐
│                    Skill Workflow Integration                    │
└─────────────────────────────────────────────────────────────────┘

Step 1: Setup
     │
     ▼
┌─────────────────┐
│  /fdk-setup     │  Install FDK
│  install        │
└────────┬────────┘
         │
         ▼

Step 2: Develop
     │
     ▼
┌─────────────────┐
│  @app-dev       │  Create app
│  "Create app"   │
└────────┬────────┘
         │
         ▼

Step 3: Fix
     │
     ▼
┌─────────────────┐
│  /fix           │  Fix validation errors
└────────┬────────┘
         │
         ▼

Step 4: Publish
     │
     ▼
┌─────────────────┐
│  /publish       │  Pack and submit
└─────────────────┘
```

## Error Severity Levels

```
┌─────────────────────────────────────────────────────────────────┐
│                      Error Severity Levels                       │
├─────────────────┬───────────────────────────────────────────────┤
│ FATAL           │ Must fix before pack                          │
│ (Red)           │ - Missing icon.svg                            │
│                 │ - JSON structure errors                       │
│                 │ - Manifest errors                             │
│                 │ - Request template errors                     │
├─────────────────┼───────────────────────────────────────────────┤
│ LINT ERROR      │ Must fix before submission                    │
│ (Orange)        │ - Async without await                         │
│                 │ - Unused parameters                           │
│                 │ - Unreachable code                            │
│                 │ - Complexity > 7                              │
├─────────────────┼───────────────────────────────────────────────┤
│ WARNING         │ Should fix (recommended)                      │
│ (Yellow)        │ - Code style issues                           │
│                 │ - Performance suggestions                     │
│                 │ - Best practice violations                    │
└─────────────────┴───────────────────────────────────────────────┘
```

## Success Indicators

```
✓ Validation: PASSED
✓ Coverage: >= 80% (all metrics)
✓ Package: Created in dist/
✓ Size: < 50 MB
✓ Structure: Correct
✓ Documentation: Complete
✓ Assets: Ready (screenshots, icon)
✓ Legal: Privacy policy, terms of service
✓ Support: Email configured

═══════════════════════════════════
     READY FOR SUBMISSION ✓
═══════════════════════════════════
```

## Quick Reference

| Command | Purpose | Time |
|---------|---------|------|
| `fdk validate` | Check for errors | 1-2 min |
| `fdk validate --fix` | Auto-fix errors | 1-2 min |
| `fdk run` | Generate coverage | 2-5 min |
| `fdk pack` | Create package | 1-2 min |
| `/publish pack` | Validate + pack | 3-5 min |
| `/publish submit` | Submission guide | 1 min |
| `/publish` | Full workflow | 5-10 min |

## Resources

- **CLI Reference:** https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- **Submission Process:** https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
- **Validation Guidelines:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
