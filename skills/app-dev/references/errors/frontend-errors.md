>title: app is not defined
>tags: frontend-errors
>context: manifest.json, app.js
>content:  

# App is not defined

Developers may encounter a random "App is not defined" JavaScript error, causing the app’s content not to load properly.

## Solution

Modify the document.onreadystatechange function in app.js to ensure the app initializes only after the document is fully loaded. For example, check for document.readyState === "complete" before invoking app.initialized()
---

>title: require is not defined
>tags: frontend-errors
>context: manifest.json, app.js
>content:  

# Require is not defined

Using Axios in frontend applications leads to a "require is not defined" error because frontend environments don’t support Node.js modules.

Instead of directly using Axios, consider one of these approaches:

1. Include Axios via a CDN in the manifest.json or directly in index.html.
2. Use the Freshworks Request Method for API calls to avoid importing external modules.
3. Implement serverless functions to handle complex requests that the frontend can’t directly perform.

---

>title: cors errors when making api requests
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# CORS errors when making API requests

CORS errors occur when a web application attempts to access a resource on a different domain without proper permissions.

## Solution

1. Utilize Freshworks Request Methods, which route API calls through the platform and avoid CORS restrictions.
2. Ensure that all domains you communicate with are listed in the manifest.json file under whitelisted-domains.

---

>title: validation errors during app submission
>tags: frontend-error
>context: manifest.json, app.js
>content:  

# Validation errors during app submission

Validation errors can arise when the fdk validate command or the submission form fields are not correctly filled out.

## Solution

1. Run the fdk validate command before submission. If any errors or warnings appear, resolve them.
2. Double-check that all mandatory fields in the submission form are completed.

---

>title: handling exceptions in serverless apps
>tags: frontend-error
>context: manifest.json, app.js
>content:

# Handling exceptions in serverless apps

Uncaught exceptions from $request invocations can lead to runtime errors in serverless apps.

Always handle both success and failure callbacks when using $request. Ensure that both response and error conditions are accounted for in the logic to avoid uncaught exceptions
---

>title: apps cannot access user-overridden theme preferences
>tags: frontend-error
>context: manifest.json, app.js
>content:

# Apps cannot access user-overridden theme preferences (light/dark mode)

## Solution

This is a pending feature request

1. Currently, Freshservice SDK does not expose theme settings.
2. Developers must rely on system preferences (e.g., @media (prefers-color-scheme: dark)).

---
>title: request payload too large
>tags: frontend-errors
>context: manifest.json, app.js
>code:

# Fixing Request Payload Too Large Error

The application encounters a "413 Request Entity Too Large" error when sending oversized payloads. Even after switching to Axios for requests, payloads exceed the allowable size limit.

## Solution

To address this issue, modify the frontend to send only a unique identifier (such as a ticket ID) instead of the full payload. Use the backend to retrieve additional data by making an API call once the identifier is received.

1. In `App.js`, use `client.data.get()` to send only the identifier (e.g., ticket ID) to the server.
```js
client.data.get('ticketID').then(data => client.request.post({ url: '/fetchDetails', body: JSON.stringify({ ticketID: data.ticketID }) });
```
2. In Server.js use serverless functions to fetch full data with `client.request.get()` or `client.request.post()`
```js
"exports = { fetchDetails: async (payload) => { const response = await client.request.get(`/api/tickets/${payload.ticketID}`); return response; } };"
```
3. Implement retry logic to handle rate limits.
4. Ensure serverless functions complete within stipulated time to avoid timeout errors.

---
>title: apps or customer apps are not loading
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# Apps or Custom Apps are Not Loading

App Itself Not Loading: Check the `/installation` API response in the product to ensure the app is correctly installed and activated. Verify the `manifest.json` for errors and ensure all required modules are defined.

Inside App Content Not Loading: If the app loads but the content doesn’t, contact the app developer to debug issues in the app’s logic or API calls
---

>title: app initialization failure
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# App Initialization Failures

- Error: `app.initialized()` hangs or fails to execute.
- Cause: Race conditions where the DOM is not fully loaded before initialization.
- Solution: Use `document.onreadystatechange` or `app.activated` to ensure the DOM is ready.

---
>title: cors or cross origin resource sharing error
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# CORS (Cross-Origin Resource Sharing) Errors

- Error: API requests blocked due to CORS restrictions.
- Cause: Attempting to call external APIs directly from the frontend.
- Solution: Use `client.request` methods or serverless events to bypass CORS.

---

>title: linting and validation
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# Linting and Validation Errors

- Error: `fdk validate` fails due to linting issues (e.g., `eval()`, `alert()`).
- Cause: Use of restricted JavaScript methods or improper manifest configurations.

- Solution: Replace restricted methods with platform-compliant alternatives (e.g., `client.interface.trigger("showNotify")`).

---

>title: app is not defined
>tags: frontend-errors
>context: manifest.json, app.js
>content:  

# App is not defined

Developers may encounter a random "App is not defined" JavaScript error, causing the app’s content not to load properly.

## Solution

Modify the document.onreadystatechange function in app.js to ensure the app initializes only after the document is fully loaded. For example, check for document.readyState === "complete" before invoking app.initialized()
---

>title: require is not defined
>tags: frontend-errors
>context: manifest.json, app.js
>content:  

# Require is not defined

Using Axios in frontend applications leads to a "require is not defined" error because frontend environments don’t support Node.js modules.

Instead of directly using Axios, consider one of these approaches:

1. Include Axios via a CDN in the manifest.json or directly in index.html.
2. Use the Freshworks Request Method for API calls to avoid importing external modules.
3. Implement serverless functions to handle complex requests that the frontend can’t directly perform.

---

>title: cors errors when making api requests
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# CORS errors when making API requests

CORS errors occur when a web application attempts to access a resource on a different domain without proper permissions.

## Solution

1. Utilize Freshworks Request Methods, which route API calls through the platform and avoid CORS restrictions.
2. Ensure that all domains you communicate with are listed in the manifest.json file under whitelisted-domains.

---

>title: validation errors during app submission
>tags: frontend-error
>context: manifest.json, app.js
>content:  

# Validation errors during app submission

Validation errors can arise when the fdk validate command or the submission form fields are not correctly filled out.

## Solution

1. Run the fdk validate command before submission. If any errors or warnings appear, resolve them.
2. Double-check that all mandatory fields in the submission form are completed.

---

>title: handling exceptions in serverless apps
>tags: frontend-error
>context: manifest.json, app.js
>content:

# Handling exceptions in serverless apps

Uncaught exceptions from $request invocations can lead to runtime errors in serverless apps.

Always handle both success and failure callbacks when using $request. Ensure that both response and error conditions are accounted for in the logic to avoid uncaught exceptions
---

>title: apps cannot access user-overridden theme preferences
>tags: frontend-error
>context: manifest.json, app.js
>content:

# Apps cannot access user-overridden theme preferences (light/dark mode)

## Solution

This is a pending feature request

1. Currently, Freshservice SDK does not expose theme settings.
2. Developers must rely on system preferences (e.g., @media (prefers-color-scheme: dark)).

---
>title: request payload too large
>tags: frontend-errors
>context: manifest.json, app.js
>code:

# Fixing Request Payload Too Large Error

The application encounters a "413 Request Entity Too Large" error when sending oversized payloads. Even after switching to Axios for requests, payloads exceed the allowable size limit.

## Solution

To address this issue, modify the frontend to send only a unique identifier (such as a ticket ID) instead of the full payload. Use the backend to retrieve additional data by making an API call once the identifier is received.

1. In `App.js`, use `client.data.get()` to send only the identifier (e.g., ticket ID) to the server.
```js
client.data.get('ticketID').then(data => client.request.post({ url: '/fetchDetails', body: JSON.stringify({ ticketID: data.ticketID }) });
```
2. In Server.js use serverless functions to fetch full data with `client.request.get()` or `client.request.post()`
```js
"exports = { fetchDetails: async (payload) => { const response = await client.request.get(`/api/tickets/${payload.ticketID}`); return response; } };"
```
3. Implement retry logic to handle rate limits.
4. Ensure serverless functions complete within stipulated time to avoid timeout errors.

---
>title: apps or customer apps are not loading
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# Apps or Custom Apps are Not Loading

App Itself Not Loading: Check the `/installation` API response in the product to ensure the app is correctly installed and activated. Verify the `manifest.json` for errors and ensure all required modules are defined.

Inside App Content Not Loading: If the app loads but the content doesn’t, contact the app developer to debug issues in the app’s logic or API calls
---

>title: app initialization failure
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# App Initialization Failures

- Error: `app.initialized()` hangs or fails to execute.
- Cause: Race conditions where the DOM is not fully loaded before initialization.
- Solution: Use `document.onreadystatechange` or `app.activated` to ensure the DOM is ready.

---
>title: cors or cross origin resource sharing error
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# CORS (Cross-Origin Resource Sharing) Errors

- Error: API requests blocked due to CORS restrictions.
- Cause: Attempting to call external APIs directly from the frontend.
- Solution: Use `client.request` methods or serverless events to bypass CORS.

---

>title: linting and validation
>tags: frontend-errors
>context: manifest.json, app.js
>content:

# Linting and Validation Errors

- Error: `fdk validate` fails due to linting issues (e.g., `eval()`, `alert()`).
- Cause: Use of restricted JavaScript methods or improper manifest configurations.

- Solution: Replace restricted methods with platform-compliant alternatives (e.g., `client.interface.trigger("showNotify")`).
