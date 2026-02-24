# Marketplace Submission Checklist Template

Use this checklist to ensure your app is ready for marketplace submission.

## Pre-Pack Validation

### Platform 3.0 Compliance
- [ ] `"platform-version": "3.0"` in manifest.json
- [ ] Uses `"modules"` structure (not `"product"`)
- [ ] No Platform 2.x patterns (whitelisted-domains, $request.post(), etc.)
- [ ] `"engines"` block present with Node.js and FDK versions

### Mandatory Files
- [ ] `manifest.json` - Platform 3.0 structure
- [ ] `config/iparams.json` - Even if empty `{}`
- [ ] `README.md` - App documentation

### Frontend Apps (If Applicable)
- [ ] `app/index.html` - Main HTML file
- [ ] `app/scripts/app.js` - JavaScript logic
- [ ] `app/styles/style.css` - Styling
- [ ] `app/styles/images/icon.svg` - **REQUIRED** app icon
- [ ] Crayons CDN included in all HTML files
- [ ] Uses Crayons components (not plain HTML)

### Serverless Apps (If Applicable)
- [ ] `server/server.js` - Backend logic
- [ ] `server/test/` - Test files
- [ ] Test coverage >= 80% for all metrics
- [ ] Coverage report in `coverage/` folder

### Hybrid Apps
- [ ] All frontend files
- [ ] All serverless files
- [ ] `config/requests.json` - Request templates
- [ ] Request templates declared in manifest

### OAuth Apps (If Applicable)
- [ ] `config/oauth_config.json` - OAuth configuration
- [ ] OAuth credentials in `oauth_iparams` (not regular iparams)
- [ ] Request templates include `options.oauth`
- [ ] OAuth config has `integrations` wrapper

## Code Quality

### Validation
- [ ] `fdk validate` passes with no fatal errors
- [ ] No lint errors
- [ ] Warnings addressed (recommended)

### Lint Rules
- [ ] No async functions without await
- [ ] No unused variables or parameters
- [ ] No unreachable code
- [ ] Function complexity <= 7
- [ ] No eval() or alert() calls
- [ ] No var declarations (use const/let)

### Code Structure
- [ ] Helper functions AFTER exports block
- [ ] IIFE pattern for async initialization (frontend)
- [ ] Proper error handling (try-catch)
- [ ] Meaningful variable names
- [ ] Consistent code formatting

### Security
- [ ] No hardcoded API keys or secrets
- [ ] All sensitive data in iparams
- [ ] Input validation implemented
- [ ] Output sanitization implemented
- [ ] HTTPS for all external API calls
- [ ] Proper OAuth implementation (if applicable)

## Test Coverage (Serverless Apps)

### Coverage Metrics
- [ ] Statements >= 80%
- [ ] Branches >= 80%
- [ ] Functions >= 80%
- [ ] Lines >= 80%

### Test Quality
- [ ] All event handlers tested
- [ ] All helper functions tested
- [ ] Success cases tested
- [ ] Error cases tested
- [ ] Edge cases tested
- [ ] Async operations tested

### Coverage Generation
- [ ] Run `fdk run` to generate coverage
- [ ] Coverage summary displayed after Ctrl+C
- [ ] Coverage report in `coverage/` folder
- [ ] HTML report available: `coverage/lcov-report/index.html`

## Manifest Validation

### Structure
- [ ] Valid JSON syntax
- [ ] Single top-level object (no multiple objects)
- [ ] Proper comma placement
- [ ] All required fields present

### Modules
- [ ] `modules.common` declared
- [ ] At least one product module declared
- [ ] All request templates in `modules.common.requests`
- [ ] All SMI functions in `modules.common.functions`
- [ ] Locations in correct module (common vs product-specific)

### Request Templates (If Applicable)
- [ ] Host is FQDN only (no path)
- [ ] Path starts with `/`
- [ ] Uses `<%= variable %>` syntax (not `{{variable}}`)
- [ ] All templates declared in manifest

### Events (If Applicable)
- [ ] `onAppInstall` declared (if using iparams)
- [ ] `onAppUninstall` declared (if using scheduled events)
- [ ] Product events in correct module
- [ ] No scheduled events in manifest (create dynamically)

## UI/UX (Frontend Apps)

### Crayons Components
- [ ] Uses `<fw-button>` not `<button>`
- [ ] Uses `<fw-input>` not `<input>`
- [ ] Uses `<fw-select>` not `<select>`
- [ ] Uses `<fw-textarea>` not `<textarea>`
- [ ] Crayons CDN included in HTML

### Design
- [ ] Consistent with Freshworks UI
- [ ] Responsive design (works on different screen sizes)
- [ ] Proper loading states
- [ ] Error messages user-friendly
- [ ] Success feedback visible

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast sufficient
- [ ] Alt text for images
- [ ] ARIA labels where needed

## Documentation

### README.md
- [ ] Clear app description
- [ ] Features list
- [ ] Setup instructions
- [ ] Configuration guide
- [ ] Usage examples
- [ ] Troubleshooting section
- [ ] Support contact information

### Installation Parameters
- [ ] All iparams have display_name
- [ ] All iparams have type
- [ ] Required fields marked
- [ ] Helpful descriptions
- [ ] Default values (if applicable)

### OAuth Documentation (If Applicable)
- [ ] How to obtain client ID/secret
- [ ] Required scopes/permissions
- [ ] Authorization flow explained
- [ ] Troubleshooting OAuth issues

### API Documentation (If External APIs)
- [ ] Which APIs are called
- [ ] Required permissions
- [ ] Rate limits documented
- [ ] Error handling explained

## Assets

### Screenshots
- [ ] Minimum 3 screenshots
- [ ] Recommended 5 screenshots
- [ ] Format: PNG or JPG
- [ ] Resolution: 1280x720 or higher
- [ ] Show key features
- [ ] Use real data (not Lorem Ipsum)
- [ ] Professional quality

### App Icon
- [ ] Location: `app/styles/images/icon.svg`
- [ ] Format: SVG
- [ ] Size: 64x64 or larger
- [ ] Simple, recognizable design
- [ ] Professional appearance

### Demo Video (Optional)
- [ ] 1-3 minutes duration
- [ ] Shows key features
- [ ] Clear narration or captions
- [ ] Professional quality
- [ ] Hosted on YouTube or Vimeo

## Legal

### Privacy Policy (If Collecting Data)
- [ ] Publicly accessible URL
- [ ] Explains data collection
- [ ] Explains data usage
- [ ] Explains data storage
- [ ] Data retention policy
- [ ] User rights (access, deletion)
- [ ] Contact information

### Terms of Service
- [ ] Publicly accessible URL
- [ ] App usage terms
- [ ] Liability limitations
- [ ] Warranty disclaimers
- [ ] User responsibilities
- [ ] Termination conditions
- [ ] Contact information

### Support
- [ ] Valid support email
- [ ] Email monitored regularly
- [ ] Response within 48 hours
- [ ] Professional support quality

## Pricing (Paid Apps)

### Pricing Structure
- [ ] Clear pricing tiers
- [ ] Monthly or annual options
- [ ] Free trial offered (recommended)
- [ ] Transparent pricing page

### Revenue
- [ ] Revenue share understood (80% dev, 20% Freshworks)
- [ ] Payment method configured
- [ ] Tax information provided

## Testing

### Functional Testing
- [ ] Tested in all target products
- [ ] All features work as expected
- [ ] No critical bugs
- [ ] Error scenarios handled
- [ ] Edge cases tested

### OAuth Testing (If Applicable)
- [ ] Authorization flow works
- [ ] Token refresh works
- [ ] Error handling works
- [ ] Tested with real credentials

### Performance Testing
- [ ] Page load < 3 seconds
- [ ] API calls < 5 seconds
- [ ] User interactions < 1 second
- [ ] No memory leaks
- [ ] Efficient resource usage

## Package Creation

### Pack Command
- [ ] Run `fdk pack` successfully
- [ ] Package created in `dist/` folder
- [ ] Package name: `<app-name>-<version>.zip`
- [ ] Package size reasonable (< 50 MB)

### Package Verification
- [ ] Package integrity: `unzip -t dist/*.zip`
- [ ] Package contents: `unzip -l dist/*.zip`
- [ ] Required files included
- [ ] No unnecessary files (node_modules, coverage, etc.)

## Submission

### Developer Portal
- [ ] Access Developer Portal successfully
- [ ] Choose correct app type
- [ ] Upload package successfully

### App Details
- [ ] App name (clear, descriptive, < 50 chars)
- [ ] Description (100-500 words, use Freddy AI)
- [ ] Categories (primary + subcategories)
- [ ] Tags/keywords (5-10 relevant tags)

### Assets Upload
- [ ] Screenshots uploaded (min 3)
- [ ] Icon displays correctly
- [ ] Demo video (optional)

### Legal Information
- [ ] Support email entered
- [ ] Privacy policy URL (if collecting data)
- [ ] Terms of service URL

### Pricing (Freshworks Apps)
- [ ] Free or paid selected
- [ ] Pricing tiers configured (if paid)
- [ ] Free trial period set (optional)

### Final Submission
- [ ] All information reviewed
- [ ] Submit for review clicked
- [ ] Confirmation email received

## Post-Submission

### Monitoring
- [ ] Monitor email for review updates
- [ ] Check Developer Portal for status changes
- [ ] Respond to feedback within 7 days

### After Approval
- [ ] Test published app
- [ ] Monitor user feedback
- [ ] Provide support
- [ ] Plan updates and improvements

## Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Validation fails | `fdk validate --fix` or `/fix` |
| Coverage < 80% | `fdk run`, add tests, re-run |
| Icon missing | Create `app/styles/images/icon.svg` |
| Package not created | Fix validation errors first |
| Upload fails | Check network, clear cache, retry |
| FDK not found | `/fdk-setup install` |
| Node.js mismatch | Update manifest or switch version |

## Minimum Requirements

**Technical:**
- Platform 3.0
- Node.js >= 18.0.0
- FDK >= 9.6.0
- Validation passes
- Coverage >= 80% (serverless)

**Documentation:**
- README.md
- Screenshots (min 3)
- Support email

**Quality:**
- No fatal errors
- No lint errors
- No critical bugs

## Timeline Estimates

| Task | Time |
|------|------|
| Validate | 1-2 min |
| Fix errors | 10-30 min |
| Generate coverage | 2-5 min |
| Pack | 1-2 min |
| Upload | 5 min |
| Fill details | 30 min |
| Review (Freshworks) | 5-10 days |
| Review (Custom) | Immediate |

## Resources

**Essential Links:**
- Developer Portal: https://developers.freshworks.com/
- CLI Reference: https://freshworks.dev/docs/app-sdk/v3.0/cpq_document/basic-dev-tools/freshworks-cli/
- Validation: https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- Submission: https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/

**Support:**
- Community: https://community.freshworks.dev/
- Email: developer-support@freshworks.com
- Search: `fdk search "your question"`

## Slash Commands

```bash
/publish          # Full workflow
/publish pack     # Validate and pack
/publish submit   # Submission guidance
/fix              # Fix validation errors
/fdk-setup        # Install/upgrade FDK
```
