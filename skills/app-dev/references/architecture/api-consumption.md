>title: how to consume external api in freshworks app
>tags: api, external-api, request method, request API
>context: requests.json, manifest.json, app.js, server.js
>content:

# How to consume external api in freshworks app
1. Update `index.html` file to add the below script.
2. Add request template in `config/requests.json`.
3. Declare request template in the `manifest.json`.
4. Invoke the request template to make API call.
  - From frontend application use `client.request.invokeTemplate()` method from your `app.js` file
  - From serverless application use `$request.invokeTemplate()` method from your `server.js` file


## Update `index.html` file to add the below script.
```html
<script src="{{{appclient}}}"></script>
```

## Add request template in `config/requests.json`

```json
{
  "sampleTemplate": {
    "schema": {
    "protocol": "https",
    "method": "GET",
    "host": "northstar.freshchat.com",
    "path": "/api/v2/conversations/{conversation_id}/messages",
    "headers": {
        "Authorization": "Bearer <%=iparam.apikey %>",
        "Content-Type": "application/json"
      }
    }
  }
}
```
## Declare request template in the `manifest.json`

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
        "sampleTemplate":{}
      }
    }
  }
}
```

## Update `app.js` file to call template with `client.request.invokeTemplate` from frontend:

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

## To invoke request template for serverless apps, use `$request.invokeTemplate` in the `server.js` file:

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