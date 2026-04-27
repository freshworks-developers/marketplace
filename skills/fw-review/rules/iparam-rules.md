# Installation parameters (iparams) — Platform 3.0

For every **Fail**, cite file path and line (or block) and give a concrete fix.

**Scope:** Installation-time configuration only: default iparams (`config/iparams.json` or `config/iparams.yaml`), custom settings UI (`config/iparams.html`, `config/assets/iparams.js` and related assets under `config/`), and **consistency** with `manifest.json` and `server/server.js` where iparams affect install lifecycle. Do not re-audit unrelated app UI or server logic beyond what is needed to judge iparams correctness.

**Discovery order:** Read `manifest.json` first, then detect whether the app uses default iparams (JSON) or custom HTML/JS. Do not assume both exist.

## IP-04A — Protocol must not be accepted in domain or host fields

**Goal:** 
- Values meant to be hostnames must not treat `http://` or `https://` as valid input; validation should reject or normalize user input. It should have only the hostname and NOT the protocol.

**Inspect**

- Default iparams: any field whose name or description indicates domain, host, URL base, or endpoint host — check for `"regex"` or documented validation.
- Custom iparams JS: validation for domain/host inputs (string checks, regex, or trim + reject).

**Pass**

- Explicit validation rejects or strips `http://` and `https://` (and ideally leading/trailing whitespace) for host/domain fields, **or** the field is not a domain/host type (N/A for that field only — rule still applies if any domain field exists).
- Hints/placeholders reinforce host-only format (e.g. `api.example.com` not `https://api.example.com`).

**Fail**

- Domain/host accepts full URLs with scheme with no normalization.
- Regex or validation explicitly allows `://` in a field that should be host-only.

**Not applicable**

- No domain, host, or base-URL hostname fields exist in iparams or custom UI.

**Fix messages**

- Add validation: reject if `/^https?:\/\//i.test(value)` or strip scheme after trim and validate remainder is a sensible host.
- Align hint text with validation behavior.

## IP-05A — Thorough validation of all installation inputs

**Goal:** 
- Every install-time field is required when it should be, constrained by type or pattern where needed

**Inspect**

- `config/iparams.json` — `required`, `type`, `regex`, `secure`, choices for dropdowns.
- `config/iparams.html` + `config/assets/iparams.js` — client-side validation before `postConfigs` / save.
- `manifest.json` — `modules.common.events` includes `onAppInstall` when the app uses non-empty iparams that need validation at install (Platform 3.0 expectation).
- `server/server.js` — presence of `onAppInstallHandler` when `onAppInstall` is declared; handler may validate `args.iparams` (do not fail solely for missing handler if events are absent and iparams are empty).

**Pass**

- Mutually exclusive configuration: **either** default JSON iparams **or** custom `iparams.html` + assets — not both defining conflicting UIs.
- Required user input has `"required": true` (default iparams) or equivalent enforcement in custom JS before submit.
- Text fields that need format checks (email, URL path, numeric IDs, domains) have `regex` or custom validation.
- Sensitive fields use `secure: true` where appropriate.
- If `oauth_config.json` exists, `oauth_iparams` fields are defined with types and required flags as needed.
- If iparams are non-empty and install validation is implied, `onAppInstall` + handler exist and align.

**Fail**

- Both `iparams.json` (non-empty) and custom `iparams.html` present without clear single source of truth.
- Required fields missing `required: true` or no submit-time validation in custom UI.
- Format-sensitive fields with no regex and no JS validation.
- Declared `onAppInstall` in manifest but no implementation, or non-empty iparams with no install path when validation is clearly needed.

**Not applicable**

- Only empty `{}` iparams and no custom UI — minimal checks; still verify no duplicate config modes.

**Fix messages**

- Add `required`, `regex`, or custom validation; add `onAppInstall` + `onAppInstallHandler` when install-time validation is required.

## IP-06A — Helpful, specific validation error messages

**Goal:** 
- When validation fails, the admin sees what went wrong and how to fix it — not generic errors.

**Inspect**

- Default iparams: `"error"` strings next to `regex` and any validation metadata.
- Custom iparams JS: user-visible messages on validation failure (toast, inline, or `postConfigs` error handling).

**Pass**

- Each regex or custom validation has a specific `error` message (default iparams) or branches in JS with clear messages (custom UI).
- Messages mention the expected format (e.g. "Enter hostname without http://", "Expected a positive integer").
- Copy quality: `display_name`, `description`, `hint` text is free of confusing typos for user-facing strings (minor typos in internal names are lower priority than misleading help text).

**Fail**

- Generic messages only: "Invalid", "Invalid value", "Error" with no guidance.
- Regex present but no matching `error` string in default iparams.
- Custom UI: silent failure or only `console.error` with no user feedback.

**Not applicable**

- No validation rules exist (rare); if so, result may be N/A only if there is nothing to validate — prefer Pass if simple optional fields have no regex.

**Fix messages**

- Add descriptive `error` for each `regex`; in JS, surface `fwNotify` or inline errors with actionable text.