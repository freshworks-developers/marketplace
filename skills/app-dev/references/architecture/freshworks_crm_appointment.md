>title: what is appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm
>context: 
>content:

# what is appointment module in Freshsales Suite

Appointment Module Usage is allowed for following subscriptions

1. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller.
2. A Freshsales suite subscription with:
   - Freshchat.
3. A Freshsales suite subscription with:
   - Freshcaller.
4. A Freshsales suite subscription with:
   - Freshsales Classic.

## It Allows users to build:
1. Front-end apps when deployed on the supported product's left-navigation pane.
2. Serverless apps.
3. Full stack SMI apps, with the front-end component accessible only from the left-navigation pane.

---

>title: what are the placeholders supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for appointment module in Freshsales Suite

It supports the following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.

1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

---

>title: how to use placeholders supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for appointment module in Freshsales Suite

To use the supported placeholder modify your `manifest.json` as below 

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
    }
  }
}
```

---

>title: what are data methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for appointment module in Freshsales Suite

You can use the `client.data.get()` data method to retrieve the following objects. The objects accessible regardless of the placeholders

## Supported Objects
1. currentHost
2. loggedInUser

---

>title: example of data method usage supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm
>context: 
>content:

# example of data method usage supported for appointment module in Freshsales Suite

## Retrieve currentHost object

```js
async function getCurrentHostData() {
  try {
    const data = await client.data.get("currentHost");
    // success operation
    // "data" is {subscribed_modules: [“contact”, “deal”, ... ]}
  } catch (error) {
    // failure operation
  }
}

getCurrentHostData();
```

## Retrieve loggedInUser object

```js
async function getLoggedInUserData() {
  try {
    const data = await client.data.get("loggedInUser");
    // success operation
    // "data" is {loggedInUser: {‘available’: “true”, ... }}
  } catch (error) {
    // failure operation
  }
}

getLoggedInUserData();
```

---

>title: what are events methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, events_method
>context: 
>content:

# what are events methods supported for appointment module in Freshsales Suite

The appointment module supports following events

## Events for left_nav_cti placeholder

If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs. When a user clicks the call icon or phone number link that is displayed on any of the following pages of the product UI:
1. Contact list page > Contact hover card > Make call widget
2. Contact list page > Work phone field
3. Contact details page > Work phone and Mobile fields
4. Contact details page > Make call widget

---

>title: how to use events methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, events_method
>context: apps.js
>content:

# how to use events methods supported for appointment module in Freshsales Suite

## Steps to configure event listener

To enable your app to react to front-end events, in the app.js file,

1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization, use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### Example for `calling` event

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

---

>title: what are interface methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, interface_methods
>context: 
>content:

# what are interface methods supported for appointment module in Freshsales Suite

## Using Interface Methods
1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

### Supported Interface Methods
Freshsales Suite appointment module supports following interface methods
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, interface_methods
>context: apps.js
>content:

# how to use interface methods supported for appointment module in Freshsales Suite

## Show modal or dialog

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

## Display notifications

```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
  }
)
```

---

>title: what are instance methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, instance_methods
>context: 
>content:

# what are instance methods supported for appointment module in Freshsales Suite

## Supported Instance Methods are as follows

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

>title: how to use instance methods supported for appointment module in Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for appointment module in Freshsales Suite

Instance methods allow you to communicate between placeholders, modals, and instances in your app. Below are examples of how to use these methods effectively.

1. Use instance method to Send data from a parent placeholder to a modal
  a. Send data from parent UI
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
  b. Retrieve Data in Modal UI

In the modal, use the `client.instance.context()` method to retrieve the data sent by the parent placeholder.

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

2. Use instance method to Send data from a modal to a parent placeholder
  a. Receive Data in Parent UI

Use the `client.instance.receive()` method in the parent placeholder to receive data sent by the modal.

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

  b. Send Data from Modal UI

Use the `client.instance.send()` method in the modal to send data to the parent placeholder.

```js
client.instance.send({
  message: {
    name: "James",
    email: "james.dean@freshworks.com"
  }
});
/* message can be a string, object, or array */
```

3. Use instance method to Send data from one instance to another instance
  a. Send from placeholder 1

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

  b. Receive in placeholder 2
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

>title: what are the serverless events supported by appointment module of Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by appointment module of Freshsales Suite

An app built for appointment module can react to the following events.

## Common events

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

## Product-specific events

In the app manifest, configure these events at `modules.appointment`.

1. `onAppointmentCreate`
2. `onAppointmentUpdate`

---

>title: how to configure product events supported by appointment module of Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by appointment module of Freshsales Suite

## Steps to configure product events

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
    "subscribed_modules": [ "appointment" ],
    "endpoint_urls": {
      "freshworks_crm": "value"
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
  "timestamp"  : "value"
}
```

---

>title: how to configure events supported by appointment module of Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by appointment module of Freshsales Suite

## Steps to configure appointment events

### Step 1. Subscribe to appointment by configuring an event listener in `manifest.json`

```json
{
"events": {
  "onAppointmentCreate": {
    "handler": "onAppointmentCreateCallback"
    }
  }
}
```

### Step 2. In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
  onAppointmentCreateCallback: function(payload) {
    console.log("Logging arguments from onAppointmentCreateCallback event: " + JSON.stringify(payload));
  }
};
```

### Step 3. Use the appropriate payload attribute for callback with below syntax

```json
{
  "currentHost": {
    "subscribed_modules": [ "appointment" ],
    "endpoint_urls": {
      "freshworks_crm": "https://sample.myfreshworks.com",
      "freshsales": "https://sample.freshsales.io"
    }
  },
  "account_id": "195818342531129946",
  "data": {
    "actor": {
      "id": 39897,
      "name": "Jim Doe",
      "time_zone": "UTC",
      "type": "user",
      "uuid": "195818342547907164"
    },
    "appointment": {
      "id": 283387,
      "title": "Test"
    },
    "associations": {
      "appointment_attendees": [
        {
          "_association_id": 346754,
          "_model": "FdMultitenant::User",
          "id": 39897
        },
        {
          "_association_id": 346755,
          "_model": "Contact",
          "id": 1399366
        }
      ],
      "creator": {},
      "outcome": null,
      "targetable": null,
      "updater": null
    }
  },
  "event": "onAppointmentCreate",
  "region": "US",
  "timestamp": 1593015490.2012472,
  "iparams": {},
  "version": "2.0"
}
```

---

>title: what are the REST APIs supported by appointment module of Freshsales Suite
>tags: module=appointment, appointment, freshworks_crm, rest_api
>context: 
>content:

# what are the REST APIs supported by appointment module of Freshsales Suite

## Supported APIs

The Freshsales Suite Appointment module supports following APIs

- `POST /api/appointments`
- `GET /api/appointments/[:appointment_id]`
- `GET /api/appointments?filter=[filter param]`
- `PUT /api/appointments/[:appointment_id]`
- `DELETE /api/appointments/[:appointment_id]`

---