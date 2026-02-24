>title: what is sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm
>context: 
>content:

# what is sales activites module in Freshsales Suite

Sales Account Module Usage is allowed for following subscriptions:
1. A stand-alone Freshsales Classic subscription.
2. A Freshsales suite subscription with:
   1. Freshsales Classic
   2. Freshchat
   3. Freshcaller.
3. A Freshsales suite subscription with:
   1. Freshsales Classic.

## It Allows users to build:
1. Front-end apps, however the app is deployed on the supported product’s left-navigation pane. The app cannot be deployed on any other pages of the product.
2. Serverless apps.
3. Full stack SMI apps, however, the app’s front-end component is accessible from the product’s left-navigation pane. The front-end component cannot be deployed on any other pages of the product.

---

>title: what are the placeholders supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm
>context: manifest.json
>content:

# what are the placeholders supported for sales activites module in Freshsales Suite

It supports following Common placeholders. In the app manifest, configure these placeholders at `modules.common`.
1. Full Page App as `full_page_app`
2. Left Navigation CTI as `left_nav_cti`
3. Left Navigation Chat as `left_nav_chat`

---

>title: how to use placeholders supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm
>context: manifest.json
>content:

# how to use placeholders supported for sales activites module in Freshsales Suite

To use the supported placeholder modify your `manifest.json` as below to include the `sales_activities` module and associated information:

```json
{
  "platform-version": "3.0",
  "modules": {
    "sales_activities": {
      "events": {
        "onSalesActivityCreate": {
          "handler": "onSalesActivityCreateHandler"
        },
        "onSalesActivityUpdate": {
          "handler": "onSalesActivityUpdateHandler"
        }
      }
    },
    "common": {
      "location": {
        "left_nav_cti": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        },
        "left_nav_chat": {
          "url": "index.html",
          "icon": "styles/images/icon.svg"
        }
      },
      "events": {
        "onAppInstall": {
          "handler": "onAppInstallHandler"
        },
        "onExternalEvent": {
          "handler": "onExternalEventHandler"
        }
      }
    }
  },
  "engines": {
    "node": "18.20.3",
    "fdk": "9.3.1"
  }
}
```
---

>title: what are data methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, data_method
>context: 
>content:

# what are data methods supported for sales activites module in Freshsales Suite

You can use the `client.data.get()` data method to retrieve the following objects. The objects accessible regardless of the placeholders:
1. `currentHost`
2. `loggedInUser`

---

>title: example of data method usage supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm
>context: app.js
>content:

# example of data method usage supported for sales activites module in Freshsales Suite

## To retrieve the `currentHost` object that contains information on:
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

## To retrieve information on the user logged into the Freshworks product UI:
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

>title: what are events methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, events_method
>context: app.js
>content:

# what are events methods supported for sales activites module in Freshsales Suite

The sales activites module supports following events. 
1. **Common events**: If your app is built to be deployed on the `left_nav_cti` placeholder, the app can react to the `calling` event when the corresponding event trigger occurs. 
2. **Conversation editor page events**: 
   1. `chatConversation.onSendMessage` - When an agent clicks the Send button. The event payload is the chatConversation.onSendMessage object.
   2. `chatConversation.propertiesLoaded` - When an agent,
      1. collapses and then reopens the conversation properties widget.
      2. navigates from one conversation to another.
      3. updates values within the conversation properties widget.

---

>title: how to use events methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, events_method
>context: apps.js
>content:

# how to use events methods supported for sales activites module in Freshsales Suite

To enable your app to react to front-end events, in the app.js file:

## Steps:
1. Subscribe to the app.initialized event, through an event listener. When the app is initialized, the parent application passes a client reference to the app.
2. After app initialization,
   1. Use the client reference, subscribe to `<Event name>` and register a callback method to be executed when the event occurs.
   2. Define the callback method.

When the event occurs, a payload is passed to the callback method. Let us call this payload event. `event.type` returns the name of the event. The `event.helper.getData()` helper method returns a JSON object that contains information pertaining to the event. Your app logic can process this data into meaningful results.

### To use `calling` event use following code:

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

### To use `chatConversation.onSendMessage` event use following code:

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("chatConversation.onSendMessage", eventCallback, {intercept: true});
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

### To use `chatConversation.propertiesLoaded` event use following code:

```js
{
  //Configure event listener and subscribe to event
  //Register callback
  client.events.on("chatConversation.propertiesLoaded", eventCallback);
  var eventCallback = function (event) {
  //Retrieve event data
  var data = event.helper.getData();
  // App logic
  };
}
```

---

>title: what are interface methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, interface_methods
>context: 
>content:

# what are interface methods supported for sales activites module in Freshsales Suite

1. Using interface methods an app that is deployed in the global left-navigation pane can display certain UI elements such as Modals, Confirmation boxes, and Notifications.
2. Mimic click actions - such as closing modals.

## Freshsales Suite sales activites module supports following interface methods:
1. Display modals or dialog boxes - `showModal` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, and `danger`.

---

>title: how to use interface methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, interface_methods
>context: 
>content:

# how to use interface methods supported for sales activites module in Freshsales Suite

## To show modal or dialog
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

## To display notifications
```js
client.interface.trigger("showNotify", {
    type: “<Possible values: info, success, warning, danger, alert>”,
    title: "<Display name>",
    message: "<text message to be displayed in the notification box>"
    }
)
```

---

>title: what are instance methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, instance_methods
>context: app.js
>content:

# what are instance methods supported for sales activites module in Freshsales Suite

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

>title: how to use instance methods supported for sales activites module in Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, instance_methods
>context: apps.js
>content:

# how to use instance methods supported for sales activites module in Freshsales Suite

## To Send data from a parent placeholder to a modal and retrieve the context/data in the modal:
### In parent UI:
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

### In modal UI:
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

## To Send data from a modal to a parent placeholder and get the data in the parent:

### In parent UI:

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

### In modal UI:

```js
client.instance.send({
message: {
    name: "James",
    email: "james.dean@freshworks.com"
}
});
/* message can be a string, object, or array */
```

## To Send data from one instance to another instance and receive data at the destination:

### In placeholder 1:

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

### In placeholder 2:

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

>title: what are the serverless events supported by sales activites module of Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by sales activites module of Freshsales Suite

An app built for this module can react to the following events:
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
2. Product-specific events: In the app manifest, configure these events at `modules.sales_activities`.
   1. `onSalesActivitiesCreate`
   2. `onSalesActivitiesUpdate`

---

>title: how to configure product events supported by sales activites module of Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure product events supported by sales activites module of Freshsales Suite

## Steps:

### Step 1: Subscribe to an event by configuring an event listener in `manifest.json`:

```json
{
"events": {
    "<productEventName>": {
        "handler": "<eventCallbackMethod>"
    }
  }
}
```

### Step 2:  In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
// args is a JSON block containing the payload information
// args["iparam"] will contain the installation parameter values
//eventCallbackMethod is the call-back function name specified in manifest.json
eventCallbackMethod: function(args) {
  console.log("Logging arguments from the event: " + JSON.stringify(payload));
}};
```

### Step 3: Use the appropriate payload attribute for callback with below syntax:
```json
{
  "currentHost": {
    "subscribed_modules": [ "sales_activities" ],
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

>title: how to configure events supported by sales activites module of Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, product_events
>context: manifest.json, server.js
>content:

# how to configure events supported by sales activites module of Freshsales Suite

## Steps:

### Step 1: Subscribe to task by configuring an event listener in `manifest.json`:

```json
{
  "events": {
    "onSalesActivityUpdate": {
      "handler": "onSalesActivityUpdateCallback"
    }
  }
}
```

### Step 2: In `server.js` file under the exports block, enter the callback function definition as follows:

```js
exports = {
  onSalesActivityUpdate: function(payload) {
    console.log("Logging arguments from onSalesActivityUpdateCallback event: " + JSON.stringify(payload));
  }
}
```

### Step 3: Use the appropriate payload attribute for callback with below syntax:

```json
{
  "currentHost": {
    "subscribed_modules": [ "sales_activities" ],
    "endpoint_urls": {
      "freshworks_crm": "https://sample.myfreshworks.com",
      "freshsales": "https://sample.freshsales.io"
    }
  },
  "data": {
    "actor": {
      "id": 1,
      "created_at": "2019-08-23T06:00:55Z",
      "updated_at": "2019-08-23T06:00:55Z",
      "deal_pipeline_id": 1,
      "email": "Johnarchie@gmail.com",
      "is_active": true,
      "is_forgotten": false,
      "job_title": null,
      "language": "en",
      "mobile_number": "9999999999",
      "name": "John Archie",
      "time_zone": "Chennai",
      "type": "user",
      "work_number": null
    },
    "associations": {
      "creator": {
        "id": 1,
        "created_at": "2021-02-22T12:37:52Z",
        "updated_at": "2021-02-22T13:12:13Z",
        "deal_pipeline_id": 1,
        "email": "Johnarchie@gmail.com",
        "is_active": true,
        "job_title": null,
        "mobile_number": "9999999999",
        "name": "John Archie",
        "time_zone": "UTC",
        "type": "user",
        "uuid": "283940448044286730",
        "work_number": null
      },
      "owner": {
        "id": 1,
        "created_at": "2021-02-22T12:37:52Z",
        "updated_at": "2021-02-22T13:12:13Z",
        "deal_pipeline_id": 1,
        "email": "Johnarchie@gmail.com",
        "is_active": true,
        "job_title": null,
        "mobile_number": "9999999999",
        "name": "John Archie",
        "time_zone": "UTC",
        "type": "user",
        "uuid": "283940448044286730",
        "work_number": null
      },
      "sales_activity_outcome": {
        "id": 212,
        "name": "Left message",
        "position": 1
      },
      "sales_activity_type": {
        "id": 7,
        "name": "facebook",
        "position": 2
      },
      "targetable": {
        "id": 23,
        "_model": "Dfeal"
      },
      "updater": {
        "id": 1,
        "created_at": "2021-02-22T12:37:52Z",
        "updated_at": "2021-02-22T13:12:13Z",
        "deal_pipeline_id": 1,
        "email": "Johnarchie@gmail.com",
        "is_active": true,
        "job_title": null,
        "mobile_number": "9999999999",
        "name": "John Archie",
        "time_zone": "UTC",
        "type": "user",
        "uuid": "283940448044286730",
        "work_number": null
      }
    },
    "changes": {
      "misc_changes": {},
      "model_changes": {
        "end_date": [
          "2019-09-25T10:45:00Z",
          "2019-09-28T04:30:00Z"
        ],
        "start_date": [
          "2019-09-25T10:15:00Z",
          "2019-09-26T04:30:00Z"
        ],
        "title": [
          "Knowledge transfer meeting with Kenneth",
          "Meeting with Kenneth"
        ],
        "updated_at": [
          "2019-09-25T10:15:13Z",
          "2019-09-25T10:17:21Z"
        ],
        "updater_id": [
          1,
          null
        ]
      },
      "system_changes": {}
    },
    "sales_activity": {
      "id": 8,
      "created_at": "2019-09-25T10:15:13Z",
      "updated_at": "2019-09-25T10:17:21Z",
      "checkedin_at": null,
      "creator_id": 1,
      "end_date": "2019-09-28T04:30:00Z ",
      "import_id": null,
      "is_deleted": false,
      "latitude": null,
      "location": null,
      "longitude": null,
      "owner_id": 1,
      "remote_id": null,
      "sales_activity_outcome_id": 212,
      "sales_activity_type_id": 7,
      "start_date": "2019-09-26T04:30:00Z",
      "targetable_id": 23,
      "targetable_type": "Deal",
      "title": "Knowledge transfer meeting with Kenneth",
      "updater_id": 1
    }
  },
  "event": "onSalesActivityUpdate",
  "region": "US",
  "timestamp": 1496400354326,
  "version": "2.0"
}
```

---

>title: what are the REST APIs supported by sales activites module of Freshsales Suite
>tags: module=sales_activities, sales_activities, freshworks_crm, rest_api
>context:
>content:

# what are the REST APIs supported by sales activites module of Freshsales Suite

The Freshsales Suite Sales Account module supports following APIs:

- `POST /api/sales_activities`
- `GET /api/sales_activities/[:sales_activity_id]`
- `GET /api/sales_activities`
- `GET /api/settings/sales_activities/fields`
- `PUT /api/sales_activities/[:sales_activity_id]`
- `DELETE /api/sales_activities/[:sales_activity_id]`

---