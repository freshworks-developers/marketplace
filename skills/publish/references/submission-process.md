# Freshworks Marketplace Submission Process

Complete guide to submitting apps to the Freshworks Marketplace.

## App Types

### 1. Freshworks App (Public Marketplace)

**Characteristics:**
- Public listing in Freshworks Marketplace
- Available to all Freshworks customers
- Subject to review (5-10 business days)
- Can be free or paid
- Revenue share: 20% to Freshworks (for paid apps)

**Review Process:**
- Code review for quality and security
- Functional testing
- UI/UX review
- Documentation review
- Compliance checks

**Best for:**
- Apps solving common use cases
- Revenue-generating apps
- Apps with broad appeal
- Public distribution

**Requirements:**
- Passes all validation checks
- Test coverage >= 80%
- Comprehensive documentation
- Screenshots (min 3, recommended 5)
- Support email
- Privacy policy (if collecting user data)
- Terms of service

### 2. Custom App (Private)

**Characteristics:**
- Private to specific customer
- Not listed in public marketplace
- No review required
- Published immediately upon submission
- Can test multiple versions in production
- No revenue generation

**Best for:**
- Customer-specific requirements
- Internal tools
- Rapid deployment needs
- Proprietary solutions

**Requirements:**
- Basic validation (less strict than Freshworks apps)
- Functional app
- Customer agreement

### 3. External App (Third-Party Integration)

**Characteristics:**
- Listed in Freshworks Marketplace
- Installed from external URL (not Freshworks-hosted)
- Subject to review
- Uses module-specific methods
- Integrates with third-party products

**Best for:**
- Third-party integrations
- Apps hosted on your infrastructure
- Cross-platform solutions
- External service integrations

**Requirements:**
- Valid external installation URL
- Integration documentation
- Support resources

## Submission Workflow

### Step 1: Access Developer Portal

**Option A: Via Apps Gallery**
1. Log in to your Freshworks product account
2. Navigate to the apps gallery
3. In "Build your own apps" section, click "Build it yourself"
4. All Apps page is displayed

**Option B: Via Neo Admin Center**
1. Log in to your Freshworks product account
2. Navigate to Neo Admin Center
3. In "My Accounts" section, click on developer account (/developer)
4. All Apps page is displayed

**Note:** Developer account (/developer) appears only if you've accessed the Developer portal at least once.

### Step 2: Create New App Submission

1. Click "Create New App" or "Submit New App"
2. Select app type:
   - Freshworks App
   - Custom App
   - External App

### Step 3: Upload Package

1. Click "Upload App file"
2. Select `dist/<app-name>-<version>.zip`
3. Wait for upload to complete
4. FDK extracts metadata from manifest.json

### Step 4: Fill App Details

**Required Information:**

1. **App Name**
   - Clear, descriptive name
   - No version numbers in name
   - Max 50 characters

2. **Description**
   - Use Freddy AI assistance for optimization
   - Explain what the app does
   - Highlight key features
   - Mention supported products
   - 100-500 words recommended

3. **Categories** (New Framework)
   - Primary category (required)
   - Subcategories (recommended)
   - Improves discoverability
   - Examples: Productivity, Automation, Integration, Analytics

4. **Screenshots**
   - Minimum: 3
   - Recommended: 5
   - Format: PNG or JPG
   - Resolution: 1280x720 or higher
   - Show key features and UI

5. **Support Email**
   - Valid email address
   - Monitored regularly
   - For customer support inquiries

6. **Privacy Policy URL** (if collecting user data)
   - Required if app collects/stores user data
   - Must be publicly accessible
   - Should explain data handling

7. **Terms of Service URL**
   - App usage terms
   - Liability and warranty information
   - User responsibilities

### Step 5: Configure Pricing (Freshworks Apps Only)

**Free App:**
- No charges to users
- Can still generate leads

**Paid App:**
- Set pricing tiers
- Monthly or annual billing
- Revenue share: 80% to you, 20% to Freshworks
- Payment via Freshworks

**Pricing Tiers:**
- Starter: $X/month
- Professional: $Y/month
- Enterprise: $Z/month

### Step 6: Submit for Review

**Freshworks App / External App:**
1. Review all information
2. Click "Submit for Review"
3. Confirmation email sent
4. Review timeline: 5-10 business days

**Custom App:**
1. Review all information
2. Click "Publish"
3. App available immediately
4. No review required

## Post-Submission

### Freshworks App / External App

**Review Process:**
1. **Automated checks** - Code quality, security, performance
2. **Manual review** - Functionality, UI/UX, documentation
3. **Testing** - Install and test in real environment
4. **Feedback** - Email with approval or change requests

**Timeline:**
- Initial review: 3-5 business days
- Full review: 5-10 business days
- Respond to feedback: Within 7 days
- Re-review: 2-3 business days

**Possible Outcomes:**
- ✅ **Approved** - App published to marketplace
- ⚠️ **Changes Requested** - Fix issues and resubmit
- ❌ **Rejected** - Major issues, requires significant changes

### Custom App

**Immediate Publish:**
- App available immediately after submission
- No review process
- Can update anytime
- Test multiple versions in production

### Monitoring

**After submission:**
- Check email regularly for updates
- Monitor Developer Portal for status changes
- Respond to review feedback promptly
- Update app if changes requested

## Review Guidelines

### Code Review

**Checks:**
- Platform 3.0 compliance
- No Platform 2.x patterns
- Proper error handling
- Security best practices
- No hardcoded credentials
- Proper use of APIs

**Common rejection reasons:**
- Platform 2.x patterns
- Security vulnerabilities
- Poor error handling
- Hardcoded secrets
- Coverage < 80%

### Functional Review

**Checks:**
- App works as described
- All features functional
- No critical bugs
- Proper error messages
- Good user experience

### Documentation Review

**Checks:**
- Clear README
- Setup instructions
- Configuration guide
- Screenshots accurate
- Support information

### UI/UX Review

**Checks:**
- Uses Crayons components
- Responsive design
- Accessible (WCAG compliance)
- Consistent with Freshworks UI
- Good user experience

## Updating Published Apps

**To update an existing app:**

1. **Increment version** in manifest.json
2. **Make changes** to app code
3. **Validate and test** thoroughly
4. **Pack new version:** `fdk pack`
5. **Submit update** via Developer Portal
6. **Review process** (for Freshworks/External apps)

**Version numbering:**
- Major: Breaking changes (1.0.0 → 2.0.0)
- Minor: New features (1.0.0 → 1.1.0)
- Patch: Bug fixes (1.0.0 → 1.0.1)

## Marketplace Requirements

### Technical Requirements
- ✅ Platform 3.0
- ✅ FDK >= 9.6.0
- ✅ Node.js >= 18.0.0
- ✅ Validation passes
- ✅ Coverage >= 80% (serverless)
- ✅ Package < 50 MB (recommended)

### Documentation Requirements
- ✅ README.md with setup instructions
- ✅ All iparams documented
- ✅ OAuth setup guide (if applicable)
- ✅ Screenshots (min 3)
- ✅ Support email
- ✅ Privacy policy (if collecting data)
- ✅ Terms of service

### Quality Requirements
- ✅ No critical bugs
- ✅ Good error handling
- ✅ Proper logging
- ✅ Security best practices
- ✅ Performance optimized
- ✅ Accessible UI

## Freddy AI Assistance

**New feature in submission process:**

Freddy AI helps with:
- App description optimization
- Category suggestions
- Keyword recommendations
- SEO improvements
- Discoverability enhancements

**How to use:**
1. Enter initial app description
2. Click "Optimize with Freddy AI"
3. Review suggestions
4. Accept or modify
5. Save optimized description

## New Categorization Framework

**Improved app discoverability with:**

**Primary Categories:**
- Productivity
- Automation
- Integration
- Analytics
- Communication
- Customer Support
- Sales & CRM
- IT Service Management
- Security & Compliance
- Utilities

**Subcategories:**
- More specific classification
- Better search results
- Improved recommendations
- Enhanced user experience

**Migration:**
- Existing apps: Update categories by December 2024
- After December 2024: Automatic migration
- Use Freddy AI for category suggestions

## Revenue & Pricing

**For Paid Freshworks Apps:**

**Revenue Share:**
- 80% to developer
- 20% to Freshworks

**Pricing Models:**
- Monthly subscription
- Annual subscription
- Tiered pricing (Starter, Pro, Enterprise)
- Free trial period (optional)

**Payment:**
- Handled by Freshworks
- Monthly payouts to developers
- Detailed revenue reports
- Tax compliance support

**Free Apps:**
- No charges to users
- Can generate leads
- Build brand awareness
- Upsell opportunities

## Support & Maintenance

**After publication:**

**Developer Responsibilities:**
- Monitor support email
- Respond to customer inquiries
- Fix bugs and issues
- Provide updates
- Maintain documentation

**Freshworks Support:**
- Marketplace infrastructure
- Payment processing
- Customer discovery
- Marketing support
- Developer resources

## Best Practices

### Before Submission
1. Test thoroughly in all target products
2. Test with real data and scenarios
3. Test OAuth flows end-to-end
4. Test error scenarios
5. Get feedback from beta users

### Documentation
1. Write clear, concise README
2. Include setup instructions
3. Document all configuration options
4. Provide troubleshooting guide
5. Include contact information

### Screenshots
1. Show key features
2. Use real data (not Lorem Ipsum)
3. Highlight unique value
4. Show before/after scenarios
5. Include mobile views (if applicable)

### Pricing (Paid Apps)
1. Research competitor pricing
2. Offer free trial
3. Provide tiered options
4. Clear value proposition
5. Transparent pricing page

## Resources

- **Developer Portal:** https://developers.freshworks.com/
- **Submission Guidelines:** https://developers.freshworks.com/docs/guides/submission-guidelines/
- **App Validation:** https://developers.freshworks.com/docs/guides/submission-guidelines/app-validation/
- **Submission Process:** https://developers.freshworks.com/docs/app-sdk/v3.0/support_email/app-submission-process/
- **Terms of Use:** https://developers.freshworks.com/terms-of-use
- **Developer Community:** https://community.freshworks.dev/

## Timeline

**Typical submission timeline:**

| Stage | Duration |
|-------|----------|
| Pack app | 5 minutes |
| Upload to portal | 5 minutes |
| Fill in details | 30 minutes |
| Initial review | 3-5 business days |
| Full review | 5-10 business days |
| Feedback response | Developer: 7 days |
| Re-review | 2-3 business days |
| Publication | Immediate after approval |

**Custom apps:** Immediate (no review)

## Checklist Template

```markdown
## Pre-Submission Checklist

### Validation
- [ ] `fdk validate` passes
- [ ] No fatal errors
- [ ] No lint errors
- [ ] Platform version 3.0

### Coverage (Serverless)
- [ ] Statements >= 80%
- [ ] Branches >= 80%
- [ ] Functions >= 80%
- [ ] Lines >= 80%

### Files
- [ ] manifest.json (Platform 3.0)
- [ ] config/iparams.json
- [ ] app/styles/images/icon.svg (frontend)
- [ ] README.md
- [ ] package.json (if dependencies)

### Configuration
- [ ] All iparams documented
- [ ] OAuth tested (if applicable)
- [ ] Request templates validated
- [ ] External APIs tested

### Documentation
- [ ] README with setup instructions
- [ ] Configuration guide
- [ ] Troubleshooting section
- [ ] Support contact info

### Assets
- [ ] Screenshots (min 3)
- [ ] App icon (icon.svg)
- [ ] Demo video (optional)
- [ ] Marketing materials

### Legal
- [ ] Privacy policy URL (if needed)
- [ ] Terms of service URL
- [ ] Support email
- [ ] Pricing details (if paid)

### Testing
- [ ] Tested in all target products
- [ ] Tested with real data
- [ ] OAuth flows tested
- [ ] Error scenarios tested
- [ ] Performance tested

### Submission
- [ ] App type selected
- [ ] Package uploaded
- [ ] Details filled
- [ ] Categories selected
- [ ] Pricing configured (if paid)
- [ ] Submitted for review
```
