---
name: fdk-downgrade
description: Downgrade FDK to specific version
always: true
argument-hint: "<version>"
---

# FDK Downgrade Command

**ALWAYS invoke the fdk-setup skill with a shell subagent for this operation.**

## Usage

```bash
/fdk-downgrade 10.0.0
/fdk-downgrade 9.7.4
```

## Execution

Read the parent skill file and use the Task tool to create a shell subagent:

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK to <version>",
  prompt: `<Use Operation 3: Downgrade template from SKILL.md with target version>`
})
```

## Operation Template

Use the full "Operation 3: Downgrade" template from `../SKILL.md` starting at line ~371.

Key points:
- Parse target version from user request
- Ensure Node 24 active: `nvm use fdk`
- Uninstall current FDK: `npm uninstall @freshworks/fdk -g`
- Install target version: `npm install https://cdn.freshdev.io/fdk/v<VERSION>.tgz -g`
- Verify installation
- Display warning about compatibility

## Version Argument

If no version provided, ask user for target version.

Common versions:
- `10.1.0` - Latest FDK 10
- `10.0.0` - First FDK 10 release
- `9.8.2` - Latest FDK 9.x
- `9.7.4` - Stable FDK 9

## Never

- Never execute downgrade steps directly without subagent
- Never skip the Task tool invocation
- Never use direct shell commands for complex operations
