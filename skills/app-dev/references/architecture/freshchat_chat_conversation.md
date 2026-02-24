>title: what is chat conversation in Freshcaller
>tags: module=chat_conversation, chat_conversation, freshchat
>context:
>content:

# what is chat conversation in Freshcaller

Chat conversation Module Usage is allowed for the following subscriptions:

## Subscriptions Allowed
1. A stand-alone Freshchat subscription.
2. A Freshsales Suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller
3. A Freshsales Suite subscription that subscribes to only Freshchat.
4. A Freshsales Suite subscription that subscribes to only Freshcaller.
5. A Freshsales Suite subscription that subscribes to only Freshsales Classic.

## App Types Allowed
This module allows users to build:
1. Front-end apps
2. Serverless apps
3. Full stack SMI apps

---

>title: what are the placeholders supported for chat conversation in Freshcaller
>tags: module=chat_conversation, chat_conversation, freshchat
>context: manifest.json
>content:

# what are the placeholders supported for chat conversation in Freshcaller

## Supported Common Placeholders
- In the app manifest, configure these placeholders under `modules.common`:
  1. Full page app as `full_page_app`
  2. Left CTI Navigation as `left_nav_cti`

## Module-Specific Placeholders
- In the app manifest, configure these under `modules.chat_conversation`:
  1. Conversation message editor as `conversation_message_editor`
  2. Conversation user information as `conversation_user_info`
  3. Conversation background as `conversation_background`

---
>title: how to use placeholders supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat
>context: manifest.json
>content:

# how to use placeholders supported for chat conversation in Freshcaller

To use the supported placeholder modify your `manifest.json` as below 

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "location": {
        "full_page_app": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "left_nav_cti": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      },
      "requests": {}
    },
    "chat_conversation": {
      "location": {
        "conversation_message_editor": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "conversation_user_info": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "conversation_background": {
          "url": "myfirstapp.html"
        }
      }
    }
  }
}
```

---
>title: How to Write an App for Background Placeholders for chat_conversation, module
>tags: module=chat_conversation, chat_conversation, freshchat
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for chat_conversation, module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **chat_conversation,** module supports these background placeholders:

- `conversation_background`: The app runs in the background of the Team Inbox page

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

In your `manifest.json`, under the `chat_conversation,` module, add the background placeholders to the `location` block. For example:

```json
"chat_conversation,": {
  "events": {
    "onConversationUpdate": {
      "handler": "onConversationUpdateCallback"
    }
  },
  "location": {
    "conversation_background": {
    "url": "conversation_background.html" 
    }
  }
}
```

### Step 2. Create the Background HTML

Even though it’s not visible, each placeholder URL needs a corresponding HTML file. Typically, `background.html` looks like:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="{{{appclient}}}"></script>
    <title>Background</title>
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
  console.log(`conversation_background:  app is activated`);
});
```


---
>title: what are data methods supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat, data_method
>context: apps.js
>content:

# what are data methods supported for chat conversation in Freshcaller

## Summary
1. **Global Data Methods**  
2. **Placeholder-Specific Data Methods**

## Global Data Methods
Use `client.data.get()` to retrieve objects regardless of where the app is deployed:
- **`currentHost`** – The current host configuration.  
- **`loggedInAgent`** – Information about the agent logged into the Freshworks UI or widget.  
- **`loggedInUser`** – Information about the user (only available for apps on Freshsales Suite).

## Placeholder-Specific Data Methods
Use `client.data.get()` to retrieve conversation context:
- **`user`** – Retrieves information about the conversation participant.  
- **`conversation`** – Retrieves details about the current chat conversation.

---

>title: example of data method usage supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat, data_method
>context: apps.js
>content:

# example of data method usage supported for chat conversation in Freshcaller

## Example 1: Retrieve Logged-In Agent Data
```js
async function getLoggedInAgentData() {
  try {
    const data = await client.data.get("loggedInAgent");
    // success: data is { loggedInAgent: { available: "true", ... } }
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
getLoggedInAgentData();
```

## Example 2: Retrieve Conversation User Data
```js
async function getUserData() {
  try {
    const data = await client.data.get("user");
    // success: data is { user: { id: "2681d294-3460-4f32-b5fb-828958995b5c", ... } }
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
getUserData();
```

---
>title: what are events methods supported for chat conversation in Freshcaller
>tags: module=chat_conversation, chat_conversation, freshchat, events_method
>context: manifest.json
>content:

# what are events methods supported for chat conversation in Freshcaller

## For Left CTI Placeholder
- When deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when:
  - A user clicks the call icon or phone number link on:
    - Contact list page > Contact hover card > Make call widget
    - Contact list page > Work phone field
    - Contact details page > Work phone and Mobile fields
    - Contact details page > Make call widget

## For Conversation Editor Page
### Click Events
- `conversation.onPrivateNoteClick` – When an agent clicks the Private Note button.
- `conversation.onSendClick` – When a user clicks Send, presses Enter, or clicks Send in FAQs.
- `conversation.onCobrowseClick` – When an agent clicks the Cobrowse button.
- `conversation.onCannedResponseClick` – When an agent clicks the Canned Response button.
- `conversation.onAttachFAQClick` – When an agent clicks the FAQs button.
- `conversation.onAttachFileClick` – When an agent clicks the Attach File button.
- `conversation.onChooseFileClick` – When a user clicks the Choose File button.
- `conversation.onQuickAccessClick` – When an agent clicks the Quick Access button.
- `conversation.onAttachImageClick` – When a user clicks the Attach Image button.
- `conversation.onEmojiClick` – When a user clicks the Emoji button.
- `conversation.onResolveClick` – When an agent clicks the Resolve button.
- `conversation.onResolveAndCreateTicketFDClick` – When an agent clicks Resolve And Create Ticket Freshdesk.
- `conversation.onResolveAndCreateTicketFSClick` – When an agent clicks Resolve And Create Ticket Freshsales.

### Intercept Events
- `conversation.onSendMessage` – Triggered when a message send is initiated.
- `conversation.onResolveClick` – Triggered on clicking the Resolve button.
- `conversation.onReopenClick` – Triggered when a user clicks the Reopen button.

## For User Details Page
### Change Events
- `user.saveCustomPropertyClick` – When an agent saves a changed user property.
- `user.onSaveNameClick` – When an agent saves a user’s name change.
- `user.onSavePhoneClick` – When an agent saves a phone number change.
- `user.onSaveEmailClick` – When an agent saves an email address change.

---

>title: how to use events methods supported for chat conversation in Freshcaller
>tags: module=chat_conversation, chat_conversation, freshchat, events_method
>context: apps.js
>content:

# how to use events methods supported for chat conversation in Freshcaller

## Overview
To enable your app to react to front-end events:
1. Subscribe to the `app.initialized` event to obtain a client reference.
2. Use the client reference to subscribe to specific events and register callback methods.

## Example 1: Using `conversation.onPrivateNoteClick`
```js
var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // Process the event data as needed
};

// Subscribe to the event
client.events.on("conversation.onPrivateNoteClick", eventCallback);
```

### Example 2: Using `conversation.onAttachImageClick`

```js
var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // Process the event data as needed
};

// Subscribe to the event
client.events.on("conversation.onAttachImageClick", eventCallback);
```

---
>title: what are interface methods supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat, interface_methods
>context: apps.js
>content:

# what are interface methods supported for chat conversation in Freshcaller

## Summary
1. Display UI Elements  
2. Show Confirmation Messages  
3. Display Notifications  
4. Control UI Element Visibility & State  
5. Set Field Values

## 1. Display UI Elements
- **`showModal` / `showDialog`** – Render modal or dialog windows.

## 2. Show Confirmation Messages
- **`showConfirm`** – Display confirmation dialogs to the user.

## 3. Display Notifications
- **`showNotify`** – Show notifications with types: `info`, `success`, `warning`, `danger`, `alert`.

## 4. Control UI Element Visibility & State
- **`client.interface.trigger("<method-name>", {id: "<element-name>"})`**  
  - `<method-name>`: `hide`, `show`, `enable`, `disable`  
  - Control elements in the Conversation window, Contact Info widget, or Custom Contact Properties widget.

## 5. Set Field Values
- **`client.interface.trigger("setValue", {id: "<element-name>", value: "<value>"})`**  
  - Programmatically set the value of a UI field.

---

>title: how to use interface methods supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for chat conversation in Freshcaller

## Summary
1. Show Add Attachment Option  
2. Show CoBrowse Option

## Example 1: Show Add Attachment Option
```js
try {
  let data = await client.interface.trigger("show", {
    id: "addAttachment"
  });
  console.log(data); // success message
} catch (error) {
  console.error(error); // failure operation
}
```

## Example 2: Show CoBrowse Option
```js
try {
  let data = await client.interface.trigger("show", {
    id: "coBrowse"
  });
  console.log(data); // success message
} catch (error) {
  console.error(error); // failure operation
}
```

---

>title: what are instance methods supported for chat conversation in Freshcaller  
>tags: chat_conversation, freshchat, instance_methods  
>context: apps.js  
>content:

# what are instance methods supported for chat conversation in Freshcaller

## Summary
1. Resize Instance  
2. Close Instance  
3. Inter-Instance Communication  
4. Retrieve Instance Context

## 1. Resize Instance
- **`client.instance.resize({ height: "<pixels>" })`** – Adjust the height of the app frame.

## 2. Close Instance
- **`client.instance.close()`** – Programmatically close the app instance.

## 3. Inter-Instance Communication
- **`context()`, `send()`, `receive()`, `get()`** –  
  1. Send data from parent placeholder to modal and retrieve context there.  
  2. Send data from modal back to parent.  
  3. Send data between any two instances.

## 4. Retrieve Instance Context
- **`client.instance.context()`** – Returns:
  - **In Modal:** Modal’s instance ID, placeholder name, parent instance ID, passed data.  
  - **In Parent:** Parent instance ID and placeholder name.

---
>title: how to use instance methods supported for chat conversation in Freshcaller
>tags: chat_conversation, freshchat, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for chat conversation in Freshcaller

## Summary
1. Parent → Modal Communication  
2. Modal → Parent Communication  
3. Instance → Instance Communication

## Example 1: Parent → Modal Communication

### In Parent UI
```js
try {
  await client.interface.trigger("showModal", {
    title: "Information Form",
    template: "modal.html",
    data: { name: "James", email: "James@freshworks.com" }
  });
} catch (error) {
  console.error(error);
}
```

### In Modal UI
```js
try {
  let context = await client.instance.context();
  console.log("Modal context:", context);
  /* Output:
  {
    instanceId: "4",
    location: "modal",
    parentId: "1",
    modalData: { name: "James", email: "James@freshworks.com" }
  }
  */
} catch (error) {
  console.error(error);
}
```
## Example 2: Modal → Parent Communication

### In Parent UI
```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log("Received from modal:", data);
});
```

### In modal UI
```js
client.instance.send({
  message: { name: "James", email: "james.dean@freshworks.com" }
});
```

## Example 3: Instance → Instance Communication

### In Placeholder 1

```js
client.instance.get().then(function(instances) {
  let target = instances.find(i => i.location === "place_holder2");
  client.instance.send({
    message: { name: "James", email: "james.dean@freshworks.com" },
    receiver: target.instanceId
  });
});
```

### In Placeholder 2

```js
client.instance.receive(function(event) {
  let data = event.helper.getData();
  console.log("Received from instance1:", data);
});
```

---

>title: what are the serverless events supported by chat conversation of Freshcaller  
>tags: module=chat_conversation, chat_conversation, freshchat, serverless_events  
>context: manifest.json  
>content:

# what are the serverless events supported by chat conversation of Freshcaller

## Common Events (Configured under `modules.common`)
- **App Set-Up Events:**
  - `onAppInstall`
  - `afterAppUpdate`
  - `onAppUninstall`
- **External Events:**
  - `onAppInstall`
  - `onExternalEvent`
  - `onAppUninstall`
- **Scheduled Events**

## Product-Specific Events (Configured under `modules.chat_conversation`)
- `onConversationCreate`
- `onConversationUpdate`
- `onMessageCreate`
- `onAgentActivityCreate`

---

>title: how to configure product events supported by chat conversation of Freshcaller
>tags: module=chat_conversation, chat_conversation, freshchat, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by chat conversation of Freshcaller

## Steps to Configure Product Events

### Step 1: Configure the Event in manifest.json
```json
{
  "events": {
    "<productEventName>": {
      "handler": "<eventCallbackMethod>"
    }
  }
}
```

### Step 2: Define the Callback in server.js

```js
exports = {
  // eventCallbackMethod receives the payload in args
  eventCallbackMethod: function(args) {
    console.log("Logging arguments from the event: " + JSON.stringify(args));
  }
};
```

### Step 3: Example Payload Syntax

```js
{
  "currentHost": {
    "subscribed_modules": ["chat_conversation"],
    "endpoint_urls": {
      "freshcaller": "value"
    }
  },
  "data": {
    "example_key": "example_value"
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

>title: how to configure events supported by chat conversation of Freshcaller  
>tags: module=chat_conversation, chat_conversation, freshchat, product_events  
>context: manifest.json, server.js  
>content:

# how to configure events supported by chat conversation of Freshcaller

## Steps to Configure Events

### Step 1: Subscribe to an Event in manifest.json
```json
{
  "events": {
    "onConversationCreate": {
      "handler": "onConversationCreateCallback"
    }
  }
}
```

### Step 2: Define the Callback in server.js

```js
exports = {
  onConversationCreateCallback: function(payload) {
    console.log("Logging arguments from onConversationCreateCallback event: " + JSON.stringify(payload));
  }
};
```

### Step 3: Use the Appropriate Payload Attribute for Callback

```json
{
  "currentHost": {
    "subscribed_modules": ["chat_conversation"],
    "endpoint_urls": {
      "freshchat": "https://subdomain.freshchat.com",
      "freshworks_crm": "https://subdomain.myfreshworks.com"
    }
  },
  "data": {
    "actor": {
      "avatar": {
        "url": "https://s3.amazonaws.com/fresh-chat-names/img/john_doe.png"
      },
      "email": "john.doe@gmail.com",
      "first_name": "John",
      "id": "98c76ba0-6b38-499b-9c37-e104774276b8",
      "last_name": "Doe",
      "phone": "9876543212",
      "type": "user"
    },
    "associations": {
      "channel": {},
      "group": {},
      "user": {}
    },
    "conversation": {
      "app_id": "032c91b6-4b46-4f5b-adcb-102c72cd4efa",
      "assigned_group_id": "40753ac3-1f66-40d9-b903-23db0a9a70b0",
      "channel_id": "167e73ff-9dd5-4e2d-8c50-74161b38a6fe",
      "conversation_id": "8c65b83e-5be0-45f4-9645-9ddbbe015f4d",
      "messages": [],
      "response_due_type": "FIRST_RESPONSE_DUE",
      "status": "new",
      "user_id": "98c76ba0-6b38-499b-9c37-e104774276b8"
    }
  },
  "event": "onConversationCreate",
  "region": "US",
  "timestamp": 1564392319214,
  "version": "1.0.0"
}
```

---

>title: what are the REST APIs supported by chat conversation module of Freshdesk  
>tags: module=chat_conversation, chat_conversation, freshchat, rest_api  
>context: manifest.json  
>content:

# what are the REST APIs supported by chat conversation module of Freshdesk

The Freshchat chat conversation module supports the following REST APIs:

- `POST /conversations`
- `GET /conversations/{conversation_id}`
- `PUT /conversations/{conversation_id}`
- `GET /conversations/{conversation_id}/messages`
- `POST /conversations/{conversation_id}/messages`
- `GET /conversations/fields`

---