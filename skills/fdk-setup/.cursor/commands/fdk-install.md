---
name: fdk-install
description: Install FDK with Node 24
always: true
---

# FDK Install

Execute Operation 1 from `../SKILL.md`.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK",
  prompt: `[Use Operation 1 template from ../SKILL.md]`
})
```
