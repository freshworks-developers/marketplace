# Platform 3.0 Request Templates

## Overview

Request templates in Platform 3.0 are the **ONLY** way to consume external APIs. The legacy methods (`$request.post()`, `$request.get()`, etc.) are **deprecated** and will cause errors.

## How to Consume External APIs

### Step 1: Update index.html
```html
<script src="{{{appclient}}}"></script>
```

### Step 2: Add Request Template in config/requests.json
```json
{
  "sampleTemplate": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "northstar.freshchat.com",
      "path": "/api/v2/conversations/{conversation_id}/messages",
      "headers": {
        "Authorization": "Bearer <%= iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

### Step 3: Declare Request Template in manifest.json
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {
        "sampleTemplate": {}
      }
    },
    "support_ticket": {}
  }
}
```

### Step 4: Invoke from Frontend (app.js)
```javascript
try {
  let sampleTemplateResponse = await client.request.invokeTemplate(
    "sampleTemplate", {}
  );
  let responseJSON = JSON.parse(sampleTemplateResponse.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

### Step 5: Invoke from Backend (server.js)
```javascript
exports = {
  onTicketCreateCallback: async function (payload) {
    try {
      await $request.invokeTemplate("sampleTemplate", {
        context: { conversation_id: payload.conversation_id }
      })
    } catch (error) {
      // handle error
    }
  }
}
```

## Request Template with Global Apps

### Declare in manifest.json
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {
        "getDeals": {},
        "sendToExternalAPI": {}
      }
    },
    "support_ticket": {}
  },
  "engines": {
    "node": "18.18.0",
    "fdk": "9.1.0"
  }
}
```

### Configure in config/requests.json
```json
{
  "getDeals": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.domain %>.myfreshworks.com",
      "path": "/crm/sales/api/deals",
      "headers": {
        "Authorization": "Bearer <%= iparam.apikey %>",
        "Content-Type": "application/json"
      },
      "query": {
        "page": "<%= context.page %>",
        "per_page": "20"
      }
    },
    "options": {
      "retryDelay": 1000
    }
  },
  "sendToExternalAPI": {
    "schema": {
      "method": "POST",
      "host": "<%= iparam.ext_domain %>.example.com",
      "path": "/api/",
      "headers": {
        "Authorization": "Bearer <%= iparam.ext_apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Sending API Request with Request Body

### Update config/requests.json
```json
{
  "sampleTemplate": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "northstar.freshchat.com",
      "path": "/api/v2/conversations/1234/messages",
      "query": {
        "page": "<%= context.page %>",
        "per_page": "20"
      }
    }
  }
}
```

### Invoke with Body (app.js)
```javascript
const body = {
  "channel_name": "abcd"
}

try {
  let sampleTemplateResponse = await client.request.invokeTemplate(
    "sampleTemplate", {
      context: { conversation_id: payload.conversation_id },
      body: JSON.stringify(body)
    }
  );
  let responseJSON = JSON.parse(sampleTemplateResponse.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

## Installation Parameters (iparams) in Request Templates

Installation parameters substitution is supported in:

1. **schema.host** - Only non-secure values
2. **schema.path** - Only non-secure values  
3. **schema.headers** - Both secure and non-secure values
4. **schema.query** - Only non-secure values

### Example with iparams
```json
{
  "schema": {
    "method": "GET",
    "host": "<%= iparam.domain %>.freshchat.com",
    "path": "/api/v2/conversations/1234/messages",
    "headers": {
      "Authorization": "Bearer <%= iparam.api_key %>",
      "Content-Type": "application/json"
    },
    "query": {
      "page": "<%= context.page %>",
      "items_per_page": "20"
    }
  }
}
```

## Request Template Schema

### Required Fields
- `method` - HTTP method (GET, POST, PUT, DELETE, PATCH)
- `host` - API hostname (without protocol)
- `path` - API endpoint path

### Optional Fields
- `protocol` - Default: "https"
- `headers` - HTTP headers (Authorization, Content-Type, etc.)
- `query` - Query parameters
- `options` - Additional options (retryDelay, etc.)

### Template Variables
- `<%= iparam.name %>` - Installation parameter
- `<%= context.name %>` - Runtime context value
- `<%= access_token %>` - OAuth access token (OAuth requests only)

## Context Variables

Pass dynamic values using the `context` parameter:

```javascript
// In app.js or server.js
await client.request.invokeTemplate("templateName", {
  context: {
    conversation_id: "12345",
    page: 1,
    user_id: "abc123"
  },
  body: JSON.stringify({ data: "value" })
});
```

Use in request template:
```json
{
  "schema": {
    "path": "/api/conversations/<%= context.conversation_id %>/messages",
    "query": {
      "page": "<%= context.page %>"
    }
  }
}
```

## Error Handling

### Frontend (app.js)
```javascript
try {
  let response = await client.request.invokeTemplate("templateName", {});
  let data = JSON.parse(response.response);
  console.log(data);
} catch (error) {
  console.error("API Error:", error);
  // Show user-friendly error message
  client.interface.trigger("showNotify", {
    type: "error",
    message: "Failed to fetch data"
  });
}
```

### Backend (server.js)
```javascript
exports = {
  myHandler: async function(args) {
    try {
      const response = await $request.invokeTemplate("templateName", {
        context: { id: args.data.id }
      });
      return { success: true, data: response };
    } catch (error) {
      console.error("API Error:", error);
      return { success: false, error: error.message };
    }
  }
};
```

## Best Practices

1. **Always declare in manifest** - Request templates must be in `modules.common.requests`
2. **Use template variables** - Never hardcode sensitive data in templates
3. **Handle errors** - Always use try/catch blocks
4. **Parse responses** - Use `JSON.parse(response.response)` for JSON APIs
5. **Secure values in headers** - Use iparams for API keys and tokens
6. **Context for dynamic values** - Pass runtime values via context parameter
7. **Test with fdk run** - Verify templates work before deployment

## Common Errors

### Error: "Requested function not found or registered"
**Cause:** Request template not declared in manifest  
**Solution:** Add to `modules.common.requests`:
```json
{
  "modules": {
    "common": {
      "requests": {
        "yourTemplateName": {}
      }
    }
  }
}
```

### Error: "post is no longer supported in Request API"
**Cause:** Using deprecated `$request.post()` method  
**Solution:** Use `$request.invokeTemplate()` instead:
```javascript
// ❌ Wrong
$request.post('https://api.example.com/endpoint', options)

// ✅ Correct
$request.invokeTemplate('templateName', { context: {}, body: JSON.stringify(data) })
```

### Error: "Invalid iparam substitution"
**Cause:** Using secure iparam in unsupported field  
**Solution:** Secure iparams only work in `schema.headers`

## Migration from Platform 2.x

### Before (Platform 2.x - Deprecated)
```javascript
// ❌ This no longer works
$request.post('https://api.example.com/endpoint', {
  headers: {
    'Authorization': 'Bearer ' + apiKey
  },
  json: { data: 'value' }
});
```

### After (Platform 3.0 - Correct)

**1. Create config/requests.json:**
```json
{
  "externalApiCall": {
    "schema": {
      "method": "POST",
      "host": "api.example.com",
      "path": "/endpoint",
      "headers": {
        "Authorization": "Bearer <%= iparam.apiKey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

**2. Declare in manifest.json:**
```json
{
  "modules": {
    "common": {
      "requests": {
        "externalApiCall": {}
      }
    }
  }
}
```

**3. Invoke in server.js:**
```javascript
await $request.invokeTemplate('externalApiCall', {
  context: {},
  body: JSON.stringify({ data: 'value' })
});
```

