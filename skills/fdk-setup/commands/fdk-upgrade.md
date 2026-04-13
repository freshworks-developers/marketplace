---
name: fdk-upgrade
description: Upgrade FDK to latest version
always: true
---

# FDK Upgrade

Execute Operation 2 from `../SKILL.md`.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Upgrade FDK",
  prompt: `[Use Operation 2 template from ../SKILL.md]`
})
```
