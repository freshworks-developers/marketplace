>title: what is lead module in Freshsales Classic
>tags: module=lead, lead, freshsales
>context: manifest.json
>content:

# what is lead module in Freshsales Classic

Lead Module Usage is allowed for a stand-alone Freshsales Classic subscription.

## Allowed Usages

It Allows users to build:
1. Front-end apps
2. Serverless apps
3. Full stack SMI apps

---
>title: what are the placeholders supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales
>context: manifest.json
>content:

# what are the placeholders supported for lead module in Freshsales Classic

## Common Placeholders

1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

## Module-specific Placeholders

Configure these placeholders at `modules.lead` in the app manifest.
1. Deal Entity Menu as `lead_entity_menu`
2. Deal Quick Actions as `lead_quick_actions`

---
>title: how to use placeholders supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales
>context: manifest.json
>content:

# how to use placeholders supported for lead module in Freshsales Classic

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
    "lead": {
      "location": {
        "lead_entity_menu": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "lead_quick_actions": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---
>title: what are data methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, data_method
>context: 
>content:

# what are data methods supported for lead module in Freshsales Classic

You can use the `client.data.get()` data method to retrieve the following objects.

## Objects Accessible Regardless of the Placeholders

1. `currentHost`
2. `loggedInUser`

## Placeholder-specific Events

An app deployed in the Deal details page can retrieve the following objects.
1. `currentEntityInfo`

---
>title: example of data method usage supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales
>context: 
>content:

# example of data method usage supported for lead module in Freshsales Classic

To retrieve information of a lead, when an agent is on the Deal details page use the code below.

```js
async function getCurrentEntityInfo() {
  try {
    const data = await client.data.get("currentEntityInfo");
    // success output for contact
    // data: { "currentEntityInfo": { "currentEntityId": 12, "currentEntityType": "lead"}}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getCurrentEntityInfo();
```

---
>title: what are events methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, events_method
>context: 
>content:

# what are events methods supported for lead module in Freshsales Classic

The lead module supports following events:

## Events for `left_nav_cti` Placeholder

1. `calling` event when the corresponding event trigger occurs.
   - When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
     1. Contact list page > Contact hover card > Make call widget
     2. Contact list page > Work phone field
     3. Contact details page > Work phone and Mobile fields
     4. Contact details page > Make call widget

## Events on Deal Details Page

1. `lead.update` event

---
>title: how to use events methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, events_method
>context: apps.js
>content:

# how to use events methods supported for lead module in Freshsales Classic

To enable your app to react to front-end events, in the app.js file:

## Steps

1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization:
   1. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   2. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

## Example Usage

1. To use `calling` event:

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

2. To use `lead.update` event:

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("lead.update", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---
>title: what are interface methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, interface_methods
>context: 
>content:

# what are interface methods supported for lead module in Freshsales Classic

## Using Interface Methods

1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Supported Interface Methods

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`
4. Open Method via `client.interface.trigger("open",{id: "<window-name>"})` where `window-name` can be `deal`, `contact`, `account`, `lead` or `calllog`
5. Open lead, contact, account, or lead details page with show method via `client.interface.trigger("show", {id: "<lead, contact, account, or lead>", value: <id of the deal, contact, account, or lead to be opened>})`

---
>title: how to use interface methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, interface_methods
>context: 
>content:

# how to use interface methods supported for lead module in Freshsales Classic

## Examples

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
>title: what are instance methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, instance_methods
>context: 
>content:

# what are instance methods supported for lead module in Freshsales Classic

## Supported Instance Methods

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
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
>title: how to use instance methods supported for lead module in Freshsales Classic
>tags: module=lead, lead, freshsales, instance_methods
>context: 
>content:

# how to use instance methods supported for lead module in Freshsales Classic

## Examples

1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal:

  1. In parent UI

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

  2. In modal UI

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

2. To Send data from a modal to a parent placeholder and get the data in the parent:

  1. In parent UI

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

  2. In modal UI

```js
client.instance.send({
  message: {
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
/* message can be a string, object, or array */
```

3. To Send data from one instance to another instance and receive data at the destination:

  1. In placeholder 1

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

  2. In placeholder 2

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
>title: what are the serverless events supported by lead module of Freshsales Classic
>tags: module=lead, lead, freshsales, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by lead module of Freshsales Classic

An app built for this module can react to the following events.

## Common Events

In the app manifest, configure these events at `modules.common`.

### App set-up events

1. `onAppInstall`
2. `afterAppUpdate`
3. `onAppUninstall`

### External events

1. `onAppInstall`
2. `onExternalEvent`
3. `onAppUninstall`

### Scheduled events

## Product-specific Events

In the app manifest, configure these events at `modules.lead`.
1. `onLeadCreate`
2. `onLeadUpdate`

---
>title: how to configure product events supported by lead module of Freshsales Classic
>tags: module=lead, lead, freshsales, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by lead module of Freshsales Classic

## Steps

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
      }
    };
    ```

### Step 3. Use the appropriate payload attribute for callback with below syntax

    ```json
    {
      "currentHost": {
        "subscribed_modules": [ "lead" ],
        "endpoint_urls": {
          "freshsales": "value"
        }
      },
      "data" : {
        //Contains the list of objects related to the event.
      },
      "event"  : "value",
      "iparams" : {
        "Param1" : "value",
        "Param2" : "value"
      },
      "region"  : "value",
      "timestamp"  : "value",
    }
    ```

---
>title: how to configure events supported by lead module of Freshsales Classic
>tags: module=lead, lead, freshsales, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by lead module of Freshsales Classic

## Steps

### Step 1. Subscribe to lead by configuring an event listener in `manifest.json`
  
  ```json
  {
    "events": {
      "onLeadCreate": {
        "handler": "onLeadCreateCallback"
      }
    }
  }
  ```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:
  
  ```js
  exports = {
    onLeadCreateCallback: function(payload) {
      console.log("Logging arguments from onLeadCreateCallback event: " + JSON.stringify(payload));
    }
  }
  ```

### Step 3. Use the appropriate payload attribute for callback with below syntax
  
  ```json
  {
    "currentHost": {
      "subscribed_modules": [ "lead" ],
      "endpoint_urls": {
        "freshsales": "https://sample.freshsales.io"
      }
    },
    "data": {
      "associations": {
        "campaign": null,
        "creator": {},
        "lead_reason": null,
        "lead_stage": {
          "choice_type": 5,
          "id": 2065,
          "name": "New",
          "position": 1
        },
        "owner": {}
      },
      "lead": {
        "id": 917263,
        "status": "Active",
        "tags": {
          "label": "Tags",
          "type": "auto_complete",
          "value": []
        }
      }
    },
    "event": "onLeadCreate",
    "iparams": {},
    "region": "US",
    "timestamp": 1565689436.5550723,
    "version": "2.0"
  }
  ```

---
>title: what are the REST APIs supported by lead module of Freshsales Classic
>tags: module=lead, lead, freshsales, rest_api
>context: 
>content:

# what are the REST APIs supported by lead module of Freshsales Classic

The Freshsales Classic Deal module supports following APIs:

- `POST /api/leads`
- `GET /api/leads/[id]`
- `POST /api/leads/[id]/convert`
- `GET /api/leads/view/[view_id]`
- `GET /api/leads/filters`
- `PUT /api/leads/[id]`
- `POST /api/leads/upsert`
- `POST /api/leads/bulk_upsert`
- `POST /api/leads/bulk_assign_owner`
- `POST /api/leads/[id]/clone`
- `DELETE /api/leads/[id]`
- `DELETE /api/leads/[id]/forget`
- `POST /api/leads/bulk_destroy`
- `GET /api/settings/leads/fields`
- `GET /api/leads/[id]/activities`
```
---
