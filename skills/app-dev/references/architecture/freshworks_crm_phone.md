>title: what is phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm
>context: 
>content:

# What is phone_call module in Freshsales Suite

Appointment Module Usage is allowed for the following subscriptions:

### Freshsales Suite Subscriptions:
1. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller.
2. A Freshsales suite subscription with:
   - Freshsales Classic.
3. A stand-alone Freshsales Classic subscription.

### Allows Users to Build:
- Front-end apps
- Serverless apps.
- Full stack SMI apps

---

>title: what are the placeholders supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm
>context: manifest.json
>content:

# What are the placeholders supported for phone_call module in Freshsales Suite

### Common Placeholders:
1. In the app manifest, configure these placeholders at `modules.common`:
   - Full Page App: `full_page_app`
   - Left Navigation CTI: `left_nav_cti`
   - Left Navigation Chat: `left_nav_chat`

---

>title: how to use placeholders supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm
>context: manifest.json
>content:

# How to use placeholders supported for phone_call module in Freshsales Suite

To use the supported placeholders, modify your `manifest.json` as below:

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
      }
    }
  }
}
```

---

>title: what are data methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, data_method
>context: 
>content:

# What are data methods supported for phone_call module in Freshsales Suite

## Data Methods:
You can use the `client.data.get()` data method to retrieve the following objects:

### Accessible Objects:
1. `currentHost`
2. `loggedInUser`

---

>title: example of data method usage supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm
>context: apps.js
>content:

# Example of data method usage supported for phone_call module in Freshsales Suite

To retrieve the `currentHost` object that contains information on `subscribed_modules` & `endpoint_urls`, use the code below:

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success output for Phone
    // {subscribed_modules: ["contact", "phone_call", ... ]}
    console.log(data);
  } catch (error) {
    // failure operation
    console.log(error);
  }
}
getCurrentHostData();
```

---

>title: what are events methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, events_method
>context: 
>content:

# What are events methods supported for phone_call module in Freshsales Suite

### Supported Events:
1. If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs.

---

>title: how to use events methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, events_method
>context: apps.js
>content:

# How to use events methods supported for phone_call module in Freshsales Suite

To enable your app to react to front-end events, in the `app.js` file:

### Steps:
1. Subscribe to the `app.initialized` event through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization:
   - Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   - Define the callback method. When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### Example Code:

To use the `calling` event, use the following code:

```js
{
  // Configure event listener and subscribe to event
  // Register callback
  client.events.on("calling", eventCallback);
  var eventCallback = function (event) {
    // Retrieve event data
    var data = event.helper.getData();
    // App logic
  };
}
```

---

>title: what are interface methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, interface_methods
>context: 
>content:

# What are interface methods supported for phone_call module in Freshsales Suite

### Usage of Interface Methods:
1. Using interface methods, an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

### Supported Interface Methods:
1. Display modals or dialog boxes - `showModal` method and `showDialog` method.
2. Display confirmation messages - `showConfirm` method.
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger`, and `alert`.

---

>title: how to use interface methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, interface_methods
>context: apps.js
>content:

# How to use interface methods supported for phone_call module in Freshsales Suite

### Example to Show Modal:
```js
try {
  let data = client.interface.trigger('showModal', {
    title: 'Sample App Form',
    template: './views/modal.html' 
  });
  console.log(data); // success message
} catch (error) {
  // failure operation
  console.error(error);
}
```

---

>title: what are instance methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, instance_methods
>context: 
>content:

# What are instance methods supported for phone_call module in Freshsales Suite

## Supported Instance Methods:
1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance.
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods.

## Communication Between Instances:
1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
2. Send data from a modal to a parent placeholder and get the data in the parent.
3. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance.

### Contextual Information:
1. If a modal is the app instance where `context()` is used, it retrieves:
   - The (modal’s) instance id
   - The placeholder name of the app instance
   - The instance id of the parent that opened the modal
   - The data (if any) that was passed from the parent.
2. If `context()` is used in a parent placeholder, it retrieves:
   - The instance id
   - The placeholder name of the app instance.

---

>title: how to use instance methods supported for phone_call module in Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, instance_methods
>context: apps.js
>content:

# How to use instance methods supported for phone_call module in Freshsales Suite

1. Sending Data from a Parent Placeholder to a Modal:
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
      modalData: {name: "James", email: "James@freshworks.com"} 
    }
    */
   } catch (error) {
    console.error(error);
   }
```

2. Sending Data from a Modal to a Parent Placeholder:
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
        }
        */
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

3. Sending Data Between Instances:
  1. In placeholder 1:
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

>title: what are the serverless events supported by phone_call module of Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, serverless_events
>context: manifest.json
>content:

# What are the serverless events supported by phone_call module of Freshsales Suite

## Supported Serverless Events:
1. Common Events: In the app manifest, configure these events at `modules.common`:
   - App set-up events:
     - `onAppInstall`
     - `afterAppUpdate`
     - `onAppUninstall`
   - External events:
     - `onAppInstall`
     - `onExternalEvent`
     - `onAppUninstall`
   - Scheduled events.
2. Product-Specific Events: In the app manifest, configure these events at `modules.phone`:
   - `onPhoneCallCreate`
   - `onPhoneCallUpdate`

---

>title: how to configure product events supported by phone_call module of Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure product events supported by phone_call module of Freshsales Suite

## Steps to Configure Product Events:
1. Configure an event listener in `manifest.json`:
```json
{
    "events": {
      "<productEventName>": {
          "handler": "<eventCallbackMethod>"
        }
      }
    }
```
2. In `server.js` file under the exports block, enter the callback function definition:
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
3. Use the appropriate payload attribute for callback with the below syntax:
```json
    {
      "currentHost": {
        "subscribed_modules": ["phone_call"],
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
      "timestamp": "value"
    }
```

---

>title: how to configure events supported by phone_call module of Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# How to configure events supported by phone_call module of Freshsales Suite

### Steps to Configure Events:
1. Configure an event listener for `phone_call` in `manifest.json`:
```json
{
  "events": {
    "onPhoneCallCreate": {
      "handler": "onPhoneCallCreateCallback"
      }
    }
  }
```

### Callback Function Definition:
1. In `server.js` file under the exports block, enter the callback function definition:
```js
  exports = {
    onPhoneCallback: function(payload) {
      console.log("Logging arguments from onPhoneCallCreateCallback event: " + JSON.stringify(payload));
    }
  }
```

### Payload Attribute:
1. Use the appropriate payload attribute for callback with the below syntax:
```json
  {
    "currentHost": {
      "subscribed_modules": ["phone_call"],
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
      "phone_call": {
        "call_cost": null,
        "call_direction": "Outgoing",
        "call_duration": null,
        "call_status": "Completed",
        "created_at": "2019-02-18T13:18:44Z",
        "entity_id": 3,
        "id": 21,
        "is_deleted": false,
        "is_manual": true,
        "needs_response": false,
        "note": "added new call",
        "outcome_id": 1,
        "phone_caller_number": null,
        "phone_caller_number_country": null,
        "phone_number": null,
        "recording_duration": null,
        "root_phone_call_id": 21,
        "source": null,
        "updated_at": "2019-02-18T13:18:44Z",
        "user_id": 1
      }
    },
    "event": "onPhoneCallCreate",
    "iparams": {},
    "region": "US",
    "timestamp": 1593023454.5852625,
    "version": "2.0"
  }
```

---

>title: what are the REST APIs supported by phone_call module of Freshsales Suite
>tags: module=phone, phone_call, freshworks_crm, rest_api
>context: 
>content:

# What are the REST APIs supported by phone_call module of Freshsales Suite

## Supported REST APIs:
- `POST /api/contacts`
- `GET /api/contacts/[id]`
- `GET /api/contacts/view/[view_id]`
- `GET /api/contacts/filters`
- `PUT /api/contacts/[id]`
- `POST /api/contacts/upsert`
- `POST /api/contacts/bulk_upsert`
- `POST /api/contacts/bulk_assign_owner`
- `POST /api/contacts/[id]/clone`
- `DELETE /api/contacts/[id]`
- `DELETE /api/contacts/[id]/forget`
- `POST /api/contacts/bulk_destroy`
- `GET /api/settings/contacts/fields`
- `GET /api/settings/contacts/fields?include=field_group`
- `GET /api/contacts/[id]/activities`

---

