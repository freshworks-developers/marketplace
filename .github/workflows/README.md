# GitHub Actions Workflows

This directory contains automated CI/CD workflows for security, validation, and linting.

## Workflows

### 🔒 Security Scan (`security-scan.yml`)
Runs on every push and PR to detect security issues:
- **TruffleHog**: Secret detection in commits
- **Trivy**: Dependency vulnerability scanning
- **CodeQL**: Static code analysis for JavaScript

### ✅ Validation (`validation.yml`)
Validates repository structure and content:
- Skill manifest validation
- JSON syntax validation
- File size checks (blocks >1MB)
- Secret pattern detection
- Trailing whitespace detection

### 📝 Lint (`lint.yml`)
Code quality and formatting checks:
- Markdown linting
- YAML validation
- Shell script validation (ShellCheck)

## Status

All workflows run automatically on:
- Push to `main`, `feature/**`, `skill/**` branches
- Pull requests targeting `main`

## View Results

Check workflow status:
- GitHub Actions tab
- PR checks section
- Security tab for vulnerability reports
