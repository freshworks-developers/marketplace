# Request template ↔ manifest sync

Every key in `config/requests.json` MUST appear under `modules.common.requests` in `manifest.json`.

```
config/requests.json:           manifest.json:
{                               "modules": {
  "createTask": {...},    →       "common": {
  "addComment": {...}     →         "requests": {
}                                     "createTask": {},
                                      "addComment": {}
                                    }
                                  }
                                }
```

**Validation warning if not synced:** `Request template 'X' is declared but not associated with module`
