---
name: fdk-downgrade
description: Downgrade FDK to specific version
always: true
argument-hint: "<version>"
---

# FDK Downgrade

Execute Operation 3 from `../SKILL.md`.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Downgrade FDK to version",
  prompt: `[Use Operation 3 template from ../SKILL.md with target version]`
})
```
