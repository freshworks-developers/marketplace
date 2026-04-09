---
name: fdk-status
description: Check FDK and Node.js installation status
always: true
---

# FDK Status Command

**ALWAYS invoke the fdk-setup skill with a shell subagent for this operation.**

## Execution

Read the parent skill file and use the Task tool to create a shell subagent:

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Check FDK status",
  prompt: `<Use Operation 5: Status template from SKILL.md>`
})
```

## Operation Template

Use the full "Operation 5: Status" template from `../SKILL.md` starting at line ~456.

Key points:
- Check FDK: `fdk version`, `which fdk`
- Check Node: `node --version`, `which node`
- Check nvm: `nvm --version`, `nvm current`, `nvm list`
- Check npm: `npm --version`, `npm config get prefix`
- Check PATH: `echo $PATH | grep nvm`
- Analyze and report status

## Output Format

```
FDK Status Report:

✓ FDK: <version> (<path>)
✓ Node: <version> (<path>)
✓ nvm: <version>
✓ npm: <version>

Node versions available:
  → v24.x.x (fdk)
    v20.x.x
    v22.x.x

Configuration:
✓ Shell: <shell>
✓ PATH configured
✓ nvm alias 'fdk' → 24

Status: Ready to develop Freshworks apps
```

## Never

- Never execute status checks directly without subagent
- Never skip the Task tool invocation
- This ensures consistent reporting format
