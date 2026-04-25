## FF-01L — Request templates vs Ajax / fetch / third-party HTTP clients

**Goal:** 
- Client-side code that talks to product or custom APIs must use the **platform Request API** (request templates in `config/requests.json` and `client.request.invoke`), not raw Ajax, `axios`, `fetch()`, or `XMLHttpRequest`, unless there is a documented platform exception.

**Pass:** 
- No disallowed client HTTP patterns in product-facing UI and client bundles (`app/`, `src/`, HTML/JS loaded in the product). **Serverless `server/`** code may use `axios`, `fetch`, etc. for outbound HTTP—do not fail those without checking context. Shared or ambiguous paths: judge by whether the code runs in the client vs server; cite file and line for each finding.

**Fail:** 
- `$.ajax`, `axios` (in client UI), `new XMLHttpRequest`, or `fetch()` used for APIs that should go through request templates—unless clearly justified (e.g. static asset, non-platform URL explicitly allowed).

## FF-07L — OAuth client ID and secrets only in OAuth / secure config

**Goal:** 
- OAuth **client ID**, **client secret**, and long-lived OAuth tokens must appear **only** in intended secure configuration (e.g. `config/oauth_config.json`, `iparams`, encrypted fields, or request template iparam bindings)—**not** in general app JS/HTML.

**Pass:** 
- No OAuth secrets in non-config application source. Ignore obvious placeholders in comments or disabled code only if clearly non-production; otherwise cite and fail.

**Fail:** 
- Client ID/secret/token patterns in `app/**/*.js`, sidebar scripts, etc., outside approved config files.

## FF-02M — SMI must not be used when request templates will suffice

**Goal:** 
- SMI calls should not be used when it can be replaced with `client.request.invokeTemplate()`. If `server.js` only calls `$request.invokeTemplate()` and returns the result (a pass-through), replace with a request template. SMI is justified only when real server-side logic is needed or the host in request template uses template substitution.

**Pass:** 
- The SMI function does more action other than just calling `$request.invokeTemplate()`. NOTE: it is for SMI function only and not for event handlers

**Fail:** 
- The SMI function is just calling `$request.invokeTemplate()`

**Not applicable**

- There is no server.js or request templates in the file

**Fix message**

- SMI function is not required just to invoke a request template with secure iparams

## FF-03A — API secrets must only appear in request headers, not URLs

**Goal:** 
- In `requests.json`, credentials must be in `headers`, never in URL query params like `?api_key=<%=iparam.api_key%>`.

**Pass:** 
- credentials are in headers

**Fail:** 
- credential is in url

**Not applicable**

- There is no request calls made via request template or axios like library

**Fix message**

- Use credential in headers ONLY

## FF-04A — API errors must be handled and reported to users

**Goal:** 
- Every `client.request.invoke()`, `client.request.invokeTemplate()`, `client.db.get()`, `client.db.set()` and other fdk interfaces must have `.catch()` or error callback with a user-facing notification. Empty catch blocks or `console.error` only are not acceptable.

**Pass:** 
- All errors are caught and user-visible messages are shown.

**Fail:** 
- Errors are uncaught with no `catch` block
- User-visible messages are not shown

**Not applicable**

- The api calls are not made

**Fix message**

- Catch the errors and add user visible appropriate error messages


## FF-05A — Pagination must be utilised when the API supports it

**Goal:** 
- List API calls must implement pagination. A single unbounded request to fetch all records is a fail.

**Pass:** 
- All list api calls must implement pagination

**Fail:** 
-  A single unbounded request to fetch all records is a fail.

**Not applicable**

- No List api calls are made

**Fix message**

- Implement pagination for List api calls


## FF-06A — No hardcoded credentials or secrets in source code

**Goal:** 
- No API keys, passwords, or tokens hardcoded in source files. All secrets must come from `client.iparams.get()` or request template iparams. 

**Pass:** 
- All hardcoded secrets are in appsettings.json or `client.iparams.get()` or request template iparams

**Fail:** 
-  Hardcoded secrets are in the source code

**Not applicable**

- No hardcoded secrets

**Fix message**

- Use developer app settings feature for hardcoded secrets

