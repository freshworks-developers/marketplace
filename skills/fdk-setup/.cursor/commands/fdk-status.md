---
name: fdk-status
description: Check FDK and Node.js installation status
always: true
---

# FDK Status

Execute Operation 5 from `../SKILL.md`.

## Execution

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Check FDK status",
  prompt: `[Use Operation 5 template from ../SKILL.md]`
})
```
