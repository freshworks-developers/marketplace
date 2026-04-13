---
name: fdk-uninstall
description: Uninstall FDK (keeps Node.js and nvm)
always: true
---

# FDK Uninstall

Execute Operation 4 from `../SKILL.md`.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Uninstall FDK",
  prompt: `[Use Operation 4 template from ../SKILL.md]`
})
```
