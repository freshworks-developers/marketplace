# Security & Automation Setup

This repository has automated security and validation checks enabled.

## 1. Commit Signing (SSH)

### Setup SSH Commit Signing

SSH commit signing is modern, secure, and doesn't require GPG keys.

**Step 1: Generate SSH key (if you don't have one)**
```bash
ssh-keygen -t ed25519 -C "debjani.chatterjee@freshworks.com"
```

**Step 2: Add SSH key to GitHub**
1. Copy your public key: `cat ~/.ssh/id_ed25519.pub`
2. Go to GitHub → Settings → SSH and GPG keys → New SSH key
3. Set "Key type" to **Signing Key**
4. Paste your public key

**Step 3: Configure Git to sign commits**
```bash
# Tell Git to use SSH for signing
git config --global gpg.format ssh

# Set your signing key (use your public key path)
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Sign all commits by default
git config --global commit.gpgsign true

# Sign all tags by default
git config --global tag.gpgsign true
```

**Step 4: Verify it works**
```bash
# Make a test commit
git commit --allow-empty -m "Test signed commit"

# Check the signature
git log --show-signature -1
```

You should see "Good signature" in the output, and commits will show "Verified" on GitHub.

### Alternative: GPG Signing

If you prefer GPG:

```bash
# Generate GPG key
gpg --full-generate-key

# List keys
gpg --list-secret-keys --keyid-format=long

# Configure Git
git config --global user.signingkey YOUR_KEY_ID
git config --global commit.gpgsign true

# Export public key for GitHub
gpg --armor --export YOUR_KEY_ID
```

Add the exported key to GitHub → Settings → SSH and GPG keys → New GPG key.

## 2. GitHub Actions Workflows

Three automated workflows run on every push and PR:

### Security Scan (`security-scan.yml`)
- **TruffleHog**: Scans for leaked secrets and credentials
- **Trivy**: Checks for dependency vulnerabilities (CRITICAL and HIGH severity)
- **CodeQL**: Static analysis for JavaScript code

### Validation (`validation.yml`)
- Validates skill structure (SKILL.md, README.md)
- Validates all JSON files
- Checks for large files (>1MB)
- Scans for secret patterns
- Checks for trailing whitespace

### Lint (`lint.yml`)
- **Markdown**: Lints all `.md` files
- **YAML**: Validates GitHub Actions workflow files
- **ShellCheck**: Validates shell scripts

**All workflows run automatically on:**
- Push to `main`, `feature/**`, `skill/**` branches
- Pull requests to `main`

## 3. Pre-commit Hook

Local git hook that runs before every commit:

**Checks performed:**
- ✅ File size validation (blocks files >1MB)
- ✅ Secret detection (API keys, private keys, passwords)
- ✅ JSON validation
- ⚠️  TODO/FIXME warnings (non-blocking)
- ⚠️  console.log warnings (non-blocking)

**Location:** `.git/hooks/pre-commit`

**To bypass (not recommended):**
```bash
git commit --no-verify
```

## 4. Pre-push Hook

Existing hook that prevents pushing to unauthorized remotes:

**Blocks pushes to repos outside:**
- fresh*, fw*, ayanr*, airwoot*, digital-cx*, lighthouse-fws*, RPA-Testing*, sarastech*

**Logs violations to:**
- `~/.git-push-logs/violations.log`
- Webhook: `https://ghc.freshpo.com/ghctest`

## Security Best Practices

### For Commits
1. ✅ Sign all commits with SSH or GPG
2. ✅ Never commit secrets, API keys, or credentials
3. ✅ Keep files small (<1MB)
4. ✅ Validate JSON before committing
5. ✅ Remove debug statements (console.log)

### For Pull Requests
1. ✅ Ensure all CI checks pass
2. ✅ Fix security vulnerabilities before merging
3. ✅ Review CodeQL findings
4. ✅ Update documentation if needed

### For Secrets Management
1. ✅ Use environment variables
2. ✅ Use GitHub Secrets for CI/CD
3. ✅ Use `.env` files (add to `.gitignore`)
4. ✅ Document required secrets in README

## Monitoring

### View Security Alerts
- GitHub → Security → Code scanning alerts
- GitHub → Security → Dependabot alerts

### View Workflow Runs
- GitHub → Actions tab
- Check status badges in README

### View Local Logs
```bash
# Pre-push violations
cat ~/.git-push-logs/violations.log

# Pre-push webhook logs
ls ~/.git-push-logs/webhook_debug_*.log
```

## Troubleshooting

### Commit signing not working
```bash
# Check configuration
git config --list | grep -E "(gpg|sign)"

# Verify SSH key
ssh-add -l

# Test signature
git commit --allow-empty -m "Test" && git log --show-signature -1
```

### Pre-commit hook not running
```bash
# Check hook exists and is executable
ls -la .git/hooks/pre-commit

# Make executable
chmod +x .git/hooks/pre-commit
```

### CI workflow failing
1. Check workflow logs in GitHub Actions
2. Run checks locally:
   ```bash
   # Validate JSON
   find . -name "*.json" | xargs -I {} node -e "JSON.parse(require('fs').readFileSync('{}'))"
   
   # Check for large files
   find . -type f -size +1M
   
   # Run pre-commit hook manually
   .git/hooks/pre-commit
   ```

## Disable Checks (Not Recommended)

### Disable pre-commit hook
```bash
rm .git/hooks/pre-commit
```

### Disable pre-push hook
```bash
rm .git/hooks/pre-push
```

### Disable commit signing
```bash
git config --global commit.gpgsign false
```

### Skip CI on push
Add `[skip ci]` to commit message:
```bash
git commit -m "Update docs [skip ci]"
```
