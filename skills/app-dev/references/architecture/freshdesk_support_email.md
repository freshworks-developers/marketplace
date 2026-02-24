>title: what is support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk
>context: 
>content:

# What is Support Email Module in Freshdesk

An app user with a stand-alone Freshdesk subscription or a subscription to any SKU that has Freshdesk as one of the products can use this module. Using this module, you can build a front-end app, a serverless app, and also a full-stack SMI app for the Freshdesk Email feature. It allows the app to react to app set-up events, external events, or scheduled events but not product-specific events.

---

>title: what are the placeholders supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk
>context: 
>content:

# What are the Placeholders Supported for Support Email Module in Freshdesk

## List of Placeholders

1. It supports the following placeholders in the `modules.common` section:
   - Full Page App as `full_page_app`
   - CTI Global sidebar as `cti_global_sidebar`

2. It supports the following placeholders in the `modules.support_email` section:
   - New Email Requester Information as `new_email_requester_info`
   - New Email Background as `new_email_background`

---

>title: how to use placeholders supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk
>context: manifest.json
>content:

# How to Use Placeholders Supported for Support Email Module in Freshdesk

To use the Support Email placeholder, modify your `manifest.json` as shown below:

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
    "support_email": {
      "location": {
        "new_email_requester_info": {
          "url": "new_email_requester_info.html",
          "icon": "styles/images/icon.svg"
        },
        "new_email_background": {
          "url": "index.html"
        }
      }
    }
  }
}
```

---
>title: How to Write an App for Background Placeholders for support_email module
>tags: module=support_email, support_email, freshdesk
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for support_email module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.


## In **Platform 3.0**, the **support_emailt** module supports these background placeholders:

- `new_email_background`: The app runs in the background of the New email page of Freshdesk.

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

In your `manifest.json`, under the `support_email` module, add the background placeholders to the `location` block. For example:

```json
"support_email": {
  "location": {
    "new_email_background": {
    "url": "background.html"
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
  console.log(`new_email_background:  app is activated`);
});
```

---

>title: data methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, data_method
>context: 
>content:

# Data Methods Supported for Support Email Module in Freshdesk

You can use the `client.data.get()` data method to retrieve the following objects.

## List of Data Methods

1. Objects accessible regardless of the placeholders:
   - currentHost
   - loggedInUser

2. Placeholder-specific objects: An app deployed in the New Email page can retrieve the following objects:
   - email_config
   - <field-name>_options:
     - `client.data.get("status_options")`
     - `client.data.get("priority_options")`
     - `client.data.get("ticket_type_options")`
     - `client.data.get("customfield_options")`

---

>title: example of data method usage supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk
>context: 
>content:

# Example of Data Method Usage Supported for Support Email Module in Freshdesk

## Data Method Examples

### 1. To Use `currentHost` Method

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: ["contact", "deal", ... ]}
  } catch (error) {
    // failure operation
  }
}
getCurrentHostData();
```

### 2. To Get `loggedInUser` Information

```js
async function getLoggedInUserData() {
  try {
    const data = await client.data.get("loggedInUser");
    // success operation
    // "data" is {loggedInUser: {‘available’: "true", ... }}
  } catch (error) {
    // failure operation
  }
}

getLoggedInUserData();
```

### 3. For Other Options

```js
async function getEmailConfig() {
  try {
    const data = await client.data.get("email_config");
    console.log("Success output", data);
    // process the data here
  } catch (error) {
    console.log("Error:", error);
    // handle the error here
  }
}

getEmailConfig();
```

---

>title: what are events methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, events_method
>context: 
>content:

# What are the Events Methods Supported for Support Email Module in Freshdesk

## List of Events Methods

### 1. Common Event

An app deployed at cti_global_sidebar can react to the `cti.triggerDialer` event. It gets triggered when a user clicks on:

   - Ticket details page > CONTACT DETAILS widget
   - Ticket list page > Contact hover card
   - New ticket page > CONTACT DETAILS widget
   - Contact list page > Contact hover card
   - Contact details page > Contact header and DETAILS widget

### 2. Placeholder-specific Events

An app deployed in the New Email page can react to the following front-end events:

   - `ticket.fromChanged`
   - `ticket.priorityChanged`
   - `ticket.statusChanged`
   - `ticket.groupChanged`
   - `ticket.agentChanged`
   - `ticket.typeChanged`

---

>title: how to use events methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, events_method
>context: 
>content:

# How to Use Events Methods Supported for Support Email Module in Freshdesk

## Events Methods Examples

### 1. To Use `cti.triggerDialer`

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("cti.triggerDialer", eventCallback);
  var eventCallback = function (event) {
    //Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

### 2. For New Email Page Events Use `ticket.<event>`

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("ticket.fromChanged", eventCallback);
  var eventCallback = function (event) {
    //Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, interface_methods
>context: 
>content:

# What are the Interface Methods Supported for Support Email Module in Freshdesk

## List of Interface Methods

### 1. Display Modals or Dialog Boxes

   - `showModal` method
   - `showDialog` method

### 2. Display Notifications

   - `showNotify` method - it supports `info`, `success`, `warning`, `danger`, and `alert`

### 3. Display Confirmation Messages

   - `showConfirm` method

### 4. Open Ticket or Contact Details Page

   - `click` method

### 5. Display or Hide CTI Dialer

   - `show` or `hide` method - for dialer

### 6. Display or Hide Missed Calls

   - `show` or `hide` method - for the number of missed calls on the CTI widget

---

>title: how to use interface methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, interface_methods
>context: 
>content:

# How to Use Interface Methods Supported for Support Email Module in Freshdesk

## Interface Methods Examples

### 1. To Show Modal or Dialog

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

### 2. To Display Confirmation Message

```js
try {
  let result = await client.interface.trigger("showConfirm", {
    title: "Confirm", // plain text
    message: "Do you want to save the changes?",
    saveLabel: "Save",
    cancelLabel: "Ignore"
  });
  console.log(result);
  /* "result" will be either "Save" or "Ignore" */
} catch (error) {
  // failure operation
  console.error(error);
}
```

### 3. To Display Notifications

```js
client.interface.trigger("showNotify", {
  type: "<Possible values: info, success, warning, danger, alert>",
  title: "<Display name>",
  message: "<text message to be displayed in the notification box>"
});
```

### 4. To Show or Hide Missed Calls

```js
try {
  let data = await client.interface.trigger("show", {
    id: "missedCall"
  });
  console.log(data); // success message
} catch (error) {
  // failure operation
  console.error(error);
}
```

---

>title: what are instance methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, instance_methods
>context: 
>content:

# What are the Instance Methods Supported for Support Email Module in Freshdesk

## List of Instance Methods

1. `client.instance.resize()` to resize the instance:
   ```js
   client.instance.resize({ height: "<height in pixels>" });
   ```

2. `client.instance.close()` to close the instance

3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.

---

>title: how to use instance methods supported for support email module in Freshdesk
>tags: module=support_email, support_email, freshdesk, instance_methods
>context: 
>content:

# How to Use Instance Methods Supported for Support Email Module in Freshdesk

1. To Send Data from a Parent Placeholder to a Modal and Retrieve the Context/Data in the Modal

  - In Parent UI

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

  - In Modal UI

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

2. To Send Data from a Modal to a Parent Placeholder and Get the Data in the Parent

  - In Parent UI

```js
client.instance.receive(
  function(event) {
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
  }
);
```

  - In Modal UI

```js
client.instance.send({
  message: {
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
/* message can be a string, object, or array */
```

3. To Send Data from One Instance to Another Instance and Receive Data at the Destination

  - In Placeholder 1

```js
client.instance.get().then(
  function(data) {
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
  }
);
```

  - In Placeholder 2

```js
client.instance.receive(
  function(event) {
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
  }
);
```

---

>title: what are the serverless events supported by support email module of Freshdesk
>tags: module=support_email, support_email, freshdesk, serverless_events
>context: manifest.json
>content:

# What are the Serverless Events Supported by Support Email Module of Freshdesk

An app built for this module can react to the following events.

## Common Events

In the app manifest, configure these events at `modules.common`.

### 1. App Set-up Events

   - `onAppInstall`
   - `afterAppUpdate`
   - `onAppUninstall`

### 2. External Events

   - `onAppInstall`
   - `onExternalEvent`
   - `onAppUninstall`

### 3. Scheduled Events

---

>title: what are the REST APIs supported by support email module of Freshdesk
>tags: module=support_email, support_email, freshdesk, rest_api
>context: 
>content:

# What are the REST APIs Supported by Support Email Module of Freshdesk

The Freshdesk support email module supports the following APIs:

## List of REST APIs

1. `POST /api/v2/email/mailboxes`
2. `GET /api/v2/email/mailboxes/[id]`
3. `GET /api/v2/email/mailboxes`
4. `PUT /api/v2/email/mailboxes/[id]`
5. `DELETE /api/v2/email/mailboxes/[id]`
6. `PUT /api/v2/email/settings`
7. `GET /api/v2/email/settings`
8. `PUT /api/v2/notifications/email/bcc`
9. `GET /api/v2/notifications/email/bcc`

```