---
name: fdk-install
description: Install FDK 10 + Node 24 via nvm
always: true
---

# FDK Install Command

**ALWAYS invoke the fdk-setup skill with a shell subagent for this operation.**

## Execution

Read the parent skill file and use the Task tool to create a shell subagent:

```javascript
Task({
  subagent_type: "shell",
  model: "fast",
  description: "Install FDK 10 with Node 24",
  prompt: `<Use Operation 1: Install template from SKILL.md>`
})
```

## Operation Template

Use the full "Operation 1: Install" template from `../SKILL.md` starting at line ~138.

Key points:
- Install FDK 10.x (latest) + Node.js 24.x (LTS)
- Use nvm for version management
- METHOD 1: Homebrew (macOS/Linux) - RECOMMENDED
- METHOD 2: NPM fallback (Windows or if Homebrew unavailable)
- Create nvm alias: `nvm alias fdk 24`
- Configure shell (PATH)
- Verify installation

## Never

- Never execute installation steps directly without subagent
- Never skip the Task tool invocation
- Never use direct shell commands for complex operations
