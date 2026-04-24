# Minimal app (Platform 3.0)

Small **Freshdesk** app (**Platform 3.0**) with a **full-page** shell under `modules.common` (FDK manifest requirement) and the real demo in **`ticket_sidebar`**.

## Features

- `full_page_app` under `modules.common` (minimal `app/index.html` + Crayons)
- `ticket_sidebar` under `modules.support_ticket`
- Greets with **`ticket.requester.info`** when the requester object includes `info`; otherwise **name · email** or **requester id**, using `client.data.get("ticket")` and `client.data.get("requester")` per the support_ticket data methods.

## Setup

1. Use **Node 24.x** and **FDK 10.x**; `manifest.json` → **`engines`** default **`24.11.0`** + **`10.0.1`** (CLI may bump `fdk` to your installed 10.x). See **fw-setup** if needed.
2. From this folder: `fdk validate` then `fdk run`.

## Usage

Open a **ticket** in Freshdesk with `?dev=true` while developing and load the sidebar app.
