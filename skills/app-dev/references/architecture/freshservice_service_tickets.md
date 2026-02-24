>title: what is service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice
>context:
>content:

# what is service ticket module in Freshservice

An app user with a stand-alone Freshservice subscription—or a subscription where Freshservice is one of the products—can use this module. Using this module, you can build a front end app, a serverless app, or a full stack SMI app for the Freshservice Ticket feature.

---
>title: what are the placeholders supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice
>context: manifest.json
>content:

# what are the placeholders supported for service ticket module in Freshservice

## Summary
- **Common Placeholders:** Configured at `modules.common`
- **Module-Specific Placeholders:** Configured at `modules.service_ticket`

## Details

### Common Placeholders
- **Full Page App:** Use as `full_page_app` in the app manifest.

### Module-Specific Placeholders
- Configure under `modules.service_ticket`:
  - `ticket_sidebar`
  - `ticket_requester_info`
  - `ticket_conversation_editor`
  - `ticket_top_navigation`
  - `ticket_background`
  - `new_ticket_background`
  - `new_ticket_sidebar`
  - `new_ticket_description_editor`

---
>title: how to use placeholders supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice
>context: manifest.json
>content:

# how to use placeholders supported for service ticket module in Freshservice

## Instructions
To use the Support Ticket placeholder, modify your `manifest.json` as shown below.

## Example

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "service_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_requester_info": {
          "url": "ticket_requester_info.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_top_navigation": {
          "url": "ticket_top_navigation.html",
          "icon": "styles/images/icon.svg"
        },
        "new_ticket_description_editor": {
          "url": "new_ticket_description_editor.html",
          "icon": "styles/images/icon.svg"
        }
      }
    }
  }
}
```
>title: How to Write an App for Background Placeholders for servicet_ticket module
>tags: module=service_ticket, service_ticket, freshservice
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for service_ticket module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **service_ticket** module supports these background placeholders:

- `ticket_background`: The app runs in the background of the Ticket details page.
- `new_ticket_background`: The app runs in the background of the New ticket page.

These placeholders let you react to page loads and data changes, perform automated tasks, and integrate external services without cluttering the UI.

## What Is It Used For

Background placeholders are ideal for:

- **Data synchronization**: Fetching or updating external systems when a ticket or its timeline changes.
- **Automated workflows**: Triggering scheduled or event-driven processes (e.g., setting default values, auto-tagging, enrichment).
- **Event interception**: Listening for field changes (status, tags) and reacting before or after the native UI updates.
- **Analytics & logging**: Recording user or ticket activity without requiring a visible interface.
- **Notifications**: Sending alerts (email, Slack) when certain ticket conditions are met, even if the agent doesn’t click anything.
- **Data Manipulation**: Hiding a ticket field when certain validation criteria is met.

Because these run in the background, they have minimal impact on page performance and keep the UI clean for the agent.

## How to Use background placeholders

### Step 1. Declare in the Manifest

In your `manifest.json`, under the `service_ticket` module, add the background placeholders to the `location` block. For example:

```json
"service_ticket": {
  "events": {
    "onTicketUpdate": {
      "handler": "onTicketUpdateCallback"
    }
  },
  "location": {
    "ticket_background": {
    "url": "ticket_background.html" 
    }
  }
}
```

### Step 2. Create the Background HTML

Even though it’s not visible, each placeholder URL needs a corresponding HTML file. Typically, `ticket_background.html` looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="{{{appclient}}}"></script>
    <title>Ticket Background</title>
  </head>
  <body>
    <main>
      <section>This app runs in back ground. Hence no UI</section>
    </main>
  </body>
  <script src="/app.js />
</html>
```

### Step 3. Additionally, you can implement your background logic

Declare requests, functions in app.js and add iparams or request templates as needed.

```js
//app.js
var client;
client = await app.initialized();
client.events.on('app.activated', () => {
  console.log(`ticket_background:  app is activated`);
});
```

---

>title: what are data methods supported for service ticket module in Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, data_method  
>context:  
>content:

# what are data methods supported for service ticket module in Freshservice

## Summary
- Retrieve common objects (e.g., `currentHost`, `loggedInUser`)
- Retrieve placeholder-specific objects:
  - `ticket`
  - `requester`
  - `agent`
  - `department`
  - `group`
  - `associatedProblem`
  - `associatedChanges`
  - `associatedTasks`
  - `recentChildTickets`
  - `requesterAssets`
  - `ticketAssets`

## Details
Use the `client.data.get()` method to retrieve these objects.

---
>title: example of data method usage supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice
>context:
>content:

# example of data method usage supported for service ticket module in Freshservice

## Example 1: Retrieve Ticket Information
```js
async function getTicketDetails() {
  try {
    const data = await client.data.get("ticket");
    // success output: e.g.,
    // {"ticket":{"id":25, "subject":"Requesting refund", "description_text":"Some details on the issue ..."}}
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
getTicketDetails();
```

## Example 2: Retrieve Requester Information
```js
client.data.get("requester").then(
  function(data) {
    // success output, e.g., {requester: {"active": "true"}}
  },
  function(error) {
    // failure operation
  }
);
```

## Example 3: Retrieve Associated Problem
```js
async function getAssociatedProblem() {
  client.data.get("associatedProblem").then(
    function(data) {
      // success output example:
      // {"associatedProblem": {"category": null, "created_at": "2017-12-07T16:37:41+05:30", ...}}
    },
    function(error) {
      // failure operation
    }
  );
}
getAssociatedProblem();
```

---
>title: what are events methods supported for service ticket module in Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, events_method  
>context:  
>content:

# what are events methods supported for service ticket module in Freshservice

## Ticket Details Page Events

### Click Events
- `ticket.propertiesLoaded`: When ticket properties are loaded.
- `ticket.replyClick`: When the Reply button is clicked.
- `ticket.forwardClick`: When the Forward button is clicked.
- `ticket.notesClick`: When the Add note button is clicked.
- `ticket.submitClick`: When the Send button is clicked.
- `ticket.closeTicketClick`: When the Close button is clicked.
- `ticket.previousTicketClick`: When the Back icon is clicked.
- `ticket.nextTicketClick`: When the Forward icon is clicked.
- `ticket.taskAdded`: When the Add task button is clicked.
- `ticket.startTimer`: When a timer is started or saved.
- `ticket.stopTimer`: When a running timer is stopped.
- `ticket.updateTimer`: When an existing time entry is updated.
- `ticket.deleteTimer`: When a time entry is deleted.

### Change Events
- `ticket.priorityChanged`
- `ticket.statusChanged`
- `ticket.groupChanged`
- `ticket.agentChanged`
- `ticket.typeChanged`
- `ticket.urgencyChanged`
- `ticket.impactChanged`
- `ticket.departmentChanged`
- `ticket.categoryChanged`
- `ticket.subCategoryChanged`
- `ticket.itemChanged`
- `ticket.propertiesUpdated`
- `ticket.assetAssociated`
- `ticket.problemAssociated`
- `ticket.changeAssociated`
- `ticket.childticketAssociated`

## New Ticket Details Page Front-end Events (Change Events)
- `ticket.priorityChanged`
- `ticket.statusChanged`
- `ticket.groupChanged`
- `ticket.agentChanged`
- `ticket.urgencyChanged`
- `ticket.impactChanged`
- `ticket.departmentChanged`
- `ticket.categoryChanged`
- `ticket.subcategoryChanged`
- `ticket.itemChanged`
- `ticket.requesterChanged`
- `ticket.subjectChanged`

---
>title: how to use events methods supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice, events_method
>context:
>content:

# how to use events methods supported for service ticket module in Freshservice

## Example 1: Using `ticket.propertiesLoaded`
```js
// Subscribe to the event and register a callback
client.events.on("ticket.propertiesLoaded", eventCallback);
var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // App logic goes here
};
```

## Example 2: Using ticket.nextTicketClick

```js
// Subscribe to the event and register a callback
client.events.on("ticket.nextTicketClick", eventCallback);
var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // App logic goes here
};
```


---

>title: what are interface methods supported for service ticket module in Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, interface_methods  
>context: apps.js  
>content:

# what are interface methods supported for service ticket module in Freshservice

## Overview
Using interface methods, an app can on the product UI:
- Display UI elements (modals, confirmation boxes, notifications)
- Mimic click actions (e.g., timer start/stop, page navigation)
- Show/hide fields or elements
- Enable/disable buttons
- Set field values

## Supported Methods
1. **Modals & Dialogs:** `showModal`, `showDialog`
2. **Confirmations:** `showConfirm`
3. **Notifications:** `showNotify` (supports types: info, success, warning, danger, alert)
4. **UI Element Control:**  
   Use `client.interface.trigger("<method-name>", {id: "<element-name>"})` where `<method-name>` can be:
   - `hideElement`
   - `showElement`
   - `enableElement`
   - `disableElement`
5. **Editor Window Control:**  
   Use `client.interface.trigger("<method-name>", {id: "<window-name>", field: "<element-name>"})` where `<method-name>` can be `enableElement` or `disableElement` and `<window-name>` is either `reply` or `forward`.

For more details, refer to the [interface methods docs](https://freshworks.dev/docs/app-sdk/v3.0/service_ticket/front-end-apps/interface-methods/)._

---
>title: how to use interface methods supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for service ticket module in Freshservice

## Example 1: Show Modal/Dialog
```js
try {
  let data = client.interface.trigger('showModal', {
    title: 'Sample App Form',
    template: './views/modal.html'
  });
  console.log(data); // success message
} catch (error) {
  console.error(error); // failure operation
}
```

## # how to use interface methods supported for service ticket module in Freshservice

## Example 1: Show Modal/Dialog
```js
try {
  let data = client.interface.trigger('showModal', {
    title: 'Sample App Form',
    template: './views/modal.html'
  });
  console.log(data); // success message
} catch (error) {
  console.error(error); // failure operation
}
```

## Example 2: Display Notifications
```js
client.interface.trigger("showNotify", {
  type: "<Possible values: info, success, warning, danger, alert>",
  title: "<Display name>",
  message: "<Text message for the notification box>"
});
```

## Example 3: Show Attachment Options
```js
try {
  let data = await client.interface.trigger("showElement", {
    id: "attachments"
  });
  console.log(data); // success message
} catch (error) {
  console.error(error); // failure operation
}
```


---

>title: what are instance methods supported for service ticket module in Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, instance_methods  
>context: apps.js  
>content:

# what are instance methods supported for service ticket module in Freshservice

## Summary of Instance Methods
1. **Resize Instance:**  
   `client.instance.resize({ height: "<height in pixels>" });`
2. **Close Instance:**  
   `client.instance.close();`
3. **Inter-Instance Communication:**  
   Use methods such as `context()`, `send()`, `receive()`, and `get()`.
   - Send data from a parent to a modal and vice versa.
   - Send data between two different instances.
4. **Retrieve Context:**  
   `client.instance.context();` returns contextual info about the current app instance.

---
>title: how to use instance methods supported for service ticket module in Freshservice
>tags: module=service_ticket, service_ticket, freshservice, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for service ticket module in Freshservice

## Example 1: Parent to Modal Communication

### In Parent UI
```js
try {
  await client.interface.trigger("showModal", {
    title: "Information Form",
    template: "modal.html",
    data: {
      name: "James",
      email: "James@freshworks.com"
    }
  });
} catch (error) {
  console.error(error);
}
```

### In Modal UI

```js
try {
  let context = await client.instance.context();
  console.log("Modal instance method context", context);
  // Expected output:
  // { instanceId: "4", location: "modal", parentId: "1", modalData: {name: "James", email: "James@freshworks.com"} }
} catch (error) {
  console.error(error);
}
```

## Example 2: Modal to Parent Communication

### In Parent UI
```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  // Expected output example:
  // { senderId: "4", message: { name: "James", email: "james.dean@freshworks.com" } }
});
```

### In Modal UI

```js
client.instance.send({
  message: {
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
```

## Example 3: Instance to Instance Communication

### In Placeholder 1

```js
client.instance.get().then(function(data) {
  console.log(data);
  // Expected output example:
  // [
  //   { instanceId: "1", location: "place_holder1" },
  //   { instanceId: "2", location: "place_holder2" }
  // ]
  var pl2App = data.find(x => x.location === "place_holder2");
  client.instance.send({
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    },
    receiver: pl2App.instanceId
  });
});
```

### In Placeholder 2

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  // Expected output:
  // { senderId: "1", message: { name: "James", email: "james.dean@freshworks.com" } }
});
```


---

>title: what are the serverless events supported by service ticket module of Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, serverless_events  
>context: manifest.json  
>content:

# what are the serverless events supported by service ticket module of Freshservice

## Overview

### Common Events (Configured at `modules.common`)
- **App Set-Up Events:**
  - `onAppInstall`
  - `afterAppUpdate`
  - `onAppUninstall`
- **External Events:**
  - `onAppInstall`
  - `onExternalEvent`
  - `onAppUninstall`
- **Scheduled Events**

### Product-Specific Events (Configured at `modules.service_ticket`)
- `onTicketCreate`
- `onTicketUpdate`
- `onConversationCreate`

---
>title: how to configure product events supported by service ticket module of Freshservice
>tags: module=service_ticket, service_ticket, freshservice, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by service ticket module of Freshservice

## Steps

### Step 1: Configure Event Listener in manifest.json
```json
"events": {
  "<productEventName>": {
      "handler": "<eventCallbackMethod>"
  }
}
```

### Step 2: Define Callback in server.js

```js
exports = {
  // args contains the payload information
  // args["iparam"] holds installation parameter values
  // eventCallbackMethod is the function specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(args));
  }
};
```

### Step 3: Use Appropriate Payload Syntax

```js
{
  "currentHost": {
    "subscribed_modules": [ "service_ticket" ],
    "endpoint_urls": {
      "freshservice": "value"
    }
  },
  "data": {
    // List of objects related to the event
  },
  "event": "value",
  "iparams": {
      "Param1": "value",
      "Param2": "value"
  },
  "region": "value",
  "timestamp": "value"
}
```


---

>title: how to configure ticket events supported by service ticket module in Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, product_events, ticket_events  
>context: manifest.json, server.js  
>content:

# how to configure ticket events supported by service ticket module of Freshservice

## Steps

### Step 1: Subscribe to Ticket Event in manifest.json
```json
"events": {
  "onTicketCreate": {
    "handler": "onTicketCreateCallback"
  }
}
```

### Step 2: Define Callback in server.js

```js
exports = {
  onTicketCreateCallback: function(payload) {
    console.log("Logging arguments from onTicketCreate event: " + JSON.stringify(payload));
  }
};
```

### Step 3: Use Payload Attributes for Callback

```js
{
  "currentHost": {
    "subscribed_modules": [ "service_ticket" ],
    "endpoint_urls": {
      "freshservice": "https://subdomain.freshservice.com"
    }
  },
  "data": {
    "actor": {
      "profile_id": 27000015175
    },
    "requester": {},
    "ticket": {
      "assets": [],
      "attachments": [],
      "category": "Hardware",
      "cc_emails": [],
      "change": {},
      "associated_changes": [],
      "custom_fields": [],
      "department_id": 2,
      "department_name": "HR"
    }
  },
  "event": "onTicketCreate",
  "region": "US",
  "timestamp": 1496400354326
}
```


---

>title: what are the REST APIs supported by service ticket module of Freshservice  
>tags: module=service_ticket, service_ticket, freshservice, rest_api  
>context:  
>content:

# what are the REST APIs supported by service ticket module of Freshservice

The Freshservice Support Ticket module supports the following APIs:
It provides the endpoint along with Oauth scope required for every api

## Tickets API

- `POST /api/v2/tickets` - ITSM Scope: freshservice.tickets.create, MSP Scope: freshservice.tickets.create
- `GET /api/v2/tickets/[id]` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `GET /api/v2/tickets/filter?query=[query]` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `GET /api/v2/tickets` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `PUT /api/v2/tickets/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/tickets/[id]/move_workspace` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `DELETE /api/v2/tickets/[id]` - ITSM Scope: freshservice.tickets.delete, MSP Scope: freshservice.tickets.delete
- `DELETE /api/v2/tickets/[ticket_id]/attachments/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/tickets/[id]/restore` - ITSM Scope: freshservice.tickets.delete, MSP Scope: freshservice.tickets.delete
- `POST /api/v2/tickets/[parent_id]/create_child_ticket` - ITSM Scope: freshservice.tickets.create, MSP Scope: freshservice.tickets.create
- `GET /api/v2/ticket_form_fields` - ITSM Scope: freshservice.tickets.fields.manage, MSP Scope: freshservice.tickets.fields.manage
- `GET /api/v2/tickets/[id]/activities` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view

### Ticket Time Entries API
- `POST /api/v2/tickets/[ticket_id]/time_entries` - ITSM Scope: freshservice.tickets.time_entries.create, MSP Scope: freshservice.tickets.time_entries.create
- `GET /api/v2/tickets/[ticket_id]/time_entries/[id]` - ITSM Scope: freshservice.tickets.time_entries.view, MSP Scope: freshservice.tickets.time_entries.view
- `GET /api/v2/tickets/[ticket_id]/time_entries` - ITSM Scope: freshservice.tickets.time_entries.view, MSP Scope: freshservice.tickets.time_entries.view
- `PUT /api/v2/tickets/[ticket_id]/time_entries/[id]` - ITSM Scope: freshservice.tickets.time_entries.edit, MSP Scope: freshservice.tickets.time_entries.edit
- `DELETE /api/v2/tickets/[ticket_id]/time_entries/[id]` - ITSM Scope: freshservice.tickets.time_entries.delete, MSP Scope: freshservice.tickets.time_entries.delete

### Ticket Fields API
- `POST /api/v2/ticket_fields/sources` - ITSM Scope: freshservice.tickets.fields.manage, MSP Scope: freshservice.tickets.fields.manage

### Service Catalog API
- `POST /api/v2/service_catalog/items/{display_id}/place_request` - ITSM Scope: freshservice.tickets.create, MSP Scope: freshservice.tickets.create
- `POST /api/v2/service_catalog/items/{display_id}/place_request` - ITSM Scope: freshservice.tickets.create, MSP Scope: freshservice.tickets.create

### Requested Items API
- `GET /api/v2/tickets/[id]/requested_items` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `PUT /api/v2/tickets/[id]/requested_items/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit

### Ticket Approval API
- `POST /api/v2/tickets/[ticket_id]/approvals` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/tickets/[ticket_id]/approvals` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `GET /api/v2/tickets/[ticket_id]/approvals/[id]` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `PUT /api/v2/tickets/[ticket_id]/approvals/[id]/remind` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/tickets/[ticket_id]/approvals/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `POST /api/v2/tickets/[ticket_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/tickets/[ticket_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/tickets/[ticket_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/tickets/[ticket_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit

### Ticket Tasks API
- `POST /api/v2/tickets/[id]/tasks` - ITSM Scope: freshservice.tickets.tasks.create, MSP Scope: freshservice.tickets.tasks.create
- `GET /api/v2/tickets/[id]/tasks` - ITSM Scope: freshservice.tickets.tasks.view, MSP Scope: freshservice.tickets.tasks.view
- `PUT /api/v2/tickets/[id]/tasks/[id]` - ITSM Scope: freshservice.tickets.tasks.edit, MSP Scope: freshservice.tickets.tasks.edit
- `DELETE /api/v2/tickets/[id]/tasks/[id]` - ITSM Scope: freshservice.tickets.tasks.delete, MSP Scope: freshservice.tickets.tasks.delete
- `GET /api/v2/tickets/id]/csat_response` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view

---