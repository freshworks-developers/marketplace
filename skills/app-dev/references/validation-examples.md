# Validation Workflow Examples

## Complete 5-Iteration Success Example

**User Request:** "Create a Freshdesk app that syncs tickets"

```
Creating Freshdesk ticket sync app...

📋 Initial Validation (Iteration 1):
Platform Errors: 3 | Lint Errors: 5 | Total: 8

Platform Errors:
1. manifest.json:18 - Function 'syncTickets' not in server/server.js exports
2. config/requests.json:5 - FQDN includes path: api.example.com/v2/tickets
3. manifest.json:25 - Event handler 'onTicketUpdate' not in exports

Lint Errors:
1. server/server.js:8 - 'args' defined but never used
2. server/server.js:15 - Function 'processTickets' complexity 14 (max 7)
3. server/server.js:3 - Unexpected var, use const/let
4. server/server.js:22 - Async function 'fetchData' has no await
5. server/server.js:30 - 'result' assigned but never used

Fixes: Add exports, fix FQDN, remove unused vars, replace var

📋 Validation Output (Iteration 2):
Platform Errors: 1 (was 3) | Lint Errors: 2 (was 5) | Total: 3 (was 8)
Progress: Reduced -5

Platform Errors:
1. config/requests.json:8 - Missing 'headers' in template 'getTickets'

Lint Errors:
1. server/server.js:15 - Function 'processTickets' complexity 14 (max 7)
2. server/server.js:22 - Async 'fetchData' has no await

Fixes: Add headers, remove async, refactor with Sets

📋 Validation Output (Iteration 3):
Platform Errors: 0 (was 1) | Lint Errors: 1 (was 2) | Total: 1 (was 3)
Progress: Reduced -2

Lint Errors:
1. server/server.js:15 - Function 'processTickets' complexity 10 (max 7)

Fixes: Extract helpers, guard clauses, move after exports

📋 Validation Output (Iteration 4):
Platform Errors: 0 | Lint Errors: 1 | Total: 1
Progress: Unchanged (complexity 10 → 8)

Lint Errors:
1. server/server.js:15 - Function 'processTickets' complexity 8 (max 7)

Fixes: Break into processTickets + validateTicket + formatTicket

📋 Validation Output (Iteration 5):
Platform Errors: 0 | Lint Errors: 0 | Total: 0 (was 1)
Progress: Reduced -1

✅ [VALID] App generated successfully

Validation: 0 platform errors, 0 lint errors
Next: cd freshdesk-ticket-sync && fdk run
```

## Autofix Failure Example (Stops at Iteration 3)

```
📋 Initial Validation (Iteration 1):
Platform Errors: 2 | Lint Errors: 3 | Total: 5

Platform Errors:
1. manifest.json:12 - Invalid location 'ticket_details_page'
2. config/oauth_config.json:5 - Missing 'integrations' wrapper

Lint Errors:
1. server/server.js:8 - 'data' assigned but never used
2. server/server.js:15 - Function 'complexFilter' complexity 18 (max 7)
3. server/server.js:3 - Unexpected var

Fixes: Fix location, add integrations, remove unused, replace var

📋 Validation Output (Iteration 2):
Platform Errors: 0 (was 2) | Lint Errors: 1 (was 3) | Total: 1 (was 5)
Progress: Reduced -4

Lint Errors:
1. server/server.js:15 - Function 'complexFilter' complexity 18 (max 7)

Fixes: Extract to Sets, guard clauses, break nested ifs

📋 Validation Output (Iteration 3):
Platform Errors: 0 | Lint Errors: 1 | Total: 1
Progress: Unchanged (complexity 18 → 16)

Lint Errors:
1. server/server.js:15 - Function 'complexFilter' complexity 16 (max 7)

❌ [FAILED] No progress after 3 iterations

BLOCKING ERRORS:
Lint Errors (1):
1. server/server.js:15 - Complexity 16 (max 7)

Analysis: Complexity 18 → 16 still exceeds limit. Needs major restructuring.

🔧 Manual Fix Required:

Split into focused functions (each ≤5 complexity):

```javascript
// Main (complexity 2)
function complexFilter(items, filters) {
  return items
    .filter(isValid)
    .filter(item => matchesFilters(item, filters))
    .map(transformItem);
}

// Helpers (each ≤3)
function isValid(item) {
  return item && item.id && item.status;
}

const VALID_STATUSES = new Set(['open', 'pending', 'resolved']);
function matchesFilters(item, filters) {
  if (filters.status && !VALID_STATUSES.has(item.status)) return false;
  if (filters.priority && !matchesPriority(item, filters.priority)) return false;
  return true;
}

const HIGH_PRIORITIES = new Set(['2', '3', 'high', 'urgent']);
function matchesPriority(item, priority) {
  return HIGH_PRIORITIES.has(String(item.priority));
}
```

App NOT ready until fixed. Run `fdk validate` after.
```

## Common Fix Patterns

### Missing icon.svg
```bash
cat > app/styles/images/icon.svg << 'EOF'
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="8" fill="#4A90D9"/>
  <text x="32" y="40" font-family="Arial" font-size="24" font-weight="bold" fill="white" text-anchor="middle">App</text>
</svg>
EOF
```

### Async without await
```javascript
// WRONG
async function() { console.log('Hi'); }
// CORRECT
function() { console.log('Hi'); }
```

### Unused parameter
```javascript
// WRONG
function(args) { console.log('Hi'); }
// CORRECT
function() { console.log('Hi'); }
```

### var usage
```javascript
// WRONG
var id = ticket.id;
// CORRECT
const id = ticket.id;
```

### Complexity > 7
```javascript
// WRONG (complexity 12)
if (p === '2' || p === '3' || p === 'high') return true;

// CORRECT (complexity 3)
const HIGH = new Set(['2', '3', 'high']);
if (HIGH.has(p)) return true;
```

### FQDN with path
```json
// WRONG
{ "host": "api.example.com/v2" }
// CORRECT
{ "host": "api.example.com", "path": "/v2/endpoint" }
```

### Multiple JSON objects
```json
// WRONG
{ "req1": {} }
{ "req2": {} }
// CORRECT
{ "req1": {}, "req2": {} }
```

### Empty manifest blocks
```json
// WRONG
{ "common": { "functions": {} } }
// CORRECT (remove empty)
{ "common": {} }
// OR (add content)
{ "common": { "functions": { "myFunc": {} } } }
```
