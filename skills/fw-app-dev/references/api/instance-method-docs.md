>title: instance methods — agent routing (read first)
>tags: instance-method, agent-routing, frontend, client.instance, modal, platform-3
>context: app.js, app/index.html
>content:

# Instance methods — agent routing (read first)

**Load this file when** the work involves **`client.instance`**, **resize or close an app instance**, **multiple locations/modals on one page**, **instanceId / parentId**, or **send/receive between UI surfaces**.

**Prefer other files when:** **`client.interface` only** (showModal, dialogs, notifications) → **`references/api/interface-method-docs.md`**; **outbound HTTP** → **`references/architecture/request-templates-latest.md`** and **`references/api/request-method-docs.md`**; **serverless / `server/`** → **`skills/fw-app-dev/SKILL.md`** and **`references/events/`**.

**Scope:** Product **frontend** with **`{{{appclient}}}`** in HTML. **Platform 3.0** app UI patterns.

| Goal | API |
|------|-----|
| Set height (hard max **700px**; overflow scrolls) | `client.instance.resize({ height: "500px" })` |
| Close this instance | `client.instance.close()` |
| Metadata for *this* instance (incl. modal parent + `modalData`) | `await client.instance.context()` |
| Active instances (to resolve `instanceId` for `send`) | `await client.instance.get()` |
| Push data to one or more instances | `await client.instance.send({ message, receiver?: string[] })` |
| Handle incoming `send` | `client.instance.receive(function (event) { … })` |

**MUST:** Use **try/catch** around **`await client.instance.context()`**, **`get()`**, and **`send()`** as in examples below. **MUST** register **`receive`** where data should land. **MUST NOT** assume **`resize`** is async—follow the snippets in this doc.

**Typical modal flow:** Parent uses **`client.interface.trigger("showModal", { …, data })`** → child reads **`(await client.instance.context()).modalData`** (see “Example — parent location to modal”).

---

>title: what are instance methods in Freshworks apps
>tags: instance-method, overview, multi-instance, modal, communication
>context: app.js, modal.html
>content:

# What are instance methods in Freshworks apps

**Summary:** Instance methods let **one app** run in **multiple locations or modals** on the same page. Each surface is a separate **instance** (resizable, closeable) and instances can **exchange data**.

**When to use:** Sidebar + modal, two ticket locations on one page, parent pre-filling a modal, modal returning data to a parent.

**Key capabilities**

| Capability | Meaning |
|------------|---------|
| Multi-instance | Same app in several placements or modals at once |
| Inter-instance messaging | `send` / `receive` between active instances |
| Sizing | `resize` up to **700px** height |
| Errors | Use **try/catch** around async instance APIs |

---

>title: how to resize an app instance
>tags: instance-method, resize, client.instance.resize, height-limit
>context: app.js, modal.html
>code:

# How to resize an app instance

**API:** `client.instance.resize({ height: "<css-length>" })`  
**MUST NOT** exceed **700px** height for the instance; extra content **scrolls**.

```js
client.instance.resize({ height: "500px" });
```

---

>title: error handling for client.instance.resize
>tags: instance-method, resize, try-catch, error-handling
>context: app.js, modal.html
>code:

# Error handling for `client.instance.resize`

**MUST** wrap `resize` in **try/catch** if failures should not break the UI.

```js
try {
  client.instance.resize({ height: "500px" });
} catch (error) {
  console.error("Failed to resize instance:", error);
}
```

---

>title: how to close an app instance
>tags: instance-method, close, client.instance.close
>context: app.js, modal.html
>code:

# How to close an app instance

**API:** `client.instance.close()` — tears down **this** instance (for example closes a modal surface when applicable).

```js
client.instance.close();
```

---

>title: communicating between instances — patterns and APIs
>tags: instance-method, send, receive, context, get, inter-instance
>context: app.js, modal.html
>content:

# Communicating between instances — patterns and APIs

| Pattern | Mechanism |
|---------|-----------|
| Parent → modal (initial payload) | Usually **`client.interface.trigger("showModal", { data })`** + **`await client.instance.context()`** → **`modalData`** on the modal instance |
| Modal → parent (or any → any) | **`await client.instance.send({ message, receiver })`** + **`client.instance.receive(...)`** on target(s) |
| Discover targets | **`await client.instance.get()`** returns active instances with **`instanceId`** and **`location`** |

**APIs**

| Method | Role |
|--------|------|
| **`context()`** | Metadata for **current** instance (`instanceId`, `location`, optional `parentId`, optional `modalData`) |
| **`get()`** | Array of **all active** instances at call time |
| **`send()`** | Push **`message`** to **`receiver`** instance id(s), or default targeting per scenario |
| **`receive()`** | Subscribe; **`event.helper.getData()`** yields **`{ senderId, message }`** |

---

>title: client.instance.context — current instance metadata
>tags: instance-method, context, modalData, parentId, instanceId
>context: app.js, modal.html
>code:

# `client.instance.context` — current instance metadata

**When:** You need **this** instance’s id, **location** name, **parent** modal relationship, or **`modalData`** from **`showModal`**.

**MUST** use **`await`** and **try/catch**.

### Example — non-modal location (`ticket_requester_info`)

```js
try {
  const data = await client.instance.context();
  console.log(data);
} catch (error) {
  console.error(error);
}
```

**Example shape**

```js
{
  instanceId: "1",
  location: "ticket_requester_info"
}
```

| Field | Meaning |
|-------|---------|
| `instanceId` | Auto-assigned id for this instance |
| `location` | Manifest location key for this surface |

### Example — modal surface (`modal.html`)

```js
try {
  const ctx = await client.instance.context();
  console.log(ctx);
} catch (error) {
  console.error(error);
}
```

**Example shape**

```js
{
  instanceId: "4",
  location: "modal",
  parentId: "1",
  modalData: "This ticket is created by Rachel"
}
```

| Field | Meaning |
|-------|---------|
| `instanceId` | This modal instance id |
| `location` | Always **`"modal"`** for modal surfaces |
| `parentId` | Opening instance id |
| `modalData` | **Optional** — payload from parent (`data` in **`showModal`**); may be string, object, or array depending on what you pass |

---

>title: client.instance.get — list active instances
>tags: instance-method, get, active-instances, send-targeting
>context: app.js, modal.html
>code:

# `client.instance.get` — list active instances

**When:** You need **every active** instance (for example to **`find`** `ticket_sidebar` and pass its **`instanceId`** into **`send`**).

**MUST** use **`await`** and **try/catch**.

```js
try {
  const instances = await client.instance.get();
  console.log(instances);
} catch (error) {
  console.error(error);
}
```

**Example output**

```js
[
  { instanceId: "1", location: "ticket_requester_info" },
  { instanceId: "2", location: "ticket_sidebar" },
  { instanceId: "4", location: "modal", parentId: "1" }
]
```

| Field | Meaning |
|-------|---------|
| `instanceId` | Target id for **`receiver`** |
| `location` | Placement key |
| `parentId` | Present on **modal** rows — opener’s **`instanceId`** |

---

>title: client.instance.send — push data to instance(s)
>tags: instance-method, send, receiver, message
>context: app.js, modal.html
>code:

# `client.instance.send` — push data to instance(s)

**When:** One instance should push a **`message`** payload to **specific** instance(s) or (in modal flows) to the **implicit** parent.

**MUST** use **`await`** and **try/catch** on the **caller**. **MUST** ensure recipients are **active** (use **`get()`** first if ids are unknown).

**`message`:** string, object, or array.  
**`receiver`:** array of **`instanceId`** strings when targeting multiple surfaces; omit only when your product pattern allows default routing (see modal example in next sections).

### From a location — explicit receivers

```js
try {
  await client.instance.send({
    message: {
      name: "James",
      email: "James@freshdesk.com"
    },
    receiver: ["instanceID1", "instanceID2"]
  });
} catch (error) {
  console.error(error);
}
```

### From a modal — message only (parent routing per product)

```js
try {
  await client.instance.send({
    message: {
      name: "James",
      email: "James@freshdesk.com"
    }
  });
} catch (error) {
  console.error(error);
}
```

**Note:** Destination instances **must be active** when **`send`** runs—resolve ids with **`get()`** when needed.

---

>title: client.instance.receive — subscribe to incoming send
>tags: instance-method, receive, event.helper.getData, senderId
>context: app.js, modal.html
>code:

# `client.instance.receive` — subscribe to incoming `send`

**When:** This instance should handle **`send`** payloads from elsewhere in the same app.

**API:** `client.instance.receive(function (event) { … })` — callback runs when a **`send`** targets this instance.

```js
client.instance.receive(function (event) {
  const data = event.helper.getData();
  console.log(data);
  /* e.g. { senderId: "1", message: { name: "James", email: "James@freshdesk.com" } } */
});
```

| Field | Meaning |
|-------|---------|
| `message` | Payload from **`send`** |
| `senderId` | Sender instance **`instanceId`** |

---

>title: example — parent location to modal via showModal data
>tags: instance-method, showModal, modalData, context, ticket_sidebar
>context: app.js, modal.html, interface-method-docs.md
>code:

# Example — parent location to modal (`showModal` + `modalData`)

**Story:** Ticket UI has **Name** / **Email** and **Show Modal**. User fills fields; parent opens **`modal.html`** and passes values via **`data`**.

**Step 1 — parent:** pass **`data`** into **`showModal`**.

`ticket_sidebar_template.html`

```js
try {
  await client.interface.trigger("showModal", {
    title: "Information Form",
    template: "modal.html",
    data: {
      name: "James",
      email: "James@freshdesk.com"
    }
  });
} catch (error) {
  console.error(error);
}
```

**Step 2 — modal:** read **`modalData`** from **`context()`**.

`modal.html`

```js
try {
  const ctx = await client.instance.context();
  console.log("Modal instance method context", ctx);
  /* e.g. { instanceId, location: "modal", parentId, modalData: { name, email } } */
  const nameEl = document.querySelector("#name");
  const emailEl = document.querySelector("#email");
  if (ctx.modalData && nameEl && emailEl) {
    nameEl.value = ctx.modalData.name;
    emailEl.value = ctx.modalData.email;
  }
} catch (error) {
  console.error(error);
}
```

**Rule:** `modalData` mirrors the **`data`** object passed from **`showModal`** (shape is under your control).

---

>title: example — modal to parent via send and receive
>tags: instance-method, send, receive, modal-to-parent
>context: app.js, modal.html, ticket_sidebar
>code:

# Example — modal to parent (`send` + `receive`)

**Story:** User submits **Name** / **Email** in **`modal.html`**; **`ticket_requester_info`** (or another parent surface) should consume it via **`receive`**.

**Step 1 — modal:** **`send`** the payload.

`modal.html`

```js
try {
  await client.instance.send({
    message: { name: "James", email: "james.dean@freshdesk.com" }
  });
} catch (error) {
  console.error(error);
}
```

**Step 2 — parent surface:** **`receive`**.

`ticket_sidebar_template.html` (or your parent template)

```js
client.instance.receive(function (event) {
  const data = event.helper.getData();
  console.log(data);
  /* e.g. { senderId: "4", message: { name: "James", email: "james.dean@freshdesk.com" } } */
});
```

---

>title: example — one ticket location to another via get send receive
>tags: instance-method, get, send, receive, ticket_sidebar, ticket_requester_info
>context: app.js, modal.html
>code:

# Example — one location to another (`get` + `send` + `receive`)

**Story:** User clicks **Send** in **`ticket_requester_info`**; **`ticket_sidebar`** should receive **Name** / **Email**.

**Step 1 — sender:** resolve **`ticket_sidebar`** with **`get()`**, then **`send`**.

`ticket_requester_template.html`

```js
try {
  const instances = await client.instance.get();
  console.log("Active instances", instances);
  const sidebarApp = instances.find((x) => x.location === "ticket_sidebar");
  if (!sidebarApp) {
    throw new Error("ticket_sidebar instance is not active");
  }
  await client.instance.send({
    message: {
      name: "James",
      email: "james.dean@freshdesk.com"
    },
    receiver: [sidebarApp.instanceId]
  });
} catch (error) {
  console.error(error);
}
```

**Step 2 — receiver:** **`receive`** on the sidebar template.

`ticket_sidebar_template.html`

```js
client.instance.receive(function (event) {
  const data = event.helper.getData();
  console.log(data);
  /* e.g. { senderId: "1", message: { name: "James", email: "james.dean@freshdesk.com" } } */
});
```
