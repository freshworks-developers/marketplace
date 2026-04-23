# Freshservice ticket sidebar (Platform 3.0)

Minimal Freshservice app that renders in **Ticket details → sidebar** (`service_ticket` / `ticket_sidebar`).

## Prerequisites

- **FDK 10.x** and **Node.js 24.x** (see repo `skills/fdk-setup` if you need to install the toolchain).

## Run locally

```bash
cd examples/freshservice-ticket-sidebar
fdk run
```

Open a Freshservice ticket with `?dev=true`, install the app when prompted, and open the sidebar.

## Validate

```bash
fdk validate
```

Expect **zero** platform errors and **zero** lint errors before packaging or submitting.
