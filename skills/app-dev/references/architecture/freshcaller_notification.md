>title: what is caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller
>context: 
>content:

# what is caller notification module in Freshcaller

Call Module Usage is allowed for An app user with a stand-alone Freshcaller subscription.

It Allows users to build:

## 1. Front-end apps
   - Cannot build a full-page app.
  
## 2. Serverless apps
   - The app reacts to app set-up events, external events, or scheduled events. 
   - The app cannot react to product-specific events such as, creating a call, updating a call, updating an agent, and so on.

## 3. Full stack SMI apps
   - The app’s serverless component reacts to app set-up events, external events, or scheduled events. 
   - The app cannot react to product-specific events.

---

>title: what are the placeholders supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller
>context: manifest.json
>content:

# what are the placeholders supported for caller notification module in Freshcaller

It supports following Module-specific placeholders. In the app manifest, configure these placeholders at `modules.caller_conversation`.

1. Notification Card as `notification_card`
2. Widget notification card as `widget_notification_card`

---

>title: how to use placeholders supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller
>context: manifest.json
>content:

# how to use placeholders supported for caller notification module in Freshcaller

To use the supported placeholder modify your `manifest.json` as below 

```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {}
    },
    "notification": {
      "location": {
        "notification_card": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        },
        "widget_notification_card": {
          "url": "myfirstapp.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller, data_method
>context: 
>content:

# what are data methods supported for caller notification module in Freshcaller

You can use the `client.data.get()` data method to retrieve the following objects regardless of the placeholders where the app is deployed:

1. `currentHost`
2. `loggedInAgent` - to retrieve information of the agent who is logged into the Freshworks product web UI or widget.
3. `currentCall` - to retrieve information of an on-going call.
4. `currentCaller` - to retrieve information of the current caller.
5. `currentNumber` - to retrieve information of the number from which an outgoing call is made.

---

>title: example of data method usage supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller
>context: 
>content:

# example of data method usage supported for caller notification module in Freshcaller

## 1. To retrieve information of an on-going call use:

```js
async function getcurrentCallData() {
  try {
    const data = await client.data.get("currentCall");
    // success operation
    //data: {currentCall: {“id": “c2937604-0a08-43c2-a09c-e77f5f565a0e”, ...}}
  } catch (error) {
    // failure operation
  }
}

getcurrentCallData();
```

## 2. To retrieve information of the current caller:

```js
async function getcurrentCallerData() {
  try {
    const data = await client.data.get("currentCaller");
    // success operation
    //data: {currentCaller: {“id": “c2937604-0a08-43c2-a09c-e77f5f565a0e”, ...}}
  } catch (error) {
    // failure operation
  }
}

getcurrentCallerData();
```

---

>title: what are interface methods supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller, interface_methods
>context: 
>content:

# what are interface methods supported for caller notification module in Freshcaller

Your app can trigger these interface actions irrespective of the placeholder where the app is deployed.

Freshcaller caller notification module supports following interface methods:

1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller, interface_methods
>context: 
>content:

# how to use interface methods supported for caller notification module in Freshcaller

## 1. To show modal use:

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

## 2. To show confirmation message use:

```js
try {
  let result = await client.interface.trigger("showConfirm", {
    title: "Confim", // plain text
    message: "Are you sure you want to save the details?" // plain text
  });
  console.log(result);
    /* "result" will be either "Save" or "Cancel" */
} catch (error) {
    // failure operation
  console.error(error);
}
```

---

>title: what are instance methods supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller, instance_methods
>context: 
>content:

# what are instance methods supported for caller notification module in Freshcaller

1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances - Use the `context()`, `send()`, `receive()`, or `get()` methods to:
   1. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   2. Send data from a modal to a parent placeholder and get the data in the parent.
   3. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance. 

## If a modal is the app instance where context() is used, it retrieves:
   1. The (modal’s) instance id
   2. The placeholder name of the app instance
   3. The instance id of the parent that opened the modal
   4. The data (if any) that was passed from the parent

## If context() is used in a parent placeholder, it retrieves:
   1. The instance id
   2. The placeholder name of the app instance

---

>title: how to use instance methods supported for caller notification module in Freshcaller
>tags: module=notification, notification, freshcaller, instance_methods
>context: 
>content:

# how to use instance methods supported for caller notification module in Freshcaller

1. To Send data from a parent placeholder to a modal and retrieve the context/data in the modal.

- In parent UI

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

- In modal UI

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

- In parent UI

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

- In modal UI

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

- In placeholder 1

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

- In placeholder 2

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

>title: what are the serverless events supported by caller notification module of Freshcaller
>tags: module=notification, notification, freshcaller, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by caller notification module of Freshcaller

An app built for this module can react to the following events.

## Common events: 
In the app manifest, configure these events at `modules.common`.

## App set-up events
1. `onAppInstall`
2. `afterAppUpdate`
3. `onAppUninstall`

## External events
1. `onAppInstall`
2. `onExternalEvent`
3. `onAppUninstall`

## Scheduled events

An app built for this module cannot react to product-specific events.

---