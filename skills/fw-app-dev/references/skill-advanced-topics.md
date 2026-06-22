# fw-app-dev – Advanced topics (progressive disclosure)

Load this file **on demand** when the task needs: full Platform 2.x rejection tables, deep OAuth/iparams setup, extended validation checklists, reference index, product module tables, install commands, or test-pattern lists. The primary skill entry point remains [`SKILL.md`](../SKILL.md).

**FDK / Node installs:** **fw-app-dev** does not install **`fdk`** or **Node**; use **`fw-setup`** (or prompt the user to add that skill). See [`SKILL.md`](../SKILL.md) → *FDK / Node.js toolchain — not provided by fw-app-dev*.

---

## Forbidden Patterns – Platform 2.x immediate rejection

**Never generate these patterns – ZERO TOLERANCE:**

**Manifest (2.x):**
- [INVALID] `"platform-version": "2.3"` / `"2.2"` / `"2.1"` → [VALID] `"3.0"`
- [INVALID] `"product": { "freshdesk": {} }` → [VALID] `"modules": { "common": {}, "support_ticket": {} }`
- [INVALID] `"whitelisted-domains": ["https://..."]` → [VALID] Request templates in `config/requests.json`

**Request API (2.x):**
- [INVALID] `$request.post|get|put|delete(...)` → [VALID] `$request.invokeTemplate('templateName', {})`

**OAuth (2.x):**
- [INVALID] OAuth without `integrations` → [VALID] `{ "integrations": { "service": { ... } } }`
- [INVALID] OAuth credentials in `config/iparams.json` → [VALID] `oauth_iparams` in `oauth_config.json`

**Other:**
- Plain HTML form controls → Crayons (`fw-*`)
- Product locations in `common` → correct product module
- Scheduled events in manifest → `$schedule.create()`
- Helpers before `exports` → after `exports`
- `async` without `await` → add `await` or drop `async`
- Unused params → remove (not `_args`)

**Reference:** `rules/freshworks-platform3.mdc`

---

## OAuth vs API key and OAuth + iparams

### When to use OAuth vs API key

**OAuth when:** Service requires OAuth (GitHub, Jira, Salesforce, Google APIs), user authorizes account, or act-on-behalf-of-user.

**API key when:** Webhook URL, static token, simple REST key, no OAuth flow.

**Default:** Prefer API key in iparams unless the service requires OAuth.

### OAuth + iparams (full checklist)

**References:** `references/architecture/oauth-configuration-latest.md`, `references/api/oauth-docs.md`

| Field | Required | Location | Example |
|-------|----------|----------|---------|
| `display_name` | YES | Integration root | `"GitHub"` |
| `token_type` | YES | Integration root | `"account"` or `"agent"` |
| `client_id` / `client_secret` | YES | Integration root | `<%= oauth_iparams.client_id %>` |
| `authorize_url` / `token_url` | YES | Integration root | HTTPS URLs |
| `description` | YES | Each `oauth_iparam` field | Human-readable |

**Three files:** `config/oauth_config.json` (integrations + `oauth_iparams`), `config/iparams.json` (non-OAuth settings only), `config/requests.json` with `<%= access_token %>` and `"options": { "oauth": "service_name" }`.

**Rules:** Never put client secret in `iparams.json`; never omit `token_type`, `display_name`, or per-field `description` in `oauth_iparams`.

**Secure iparams:** Any param matching api_key, token, secret, password, etc. needs `"secure": true`.

**Lifecycle:** Non-empty `iparams.json` → `onAppInstall` + handler; scheduled/webhook cleanup → `onAppUninstall` + handler.

---

## Progressive disclosure – when to load references

### Architecture & modules
- Modular concepts → `references/architecture/modular_app_concepts.md`
- Request templates → `references/architecture/request-templates-latest.md`
- OAuth → `references/architecture/oauth-configuration-latest.md`
- Broader set → `references/architecture/*.md`

### Runtime & APIs
- SMI → `references/api/server-method-invocation-docs.md`
- External requests → `references/api/request-method-docs.md`
- Request templates with **Object Store file refs**, limits, and **ProxyMS / EKS** context → `references/api/request-template-file-uploads-proxyms-infrastructure-kb.md`
- OAuth flows → `references/api/oauth-docs.md`
- Interface / instance → `references/api/interface-method-docs.md`, `instance-method-docs.md`
- Iparams → `references/runtime/iparams-comparison.md`, `custom-iparams-docs.md`
- Storage → `references/runtime/keyvalue-store-docs.md`
- Jobs / schedules → `references/runtime/jobs-docs.md`
- Actions → `references/runtime/actions-docs.md`

### UI
- Crayons per component → `references/ui/crayons-docs/{component}.md`
- CDN (ESM + nomodule) as in `SKILL.md`

### Errors
- `references/errors/error-catalog.md`, `request-method-errors.md`, `oauth-errors.md`, `frontend-errors.md`, `server-method-invocation-errors.md`, `installation-parameters-errors.md`, `custom-iparams-errors.md`, `keyvalue-store-errors.md`

### Manifest & CLI
- `references/manifest/manifest-docs.md`, `references/cli/cli-docs.md`, `references/cli/fdk_create.md`

---

## Extended validation and error prevention

### Universal pre-generation checklist (full)

1. Platform 3.0 only – no `product`, no `whitelisted-domains`
2. `icon.svg` for frontend apps
3. Iparams: `iparams.json` OR custom iparams – not both
4. FQDN hosts; path `/...`; `<%= %>` not `{{}}`
5. OAuth: `integrations` + `oauth_iparams`
6. Crayons CDN in HTML
7. Async only with `await`; helpers after `exports`
8. Schedules via `$schedule.create()`, not manifest
9. Product module present
10. Location placement (common vs product module)
11. `$request.invokeTemplate` only
12. SMI/events + `renderData` per `rules/async-patterns.mdc`

### Security checklist (numbered)

16. No command injection (`eval`, `executeCommand`, etc.)
17. SMI args validated
18. No logging `args.iparams` / full `args`
19. XSS-safe DOM updates
20. No secrets in ticket notes / visible UI

### Universal error-prevention (detailed)

Covers mandatory frontend files, request templates, OAuth structure, code quality, security, manifest placement (`full_page_app` in `common`, `ticket_sidebar` in `support_ticket`, etc.), UI (`fwClick`), JSON single-object rules, autofix steps. **Mirror:** `rules/validation-workflow.mdc`.

### Pre-finalization autofix (iterations)

Run `fdk validate` automatically; fix JSON, templates, icon, FQDN, manifest, OAuth, lint (async, params, complexity); up to six iterations. **Mirror:** `rules/validation-workflow.mdc`.

### Common JSON errors

Multiple top-level `{ } { }` → merge into one object with commas (see error-catalog).

---

## Product module and location quick reference

**Freshdesk:** `support_ticket`, `support_contact`, `support_company`, `support_agent`, `support_email`, `support_portal`

**Freshservice:** `service_ticket`, `service_asset`, `service_change`, `service_user`

**Freshsales:** `deal`, `contact`, `account` / `sales_account`, `lead`, `appointment`, `task`, `product`, `cpq_document`, `phone`

**Freshcaller:** `call`, `caller_agent`, `notification`

**Freshchat:** `chat_conversation`, `chat_user`

**Common locations:** `full_page_app`, `cti_global_sidebar` → `modules.common.location`

**Product locations:** e.g. Freshdesk `support_ticket`: `ticket_sidebar`, `ticket_requester_info`, `ticket_top_navigation`, `ticket_background`, etc. **Full tables:** `rules/platform3-modules-locations.mdc`

| User intent | Module | Notes |
|-------------|--------|--------|
| Freshdesk ticket UI | `support_ticket` | sidebar / background |
| Freshservice ticket | `service_ticket` | sidebar / new ticket |
| Freshservice asset | `service_asset` | asset_sidebar |
| Freshsales deal | `deal` | deal entity UI |

---

## Skill installation (optional)

```bash
npx @freshworks/fw-dev-tools install
```

See the [marketplace README](https://github.com/freshworks-developers/fw-dev-tools#readme) for full install options (`--tools cursor|claude|codex`).

---

## Test-driven validation

- **Refusal:** `references/tests/refusal.json` – never emit these
- **Golden patterns:** `references/tests/golden.json` – preferred patterns to follow
- **Security refusal/violation details:** `rules/security.mdc`
