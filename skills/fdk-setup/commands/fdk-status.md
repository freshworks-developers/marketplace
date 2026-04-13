---
name: fdk-status
description: Check FDK and Node.js installation status
always: true
---

# FDK Status

Check FDK installation status.

## Execution

Run checks directly (no subagent needed):

```bash
echo "=== FDK Status ==="
fdk version 2>&1 || echo "Not installed"
node --version 2>&1 || echo "Not installed"
nvm --version 2>&1 || echo "Not installed"
which fdk
[ -d ~/.fdk ] && echo "Cache exists" || echo "No cache"
echo "=================="
```

Report findings to user.
