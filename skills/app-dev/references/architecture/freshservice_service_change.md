>title: what is service change module in Freshservice
>tags: module=service_change, service_change, freshservice
>context: 
>content:

# what is service change module in Freshservice

An app user with a stand-alone Freshservice subscription or a subscription to any SKU that has Freshservice as one of the products can use this module. Using this module you can build a front end app, a serverless app and also a full stack SMI app for Freshservice Change feature.

---

>title: what are the placeholders supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice
>context: manifest.json
>content:

# what are the placeholders supported for service change module in Freshservice

## Common Placeholders
It supports following Common placeholders. In the app manifest, configure these placeholders at modules.common.
  - Full Page App as `full_page_app`

## Module-specific Placeholders
It supports following Module-specific placeholders. In the app manifest, configure these placeholders at
  1. `change_sidebar`
  2. `new_change_sidebar`
  3. `new_change_background`
  4. `change_background`

---

>title: how to use placeholders supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice
>context: manifest.json
>content:

# how to use placeholders supported for service change module in Freshservice

To use the Support change placeholder modify your `manifest.json` as below:

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
    "service_change": {
      "location": {
        "change_sidebar": {
          "url": "change_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "new_change_sidebar": {
          "url": "new_change_sidebar.html",
          "icon": "styles/images/icon.svg"
        },
        "new_change_background": {
          "url": "new_change_background.html",
          "icon": "styles/images/icon.svg"
        },
        "change_background": {
          "url": "change_background.html",
          "icon": "styles/images/icon.svg"          
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, data_method
>context: 
>content:

# what are data methods supported for service change module in Freshservice

## Accessible Objects
You can use the `client.data.get()` data method to retrieve the following objects.

### Common Objects
Objects accessible regardless of the placeholders:
  1. currentHost
  2. loggedInUser

### Placeholder-specific Objects
An app deployed in the Change details page can retrieve the following objects:
  1. `change` - to retrieve information of the change.
  2. `requester` - to retrieve information of a requester/contact.
  3. `agent` - to retrieve information of an agent.
  4. `group` - to retrieve information of the group.
  5. `backoutPlan` - to retrieve description on the backoutPlan.
  6. `changeImpact` - to retrieve description of the change impact.
  7. `changePlan` - to retrieve information on the changePlan.
  8. `changeReason` - to retrieve information on the changeReason.

---

>title: How to Write an App for Background Placeholders for service_change module
>tags: module=service_change, service_change, freshservice
>context: manifest.json
>content:

# How to Write an App for Background Placeholders for service_change module

## What Are Background Placeholders

Background placeholders are entry points in the Freshworks Developer Platform where your app’s logic runs without rendering any UI to the agent. Unlike sidebar or modal placeholders that load HTML/CSS, background placeholders load an invisible page (e.g., `background.html`) and execute JavaScript in the background context.

## In **Platform 3.0**, the **service_change** module supports these background placeholders:

- `change_background`: The app runs in the background of the Change details page Freshservice.
- `new_change_background`: The app runs in the background of the New change page of Feshservice.

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

In your `manifest.json`, under the `service_change` module, add the background placeholders to the `location` block. For example:

```json
"service_change": {
  "events": {
    "onTicketUpdate": {
      "handler": "onTicketUpdateCallback"
    }
  },
  "location": {
    "change_background": {
    "url": "background.html"
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
    <title>Service Change</title>
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
  console.log(`service_change:  app is activated`);
});
```

---

>title: example of data method usage supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice
>context: 
>content:

# example of data method usage supported for service change module in Freshservice

## Retrieve Information of the Change

```js
async function getChangeDetails() {
  try {
    const data = await client.data.get("change");
    // success output
    // data is {"change": {"itil_change": {"approval_status": 4,"approval_status_name": "Not Requested"}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getChangeDetails();
```

## Retrieve Requester Information
```js
client.data.get("requester").then (
  function(data) {
    // success output
    // data is {requester: {"active": "true"}}
  },
  function(error) {
    // failure operation
  }
);
```

## Retrieve Change Reason
```js
async function getchangeReason() {
  client.data.get("changeReason").then (
    function(data) {
      // success output
      // data is {"changeReason": ...}
    },
    function(error) {
      // failure operation
    }
  );
}
getchangeReason();
```

---

>title: what are events methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, events_method
>context: 
>content:

# what are events methods supported for service change module in Freshservice

## Change Details Page Events

### Click Events on Change Details
1. `change.submitNote`: When a user clicks the Note Submit button.
2. `change.startTimer`: When a user clicks the Start Timer button.
3. `change.stopTimer`: When a user clicks the Stop Timer button.
4. `change.updateTimer`: When a user clicks the Update Timer button.
5. `change.deleteTimer`: When a user clicks the Delete Time Entry button.

### Change Events on Change Details
1. `change.priorityChanged`: When a user changes the priority of a change in the change properties.
2. `change.statusChanged`: When a user changes the status of a change in the change properties.
3. `change.groupChanged`: When a user changes the group assigned to a change.
4. `change.agentChanged`: When a user changes the agent assigned to a change.
5. `change.typeChanged`: When a user changes the type of a change in the change properties.
6. `change.impactChanged`: When a user changes the impact of a change in the change properties.
7. `change.riskChanged`: When a user changes the risk of a change in the change properties.
8. `change.departmentChanged`: When a user changes the department of a change in the change properties.
9. `change.categoryChanged`: When a user changes the category of a change in the change properties.
10. `change.subCategoryChanged`: When a user changes the sub-category of a change in the change properties.
11. `change.itemChanged`: When a user changes the category item of a change in the change properties.
12. `change.propertiesUpdated`: When a user updates any change property and clicks the update button.
13. `change.plannedStartDateChanged`: When a user changes the planned start date of a change in the change properties.
14. `change.plannedEndDateChanged`: When a user changes the planned end date of a change in the change properties.

## New Change Events Page Front-end Events (Change Events)
1. `change.priorityChanged`: When a user changes the priority of a change in the change properties.
2. `change.statusChanged`: When a user changes the status of a change in the change properties.
3. `change.groupChanged`: When a user changes the group assigned to a change.
4. `change.agentChanged`: When a user changes the agent assigned to a change.
5. `change.typeChanged`: When a user changes the type of a change in the change properties.
6. `change.impactChanged`: When a user changes the impact of a change in the change properties.
7. `change.riskChanged`: When a user changes the risk of a change in the change properties.
8. `change.departmentChanged`: When a user changes the department of a change in the change properties.
9. `change.categoryChanged`: When a user changes the category of a change in the change properties.
10. `change.subCategoryChanged`: When a user changes the sub-category of a change in the change properties.
11. `change.itemChanged`: When a user changes the category item of a change in the change properties.
12. `change.propertiesUpdated`: When a user updates any change property and clicks the update button.
13. `change.plannedStartDateChanged`: When a user changes the planned start date of a change in the change properties.
14. `change.plannedEndDateChanged`: When a user changes the planned end date of a change in the change properties.

---

>title: how to use events methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, events_method
>context: 
>content:

# how to use events methods supported for service change module in Freshservice

## Using change.startTimer
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("change.startTimer", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

## Using change.plannedEndDateChanged
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("change.plannedEndDateChanged", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---

>title: what are interface methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, interface_methods
>context: 
>content:

# what are interface methods supported for service change module in Freshservice

Using interface methods an app can, on the product UI:
1. Display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as starting or stopping a timer or navigating to specific pages.
3. Show/Hide certain fields, field values, and elements (such as icons or other relevant information).
4. Enable/Disable certain buttons.
5. Set the values of certain fields.

## Supported Interface Methods
Freshservice supports following interface methods:
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Hide/display or enable/disable UI elements using `client.interface.trigger("<method-name>", {id: "<element-name>"})` where `method-name` can be `hideElement`, and `showElement`
5. Set the value of a field element using `client.interface.trigger("setValue", {id:"<element-name>",value: "<value to be set>"})` where `<element-name>` is the element whose value is to be set, `window-name` can be `reply` or `forward`

For more information checkout [interface methods docs](https://freshworks.dev/docs/app-sdk/v3.0/service_change/front-end-apps/interface-methods/)

---

>title: how to use interface methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, interface_methods
>context: 
>content:

# how to use interface methods supported for service change module in Freshservice

## Show Modal or Dialog
```js
try {
  let data = client.interface.trigger('showModal', {
  title: 'Sample App Form',
  template: './views/modal.html' });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

## Display Notifications
```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
    }
)
```

## Show Change Properties
```js
try {
  let data = await client.interface.trigger("showElement", {
    id: "element-name"
  });
  console.log(data); // success message
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

title: what are instance methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, instance_methods
>context: app.js
>content:

# what are instance methods supported for service change module in Freshservice

## Summary of instance methods supported

1. **Resize Instance:**  
- To resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`

2. **Close Instance:**  
-To close the instance as  `client.instance.close();`

3. **Inter-Instance Communication:**  
Use the `context()`, `send()`, `receive()`, or `get()` methods to
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.

4. **Retrieve Context:**   
- To retrieve contextual information about a current app instance. 
   1. If a modal is the app instance where context() is used, it retrieves,
      - The (modal’s) instance id
      - The placeholder name of the app instance
      - The instance id of the parent that opened the modal
      - The data (if any) that was passed from the parent
   2. If context() is used in a parent placeholder, it retrieves,
      - The instance id
      - The placeholder name of the app instance

---
>title: how to use instance methods supported for service change module in Freshservice
>tags: module=service_change, service_change, freshservice, instance_methods
>context: app.js
>content:

# how to use instance methods supported for service change module in Freshservice

## To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
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
    modalData: {name: "James", email: "James@freshworks.com"} }"
    */
    } catch (error) {
    console.error(error);
    }
   ```
## To Send data from a modal to a parent placeholder and get the data in the parent.
   ### In parent UI
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
## To Send data from one instance to another instance and receive data at the destination
   ### In placeholder 1
   ```js
    client.instance.get().then(
    function(data) {
    console.log(data);
        /* output: [
        {
            instanceId: "1",
            location: "place_holder1"},
        {
            instanceId: "2",
            location: "place_holder2"}
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
   ### In placeholder 2
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
        }
        */
    }
    );
   ```
---

>title: what are the serverless events supported by service change module of Freshservice
>tags: module=service_change, service_change, freshservice, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by service change module of Freshservice

An app built for this module can react to the following events.

## Common Events
In the app manifest, configure these events at `modules.common`.

### App Set-up Events
1. `onAppInstall`
2. `afterAppUpdate`
3. `onAppUninstall`

### External Events
1. `onAppInstall`
2. `onExternalEvent`
3. `onAppUninstall`

### Scheduled Events

---

---
>title: how to configure product events supported by service change module of Freshservice
>tags: module=service_change, service_change, freshservice, product_events
>context:
>content:

# how to configure product events supported by service change module of Freshservice

Product events are not supported in service_change

---
>title: what are the REST APIs supported by service change module of Freshservice
>tags: module=service_change, service_change, freshservice, rest_api
>context:
>content:

# what are the REST APIs supported by service change module of Freshservice

The Freshservice service change module supports following APIs
It provides the endpoint along with Oauth scope required for every api

## Changes API

- `POST /api/v2/changes` - ITSM Scope: freshservice.changes.create, MSP Scope: freshservice.changes.create
- `GET /api/v2/changes/[id]` - ITSM Scope: freshservice.changes.view, MSP Scope: freshservice.changes.view
- `GET /api/v2/changes` - ITSM Scope: freshservice.changes.view, MSP Scope: freshservice.changes.view
- `PUT /api/v2/changes/[id]` - ITSM Scope: freshservice.changes.edit, MSP Scope: freshservice.changes.edit
- `GET /api/v2/change_form_fields` - ITSM Scope: freshservice.changes.view, MSP Scope: freshservice.changes.view
- `PUT /api/v2/changes/[id]/move_workspace` - ITSM Scope: freshservice.changes.edit, MSP Scope: freshservice.changes.edit
- `DELETE /api/v2/changes/[id]` - ITSM Scope: freshservice.changes.delete, MSP Scope: freshservice.changes.delete

### Change Approvals API
- `POST /api/v2/changes/[change_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/changes/[change_id]/approval-groups/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `PUT /api/v2/changes/[change_id]/approval-groups/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/changes/[change_id]/approval-groups` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/changes/[change_id]/approvals/[approval_id]` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `PUT /api/v2/changes/[change_id]/approvals/[approval_id]/remind` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit
- `GET /api/v2/changes/[change_id]/approvals` - ITSM Scope: freshservice.tickets.view, MSP Scope: freshservice.tickets.view
- `PUT /api/v2/changes/[change_id]/approvals/[id]` - ITSM Scope: freshservice.tickets.edit, MSP Scope: freshservice.tickets.edit

### Change Notes API
- `POST /api/v2/changes/[id]/notes` - ITSM Scope: freshservice.changes.notes.create, MSP Scope: freshservice.changes.notes.create
- `GET /api/v2/changes/[id]/notes` - ITSM Scope: freshservice.changes.notes.view, MSP Scope: freshservice.changes.notes.view
- `PUT /api/v2/changes/[id]/notes/[id]` - ITSM Scope: freshservice.changes.notes.edit, MSP Scope: freshservice.changes.notes.edit
- `DELETE /api/v2/changes/[id]/notes/[id]` - ITSM Scope: freshservice.changes.notes.delete, MSP Scope: freshservice.changes.notes.delete

### Change time Entries API
- `POST /api/v2/changes/[id]/time_entries` - ITSM Scope: freshservice.changes.time_entries.create, MSP Scope: freshservice.changes.time_entries.create
- `GET /api/v2/changes/[id]/time_entries/[id]` - ITSM Scope: freshservice.changes.time_entries.view, MSP Scope: freshservice.changes.time_entries.view
- `GET /api/v2/changes/[id]/time_entries` - ITSM Scope: freshservice.changes.time_entries.view, MSP Scope: freshservice.changes.time_entries.view
- `PUT /api/v2/changes/[id]/time_entries/[id]` - ITSM Scope: freshservice.changes.time_entries.edit, MSP Scope: freshservice.changes.time_entries.edit
- `DELETE /api/v2/changes/[id]/time_entries/[id]` - ITSM Scope: freshservice.changes.time_entries.delete, MSP Scope: freshservice.changes.time_entries.delete

### Change Tasks API
- `POST /api/v2/changes/[id]/tasks` - ITSM Scope: freshservice.changes.tasks.create, MSP Scope: freshservice.changes.tasks.create
- `GET /api/v2/changes/[id]/tasks` - ITSM Scope: freshservice.changes.tasks.view, MSP Scope: freshservice.changes.tasks.view
- `PUT /api/v2/changes/[id]/tasks/[id]` - ITSM Scope: freshservice.changes.tasks.edit, MSP Scope: freshservice.changes.tasks.edit
- `DELETE /api/v2/changes/[id]/tasks/[id]` - ITSM Scope: freshservice.changes.tasks.delete, MSP Scope: freshservice.changes.tasks.delete

---