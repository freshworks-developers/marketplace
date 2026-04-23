>title: Request templates — secure file uploads via Object Store (overview)
>tags: request-templates, object-store, file-upload, multipart, octet-stream, fdk-10, platform-3
>context: requests.json, manifest.json, invokeTemplate
>content:

# Request templates — secure file uploads via Object Store (overview)

Platform enhancements add **secure file handling** to request templates: apps reference files already stored in the **Freshworks Object Store** (by identifier), instead of passing raw file bytes through the app request path. Those references are resolved server-side; streams are forwarded to third-party APIs using **`multipart/form-data`** or **`application/octet-stream`**.

**FDK v10.0.1 / v10.1.0** introduces the request-template syntax for declaring file parts. **Infrastructure:** ProxyMS (outbound request execution) is migrating from **AWS Lambda** to **Amazon EKS** to support longer call durations, higher throughput targets (on the order of **1000–2000 RPM** for large tenants), and streaming without hitting Lambda concurrency or cost cliffs as sharply.

**Critical product constraint:** File upload via request templates is **not supported on Freshdesk**, because **object storage is not available** in that product. Design Freshdesk integrations without this pattern.

**Canonical Platform 3.0 patterns:** `references/architecture/request-templates-latest.md`, `references/api/request-method-docs.md`.

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

Default cap is **5 files** per template invocation for multipart; this can be raised **up to 40** using platform configuration (see limits KB entry).

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

For a single binary body derived from one stored file, define the file reference on the **`file`** object (not `formData.files`).

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

1. **Multipart file count:** Default **5** files per request template; increase **up to 40** using **`FDK_MAX_PER_REQUEST=40`** (platform / tooling configuration for the raised ceiling).
2. **Freshdesk:** **Not supported** — object storage is unavailable; do not rely on file **`ref`** upload templates for Freshdesk apps.
3. **Prerequisite:** Upload every file to the Object Store with a **low TTL** before calling **`invokeTemplate()`**, so references are valid only for the intended short window.
4. **Soft size guard:** Expect on the order of **~10 MB per file** soft enforcement at the Data-Pipe layer (tune designs accordingly).

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

>title: ProxyMS migration from Lambda to EKS — why it matters for apps
>tags: proxymes, eks, lambda, scaling, rate-limits, infrastructure
>context: request-templates, architecture
>content:

# ProxyMS migration from Lambda to EKS — why it matters for apps

**Drivers:**

- **Scale / throttling:** Large accounts can need **~1000–2000 RPM**; regional **Lambda concurrency** ceilings (order of **10k** in a region) risk **cross-tenant throttling** when many apps stream concurrently.
- **Cost / duration:** File streaming increases **wall-clock duration** on workers; EKS-based execution can be more predictable for **long-lived** outbound calls than purely duration-metered Lambda for this workload class.
- **Ephemeral ports:** Longer **Client → Data-Pipe → ProxyMS** connections increase risk of **ephemeral port exhaustion** in Data-Pipe when the execution tier does not scale elastically with connection churn.

**Selected routing:** **Approach 2 — MP-Gateway (Zuul)** for ProxyMS ingress/egress: **high security isolation**, manageable operational complexity versus a full service mesh, **low-to-medium** added latency versus direct calls.

| Criterion | Direct call | MP-Gateway (Zuul) | Istio mesh |
|-----------|-------------|-------------------|------------|
| Security isolation | Medium | High | Very high |
| Operational complexity | Low | Medium | High |
| Latency | Minimal | Low–medium | Medium |

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

---

>title: When to use multipart vs octet-stream for Object Store file templates
>tags: request-templates, multipart, octet-stream, api-design
>context: requests.json
>content:

# When to use multipart vs octet-stream for Object Store file templates

- Choose **`multipart/form-data`** when the upstream API expects **fields + one or more files** (typical REST upload endpoints, web forms mirrored as API).
- Choose **`application/octet-stream`** when the upstream API accepts a **raw body** with **no** additional form fields—**one file only** per invocation.

Always confirm the third-party contract (headers, field names, size limits) before locking the template.
