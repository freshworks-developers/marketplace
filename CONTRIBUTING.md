# Contributing to Freshworks Marketplace Skills

Thank you for your interest in contributing to the Freshworks Marketplace Skills repository! This project provides AI coding assistant skills for building Freshworks Platform 3.0 marketplace applications.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Repository Structure](#repository-structure)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Changes](#submitting-changes)
- [Development Guidelines](#development-guidelines)
  - [Skill Structure](#skill-structure)
  - [Rule Files (.mdc)](#rule-files-mdc)
  - [Commands](#commands)
  - [References](#references)
- [Testing Your Changes](#testing-your-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.MD). By participating, you are expected to uphold this code. Please report unacceptable behavior to devrels@freshworks.com.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/marketplace.git
   cd marketplace
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Repository Structure

```
marketplace/
├── skills/
│   ├── app-dev/              # Core app development skill
│   │   ├── SKILL.md          # Main skill definition
│   │   ├── README.md         # Skill documentation
│   │   ├── commands/         # Slash commands (/migrate, /review, etc.)
│   │   ├── references/       # Documentation loaded on-demand
│   │   ├── assets/           # Templates and resources
│   │   └── .cursor/
│   │       └── rules/        # Cursor workspace rules (.mdc files)
│   ├── fdk-setup/            # FDK installation skill
│   └── publish/              # Marketplace publishing skill
├── scripts/                  # Build and utility scripts
├── CLAUDE.md                 # Claude Code workspace configuration
├── CODE_OF_CONDUCT.MD        # Community guidelines
└── README.md                 # Repository overview
```

## How to Contribute

### Reporting Bugs

Before submitting a bug report:
1. Check existing [issues](https://github.com/freshworks-developers/marketplace/issues) to avoid duplicates
2. Use the latest version of the skills

When reporting bugs, include:
- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Environment details** (Cursor version, FDK version, Node.js version)
- **Error messages** or validation output if applicable

### Suggesting Features

Feature requests are welcome! Please include:
- **Use case**: Why is this feature needed?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches you've thought about

### Submitting Changes

We accept contributions for:
- Bug fixes
- New commands
- Documentation improvements
- New reference files
- Rule enhancements
- Template additions

## Development Guidelines

### Skill Structure

Each skill follows the Agent Skills Specification:

```
skill-name/
├── SKILL.md           # Required: Main skill file with YAML frontmatter
├── README.md          # Required: User-facing documentation
├── commands/          # Optional: Slash command definitions
│   └── command.md     # One file per command
├── references/        # Optional: On-demand documentation
│   ├── api/
│   ├── errors/
│   └── ...
├── assets/            # Optional: Templates, icons
│   └── templates/
└── .cursor/
    └── rules/         # Cursor workspace rules
        └── rule.mdc
```

### SKILL.md Format

```markdown
---
name: skill-name
description: Brief description of what the skill does and when to use it
compatibility: Platform versions, FDK versions, Node versions
---

# Skill Title

Instructions and content for the AI assistant...
```

### Rule Files (.mdc)

Cursor rules use `.mdc` format with YAML frontmatter:

```markdown
---
name: rule-name              # Must match filename (without .mdc)
description: What this rule covers
globs: ["**/pattern/*.js"]   # Optional: Auto-trigger on file patterns
alwaysApply: true            # true = always loaded, false = on-demand
---

# Rule Content

Detailed instructions, patterns, and examples...
```

**Naming convention**: The `name` field must match the filename:
- File: `my-rule.mdc` → `name: my-rule`

### Commands

Commands are markdown files in `commands/` directory:

```markdown
# Command Name

Brief description of what the command does.

## Step 1: First Step

Instructions...

## Step 2: Second Step

Instructions...
```

**Command naming**:
- Filename becomes the command: `migrate.md` → `/migrate`
- Use lowercase with hyphens for multi-word commands

### References

Reference files provide detailed documentation loaded on-demand:

```
references/
├── api/                    # API documentation
│   ├── request-method-docs.md
│   └── oauth-docs.md
├── errors/                 # Error handling guides
│   ├── manifest-errors.md
│   └── oauth-errors.md
├── architecture/           # Platform architecture docs
└── tests/                  # Test patterns and golden files
    ├── golden.json
    └── violations.json
```

## Testing Your Changes

### 1. Validate Skill Structure

Ensure your skill follows the correct structure:
```bash
# Check that SKILL.md exists and has valid frontmatter
head -20 skills/your-skill/SKILL.md
```

### 2. Test in Cursor

1. Copy the skill to your Cursor skills directory:
   ```bash
   cp -r skills/app-dev ~/.cursor/skills/
   ```
2. Open Cursor and verify the skill loads
3. Test commands and rules work as expected

### 3. Validate Rules

For rule files, verify:
- `name` field matches filename
- `alwaysApply` is set correctly
- `globs` patterns are valid (if used)

### 4. Run Manifest Generation

After adding or modifying skills:
```bash
python3 scripts/generate_manifest.py
```

Validate the manifest:
```bash
python3 scripts/generate_manifest.py validate
```

## Pull Request Process

1. **Ensure your changes are complete** and tested locally
2. **Update documentation** if you're changing behavior
3. **Run manifest generation** if you modified skills structure
4. **Create a pull request** with:
   - Clear title describing the change
   - Description of what and why
   - Link to related issues (if any)
   - Screenshots or examples (if applicable)

5. **Address review feedback** promptly
6. **Squash commits** if requested before merge

### PR Title Format

Use conventional commit style:
- `feat: add new /lint command`
- `fix: correct OAuth template structure`
- `docs: update README with examples`
- `refactor: simplify validation workflow`

## Style Guidelines

### Markdown

- Use ATX-style headers (`#`, `##`, `###`)
- Use fenced code blocks with language tags
- Keep lines under 120 characters when possible
- Use consistent list formatting (either `*` or `-`, not both)

### Code Examples

- Always include language tags in code blocks
- Use Platform 3.0 patterns only (no legacy 2.x code)
- Include comments for complex logic
- Show both correct and incorrect examples where helpful:
  ```javascript
  // ❌ WRONG
  $request.post(url, options);
  
  // ✅ CORRECT
  $request.invokeTemplate('templateName', { context, body });
  ```

### JSON

- Use 2-space indentation
- No trailing commas
- Keys in logical order (platform-version, modules, engines)

### Rule Content

- Start with clear "When to use" guidance
- Use tables for quick reference
- Include concrete examples
- Mark blocking vs non-blocking issues clearly

## Security

When contributing examples or documentation:
- **Never include real API keys, tokens, or secrets**
- Use placeholders like `<%= iparam.api_key %>` or `your-api-key-here`
- Use generic domains like `your-domain.freshdesk.com`
- Mark sensitive iparams with `"secure": true` in examples

## Questions?

- Check existing [issues](https://github.com/freshworks-developers/marketplace/issues) and discussions
- Review the [Freshworks Developer Docs](https://developers.freshworks.com/)
- Contact devrels@freshworks.com for additional support

Thank you for contributing!
