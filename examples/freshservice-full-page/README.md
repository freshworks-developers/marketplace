# Freshservice full page app (Platform 3.0)

Minimal Freshservice app using **`modules.common.location.full_page_app`** (global full page) plus **`service_ticket`** so the product context is Freshservice.

**Instance methods (demo):** the full page includes **`client.instance.context()`** (prints JSON into the page) and **`client.instance.resize({ height: "480px" })`** with **try/catch**, matching the patterns in **`skills/app-dev/references/api/instance-method-docs.md`** (max height **700px** for instances).

## Prerequisites

- **FDK 10.x** and **Node.js 24.x** (repo `skills/fdk-setup` if the CLI is missing).

## Run locally

```bash
cd examples/freshservice-full-page
fdk run
```

In Freshservice, open the app’s full page URL from the app launcher / navigation (per your account), using **`?dev=true`** while developing.

## Validate

```bash
fdk validate
```

Target **zero** platform errors and **zero** lint errors before `fdk pack` or submission.
