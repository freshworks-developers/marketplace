---
name: fdk-upgrade
description: Upgrade FDK to latest version
always: true
---

# FDK Upgrade Command

**ALWAYS invoke the fdk-setup skill with a shell subagent for this operation.**

## Execution

Read the parent skill file and use the Task tool to create a shell subagent:

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Upgrade FDK to latest",
  prompt: `<Use Operation 2: Upgrade template from SKILL.md>`
})
```

## Operation Template

Use the full "Operation 2: Upgrade" template from `../SKILL.md` starting at line ~326.

Key points:
- Check current FDK version
- Ensure Node 24 active: `nvm use fdk`
- Upgrade FDK: `npm install https://cdn.freshdev.io/fdk/latest-v24.tgz -g`
- Verify upgrade
- Test FDK: `fdk validate --help`

## Never

- Never execute upgrade steps directly without subagent
- Never skip the Task tool invocation
- Never use direct shell commands for complex operations
