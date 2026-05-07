>title: Configure developer app settings in Platform 3.0
>tags: app-settings, serverless, secrets, marketplace-submission
>context: config/app_settings.json, server/server.js
>content:

# Configure developer app settings in Platform 3.0

Use developer app settings to inject runtime credentials (API keys, tokens, SSH keys) without hardcoding secrets in source files.

---

>title: Why use developer app settings
>tags: app-settings, credentials, security
>context:
>content:

# Why use developer app settings

Developer app settings help you:

1. Keep secrets out of app code.
2. Set credential values at submission time in Developer Portal.
3. Update values later on app details without republishing every time.
4. Apply updated values across versions that use app settings.

---

>title: Implementation checklist
>tags: app-settings, setup-checklist
>context: config/app_settings.json, server/server.js
>content:

# Implementation checklist

To enable app settings, both are mandatory:

1. Create `config/app_settings.json`
2. Add `onSettingsUpdate` in `server/server.js`

If either is missing or invalid, packaging/submission can fail.

---

>title: How to create app_settings.json
>tags: app-settings, configuration
>context: config/app_settings.json
>content:

# How to create app_settings.json

Create `app_settings.json` in the app root `config/` folder.

## Required schema

- File must be a JSON object.
- Each key is a credential name used by the app.
- Each value must be an empty object `{}`.
- Nested JSON objects are not supported.

Example:

```json
{
  "apiKey": {},
  "ssh_key": {},
  "iam_key": {},
  "token": {}
}
```

## Where values are entered

- **Local testing (`fdk run`)**: via local app settings UI.
- **Production**: via **App Settings** tab in Developer Portal submission flow.

## Constraints

1. No fixed key-count limit, but file size must be <= **50 KB**.
2. For already-published apps using app settings:
   - Adding keys is supported.
   - Removing existing keys can cause submission errors for new versions.

## Runtime note

Configured values appear in serverless payload under `app_settings`.

---

>title: How to add onSettingsUpdate handler
>tags: app-settings, serverless, validation
>context: server/server.js
>content:

# How to add onSettingsUpdate handler

`onSettingsUpdate` validates values passed for keys declared in `app_settings.json`.

## What to include

1. Validation logic for incoming settings payload.
2. `renderData()` success/failure response.

Example shape:

```javascript
onSettingsUpdate: function (args) {
  // args contains app settings payload
  // add validation logic here
  console.log('onSettingsUpdate invoked with following data: 
', args);
  renderData();
}
```

## Critical rules

- If `server.js` does not define `onSettingsUpdate`, `fdk pack` throws an error.
- Accessing app settings directly through Request Method in `onSettingsUpdate` is not supported.
- You can read settings from `args` and pass required values as context.
- Request Method templates with app settings are supported in frontend and other serverless functions, but **not** directly in `onSettingsUpdate`.

---

>title: Local test flow for app settings
>tags: app-settings, local-testing, fdk-run
>context: localhost:10001/system_settings, localhost:10001/app_settings
>content:

# Local test flow for app settings

1. Run `fdk run` from app root.
2. Open `http://localhost:10001/system_settings`.
3. Select modules to test.
4. Enter account URL(s) and organization domain.
5. Click **Continue**.
6. Open `http://localhost:10001/app_settings`.
7. Enter values and click **Save**.

Notes:

- Test account URL acts as `currentHost`.
- `currentHost.subscribed_modules`, `currentHost.org_domain`, and `currentHost.endpoint_urls` are derived from selected context.
- `org_domain` is available in `currentHost` on installation/app-settings pages.

---

>title: Agent guardrails and anti-patterns
>tags: app-settings, agent-guidance, security
>context: app generation, review, refactor
>content:

# Agent guardrails and anti-patterns

## Do

- Treat app setting keys as sensitive by default.
- Use stable key names (`api_key`, `client_secret`, `token`).
- Validate requiredness/format in `onSettingsUpdate`.
- Document expected keys in app README/submission notes.

## Do not

- Hardcode credential literals in source files.
- Use nested objects in `app_settings.json`.
- Remove existing published keys without migration planning.
- Assume Request Method direct app-settings access works inside `onSettingsUpdate`.

---

>title: Troubleshooting developer app settings
>tags: app-settings, troubleshooting, fdk-pack
>context: config/app_settings.json, server/server.js
>content:

# Troubleshooting developer app settings

## Symptom: `fdk pack` fails with app settings / handler error

- Verify `server/server.js` includes `onSettingsUpdate`.

## Symptom: local app settings page does not appear

- Verify `config/app_settings.json` exists and is valid JSON.

## Symptom: submission fails after changing keys

- Check whether previously published keys were removed.

## Symptom: Request Method behavior fails in `onSettingsUpdate`

- Use `args` payload values and pass context explicitly; avoid unsupported direct access pattern in this handler.
