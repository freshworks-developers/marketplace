>title: What is Server Method Invocation or SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# What is Server Method Invocation or SMI
The Server Method Invocation (SMI) feature allows you to create an app with a front-end component that can invoke a serverless component from the backend. The SMI could use different capablities of external libraries, working with Key Value store or Entity Storage, and even create and manage schedules.

## Considerations while working with SMI:
1. SMI has a rate limit of 50 triggers per minute and also extended on a case-by-case basis with Dev Assist ticket.
2. The payload limit for SMI should not exceed 100KB.
3. SMI supports timeout of 20 seconds as default and supports increased timeout of 25 seconds, 30 seconds.

---

>title: how to configure server method invocation or smi?
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# How to configure Server Method Invocation or SMI

1. Modify `manifest.json` and specify the method to invoke the serverless component.
2. Modify `app.js` and specify the method to invoke the serverless component.
3. In `server.js`, define the SMI called from the front-end component.

## Modify `manifest.json` and specify the method to invoke the serverless component

- If an unregistered function is invoked from `app.js`, `fdk run` or `fdk validate` commands display "Requested function not found or registered" error.
- Use the `functions.[serverMethodName].timeout` attribute to set a function-based app execution timeout value in seconds (valid options: 20, 25, 30).
- If the SMI function does not respond within the specified time, the app execution timeout message is displayed.
- Providing an invalid timeout value shows the message "Timeout should be one of the allowed values."

## Modify `app.js` and specify the method to invoke the serverless component

- Define the JSON payload passed to the method in the `server.js` file.
- Use `client.request.invoke("serverMethodName", JSON_payload)` to invoke the serverless component.
- Include functions to handle the response from the serverless component.

## In `server.js`, define the SMI called from the front-end component

- Place the app logic inside `server.js`.
- The SMI function name is case-sensitive and can be alphanumeric ([a-z], [A-Z], [0-9]) with underscores ( _ ). It must not start with a number, contain spaces, and be 2 to 40 characters long.
- Use the `renderData(error, data)` method to return a response.
- If the server method does not return a response, the app execution timeout error occurs.

---

>title: Syntax of how to configure an SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Syntax of how to configure an SMI
1. Modify `manifest.json` as to specify method to invoke serverless component.
2. Modify `app.js` as to specify method to invoke serverless component.
3. In `server.js` define the SMI that is called from the front-end component.

## Modify `manifest.json` as to specify method to invoke serverless component
>code:
```json
"functions": {
  "serverMethod1": {
    "timeout": 10
  },
  "serverMethod2": {
    "timeout": 15
  }
}
```

## Modify `app.js` as to specify method to invoke serverless component
>code:
```js
function someFunction() {
    try {
        let data = await client.request.invoke("serverMethod", options);
        // data.response is the response object from the serverless method.
    } catch (err) {
        // err is a json object with requestID, status, and message.
        // The error object contains the status and message attributes err.status and err.message
    }
}
```
## In `server.js` define the SMI that is called from the front-end component
>code:
```js
exports = {
    // These functions can be declared in the client side as well
    serverMethod: async function (options) {
        // app logic resides here
        renderData(null,  { "key": "value" });
    }
};
```

---

>title: Syntax of JSON payload for SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Syntax of JSON payload for SMI
1. `app.js` sending the payload while `client.request.invoke()`.
2. JSON payload recieved by the function defined in `server.js`.

## `app.js` sending the payload while `client.request.invoke()`
>code:
```js
let data = await client.request.invoke("serverMethod", {
  "url": "https://api.github.com/users/sample"
});
```

## JSON payload recieved by the function defined in `server.js`
>code:
```json
{
    "url": "https://api.github.com/users/sample",
    "iparams": {
      "<iparam1>": "<value1>",
      "<iparam2>": "<value2>"
    }
}
```

---

---

>title: limitations with smi when invoked from custom installation page
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Limitations with SMI when invoked from custom installation page

1. SMIs invoked from custom installating page has restrictions with key-value store or entity storage access (`$db`) and access to schedule events (`$schedule`) as this is availabe only post installation of the app.
2. SMIs have a payload restriction of 100 KB.
3. SMIs have a rate limit of 50 triggers per minute but can be increased on a case-by-case basis via Dev Assist. 
4. The default app execution timeout is 20 seconds. If the request timeout is increased to 20, 25, or 30 seconds, the app execution timeout is extended to 40 seconds.
5. SMI logs for functions invoked from custom installation page are not available as logs are available post install.

---

>title: How to return errors from SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# How to return errors from SMI
1. Use `renderData()` in the function to return responses.
2. For error messages, define a valid error `status` and `message` when returning error messages.

## Sample code to return error
>code:
```js
exports = {
 serverMethod:  function(options) {
   var error = { status: 403, message: "Error while processing the request" };
   renderData(error);
 }
}
```

---

>title: How to return success response from SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# How to return success response from SMI
1. Use `renderData()` in the function to return responses.
2. The first parameter for `renderData()` is `null` for success followed by the object with response.

## Sample code to success response from SMI
>code:
```js
exports = {
 serverMethod:  function(options) {
   // app logic resides here
   renderData(null,  { "key": "value" });
 }
}
```

---

>title: SMI use-cases
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# SMI use-cases
1. Using third-party or external libraries with npm.
2. HTTP requests that require a secure serverless environment with longer timeouts and processing time.
3. Leveraging secure serverless runtime for working with sensitive data - credentials, API keys or JWT token generation.
4. In end-user apps, SMIs are used for making API invocations.

---

>title: Using third-party or npm libraries with SMI
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Using third-party or npm libraries with SMI

1. Mention the npm pacakages as dependencies in `manifest.json`.

Declaring `axios` npm package as a dependency in `manifest.json`.
>code:
```json
"dependencies": {
  "axios": "1.7.5"
}
```

2. Use `fdk run` to locally install the dependencies and test the app
To install the npm dependencies, run `fdk run`.

3. Import the package in `server.js` and invoke the functions from the package
In `server.js` first import the package and use it across the serverless environment.

>code:

```js
import axios from 'axios'

exports = {
  serverMethod: async function(options) {
    const data = {
      x: 1,
      arr: [1, 2, 3],
      arr2: [1, [2], 3],
      users: [{name: 'Peter', surname: 'Griffin'}, {name: 'Thomas', surname: 'Anderson'}],
    };
    let response = await axios.postForm('https://postman-echo.com/post', data,
      {headers: {'content-type': 'application/x-www-form-urlencoded'}}
    );
    renderData(null, response);
 }
}
```

---

>title: Adding logs to SMI functions
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Adding logs to SMI functions
1. The developer platform supports usage of `console.log`, `console.info` or `console.error` to add logs in `server.js`.
2. Whenever the `console` statements are executed, the logs would be available in your Freshworks instance or termimal if it's running the app locally.

---

>title: Viewing SMI logs in your Freshworks account
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Viewing SMI logs in your Freshworks account
1. Navigate to the `Manage Apps > Custom Apps` page and click Settings, next to the app whose logs you want to view.
2. From the menu displayed, select `View Log`. The `Configuration` page is displayed. Under the `Logs` tab, the log messages are displayed.

---

>title: Viewing SMI logs locally during app development
>tags: serverless-offerings, smi
>context: server.js, manifest.json, app.js
>content:

# Viewing SMI logs locally during app development
1. To test the app and locally run, use `fdk run`.
2. From the front-end app, trigger actions that invoke SMI function. If the SMI function includes `console.log` or `console.info` or `console.error`, as and when the statement is executed the logs would appear in the terminal running the app.

---

>title: Using SMI to invoke APIs in end-user apps
>tags: serverless-offerings, smi, end-user-app, visitor-app
>context: server.js, manifest.json, app.js
>content:

# Using SMI to invoke APIs in end-user apps

## In an end-user app/ visitor app, define the SMI functions in `server.js`
>code:
```js
exports = {
 serverMethod: async function(options) {
   renderData(null,  { "key": "value" });
 }
}
```

## Invoke the request template in `server.js`
>code:
```js
exports = {
 serverMethod: async function(options) {
  let response = await $request.invokeTemplate("SampleAPI", {
    "context": {
      "domain": options.domain
      "apiKey": options.apiKey
    }
  })
  renderData(null,  { "key": "value" });
 }
}
```

## Declare the SMI function in `manifest.json`
>code:
```json
"functions": {
  "serverMethod": {}
}
```

## Invoke the SMI function from `app.js`
>code:
```js
let APIResponse = await client.request.invoke("serverMethod",{
  "domain": "sample.freshdesk.com",
  "apiKey": "aPiKeYvAuLe"
})
```

---

>title: Server Method Invocation (SMI) Example in fdk
>tags: serverless, smi
>context: server.js, manifest.json, app.js
>content:

The SMI feature enables interaction between front-end (app.js) and serverless/server-side components (server.js), allowing for efficient app functionality.

We define a server method in server.js which app.js invokes.

### Here's a concise example how Server Method Invocation (SMI) is used with the following snippets

`manifest.json` with the declaration of the method to be invoke the serverless component i.e (server.js) code:
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {},
      "events": {},
      "requests": {},
      "functions": {
        "bookmarkTicket": {"timeout": 10},
        "serverMethodName2": {"timeout": 15}
      }
    }
  }
}
```

This is how `app.js` uses the definition to invoke the server side (server.js):

```js
// Invoking the SMI
function bookmarkTicket() {
    getCurrentTicket().then(ticket => {
        const data = {
            'agentId': loggedInUser.id,
            'ticketId': ticket.id,
            'ticketSubject': ticket.subject
        };
        client.request.invoke("bookmarkTicket", data)
            .then(data => console.log(data))
            .catch(err => console.error(err));
    });
}

// Getting the current ticket
function getCurrentTicket() {
    return client.data.get("ticket")
        .then(data => data.ticket)
        .catch(error => {
            // Handle error
        });
}
```

This is how the the SMI is declared in `server.js` file:

```js
exports = {
    // SMI for bookmarking a ticket
    bookmarkTicket: async function (request) {
        try {
            const saveTicketResponse = await saveTicketInDb(request.agentId, request.ticketId, request.ticketSubject);
            renderData(null, saveTicketResponse);
        } catch (error) {
            renderData(error, null);
        }
    }
};

// Save ticket in the database
async function saveTicketInDb(agentId, ticketId, ticketSubject) {
    return $db.update("agentId: " + agentId, "append", { savedTickets: [{ 'ticketId': ticketId, 'ticketSubject': ticketSubject }] });
}
```

This is what SMI function declared in server.js recieves Sample JSON request Payload:
```json
{
  "url": "https://api.github.com/users/sample",
  "iparams": {
    "<iparam1>": "<value1>",
    "<iparam2>": "<value2>"
  }
}
```

Yes it has iparams as part of the payload, so that it can utilized.

---

>title: alternative to defining Routes in `manifest.json` (Platform 2.3)
>tags: smi, serverless
>context: server.js, manifest.json, app.js
>content:

# Alternative to Defining Routes in `manifest.json` (Platform 2.3)

Instead of explicitly defining HTTP routes in `manifest.json`, **Server Method Invocation (SMI)** is recommended. You declare a function in `manifest.json` → implement it in `server.js` → invoke it from `app.js` using `client.request.invoke`. This approach:

1. Removes Custom Routes – No need to maintain route definitions in the manifest.
2. Keeps Logic Server-Side – Sensitive API keys and code stay in `server.js`.
3. Simplifies Front-End – The client calls `invoke("functionName", payload)`; the server does the rest.

Example

```json
{
  "platform-version": "2.3",
  "product": {
    "freshdesk": {
      "functions": {
        "postRequestHandler": {}
      }
    }
  }
}
```

>title: Server Method Invocation (SMI) Example in fdk
>tags: serverless, smi
>context: server.js, manifest.json, app.js
>content:

The SMI feature enables interaction between front-end (app.js) and serverless/server-side components (server.js), allowing for efficient app functionality.

We define a server method in server.js which app.js invokes.

### Here's a concise example how Server Method Invocation (SMI) is used with the following snippets

**`manifest.json` with the declaration of the method to be invoke the serverless component i.e (server.js) code:**
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {},
      "events": {},
      "requests": {},
      "functions": {
        "bookmarkTicket": {"timeout": 10},
        "serverMethodName2": {"timeout": 15}
      }
    }
  }
}
```

This is how `app.js` uses the definition to invoke the server side (server.js):
```js
// Invoking the SMI
function bookmarkTicket() {
    getCurrentTicket().then(ticket => {
        const data = {
            'agentId': loggedInUser.id,
            'ticketId': ticket.id,
            'ticketSubject': ticket.subject
        };
        client.request.invoke("bookmarkTicket", data)
            .then(data => console.log(data))
            .catch(err => console.error(err));
    });
}

// Getting the current ticket
function getCurrentTicket() {
    return client.data.get("ticket")
        .then(data => data.ticket)
        .catch(error => {
            // Handle error
        });
}
```

This is how the the SMI is declared in `server.js` file:
```js
exports = {
    // SMI for bookmarking a ticket
    bookmarkTicket: async function (request) {
        try {
            const saveTicketResponse = await saveTicketInDb(request.agentId, request.ticketId, request.ticketSubject);
            renderData(null, saveTicketResponse);
        } catch (error) {
            renderData(error, null);
        }
    }
};

// Save ticket in the database
async function saveTicketInDb(agentId, ticketId, ticketSubject) {
    return $db.update("agentId: " + agentId, "append", { savedTickets: [{ 'ticketId': ticketId, 'ticketSubject': ticketSubject }] });
}
```

This is what SMI function declared in server.js recieves Sample JSON request Payload:
```json
{
  "url": "https://api.github.com/users/sample",
  "iparams": {
    "<iparam1>": "<value1>",
    "<iparam2>": "<value2>"
  }
}
```

Yes it has iparams as part of the payload, so that it can utilized.

---

>title: what is the 50 triggers per minute rate limit and how can I handle large payloads?
>tags: serverless-offerings, smi, limitations
>context: server.js, manifest.json, app.js
>content:

# What is the 50 triggers per minute rate limit and how can I handle large payloads?

1. **Rate limit**: Each serverless component can be triggered up to 50 times per minute. If your front-end calls `client.request.invoke()` more frequently than that, additional calls may fail or get throttled.
2. **Payload size**: The payload passed in `client.request.invoke()` (including `iparams`) must be under **100 KB**.
3. **Recommended approach**:
   - Use batching or chunking if you need to send large volumes of data.
   - Throttle front-end calls if the user might repeatedly click an action or if automated triggers risk exceeding 50 requests per minute.
   - Offload bulk operations to external systems or scheduled events if necessary.

---

>title: How do I debug or test my SMI functions locally?
>tags: serverless-offerings, smi, local-testing
>context: server.js, manifest.json, app.js
>content:

# How do I debug or test my SMI functions locally?

1. **`fdk run`**: Start the local server with `fdk run` in your app directory.  
2. **System Settings**: Open `http://localhost:10001/system_settings`. If your app uses product modules, specify your test account domain (e.g., `https://mydomain.freshdesk.com`).  
3. **Custom Configs**: If your app has iparams, they appear at `http://localhost:10001/custom_configs`.  
4. **Simulate SMI**: In your front-end, ensure you append `?dev=true` to your product URL so the local version of your app loads. Then, perform the action that triggers `client.request.invoke()`.  
5. **Logs**: Check your terminal or console logs for debugging messages from serverless code. Errors, success responses, or timeouts appear here.

---

>title: What is the default timeout for an SMI function, and how can I change it?
>tags: serverless-offerings, smi, timeout
>context: server.js, manifest.json, app.js
>content:

# What is the default timeout for an SMI function, and how can I change it?

When you declare a Server Method Invocation (SMI) function in your `manifest.json`, if you do **not** specify a custom `timeout`, the default **5-second** timeout applies. This means if the serverless code in `server.js` does not call `renderData(...)` before 5 seconds elapse, the function terminates and the app receives a timeout error.

## Specifying a custom timeout

You can adjust this timeout in the `manifest.json` by providing a `timeout` value (valid options are **5**, **10**, **15**, or **20** seconds). For example:

```json
"functions": {
  "myLongRunningTask": {
    "timeout": 10
  }
}
```

In this case, `myLongRunningTask` has up to 10 seconds to complete before the invocation times out.

## Best practices

1. Always call renderData(...): Ensure that every code path in your function either calls renderData(null, responseData) for success or renderData(errorObject) for failure. This prevents hanging or partial completions.
2. Choose an appropriate value: If your server-side logic needs extra processing (like multiple external API calls), pick a higher timeout (like 10 or 15 seconds) but be mindful not to block too long.
3. Handle potential long tasks externally: If you anticipate tasks that could exceed 20 seconds, consider using an external queue or scheduling system, or returning partial results while a separate process completes the long-running job.

---