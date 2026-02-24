# Error Catalog - Common Platform 3.0 Issues

Complete reference for FDK validation errors, code quality errors, and Platform 2.x migration errors.

## FDK Validation Errors

### iparams.json is mandatory
**Error:** "iparams.json is mandatory"  
**Fix:** Create either `config/iparams.json` OR `config/iparams.html` (not both)  
**Rule:** Every app MUST have installation parameters configuration

**Two Options:**
1. **Default iparams** (most common): `config/iparams.json` - Platform generates Settings form
2. **Custom iparams** (advanced): `config/iparams.html` + `config/assets/iparams.js` - You build custom Settings UI

**Cannot use both in same app** - Choose one approach

### Dropdown default value not listed in options
**Error:** "The default value specified for the '<field_name>' dropdown type is not listed in the options."  
**Fix:** Ensure `default_value` exactly matches one of the option values (case-sensitive, character-perfect)  
**Rule:** Dropdown `default_value` must be string-exact match with an option's `value` field

**⚠️ AI Agent Caution:**
- Do NOT assume first option is default
- Do NOT use label text as default_value
- Do NOT invent values not in options list
- ALWAYS verify exact string match (case + spacing)

**Common Pitfalls:**

1. **Case Mismatch**
   ```json
   // ❌ WRONG
   {
     "priority": {
       "default_value": "High",  // Capital H
       "options": [
         { "label": "High Priority", "value": "high" }  // lowercase
       ]
     }
   }
   
   // ✅ CORRECT
   {
     "priority": {
       "default_value": "high",  // Matches exactly
       "options": [
         { "label": "High Priority", "value": "high" }
       ]
     }
   }
   ```

2. **Using Label Instead of Value**
   ```json
   // ❌ WRONG
   {
     "environment": {
       "default_value": "Production Server",  // This is the label!
       "options": [
         { "label": "Production Server", "value": "prod" }
       ]
     }
   }
   
   // ✅ CORRECT
   {
     "environment": {
       "default_value": "prod",  // Use the value field
       "options": [
         { "label": "Production Server", "value": "prod" }
       ]
     }
   }
   ```

3. **Typo in Value**
   ```json
   // ❌ WRONG
   {
     "mode": {
       "default_value": "automatic",  // Typo: should be "auto"
       "options": [
         { "label": "Automatic", "value": "auto" }
       ]
     }
   }
   ```

**Note:** Platform does NOT support `"default": true` inside option objects - must use top-level `default_value` field

### Missing default value for dropdown
**Error:** "In the '<field_name>' field, specify the default value for the dropdown type."  
**Fix:** Add required `default_value` field to dropdown iparam  
**Rule:** All dropdown iparams MUST have a default_value - it is NOT optional

**⚠️ AI Agent Caution:**
- Do NOT generate dropdown without default_value
- Do NOT assume platform picks first option as default
- ALWAYS explicitly set default_value field

**Example:**
```json
// ❌ WRONG - Missing default_value
{
  "log_level": {
    "type": "dropdown",
    "options": [
      { "label": "Info", "value": "info" },
      { "label": "Debug", "value": "debug" }
    ]
  }
}

// ✅ CORRECT - Has default_value
{
  "log_level": {
    "type": "dropdown",
    "default_value": "info",  // Required!
    "options": [
      { "label": "Info", "value": "info" },
      { "label": "Debug", "value": "debug" }
    ]
  }
}
```

### icon.svg not found
**Error:** "icon.svg not found"  
**Fix:** Create `app/styles/images/icon.svg`  
**Rule:** Frontend apps MUST have icon.svg in correct location

### Invalid location(s) mentioned in modules
**Error:** "Invalid location(s) mentioned in modules"  
**Fix:** Move location to correct module:
- `full_page_app`, `cti_global_sidebar` → `modules.common.location`
- `ticket_sidebar`, `asset_sidebar`, etc. → `modules.<product_module>.location`  
**Rule:** Product-specific locations CANNOT be in `common` module

### Request template not found
**Error:** "Request template not found"  
**Fix:** Ensure request template name matches in:
1. `manifest.json` → `modules.common.requests.templateName`
2. `config/requests.json` → `templateName`
3. Code → `$request.invokeTemplate('templateName', {})`  
**Rule:** All three must match exactly

### Multiple top-level JSON objects
**Error:** "Unexpected token { in JSON" or "Multiple top-level JSON objects"  
**Cause:** JSON file contains multiple top-level objects instead of single object  
**Fix:** Merge into single top-level object with proper commas

**Example (requests.json):**
```json
// ❌ WRONG
{ "request1": { ... } }
{ "request2": { ... } }

// ✅ CORRECT
{
  "request1": { ... },
  "request2": { ... }
}
```

**Rule:** All JSON files MUST have single top-level object. Use commas to separate properties.

### Request template schema/host must not have path
**Error:** "Request template schema/host must not have path"  
**Cause:** Host contains URL path or encoded characters  
**Fix:** Use context variables with `<%= %>` syntax:
```json
{
  "myRequest": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "<%= context.subdomain %>.freshdesk.com",
      "path": "/api/v2/contacts"
    }
  }
}
```
**Rule:** Host must be FQDN only. Use `<%= context.variable %>` for dynamic values

### Request template schema/path must start with '/'
**Error:** "Request template schema/path must start with '/'"  
**Fix:** Ensure path starts with `/`:
```json
// ❌ WRONG
"path": "api/endpoint"

// ✅ CORRECT
"path": "/api/endpoint"
```

### Request template schema must NOT have additional properties 'body'
**Error:** "Request template 'X' schema must NOT have additional properties 'body'"  
**Cause:** `body` property in request template schema definition  
**Fix:** Remove `body` from schema - it goes in invocation, not schema
```json
// ❌ WRONG - body in schema
{
  "myRequest": {
    "schema": {
      "method": "POST",
      "host": "api.example.com",
      "path": "/endpoint",
      "body": "..."  // ❌ NOT HERE!
    }
  }
}

// ✅ CORRECT - body in invocation
{
  "myRequest": {
    "schema": {
      "method": "POST",
      "host": "api.example.com",
      "path": "/endpoint",
      "headers": {
        "Content-Type": "application/json"
      }
    }
  }
}

// Pass body when invoking:
$request.invokeTemplate('myRequest', { 
  context: {},
  body: JSON.stringify({ data: 'value' })
})
```
**Rule:** Schema defines the template. Body is passed during invocation.

### Mandatory folder(s) missing: app
**Error:** "Mandatory folder(s) missing: app"  
**Fix:** Create `app/` folder with required structure:
```
app/
├── index.html
├── scripts/
│   └── app.js
└── styles/
    ├── style.css
    └── images/
        └── icon.svg
```
**Rule:** Frontend apps (with location) MUST have `app/` folder. Serverless-only apps don't need it.

### Location must NOT have fewer than 1 properties
**Error:** "/modules/common/location must NOT have fewer than 1 properties"  
**Cause:** Empty location object: `"location": {}`  
**Fix:** Either add a location OR remove the location key entirely:
```json
// ❌ WRONG - empty location
{
  "modules": {
    "common": {
      "location": {}  // Empty!
    }
  }
}

// ✅ CORRECT - has location
{
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}

// ✅ CORRECT - no location key (serverless app)
{
  "modules": {
    "common": {
      "requests": {},
      "functions": {}
    }
  }
}
```
**Rule:** Don't create empty location objects. Either define a location or omit the key.

### Must have required property 'engines'
**Error:** "must have required property 'engines' in manifest.json"  
**Fix:** Add engines block to manifest:
```json
{
  "platform-version": "3.0",
  "modules": { ... },
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```
**Rule:** All Platform 3.0 apps MUST declare node and fdk versions in engines block.

### SMI function not found
**Error:** "SMI function not found"  
**Fix:** Ensure function name matches in:
1. `manifest.json` → `modules.common.functions.functionName`
2. `server/server.js` → `exports.functionName`
3. Frontend → `client.request.invoke('functionName', {})`

### Invalid event for module
**Error:** "Invalid event: 'onScheduledSync' for module: common"  
**Fix:** Remove scheduled events from manifest. Create dynamically:
```javascript
exports = {
  onAppInstallHandler: async function(args) {
    await $schedule.create({
      name: "dailySync",
      schedule_at: new Date(Date.now() + 86400000).toISOString(),
      time_unit: "days",
      frequency: 1
    });
  },
  scheduledSyncHandler: async function(payload) {
    await syncData(payload.data);
  }
};
```
**Rule:** Scheduled events are created at runtime, NOT declared in manifest

## Code Quality Errors

### Async function has no 'await' expression
**CRITICAL:** Mandatory lint requirement - ZERO TOLERANCE  
**Fix Option 1:** Add `await`:
```javascript
exports = {
  fetchData: async function(args) {
    return await $request.invokeTemplate('api', {});
  }
};
```
**Fix Option 2:** Remove `async`:
```javascript
exports = {
  fetchData: function(args) {
    return $request.invokeTemplate('api', {});
  }
};
```

### Parameter defined but never used
**Fix Option 1:** Remove unused parameter:
```javascript
exports = {
  handler: function() {
    console.log('Called');
  }
};
```
**Fix Option 2:** Prefix with underscore:
```javascript
exports = {
  handler: function(_args) {
    console.log('Called');
  }
};
```

### Function complexity exceeds 7
**Fix:** Extract helper functions:
```javascript
// ✅ CORRECT
function process(data) {
  const validItems = getValidItems(data);
  return processItems(validItems);
}

function getValidItems(data) {
  return data.items.filter(item => item.valid);
}
```

### Variable declared and assigned in different scopes
**Fix:** Use IIFE pattern:
```javascript
// ✅ CORRECT
(async function() {
  const client = await app.initialized();
  client.events.on('app.activated', () => {
    // App logic
  });
})();
```

### Helper function parsing error
**Error:** "Error while parsing file containing serverless functions"  
**Fix:** Move helper functions AFTER exports block:
```javascript
// ✅ CORRECT
exports = {
  myHandler: function(args) {
    const parsed = parseUrl(args.url);
  }
};

function parseUrl(url) {
  return new URL(url);
}
```

## Platform 2.x Pattern Errors

### whitelisted-domains is deprecated
**Fix:** Use request templates:
```json
// ✅ CORRECT
{
  "modules": {
    "common": {
      "requests": { "apiCall": {} }
    }
  }
}
```

### post is no longer supported in Request API
**Fix:** Use `$request.invokeTemplate()`:
```javascript
// ✅ CORRECT
await $request.invokeTemplate('apiCall', {
  context: {},
  body: JSON.stringify({ data: 'value' })
});
```

### Invalid platform-version
**Fix:** Always use Platform 3.0:
```json
// ✅ CORRECT
{
  "platform-version": "3.0",
  "modules": {
    "common": {},
    "support_ticket": {}
  }
}
```

## OAuth Configuration Errors

### OAuth config must have required property 'integrations'
**Fix:** Wrap in `integrations`:
```json
// ✅ CORRECT
{
  "integrations": {
    "oauth_name": {
      "display_name": "Service",
      "client_id": "<%= oauth_iparams.client_id %>",
      "client_secret": "<%= oauth_iparams.client_secret %>",
      "authorize_url": "https://...",
      "token_url": "https://...",
      "token_type": "account",
      "options": { "scope": "read" }
    }
  }
}
```

### OAuth request missing 'options.oauth' configuration
**Fix:** Add OAuth options:
```json
{
  "getOAuthData": {
    "schema": {
      "method": "GET",
      "host": "api.github.com",
      "path": "/user",
      "headers": {
        "Authorization": "bearer <%= access_token %>"
      }
    },
    "options": {
      "oauth": "github"
    }
  }
}
```

## UI Component Errors

### Plain HTML form elements not allowed
**Fix:** Use Crayons components:
```html
<!-- ✅ CORRECT -->
<fw-button color="primary">Click Me</fw-button>
<fw-input label="Name"></fw-input>
<fw-select label="Choose">
  <fw-select-option value="1">Item</fw-select-option>
</fw-select>
```

### Crayons components used but CDN not included
**Fix:** Add Crayons CDN to HTML:
```html
<script async type="module" src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.esm.js"></script>
<script async nomodule src="https://cdn.jsdelivr.net/npm/@freshworks/crayons@v4/dist/crayons/crayons.js"></script>
```

## Manifest Structure Errors

### Missing engines block
**Fix:** Add engines:
```json
{
  "engines": {
    "node": "18.20.8",
    "fdk": "9.7.4"
  }
}
```

### At least one product module required
**Fix:** Add product module:
```json
{
  "modules": {
    "common": {},
    "support_ticket": {}
  }
}
```
