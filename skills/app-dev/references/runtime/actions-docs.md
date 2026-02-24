>title: Overview of actions
>tags: actions
>context: actions.json, server.js
>content:

# Overview of actions

FDK introduces "Actions," a powerful feature that allows developers to extend and customize automation flows within Freshworks products. Actions enable both custom and public apps to integrate additional business logic, empowering workflows to perform advanced, app-driven tasks beyond the platform's default capabilities. This feature is available for both custom and public apps.

Actions can be defined as the following:

1. **Concept**: A declared function catalog exposed via actions.json where each action has a name, input JSON Schema, and response schema. A backend callback with the SAME name executes the action and returns data via a standard render method.
2. **Why**: Makes tool/function calling predictable for UIs, assistants, and automations that can introspect actions, validate inputs, and handle typed responses.
3. **How**: Actions are triggered by apps (events, workflow automator).
4. **Consumption**: Typically used to run business logic when a platform event or automation requires it.
5. **Where**: Defined in actions.json, the invocation would happen from the flow consuming the actions.json specifications.
6. **Invocation**: 
  - Events auto-invoke handler (e.g., onTicketCreate)
  - Calling the action configured in the flow

---

>title: What are the products that currently support Actions?
>tags: actions
>context: actions.json, server.js
>content:

# What are the products that currently support actions?

1. Freshdesk
2. Freshchat
3. Freshworks CRM
4. Freshcaller

---

>title: How to configure actions
>tags: actions
>context: actions.json, server.js
>content:

# How to configure actions

1. Modify `actions.json` and specify the function name and parameters to invoke the action flow.
2. In `server.js`, define the method called from the front-end component.

## Modify `actions.json` and specify the function name to invoke the action flow

- Define the JSON payload passed to the method in the `server.js` file.
- Include functions to handle the response from the serverless component.

## In `server.js`, define the actionmethod called from the front-end component

- Place the app logic inside `server.js`.
- The `functionCallBackName` object contains the function definition.<functionCallBackName> acts as the key that identifies the corresponding callback method defined in server.js. 
- The function name is case-sensitive and can be alphanumeric ([a-z], [A-Z], [0-9]) with underscores ( _ ). It must not start with a number, contain spaces, and be 2 to 40 characters long.
- Use the `renderData(error, data)` method to return a response.
---

>title: Action attributes
>tags: actions
>context: actions.json, server.js
>content:

# Action attributes

You can define the function by using the following attributes.

1. `display_name` - *string* : Function name that is defined in actions.js file.
2. `parameters` - *object* : Definition of the attributes that form the input payload to the callback method in server.js.
The FDK enables defining different types of input attributes and fetching their values dynamically when the configured automations are run. For this, the parameters object should be defined in the actions.json file.
- The following are the child attributes of parameters
 - `$schema` - *string* : JSON schema applicable to the input payload.
 - `type` - *string* : Data type of the input payload. Should be a valid type in the specified JSON schema.
 - `properties` - *object* : Attributes that form the input payload.  The type of input payload that is sent to server.js. For example, the `subject` of the support ticket or the `email` of the requester.
 - `required` -*array of strings* : All mandatory attributes in the input payload.
3. `response` - *object* : Definition of the attributes that form the response from the callback method in server.js.
`response.type` specifies the data type in which the response is returned to the product (Freshdesk or Freshcaller, etc.).
4. `description` - *string* : Meaningful description that states the purpose of the function.

---

>title: Schema for actions
>tags: actions.json, custom-actions, schema
>context: actions.json
>content:

# Schema for actions

```json
{
  "<functionCallbackName>": {
    "display_name": "<display name>",
    "parameters": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "<input_attribute1>": {
          "type": "string",
          "description": "<message string>"
        },
        "<input_attribute2>": {
          "type": "string",
          "description": "<message string>"
        }
      },
      "required": [
        "<input_attribute1>",
        "<input_attribute2>"
      ]
    },
    "response": {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "type": "object",
      "properties": {
        "<response_variable1>": {
          "type": "string",
          "description": "<message string>"
        },
        "<response_variable2>": {
          "type": "string",
          "description": "<message string>"
        }
      },
      "required": [
        "<response_variable1>"
      ]
    },
    "description": "<message string>"
  },
  "<anotherFunctionCallbackName>": {},
  "<yetAnotherFunctionCallbackName>": {}
}
```

---


>title: How to implement an action defined in actions.json
>tags: server.js, callbacks, schema
>context: server.js
>content:

# How to implement an action defined in actions.json

In `server.js`, define the callback method (action) that is defined in `actions.json` and called from the app flow. In this callback method, include the app logic that runs based on the payload passed and the `renderData()` method to return success and failure responses.

Attributes:

1. **request / args**
  - Source: Matches the `parameters` object defined in `actions.json`.
  - Typically includes the `input` value.

2. **renderData(error, data)**
   - Purpose: Sends the callback's output back to the UI or next action.
   - **error**: JSON object with `status` and `message`. Pass `null` for success.
   - **data**:
     - **response**: String used in ACTIONS decisions.

## Schema

Ensure that the action name is the same as the `functionCallBackName` in `actions.json`.

```js
exports = {
  <functionCallbackName>: function(args) {
    //implementation code
    //if success
    renderData(null, {data: {response,"response_variables": {}}});
    //if error
    renderData(error);
  }
}
```

---

>title: Callback response using renderData(error, data)
>tags: server.js, callbacks, schema
>context: server.js
>content:

# Callback response using renderData(error, data)

In the app logic, to send a response back, use the `renderData(error, data)` method. Ensure that the first argument of `renderData(error, data)` is always the `error` object.

## Success as a response

For success responses, ensure to pass `null` as the first argument.

```js
 renderData(null, {
   data:{
     response: response.body,
     "response_variables":
       {
         "variable1": "<variable value>",
         "variable2": "<variable value>"
       }
     }
  });
```

## Error as a response

`error` is an object with status and message attributes. For example, to send an error message, use the `renderData()` method as follows:

```js
exports = {
    serverMethod:  function(options) {
      var error = { status: 403, message: "Error while processing the request" };
      renderData(error);
    }
  }
```

### Handling response data in renderData(error, data)

`data` is an object with `response` attribute.
`response`: For which actions can be configured to send a response.

```js
exports={
 getTicketStatus: async function (payload) {
    try {
      console.log('Received payload');
      let { response } = await $request.invokeTemplate(
        'getTicketStatusRequest',
        {
          context: {
            ticketId: payload.ticketId
          }
        }
      );
      response = JSON.parse(response);
      console.log('Successfully fetched ticket status');
    }
 }
}
```
---

>title: Testing Callback Methods in server.js
>tags: server.js, callback-method
>context: server.js
>content:

# Testing Callback Methods in server.js

1. Use the latest version of Chrome for testing.
2. Ensure sample payload JSON files are in `<app root>/server/test_data`.
3. In the terminal, navigate to the app directory and run:

   ```bash
   fdk run
   ```

4. In the browser, open `https://localhost:10001/web/test`.
5. From **Select type**, choose `actions`.
6. In **Select an action**, choose the custom action to simulate.
7. The payload will display — edit if needed to test other scenarios.
8. Click **Simulate**:
   - **Success**: Simulation worked.
   - **Failed**: Invalid payload — fix and retry.

---
