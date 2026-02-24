>title: what are Installation parameters and how to retrieve them
>tags: iparams, installation-parameters
>context: iparams.json, iparams.html, iparams.js
>content:

# what are Installation parameters and how to retrieve them
Installation parameters (iparams) are values defined and accepted during app installation, which can be securely stored and retrieved using platform methods. They serve various purposes, including:

1. Storing API Credentials like keys, endpoints, and domains.
2. Defining the app's flow and branching logic.
3. Supporting different types and methods for customization.
4. Validating input using regular expressions without extra logic.

In a Freshworks app, you can use `client.iparams.get()` to retrieve all non-secure iparams. For a specific iparam, you can use `client.iparams.get(iparam_key)`. This allows easy access to the required iparam values.

---

>title: How to invoke request template from custom installation page
>tags: request-method, iparams, api
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