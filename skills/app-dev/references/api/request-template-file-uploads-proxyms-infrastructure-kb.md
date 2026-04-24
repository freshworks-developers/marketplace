>title: Request templates — secure file uploads via Object Store (overview)
>tags: request-templates, object-store, file-upload, multipart, octet-stream, fdk-10, platform-3
>context: requests.json, manifest.json, invokeTemplate
>content:

# Request templates — secure file uploads via Object Store (overview)

Platform enhancements add **secure file handling** to request templates: apps reference files already stored in the **Freshworks Object Store** (by identifier), instead of passing raw file bytes through the app request path. Those references are resolved server-side; streams are forwarded to third-party APIs using **`multipart/form-data`** or **`application/octet-stream`**.

**FDK v10.0.1 / v10.1.0** introduces the request-template syntax for declaring file parts.

**Critical product constraint:** File upload via request templates is **not supported on Freshdesk**, because **object storage is not available** in that product. Design Freshdesk integrations without this pattern.

**Canonical Platform 3.0 patterns:** `references/architecture/request-templates-latest.md`, `references/api/request-method-docs.md`.

**Declare and invoke:** Each template key in **`config/requests.json`** must be declared under **`modules.common.requests`** in **`manifest.json`**. Call **`$request.invokeTemplate(name, { context: { … } })`** (server) or **`client.request.invokeTemplate(name, { context: { … } })`** (frontend); **`name`** must match both files. Optional **`body`**, **`cache` / `ttl`**, and **`options`** (e.g. OAuth) follow **`request-method-docs.md`**.

---

>title: File upload using request template (object store reference)
>tags: request-method, http, multipart, octet-stream, object-store, invokeTemplate
>context: requests.json, manifest.json
>content:

# File upload using request template (object store reference)

From **FDK 10.0.1** onward, the request template schema supports additional syntax so you can attach files stored in **object storage** and send them to third-party APIs via **`client.request.invokeTemplate()`** / **`$request.invokeTemplate()`**.

- Upload files to object storage and obtain each file’s **reference identifier** (for example by listing files per object storage documentation).
- In the template, reference that identifier with the **`ref`** attribute. At runtime the platform resolves the reference and streams the file into the outbound HTTP request.
- **`multipart/form-data`** — up to **5** files per request, under **`formData.files`**, each field mapping to an object with **`"ref": "<%= context.yourRef %>"`**.
- **`application/octet-stream`** — **one** file per request, using a top-level **`"file": { "ref": "<%= context.file_ref %>" }`** alongside the appropriate **`Content-Type`** header.

**Notes:**

- Every **`ref`** must point to a file already present in object storage before the template runs.
- **Freshdesk** does not offer object storage for this flow, so file upload via request template using object store reference identifiers is **not** supported there.

For secure outbound HTTP calls from apps, see the developer documentation for the request method on Platform 3.x.

---

>title: Example request template for multipart file upload with refs
>tags: request-method, multipart, formData, files, object-store
>context: requests.json
>code:

# Example request template for multipart file upload with refs

```json
{
  "uploadImages": {
    "schema": {
      "method": "POST",
      "path": "/upload",
      "headers": {
        "Content-Type": "multipart/form-data"
      },
      "formData": {
        "fields": {
          "userId": "<%= context.user_id %>"
        },
        "files": {
          "image1": {
            "ref": "<%= context.ref1 %>"
          },
          "image2": {
            "ref": "<%= context.ref2 %>"
          }
        }
      }
    }
  }
}
```

---

>title: Example request template for application/octet-stream file upload with ref
>tags: request-method, octet-stream, file, object-store
>context: requests.json
>code:

# Example request template for application/octet-stream file upload with ref

```json
{
  "uploadRaw": {
    "schema": {
      "method": "PUT",
      "path": "/upload/raw",
      "headers": {
        "Content-Type": "application/octet-stream"
      },
      "file": {
        "ref": "<%= context.file_ref %>"
      }
    }
  }
}
```

---

>title: Request templates — supported content types for file uploads
>tags: request-templates, multipart, form-data, application/octet-stream, file-upload
>context: requests.json
>content:

# Request templates — supported content types for file uploads

| Mode | Use case | Configuration |
|------|----------|----------------|
| **`multipart/form-data`** | One or multiple files per outbound request | Under **`formData`**: `fields` for non-file parts; **`files`** object with **`ref`** per file key |
| **`application/octet-stream`** | Exactly **one** file per outbound request | Under **`file`**: **`ref`** for the single file |

Default cap is **5 files** per multipart template invocation; the ceiling can be raised with the **`FDK_MAX_PER_REQUEST`** environment variable for local/tooling (e.g. **`FDK_MAX_PER_REQUEST=6`** … **`FDK_MAX_PER_REQUEST=40`**). See the limits section below.

---

>title: Request templates — multipart file upload schema example
>tags: request-templates, multipart, formData, context, requests.json
>context: requests.json
>code:

# Request templates — multipart file upload schema example

Files must already exist in the Object Store; the template receives **reference identifiers** (for example via **`context`**) resolved at invoke time.

```json
{
  "uploadWithImages": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/upload",
      "headers": {
        "Content-Type": "multipart/form-data"
      },
      "formData": {
        "fields": {
          "userId": "<%= context.user_id %>"
        },
        "files": {
          "image1": { "ref": "<%= context.ref1 %>" },
          "image2": { "ref": "<%= context.ref2 %>" }
        }
      }
    }
  }
}
```

Pass matching **`context`** keys (for example `ref1`, `ref2`, `user_id`) when calling **`$request.invokeTemplate()`** (server) or **`client.request.invokeTemplate()`** (frontend), per your app flow.

---

>title: Request templates — application/octet-stream single file
>tags: request-templates, octet-stream, file, ref, requests.json
>context: requests.json
>code:

# Request templates — application/octet-stream single file

For a single binary body derived from one stored file, define the file reference on the **`file`** object (not `formData.files`). Use **`POST`** or **`PUT`** (and **`path`** / headers) as required by the third-party API.

```json
{
  "uploadBinary": {
    "schema": {
      "protocol": "https",
      "method": "POST",
      "host": "api.example.com",
      "path": "/v1/blob",
      "headers": {
        "Content-Type": "application/octet-stream"
      },
      "file": {
        "ref": "<%= context.fileRef %>"
      }
    }
  }
}
```

Use a real **FQDN** for **`host`** (often **`<%= iparam.domain %>`**-style substitution); placeholders above are illustrative. Confirm the **`file`** / **`formData`** shape against **`fdk validate`** for your FDK 10.x line.

---

>title: Request templates — file upload limits, FDK_MAX_PER_REQUEST, and Freshdesk
>tags: request-templates, limits, fdk-10, freshdesk, object-store
>context: requests.json, environment
>content:

# Request templates — file upload limits, FDK_MAX_PER_REQUEST, and Freshdesk

1. **Multipart file count:** Default **5** files per request template. Raise the cap with **`FDK_MAX_PER_REQUEST`** (integer **> 5** through **40**), e.g. **`export FDK_MAX_PER_REQUEST=6`** for six files, or **`FDK_MAX_PER_REQUEST=40`** at the supported maximum. Applies to **local FDK / tooling** configuration for validation and runs; confirm behaviour in your target product environment.
2. **Freshdesk:** **Not supported** — object storage is unavailable; do not rely on file **`ref`** upload templates for Freshdesk apps.
3. **Prerequisite:** Every **`ref`** must point to a file **already uploaded** to Object Store (typically **short TTL**) before **`invokeTemplate()`**. Obtain reference identifiers from the Object Store / file APIs for your product (e.g. **list files**), then pass them in **`context`** keys that match **`<%= context.<name> %>`** in **`config/requests.json`**.
4. **Soft size guard:** Expect on the order of **~10 MB per file** soft enforcement at the Data-Pipe layer (tune designs accordingly).
5. **Non-file template payload cap:** Request templates also carry a **maximum JSON / metadata payload size on the order of ~6 MB** (order-of-magnitude; exact limit is enforced by the platform). That cap is separate from **streamed file bytes** (Object Store → outbound HTTP): large uploads are **streamed**, not fully held in the template JSON. Limits are enforced **before ProxyMS fetches** streams where applicable.

---

>title: Request templates and ProxyMS — end-to-end file streaming flow
>tags: request-templates, object-store, data-pipe, proxymes, streaming
>context: invokeTemplate, architecture
>content:

# Request templates and ProxyMS — end-to-end file streaming flow

1. **Upload:** The app (or serverless handler) uploads bytes to the **Object Service** and receives a **file reference** (**`fileRef`** / ID).
2. **Invoke:** The client calls **`invokeTemplate()`**, passing that reference inside **`context`** (and any other template placeholders).
3. **Resolve:** **Data-Pipe** authorizes the call and resolves **`fileRef`** with the Object Service to obtain a **time-limited or single-use signed URL** (or equivalent internal path)—not full file caching in the app browser for the outbound hop.
4. **Stream:** **ProxyMS** receives the resolved template, pulls the object stream from backing storage (for example **S3**), and **writes directly into the outbound HTTP stream** to the upstream API (**direct streaming** to limit buffer memory).

This path is optimized for **low memory overhead** on the platform side.

---

>title: Request templates with files — security guard rails and fair usage
>tags: request-templates, security, throttling, signed-url, abuse-prevention
>context: requests.json, object-store
>content:

# Request templates with files — security guard rails and fair usage

- **Signed URLs:** Time-limited or **single-use**; **no** long-lived caching of file contents inside ProxyMS.
- **Fair usage:** **Throttles** apply to file-based templates; **repeated use of the same file ID** multiple times in **one** request may be **blocked**.
- **Resiliency:** **Circuit breakers** on Object Store download failures; **timeouts** on file stream downloads.
- **Payload visibility:** Platforms track **resolution latency**, **stream download latency**, **bytes transferred**, and **outbound payload size** for alerting (oversized payloads, high error rates, slow upstream completion).
- **Circuit breaker (live apps):** Repeated failures to an external API can trip platform protection; responses may include **HTTP 400** with a **circuit breaker** message until cool-off / probe traffic succeeds. Applies to **proxy and request-template** traffic — see **`references/api/request-method-docs.md`** for behaviour and testing notes.

---

>title: When to use multipart vs octet-stream for Object Store file templates
>tags: request-templates, multipart, octet-stream, api-design
>context: requests.json
>content:

# When to use multipart vs octet-stream for Object Store file templates

- Choose **`multipart/form-data`** when the upstream API expects **fields + one or more files** (typical REST upload endpoints, web forms mirrored as API).
- Choose **`application/octet-stream`** when the upstream API accepts a **raw body** with **no** additional form fields—**one file only** per invocation.

Always confirm the third-party contract (headers, field names, size limits) before locking the template.

---

>title: Platform program context — goals, limits, interface, and roadmap (distilled)
>tags: request-templates, architecture, observability, testing, roadmap
>context: invokeTemplate, proxymes, data-pipe
>content:

# Platform program context — goals, limits, interface, and roadmap (distilled)

This section summarizes **engineering program intent** behind file-aware request templates (no internal links). Use it for **architecture context**; product limits and behaviour remain **`fdk validate`** + official docs of record.

## Program goals (tracks)

1. **File handling** — Let apps send **Object Store file references** in templates so outbound calls use **streaming multipart** or **octet-stream** without shipping raw file bytes through the app request path.
2. **Async façade / sync-over-async (future)** — Architectural decoupling for resilience and scale beyond the first file-shipping milestone.

## `invokeTemplate` interface

**No breaking change** to the **`client.request.invokeTemplate()`** / **`$request.invokeTemplate()`** surface for file handling: callers still pass **`requestTemplateName`** and an options object (**`context`**, optional **`body`**, caching, OAuth **`options`**, etc.). File parts are expressed **only in `requests.json`** via **`formData.files.*.ref`** or **`file.ref`** and values supplied through **`context`**.

## Runtime validation shape (Data-Pipe)

For **multipart**, the template should carry a **`formData`** object (fields + **`files`** with **`ref`**). For **octet-stream**, the template should carry a top-level **`file`** object with **`ref`**. **Resolve `ref` → signed URL / path** before ProxyMS executes; **missing file** → fail the request with an appropriate error (do not call upstream with dangling refs).

## Error and edge cases (design-level)

- Object **not found**, **signed URL expired**, **download** or **partial stream** failures, **upstream rejects payload** (size / policy).
- **Retry semantics** for partial client/stream failures are platform-defined; apps should still code **idempotent** upstream effects where possible.

## Observability (what gets measured)

Typical dimensions: **Data-Pipe** — file-reference resolution count/failures, resolution latency, payload size at request level; **ProxyMS** — stream download latency, bytes transferred, stream failures, outbound payload size; **alerts** on high download error rate, payload violations, spikes in **expired references** (often mis-TTL or misuse), slow completes on large uploads. **Distributed tracing** should cover the full path (client → Data-Pipe → ProxyMS → upstream).

## Testing and benchmarking (categories)

- **Unit:** Reference detection and parsing in templates and validators.
- **Integration / load:** Large-file streaming, multipart assembly.
- **Negative:** Expired TTL, wrong shape, oversize, corrupted stream.
- **E2E:** Multipart and octet paths against a controlled upstream.
- **Performance matrix (illustrative sizes / themes):** baseline; small (~256 KB); medium (~1 MB); large (~10 MB); multi-file multipart; burst concurrency; injected network failure for resilience.

## Adoption across surfaces (conceptual order)

Typical rollout chain: **FDK schema + validation** → **runtime (Data-Pipe resolution + ProxyMS streaming)** → **marketplace / publish-time schema validation** parity → **circuit-breaker** tuning for file paths → **benchmarks** and **observability** dashboards. **Per-installation file-count caps** may be coordinated across router, marketplace API, and FDK where product policy requires it.

## Roadmap notes (from product discussion)

- **Multipart GET** for symmetric **download** via templates was raised as a future idea; initial delivery focused on **POST-style** uploads with **developer-controlled `Content-Type`**.
- **Broader file-type support** and a clearer **download** story are expected to align with **Object Store AV scanning** and related hardening before expanding patterns that are hard to constrain on **GET**.

---
