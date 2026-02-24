>title: Fixing request template is declared but not associated with any product error
>tags: request-method, request-template, manifest.json, requests.json
>context: requests.json, manifest.json
>content:

# Fixing request template is declared but not associated with any product error

## Error message during fdk run
```
⚠ request template 'requestTemplateName' is declared but not associated with any product
```

## Steps to resolve the error by configuing request templates to products:
1. Define the request template with `requestTemplateName` in `config/requests.json`.
2. In `manifest.json`, declare the request template `requestTemplateName` in  `product.<productName>.requests`

>code:
### Define the request template with `requestTemplateName` in `config/requests.json`:
The below snapshot of the request template `getContacts` defined in `config/requests.json`.
```json
{
  "getContacts": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.subdomain %>.freshdesk.com",
      "path": "/api/v2/contacts",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.api_key) %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

### In `manifest.json`, declare the request template `requestTemplateName` in  `product.<productName>.requests`:
Declaring the `getContacts` request template in `manifest.json` to associate the request template with Freshdesk product.
```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "requests": {
        "getContacts": {}
      }
    }
  }
}
```

---

>title: Fixing the FDK validation errors with request templates defined.
>tags: request-method, request-template, schema, requests.json
>context: requests.json, manifest.json, app.js
>content:

# Fixing the FDK validation errors with request templates defined

## Error message during fdk validation:
Fixing the FDK validate error with request templates in `requests.json` and `manifest.json` for the below error - 
```
Validation failed due to the following issue(s):
✖ Request template 'request_template_API' is not defined in config/requests.json"
```

## Steps to resolve the error by configuing request templates to products:
1. Define the request template with `requestTemplateName` in `config/requests.json`.
2. In `manifest.json`, declare the request template `requestTemplateName` in  `product.<productName>.requests`.
3. Using `requestTemplateName` while invoking the request template in app code.
>code:

### Define the request template with `requestTemplateName` in `config/requests.json`:
Define the request template `getContacts` in `config/requests.json` with a snapshot of the request.
```json
{
  "getContacts": {
    "schema": {
      "method": "GET",
      "host": "<%= iparam.subdomain %>.freshdesk.com",
      "path": "/api/v2/contacts",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.api_key) %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

###  In `manifest.json`, declare the request template `requestTemplateName` in  `product.<productName>.requests`:
```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "requests": {
        "getContacts": {}
      }
    }
  }
}
```

### Using `requestTemplateName` while invoking the request template in app code:
Invoking `getContacts` in `app.js`.
```js
let response = await client.request.invokeTemplate("getContacts", {});
```

---

>title: Fixing the runtime validation errors with request templates not found.
>tags: request-method, request-template, iparams, requests.json
>context: requests.json, iparams.js, manifest.json
>content:

# Fixing the runtime validation errors with request templates not found

## Runtime validation error when installing the app
```
"Request template not found"
```

## Steps to fix this runtime validation:
1. Verify the request template `requestTemplateName` is defined in `config/requests.json`.
2. Verify if `requestTemplateName` is associated and defined in `manifest.json`.
3. Verify the `requestTemplateName` is correctly used while invoking in the `iparams.js`.

>code:
### Verify the request template `requestTemplateName` is defined in `config/requests.json`.:
While invoking the request template `getContacts` from `iparams.js` or custom iparams page, `domain` or `api key` or any API credentials from iparams should be passed using `context`.
```json
{
  "getContacts": {
    "schema": {
      "method": "GET",
      "host": "<%= context.subdomain %>.freshdesk.com",
      "path": "/api/v2/contacts",
      "headers": {
        "Authorization": "Basic <%= encode(context.api_key) %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

### Verify if `requestTemplateName` is associated and defined in `manifest.json`:
```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "requests": {
        "getContacts": {}
      }
    }
  }
}
```

### Verify the `requestTemplateName` is correctly used while invoking in the `iparams.js`:
```js
let response = await client.request.invokeTemplate("getContacts", {
  context: {
    "subdomain": subdomainValue,
    "api_key": apiKeyValue
  }
});
```
