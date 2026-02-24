>title: what is support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk
>context: 
>content:

# what is support ticket module in Freshdesk

An app user with a stand-alone Freshdesk subscription or a subscription to any SKU that has Freshdesk as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshdesk Ticket feature.

---

>title: what are the placeholders supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk
>context: manifest.json
>content:

# what are the placeholders supported for support ticket module in Freshdesk

## Common placeholders

It supports following Common placeholders. In the app manifest, configure these placeholders at modules.common.
1. Full Page App as `full_page_app`
2. CTI Global sidebar as `cti_global_sidebar`

## Module-specific placeholders

It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.support_ticket`.
1. `ticket_sidebar`
2. `ticket_requester_info`
3. `ticket_top_navigation`
4. `ticket_background`
5. `time_entry_background`
6. `ticket_attachment`
7. `ticket_conversation_editor`
8. `new_ticket_requester_info`
9. `new_ticket_background`

---

>title: how to use placeholders supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk
>context: manifest.json
>content:

# how to use placeholders supported for support ticket module in Freshdesk

To use the Support ticket placeholder modify your `manifest.json` as below:
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "cti_global_sidebar": {
          "url": "cti_global_sidebar.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "support_ticket": {
      "location": {
        "ticket_sidebar": {
          "url": "ticket_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_requester_info": {
          "url": "ticket_requester_info.html",
          "icon": "styles/images/icon.svg"
        },
        "time_entry_background": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "ticket_conversation_editor": {
          "url": "ticket_conversation_editor.html",
          "icon": "styles/images/icon.svg"          
        }
      }
    }
  }
}
```

---
>title: How to Write an App for Background Placeholders for support_ticket module
>tags: module=support_ticket, support_ticket, freshdesk
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for support_ticket module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **support_ticket** module supports these background placeholders:

- `ticket_background`: The app runs in the background of the Ticket details page.
- `time_entry_background`: The app runs in the background of the TIME LOGS tab on the ticket details page of Freshdesk.
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

In your `manifest.json`, under the `support_ticket` module, add the background placeholders to the `location` block. For example:

```json
"support_ticket": {
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

>title: data methods or objects supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, data_method
>context: 
>content:

# Data Methods or objects Supported for Support Ticket Module in Freshdesk

The Freshdesk support ticket module exposes various data objects through the `client.data.get()` method. These objects fall into two categories: common objects that are available in any context and placeholder-specific objects that are available only within a specific placeholder.

## Common Data Objects
These data objects are accessible regardless of the context or placeholder:
- `currentHost` – Returns current host information.
- `loggedInUser` – Returns logged-in user details.

## Placeholder-specific Data Objects
When operating within a specific placeholder, you can retrieve additional data:
- `ticket` – Retrieves information about a ticket.
- `contact` – Retrieves information about a contact.
- `email_config` – Retrieves a list of email configurations for a user.
- `requester` – Retrieves information about the requester.
- `company` – Retrieves information about a company.
- `group` – Retrieves information about the agent group.
- `<field-name>_options` – Retrieves all configured options (field values) for dropdown fields such as `status_options`, `priority_options`, `ticket_type_options`, and `customfield_options`.
- `time_entry` – Retrieves the time entry details on a New Ticket page.

---

>title: example of data method usage supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk
>context: 
>content:

# example of data method usage supported for support ticket module in Freshdesk

### Example 1: Retrieve ticket information

```js
async function getTicketDetails() {
  try {
    const data = await client.data.get("ticket");
    // success output
    // data is {"ticket":{"id":25, "subject":"Requesting refund",,"description_text":"Some details on the issue ..."}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getTicketDetails();
```

### Example 2: Retrieve contact information

```js
async function getContactData() {
  try {
    const data = await client.data.get("contact");
    // Success output
    // data: {"contact":{"id":2043157307200,"name":"Rachel","mobile":"99991356999","phone":"32455698098", ... }}
    console.log(data);
  } catch (error) {
    // Failure operation
    console.log(error);
  }
}
getContactData();
```

### Example 3: Retrieve status options

```js
async function getStatusOptions() {
  try {
    const data = await client.data.get("status_options");
    console.log(data);
    //Success output
    //data: {status_options: ["open","resolved","closed","pending"]}
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getStatusOptions();
```

---

>title: what are events methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, events_method
>context: 
>content:

# what are events methods supported for support ticket module in Freshdesk

## Common events

An app deployed at cti_global_sidebar can react to the `cti.triggerDialer` event. It gets triggered when user clicks on:
   1. Ticket details page > CONTACT DETAILS widget
   2. Ticket list page > Contact hover card
   3. New ticket page > CONTACT DETAILS widget
   4. Contact list page > Contact hover card
   5. Contact details page > Contact header and DETAILS widget

## Placeholder-specific events

An app deployed in the New email page can react to the following front-end events.

### Ticket details page events

1. **Click Events** are triggered when a user clicks the:
   1. `ticket.replyClick` - Reply button to open the editor window.
   2. `ticket.sendReply` - Send button.
   3. `ticket.forwardClick` - Forward button to open the editor window.
   4. `ticket.conversationForward` - Forward icon in the conversation.
   5. `ticket.forward` - Forward button inside the editor window, the ticket or conversation is forwarded
   6. `ticket.notesClick` - Notes button to open the editor window.
   7. `ticket.addNote` - Add Note option from the editor window, a private or public note is added
   8. `ticket.closeTicketClick` - Close button located on the top navigation bar
   9. `ticket.deleteTicketClick` - Delete button located on the top navigation bar
   10. `ticket.previousTicketClick` - previous ticket icon at the top right of the Ticket details page
   11. `ticket.nextTicketClick` - next ticket icon at the top right of the Ticket details page.
   12. `ticket.startTimer` - Start or Add Timer button.
   13. `ticket.stopTimer` - Stop Timer button.
   14. `ticket.updateTimer` - Update Timer button.
   15. `ticket.deleteTimer` - Delete Time Entry button.
2. **Change Events** are triggered when a user changes:
    1. `ticket.priorityChanged` - the priority of a ticket.
    2. `ticket.statusChanged` - the status of a ticket.
    3. `ticket.groupChanged` - the group to which a ticket is assigned.
    4. `ticket.agentChanged` - the agent to whom the ticket is assigned.
    5. `ticket.typeChanged` - the type of the ticket.      
3. **Intercept Events** are triggered when user clicks following options:
    1. `ticket.closeTicketClick` - Close button located on the top navigation bar
    2. `ticket.deleteTicketClick` - Delete button located on the top navigation bar
    3. `ticket.propertiesUpdated` - ticket property and clicks the Update button on
    4. `ticket.sendReply` - SEND button

### New ticket page events

1. **New ticket page events** are triggered when a user changes:
    1. `ticket.priorityChanged` - priority of a ticket.
    2. `ticket.statusChanged` - status of a ticket.
    3. `ticket.groupChanged` - group to which a ticket is assigned.
    4. `ticket.agentChanged` - agent to whom a ticket is assigned.
    5. `ticket.typeChanged` - type of a ticket.

---

>title: how to use events methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, events_method
>context: 
>content:

# how to use events methods supported for support ticket module in Freshdesk

## Use `ticket.conversationForward` event

```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("ticket.conversationForward", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

## Use `ticket.propertiesUpdated` event

```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("ticket.propertiesUpdated", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, interface_methods
>context: 
>content:

# what are interface methods supported for support ticket module in Freshdesk

## Interface methods

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Display or hide CTI dialler
5. Display or hide missed calls in the CTI widget
6. `click` method on Open Ticket or Contact details page

---

>title: how to use interface methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, interface_methods
>context: 
>content:

# how to use interface methods supported for support ticket module in Freshdesk

## Show modal or dialog

```js
try {
  let data = client.interface.trigger('showDialog', {
    title: 'Sample Dialog',
    template: 'dialog.html'
  });
  console.log(data); // success message
} catch (error) {
  // failure operation
  console.error(error);
}
```

## Display notifications

```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
})
```

---

>title: what are instance methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, instance_methods
>context: 
>content:

# what are instance methods supported for support ticket module in Freshdesk

Instance methods supported are

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.

---

>title: how to use instance methods supported for support ticket module in Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, instance_methods
>context: 
>content:

# how to use instance methods supported for support ticket module in Freshdesk

## Send data from a parent placeholder to a modal and retrieve the context/data in the modal

### In parent UI

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

### In modal UI

```js
try {
  let context = await client.instance.context();
  console.log("Modal instance method context", context);
  /* Output: Modal instance method context
  {
    instanceId: "4",
    location: "modal",
    parentId: "1",
    modalData: {name: "James", email: "James@freshworks.com"}
  }*/
} catch (error) {
  console.error(error);
}
```

## Send data from a modal to a parent placeholder and get the data in the parent

### In parent UI

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  /* Output:
  {
    senderId: "4",
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    }
  }*/
});
```

### In modal UI

```js
client.instance.send({
  message: {
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
/* message can be a string, object, or array */
```

## Send data from one instance to another instance and receive data at the destination

### In placeholder 1

```js
client.instance.get().then(function(data) {
  console.log(data);
  /* output: [
    {
      instanceId: "1",
      location: "place_holder1"
    },
    {
      instanceId: "2",
      location: "place_holder2"
    }
  ]; */
  var pl2App = data.find(x => x.location === "place_holder2");
  client.instance.send({
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    },
    receiver: pl2App.instanceId
  });
  /* 2 - instance ID of the receiver */
});
```

### In placeholder 2

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log(data);
  /* Output:
  {
    senderId: "1",
    message: {
      name: "James",
      email: "james.dean@freshworks.com"
    }
  }*/
});
```

---

>title: what are the serverless events supported by support ticket module of Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by support ticket module of Freshdesk

An app built for this module can react to the following events.

## Common events

In the app manifest, configure these events at `modules.common`.
1. App set-up events:
   1. `onAppInstall`
   2. `afterAppUpdate`
   3. `onAppUninstall`
2. External events:
   1. `onAppInstall`
   2. `onExternalEvent`
   3. `onAppUninstall`
3. Scheduled events

## Product-specific events

In the app manifest, configure these events at `modules.support_ticket`.
1. `onTicketCreate`
2. `onTicketUpdate`
3. `onTicketDelete`
4. `onTimeEntryCreate`
5. `onTimeEntryUpdate`
6. `onTimeEntryDelete`
7. `onTicketFieldCreate`
8. `onTicketFieldDelete`
9. `onConversationCreate`
10. `onConversationUpdate`
11. `onConversationDelete`
12. `onCannedResponseCreate`
13. `onCannedResponseUpdate`
14. `onCannedResponseDelete`

---

>title: how to configure product events supported by support ticket module of Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by support ticket module of Freshdesk

## Subscribe to an event

Configure an event listener in `manifest.json`:
```json
{
"events": {
  "<productEventName>": {
      "handler": "<eventCallbackMethod>"
    }
  }
}
```

## Callback function definition

In `server.js` file under the exports block, enter the callback function definition as follows:
```js
exports = {
  // args is a JSON block containing the payload information
  // args["iparam"] will contain the installation parameter values
  // eventCallbackMethod is the call-back function name specified in manifest.json
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(payload));
  }
};
```

## Use the appropriate payload attribute for callback

```json
{
  "currentHost": {
    "subscribed_modules": [ "support_ticket" ],
    "endpoint_urls": {
      "freshdesk": "value"
    }
  },
  "data": {
    //Contains the list of objects related to the event.
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
>title: how to configure ticket events supported by support ticket module of Freshdesk
>tags: module=support_ticket, support_ticket, freshdesk, product_events, ticket_events
>context: manifest.json, server.js
>content:

# how to configure ticket events supported by support ticket module of Freshdesk

## Summary
1. Subscribe to ticket events in `manifest.json`  
2. Define the event callback in `server.js`  
3. Use the payload structure in your handler

## Step 1: Subscribe to ticket events
Configure an event listener in your `manifest.json`:

```json
"events": {
  "onTicketCreate": {
    "handler": "onTicketCreateCallback"
  }
}
```

## Step 2: Define the event callback in `server.js`
Under the `exports` block in `server.js`, add:

```js
exports = {
  onTicketCreateCallback: function(payload) {
    console.log(
      "Logging arguments from onTicketCreate event: " +
      JSON.stringify(payload)
    );
  }
};
```

## Step 3: Use the payload structure
Your handler receives a payload with this structure:

```js
{
  "currentHost": {
    "subscribed_modules": ["support_ticket"],
    "endpoint_urls": {
      "freshdesk": "https://subdomain.freshdesk.com"
    }
  },
  "data": {
    "actor": {
      "account_id": 13,
      "active": true,
      "address": "Baker street, London.",
      "city": "chennai",
      "country": "India",
      "description": "Developer Websites - Freshdesk",
      "email": "minerva@freshdesk.com",
      "external_id": 21,
      "extn": 123,
      "first_name": "Minerva",
      "helpdesk_agent": true,
      "id": 48,
      "job_title": "Seller",
      "preferences": {},
      "password_expiry_date": "2120-10-17 05:21:53 UTC",
      "user_preferences": {}
    },
    "privileges": "1932488977107057189806079",
    "requester": {
      "created_at": "2021-11-05T12:45:13Z",
      "email": "rachel@freshdesk.com",
      "id": 48014615863,
      "language": "en",
      "mobile": "3545643254",
      "name": "Rachel",
      "phone": "9876523315"
    },
    "ticket": {
      "account_id": 13,
      "attachment_ids": [],
      "attachments": [],
      "bcc_emails": [],
      "cc_emails": [
        "diana@freshdesk.com",
        "ram@freshdesk.com"
      ],
      "company_id": 2,
      "custom_fields": {}
    }
  },
  "event": "onTicketCreate",
  "region": "US",
  "timestamp": 1636116313.9754386
}
```


---

>title: what are the REST APIs supported by support ticket module of Freshdesk  
>tags: module=support_ticket, support_ticket, freshdesk, rest_api  
>context:  
>content:

# what are the REST APIs supported by support ticket module of Freshdesk

## Summary
1. Tickets Endpoints  
2. Admin Endpoints  
3. Ticket Forms Endpoints  
4. Conversation Endpoints  
5. Canned Response Endpoints  
6. Time Entry Endpoints  

## 1. Tickets Endpoints
- `POST   /api/v2/tickets`
- `POST   /api/v2/tickets/outbound_email`
- `GET    /api/v2/tickets/[id]`
- `GET    /api/v2/tickets/[id]/associated_tickets`
- `GET    /api/v2/tickets`
- `GET    /api/v2/search/tickets?query=[query]`
- `PUT    /api/v2/tickets/[id]`
- `POST   /api/v2/tickets/bulk_update`
- `POST   /api/v2/tickets/[id]/forward`
- `PUT    /api/v2/tickets/merge`
- `GET    /api/v2/tickets/[id]/watchers`
- `POST   /api/v2/tickets/[id]/watch`
- `PUT    /api/v2/tickets/[id]/unwatch`
- `PUT    /api/v2/tickets/bulk_watch`
- `PUT    /api/v2/tickets/bulk_unwatch`
- `DELETE /api/v2/tickets/[id]`
- `POST   /api/v2/tickets/bulk_delete`
- `DELETE /api/v2/attachments/[id]`
- `PUT    /api/v2/tickets/[id]/restore`
- `GET    /api/v2/ticket_fields`
- `GET    /api/v2/tickets/[id]/conversations`
- `GET    /api/v2/tickets/[id]/time_entries`
- `GET    /api/v2/tickets/[ticket_id]/satisfaction_ratings`
- `GET    /api/v2/tickets/[id]/summary`
- `PUT    /api/v2/tickets/[id]/summary`
- `DELETE /api/v2/tickets/[id]/summary`
- `GET    /api/v2/tickets/archived/[id]`
- `DELETE /api/v2/tickets/archived/[id]`
- `GET    /api/v2/tickets/archived/[id]/conversations`
- `POST   /api/v2/tickets/[id]/accesses`
- `PATCH  /api/v2/tickets/[id]/accesses`
- `GET    /api/v2/tickets/[id]/accesses`
- `DELETE /api/v2/tickets/[id]/accesses`

## 2. Admin Endpoints
- `GET    /api/v2/admin/ticket_fields`
- `POST   /api/v2/admin/ticket_fields`
- `GET    /api/v2/admin/ticket_fields/[id]`
- `PUT    /api/v2/admin/ticket_fields/[id]`
- `DELETE /api/v2/admin/ticket_fields/[id]`
- `GET    /api/v2/admin/ticket_fields/[id]/sections`
- `POST   /api/v2/admin/ticket_fields/[id]/sections`
- `GET    /api/v2/admin/ticket_fields/[id]/sections/[section_id]`
- `PUT    /api/v2/admin/ticket_fields/[id]/sections/[section_id]`
- `DELETE /api/v2/admin/ticket_fields/[id]/sections/[section_id]`

## 3. Ticket Forms Endpoints
- `GET    /api/v2/ticket-forms`
- `POST   /api/v2/ticket-forms`
- `GET    /api/v2/ticket-forms/[id]`
- `PUT    /api/v2/ticket-forms/[id]`
- `DELETE /api/v2/ticket-forms/[id]`
- `CLONE  /api/v2/ticket-forms/[id]`
- `GET    /api/v2/ticket-forms/[form-id]/fields/[field-id]`
- `POST   /api/v2/ticket-forms/[form-id]/fields/[field-id]`
- `DELETE /api/v2/ticket-forms/[form-id]/fields/[field-id]`

## 4. Conversation Endpoints
- `POST   /api/v2/tickets/[id]/reply`
- `POST   /api/v2/tickets/[ticket_id]/notes`
- `PUT    /api/v2/conversations/[id]`
- `DELETE /api/v2/conversations/[id]`
- `POST   /api/v2/tickets/[id]/reply_to_forward`

## 5. Canned Response Endpoints
- `POST   /api/v2/canned_responses`
- `GET    /api/v2/canned_responses/[id]`
- `PUT    /api/v2/canned_responses/[id]`
- `POST   /api/v2/canned_responses/bulk`
- `POST   /api/v2/canned_response_folder`
- `PUT    /api/v2/canned_response_folder/[id]`
- `GET    /api/v2/canned_response_folders`
- `GET    /api/v2/canned_response_folders/[id]`
- `GET    /api/v2/canned_response_folders/[id]/responses`

## 6. Time Entry Endpoints
- `POST   /api/v2/tickets/[ticket_id]/time_entries`
- `GET    /api/v2/time_entries`
- `PUT    /api/v2/time_entries/[id]`
- `PUT    /api/v2/time_entries/[time_entry_id]/toggle_timer`
- `DELETE /api/v2/time_entries/[id]`

---