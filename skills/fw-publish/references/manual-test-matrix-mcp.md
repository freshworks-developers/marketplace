# Manual Test Matrix — MCP Marketplace Tools & Metrics (essentials)

Date: 2026-04-24  
Updated: 2026-04-29 (essentials-only)

**Audience:** QA / PM — **critical paths only** (happy path, blocking failures, zip limits, telemetry/lineage).

**Tools (typical MCP catalog):** `list_custom_apps`, `create_app_upload_url`, `submit_custom_app`, `get_app_status`. **`add_app_version`** — skip until listed in your catalog.

**Scope:** Publish-path MCP behavior, token/auth gates, zip acceptance, operational telemetry, persisted tracking/built-with data.

---

## Phase 1 — smoke (run first)

- [ ] **P1** Presign → **PUT** zip → **`submit_custom_app`** (default **test**) → app appears; **`get_app_status`** and/or **`list_custom_apps`** confirm outcome.
- [ ] **P2** Invalid/missing **API token** → clear failure (no silent hang).
- [ ] **P3** **Zip guard rails:** oversized / empty / non-zip / unsafe archive rejected with actionable message — see **§2**.
- [ ] **P4** **Telemetry:** tool usage counted (success/failure); logs/metrics **do not** expose secrets.
- [ ] **P5** **Lineage:** after publish, backend/portal data shows **tracking id**, **timing**, **built-with / agentic skills** as expected.

---

## 1) Essentials by tool

### Preconditions

- Valid developer **API token** for MCP; test **zip** from `fdk pack`; way to **PUT** to presigned URL.

### `create_app_upload_url`

- [ ] Returns **`uploadId`**, **`uploadUrl`**, expiry; **`PUT`** upload; new presign gives new **`uploadId`**.
- [ ] **Expired** URL or **wrong-account** upload id fails predictably on submit.

### `submit_custom_app`

**Happy path**

- [ ] Valid inputs → **create succeeds**, response includes app/version identifiers; omit **`targetState`** → **test** behavior.

**Failures (sample — one negative pass each area is enough)**

- [ ] **Auth:** missing/invalid token.
- [ ] **Upload:** bad **`uploadId`**, wrong owner, **non-zip / oversize** zip (tie to §2).
- [ ] **Fields:** missing **`appName`** / **`supportEmail`** / **`platformVersion`** / **`modules`**; **platform ≠ v3**; **modules** invalid or **common-only**; bad **`targetState`** if tested.

### `get_app_status`

- [ ] Valid **`appId`** → usable status; invalid/missing id → clear error.

### `list_custom_apps`

- [ ] Returns **`count`** and **`apps`**; empty account OK; each entry includes **`id`**, **`name`**, **`latestVersion`** when present.

### `add_app_version` *(when tool exists)*

- [ ] One happy **test** update; one failure: bad **`appId`** or bad upload (same ideas as submit).

### Idempotency & retries

- [ ] **Same `uploadId`** resubmitted → **replay** (no duplicate app), **`idempotentReplay`** + note.
- [ ] **Transient server errors** on submit → at most **one retry** then stable outcome (no infinite loop).

---

## 2) Zip guard rails (short)

| Topic | Expectation |
|------|-------------|
| **Max package (compressed)** | ~**50 MiB** (env may vary) |
| **Max expanded scan** | ~**500 MiB** total uncompressed during validation |
| **Max entries** | ~**50 000** files (anti-abuse) |
| **Presign lifetime** | ~**15 minutes** |
| **Upload** | **PUT** raw bytes; must be **real zip** (**PK** header); **empty** file rejected |
| **Safety** | No **path tricks** inside zip; **block-list** file types (binaries, nested archives, scripts, secrets — escalate if a legit FDK file is blocked) |

Two validation layers (archive scan + final zip check) should surface **one** clear error to the developer.

---

## 3) Telemetry & downstream data

- [ ] **Counts / dashboards** (or exports): each tool invocation reflected; failures counted; **no tokens in logs/metrics**.
- [ ] **Persisted record:** **tracking id**, **start/end** (or equivalent), **agentic skills / built-with** consistent with submission.

---
