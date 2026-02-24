>title: what is contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm
>context: 
>content:

# What is contact module in Freshsales Suite

Appointment Module Usage is allowed for following subscriptions

### Allowed Subscriptions:
1. A Freshsales suite subscription with:
   1. Freshsales Classic
   2. Freshchat
   3. Freshcaller.
2. A Freshsales suite subscription with:
   1. Freshsales Classic.
3. A stand-alone Freshsales Classic subscription.

### It Allows users to build:
1. Front-end apps
2. Serverless apps.
3. Full stack SMI apps

---

>title: what are the placeholders supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm
>context: manifest.json
>content:

# What are the placeholders supported for contact module in Freshsales Suite

### Common placeholders:
 It supports following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.
   1. Full Page App as `full_page_app`
   2. Left Navigation CTI as `left_nav_cti`
   3. Left Navigation Chat as `left_nav_chat`

### Module-specific placeholders:
 It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.contact`.
   1. Contact Entity Menu as `contact_entity_menu`
   2. Contact Quick Actions as `contact_quick_actions`

---

>title: how to use placeholders supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm
>context: manifest.json
>content:

# How to use placeholders supported for contact module in Freshsales Suite

### Modify `manifest.json`:
To use the supported placeholder modify your `manifest.json` as below:
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
        "left_nav_cti": {
          "url": "left_nav_cti.html",
          "icon": "styles/images/icon.svg"
        },
        "left_nav_chat": {
          "url": "left_nav_chat.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "requests": {}
    },
    "contact": {
      "location": {
        "contact_entity_menu": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "contact_quick_actions": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, data_method
>context: 
>content:

# What are data methods supported for contact module in Freshsales Suite

You can use the `client.data.get()` data method to retrieve the following objects. 

### Objects accessible regardless of the placeholders:
1. `currentHost`
2. `loggedInUser`

### Placeholder-specific events:
An app deployed in the Contact details page can retrieve the following objects.
`currentEntityInfo`

---

>title: example of data method usage supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm
>context: 
>content:

# Example of data method usage supported for contact module in Freshsales Suite

### Code to retrieve contact information:
To retrieve information of a contact, when an agent is on the Contact details page use the code below.
```js
async function getCurrentEntityInfo() {
  try {
    const data = await client.data.get("currentEntityInfo");
    // success output for contact
    // data: { "currentEntityInfo": { "currentEntityId": 12, "currentEntityType": "contact"}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getCurrentEntityInfo();
```

---

>title: what are events methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, events_method
>context: 
>content:

# What are events methods supported for contact module in Freshsales Suite

### Supported events:
The contact module supports following events

1. If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs. When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
   1. Contact list page > Contact hover card > Make call widget
   2. Contact list page > Work phone field
   3. Contact details page > Work phone and Mobile fields
   4. Contact details page > Make call widget
2. On contact Details page
   1. `contact.update` event

---

>title: how to use events methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, events_method
>context: apps.js
>content:

# How to use events methods supported for contact module in Freshsales Suite

## Steps to enable your app to react to front-end events:
To enable your app to react to front-end events, in the app.js file,

1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization,
   1. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   2. Define the callback method.
When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### Code examples:
1. To use `calling` event use following code
```js
// Configure event listener and subscribe to event
// Register callback
client.events.on("calling", eventCallback);

var eventCallback = function (event) {
  // Retrieve event data
  var data = event.helper.getData();
  // App logic
};
```
2. To use `contact.update` event use following code
```js

    //Configure event listener and subscribe to event
    //Register callback
    client.events.on("contact.update", eventCallback);

    var eventCallback = function (event) {
    //Retrieve event data
    var data = event.helper.getData();
    // App logic
    };

```

---

>title: what are interface methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, interface_methods
>context: apps.js
>content:

# What are interface methods supported for contact module in Freshsales Suite

## Using interface methods:
1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Supported interface methods:
Freshsales Suite contact module supports following interface methods
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Open Method via `client.interface.trigger("open",{id: "<window-name>"})` where `window-name` can be `lead`, `contact`, `account`, `deal` or `calllog`
5. Open lead, contact, account, or deal details page with show method via `client.interface.trigger("show", {id: "<lead, contact, account, or deal>", value: <id of the lead, contact, account, or deal to be opened>})`

---

>title: how to use interface methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, interface_methods
>context: apps.js
>content:

# How to use interface methods supported for contact module in Freshsales Suite

## Code examples:
1. To show lead information use:
```js
    try {
      let data = await client.interface.trigger("show", {
        id: "lead",
        value: 1
      });
      console.log(data); // success message
    } catch (error) {
        // failure operation
      console.error(error);
    }
```
2. To open add account window:
```js
    try {
      let data = await client.interface.trigger("open", {
        id: "account"
      });
      console.log(data); // success message
    } catch (error) {
        // failure operation
      console.error(error);
    }
```

---

>title: what are instance methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, instance_methods
>context: apps.js
>content:

# What are instance methods supported for contact module in Freshsales Suite

## Supported instance methods:
1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance. 
   1. If a modal is the app instance where context() is used, it retrieves,
      1. The (modal’s) instance id
      2. The placeholder name of the app instance
      3. The instance id of the parent that opened the modal
      4. The data (if any) that was passed from the parent
   2. If context() is used in a parent placeholder, it retrieves,
      1. The instance id
      2. The placeholder name of the app instance

---

>title: how to use instance methods supported for contact module in Freshsales Suite
>tags: module=contact, contact, freshworks_crm, instance_methods
>context: apps.js
>content:

# How to use instance methods supported for contact module in Freshsales Suite

## Examples:
1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   1. In parent UI:
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
   2. In modal UI:
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
2. To Send data from a modal to a parent placeholder and get the data in the parent.
   1. In parent UI:
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
   2. In modal UI:
```js
    client.instance.send({
    message: {
        name: "James",
        email: "james.dean@freshworks.com"
    }
    });
    /* message can be a string, object, or array */
```
3. To Send data from one instance to another instance and receive data at the destination

   1. In placeholder 1:
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
   2. In placeholder 2:
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

>title: what are the serverless events supported by contact module of Freshsales Suite
>tags: module=contact, contact, freshworks_crm, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by contact module of Freshsales Suite

## Supported Events:
An app built for this module can react to the following events.

1. Common events: In the app manifest, configure these events at `modules.common`.
   1. App set-up events
      1. `onAppInstall`
      2. `afterAppUpdate`
      3. `onAppUninstall`
   2. External events
      1. `onAppInstall`
      2. `onExternalEvent`
      3. `onAppUninstall`
   3. Scheduled events
2. Product-specific events: In the app manifest, configure these events at `modules.cpq_document`.
  1. `onContactCreate`
  2. `onContactUpdate`

---

>title: how to configure product events supported by contact module of Freshsales Suite
>tags: module=contact, contact, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by contact module of Freshsales Suite

## Steps to configure product events:

### Step 1. Subscribe to an event by configuring an event listener in `manifest.json`

```json
    {
    "events": {
      "<productEventName>": {
          "handler": "<eventCallbackMethod>"
        }
      }
    }
```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
    exports = {
    // args is a JSON block containing the payload information
    // args["iparam"] will contain the installation parameter values
    //eventCallbackMethod is the call-back function name specified in manifest.json
    eventCallbackMethod: function(args) {
      console.log("Logging arguments from the event: " + JSON.stringify(payload));
    }};
```

### Step 3. Use the appropriate payload attribute for callback with below syntax

```json
    {
      "currentHost": {
        "subscribed_modules": [ "contact" ],
        "endpoint_urls": {
          "freshworks_crm": "value"
        }
      },
      "data" : {

      },
      "event"  : "value",
      "iparams" : {
          "Param1" : "value",
          "Param2" : "value"
      },
      "region"  : "value",
      "timestamp"  : "value"
    }
```

---

>title: how to configure events supported by contact module of Freshsales Suite
>tags: module=contact, contact, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure events supported by contact module of Freshsales Suite

## Steps to configure events:
1. Subscribe to contact by configuring an event listener in `manifest.json`
2. In `server.js` file under the exports block, enter the callback function definition 
3. Use the appropriate payload attribute for callback with below syntax

### Subscribe to contact by configuring an event listener in `manifest.json`

```json
{
  "events": {
    "onContactCreate": {
      "handler": "onContactCreateCallback"
    }
  }
}
```
### In `server.js` file under the exports block, enter the callback function definition as follows:
```js
  exports = {
    onContactCreateCallback: function(payload) {
      console.log("Logging arguments from onContactCreateCallback event: " + JSON.stringify(payload));
    }
  }
  ```
### Use the appropriate payload attribute for callback with below syntax
```json
    {
    "currentHost": {
        "subscribed_modules": [
            "contact"
        ],
        "endpoint_urls": {
            "freshworks_crm": "https://sample.myfreshworks.com",
            "freshsales": "https://sample.freshsales.io"
        }
    },
    "data": {
        "actor": {
            "created_at": "2020-06-09T12:21:48Z",
            "deal_pipeline_id": 154,
            "email": "sample@xyz.com",
            "id": 1437,
            "is_active": true,
            "is_forgotten": false,
            "job_title": null,
            "language": "en",
            "mobile_number": null,
            "name": "John Doe",
            "time_zone": "UTC",
            "type": "user",
            "updated_at": "2020-06-09T12:21:48Z",
            "uuid": "190440313184929466"
        }
    },
    "associations": {
        "campaign": null,
        "contact_status": null,
        "creator": {
            "created_at": "2020-06-09T12:21:48Z",
            "deal_pipeline_id": 154,
            "email": "sample@xyz.com",
            "id": 1437,
            "is_active": true,
            "job_title": null,
            "mobile_number": null,
            "name": "John Doe",
            "time_zone": "UTC",
            "type": "user",
            "updated_at": "2020-06-09T12:21:48Z",
            "uuid": "190440313184929466",
            "work_number": null
        },
        "event": "onContactCreate",
        "iparams": {},
        "region": "US",
        "timestamp": 1593023454.5852625,
        "version": "2.0"
    }
}
```

---
>title: what are the REST APIs supported by contact module of Freshsales Suite
>tags: module=contact, contact, freshworks_crm, rest_api
>context:
>content:

# what are the REST APIs supported by contact module of Freshsales Suite

`POST /api/contacts`
`GET /api/contacts/[id]`
`GET /api/contacts/view/[view_id]`
`GET /api/contacts/filters`
`PUT /api/contacts/[id]`
`POST /api/contacts/upsert`
`POST /api/contacts/bulk_upsert`
`POST /api/contacts/bulk_assign_owner`
`POST /api/contacts/[id]/clone`
`DELETE /api/contacts/[id]`
`DELETE /api/contacts/[id]/forget`
`POST /api/contacts/bulk_destroy`
`GET /api/settings/contacts/fields`
`GET /api/settings/contacts/fields?include=field_group`
`GET /api/contacts/[id]/activities`

---
