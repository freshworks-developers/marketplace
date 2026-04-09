---
name: fdk-uninstall
description: Uninstall FDK (keeps Node.js and nvm)
always: true
---

# FDK Uninstall Command

**ALWAYS invoke the fdk-setup skill with a shell subagent for this operation.**

## Execution

Read the parent skill file and use the Task tool to create a shell subagent:

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Uninstall FDK",
  prompt: `<Use Operation 4: Uninstall template from SKILL.md>`
})
```

## Operation Template

Use the full "Operation 4: Uninstall" template from `../SKILL.md` starting at line ~416.

Key points:
- Check current FDK: `fdk version`
- Uninstall FDK: `npm uninstall @freshworks/fdk -g`
- Verify removal: `fdk version` should fail
- Report preserved: Node.js 24, nvm, other Node versions

## Never

- Never execute uninstall steps directly without subagent
- Never skip the Task tool invocation
- Never remove Node.js or nvm (only remove FDK)
- Never use direct shell commands for complex operations
