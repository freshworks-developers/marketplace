>title: what is caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller
>context: module
>content:

# what is caller metrics module in Freshcaller

Call Module Usage is allowed for following subscriptions:

## Subscriptions
1. A stand-alone Freshcaller subscription.
2. A Freshsales suite subscription with:
   - Freshsales Classic
   - Freshchat
   - Freshcaller.
3. A Freshsales suite subscription with:
   - with only Freshchat.
4. A Freshsales suite subscription with:
   - with only Freshcaller.
5. A Freshsales suite subscription with:
   - with only Freshsales classic.

## Allowed User Actions
It allows users to build:
1. Front-end apps however you cannot build a full-page app.
2. Serverless apps where the app reacts to app set-up events, external events, or scheduled events. The app cannot react to product-specific events such as, creating a call, updating a call, updating an agent, and so on.
3. Full stack SMI apps however the app’s serverless component reacts to app set-up events, external events, or scheduled events. The app cannot react to product-specific events.

---

>title: what are the placeholders supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller
>context: manifest.json
>content:

# what are the placeholders supported for caller metrics module in Freshcaller

It supports only one module-specific placeholder. In the app manifest, configure these placeholders at `modules.caller_metrics` named Call metrics card as `call_metrics_card`.

Example to use the supported placeholder in manifest.json

To use the supported placeholder modify your `manifest.json` as below:
```json
{
  "platform-version": "3.0",
  "modules": {
    "common": {
      "requests": {}
    },
    "caller_metrics": {
      "location": {
        "call_metrics_card": {
          "url": "call_metrics_card.html",
          "icon": "logo.svg"
        }
      }
    }
  }
}
```

---

>title: what are data methods supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, data_method
>context: modules
>content:

# what are data methods supported for caller metrics module in Freshcaller

You can use the `client.data.get()` data method to retrieve the following objects regardless of the placeholders where the app is deployed:

Data Methods
1. `currentHost`
2. `loggedInAgent` - to retrieve information of the agent who is logged into the Freshworks product web UI or widget.
3. `currentCall` - to retrieve information of an on-going call.

---

>title: example of data method usage supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller
>context: 
>content:

# example of data method usage supported for caller metrics module in Freshcaller

To retrieve information of an on-going call use:
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

---

>title: what are interface methods supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, interface_methods
>context: modules
>content:

# what are interface methods supported for caller metrics module in Freshcaller

Using interface methods an app can, on the product UI, display certain UI elements such as Modals, Confirmation boxes, and Notifications. Freshcaller caller metrics module supports the following interface methods:

## Interface Methods
1. Display modals or dialog boxes - `showModal` method and `showDialog` method
2. Display confirmation messages - `showConfirm` method
3. Display notifications - `showNotify` method, it supports `info`, `success`, `warning`, `danger` and `alert`

---

>title: how to use interface methods supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, interface_methods
>context: modules
>content:

# how to use interface methods supported for caller metrics module in Freshcaller

Usage Examples
1. To show modal:
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
2. To show confirmation message:
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
3. To display notifications use:
  ```js
  try {
    let data = await client.interface.trigger("showNotify", {
      type: "error",
      message: "This is a sample error notification."
      /* The "message" should be plain text */
    });
      console.log(data); // success message
  } catch (error) {
      // failure operation
      console.error(error);
  }
  ```

---

>title: what are instance methods supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, instance_methods
>context: modules
>content:

# what are instance methods supported for caller metrics module in Freshcaller

## Instance Methods
1. `client.instance.resize()` to resize the instance used as `client.instance.resize({ height: "<height in pixels>" });`
2. `client.instance.close()` to close the instance
3. Communicate between instances:
   a. Send data from a parent placeholder to a modal and retrieve the context/data in the modal.
   b. Send data from a modal to a parent placeholder and get the data in the parent.
   c. Send data from one instance to another instance and receive data at the destination.
4. `client.instance.context()` to retrieve contextual information about a current app instance:
   a. If a modal is the app instance where context() is used, it retrieves:
      - The (modal’s) instance id
      - The placeholder name of the app instance
      - The instance id of the parent that opened the modal
      - The data (if any) that was passed from the parent
   b. If context() is used in a parent placeholder, it retrieves:
      - The instance id
      - The placeholder name of the app instance

---

>title: how to use instance methods supported for caller metrics module in Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, instance_methods
>context: modules
>content:

# how to use instance methods supported for caller metrics module in Freshcaller

## Usage Examples
1. To send data from a parent placeholder to a modal and retrieve the context/data in the modal.
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
2. To send data from a modal to a parent placeholder and get the data in the parent.
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
3. To send data from one instance to another instance and receive data at the destination.
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

>title: what are the serverless events supported by caller metrics module of Freshcaller
>tags: module=caller_metrics, caller_metrics, freshcaller, serverless_events
>context: manifest.json
>content:

# what are the serverless events supported by caller metrics module of Freshcaller

An app built for this module can react to the following Common events: In the app manifest, configure these events at `modules.common`.

## Serverless Events
1. App set-up events
   - `onAppInstall`
   - `afterAppUpdate`
   - `onAppUninstall`
2. External events
   - `onAppInstall`
   - `onExternalEvent`
   - `onAppUninstall`
3. Scheduled events

---

>title: what are the REST APIs supported by call metrics module of Freshcaller
>tags: module=caller_metrics, call_metrics, freshcaller, rest_api
>context: modules
>content:

# what are the REST APIs supported by call metrics module of Freshcaller

The Freshcaller Call metrics module supports the following APIs:

## REST APIs
- `GET /api/v1/call_metrics`
- `GET /api/v1/calls/{call_id}/call_metrics`

---