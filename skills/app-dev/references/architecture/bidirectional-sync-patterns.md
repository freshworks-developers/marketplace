# Bidirectional Sync Patterns

## Recognition Rule

**When user says "sync A with B" → Implement bidirectional sync with user-configurable direction.**

User mentions: "sync", "integrate", "keep in sync", "mapping between systems" → Bidirectional capability required.

---

## Required Components

### 1. Custom Installation Parameters (MANDATORY)

**Use custom iparams (NOT default iparams.json):**

```
config/
├── iparams.html
└── assets/
    ├── iparams.js
    └── iparams.css
```

**Required field:**
- `sync_direction` dropdown: "system_a_to_b", "system_b_to_a", "bidirectional"
- Forward mapping (A → B)
- Reverse mapping (B → A) - shown conditionally

### 2. External Event Handler

**For External → Freshworks sync:**

```json
{
  "modules": {
    "common": {
      "events": {
        "onAppInstall": { "handler": "onAppInstallHandler" },
        "onAppUninstall": { "handler": "onAppUninstallHandler" },
        "onExternalEvent": { "handler": "onExternalEventHandler" }
      }
    }
  }
}
```

**Handler checks sync_direction before processing.**

### 3. Webhook Registration

**onAppInstall:**
- Check sync_direction
- Register webhook if external → freshworks enabled
- Use `generateTargetUrl()`
- Store webhook ID in KV store

**onAppUninstall:**
- Retrieve webhook ID
- Deregister webhook
- Log cleanup

### 4. Bidirectional KV Store

**Store links both ways:**
```javascript
await $db.set(freshworksId, { external_id: externalId });
await $db.set('external_' + externalId, { freshworks_id: freshworksId });
```

### 5. Request Templates

**Need templates for:**
- External system CRUD operations
- External webhook registration/deletion
- Freshworks API (to update from external side)

---

## Validation Checklist

- [ ] Custom iparams with sync_direction dropdown
- [ ] Forward and reverse mapping configuration
- [ ] onExternalEvent handler
- [ ] onAppInstall registers webhook conditionally
- [ ] onAppUninstall deregisters webhook
- [ ] Bidirectional KV store links
- [ ] Request template for Freshworks API
- [ ] Both sync handlers check sync_direction
