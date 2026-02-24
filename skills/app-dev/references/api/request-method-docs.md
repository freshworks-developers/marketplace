>title: What are Request method or request templates in Freshworks apps
>tags: request-method, request, http, api, fetch, connect, endpoint
>context: requests.json, app.js
>content:

# What are Request method or request templates in Freshworks apps

Request method is a secure way for apps to make API requests to third-party services without exposing sensitive information like API keys or user credentials. It ensures protection against potential interception of such data by app users. When integrating with applications using REST API endpoints, request method is used to perform CRUD (create, read, update, delete) operations.

>code:
## Using request method in app code
```js
try {
  let result = await client.request.invokeTemplate(
    "requestTemplateName", {});
  let responseInJSON = JSON.parse(result.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---

>title: what are Request method considerations
>tags: request-method, request, http, api, fetch, connect, endpoint
>context: requests.json
>content:

# What are Request method considerations

1. Request method with app templates is supported on FDK version 9.0.0 or later and platform version 2.3 or later.
2. The default request timeout is `15 seconds` with the support of `20 seconds`, `25 seconds` and `30 seconds`.
3. For local testing of apps using the request method, you can specify a custom timeout.
4. The rate limit for requests is 50 requests per minute per app per account, with the possibility of increasing it through the Dev Assist channel.
5. When invoking API requests with the schema, you can pass `context`, `body`, `cache`, and `ttl` attributes as arguments.
6. `config/requests.json` supports upto 100 request template definitions.
7. Request method uses static IP by default.
8. Request method supports the request size maximum limit of 6291456 (6MB) and response size maximum limit of 6291456 (6MB).

---

>title: how to configure request template in requests.json
>tags: request-method, http, api, configure
>context: requests.json
>code:

# How to configure request template in requests.json
Here's the request template schema added to the `config/requests.json` file:

```json
{
  "requestTemplateName1": {
    "schema": {
      "protocol": "protocol",
      "method": "method",
      "host": "subdomain.host.com",
      "path": "/api/path",
      "headers": {}
    },
    "options": {
      "maxAttempts": 0,
      "retryDelay": 1000
    }
  },
  "requestTemplateName2": {
    "schema": {},
    "options": {}
  }
}
```

`requestTemplateName1` defines the request template which would be invoked from the app. The template name should contain alphanumeric characters, underscore and hypen.

## `config/requests.json` attributes for each request template

The request `schema` contains attributes such as `protocol`, `method`, `host`, `path`, `headers`, and `query` for the request. Additionally, the request `options` allow you to specify additional attributes like `maxAttempts`, `retryDelay` etc.

- `protocol`: If specified, the value must be HTTPS. You can use HTTP during local testing of the app. Ensure that the app submitted for review does not contain a protocol value of HTTP.
- `method`: A required attribute with the valid values - `GET`, `POST`, `PUT`, `DELETE` and `PATCH`.
- `host`: A required attribute which is an absolute domain name of the domain to which the app sends the HTTP request. Must not be an IP address; must be a Fully Qualified Domain Name. Ensure not to specify the protocol nor to append a trailing slash as part of the host value. This value can be substituted with installation parameters (iparams) or context for installation page requests and Serverless.
- `path`: Path to the resource on the host domain. Ensure to construct the path with a leading slash. Default value is `/` if no path is specified.
- `headers`: A valid HTTP headers (such as Authorization, Content-Type, and so on) and the corresponding values, specified as key-value pairs of `<header-name>:<header-value>`. 
  - The supported `Content-Type` headers are `application/json`, `application/xml`, `text/html`, `text/xml`, `application/jsonp`, `text/plain`, `text/javascript` and `application/vnd.api+json`.
  - Authorization headers value can be substituted with secure and non-secure installation parameters (iparams) or context for installation page requests and Serverless.

Additionally, the request `options` allow you to specify additional attributes like `maxAttempts` and `retryDelay`.
- `maxAttempts` - Maximum number of times that a request can be resent if a network or 429/5xx HTTP error occurs. The default value is `1` and valid options ranges from minimum value `1` to maximum value `5`.
- `retryDelay` - Time in milliseconds after which a request can be resent. The default value is `0` and valid values are multiple of `100` upto maximum `1500`. 

---

>title: How to invoke request template from front-end
>tags: request-method, http, api, configure
>context: index.html, app.js, requests.json
>code:

# How to invoke request template from front-end
Update `index.html` and `app.js` file as below to call template from frontend

For front-end, update the `index.html` to include the app client.
```html
<script src="{{{appclient}}}"></script>
```
And in `app.js`, update the code to invoke request template

```js
try {
  let workspace = await client.request.invokeTemplate(
    "asanaGetWorkspace", {});
  let workspaceJSON = JSON.parse(workspace.response);
  // rest of the app logic
} catch (err) {
  // handle error
}

```

---

>title: How to make API call by invoking request method in Serverless
>tags: request-method, http, api, configure
>context: requests.json, server.js
>code:

# How to make API call by invoking request method in Serverless

To invoke request template in a serverless app, use `$request.invokeTemplate("TemplateName", {})` in the `server.js` file:

## To invoke request template for serverless apps, add this code to the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    let ticket = payload.data.ticket
    try {
        await $request.invokeTemplate("replyTicket", {
            context: {},
            body: JSON.stringify(payload)
        });
    } catch (error) {
      // handle error
    }
  }
}
```

---

>title: How to invoke request template from custom installation page
>tags: request-method, http, api, configure
>context: iparam.html, iparams.js, requests.json
>code:

# How to invoke request template from custom installation page:
1. Define the request template in `config/requests.json` with content substitution
2. Update `iparams.html` and `iparams.js` for custom installation page

## Define the request template in `config/requests.json` with content substitution
```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "<%=context.domain %>",
    "path": "/api/v2/conversations/",
    "headers": {
        "Authorization": "Bearer <%=context.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```
## Update `iparams.html` and `iparams.js` for custom installation page:

Update `iparams.html` and `iparams.js` file as below to call template from custom installation page

For front-end, update the `iparams.html` to include the app client.
```html
<script src="{{{appclient}}}"></script>
```
And in `iparams.js`, update the code to invoke request template with context variable for `domain` and `apiKey`.
```js
try {
  let workspace = await client.request.invokeTemplate(
    "sampleTemplate", {
      "context": {
        "domain": "abc.freshdesk.com",
        "apikey": "apiKeyValue"
      }
    });
  let workspaceJSON = JSON.parse(workspace.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---

>title: How to make API call by invoking request method in Serverless
>tags: request-method, http, api, configure
>context: requests.json, server.js
>code:

# How to make API call by invoking request method in Serverless

To invoke request template in a serverless app, use `$request.invokeTemplate("TemplateName", {})` in the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    let ticket = payload.data.ticket
    try {
        await $request.invokeTemplate("replyTicket", {
            context: {},
            body: JSON.stringify(payload)
        });
    } catch (error) {
      // handle error
    }
  }
}
```

---

>title: Making api call with request method using authentication
>tags: request-method, http, api, auth
>context: requests.json, app.js
>code:

# Making api call with request method using authentication
1. Update `config/requests.json` file
2. Update `app.js` file to make api call with request template using `client.request.invokeTemplate` from frontend


## Update `config/requests.json` file:

```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations/1234/messages",
    "headers": {
        "Authorization": "Bearer <%=iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Update `app.js` file to make api call with request template using `client.request.invokeTemplate` from frontend:

```js
try {
  let sampleTemplateResponse = await client.request.invokeTemplate(
    "sampleTemplate", {});
  let responseJSON = JSON.parse(sampleTemplateResponse.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: Making api call with request method using authentication in a serverless
>tags: request-method, http, api, auth
>context: requests.json, server.js
>code:

# Making api call with request method using authentication in a serverless
1. Update `config/requests.json` file
2. Invoke request template using `$request.invokeTemplate` in the `server.js` file

## Update `config/requests.json` file

```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations/1234/messages",
    "headers": {
        "Authorization": "Bearer <%=iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Invoke request template using `$request.invokeTemplate` in the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    try {
        await $request.invokeTemplate("sampleTemplate", {
            context: {conversation_id: payload.conversation_id}
        })
    } catch (error) {
      // handle error
    }
  }
}
```

---

>title: Making api call with request without using authentication
>tags: request-method, http, api, auth
>context: requests.json, app.js
>code:

# Making api call with request without using authentication
1. Update `config/requests.json` file
2. Update `app.js` file to make api call using request template with `client.request.invokeTemplate` from frontend

## Update `config/requests.json` file:
```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations/1234/messages"
    }
  }
}
```

## Update `app.js` file to make api call using request template with `client.request.invokeTemplate` from frontend:

```js
try {
  let sampleTemplateResponse = await client.request.invokeTemplate(
    "sampleTemplate", {context: {conversation_id: payload.conversation_id}});
  let responseJSON = JSON.parse(sampleTemplateResponse.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: Making api call with request method without using authentication in a serverless app
>tags: request-method, http, api, auth
>context: requests.json, server.js
>code:

# Making api call with request method without using authentication in a serverless app
1. Update `config/requests.json` file
2. Invoke request template using `$request.invokeTemplate` in the `server.js` file

## Update `config/requests.json` file:

```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations/1234/messages"
    }
  }
}
```

## Invoke request template using `$request.invokeTemplate` in the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    try {
        await $request.invokeTemplate("sampleTemplate", {
            context: {conversation_id: payload.conversation_id},
        })
    } catch (error) {
      // handle error
    }
  }
}
```

---
>title: Example of making api call with request method using query parameters
>tags: request-method, http, api, auth
>context: requests.json, app.js
>code:

# Example of making api call with request method using query parameters
1. Update `config/requests.json` file
2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend

## Update `config/requests.json` file

```json
  {
    "sampleTemplate": {
      "schema": {
        "protocol": "https",
        "method": "GET",
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

2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:

```js
try {
  let result = await client.request.invokeTemplate("sampleTemplate", { context: {page: 1} });
  let responseJSON = JSON.parse(result.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: Example of making api call with request method using query parameters in a serverless app
>tags: request-method, http, api, auth
>context: requests.json, server.js
>code:

# Example of making api call with request method using query parameters in a serverless app

1. Update `config/requests.json` file
2. To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

## Update `config/requests.json` file:

  ```json
  {
    "sampleTemplate": {
      "schema": {
        "protocol": "https",
        "method": "GET",
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

## To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    try {
      let result = await $request.invokeTemplate("sampleTemplate", { context: {page: 1} });
      let responseJSON = JSON.parse(result.response);
      // rest of the app logic
    } catch (error) {
      // handle error
    }
  }
}
```

---
>title: Example of sending an api request using request body
>tags: request-method, http, api, auth
>context: requests.json, app.js
>code:

# Example of sending an api request using request body
1. Update `config/requests.json` file
2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend

## Update `config/requests.json` file
  ```json
  {
    "sampleTemplate": {
      "schema": {
        "protocol": "https",
        "method": "GET",
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

## Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:

```js
const body = {
  "channel_name": "abcd"
}

try {
  let sampleTemplateResponse = await client.request.invokeTemplate(
    "sampleTemplate", {
      context: {conversation_id: payload.conversation_id},
      body: JSON.stringify(body)
      });
  let responseJSON = JSON.parse(sampleTemplateResponse.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: Example of sending an api request using request body in a serverless app
>tags: request-method, http, api, auth
>context: requests.json, server.js
>code:

# Example of sending an api request using request body in a serverless app
1. Update `config/requests.json` file:
2. To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:


## Update `config/requests.json` file:
  ```json
  {
    "sampleTemplate": {
      "schema": {
        "protocol": "https",
        "method": "GET",
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

## To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

```js
exports = {
  onTicketCreateCallback: async function (payload) {
    const body = {
      "channel_name": "abcd"
    }

    try {
      await $request.invokeTemplate("sampleTemplate", {
        context: {conversation_id: payload.conversation_id},
        body: JSON.stringify(body)
      });
      // rest of the app logic
    } catch (error) {
      // handle error
    }
  }
}
```

---
>title: Example of making a POST API call with request method using authentication
>tags: request-method, http, api, auth
>context: requests.json, app.js
>code:

# Example of making a POST API call with request method using authentication
1. Update `config/requests.json` file:
2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:

## Update `config/requests.json` file:

```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "POST",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations",
    "headers": {
        "Authorization": "Bearer <%=iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:

```js
try {
  let result = await client.request.invokeTemplate(
    "sampleTemplate", {});
  let responseJSON = JSON.parse(result.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: example of making a POST API call with request method using authentication in a serverless app
>tags: request-method, http, api, auth
>context: requests.json, server.js
>code:

# Example of making a POST API call with request method using authentication in a serverless app
1. Update `config/requests.json` file:
2. Invoke request template using `$request.invokeTemplate` in the `server.js` file:

## Update `config/requests.json` file:
```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "POST",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations",
    "headers": {
        "Authorization": "Bearer <%=iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

## Invoke request template using `$request.invokeTemplate` in the `server.js` file:

```js
try {
  let result = await $request.invokeTemplate(
    "sampleTemplate", {});
  let responseJSON = JSON.parse(result.response);
  // rest of the app logic
} catch (err) {
  // handle error
}
```

---
>title: Example of resending a request if any error occurs
>tags: request-method, http, api, auth
>context: requests.json, app.js, server.js
>content:

# Example of resending a request if any error occurs
1. Update `config/requests.json` file
2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:
3. To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

## Update `config/requests.json` file
```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "POST",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations"
    },
    "options": {
      "maxAttempts": 3
    }
  }
}
```

## Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:
## To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

---
>title: Example of setting time interval to resend a request
>tags: request-method, http, api, auth
>context: requests.json, app.js, server.js
>code:

# Example of setting time interval to resend a request
1. Update `config/requests.json` file
2. Update `app.js` file to call template with `client.request.invokeTemplate` from frontend
3. To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file

## Update `config/requests.json` file
```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "POST",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations"
    },
    "options": {
    "retryDelay": 1200
    }
  }
}
```

## Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:
## To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file

---

>title: Support of context substitution in request templates
>tags: request-method, http, api, context
>context: requests.json
>content:

# Support of context substitution in request templates
Context variable substitution in request templates is supported only in -
1. `schema.host`: When the values are from installation page and in Serverless apps.
2. `schema.path`: Supported in all templates.
3. `schema.header`: Supported in installation page and Serverless apps.
4. `schema.query`: Supported in all templates.

--- 

>title: Support of installation parameters (iparams) substitution in request templates
>tags: request-method, http, api, context
>context: requests.json
>content:

# Support of installation parameters (iparams) substitution in request templates
Installation parameters (iparams) variable substitution in request templates is supported only in -
1. `schema.host`: Only non-secure values from the front-end or serverless apps after successful installation.
2. `schema.path`: Only non-secure values from the front-end or serverless apps after successful installation.
3. `schema.header`: Both secure and non-secure values from the front-end or serverless apps after successful installation.
4. `schema.query`: Only non-secure values from the front-end or serverless apps after successful installation.

## Sample request template with iparams substitution

The below request template uses non-secure value in `schema.host` and secure value in `schema.headers.Authorization`.
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

---

>title: What has changed with request method from platform version 2.2 and before to platform version 2.3 and later?
>tags: request-method, http, api, context
>context: requests.json, manifest.json
>content:

# What has changed with request method from platform version 2.2 and before to platform version 2.3 and later?

1. In platform version 2.3 and later, `requests.json` is introduced to define the snapshots of the request. 
2. `request.post()`, `request.get()` methods are deprecated for both front-end and serverless, and `request.invokeTemplate()` has been introduced to invoke the defined template.
And `fdk run` or `fdk validate` results in the following error:
```
post is no longer supported in Request API
get is no longer supported in Request API
```
3. `whitelisted_domains` has been deprecated from platform version 2.3 and later. While migrating the apps from platform version 2.2 to higher, remove the `whitelisted_domains` from `manifest.json`. If the app's `manifest.json` contains `whitelisted_domains`, `fdk run` or `fdk validate` results in the following error:
```
"whitelisted-domains" has been deprecated
```
4. In `manifest.json`, the request template has to be defined.
  - In platform version 2.3, request template has to defined in `product.<productName>.requests`.
  - In platform version 3.0 and later, request template has to be defined in common module - `common.requests`.
5. In front-end HTML, use `<script src="{{{appclient}}}"></script>` to import client JS resource instead of `<script src="https://static.freshdev.io/fdk/2.0/assets/fresh_client.js"></script>`.

---

>title: How to use Authorization headers with encoded values
>tags: request-method, http, api, authorization
>context: requests.json
>content:

# How to use Authorization headers with encoded values
The HTTP endpoints which requires API keys to be encoded, the request method with substitutions supports `encode()` which enables encoding secure iparams in `requestTemplateName.schema.headers.Authorization` along with value substituted from installation parameters or context. `encode()` method is used to create a Base64 encoded ASCII string. This helps when parameters like `headers.Authorization` requires the API keys to be encoded, for instance, when using Freshdesk Product APIs, the authentication is a Basic token where the `APIKEY:X` is required to be Base64-encoded.

## Sample `config/requests.json` with `encode()`:
```json
{
  "listAllTickets": {
    "schema": {
      "protocol": "https",
      "method": "GET",
      "host": "<%= iparam.subdomain %>.freshdesk.com",
      "path": "/api/v2/tickets",
      "headers": {
        "Authorization": "Basic <%= encode(iparam.api_key) %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```

---

>title: List the allowed IPs from which request method would be invoked and can be added to allow-list on the third party systems
>tags: request-method, http, api, authorization
>context: requests.json
>content:

# List the allowed IPs from which request method would be invoked and can be added to allow-list on the third party systems
To enable third party systems to authorize requests from specific IP addresses, request method use the below IP addresses in multiple regions that can be used by third party systems to allow-list IPs.
1. United States region allowed IPs - 	18.233.117.211 and 35.168.222.30
2. Germany/Europe-Central region allowed IPs - 18.197.138.225 and 52.57.69.21
3. India region allowed IPs - 13.232.159.149 and 13.233.170.242
4. Australia region allowed IPs - 13.211.182.225 and 52.63.187.64
5. United Arab Emirates region allowed IPs - 3.29.180.34 and 51.112.23.180
6. United Kingdom/Europe-West allowed IPs - 18.169.146.42 and 13.42.232.164

---

>title: Whitelisted domain in the platform versions 2.3 and later
>tags: request-method, whitelisted-domains
>context: manifest.json
>content:

# Whitelisted domain in the platform versions 2.3 and later

In platform version 2.3 and later, the support for whitelisting domains and specifying them in `manifest.json` has been deprecated instead the snapshot of the request is defined in the `config/request.json`.
If you are migrating apps from platform version 2.2 and below, remove `whitelisted_domains` from `manifest.json`.

---