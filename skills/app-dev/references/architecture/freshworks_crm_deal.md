>title: what is deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm
>context:
>content:

# What is deal module in Freshsales Suite

Appointment Module Usage is allowed for following subscriptions

## Subscriptions:
1. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller
2. A Freshsales suite subscription with:
   - Freshsales Classic
3. A stand-alone Freshsales Classic subscription

### Allowed app types:
- Front-end apps
- Serverless apps
- Full stack SMI apps

---

>title: what are the placeholders supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm
>context: manifest.json
>content:

# What are the placeholders supported for deal module in Freshsales Suite

## Common placeholders:
In the app manifest, configure these placeholders at `modules.common`.
1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

## Module-specific placeholders:
In the app manifest, configure these placeholders at `modules.deal`.
1. Deal Entity Menu as `deal_entity_menu`
2. Deal Quick Actions as `deal_quick_actions`

---

>title: how to use placeholders supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm
>context: manifest.json
>content:

# How to use placeholders supported for deal module in Freshsales Suite

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
    "deal": {
      "location": {
        "deal_entity_menu": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "deal_quick_actions": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, data_method
>context: 
>content:

# What are data methods supported for deal module in Freshsales Suite

You can use the `client.data.get()` data method to retrieve the following objects.

## Common objects:
Accessible regardless of the placeholders:
1. `currentHost`
2. `loggedInUser`

## Placeholder-specific events:
An app deployed in the Deal details page can retrieve the following objects:
1. `currentEntityInfo`

---

>title: example of data method usage supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm
>context: 
>content:

# Example of data method usage supported for deal module in Freshsales Suite

To retrieve information of a deal, when an agent is on the Deal details page use the code below:

```js
async function getCurrentEntityInfo() {
  try {
    const data = await client.data.get("currentEntityInfo");
    // success output for contact
    // data: { "currentEntityInfo": { "currentEntityId": 12, "currentEntityType": "deal"}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getCurrentEntityInfo();
```

---

>title: what are events methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, events_method
>context: 
>content:

# What are events methods supported for deal module in Freshsales Suite

The deal module supports the following events:

## Events:
1. `left_nav_cti` placeholder events:
   - The app can react to the `calling` event when the corresponding event trigger occurs. When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
     - Contact list page > Contact hover card > Make call widget
     - Contact list page > Work phone field
     - Contact details page > Work phone and Mobile fields
     - Contact details page > Make call widget
2. Deal details page events:
   - `deal.update` event

---

>title: how to use events methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, events_method
>context: apps.js
>content:

# How to use events methods supported for deal module in Freshsales Suite

To enable your app to react to front-end events, in the `app.js` file:

## Steps:
1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization:
   - Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   - Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### Calling event:
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("calling", eventCallback);
  var eventCallback = function (event) {
    //Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

### Deal update event:
```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("deal.update", eventCallback);
  var eventCallback = function (event) {
    //Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, interface_methods
>context: 
>content:

# What are interface methods supported for deal module in Freshsales Suite

## Interface methods:
1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Supported methods:
1. Display modals or dialog boxes:
   - `showModal` method and `showDialog` method
2. Display confirmation messages:
   - `showConfirm` method
3. Display notifications:
   - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Open Method via `client.interface.trigge("open",{id: "<window-name>"})` where `window-name` can be `lead`, `contact`, `account`, `deal` or `calllog`
5. Open lead, contact, account, or deal details page with show method via `client.interface.trigger("show", {id: "<lead, contact, account, or deal>", value: <id of the lead, contact, account, or deal to be opened>})`

---

>title: how to use interface methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, interface_methods
>context: 
>content:

# How to use interface methods supported for deal module in Freshsales Suite

## Instructions:
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

>title: what are instance methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, instance_methods
>context: 
>content:

# What are instance methods supported for deal module in Freshsales Suite

## Methods:
1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   - Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   - Send data from a modal to a parent placeholder and get the data in the parent.
   - Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance. 
   - If a modal is the app instance where context() is used, it retrieves:
     - The (modal’s) instance id
     - The placeholder name of the app instance
     - The instance id of the parent that opened the modal
     - The data (if any) that was passed from the parent
   - If context() is used in a parent placeholder, it retrieves:
     - The instance id
     - The placeholder name of the app instance

---

>title: how to use instance methods supported for deal module in Freshsales Suite
>tags: module=deal, deal, freshworks_crm, instance_methods
>context: 
>content:

# How to use instance methods supported for deal module in Freshsales Suite

1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal:

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

2. Send data from a modal to a parent placeholder and get the data in the parent:

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

3. Send data from one instance to another instance and receive data at the destination:

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

>title: what are the serverless events supported by deal module of Freshsales Suite
>tags: module=deal, deal, freshworks_crm, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by deal module of Freshsales Suite

An app built for this module can react to the following events.

## Events:
1. Common events: 
   In the app manifest, configure these events at `modules.common`.
   - App set-up events:
     - `onAppInstall`
     - `afterAppUpdate`
     - `onAppUninstall`
   - External events:
     - `onAppInstall`
     - `onExternalEvent`
     - `onAppUninstall`
   - Scheduled events
2. Product-specific events: 
   In the app manifest, configure these events at `modules.deal`.
   - `onDealCreate`
   - `onDealUpdate`

---

>title: how to configure product events supported by deal module of Freshsales Suite
>tags: module=deal, deal, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by deal module of Freshsales Suite

## Steps:

### Subscribe to an event by configuring an event listener in `manifest.json`:
```json
"events": {
  "<productEventName>": {
    "handler": "<eventCallbackMethod>"
  }
}
```

### In `server.js` file under the exports block, enter the callback function definition:
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

### Use the appropriate payload attribute for callback with below syntax:
```json
{
  "currentHost": {
    "subscribed_modules": [ "deal" ],
    "endpoint_urls": {
      "freshworks_crm": "value"
    }
  },
  "data": {
    // Contains the list of objects related to the event.
  },
  "event": "value",
  "iparams": {
    "Param1": "value",
    "Param2": "value"
  },
  "region": "value",
  "timestamp": "value",
}
```

---

>title: how to configure events supported by deal module of Freshsales Suite
>tags: module=deal, deal, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure events supported by deal module of Freshsales Suite

## Steps:

### Subscribe to deal by configuring an event listener in `manifest.json`:
```json
"events": {
  "onDealCreate": {
    "handler": "onDealCreateCallback"
  }
}
```

### In `server.js` file under the exports block, enter the callback function definition:
```js
exports = {
  onDealCreateCallback: function(payload) {
    console.log("Logging arguments from onDealCreateCallback event: " + JSON.stringify(payload));
  }
};
```

### Use the appropriate payload attribute for callback with below syntax:
```json
{
  "currentHost": {
    "subscribed_modules": [ "deal" ],
    "endpoint_urls": {
      "freshworks_crm": "https://sample.myfreshworks.com",
      "freshsales": "https://sample.freshsales.io"
    }
  },
  "data": {
    "actor": {
      "deal_pipeline_id": 27149,
      "email": "jim.doe@xyz.com",
      "id": 39897,
      "job_title": "Engineer",
      "name": "Jim Doe",
      "uuid": "195818342547907164"
    },
    "associations": {},
    "deal": {
      "active_sales_sequences": {},
      "age": {},
      "amount": {},
      "base_currency_amount": {},
      "tags": {},
      "team_user_ids": []
    }
  },
  "event": "onDealCreate",
  "iparams": {},
  "region": "US",
  "timestamp": 1593023454.5852625,
  "version": "2.0"
}
```

---

>title: what are the REST APIs supported by deal module of Freshsales Suite
>tags: module=deal, deal, freshworks_crm, rest_api
>context: 
>content:

# What are the REST APIs supported by deal module of Freshsales Suite

The Freshsales Suite Deal module supports the following APIs:

## APIs:
- `POST /api/deals`
- `GET /api/deals/[id]`
- `GET /api/deals/view/[view_id]`
- `GET /api/deals/filters`
- `PUT /api/deals/[id]`
- `POST /api/deals/upsert`
- `POST /api/deals/bulk_upsert`
- `POST /api/deals/[id]/clone`
- `DELETE /api/deals/[id]`
- `DELETE /api/deals/[id]/forget`
- `POST /api/deals/bulk_destroy`
- `GET /api/settings/deals/fields`
- `GET /api/settings/deals/fields?include=field_group`

---
