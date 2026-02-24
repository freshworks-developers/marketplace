# Freshworks Marketplace Requirements

Complete requirements checklist for publishing apps to the Freshworks Marketplace.

## Technical Requirements

### Platform Version
- ✅ **Platform 3.0** - Must use latest platform version
- ❌ Platform 2.x apps will be rejected
- ✅ Manifest must specify: `"platform-version": "3.0"`

### FDK Version
- ✅ **FDK >= 9.6.0** - Minimum version required
- ✅ Manifest must specify: `"engines": { "fdk": "9.6.0" }`
- ✅ Keep FDK updated for latest features and fixes

### Node.js Version
- ✅ **Node.js >= 18.0.0** - Minimum version required
- ✅ Manifest must specify: `"engines": { "node": "18.20.8" }`
- ✅ Match your development environment version

### Validation
- ✅ **`fdk validate` must pass** - No fatal errors allowed
- ✅ Fix all lint errors before submission
- ✅ Address warnings (recommended)
- ❌ Apps with validation errors will be rejected

### Test Coverage (Serverless Apps)
- ✅ **Statements >= 80%**
- ✅ **Branches >= 80%**
- ✅ **Functions >= 80%**
- ✅ **Lines >= 80%**
- ❌ Apps below 80% will be rejected

### Package Size
- ✅ **Recommended: < 50 MB**
- ⚠️ Larger packages may face longer review times
- ⚠️ Very large packages (> 100 MB) may be rejected

## File Requirements

### Mandatory Files (All Apps)
- ✅ `manifest.json` - App manifest (Platform 3.0 structure)
- ✅ `config/iparams.json` - Installation parameters (even if empty `{}`)
- ✅ `README.md` - App documentation

### Frontend Apps (Additional)
- ✅ `app/index.html` - Main HTML file
- ✅ `app/scripts/app.js` - JavaScript logic
- ✅ `app/styles/style.css` - Styling
- ✅ `app/styles/images/icon.svg` - **REQUIRED** - App icon

### Serverless Apps (Additional)
- ✅ `server/server.js` - Backend logic
- ✅ `server/test/` - Test files (for coverage)

### Hybrid Apps
- ✅ All frontend files
- ✅ All serverless files
- ✅ `config/requests.json` - Request templates

### OAuth Apps (Additional)
- ✅ `config/oauth_config.json` - OAuth configuration
- ✅ `config/requests.json` - API request templates

## Manifest Requirements

### Structure
```json
{
  "platform-version": "3.0",
  "product": {
    "freshdesk": {
      "versions": ["1.0.0"]
    }
  },
  "modules": {
    "common": {
      "requests": {},
      "functions": {}
    },
    "support_ticket": {}
  },
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```

### Required Fields
- ✅ `platform-version` - Must be "3.0"
- ✅ `product` - Target Freshworks product(s)
- ✅ `modules` - Module structure (not "product" key)
- ✅ `engines` - Node.js and FDK versions

### Module Declaration
- ✅ All request templates in `modules.common.requests`
- ✅ All SMI functions in `modules.common.functions`
- ✅ At least one product module (even if empty `{}`)
- ✅ Locations in correct module (common vs product-specific)

### Forbidden Patterns
- ❌ `"platform-version": "2.3"` or earlier
- ❌ `"product": { "freshdesk": {} }` without modules
- ❌ `"whitelisted-domains"` (deprecated)
- ❌ Scheduled events declared in manifest

## Code Quality Requirements

### Lint Rules (Must Pass)
- ✅ No async functions without await
- ✅ No unused variables or parameters
- ✅ No unreachable code
- ✅ Function complexity <= 7
- ✅ No eval() or alert() calls
- ✅ No var declarations (use const/let)
- ✅ Proper error handling
- ✅ No hardcoded credentials

### Code Structure
- ✅ Helper functions AFTER exports block
- ✅ IIFE pattern for async initialization (frontend)
- ✅ Proper async/await usage
- ✅ No callback hell (use promises/async-await)

### Security
- ✅ No hardcoded API keys or secrets
- ✅ Use iparams for configuration
- ✅ Validate all inputs
- ✅ Sanitize user data
- ✅ Use HTTPS for external APIs
- ✅ Proper OAuth implementation

## UI/UX Requirements

### Crayons Components
- ✅ Use Crayons components (not plain HTML)
- ✅ `<fw-button>` not `<button>`
- ✅ `<fw-input>` not `<input>`
- ✅ `<fw-select>` not `<select>`
- ✅ Include Crayons CDN in all HTML files

### Design Guidelines
- ✅ Consistent with Freshworks UI
- ✅ Responsive design
- ✅ Accessible (WCAG 2.1 Level AA)
- ✅ Proper loading states
- ✅ Error messages user-friendly
- ✅ Success feedback visible

### User Experience
- ✅ Intuitive navigation
- ✅ Clear call-to-actions
- ✅ Helpful tooltips/hints
- ✅ Proper form validation
- ✅ Confirmation for destructive actions

## Documentation Requirements

### README.md
- ✅ Clear app description
- ✅ Features list
- ✅ Setup instructions
- ✅ Configuration guide
- ✅ Usage examples
- ✅ Troubleshooting section
- ✅ Support contact information

### Installation Parameters
- ✅ All iparams documented
- ✅ Clear display names
- ✅ Helpful descriptions
- ✅ Required vs optional marked
- ✅ Default values (if applicable)

### OAuth Setup (If Applicable)
- ✅ How to obtain client ID/secret
- ✅ Required scopes/permissions
- ✅ Authorization flow explanation
- ✅ Troubleshooting OAuth issues

### API Documentation (If External APIs)
- ✅ Which APIs are called
- ✅ Required permissions/scopes
- ✅ Rate limits (if any)
- ✅ Error handling

## Asset Requirements

### Screenshots
- ✅ **Minimum:** 3 screenshots
- ✅ **Recommended:** 5 screenshots
- ✅ **Format:** PNG or JPG
- ✅ **Resolution:** 1280x720 or higher
- ✅ **Content:** Show key features and UI
- ✅ **Quality:** Clear, professional, no blur

**Screenshot guidelines:**
- Show app in action (not just settings)
- Highlight unique features
- Use real data (not Lorem Ipsum)
- Include before/after scenarios
- Show different views/pages

### App Icon
- ✅ **Location:** `app/styles/images/icon.svg`
- ✅ **Format:** SVG (required)
- ✅ **Size:** 64x64 or larger
- ✅ **Design:** Simple, recognizable, professional
- ✅ **Colors:** Consistent with brand

### Demo Video (Optional)
- ✅ 1-3 minutes
- ✅ Shows key features
- ✅ Clear narration or captions
- ✅ Professional quality
- ✅ Hosted on YouTube or Vimeo

## Legal Requirements

### Privacy Policy (If Collecting Data)
- ✅ **Required if:** App collects, stores, or processes user data
- ✅ **Must include:**
  - What data is collected
  - How data is used
  - How data is stored
  - Data retention policy
  - User rights (access, deletion)
  - Contact information
- ✅ **Must be:** Publicly accessible URL

### Terms of Service
- ✅ **Recommended for:** All apps
- ✅ **Required for:** Paid apps
- ✅ **Must include:**
  - App usage terms
  - Liability limitations
  - Warranty disclaimers
  - User responsibilities
  - Termination conditions
  - Contact information
- ✅ **Must be:** Publicly accessible URL

### Support Email
- ✅ **Required:** Valid email address
- ✅ **Must be:** Monitored regularly
- ✅ **Purpose:** Customer support inquiries
- ✅ **Response time:** Within 48 hours recommended

## Pricing Requirements (Paid Apps)

### Pricing Structure
- ✅ Clear pricing tiers
- ✅ Monthly or annual billing
- ✅ Free trial period (optional but recommended)
- ✅ Transparent pricing page

### Revenue Share
- ✅ 80% to developer
- ✅ 20% to Freshworks
- ✅ Paid via Freshworks platform
- ✅ Monthly payouts

### Pricing Guidelines
- ✅ Competitive with similar apps
- ✅ Value-based pricing
- ✅ Clear feature differentiation between tiers
- ✅ No hidden fees

## Review Process Requirements

### Code Review
- ✅ Platform 3.0 compliance
- ✅ Security best practices
- ✅ Proper error handling
- ✅ No vulnerabilities
- ✅ Code quality standards

### Functional Review
- ✅ App works as described
- ✅ All features functional
- ✅ No critical bugs
- ✅ Proper error messages
- ✅ Good performance

### Documentation Review
- ✅ Clear and complete
- ✅ Accurate information
- ✅ Setup instructions work
- ✅ Troubleshooting helpful

### UI/UX Review
- ✅ Uses Crayons components
- ✅ Responsive design
- ✅ Accessible
- ✅ Consistent with Freshworks UI
- ✅ Good user experience

## Rejection Reasons

### Common Reasons for Rejection

1. **Platform 2.x patterns** - Must use Platform 3.0
2. **Coverage < 80%** - Must meet minimum threshold
3. **Security issues** - Vulnerabilities, hardcoded secrets
4. **Validation errors** - Must pass `fdk validate`
5. **Poor documentation** - Insufficient setup instructions
6. **UI issues** - Not using Crayons, poor UX
7. **Broken functionality** - Critical bugs or errors
8. **Missing icon** - Frontend apps must have icon.svg
9. **Legal issues** - Missing privacy policy, terms of service
10. **Performance issues** - Slow, unresponsive, high resource usage

### How to Avoid Rejection

**Before submission:**
1. Run `fdk validate` - Fix all errors
2. Run `fdk run` - Generate coverage >= 80%
3. Test thoroughly - All features, all scenarios
4. Review documentation - Clear, complete, accurate
5. Check UI/UX - Crayons components, responsive, accessible
6. Verify security - No secrets, proper validation, secure APIs
7. Test performance - Fast, responsive, efficient

**After feedback:**
1. Read feedback carefully
2. Fix all issues mentioned
3. Test fixes thoroughly
4. Update documentation if needed
5. Resubmit promptly (within 7 days)

## Update Requirements

**For updating published apps:**

### Version Increment
- ✅ **Major:** Breaking changes (1.0.0 → 2.0.0)
- ✅ **Minor:** New features (1.0.0 → 1.1.0)
- ✅ **Patch:** Bug fixes (1.0.0 → 1.0.1)

### Update Process
1. Update version in manifest.json
2. Make code changes
3. Update README/documentation
4. Run `fdk validate`
5. Run `fdk pack`
6. Submit update via Developer Portal

### Update Review
- **Freshworks Apps:** Subject to review (faster than initial)
- **Custom Apps:** Immediate publish (no review)
- **External Apps:** Subject to review

## Compliance Requirements

### Data Privacy
- ✅ GDPR compliance (if applicable)
- ✅ CCPA compliance (if applicable)
- ✅ Data encryption (in transit and at rest)
- ✅ User consent for data collection
- ✅ Data deletion on request

### Security
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities
- ✅ No CSRF vulnerabilities
- ✅ Secure API communication (HTTPS)
- ✅ Proper authentication/authorization

### Accessibility
- ✅ WCAG 2.1 Level AA compliance
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Color contrast ratios
- ✅ Alt text for images

## Performance Requirements

### Response Time
- ✅ Page load: < 3 seconds
- ✅ API calls: < 5 seconds
- ✅ User interactions: < 1 second

### Resource Usage
- ✅ Memory: Reasonable usage
- ✅ CPU: No excessive processing
- ✅ Network: Efficient API calls
- ✅ Storage: Minimal local storage

### Optimization
- ✅ Minified assets (CSS, JS)
- ✅ Compressed images
- ✅ Lazy loading (if applicable)
- ✅ Caching strategies
- ✅ Efficient algorithms

## Marketplace Listing Requirements

### App Name
- ✅ Clear and descriptive
- ✅ No version numbers
- ✅ Max 50 characters
- ✅ Unique in marketplace
- ✅ Professional naming

### Description
- ✅ 100-500 words
- ✅ Clear value proposition
- ✅ Key features highlighted
- ✅ Supported products mentioned
- ✅ Use Freddy AI for optimization

### Categories
- ✅ Primary category (required)
- ✅ Subcategories (recommended)
- ✅ Accurate classification
- ✅ Improves discoverability

### Tags/Keywords
- ✅ Relevant keywords
- ✅ Improve searchability
- ✅ 5-10 tags recommended

## Support Requirements

### Support Channels
- ✅ Support email (required)
- ✅ Documentation/Help center (recommended)
- ✅ Community forum (optional)
- ✅ Live chat (optional)

### Response Time
- ✅ Initial response: Within 48 hours
- ✅ Resolution: Based on severity
- ✅ Critical issues: Within 24 hours

### Support Quality
- ✅ Professional communication
- ✅ Helpful and detailed responses
- ✅ Follow-up until resolved
- ✅ Knowledge base articles

## Maintenance Requirements

### Updates
- ✅ Regular bug fixes
- ✅ Security patches
- ✅ Feature enhancements
- ✅ Platform compatibility updates

### Monitoring
- ✅ Monitor app performance
- ✅ Track error rates
- ✅ Monitor user feedback
- ✅ Address issues promptly

### Communication
- ✅ Notify users of major updates
- ✅ Changelog for each version
- ✅ Deprecation notices (if applicable)
- ✅ Migration guides (for breaking changes)

## Marketplace Policies

### Content Policy
- ✅ No offensive content
- ✅ No misleading information
- ✅ No spam or malware
- ✅ No copyright infringement
- ✅ No trademark violations

### Behavior Policy
- ✅ No manipulation of reviews
- ✅ No fake ratings
- ✅ No misleading marketing
- ✅ Honest feature claims
- ✅ Transparent pricing

### Data Policy
- ✅ No unauthorized data collection
- ✅ No data selling to third parties
- ✅ Secure data storage
- ✅ User consent for data usage
- ✅ Data deletion on request

## Quality Standards

### Code Quality
- ✅ Clean, readable code
- ✅ Proper comments (where needed)
- ✅ Consistent formatting
- ✅ No code smells
- ✅ Maintainable architecture

### Error Handling
- ✅ Try-catch blocks for async operations
- ✅ Meaningful error messages
- ✅ Proper logging
- ✅ Graceful degradation
- ✅ User-friendly error display

### Testing
- ✅ Unit tests for all handlers
- ✅ Integration tests (recommended)
- ✅ Edge case testing
- ✅ Error scenario testing
- ✅ Performance testing

## Checklist Summary

### Pre-Pack Checklist
- [ ] Platform 3.0 structure
- [ ] All validation errors fixed
- [ ] Test coverage >= 80%
- [ ] All required files present
- [ ] Icon.svg created (frontend)
- [ ] README documentation complete
- [ ] Code quality standards met

### Pre-Submission Checklist
- [ ] Package created successfully
- [ ] Package size reasonable
- [ ] Screenshots prepared (min 3)
- [ ] App description written
- [ ] Categories selected
- [ ] Support email configured
- [ ] Privacy policy ready (if needed)
- [ ] Terms of service ready
- [ ] Pricing configured (if paid)

### Post-Submission Checklist
- [ ] Confirmation email received
- [ ] Monitor email for updates
- [ ] Respond to feedback within 7 days
- [ ] Update app if changes requested
- [ ] Test published app
- [ ] Monitor user feedback
- [ ] Provide support

## Resources

- **Submission Guidelines:** https://developers.freshworks.com/docs/guides/submission-guidelines/
- **App Validation:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- **Submission Process:** https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
- **Terms of Use:** https://developers.freshworks.com/terms-of-use
- **Developer Community:** https://community.freshworks.dev/
- **Support:** developer-support@freshworks.com
